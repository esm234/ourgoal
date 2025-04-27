
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
import type { Question, Option } from "@/types/testManagement";

interface ExtendedQuestion extends Question {
  correctAnswer?: number;
  options: (Option | string)[];
}

const TakeTest = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoggedIn, user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  
  const [test, setTest] = useState<any | null>(null);
  const [questions, setQuestions] = useState<ExtendedQuestion[]>([]);
  const [loading, setLoading] = useState(true);

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

  const saveTestResult = async (score: number, correctAnswers: number) => {
    const result: TestResult = {
      testId: testId!,
      score,
      correctAnswers,
      totalQuestions: questions.length,
      date: new Date().toISOString(),
      type: 'mixed'
    };

    // Save to localStorage for backward compatibility
    const existingResults = JSON.parse(localStorage.getItem('testResults') || '[]');
    localStorage.setItem('testResults', JSON.stringify([...existingResults, result]));

    // If user is logged in, also save to database
    if (isLoggedIn && user) {
      try {
        await supabase.from("exam_results").insert({
          test_id: testId,
          user_id: user.id,
          score: score,
          total_questions: questions.length,
          time_taken: test.duration // Using test duration as time taken
        });
      } catch (error) {
        console.error("Error saving result to database:", error);
      }
    }
  };

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate score
      const correctAnswers = newAnswers.reduce((acc, answer, index) => {
        const question = questions[index];
        if (typeof question.correctAnswer === 'number') {
          return acc + (answer === question.correctAnswer ? 1 : 0);
        }
        return acc;
      }, 0);
      const score = Math.round((correctAnswers / questions.length) * 100);

      // Save test result
      saveTestResult(score, correctAnswers);

      toast({
        title: "تم إنهاء الاختبار",
        description: `حصلت على ${score}% (${correctAnswers} من ${questions.length})`,
      });
      
      navigate("/performance");
    }
  };

  const question = questions[currentQuestion];

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
                <span className="text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                  {question.type === "verbal" ? "لفظي" : question.type === "quantitative" ? "كمي" : "مختلط"}
                </span>
              </div>
              <h2 className="text-xl font-semibold mb-6">{question.text}</h2>
              <div className="space-y-4">
                {question.options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-right h-auto py-4 px-6"
                    onClick={() => handleAnswer(index)}
                  >
                    {typeof option === 'string' ? option : option.text}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default TakeTest;
