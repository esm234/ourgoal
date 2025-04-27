import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { ExtendedQuestion } from "@/types/testManagement";
import { ArrowLeft, Check, X } from "lucide-react";

const TestResults = () => {
  const { testId, date } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoggedIn, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [test, setTest] = useState<any | null>(null);
  const [questions, setQuestions] = useState<ExtendedQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);

  useEffect(() => {
    if (testId && date) {
      fetchTestResults();
    }
  }, [testId, date]);

  const fetchTestResults = async () => {
    setLoading(true);
    try {
      // Get test details
      const { data: testData, error: testError } = await supabase
        .from("tests")
        .select("*")
        .eq("id", testId)
        .single();

      if (testError) throw testError;
      setTest(testData);

      // Get user's answers
      const { data: resultData, error: resultError } = await supabase
        .from("exam_results")
        .select("*")
        .eq("test_id", testId)
        .eq("user_id", user?.id)
        .eq("created_at", date)
        .single();

      if (resultError) throw resultError;

      // Get questions with options
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
      setUserAnswers(resultData.answers || []);
    } catch (error: any) {
      console.error("Error fetching test results:", error);
      toast({
        title: "خطأ في جلب النتائج",
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
          <h1 className="text-2xl font-bold mb-4">جاري تحميل النتائج...</h1>
        </div>
      </Layout>
    );
  }

  if (!test || questions.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">النتائج غير متوفرة</h1>
          <Button onClick={() => navigate("/performance")}>العودة لسجل الأداء</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-16">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-8">
              <Button
                variant="outline"
                onClick={() => navigate("/performance")}
                className="flex items-center"
              >
                <ArrowLeft className="mr-2" size={16} />
                العودة لسجل الأداء
              </Button>
              <h1 className="text-2xl font-bold text-center flex-1">{test.title}</h1>
            </div>

            <div className="space-y-8">
              {questions.map((question, index) => {
                const userAnswer = userAnswers[index];
                const isCorrect = userAnswer === question.correctAnswer;
                return (
                  <div
                    key={question.id}
                    className={`p-6 rounded-lg border-2 ${
                      isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-semibold">السؤال {index + 1}</span>
                      {isCorrect ? (
                        <span className="text-green-600 flex items-center">
                          <Check className="mr-1" size={16} />
                          إجابة صحيحة
                        </span>
                      ) : (
                        <span className="text-red-600 flex items-center">
                          <X className="mr-1" size={16} />
                          إجابة خاطئة
                        </span>
                      )}
                    </div>

                    {question.image_url ? (
                      <img
                        src={question.image_url}
                        alt="صورة السؤال"
                        className="mb-4 max-h-48 mx-auto rounded border"
                      />
                    ) : (
                      <p className="mb-4 text-lg">{question.text}</p>
                    )}

                    <div className="space-y-2">
                      <p className="font-semibold">إجابتك:</p>
                      <p className={`p-2 rounded ${
                        isCorrect ? "bg-green-100" : "bg-red-100"
                      }`}>
                        {question.options[userAnswer]}
                      </p>

                      {!isCorrect && (
                        <>
                          <p className="font-semibold mt-4">الإجابة الصحيحة:</p>
                          <p className="p-2 rounded bg-green-100">
                            {question.options[question.correctAnswer!]}
                          </p>
                        </>
                      )}

                      {question.explanation && (
                        <>
                          <p className="font-semibold mt-4">الشرح:</p>
                          <p className="p-2 rounded bg-gray-100">
                            {question.explanation}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default TestResults; 
