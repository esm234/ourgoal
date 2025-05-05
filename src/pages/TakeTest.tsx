import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { testQuestions } from "@/data/testQuestions";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { TestResult } from "@/types/testResults";
import type { Option, ExtendedQuestion } from "@/types/testManagement";
import { ArrowLeft, ArrowRight, Clock, AlertCircle, HelpCircle, BookOpen, BookText, Check, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Leaderboard from "@/components/Leaderboard";

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
  const [animateTimeLeft, setAnimateTimeLeft] = useState(false);

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

  useEffect(() => {
    if (timeLeft === 300 && !showResults) { // 5 minutes warning
      toast({
        title: "تنبيه",
        description: "متبقي 5 دقائق على انتهاء الاختبار",
        variant: "destructive",
      });
      setAnimateTimeLeft(true);
      setTimeout(() => setAnimateTimeLeft(false), 1000);
    }
  }, [timeLeft, showResults]);

  useEffect(() => {
    if (timeLeft === 60 && !showResults) { // 1 minute warning
      toast({
        title: "تنبيه",
        description: "متبقي دقيقة واحدة على انتهاء الاختبار",
        variant: "destructive",
      });
      setAnimateTimeLeft(true);
      setTimeout(() => setAnimateTimeLeft(false), 1000);
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
        <div className="flex flex-col items-center justify-center min-h-[60vh]" style={{ backgroundColor: 'hsl(222, 47%, 11%)' }}>
          <div className="bg-gray-800/90 p-8 rounded-xl shadow-lg max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-500/20 text-red-400 mx-auto rounded-full flex items-center justify-center mb-4">
              <AlertCircle size={28} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">تسجيل الدخول مطلوب</h2>
            <p className="text-gray-300 mb-6">يجب تسجيل الدخول لبدء الاختبار</p>
          <Button
              className="bg-primary text-white w-full py-2 rounded-lg hover:bg-primary/90"
            onClick={() => navigate('/login')}
          >
            الذهاب لتسجيل الدخول
          </Button>
          </div>
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
          setQuestions(staticTest.questions.map(q => ({
            ...q,
            imageUrl: (q as any).imageUrl || (q as any).image_url || "",
            subtype: (q as any).subtype || "general",
            passage: (q as any).passage || null
          })) as ExtendedQuestion[]);
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
            type: question.type as "verbal" | "quantitative" | "mixed",
            subtype: (question as any).subtype as "general" | "reading_comprehension" || "general",
            passage: (question as any).passage || null,
            imageUrl: (question as any).image_url || ""
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
        subtype: q.subtype || "general",
        passage: q.passage || null,
        imageUrl: q.imageUrl || "",
        options: Array.isArray(q.options) ? q.options.map((opt: any) =>
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
        // Ensure testId is a string
        const testIdString = String(testId);

        const { data, error } = await supabase.from("exam_results").insert({
          test_id: testIdString,
          user_id: user.id,
          score: score,
          total_questions: questions.length,
          time_taken: test.duration, // Using test duration as time taken
          questions_data: result.questions // Store questions data in the database
        }).select();

        if (error) {
          console.error("Error saving result to Supabase:", error);
          throw error;
        }

        // Verify the result was saved by checking the database
        await verifyResultSaved(user.id, testIdString);

        // Show success message
        toast({
          title: "تم حفظ النتيجة",
          description: "تم حفظ نتيجة الاختبار بنجاح",
        });
      } catch (error) {
        console.error("Error saving result to database:", error);
        toast({
          title: "خطأ في حفظ النتيجة",
          description: "حدث خطأ أثناء حفظ النتيجة، يرجى المحاولة مرة أخرى",
          variant: "destructive",
        });
      }
    }
  };

  // Function to verify the result was saved
  const verifyResultSaved = async (userId: string, testIdString: string) => {
    try {
      // Wait briefly to allow the database to process the insert
      await new Promise(resolve => setTimeout(resolve, 1000));

      const { data, error } = await supabase
        .from("exam_results")
        .select("*")
        .eq("user_id", userId)
        .eq("test_id", testIdString);

      if (error) {
        console.error("Error verifying result:", error);
        return;
      }

      if (!data || data.length === 0) {
        console.warn("Verification failed: Result not found in database after saving!");
      } else {
        console.log("Verification successful: Result found in database!");
      }
    } catch (err) {
      console.error("Error during verification:", err);
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
    // التحقق من وجود إجابات لجميع الأسئلة
    const allAnswered = questions.every((_, index) => answers[index] !== undefined);
    if (!allAnswered) {
      toast({
        title: "لا يمكن إرسال الاختبار",
        description: "يوجد أسئلة لم تتم الإجابة عليها. الرجاء الإجابة على جميع الأسئلة قبل الإرسال.",
        variant: "destructive",
      });
      return;
    }

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

  const getOptionLetterByIndex = (index: number) => {
    const letters = ['أ', 'ب', 'ج', 'د', 'هـ', 'و', 'ز', 'ح'];
    return letters[index] || index.toString();
  };

  const getTypeIcon = (type: string, subtype?: string) => {
    switch (type) {
      case "verbal":
        if (subtype === "reading_comprehension") {
          return <BookText className="w-4 h-4" />;
        }
        return <BookOpen className="w-4 h-4" />;
      case "quantitative":
        return <HelpCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };





  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'hsl(222, 47%, 11%)' }}>
          <div className="bg-gray-800/80 p-8 rounded-xl shadow-lg max-w-md w-full text-center">
            <div className="w-16 h-16 bg-blue-500/20 text-blue-400 mx-auto rounded-full flex items-center justify-center mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">جاري تحميل الاختبار</h2>
            <p className="text-gray-300">يرجى الانتظار قليلاً...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!test || questions.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'hsl(222, 47%, 11%)' }}>
          <div className="bg-gray-800/80 p-8 rounded-xl shadow-lg max-w-md w-full text-center">
            <div className="w-16 h-16 bg-yellow-500/20 text-yellow-400 mx-auto rounded-full flex items-center justify-center mb-4">
              <AlertCircle size={28} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">الاختبار غير موجود</h2>
            <p className="text-gray-300 mb-6">لم نتمكن من العثور على الاختبار المطلوب</p>
            <Button
              className="bg-primary text-white w-full py-2 rounded-lg hover:bg-primary/90"
              onClick={() => navigate("/qiyas-tests")}
            >
              العودة للاختبارات
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (showResults) {
    return (
      <Layout>
        <div className="min-h-screen py-8 px-4" style={{ backgroundColor: 'hsl(222, 47%, 11%)' }}>
          <div className="container mx-auto max-w-4xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <Card className="bg-gray-800/80 border-0 shadow-xl overflow-hidden">
                  <div className="bg-primary/80 p-6 text-center">
                    <h1 className="text-3xl font-bold text-white mb-2">نتائج الاختبار</h1>
                    <p className="text-white/80">{test?.title || 'اختبار'}</p>
                  </div>
                  <CardContent className="p-6">
                    <div className="mb-8">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-gray-700/30 rounded-xl">
                        <div className="text-center md:text-right space-y-1">
                          <h2 className="text-white text-lg font-medium">النتيجة النهائية</h2>
                          <p className="text-gray-400 text-sm">إجمالي الأسئلة: {questions.length}</p>
                        </div>

                        <div className="relative w-32 h-32">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-3xl font-bold text-primary">
                              {Math.round((answers.reduce((acc, answer, index) => {
                                return acc + (answer === questions[index].correctAnswer ? 1 : 0);
                              }, 0) / questions.length) * 100)}%
                            </span>
                          </div>
                          <svg viewBox="0 0 36 36" className="-rotate-90 w-32 h-32">
                            <path
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="#444"
                              strokeWidth="3"
                              strokeDasharray="100, 100"
                            />
                            <path
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke={
                                Math.round((answers.reduce((acc, answer, index) => {
                                  return acc + (answer === questions[index].correctAnswer ? 1 : 0);
                                }, 0) / questions.length) * 100) >= 90 ? '#10b981' :
                                Math.round((answers.reduce((acc, answer, index) => {
                                  return acc + (answer === questions[index].correctAnswer ? 1 : 0);
                                }, 0) / questions.length) * 100) >= 70 ? '#3b82f6' :
                                Math.round((answers.reduce((acc, answer, index) => {
                                  return acc + (answer === questions[index].correctAnswer ? 1 : 0);
                                }, 0) / questions.length) * 100) >= 50 ? '#f59e0b' : '#ef4444'
                              }
                              strokeWidth="3"
                              strokeDasharray={`${Math.round((answers.reduce((acc, answer, index) => {
                                return acc + (answer === questions[index].correctAnswer ? 1 : 0);
                              }, 0) / questions.length) * 100)}, 100`}
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>

                        <div className="text-center md:text-left space-y-1">
                          <p className="text-white text-lg">
                            {answers.reduce((acc, answer, index) => {
                              return acc + (answer === questions[index].correctAnswer ? 1 : 0);
                            }, 0)} / {questions.length}
                          </p>
                          <p className="text-gray-400 text-sm">الإجابات الصحيحة</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 text-center">
                      <Button
                        className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg"
                        onClick={() => navigate("/qiyas-tests")}
                      >
                        العودة للاختبارات
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Leaderboard testId={testId!} />
              </div>
            </div>

            <Card className="bg-gray-800/80 border-0 shadow-xl overflow-hidden mt-6">
            <CardContent className="p-6">
              <div className="space-y-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <ClipboardIcon className="w-5 h-5 text-primary" />
                    نتائج الأسئلة
                  </h3>

                {questions.map((q, index) => {
                  const userAnswer = answers[index];
                  const isCorrect = userAnswer === q.correctAnswer;
                  return (
                      <div key={q.id || index} className={`p-6 rounded-xl border transition-all ${
                        isCorrect ? "bg-green-900/20 border-green-800/50" : "bg-red-900/20 border-red-800/50"
                      }`}>
                        <div className="flex items-start gap-3 mb-4">
                          <div className={`mt-1 w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                            isCorrect ? 'bg-green-600/30' : 'bg-red-600/30'
                          }`}>
                        {isCorrect ? (
                              <Check className="h-4 w-4 text-green-400" />
                        ) : (
                              <X className="h-4 w-4 text-red-400" />
                        )}
                      </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <Badge variant={isCorrect ? "default" : "destructive"} className="mb-2">
                                {isCorrect ? "إجابة صحيحة" : "إجابة خاطئة"}
                              </Badge>
                              <span className="text-sm text-gray-400">السؤال {index + 1}</span>
                            </div>
                            {/* Reading Passage */}
                            {q.type === "verbal" && q.subtype === "reading_comprehension" && q.passage && (
                              <div className="mb-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <BookText className="h-4 w-4 text-blue-400" />
                                  <h4 className="font-medium text-blue-400 text-sm">نص القطعة:</h4>
                                </div>
                                <div className="bg-blue-900/20 border border-blue-800/30 p-4 rounded-lg mb-4">
                                  <p className="text-white/80 text-sm leading-relaxed whitespace-pre-line">{q.passage}</p>
                                </div>
                                <Separator className="my-4 opacity-30" />
                              </div>
                            )}

                            <p className="text-white text-lg font-medium mb-4">{q.text}</p>

                            {q.imageUrl && (
                              <div className="mb-4 bg-gray-800 p-2 rounded-lg border border-gray-700">
                                <img
                                  src={q.imageUrl}
                                  alt="صورة السؤال"
                                  className="rounded max-h-60 mx-auto"
                                />
                              </div>
                            )}

                            <div className="mt-3 space-y-2">
                              {Array.isArray(q.options) && q.options.map((option: any, optIndex: number) => {
                                const optionText = getOptionText(option);
                                const isUserAnswer = optIndex === userAnswer;
                                const isCorrectAnswer = optIndex === q.correctAnswer;

                                return (
                                  <div
                                    key={optIndex}
                                    className={`p-3 border rounded-lg flex items-center gap-3 transition-all ${
                                      isUserAnswer && isCorrectAnswer ? 'bg-green-900/40 border-green-700' :
                                      isUserAnswer && !isCorrectAnswer ? 'bg-red-900/40 border-red-700' :
                                      isCorrectAnswer ? 'bg-green-900/20 border-green-700/50' :
                                      'border-gray-700 bg-gray-800/40'
                                    }`}
                                  >
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                                      isUserAnswer && isCorrectAnswer ? 'bg-green-900/70 border border-green-600 text-green-400' :
                                      isUserAnswer && !isCorrectAnswer ? 'bg-red-900/70 border border-red-600 text-red-400' :
                                      isCorrectAnswer ? 'bg-green-900/50 border border-green-600 text-green-400' :
                                      'bg-gray-800 border border-gray-600 text-gray-400'
                                    }`}>
                                      {getOptionLetterByIndex(optIndex)}
                                    </div>
                                    <span className={`text-sm ${
                                      isUserAnswer && isCorrectAnswer ? 'text-green-300 font-medium' :
                                      isUserAnswer && !isCorrectAnswer ? 'text-red-300 font-medium' :
                                      isCorrectAnswer ? 'text-green-400' :
                                      'text-gray-300'
                                    }`}>
                                      {optionText}
                                    </span>

                                    {isUserAnswer && (
                                      <div className="ml-auto">
                                        <span className="px-2 py-0.5 text-xs rounded-full bg-gray-700 text-gray-300">اختيارك</span>
                                      </div>
                                    )}

                                    {!isUserAnswer && isCorrectAnswer && (
                                      <div className="ml-auto">
                                        <span className="px-2 py-0.5 text-xs rounded-full bg-green-900/70 text-green-300">الإجابة الصحيحة</span>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            {q.explanation && !isCorrect && (
                              <div className="mt-4 p-4 bg-blue-900/20 border border-blue-800/40 rounded-lg">
                                <div className="flex items-center gap-2 mb-1">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <p className="text-sm font-medium text-blue-400">الشرح:</p>
                                </div>
                                <p className="text-sm text-gray-300">{q.explanation}</p>
                              </div>
                            )}
                          </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          </div>
        </div>
      </Layout>
    );
  }

  // Determine the number of answered questions
  const answeredQuestions = answers.filter(a => a !== undefined).length;

  return (
    <Layout>
      <div className="min-h-screen py-8 px-4" style={{ backgroundColor: 'hsl(222, 47%, 11%)' }}>
        <div className="container mx-auto max-w-4xl">
          {/* Header with test info */}
          <div className="bg-gray-800/90 rounded-xl p-4 mb-6 shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/20 rounded-lg p-2">
                  <BookOpen className="text-primary h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">{test?.title || 'اختبار'}</h1>
                  <p className="text-gray-400 text-sm">{answeredQuestions} من {questions.length} سؤال</p>
                </div>
              </div>

              <div className={`flex items-center gap-2 py-1 px-3 rounded-full ${
                timeLeft < 300 ? 'bg-red-900/30 text-red-400' : 'bg-gray-700/60 text-gray-300'
              } ${animateTimeLeft ? 'animate-pulse' : ''}`}>
                <Clock className="h-4 w-4" />
                <span className="font-mono">{formatTime(timeLeft)}</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>التقدم</span>
                <span>{Math.round((answeredQuestions / questions.length) * 100)}%</span>
              </div>
              <Progress value={(answeredQuestions / questions.length) * 100} className="h-2 bg-gray-700" />
            </div>
          </div>

          {/* Question Card */}
          <Card className="bg-gray-800/90 border-0 shadow-lg mb-6">
            <CardContent className="p-6">
              {/* Question Header */}
              <div className="flex items-center justify-between mb-6">
                <Badge variant="outline" className="bg-gray-700/60 text-sm">
                  سؤال {currentQuestion + 1} من {questions.length}
                </Badge>

                <Badge variant="outline" className={`flex items-center gap-1 ${
                  question.type === "verbal"
                    ? question.subtype === "reading_comprehension"
                      ? "bg-blue-500/20 text-blue-500 border-blue-500/20"
                      : "bg-primary/20 text-primary border-primary/20"
                    : question.type === "quantitative"
                      ? "bg-amber-500/20 text-amber-500 border-amber-500/20"
                      : "bg-primary/20 text-primary border-primary/20"
                }`}>
                  {getTypeIcon(question.type, question.subtype)}
                  <span>
                    {question.type === "verbal"
                      ? question.subtype === "reading_comprehension"
                        ? "لفظي - استيعاب المقروء"
                        : "لفظي"
                      : question.type === "quantitative"
                        ? "كمي"
                        : "مختلط"}
                  </span>
                </Badge>
              </div>

              {/* Question Content */}
              <div className="mb-8">
                {/* Reading Passage for Reading Comprehension */}
                {question.type === "verbal" && question.subtype === "reading_comprehension" && question.passage && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <BookText className="h-5 w-5 text-blue-500" />
                      <h3 className="font-medium text-blue-400">نص القطعة:</h3>
                    </div>
                    <div className="bg-blue-900/20 border border-blue-800/30 p-4 rounded-lg mb-6">
                      <p className="text-white/90 text-base leading-relaxed whitespace-pre-line">{question.passage}</p>
                    </div>
                    <Separator className="my-4 opacity-30" />
                    <div className="flex items-center gap-2 mb-2">
                      <HelpCircle className="h-5 w-5 text-primary" />
                      <h3 className="font-medium text-primary">السؤال:</h3>
                    </div>
                  </div>
                )}

                {/* Question Image */}
                {question.imageUrl ? (
                  <div className="mb-4">
                    <div className="bg-gray-900/80 p-3 rounded-xl border border-gray-700">
                      <img
                        src={question.imageUrl}
                        alt="صورة السؤال"
                        className="rounded-lg max-h-72 mx-auto"
                      />
                    </div>
                    <h2 className="text-xl font-semibold text-white mt-4 rtl">{question.text}</h2>
                  </div>
                ) : (
                  <h2 className="text-xl font-semibold text-white rtl mb-4">{question.text}</h2>
                )}
              </div>

              {/* Options */}
              <div className="space-y-3">
                {Array.isArray(question.options) && question.options.map((option: any, index: number) => {
                  const optionText = typeof option === 'string'
                      ? option
                      : 'text' in option
                        ? option.text
                      : '';

                  return (
                    <button
                      key={index}
                      className={`w-full p-4 rounded-xl rtl flex items-center gap-3 transition-all ${
                        answers[currentQuestion] === index
                          ? 'bg-primary/20 border-2 border-primary/50 text-white'
                          : 'bg-gray-700/50 border border-gray-700 hover:bg-gray-700/80 text-gray-200'
                      }`}
                      onClick={() => handleAnswer(index)}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        answers[currentQuestion] === index
                          ? 'bg-primary/30 border-2 border-primary/70 text-white'
                          : 'bg-gray-700 border border-gray-600 text-gray-300'
                      }`}>
                        {getOptionLetterByIndex(index)}
                      </div>
                      <span className="flex-1 text-right">{optionText}</span>
                      {answers[currentQuestion] === index && (
                        <div className="ml-2">
                          <Check className="h-5 w-5 text-primary" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between mb-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              className="bg-gray-800/70 border-gray-700 text-gray-200 hover:bg-gray-700"
              >
              <ArrowRight className="ml-2 rtl:rotate-180" size={16} />
                السابق
              </Button>

              {currentQuestion === questions.length - 1 ? (
                  <Button
                    onClick={handleSubmit}
                className="bg-primary hover:bg-primary/90 text-white"
                    disabled={answers.length !== questions.length}
                  >
                <Check className="ml-2" size={16} />
                    إنهاء الاختبار
                  </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                  التالي
                <ArrowLeft className="mr-2 rtl:rotate-180" size={16} />
                </Button>
              )}
          </div>

          {/* Question Navigation */}
          <div className="bg-gray-800/90 rounded-xl p-4 shadow-lg">
            <h3 className="text-white font-medium mb-3 text-center">تنقل بين الأسئلة</h3>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-all ${
                    currentQuestion === index
                      ? 'bg-primary text-white'
                      : answers[index] !== undefined
                        ? 'bg-green-900/40 text-green-300 border border-green-700/50'
                        : 'bg-gray-700/60 text-gray-300 border border-gray-600/50'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const ClipboardIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
  </svg>
);

export default TakeTest;

