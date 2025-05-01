import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { BookText } from "lucide-react";

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
      {
        id: 2,
        text: "ما هو الاستنتاج الصحيح من النص؟",
        userAnswer: "ب",
        correctAnswer: "ج",
        options: ["الحفاظ على البيئة مسؤولية الحكومات فقط", "التطور الصناعي لا يؤثر على البيئة", "الحفاظ على البيئة مسؤولية الجميع", "لا توجد حلول لمشكلات البيئة"],
        explanation: "الإجابة الصحيحة هي ج لأن النص يشير بوضوح إلى أن الجميع يجب أن يساهم في الحفاظ على البيئة",
        passage: "تعتبر البيئة من أهم الموارد الطبيعية التي يجب الحفاظ عليها. فهي المصدر الأساسي للغذاء والماء والهواء النقي. وقد أدى التطور الصناعي والتكنولوجي إلى تدهور البيئة بشكل كبير، مما أدى إلى ظهور العديد من المشكلات البيئية مثل التلوث وتغير المناخ وانقراض الكائنات الحية. لذلك، يجب على الجميع المساهمة في الحفاظ على البيئة من خلال ترشيد استهلاك الموارد الطبيعية وإعادة التدوير والتقليل من استخدام المواد الضارة بالبيئة."
      },
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
      {
        id: 2,
        text: "ما هي الفكرة الرئيسية للنص؟",
        userAnswer: "أ",
        correctAnswer: "ب",
        options: ["التطور التكنولوجي", "أهمية القراءة", "تاريخ الكتب", "مستقبل التعليم"],
        explanation: "الإجابة الصحيحة هي ب لأن النص يتحدث عن أهمية القراءة ودورها في التطور الفكري",
        passage: "القراءة هي مفتاح المعرفة والتطور الفكري. فمن خلال القراءة يمكن للإنسان أن يتعرف على ثقافات وحضارات مختلفة، ويطور مهاراته اللغوية والفكرية. وقد أثبتت الدراسات أن الأشخاص الذين يقرؤون بانتظام يتمتعون بقدرات ذهنية أفضل ومستوى ثقافي أعلى. لذلك، يجب تشجيع الأطفال منذ الصغر على القراءة وجعلها عادة يومية."
      }
    ],
  },
];

