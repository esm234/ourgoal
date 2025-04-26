
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { testQuestions } from "@/data/testQuestions";
import { useToast } from "@/components/ui/use-toast";

const TakeTest = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const test = testQuestions.find(t => t.testId === testId);

  if (!test) {
    return (
      <Layout>
        <div className="container mx-auto py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">الاختبار غير موجود</h1>
          <Button onClick={() => navigate("/qiyas-tests")}>العودة للاختبارات</Button>
        </div>
      </Layout>
    );
  }

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);

    if (currentQuestion < test.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate score
      const correctAnswers = newAnswers.reduce((acc, answer, index) => {
        return acc + (answer === test.questions[index].correctAnswer ? 1 : 0);
      }, 0);
      const score = Math.round((correctAnswers / test.questions.length) * 100);

      toast({
        title: "تم إنهاء الاختبار",
        description: `حصلت على ${score}% (${correctAnswers} من ${test.questions.length})`,
      });
      
      navigate("/qiyas-tests");
    }
  };

  const question = test.questions[currentQuestion];

  return (
    <Layout>
      <div className="container mx-auto py-16">
        <Card className="max-w-3xl mx-auto">
          <CardContent className="p-6">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-muted-foreground">
                  السؤال {currentQuestion + 1} من {test.questions.length}
                </span>
                <span className="text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                  {question.type === "verbal" ? "لفظي" : "كمي"}
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
                    {option}
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
