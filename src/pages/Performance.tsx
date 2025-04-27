import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, ArrowRight } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { TestResult } from "@/types/testResults";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { testQuestions } from "@/data/testQuestions";
import mockTests from "@/pages/QiyasTests";

const Performance = () => {
  const { isLoggedIn, user } = useAuth();
  const { toast } = useToast();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoggedIn && user) {
      fetchTestResults();
    } else {
      // If not logged in, only show localStorage results
      const localResults = JSON.parse(localStorage.getItem('testResults') || '[]');
      setTestResults(localResults);
      setLoading(false);
    }
  }, [isLoggedIn, user]);

  const fetchTestResults = async () => {
    try {
      // Get results from database
      const { data: dbResults, error } = await supabase
        .from("exam_results")
        .select(`
          *,
          tests (
            title,
            type
          )
        `)
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Get results from localStorage
      const localResults = JSON.parse(localStorage.getItem('testResults') || '[]');

      // Combine and format results
      const formattedResults = [
        ...dbResults.map(result => ({
          testId: result.test_id,
          score: result.score,
          correctAnswers: result.correct_answers || 0,
          totalQuestions: result.total_questions,
          date: result.created_at,
          type: result.tests?.type || 'mixed',
          title: result.tests?.title || 'اختبار'
        })),
        ...localResults
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setTestResults(formattedResults);
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

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">جاري تحميل النتائج...</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-primary">سجل الأداء</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              عرض جميع نتائج الاختبارات السابقة
            </p>
          </div>

          <div className="flex justify-center">
            {testResults.length === 0 ? (
              <Card className="w-full max-w-4xl">
                <CardContent className="p-6 text-center">
                  <p className="text-xl mb-4">لا توجد نتائج اختبارات سابقة</p>
                  <Button asChild>
                    <Link to="/qiyas-tests" className="flex items-center">
                      ابدأ اختبار جديد
                      <ArrowRight className="mr-2" size={16} />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="w-full max-w-4xl">
                <CardContent className="p-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">التاريخ والوقت</TableHead>
                        <TableHead className="text-right">الاختبار</TableHead>
                        <TableHead className="text-right">نوع الاختبار</TableHead>
                        <TableHead className="text-right">النتيجة</TableHead>
                        <TableHead className="text-right">الإجابات الصحيحة</TableHead>
                        <TableHead className="text-right">التفاصيل</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {testResults.map((result, index) => {
                        // Prefer Supabase joined title if available
                        let testName = result.tests?.title && result.tests?.title !== 'اختبار' ? result.tests.title : '';
                        if (!testName && result.title && result.title !== 'اختبار') {
                          testName = result.title;
                        }
                        if (!testName && result.testId) {
                          // Try mockTests
                          const mock = (typeof mockTests !== 'undefined' && Array.isArray(mockTests)) ? mockTests.find(t => t.id === result.testId) : null;
                          if (mock) testName = mock.title;
                        }
                        if (!testName && result.testId) {
                          // Try testQuestions
                          const mockQ = testQuestions.find(t => t.testId === result.testId);
                          if (mockQ) testName = `اختبار تجريبي ${result.testId.replace('test-', '')}`;
                        }
                        if (!testName && result.testId) {
                          testName = `اختبار ${result.testId}`;
                        }
                        return (
                          <TableRow key={index}>
                            <TableCell className="text-right">{formatDate(result.date)}</TableCell>
                            <TableCell className="text-right">{testName}</TableCell>
                            <TableCell>
                              {result.type === 'verbal' ? 'لفظي' : 
                               result.type === 'quantitative' ? 'كمي' : 'مختلط'}
                            </TableCell>
                            <TableCell>{result.score}%</TableCell>
                            <TableCell>
                              {result.correctAnswers} من {result.totalQuestions}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                              >
                                <Link to={`/test-results/${result.testId}/${result.date}`}>
                                  عرض التفاصيل
                                </Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
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
