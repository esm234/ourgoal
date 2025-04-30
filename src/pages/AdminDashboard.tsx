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
  BookOpen,
  BarChart3,
  ClipboardList,
  Home,
  LogOut
} from "lucide-react";
import UserManagement from "@/components/admin/UserManagement";
import AdminTestManagement from "@/components/admin/AdminTestManagement";
import AdminStats from "@/components/admin/AdminStats";
// Create a placeholder for ExamResultsManagement
const ExamResultsManagement = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-4">نتائج الاختبارات</h2>
        <p>سيتم إضافة هذه الميزة قريبًا.</p>
      </CardContent>
    </Card>
  );
};

const AdminDashboard = () => {
  const { isLoggedIn, role, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTests: 0,
    totalTestsTaken: 0,
    recentUsers: 0,
    recentTests: 0,
  });

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (role !== "admin") {
      toast({
        title: "غير مصرح",
        description: "هذه الصفحة متاحة للمشرفين فقط",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    fetchDashboardStats();
  }, [isLoggedIn, role, navigate]);

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

      // Fetch total tests
      const { count: testCount, error: testError } = await supabase
        .from("tests")
        .select("*", { count: "exact", head: true });

      // Fetch recent tests (last 30 days)
      const { count: recentTestCount, error: recentTestError } = await supabase
        .from("tests")
        .select("*", { count: "exact", head: true })
        .gte("created_at", thirtyDaysAgoStr);

      // Fetch total test results
      const { count: resultCount, error: resultError } = await supabase
        .from("exam_results")
        .select("*", { count: "exact", head: true });

      if (userError) throw userError;
      if (recentUserError) throw recentUserError;
      if (testError) throw testError;
      if (recentTestError) throw recentTestError;
      if (resultError) throw resultError;

      setStats({
        totalUsers: userCount || 0,
        totalTests: testCount || 0,
        totalTestsTaken: resultCount || 0,
        recentUsers: recentUserCount || 0,
        recentTests: recentTestCount || 0,
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

  // Early return if not authenticated or not admin
  if (!isLoggedIn || role !== "admin") {
    return null;
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
            <p className="text-muted-foreground">إدارة المستخدمين والاختبارات والدورات وعرض الإحصائيات</p>
          </div>
          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            <Button variant="outline" onClick={() => navigate("/")} className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span>الرئيسية</span>
            </Button>
            <Button variant="outline" onClick={() => navigate("/test-management")} className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>إدارة الاختبارات</span>
            </Button>
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              <span>تسجيل الخروج</span>
            </Button>
          </div>
        </div>



        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span>نظرة عامة</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>المستخدمين</span>
            </TabsTrigger>
            <TabsTrigger value="tests" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>الاختبارات</span>
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              <span>النتائج</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <AdminStats stats={stats} loading={loading} />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="tests">
            <AdminTestManagement />
          </TabsContent>

          <TabsContent value="results">
            <ExamResultsManagement />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