const UserProfile = () => {
  const { user, isLoggedIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const userId = user?.id || '';
  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState('');

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  // If not logged in, don't render anything
  if (!isLoggedIn) {
    return null;
  }

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
  const [originalUsername, setOriginalUsername] = useState('');

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
      setOriginalUsername(username);
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

  const handleCancelEdit = () => {
    // Restore the original username
    setUsername(originalUsername);
    setEditMode(false);
  };

  // Store the original username when entering edit mode
  const startEditing = () => {
    setOriginalUsername(username);
    setEditMode(true);
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

  // Use mock data for testing
  const [testHistory, setTestHistory] = useState(() => {
    try {
      const stored = localStorage.getItem('testResults');
      let history = stored ? JSON.parse(stored) : mockTestHistory;
      history = history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      return history;
    } catch {
      return mockTestHistory;
    }
  });

  const handleDeleteTest = (index: number) => {
    const updatedHistory = testHistory.filter((_, i) => i !== index);
    setTestHistory(updatedHistory);
    localStorage.setItem('testResults', JSON.stringify(updatedHistory));
  };

  // إحصائيات
  const stats = [
    { label: "عدد الاختبارات", value: testHistory.length },
    { label: "أعلى نتيجة", value: testHistory.length > 0 ? Math.max(...testHistory.map(t => t.score)) + "%" : "0%" },
    { label: "نسبة النجاح", value: testHistory.length > 0 ? Math.round(testHistory.reduce((acc, t) => acc + t.score, 0) / testHistory.length) + "%" : "0%" },
  ];

  // Add this new function to generate colors based on username
  const getUserColors = (name: string) => {
    if (!name || name.length === 0) {
      return {
        primary: 'hsl(215, 70%, 50%)',
        secondary: 'hsl(245, 70%, 50%)',
        text: 'white'
      };
    }

    // Generate a consistent hash code from the name
    const hash = name.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    // Generate hue values using the hash for a consistent color
    const h1 = Math.abs(hash % 360);
    const h2 = (h1 + 40) % 360; // Add offset for second color

    return {
      primary: `hsl(${h1}, 85%, 45%)`,
      secondary: `hsl(${h2}, 85%, 40%)`,
      text: 'white' // Could be black for light colors, but keeping simple
    };
  };

  const getInitials = (name: string) => {
    if (!name) return "؟";
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  // Add a helper function to convert numeric indices to Arabic letters
  const getAnswerLetter = (index: string | number) => {
    const idx = typeof index === 'string' ? parseInt(index) : index;
    switch(idx) {
      case 0: return "أ";
      case 1: return "ب";
      case 2: return "ج";
      case 3: return "د";
      default: return index;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow py-8 px-4" style={{ backgroundColor: 'hsl(222, 47%, 11%)' }}>
        <div className="container mx-auto max-w-6xl">

          {/* Header - Profile Overview */}
          <div className="w-full rounded-xl bg-gray-800/80 shadow-md p-6 mb-8 border border-gray-700/50">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              {/* Avatar */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div
                    className="w-24 h-24 rounded-full overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${getUserColors(username).primary}, ${getUserColors(username).secondary})`,
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    <div className="w-full h-full flex items-center justify-center relative">
                      <div className="absolute inset-0 opacity-20">
                        {/* Pattern overlay - subtle dots */}
                        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                          <defs>
                            <pattern id="dotPattern" width="10" height="10" patternUnits="userSpaceOnUse">
                              <circle cx="2" cy="2" r="1" fill="white" />
                            </pattern>
                          </defs>
                          <rect width="100%" height="100%" fill="url(#dotPattern)" />
                        </svg>
                      </div>
                      <span className="text-3xl font-bold" style={{ color: getUserColors(username).text }}>
                        {getInitials(username)}
                      </span>
                    </div>
                  </div>
                  <div
                    className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center bg-primary border-2 border-gray-800"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>

                {!editMode && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={startEditing}
                  >
                    تعديل الملف الشخصي
                  </Button>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-right">
                {editMode ? (
                  <form onSubmit={handleEditProfile} className="space-y-4 max-w-md mx-auto md:mr-0">
                    <label className="block font-semibold text-right text-white">الاسم</label>
                    <Input
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      placeholder="أدخل اسمك"
                      dir="rtl"
                      className="mb-4 bg-gray-700/70 border-gray-600"
                    />
                    <div className="flex gap-2 justify-center md:justify-end">
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "جاري الحفظ..." : "حفظ"}
                      </Button>
                      <Button type="button" variant="outline" onClick={handleCancelEdit}>
                        إلغاء
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-white">{username || "اسم المستخدم"}</h1>
                    <p className="text-gray-300">{user?.email}</p>
                  </div>
                )}
              </div>

              {/* Stats Preview */}
              <div className="hidden lg:flex gap-8 items-center">
                {stats.map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <p className="text-3xl font-bold text-primary">{stat.value}</p>
                    <p className="text-sm text-gray-300">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Cards (Mobile & Tablet) */}
          <div className="lg:hidden grid grid-cols-3 gap-4 mb-8">
            {stats.map((stat, idx) => (
              <Card key={idx} className="shadow-sm border border-gray-700/30 bg-gray-800/70 text-center">
                <CardContent className="py-6 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-primary mb-1">{stat.value}</span>
                  <span className="text-xs font-medium text-gray-600">{stat.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content */}
          <Tabs defaultValue="history" dir="rtl" className="w-full mb-8">
            <TabsList className="w-full mb-6 bg-gray-800/80">
              <TabsTrigger value="history" className="flex-1">سجل الاختبارات</TabsTrigger>
              <TabsTrigger value="stats" className="flex-1">الإحصائيات</TabsTrigger>
            </TabsList>

            {/* Test History Tab */}
            <TabsContent value="history" className="mt-0">
              <Card className="shadow-md border-0 bg-gray-800/80">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-xl text-right text-white">سجل الاختبارات</CardTitle>
                    <CardDescription className="text-right text-gray-300">نتائج الاختبارات السابقة</CardDescription>
                  </div>

                  {testHistory.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setTestHistory([]);
                  localStorage.removeItem('testResults');
                }}
              >
                حذف الكل
              </Button>
                  )}
            </CardHeader>

                <CardContent>
              {testHistory.length === 0 ? (
                    <div className="text-center py-16 px-4">
                      <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-white">لا يوجد سجل اختبارات بعد</h3>
                      <p className="text-gray-400 mt-2">ستظهر نتائج اختباراتك هنا بعد إكمال اختبار واحد على الأقل</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                    {testHistory.map((test, idx) => (
                        <div key={test.id || idx} className="bg-gray-700/50 rounded-xl p-4">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-1 text-right">
                              <div className="flex items-center gap-2 justify-end">
                                <h3 className="font-medium text-white">{test.type || "اختبار"}</h3>
                                <Badge variant={test.score >= 70 ? "default" : "outline"} className="mr-2">
                                  {test.score}%
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-400">{formatDate(test.date)}</p>
                            </div>

                            <div className="flex items-center gap-2 justify-end md:justify-start">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">عرض التفاصيل</Button>
                            </DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0 bg-gray-900 border border-gray-700/50 shadow-xl">
                                  <div className="sticky top-0 z-10 bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700/50 shadow-md">
                                    <DialogHeader className="py-4 px-6">
                                      <div className="flex items-center justify-between">
                                        <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                          </svg>
                                          <span>تفاصيل الاختبار</span>
                                        </DialogTitle>
                                        <Badge variant={test.score >= 70 ? "default" : "destructive"} className="px-3 py-1 text-sm">
                                          {test.score}%
                                        </Badge>
                                      </div>
                                    </DialogHeader>

                                    {/* Progress bar */}
                                    <div className="w-full bg-gray-800/80 h-1">
                                      <div
                                        className={`h-1 ${
                                          test.score >= 90 ? 'bg-green-500' :
                                          test.score >= 70 ? 'bg-primary' :
                                          test.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                        }`}
                                        style={{ width: `${test.score}%` }}
                                      ></div>
                                    </div>
                                  </div>

                                  <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">

                                  {/* Test Summary */}
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                    {/* Test Info Card */}
                                    <div className="bg-gray-800/60 rounded-xl border border-gray-700/50 shadow-md overflow-hidden">
                                      <div className="bg-gray-800/80 px-4 py-3 border-b border-gray-700/50">
                                        <h3 className="text-sm font-medium text-gray-300 flex items-center gap-1.5">
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                          </svg>
                                          معلومات الاختبار
                                        </h3>
                                      </div>
                                      <div className="p-4 space-y-3">
                                        <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                          </div>
                                          <div>
                                            <p className="text-xs text-gray-400">التاريخ</p>
                                            <p className="text-sm text-white font-medium">{formatDate(test.date)}</p>
                                          </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                          </div>
                                          <div>
                                            <p className="text-xs text-gray-400">نوع الاختبار</p>
                                            <p className="text-sm text-white font-medium">{test.type || "اختبار"}</p>
                                          </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                          </div>
                                          <div>
                                            <p className="text-xs text-gray-400">عدد الأسئلة</p>
                                            <p className="text-sm text-white font-medium">{test.totalQuestions || (test.questions ? test.questions.length : 0)} سؤال</p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Score Card */}
                                    <div className="bg-gray-800/60 rounded-xl border border-gray-700/50 shadow-md overflow-hidden">
                                      <div className="bg-gray-800/80 px-4 py-3 border-b border-gray-700/50">
                                        <h3 className="text-sm font-medium text-gray-300 flex items-center gap-1.5">
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                          </svg>
                                          النتيجة
                                        </h3>
                                      </div>
                                      <div className="p-4 flex flex-col items-center justify-center">
                                        <div className="relative w-28 h-28 mb-3">
                                          <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-4xl font-bold text-white">{test.score}%</span>
                                          </div>
                                          <svg viewBox="0 0 36 36" className="-rotate-90 w-28 h-28">
                                            <path
                                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                              fill="none"
                                              stroke="#444"
                                              strokeWidth="2.5"
                                              strokeDasharray="100, 100"
                                            />
                                            <path
                                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                              fill="none"
                                              stroke={
                                                test.score >= 90 ? '#10b981' :
                                                test.score >= 70 ? '#3b82f6' :
                                                test.score >= 50 ? '#f59e0b' : '#ef4444'
                                              }
                                              strokeWidth="2.5"
                                              strokeDasharray={`${test.score}, 100`}
                                              strokeLinecap="round"
                                              className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                                            />
                                          </svg>
                                        </div>
                                        <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                                          test.score >= 90 ? 'bg-green-900/40 text-green-400 border border-green-800/30' :
                                          test.score >= 70 ? 'bg-blue-900/40 text-blue-400 border border-blue-800/30' :
                                          test.score >= 50 ? 'bg-yellow-900/40 text-yellow-400 border border-yellow-800/30' :
                                          'bg-red-900/40 text-red-400 border border-red-800/30'
                                        }`}>
                                          {
                                            test.score >= 90 ? 'ممتاز' :
                                            test.score >= 70 ? 'جيد' :
                                            test.score >= 50 ? 'مقبول' :
                                            'ضعيف'
                                          }
                                        </span>
                                      </div>
                                    </div>

                                    {/* Performance Card */}
                                    <div className="bg-gray-800/60 rounded-xl border border-gray-700/50 shadow-md overflow-hidden">
                                      <div className="bg-gray-800/80 px-4 py-3 border-b border-gray-700/50">
                                        <h3 className="text-sm font-medium text-gray-300 flex items-center gap-1.5">
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                          </svg>
                                          الأداء
                                        </h3>
                                      </div>
                                      <div className="p-4">
                                        <div className="flex items-center justify-between mb-3">
                                          <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                            <span className="text-sm text-gray-300">إجابات صحيحة</span>
                                          </div>
                                          <span className="text-sm font-medium text-white">
                                            {test.correctAnswers || (test.questions ? test.questions.filter(q => q.userAnswer === q.correctAnswer).length : 0)}
                                          </span>
                                        </div>

                                        <div className="flex items-center justify-between mb-3">
                                          <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                            <span className="text-sm text-gray-300">إجابات خاطئة</span>
                                          </div>
                                          <span className="text-sm font-medium text-white">
                                            {test.totalQuestions - (test.correctAnswers || (test.questions ? test.questions.filter(q => q.userAnswer === q.correctAnswer).length : 0))}
                                          </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                                            <span className="text-sm text-gray-300">المجموع</span>
                                          </div>
                                          <span className="text-sm font-medium text-white">
                                            {test.totalQuestions || (test.questions ? test.questions.length : 0)}
                                          </span>
                                        </div>

                                        <div className="mt-4 pt-3 border-t border-gray-700/50">
                                          <div className="flex items-center gap-1 h-4 bg-gray-700/50 rounded-full overflow-hidden">
                                            <div
                                              className="h-full bg-green-500"
                                              style={{
                                                width: `${(test.correctAnswers / test.totalQuestions) * 100}%`
                                              }}
                                            ></div>
                                            <div
                                              className="h-full bg-red-500"
                                              style={{
                                                width: `${((test.totalQuestions - test.correctAnswers) / test.totalQuestions) * 100}%`
                                              }}
                                            ></div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                    <div className="bg-gray-800/60 rounded-xl border border-gray-700/50 shadow-md overflow-hidden mb-8">
                                      <div className="bg-gray-800/80 px-4 py-3 border-b border-gray-700/50">
                                        <h3 className="text-sm font-medium text-gray-300 flex items-center gap-1.5">
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                          </svg>
                                          تفاصيل الأسئلة
                                        </h3>
                                      </div>

                                      <div className="flex flex-col md:flex-row">
                                        {/* Question Navigation Sidebar */}
                                        <div className="w-full md:w-48 shrink-0 bg-gray-800/80 border-b md:border-b-0 md:border-l border-gray-700/50">
                                          <div className="p-3 border-b border-gray-700/50">
                                            <h4 className="text-xs font-medium text-gray-400 mb-2">الأسئلة</h4>
                                            <div className="grid grid-cols-4 md:grid-cols-2 gap-2">
                                              {(test.details || test.questions || []).map((q, idx) => {
                                                const isQuestionCorrect = q.userAnswer === q.correctAnswer;
                                                return (
                                                  <a
                                                    key={idx}
                                                    href={`#question-${idx}`}
                                                    className={`flex items-center justify-center w-full h-8 rounded text-xs font-medium ${
                                                      isQuestionCorrect
                                                        ? 'bg-green-900/30 text-green-400 border border-green-800/30'
                                                        : 'bg-red-900/30 text-red-400 border border-red-800/30'
                                                    }`}
                                                  >
                                                    {idx + 1}
                                                  </a>
                                                );
                                              })}
                                            </div>
                                          </div>

                                          <div className="p-3">
                                            <h4 className="text-xs font-medium text-gray-400 mb-2">الملخص</h4>
                                            <div className="space-y-2">
                                              <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1.5">
                                                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                  <span className="text-xs text-gray-300">صحيح</span>
                                                </div>
                                                <span className="text-xs font-medium text-white">
                                                  {(test.details || test.questions || []).filter(q => q.userAnswer === q.correctAnswer).length}
                                                </span>
                                              </div>

                                              <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1.5">
                                                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                                  <span className="text-xs text-gray-300">خطأ</span>
                                                </div>
                                                <span className="text-xs font-medium text-white">
                                                  {(test.details || test.questions || []).filter(q => q.userAnswer !== q.correctAnswer).length}
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Questions List */}
                                        <div className="flex-1 p-4">
                                          <div className="space-y-6">
                                            {(test.details || test.questions || []).map((question, qIdx) => {
                                              const isCorrect = question.userAnswer === question.correctAnswer;
                                              return (
                                                <div
                                                  id={`question-${qIdx}`}
                                                  key={question.id || qIdx}
                                                  className={`p-5 rounded-xl ${
                                                    isCorrect
                                                      ? 'bg-gray-800/80 border border-green-800/30'
                                                      : 'bg-gray-800/80 border border-red-800/30'
                                                  }`}>
                                            <div className="flex items-start gap-3 mb-4">
                                              <div className="flex items-center justify-center shrink-0">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                  isCorrect
                                                    ? 'bg-green-900/40 text-green-400 border border-green-800/30'
                                                    : 'bg-red-900/40 text-red-400 border border-red-800/30'
                                                }`}>
                                                  <span className="text-sm font-medium">{qIdx + 1}</span>
                                                </div>
                                              </div>
                                              <div className="flex-1">
                                                <div className="flex justify-between items-center mb-3">
                                                  <h4 className="text-base font-medium text-white flex items-center gap-2">
                                                    {isCorrect ? (
                                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                      </svg>
                                                    ) : (
                                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                      </svg>
                                                    )}
                                                    <span>{isCorrect ? "إجابة صحيحة" : "إجابة خاطئة"}</span>
                                                  </h4>
                                                  <Badge variant={isCorrect ? "default" : "destructive"} className="text-xs">
                                                    {isCorrect ? "+" : "-"}{Math.round(100 / test.totalQuestions)}%
                                                  </Badge>
                                                </div>
                                                <p className="text-white/90 text-sm leading-relaxed">{question.text}</p>
                                              </div>
                                            </div>

                                            {/* Reading Passage - If Available */}
                                            {question.passage && (
                                              <div className="mb-5 mt-4 bg-blue-950/20 border border-blue-900/30 rounded-lg overflow-hidden">
                                                <div className="bg-blue-900/20 px-4 py-2.5 border-b border-blue-900/30 flex items-center gap-2">
                                                  <BookText className="h-4 w-4 text-blue-400" />
                                                  <h4 className="font-medium text-blue-400 text-sm">نص القطعة</h4>
                                                </div>
                                                <div className="p-4">
                                                  <p className="text-white/80 text-sm leading-relaxed whitespace-pre-line">{question.passage}</p>
                                                </div>
                                              </div>
                                            )}

                                            {question.imageUrl && (
                                              <div className="mb-5 bg-gray-800/40 border border-gray-700/50 rounded-lg overflow-hidden">
                                                <div className="bg-gray-800/60 px-4 py-2.5 border-b border-gray-700/50 flex items-center gap-2">
                                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                  </svg>
                                                  <h4 className="font-medium text-primary text-sm">صورة السؤال</h4>
                                                </div>
                                                <div className="p-4">
                                                  <img src={question.imageUrl} alt="صورة السؤال" className="rounded-md max-h-60 mx-auto shadow-md" />
                                                </div>
                                              </div>
                                            )}

                                            <div className="mt-5 bg-gray-800/40 border border-gray-700/50 rounded-lg overflow-hidden">
                                              <div className="bg-gray-800/60 px-4 py-2.5 border-b border-gray-700/50 flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <h4 className="font-medium text-primary text-sm">الخيارات</h4>
                                              </div>
                                              <div className="p-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                  {question.options && question.options.map((option, idx) => {
                                                    const optionLetter = idx === 0 ? 'أ' : idx === 1 ? 'ب' : idx === 2 ? 'ج' : 'د';
                                                    const isUserAnswer = optionLetter === question.userAnswer || option === question.userAnswer || idx === question.userAnswer;
                                                    const isCorrectAnswer = optionLetter === question.correctAnswer || option === question.correctAnswer || idx === question.correctAnswer;

                                                    return (
                                                      <div
                                                        key={idx}
                                                        className={`relative p-3 border rounded-lg flex items-center gap-3 ${
                                                          isUserAnswer && isCorrectAnswer ? 'bg-green-900/20 border-green-700/50' :
                                                          isUserAnswer && !isCorrectAnswer ? 'bg-red-900/20 border-red-700/50' :
                                                          isCorrectAnswer ? 'bg-green-900/10 border-green-700/30' :
                                                          'border-gray-700/30 bg-gray-800/20'
                                                        }`}
                                                      >
                                                        {/* Option indicator */}
                                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-medium ${
                                                          isUserAnswer && isCorrectAnswer ? 'bg-green-900/40 text-green-300 border border-green-700/50' :
                                                          isUserAnswer && !isCorrectAnswer ? 'bg-red-900/40 text-red-300 border border-red-700/50' :
                                                          isCorrectAnswer ? 'bg-green-900/30 text-green-400 border border-green-700/40' :
                                                          'bg-gray-800/60 text-gray-400 border border-gray-700/40'
                                                        }`}>
                                                          {optionLetter}
                                                        </div>

                                                        {/* Option text */}
                                                        <span className={`text-sm ${
                                                          isUserAnswer && isCorrectAnswer ? 'text-green-300' :
                                                          isUserAnswer && !isCorrectAnswer ? 'text-red-300' :
                                                          isCorrectAnswer ? 'text-green-400' :
                                                          'text-gray-300'
                                                        }`}>
                                                          {typeof option === 'string' ? option : option.text}
                                                        </span>

                                                        {/* Status indicators */}
                                                        {(isUserAnswer || isCorrectAnswer) && (
                                                          <div className="absolute top-1 right-1">
                                                            {isUserAnswer && (
                                                              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                                                isUserAnswer && isCorrectAnswer ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                                              }`}>
                                                                {isUserAnswer && isCorrectAnswer ? (
                                                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                  </svg>
                                                                ) : (
                                                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                                  </svg>
                                                                )}
                                                              </div>
                                                            )}
                                                          </div>
                                                        )}
                                                      </div>
                                                    );
                                                  })}
                                                </div>
                                              </div>
                                            </div>

                                            {question.explanation && (
                                              <div className="mt-5 bg-blue-950/20 border border-blue-900/30 rounded-lg overflow-hidden">
                                                <div className="bg-blue-900/20 px-4 py-2.5 border-b border-blue-900/30 flex items-center gap-2">
                                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                  </svg>
                                                  <h4 className="font-medium text-blue-400 text-sm">التوضيح</h4>
                                                </div>
                                                <div className="p-4">
                                                  <p className="text-white/80 text-sm leading-relaxed">{question.explanation}</p>
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>

                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700 dark:text-red-400 hover:dark:text-red-300"
                                onClick={() => handleDeleteTest(idx)}
                              >
                                حذف
                              </Button>
                            </div>
                          </div>

                          <div className="mt-3 flex items-center">
                            <div className="flex-1 bg-gray-700/30 rounded-full h-2 mr-2">
                              <div
                                className={`h-2 rounded-full ${
                                  test.score >= 90 ? 'bg-green-500' :
                                  test.score >= 70 ? 'bg-primary' :
                                  test.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${test.score}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-medium ml-2 w-12 text-left text-gray-300">
                              {test.correctAnswers || (test.questions ? test.questions.filter(q => q.userAnswer === q.correctAnswer).length : 0)} / {test.totalQuestions || (test.questions ? test.questions.length : 0)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Stats Tab */}
            <TabsContent value="stats" className="mt-0">
              <Card className="shadow-md border-0 bg-gray-800/80">
                <CardHeader>
                  <CardTitle className="text-xl text-right text-white">إحصائيات الأداء</CardTitle>
                  <CardDescription className="text-right text-gray-300">تحليل أدائك في الاختبارات</CardDescription>
                </CardHeader>
                <CardContent>
                  {testHistory.length === 0 ? (
                    <div className="text-center py-16 px-4">
                      <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-white">لا توجد إحصائيات بعد</h3>
                      <p className="text-gray-400 mt-2">أكمل بعض الاختبارات لعرض إحصائيات أدائك</p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Performance Summary */}
                      <div className="bg-gray-700/50 rounded-xl p-6">
                        <h3 className="text-lg font-medium text-right mb-4 text-white">ملخص الأداء</h3>
                        <div className="space-y-4">
                          {stats.map((stat, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                              <span className="font-bold text-2xl text-primary">{stat.value}</span>
                              <span className="text-gray-300">{stat.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recent Progress */}
                      <div className="bg-gray-700/50 rounded-xl p-6">
                        <h3 className="text-lg font-medium text-right mb-4 text-white">التقدم الأخير</h3>
                        <div className="space-y-4">
                          {testHistory.slice(0, 5).map((test, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                              <span className={`font-medium ${
                                test.score >= 90 ? 'text-green-600 dark:text-green-400' :
                                test.score >= 70 ? 'text-primary' :
                                test.score >= 50 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                              }`}>{test.score}%</span>
                              <span className="text-sm text-gray-500">{formatDate(test.date).split('،')[0]}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
              )}
            </CardContent>
          </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserProfile;
