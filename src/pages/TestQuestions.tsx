
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import QuestionList from "@/components/test-management/QuestionList";
import QuestionForm from "@/components/test-management/QuestionForm";
import { Test, Question, CreateQuestionForm } from "@/types/testManagement";

const TestQuestions = () => {
  const { testId } = useParams();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("questions-list");
  const [test, setTest] = useState<Test | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (testId) {
      fetchTestDetails();
      fetchQuestions();
    }
  }, [isLoggedIn, testId]);

  const fetchTestDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("tests")
        .select("*")
        .eq("id", testId)
        .single();

      if (error) throw error;
      setTest(data);
    } catch (error: any) {
      toast({
        title: "خطأ في جلب تفاصيل الاختبار",
        description: error.message,
        variant: "destructive",
      });
      navigate("/test-management");
    }
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      // Fetch questions with options
      const { data: questionsData, error: questionsError } = await supabase
        .from("questions")
        .select("*")
        .eq("test_id", testId)
        .order("question_order", { ascending: true });

      if (questionsError) throw questionsError;

      if (questionsData) {
        // For each question, fetch its options
        const questionsWithOptions = await Promise.all(
          questionsData.map(async (question) => {
            const { data: optionsData, error: optionsError } = await supabase
              .from("options")
              .select("*")
              .eq("question_id", question.id)
              .order("option_order", { ascending: true });

            if (optionsError) throw optionsError;

            return {
              ...question,
              type: question.type as "verbal" | "quantitative" | "mixed",
              options: optionsData || [],
            } as Question;
          })
        );

        setQuestions(questionsWithOptions as Question[]);
      }
    } catch (error: any) {
      toast({
        title: "خطأ في جلب الأسئلة",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuestion = async (data: CreateQuestionForm) => {
    try {
      // Get the next order number
      const nextOrder = questions.length > 0 
        ? Math.max(...questions.map(q => q.question_order)) + 1 
        : 1;

      // Insert the question first
      const { data: questionData, error: questionError } = await supabase
        .from("questions")
        .insert({
          test_id: testId,
          text: data.text,
          type: data.type,
          explanation: data.explanation || null,
          question_order: nextOrder,
        })
        .select();

      if (questionError) throw questionError;

      if (!questionData || questionData.length === 0) {
        throw new Error("لم يتم إنشاء السؤال بشكل صحيح");
      }

      const questionId = questionData[0].id;

      // Then insert all options for this question
      const optionsToInsert = data.options.map((option, index) => ({
        question_id: questionId,
        text: option.text,
        is_correct: option.is_correct,
        option_order: index + 1,
      }));

      const { error: optionsError } = await supabase
        .from("options")
        .insert(optionsToInsert);

      if (optionsError) throw optionsError;

      toast({
        title: "تم إضافة السؤال بنجاح",
      });

      fetchQuestions();
      setActiveTab("questions-list");
    } catch (error: any) {
      toast({
        title: "خطأ في إضافة السؤال",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      const { error } = await supabase
        .from("questions")
        .delete()
        .eq("id", questionId);

      if (error) throw error;

      toast({
        title: "تم حذف السؤال بنجاح",
      });

      fetchQuestions();
    } catch (error: any) {
      toast({
        title: "خطأ في حذف السؤال",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <section className="container mx-auto py-16 px-4">
        <div className="mb-8">
          <Button variant="outline" asChild className="mb-6">
            <Link to="/test-management">
              <ArrowLeft className="h-4 w-4 mr-1" />
              العودة إلى قائمة الاختبارات
            </Link>
          </Button>
          <h1 className="text-3xl font-bold mb-2">{test?.title}</h1>
          <p className="text-muted-foreground">{test?.description}</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="questions-list">قائمة الأسئلة</TabsTrigger>
            <TabsTrigger value="add-question">إضافة سؤال جديد</TabsTrigger>
          </TabsList>

          <TabsContent value="questions-list">
            <Card>
              <CardHeader>
                <CardTitle>أسئلة الاختبار</CardTitle>
                <CardDescription>
                  {questions.length > 0
                    ? `عدد الأسئلة: ${questions.length}`
                    : "لا توجد أسئلة بعد"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <QuestionList
                  questions={questions}
                  loading={loading}
                  onDelete={handleDeleteQuestion}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add-question">
            <Card>
              <CardHeader>
                <CardTitle>إضافة سؤال جديد</CardTitle>
                <CardDescription>أدخل تفاصيل السؤال والإجابات المحتملة</CardDescription>
              </CardHeader>
              <CardContent>
                <QuestionForm onSubmit={handleCreateQuestion} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </Layout>
  );
};

export default TestQuestions;
