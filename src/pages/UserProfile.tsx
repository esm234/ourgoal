import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const mockTestHistory = [
  {
    id: 1,
    date: "2024-06-01T15:30:00Z",
    type: "لفظي",
    score: 85,
    correctAnswers: 17,
    totalQuestions: 20,
    details: [
      { id: 1, text: "سؤال 1", userAnswer: "أ", correctAnswer: "أ", options: ["أ", "ب", "ج", "د"] },
      { id: 2, text: "سؤال 2", userAnswer: "ب", correctAnswer: "ج", options: ["أ", "ب", "ج", "د"], explanation: "الإجابة الصحيحة هي ج لأن..." },
    ],
  },
  {
    id: 2,
    date: "2024-05-20T18:00:00Z",
    type: "كمي",
    score: 70,
    correctAnswers: 14,
    totalQuestions: 20,
    details: [
      { id: 1, text: "سؤال 1", userAnswer: "د", correctAnswer: "د", options: ["أ", "ب", "ج", "د"] },
    ],
  },
];

const UserProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const userId = user?.id || '';
  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', userId)
        .single();
  
      if (!error && data) {
        setUsername(data.username);
      }
    };
    fetchProfile();
  }, [userId]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEditProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ username })
        .eq('id', userId);

      if (error) throw error;

      toast({ title: "تم تحديث الملف الشخصي بنجاح" });
      setEditMode(false);
    } catch (error: any) {
      toast({
        title: "خطأ في التحديث",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ar-SA", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  };

  const [testHistory, setTestHistory] = useState(() => {
    try {
      const stored = localStorage.getItem('testResults');
      let history = stored ? JSON.parse(stored) : [];
      history = history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      return history;
    } catch {
      return [];
    }
  });

  const handleDeleteTest = (index: number) => {
    const updatedHistory = testHistory.filter((_, i) => i !== index);
    setTestHistory(updatedHistory);
    localStorage.setItem('testResults', JSON.stringify(updatedHistory));
  };

  // إحصائيات وهمية
  const stats = [
    { label: "عدد الاختبارات", value: testHistory.length },
    { label: "أعلى نتيجة", value: testHistory.length > 0 ? Math.max(...testHistory.map(t => t.score)) + "%" : "0%" },
    { label: "نسبة النجاح", value: testHistory.length > 0 ? Math.round(testHistory.reduce((acc, t) => acc + t.score, 0) / testHistory.length) + "%" : "0%" },
  ];

  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-start py-12 px-4" style={{ backgroundColor: 'hsl(222, 47%, 11%)' }}>
        <div className="w-full max-w-3xl">
          {/* معلومات المستخدم + الإحصائيات */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            {/* معلومات المستخدم */}
            <Card className="flex-1 shadow-lg min-w-[260px]">
              <CardHeader>
                <CardTitle className="text-right">معلومات المستخدم</CardTitle>
                <CardDescription className="text-right">بيانات الحساب</CardDescription>
              </CardHeader>
              <CardContent>
                {editMode ? (
                  <form onSubmit={handleEditProfile} className="space-y-4 text-right">
                    <label className="block font-semibold">الاسم</label>
                    <Input
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      placeholder="أدخل اسمك"
                      dir="rtl"
                    />
                    <div className="flex gap-2 justify-end">
                      <Button type="submit" disabled={isSubmitting} className="bg-primary">
                        {isSubmitting ? "جاري الحفظ..." : "حفظ"}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setEditMode(false)}>
                        إلغاء
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="flex flex-col items-end gap-2">
                    <div>
                      <span className="font-semibold">الاسم: </span>
                      <span>{username || "اسم المستخدم"}</span>
                    </div>
                    <Button variant="outline" onClick={() => setEditMode(true)}>
                      تعديل الملف الشخصي
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            {/* إحصائيات */}
            <div className="flex-1 flex flex-col gap-4 justify-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map((stat, idx) => (
                  <Card key={idx} className="shadow-md border-2 border-primary/30 bg-white/70 text-center">
                    <CardContent className="py-6 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-primary mb-2">{stat.value}</span>
                      <span className="text-md font-semibold text-gray-700">{stat.label}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* سجل الاختبارات */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-right">سجل الاختبارات</CardTitle>
              <CardDescription className="text-right">نتائج الاختبارات السابقة</CardDescription>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => {
                  setTestHistory([]);
                  localStorage.removeItem('testResults');
                }}
                className="float-left"
              >
                حذف الكل
              </Button>
            </CardHeader>
            <CardContent>
              {testHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">لا يوجد سجل اختبارات بعد</div>
              ) : (
                <table className="w-full text-right border border-gray-200 rounded-lg overflow-hidden">
                  <thead className="bg-gradient-to-l from-primary/10 to-secondary/10">
                    <tr>
                      <th className="py-2 px-4">التاريخ</th>
                      <th className="py-2 px-4">نوع الاختبار</th>
                      <th className="py-2 px-4">النتيجة</th>
                      <th className="py-2 px-4">الإجابات الصحيحة</th>
                      <th className="py-2 px-4">التفاصيل</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testHistory.map((test, idx) => (
                      <tr key={test.id || idx} className="border-b">
                        <td className="py-2 px-4">{formatDate(test.date)}</td>
                        <td className="py-2 px-4">{test.type}</td>
                        <td className="py-2 px-4">{test.score}%</td>
                        <td className="py-2 px-4">{test.correctAnswers || (test.questions ? test.questions.filter(q => q.userAnswer === q.correctAnswer).length : 0)} من {test.totalQuestions || (test.questions ? test.questions.length : 0)}</td>
                        <td className="py-2 px-4">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">عرض التفاصيل</Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>تفاصيل الاختبار</DialogTitle>
                              </DialogHeader>
                              <div className="mt-4">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                  <div>
                                    <p className="font-semibold">التاريخ:</p>
                                    <p>{formatDate(test.date)}</p>
                                  </div>
                                  <div>
                                    <p className="font-semibold">نوع الاختبار:</p>
                                    <p>{test.type}</p>
                                  </div>
                                  <div>
                                    <p className="font-semibold">النتيجة:</p>
                                    <p>{test.score}%</p>
                                  </div>
                                </div>
                                <div className="border-t pt-4">
                                  <p className="font-semibold mb-2">ملخص الإجابات:</p>
                                  <p>عدد الإجابات الصحيحة: {test.correctAnswers || (test.questions ? test.questions.filter(q => q.userAnswer === q.correctAnswer).length : 0)} من {test.totalQuestions || (test.questions ? test.questions.length : 0)}</p>
                                  <p>نسبة النجاح: {test.score}%</p>
                                </div>
                                <div className="border-t pt-4 mt-4">
                                  <p className="font-semibold mb-4">تفاصيل الأسئلة:</p>
                                  <div className="space-y-6">
                                    {(test.details || test.questions || []).map((question, qIdx) => {
                                      const isCorrect = question.userAnswer === question.correctAnswer;
                                      return (
                                        <div key={question.id || qIdx} className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                                          <div className="flex items-center justify-between mb-2">
                                            <span className="font-semibold text-black">السؤال {qIdx + 1}</span>
                                            <span className={`px-2 py-1 rounded text-xs ${isCorrect ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>{isCorrect ? "إجابة صحيحة" : "إجابة خاطئة"}</span>
                                          </div>
                                          <p className="mb-2 text-black">{question.text}</p>
                                          <div className="space-y-2">
                                            <p className="font-semibold text-black">إجابتك:</p>
                                            <p className="text-black">{question.options && question.options[question.userAnswer]}</p>
                                            {!isCorrect && (
                                              <>
                                                <p className="font-semibold text-black">الإجابة الصحيحة:</p>
                                                <p className="text-black">{question.options && question.options[question.correctAnswer]}</p>
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
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;


const renderQuestionDetails = (question) => {
  return (
    <div className="question-details">
      <p>{question.text}</p>
      {question.imageUrl && (
        <img src={question.imageUrl} alt="Question Image" className="question-image" />
      )}
    </div>
  );
};

// Usage example
// {questions.map((question) => renderQuestionDetails(question))}
