import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { BarChart, LineChart, PieChart, User, Settings, LogOut, Book, ChevronRight } from "lucide-react";
import type { TestResult } from "@/types/testResults";

interface ProfileData {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  education_level: string | null;
  bio: string | null;
  created_at: string;
}

const Profile = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    education_level: "",
    bio: "",
  });

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // Get profile data
        if (user?.id) {
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          if (profileError) {
            console.error("Error fetching profile:", profileError);
          } else if (profileData) {
            setProfileData(profileData);
            setFormData({
              username: profileData.username || "",
              full_name: profileData.full_name || "",
              education_level: profileData.education_level || "",
              bio: profileData.bio || "",
            });
          }

          // Get test results
          const { data: resultsData, error: resultsError } = await supabase
            .from("exam_results")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

          if (resultsError) {
            console.error("Error fetching test results:", resultsError);
          } else if (resultsData) {
            // Convert DB format to TestResult format
            const formattedResults: TestResult[] = resultsData.map(result => ({
              testId: result.test_id,
              score: result.score,
              correctAnswers: result.questions_data?.filter(
                (q: any) => q.userAnswer === q.correctAnswer
              ).length || 0,
              totalQuestions: result.total_questions,
              date: result.created_at,
              type: 'mixed',
              questions: result.questions_data || []
            }));
            setTestResults(formattedResults);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "خطأ في تحميل البيانات",
          description: "حدث خطأ أثناء تحميل بيانات الملف الشخصي.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isLoggedIn, user, navigate, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          username: formData.username,
          full_name: formData.full_name,
          education_level: formData.education_level,
          bio: formData.bio,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "تم الحفظ",
        description: "تم تحديث الملف الشخصي بنجاح",
      });

      setEditMode(false);
      // Update local state with new data
      setProfileData(prev => prev ? {
        ...prev,
        username: formData.username,
        full_name: formData.full_name,
        education_level: formData.education_level,
        bio: formData.bio,
      } : null);

    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "خطأ",
        description: "فشل تحديث الملف الشخصي",
        variant: "destructive",
      });
    }
  };

  const calculateAverageScore = () => {
    if (testResults.length === 0) return 0;
    const totalScore = testResults.reduce((acc, result) => acc + result.score, 0);
    return Math.round(totalScore / testResults.length);
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">جاري تحميل البيانات...</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">الملف الشخصي</h1>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="history">سجل الاختبارات</TabsTrigger>
            <TabsTrigger value="settings">إعدادات الحساب</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>معلومات الحساب</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <User className="w-12 h-12 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">{profileData?.full_name || "المستخدم"}</h3>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>

                  <div className="space-y-3 text-right">
                    <div>
                      <span className="text-muted-foreground text-sm">اسم المستخدم:</span>
                      <p>{profileData?.username || "غير محدد"}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-sm">المرحلة التعليمية:</span>
                      <p>{profileData?.education_level || "غير محدد"}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-sm">نبذة:</span>
                      <p>{profileData?.bio || "لا توجد نبذة"}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-sm">تاريخ الانضمام:</span>
                      <p>{new Date(profileData?.created_at || "").toLocaleDateString("ar-SA")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>ملخص الأداء</CardTitle>
                  <CardDescription>إحصائيات أدائك في الاختبارات</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-secondary p-4 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground mb-1">عدد الاختبارات</p>
                      <p className="text-3xl font-bold">{testResults.length}</p>
                    </div>
                    <div className="bg-secondary p-4 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground mb-1">معدل الدرجات</p>
                      <p className="text-3xl font-bold">{calculateAverageScore()}%</p>
                    </div>
                    <div className="bg-secondary p-4 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground mb-1">آخر اختبار</p>
                      <p className="text-3xl font-bold">
                        {testResults.length > 0 
                          ? `${testResults[0].score}%` 
                          : "لا يوجد"}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-center items-center p-8 bg-card border rounded-lg">
                    <div className="text-center">
                      <BarChart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">تحسن في مستواك!</h3>
                      <p className="text-muted-foreground">
                        استمر في أداء الاختبارات لتحسين مهاراتك ومعرفة نقاط قوتك وضعفك.
                      </p>
                      <Button 
                        className="mt-4" 
                        onClick={() => navigate("/qiyas-tests")}
                      >
                        بدء اختبار جديد
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>سجل الاختبارات</CardTitle>
                <CardDescription>تاريخ اختباراتك ونتائجها</CardDescription>
              </CardHeader>
              <CardContent>
                {testResults.length === 0 ? (
                  <div className="text-center py-8">
                    <Book className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">لا توجد اختبارات بعد</h3>
                    <p className="text-muted-foreground mb-4">
                      لم تقم بإكمال أي اختبار حتى الآن. ابدأ باختبار قياس تجريبي الآن!
                    </p>
                    <Button onClick={() => navigate("/qiyas-tests")}>
                      بدء اختبار جديد
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {testResults.map((result, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/50 transition-colors"
                      >
                        <div>
                          <div className="flex items-center">
                            <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                              result.score >= 70 ? 'bg-green-500' : 
                              result.score >= 50 ? 'bg-yellow-500' : 
                              'bg-red-500'
                            }`}></span>
                            <h3 className="font-semibold">
                              {new Date(result.date).toLocaleDateString("ar-SA")}
                            </h3>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            الإجابات الصحيحة: {result.correctAnswers} من {result.totalQuestions}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <span className="text-2xl font-bold ml-4">{result.score}%</span>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => navigate("/performance")}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات الحساب</CardTitle>
                <CardDescription>تعديل معلومات الملف الشخصي</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">اسم المستخدم</Label>
                      <Input
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="full_name">الاسم كاملاً</Label>
                      <Input
                        id="full_name"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="education_level">المرحلة التعليمية</Label>
                    <Input
                      id="education_level"
                      name="education_level"
                      value={formData.education_level}
                      onChange={handleInputChange}
                      disabled={!editMode}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">نبذة تعريفية</Label>
                    <Input
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      disabled={!editMode}
                    />
                  </div>

                  <div className="flex justify-between mt-6">
                    {editMode ? (
                      <>
                        <Button variant="outline" onClick={() => setEditMode(false)}>
                          إلغاء
                        </Button>
                        <Button onClick={handleSaveProfile}>
                          حفظ التغييرات
                        </Button>
                      </>
                    ) : (
                      <Button onClick={() => setEditMode(true)}>
                        <Settings className="mr-2 h-4 w-4" />
                        تعديل الملف الشخصي
                      </Button>
                    )}
                  </div>

                  <div className="pt-6 mt-6 border-t">
                    <Button 
                      variant="destructive" 
                      className="w-full" 
                      onClick={async () => {
                        await logout();
                        navigate("/");
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      تسجيل الخروج
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Profile; 
