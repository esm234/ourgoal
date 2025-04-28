import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { TestResult } from "@/types/testResults";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const Performance = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (isLoggedIn && user) {
      fetchUserResults();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn, user]);

  const fetchUserResults = async () => {
    try {
      setLoading(true);
      console.log("Fetching results for user:", user?.id);
      
      // Use type assertion to handle additional fields
      type ExamResultWithData = {
        id: string;
        user_id: string;
        test_id: string;
        score: number;
        total_questions: number;
        time_taken: number;
        created_at: string;
        questions_data: any[];
        test_type?: string;
      };

      // First try with exam_results table
      let { data, error } = await supabase
        .from("exam_results")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });

      console.log("Query response from exam_results:", { data, error });

      // If there's an error, try with test_results table instead
      if (error) {
        console.log("Error with exam_results, trying test_results instead");
        
        const testResultsResponse = await supabase
          .from("test_results")
          .select("*")
          .eq("user_id", user!.id)
          .order("created_at", { ascending: false });
          
        console.log("Query response from test_results:", testResultsResponse);
        
        if (!testResultsResponse.error) {
          data = testResultsResponse.data;
          error = null;
        } else {
          console.error("Both tables failed:", { 
            examResultsError: error, 
            testResultsError: testResultsResponse.error 
          });
        }
      }

      if (error) throw error;
      
      if (!data || data.length === 0) {
        console.log("No results found in either table");
        setTestResults([]);
        return;
      }

      // Transform database results to match TestResult type
      const formattedResults: TestResult[] = (data as ExamResultWithData[]).map(result => ({
        testId: result.test_id,
        score: result.score,
        correctAnswers: result.questions_data?.filter(
          (q: any) => q.userAnswer === q.correctAnswer
        ).length || 0,
        totalQuestions: result.total_questions,
        date: result.created_at,
        type: (result.test_type as "verbal" | "quantitative" | "mixed") || 'mixed',
        questions: result.questions_data || []
      }));

      console.log("Formatted results:", formattedResults);
      setTestResults(formattedResults);
    } catch (error: any) {
      console.error("Error fetching results:", error);
      toast({
        title: "خطأ في تحميل النتائج",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-SA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  // Restrict access to signed-in users only
  if (!isLoggedIn) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <p className="text-xl mb-4">يجب تسجيل الدخول لعرض سجل أدائك</p>
          <Button
            className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded"
            onClick={() => navigate('/login')}
          >
            الذهاب لتسجيل الدخول
          </Button>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <p className="text-xl mb-4">جاري تحميل نتائج الاختبارات...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">لوحة الأداء</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              تتبع تقدمك وأدائك في اختبارات قياس التجريبية
            </p>
          </div>

          {/* Debug Panel - Only visible in development */}
          {process.env.NODE_ENV === 'development' && (
            <Card className="w-full max-w-4xl mx-auto mb-8 bg-yellow-50">
              <CardContent className="p-4">
                <h3 className="font-bold mb-2">Debug Info:</h3>
                <p>User ID: {user?.id || 'Not logged in'}</p>
                <p>Loading: {loading ? 'Yes' : 'No'}</p>
                <p>Results Count: {testResults.length}</p>
                <details>
                  <summary className="cursor-pointer">Raw Results</summary>
                  <pre className="text-xs mt-2 bg-black text-white p-2 rounded overflow-auto max-h-60">
                    {JSON.stringify(testResults, null, 2)}
                  </pre>
                </details>
                <div className="mt-4 flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => fetchUserResults()}
                  >
                    Refresh Data
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={async () => {
                      try {
                        // Create a sample test result
                        const sampleResult = {
                          test_id: "test-1",
                          user_id: user!.id,
                          score: 85,
                          total_questions: 10,
                          time_taken: 30,
                          questions_data: [
                            {
                              id: "q1",
                              text: "سؤال تجريبي 1",
                              type: "verbal",
                              options: ["خيار 1", "خيار 2", "خيار 3", "خيار 4"],
                              correctAnswer: 1,
                              userAnswer: 1,
                              explanation: "شرح للإجابة"
                            }
                          ],
                          created_at: new Date().toISOString()
                        };
                        
                        // Try both tables
                        let insertResult;
                        try {
                          insertResult = await supabase
                            .from("exam_results")
                            .insert(sampleResult);
                            
                          if (insertResult.error) {
                            console.log("Error inserting to exam_results, trying test_results");
                            insertResult = await supabase
                              .from("test_results")
                              .insert(sampleResult);
                          }
                        } catch (err) {
                          console.error("Error inserting sample:", err);
                        }
                        
                        console.log("Insert result:", insertResult);
                        
                        if (insertResult?.error) {
                          toast({
                            title: "خطأ في إنشاء العينة",
                            description: insertResult.error.message,
                            variant: "destructive",
                          });
                        } else {
                          toast({
                            title: "تم إنشاء عينة اختبار",
                            description: "تم إضافة نتيجة اختبار تجريبي بنجاح",
                            variant: "default",
                          });
                          // Refresh after creating sample
                          setTimeout(() => fetchUserResults(), 500);
                        }
                      } catch (error: any) {
                        console.error("Error creating sample:", error);
                        toast({
                          title: "خطأ",
                          description: error.message,
                          variant: "destructive",
                        });
                      }
                    }}
                  >
                    Create Test Sample
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-center">
            {testResults.length === 0 ? (
              <Card className="w-full max-w-2xl border-2 border-border bg-secondary">
                <CardContent className="p-10 text-center">
                  <div className="mb-6">
                    <BarChart className="h-24 w-24 text-muted-foreground mx-auto" />
                  </div>
                  <h2 className="text-2xl font-bold mb-3">لا توجد بيانات بعد</h2>
                  <p className="text-muted-foreground mb-8">
                    لم تقم بإجراء أي اختبار تجريبي حتى الآن. ابدأ اختباراً الآن لتتبع أدائك وتحسين مستواك.
                  </p>
                  <Link to="/qiyas-tests">
                    <Button className="bg-primary hover:bg-primary/90 text-white flex items-center mx-auto">
                      ابدأ الاختبارات الآن
                      <ArrowRight className="mr-2" size={16} />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <Card className="w-full max-w-4xl">
                <CardContent className="p-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">التاريخ والوقت</TableHead>
                        <TableHead className="text-right">نوع الاختبار</TableHead>
                        <TableHead className="text-right">النتيجة</TableHead>
                        <TableHead className="text-right">الإجابات الصحيحة</TableHead>
                        <TableHead className="text-right">التفاصيل</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {testResults.map((result, index) => (
                        <React.Fragment key={index}>
                          <TableRow>
                            <TableCell className="text-right">{formatDate(result.date)}</TableCell>
                            <TableCell>
                              {result.type === 'verbal' ? 'لفظي' : 
                               result.type === 'quantitative' ? 'كمي' : 'مختلط'}
                            </TableCell>
                            <TableCell>{result.score}%</TableCell>
                            <TableCell>
                              {result.correctAnswers} من {result.totalQuestions}
                            </TableCell>
                            <TableCell>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    عرض التفاصيل
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>تفاصيل الاختبار</DialogTitle>
                                  </DialogHeader>
                                  <div className="mt-4">
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                      <div>
                                        <p className="font-semibold">التاريخ:</p>
                                        <p>{formatDate(result.date)}</p>
                                      </div>
                                      <div>
                                        <p className="font-semibold">نوع الاختبار:</p>
                                        <p>{result.type === 'verbal' ? 'لفظي' : 
                                            result.type === 'quantitative' ? 'كمي' : 'مختلط'}</p>
                                      </div>
                                      <div>
                                        <p className="font-semibold">النتيجة:</p>
                                        <p>{result.score}%</p>
                                      </div>
                                    </div>
                                    <div className="border-t pt-4">
                                      <p className="font-semibold mb-2">ملخص الإجابات:</p>
                                      <p>عدد الإجابات الصحيحة: {result.correctAnswers} من {result.totalQuestions}</p>
                                      <p>نسبة النجاح: {result.score}%</p>
                                    </div>
                                    <div className="border-t pt-4 mt-4">
                                      <p className="font-semibold mb-4">تفاصيل الأسئلة:</p>
                                      <div className="space-y-6">
                                        {result.questions?.map((question, qIndex) => {
                                          const isCorrect = question.userAnswer === question.correctAnswer;
                                          return (
                                            <div 
                                              key={question.id} 
                                              className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}
                                            >
                                              <div className="flex items-center justify-between mb-2">
                                                <span className="font-semibold text-black">السؤال {qIndex + 1}</span>
                                                <Badge variant={isCorrect ? "default" : "destructive"}>
                                                  {isCorrect ? "إجابة صحيحة" : "إجابة خاطئة"}
                                                </Badge>
                                              </div>
                                              <p className="mb-2 text-black">{question.text}</p>
                                              <div className="space-y-2">
                                                <p className="font-semibold text-black">إجابتك:</p>
                                                <p className="text-black">{question.options[question.userAnswer]}</p>
                                                {!isCorrect && (
                                                  <>
                                                    <p className="font-semibold text-black">الإجابة الصحيحة:</p>
                                                    <p className="text-black">{question.options[question.correctAnswer]}</p>
                                                    {question.explanation && (
                                                      <>
                                                        <p className="font-semibold text-black">الشرح:</p>
                                                        <p className="text-black">{question.explanation}</p>
                                                      </>
                                                    )}
                                                  </>
                                                )}
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Performance;
