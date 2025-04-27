import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, ArrowRight } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { TestResult } from "@/types/test";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { getExamResults } from "@/integrations/supabase/examResults";

const Performance = () => {
  const { isLoggedIn, user } = useAuth();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoggedIn && user) {
      fetchTestResults();
    } else {
      // Fallback to localStorage for backward compatibility
      const localResults = JSON.parse(localStorage.getItem('testResults') || '[]');
      setTestResults(localResults);
      setLoading(false);
    }
  }, [isLoggedIn, user]);

  const fetchTestResults = async () => {
    try {
      const results = await getExamResults();
      setTestResults(results);
    } catch (error) {
      console.error("Error fetching test results:", error);
      // Fallback to localStorage if database fetch fails
      const localResults = JSON.parse(localStorage.getItem('testResults') || '[]');
      setTestResults(localResults);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | number) => {
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
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center">
              <p className="text-lg">جاري تحميل النتائج...</p>
            </div>
          </div>
        </section>
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
                      {testResults.map((result, index) => {
                        const correctAnswers = result.questions.filter(q => q.isCorrect).length;
                        return (
                          <TableRow key={index}>
                            <TableCell className="text-right">
                              {formatDate(result.timestamp || new Date())}
                            </TableCell>
                            <TableCell>
                              {result.type === 'verbal' ? 'لفظي' : 
                               result.type === 'quantitative' ? 'كمي' : 'مختلط'}
                            </TableCell>
                            <TableCell>{result.score}%</TableCell>
                            <TableCell>
                              {correctAnswers} من {result.totalQuestions}
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
                                        <p>{formatDate(result.timestamp || new Date())}</p>
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
                                      <p>عدد الإجابات الصحيحة: {correctAnswers} من {result.totalQuestions}</p>
                                      <p>نسبة النجاح: {result.score}%</p>
                                    </div>
                                    <div className="border-t pt-4 mt-4">
                                      <p className="font-semibold mb-4">تفاصيل الأسئلة:</p>
                                      <div className="space-y-6">
                                        {result.questions.map((question, qIndex) => (
                                          <div 
                                            key={question.questionId} 
                                            className={`p-4 rounded-lg ${question.isCorrect ? 'bg-green-50' : 'bg-red-50'}`}
                                          >
                                            <div className="flex items-center justify-between mb-2">
                                              <span className="font-semibold text-black">السؤال {qIndex + 1}</span>
                                              <Badge variant={question.isCorrect ? "success" : "destructive"}>
                                                {question.isCorrect ? "إجابة صحيحة" : "إجابة خاطئة"}
                                              </Badge>
                                            </div>
                                            <div className="space-y-2">
                                              <p className="font-semibold text-black">إجابتك:</p>
                                              <p className="text-black">{question.userAnswer}</p>
                                              <p className="font-semibold text-black mt-2">الوقت المستغرق:</p>
                                              <p className="text-black">{Math.round(question.timeTaken)} ثانية</p>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
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
