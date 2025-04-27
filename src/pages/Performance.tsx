import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { TestResult } from "@/types/testResults";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import Leaderboard from "@/components/Leaderboard";

const Performance = () => {
  const testResults: TestResult[] = JSON.parse(localStorage.getItem('testResults') || '[]');
  const [expandedResult, setExpandedResult] = useState<number | null>(null);

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

  const getTestName = (testId: string) => {
    // Map test IDs to their names
    const testNames: { [key: string]: string } = {
      'test-1': 'اختبار قياس تجريبي #1',
      'test-2': 'اختبار قياس تجريبي #2',
      'test-3': 'اختبار قياس تجريبي #3',
      'test-4': 'اختبار قياس قصير #1',
      'test-5': 'اختبار قياس قصير #2',
      'test-6': 'اختبار قياس كامل',
    };
    return testNames[testId] || `اختبار ${testId}`;
  };

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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {testResults.length === 0 ? (
                <Card className="w-full border-2 border-border bg-secondary">
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
                <Card className="w-full">
                  <CardContent className="p-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-right">التاريخ والوقت</TableHead>
                          <TableHead className="text-right">اسم الاختبار</TableHead>
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
                              <TableCell className="text-right">{getTestName(result.testId)}</TableCell>
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
                                          <p className="font-semibold">اسم الاختبار:</p>
                                          <p>{getTestName(result.testId)}</p>
                                        </div>
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
                                                  <Badge variant={isCorrect ? "success" : "destructive"}>
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
            <div className="lg:col-span-1">
              <Leaderboard />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Performance;
