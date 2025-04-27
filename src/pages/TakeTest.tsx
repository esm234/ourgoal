import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { testQuestions } from "@/data/testQuestions";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { TestResult } from "@/types/testResults";
import type { Question, Option, ExtendedQuestion } from "@/types/testManagement";
import { ArrowLeft, ArrowRight, Check, Timer } from "lucide-react";

const TakeTest = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoggedIn, user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [test, setTest] = useState<any | null>(null);
  const [questions, setQuestions] = useState<ExtendedQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (test?.duration) {
      setTimeLeft(test.duration * 60); // Convert minutes to seconds
    }
  }, [test]);

  useEffect(() => {
    if (timeLeft > 0 && !showResults) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmit(); // Auto-submit when time runs out
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft, showResults]);

  // Add a warning when time is running low
  useEffect(() => {
    if (timeLeft === 300 && !showResults) { // 5 minutes warning
      toast({
        title: "تنبيه",
        description: "متبقي 5 دقائق على انتهاء الاختبار",
        variant: "destructive",
      });
    }
  }, [timeLeft, showResults]);

  // Add a final warning when time is very low
  useEffect(() => {
    if (timeLeft === 60 && !showResults) { // 1 minute warning
      toast({
        title: "تنبيه",
        description: "متبقي دقيقة واحدة على انتهاء الاختبار",
        variant: "destructive",
      });
    }
  }, [timeLeft, showResults]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Restrict access to signed-in users only
  if (!isLoggedIn) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <p className="text-xl mb-4">يجب تسجيل الدخول لبدء الاختبار</p>
          <Button
            className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/90"
            onClick={() => navigate('/login')}
          >
            الذهاب لتسجيل الدخول
          </Button>
        </div>
      </Layout>
    );
  }

  useEffect(() => {
    if (testId) {
      fetchTestWithQuestions();
    }
  }, [testId]);

  const fetchTestWithQuestions = async () => {
    setLoading(true);
    try {
      // First, get the test details
      const { data: testData, error: testError } = await supabase
        .from("tests")
        .select("*")
        .eq("id", testId)
        .single();

      if (testError) {
        // If not found in database, try the local static data
        const staticTest = testQuestions.find(t => t.testId === testId);
        if (staticTest) {
          setTest({
            ...staticTest,
            id: staticTest.testId,
            title: `اختبار تجريبي ${staticTest.testId}`
          });
          setQuestions(staticTest.questions as unknown as ExtendedQuestion[]);
          setLoading(false);
          return;
        } else {
          throw testError;
        }
      }

      setTest(testData);
      
      // Then, get the questions for this test
      const { data: questionsData, error: questionsError } = await supabase
        .from("questions")
        .select("*")
        .eq("test_id", testId)
        .order("question_order", { ascending: true });

      if (questionsError) throw questionsError;

      // For each question, fetch its options
      const questionsWithOptions = await Promise.all(
        questionsData.map(async (question) => {
          const { data: optionsData, error: optionsError } = await supabase
            .from("options")
            .select("*")
            .eq("question_id", question.id)
            .order("option_order", { ascending: true });

          if (optionsError) throw optionsError;

          // Find the correct answer index
          const correctIndex = optionsData.findIndex(opt => opt.is_correct);

          return {
            ...question,
            options: optionsData.map(opt => opt.text),
            correctAnswer: correctIndex,
            type: question.type as "verbal" | "quantitative" | "mixed"
          } as ExtendedQuestion;
        })
      );

      setQuestions(questionsWithOptions);
    } catch (error: any) {
      console.error("Error fetching test:", error);
      toast({
        title: "خطأ في تحميل الاختبار",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveTestResult = async (score: number, correctAnswers: number) => {
    const result: TestResult = {
      testId: testId!,
      score,
      correctAnswers,
      totalQuestions: questions.length,
      date: new Date().toISOString(),
      type: 'mixed',
      questions: questions.map((q, index) => ({
        id: q.id,
        text: q.text,
        type: q.type,
        options: Array.isArray(q.options) ? q.options.map(opt => 
          typeof opt === 'string' ? opt : 'text' in opt ? opt.text : ''
        ) : [],
        correctAnswer: q.correctAnswer || 0,
        userAnswer: answers[index],
        explanation: q.explanation || undefined
      }))
    };

    // Save to localStorage for backward compatibility
    const existingResults = JSON.parse(localStorage.getItem('testResults') || '[]');
    localStorage.setItem('testResults', JSON.stringify([...existingResults, result]));

    // If user is logged in, also save to database
    if (isLoggedIn && user) {
      try {
        // First, get the user's profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;

        // Save to exam_results
        const { error: examError } = await supabase.from("exam_results").insert({
          test_id: testId,
          user_id: user.id,
          score: score,
          total_questions: questions.length,
          time_taken: test.duration,
          questions_data: result.questions
        });

        if (examError) throw examError;

        // Save to leaderboard
        const { error: leaderboardError } = await supabase.from("leaderboard").insert({
          user_id: user.id,
          test_id: testId,
          score: score,
          total_questions: questions.length,
          time_taken: test.duration,
          user_name: profileData?.full_name || user.email?.split('@')[0] || 'مستخدم',
          user_email: user.email
        });

        if (leaderboardError) throw leaderboardError;

      } catch (error) {
        console.error("Error saving result to database:", error);
      }
    }
  };

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    // Calculate score
    const correctAnswers = answers.reduce((acc, answer, index) => {
      const question = questions[index];
      if (typeof question.correctAnswer === 'number') {
        return acc + (answer === question.correctAnswer ? 1 : 0);
      }
      return acc;
    }, 0);
    const score = Math.round((correctAnswers / questions.length) * 100);

    // Save test result
    saveTestResult(score, correctAnswers);

    // Show results
    setShowResults(true);
  };

  const question = questions[currentQuestion];

  const getOptionText = (option: string | Option | { text: string }) => {
    if (typeof option === 'string') return option;
    if ('text' in option) return option.text;
    return '';
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">جاري تحميل الاختبار...</h1>
        </div>
      </Layout>
    );
  }

  if (!test || questions.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">الاختبار غير موجود</h1>
          <Button onClick={() => navigate("/qiyas-tests")}>العودة للاختبارات</Button>
        </div>
      </Layout>
    );
  }

  if (showResults) {
    return (
      <Layout>
        <div className="container mx-auto py-16">
          <Card className="max-w-3xl mx-auto">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-6 text-center">نتائج الاختبار</h2>
              <div className="space-y-6">
                {questions.map((q, index) => {
                  const userAnswer = answers[index];
                  const isCorrect = userAnswer === q.correctAnswer;
                  return (
                    <div key={q.id} className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-black">السؤال {index + 1}</span>
                        {isCorrect ? (
                          <span className="text-green-600">إجابة صحيحة</span>
                        ) : (
                          <span className="text-red-600">إجابة خاطئة</span>
                        )}
                      </div>
                      {q.image_url ? (
                        <img
                          src={q.image_url}
                          alt="صورة السؤال"
                          className="mb-2 max-h-40 rounded border"
                        />
                      ) : (
                        <p className="mb-2 text-black">{q.text}</p>
                      )}
                      <div className="space-y-2">
                        <p className="font-semibold text-black">إجابتك:</p>
                        <p className="text-black">{getOptionText(q.options[userAnswer])}</p>
                        {!isCorrect && (
                          <>
                            <p className="font-semibold text-black">الإجابة الصحيحة:</p>
                            <p className="text-black">{getOptionText(q.options[q.correctAnswer!])}</p>
                            {q.explanation && (
                              <>
                                <p className="font-semibold text-black">الشرح:</p>
                                <p className="text-black">{q.explanation}</p>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-8 text-center">
                <Button onClick={() => navigate("/qiyas-tests")}>
                  العودة للاختبارات
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-16">
        <Card className="max-w-3xl mx-auto">
          <CardContent className="p-6">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-muted-foreground">
                  السؤال {currentQuestion + 1} من {questions.length}
                </span>
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                    {question.type === "verbal" ? "لفظي" : question.type === "quantitative" ? "كمي" : "مختلط"}
                  </span>
                  <span className={`font-semibold ${timeLeft < 300 ? 'text-red-500' : 'text-muted-foreground'}`}>
                    الوقت المتبقي: {formatTime(timeLeft)}
                  </span>
                </div>
              </div>
              {/* Question prompt: show image if available, otherwise text */}
              {question.image_url ? (
                <img
                  src={question.image_url}
                  alt="صورة السؤال"
                  className="mb-6 max-h-64 mx-auto rounded border"
                />
              ) : (
                <h2 className="text-xl font-semibold mb-6">{question.text}</h2>
              )}
              <div className="space-y-4">
                {Array.isArray(question.options) && question.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={answers[currentQuestion] === index ? "default" : "outline"}
                    className="w-full justify-start text-right h-auto py-4 px-6"
                    onClick={() => handleAnswer(index)}
                  >
                    {typeof option === 'string' 
                      ? option 
                      : 'text' in option 
                        ? option.text 
                        : ''}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                <ArrowLeft className="mr-2" size={16} />
                السابق
              </Button>
              {currentQuestion === questions.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={answers.length !== questions.length}
                >
                  <Check className="mr-2" size={16} />
                  إنهاء الاختبار
                </Button>
              ) : (
                <Button onClick={handleNext}>
                  التالي
                  <ArrowRight className="mr-2" size={16} />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default TakeTest;
