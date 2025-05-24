import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Users,
  BarChart3,
  Home,
  LogOut,
  ShieldAlert,
  FileText
} from "lucide-react";
import UserManagement from "@/components/admin/UserManagement";
import AdminStats from "@/components/admin/AdminStats";
import { useAdminCheck } from "@/hooks/useAdminCheck";

const AdminDashboard = () => {
  const { isLoggedIn, logout } = useAuth();
  const { isAdmin, isVerifying, error: adminCheckError } = useAdminCheck();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFiles: 0,
    totalExams: 0,
    recentUsers: 0,
    totalDownloads: 0,
  });

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    // Check if the user is an admin using our secure hook
    if (!isVerifying && !isAdmin) {
      toast({
        title: "غير مصرح",
        description: "هذه الصفحة متاحة للمشرفين فقط",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    // If there was an error checking admin status
    if (adminCheckError) {
      toast({
        title: "خطأ في التحقق من الصلاحيات",
        description: adminCheckError,
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    // Only fetch stats if we're confirmed as an admin
    if (isAdmin) {
      fetchDashboardStats();
    }
  }, [isLoggedIn, isAdmin, isVerifying, adminCheckError, navigate]);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      // Get current date and 30 days ago for recent stats
      const now = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);
      const thirtyDaysAgoStr = thirtyDaysAgo.toISOString();

      // Fetch total users
      const { count: userCount, error: userError } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // Fetch recent users (last 30 days)
      const { count: recentUserCount, error: recentUserError } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gte("created_at", thirtyDaysAgoStr);

      // For now, we'll set placeholder values for files and exams
      // These will work once the database tables are created
      let fileCount = 0;
      let examCount = 0;
      let totalDownloads = 0;

      try {
        // Try to fetch files data (will work after SQL is run)
        const { count: filesCount } = await supabase
          .from("files")
          .select("*", { count: "exact", head: true });
        fileCount = filesCount || 0;

        // Try to fetch exams data
        const { count: examsCount } = await supabase
          .from("exams")
          .select("*", { count: "exact", head: true });
        examCount = examsCount || 0;

        // Try to fetch total downloads
        const { data: filesData } = await supabase
          .from("files")
          .select("downloads");
        if (filesData) {
          totalDownloads = filesData.reduce((sum, file) => sum + (file.downloads || 0), 0);
        }
      } catch (dbError) {
        // Tables don't exist yet, use placeholder values
        console.log("Files/Exams tables not created yet");
      }

      if (userError) throw userError;
      if (recentUserError) throw recentUserError;

      setStats({
        totalUsers: userCount || 0,
        totalFiles: fileCount,
        totalExams: examCount,
        recentUsers: recentUserCount || 0,
        totalDownloads: totalDownloads,
      });
    } catch (error: any) {
      toast({
        title: "خطأ في جلب البيانات",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Early return if not authenticated, still verifying, or not admin
  if (!isLoggedIn || isVerifying || !isAdmin) {
    return (
      <Layout>
        <div className="container mx-auto py-8 text-center">
          {isVerifying ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
              <ShieldAlert className="h-12 w-12 text-primary animate-pulse mb-4" />
              <h2 className="text-xl font-bold mb-2">جاري التحقق من الصلاحيات...</h2>
              <p className="text-muted-foreground">يرجى الانتظار بينما نتحقق من صلاحياتك</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
              <ShieldAlert className="h-12 w-12 text-destructive mb-4" />
              <h2 className="text-xl font-bold mb-2">غير مصرح</h2>
              <p className="text-muted-foreground">ليس لديك صلاحية الوصول إلى هذه الصفحة</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => navigate("/")}
              >
                العودة إلى الصفحة الرئيسية
              </Button>
            </div>
          )}
        </div>
      </Layout>
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">لوحة تحكم المشرف</h1>
            <p className="text-muted-foreground">إدارة المستخدمين والملفات التعليمية وعرض الإحصائيات</p>
          </div>
          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            <Button variant="outline" onClick={() => navigate("/")} className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span>الرئيسية</span>
            </Button>
            <Button variant="outline" onClick={() => navigate("/admin/files")} className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>إدارة الملفات</span>
            </Button>
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              <span>تسجيل الخروج</span>
            </Button>
          </div>
        </div>



        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span>نظرة عامة</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>المستخدمين</span>
            </TabsTrigger>
            <TabsTrigger value="files" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>الملفات</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <AdminStats stats={stats} loading={loading} />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="files">
            <Card>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <FileText className="w-16 h-16 text-primary mx-auto" />
                  <h2 className="text-2xl font-bold">إدارة الملفات التعليمية</h2>
                  <p className="text-muted-foreground">
                    يمكنك إدارة الملفات التعليمية والاختبارات من خلال الصفحة المخصصة
                  </p>
                  <Button
                    onClick={() => navigate("/admin/files")}
                    className="bg-gradient-to-r from-primary to-accent text-black font-bold"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    انتقل إلى إدارة الملفات
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
