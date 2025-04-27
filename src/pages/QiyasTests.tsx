import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Plus, PenLine, Trash } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { testQuestions } from "@/data/testQuestions";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface TestType {
  id: string;
  title: string;
  description: string;
  numberOfQuestions: number;
  duration: number; // in minutes
}

const mockTests: TestType[] = [
  {
    id: "test-1",
    title: "اختبار قياس تجريبي #1",
    description: "اختبار مختلط (لفظي وكمي) يحاكي اختبار القدرات العامة",
    numberOfQuestions: 50,
    duration: 75,
  },
  {
    id: "test-2",
    title: "اختبار قياس تجريبي #2",
    description: "اختبار مختلط (لفظي وكمي) مع تركيز على الأسئلة اللفظية",
    numberOfQuestions: 50,
    duration: 75,
  },
  {
    id: "test-3",
    title: "اختبار قياس تجريبي #3",
    description: "اختبار مختلط (لفظي وكمي) مع تركيز على الأسئلة الكمية",
    numberOfQuestions: 50,
    duration: 75,
  },
  {
    id: "test-4",
    title: "اختبار قياس قصير #1",
    description: "اختبار سريع لتقييم مستواك الحالي",
    numberOfQuestions: 20,
    duration: 30,
  },
  {
    id: "test-5",
    title: "اختبار قياس قصير #2",
    description: "اختبار سريع للتدرب على الأسئلة الأكثر صعوبة",
    numberOfQuestions: 20,
    duration: 30,
  },
  {
    id: "test-6",
    title: "اختبار قياس كامل",
    description: "اختبار شامل يحاكي الاختبار الحقيقي بالكامل",
    numberOfQuestions: 100,
    duration: 150,
  },
];

const QiyasTests = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoggedIn, role } = useAuth();
  const [userTests, setUserTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("sample-tests");
  const [tests, setTests] = useState<TestType[]>([]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserTests();
    }
    fetchTests();
  }, [isLoggedIn]);

  const fetchUserTests = async () => {
    setLoading(true);
    try {
      // Get published tests created by users
      const { data, error } = await supabase
        .from("tests")
        .select("*, questions(*)")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Map tests to include question count
      const testsWithQuestionCount = data.map(test => ({
        ...test,
        numberOfQuestions: test.questions?.length || 0
      }));

      setUserTests(testsWithQuestionCount);
    } catch (error) {
      console.error("Error fetching user tests:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("tests")
        .select("*")
        .eq("is_sample", true)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      setTests(data || []);
    } catch (error: any) {
      toast({
        title: "خطأ في جلب الاختبارات",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = (testId: string) => {
    const testData = testQuestions.find(test => test.testId === testId);
    
    if (testData) {
      navigate(`/qiyas-tests/${testId}`);
    } else {
      toast({
        title: "قريباً",
        description: "سيتم إطلاق هذا الاختبار التجريبي قريباً",
      });
    }
  };

  const handleEditTest = (testId: string) => {
    navigate(`/test-management/${testId}/edit`);
  };

  const handleDeleteTest = async (testId: string) => {
    try {
      const { error } = await supabase
        .from("tests")
        .delete()
        .eq("id", testId)
        .eq("is_sample", true);

      if (error) throw error;
      
      toast({
        title: "تم حذف الاختبار بنجاح",
      });
      
      fetchTests();
    } catch (error: any) {
      toast({
        title: "خطأ في حذف الاختبار",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">اختبارات قياس التجريبية</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              تدرب على اختبارات تحاكي اختبار القدرات العامة بقسميه اللفظي والكمي
            </p>
          </div>

          {isLoggedIn && role === "admin" && (
            <div className="mb-8 text-center">
              <Link to="/test-management">
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="mr-2" size={16} />
                  إنشاء اختبارات خاصة بك
                </Button>
              </Link>
            </div>
          )}

          <Tabs 
            defaultValue="sample-tests"
            value={activeTab} 
            onValueChange={setActiveTab}
            className="max-w-3xl mx-auto mb-8"
          >
            <TabsList className="grid grid-cols-2 w-[400px] mx-auto">
              <TabsTrigger value="sample-tests">اختبارات نموذجية</TabsTrigger>
              <TabsTrigger value="user-tests">اختبارات المستخدمين</TabsTrigger>
            </TabsList>

            <TabsContent value="sample-tests">
              <div className="grid gap-6">
                {tests.map((test) => (
                  <Card key={test.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{test.title}</CardTitle>
                          <CardDescription>{test.description}</CardDescription>
                        </div>
                        {isLoggedIn && role === "admin" && (
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditTest(test.id)}
                            >
                              <PenLine className="h-4 w-4 mr-1" />
                              تعديل
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteTest(test.id)}
                            >
                              <Trash className="h-4 w-4 mr-1" />
                              حذف
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>عدد الأسئلة: {test.numberOfQuestions}</span>
                        <span>المدة: {test.duration} دقيقة</span>
                      </div>
                      <div className="mt-4">
                        <Button asChild className="w-full">
                          <Link to={`/take-test/${test.id}`}>بدء الاختبار</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="user-tests">
              {loading ? (
                <div className="text-center py-10">
                  <p>جاري تحميل الاختبارات...</p>
                </div>
              ) : userTests.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {userTests.map((test) => (
                    <Card key={test.id} className="overflow-hidden border-2 border-border bg-secondary hover:border-primary transition-colors">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold mb-2">{test.title}</h3>
                        <p className="text-muted-foreground mb-4">{test.description}</p>
                        <div className="flex justify-between text-sm text-muted-foreground mb-6">
                          <span className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 ml-1 text-primary"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {test.numberOfQuestions} سؤال
                          </span>
                          <span className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 ml-1 text-primary"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {test.duration} دقيقة
                          </span>
                        </div>
                        <Button
                          className="w-full bg-primary hover:bg-primary/90 flex items-center justify-center"
                          onClick={() => navigate(`/qiyas-tests/${test.id}`)}
                        >
                          ابدأ الاختبار
                          <ArrowRight className="mr-2" size={16} />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground mb-4">لا توجد اختبارات منشورة من المستخدمين حتى الآن</p>
                  {isLoggedIn && role === "admin" ? (
                    <Link to="/test-management">
                      <Button className="bg-primary hover:bg-primary/90">
                        <Plus className="mr-2" size={16} />
                        كن أول من ينشئ اختباراً
                      </Button>
                    </Link>
                  ) : isLoggedIn ? (
                    <p>يمكن للمشرفين فقط إنشاء اختبارات جديدة</p>
                  ) : (
                    <Link to="/login">
                      <Button className="bg-primary hover:bg-primary/90">
                        تسجيل الدخول
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default QiyasTests;
