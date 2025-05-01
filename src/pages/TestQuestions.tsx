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
  const { isLoggedIn, role } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("questions-list");
  const [test, setTest] = useState<Test | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (role !== "admin") {
      navigate("/");
      return;
    }

    if (testId) {
      fetchTestDetails();
      fetchQuestions();
    }
  }, [isLoggedIn, role, testId, navigate]);

  // Early return if not authenticated
  if (!isLoggedIn || role !== "admin") {
    return null;
  }

  const fetchTestDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("tests")
        .select("*")
        .eq("id", testId)
        .single();

      if (error) throw error;

      if (data) {
        const formattedTest: Test = {
          ...data,
          category: data.category as 'sample' | 'user'
        };
        setTest(formattedTest);
      }
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
              subtype: question.subtype as "general" | "reading_comprehension" || "general",
              passage: question.passage || null,
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

  const handleCreateQuestion = async (data: CreateQuestionForm, action?: 'add_another' | 'return') => {
    try {
      console.log("Creating question with data:", data);

      // Get the next order number
      const nextOrder = questions.length > 0
        ? Math.max(...questions.map(q => q.question_order)) + 1
        : 1;

      // Prepare question data
      const questionData = {
        test_id: testId,
        text: data.text,
        type: data.type,
        subtype: data.subtype || "general", // Always include the subtype
        explanation: data.explanation || null,
        question_order: nextOrder,
        image_url: data.image_url || null,
      };

      // Add passage for reading comprehension questions
      if (data.type === "verbal" && data.subtype === "reading_comprehension") {
        questionData["passage"] = data.passage;
      }

      // Insert the question first
      console.log("Sending question data to database:", questionData);
      const { data: insertedQuestion, error: questionError } = await supabase
        .from("questions")
        .insert(questionData)
        .select();

      if (questionError) throw questionError;

      console.log("Inserted question:", insertedQuestion);

      if (!insertedQuestion || insertedQuestion.length === 0) {
        throw new Error("لم يتم إنشاء السؤال بشكل صحيح");
      }

      const questionId = insertedQuestion[0].id;

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
        description: action === 'add_another' ? "يمكنك إضافة سؤال آخر الآن" : undefined,
      });

      // Refresh the questions list
      fetchQuestions();

      // Only navigate back to the list if explicitly requested
      if (action === 'return') {
        setActiveTab("questions-list");
      }
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

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setActiveTab("add-question");
  };

  const handleUpdateQuestion = async (data: CreateQuestionForm, action?: 'add_another' | 'return') => {
    if (!editingQuestion) return;

    try {
      // Prepare question data for update
      const questionData = {
        text: data.text,
        type: data.type,
        subtype: data.subtype || "general", // Always include the subtype
        explanation: data.explanation || null,
        image_url: data.image_url || null,
      };

      // Add passage for reading comprehension questions
      if (data.type === "verbal" && data.subtype === "reading_comprehension") {
        questionData["passage"] = data.passage;
      }

      // Update the question
      const { error: questionError } = await supabase
        .from("questions")
        .update(questionData)
        .eq("id", editingQuestion.id);

      if (questionError) throw questionError;

      // Delete existing options
      const { error: deleteOptionsError } = await supabase
        .from("options")
        .delete()
        .eq("question_id", editingQuestion.id);

      if (deleteOptionsError) throw deleteOptionsError;

      // Insert new options
      const optionsToInsert = data.options.map((option, index) => ({
        question_id: editingQuestion.id,
        text: option.text,
        is_correct: option.is_correct,
        option_order: index + 1,
      }));

      const { error: optionsError } = await supabase
        .from("options")
        .insert(optionsToInsert);

      if (optionsError) throw optionsError;

      toast({
        title: "تم تحديث السؤال بنجاح",
        description: action === 'add_another' ? "يمكنك إضافة سؤال آخر الآن" : undefined,
      });

      // Refresh the questions list
      fetchQuestions();

      // Reset editing state
      setEditingQuestion(null);

      // Handle navigation based on action
      if (action === 'add_another') {
        // Stay on the form to add another question
        setActiveTab("add-question");
      } else if (action === 'return' || !action) {
        // Return to the list by default or when explicitly requested
        setActiveTab("questions-list");
      }
    } catch (error: any) {
      toast({
        title: "خطأ في تحديث السؤال",
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

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="questions-list">قائمة الأسئلة</TabsTrigger>
            <TabsTrigger value="add-question">
              {editingQuestion ? "تعديل السؤال" : "إضافة سؤال جديد"}
            </TabsTrigger>
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
                  onEdit={handleEditQuestion}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add-question">
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingQuestion ? "تعديل السؤال" : "إضافة سؤال جديد"}
                </CardTitle>
                <CardDescription>
                  {editingQuestion
                    ? "تعديل تفاصيل السؤال والإجابات المحتملة"
                    : "أدخل تفاصيل السؤال والإجابات المحتملة"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <QuestionForm
                  onSubmit={editingQuestion ? handleUpdateQuestion : handleCreateQuestion}
                  defaultValues={editingQuestion ? {
                    mode: editingQuestion.image_url ? "image" : "text",
                    text: editingQuestion.text,
                    type: editingQuestion.type,
                    subtype: editingQuestion.subtype || "general",
                    passage: editingQuestion.passage || "",
                    explanation: editingQuestion.explanation || "",
                    image_url: editingQuestion.image_url || "",
                    options: editingQuestion.options.map(opt => ({
                      text: typeof opt === 'string' ? opt : opt.text,
                      is_correct: typeof opt === 'string' ? false : opt.is_correct,
                    })),
                  } : undefined}
                  isEdit={!!editingQuestion}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </Layout>
  );
};

export default TestQuestions;
