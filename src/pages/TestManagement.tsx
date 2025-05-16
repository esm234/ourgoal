import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Trash, PenLine, Plus, Check, X } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import TestForm from "@/components/test-management/TestForm";
import TestList from "@/components/test-management/TestList";
import { Test, CreateTestForm } from "@/types/testManagement";

const TestManagement = () => {
  const { isLoggedIn, user, role } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("my-tests");
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    if (role !== "admin") {
      navigate("/");
      return;
    }
    fetchTests();
  }, [isLoggedIn, role, navigate]);

  // Early return if not authenticated
  if (!isLoggedIn || role !== "admin") {
    return null;
  }

  const fetchTests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("tests")
        .select("*")
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      console.log("Fetched tests:", data);
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

  const handleCreateTest = async (data: CreateTestForm) => {
    try {
      console.log("Creating test with category:", data.category);
      
      const { data: insertedData, error } = await supabase.from("tests").insert([
        {
          title: data.title,
          description: data.description,
          duration: data.duration,
          category: data.category,
          user_id: user?.id,
        },
      ]).select();

      if (error) throw error;
      
      console.log("Test created successfully:", insertedData);
      
      toast({
        title: "تم إنشاء الاختبار بنجاح",
        description: "يمكنك الآن إضافة الأسئلة للاختبار",
      });
      
      fetchTests();
      setActiveTab("my-tests");
    } catch (error: any) {
      console.error("Error creating test:", error);
      toast({
        title: "خطأ في إنشاء الاختبار",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteTest = async (testId: string) => {
    try {
      const { error } = await supabase.from("tests").delete().eq("id", testId);

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

 const handleTogglePublish = async (testId: string, currentStatus: boolean) => {
  try {
    const { error } = await supabase
      .from("tests")
      .update({ published: !currentStatus })
      .eq("id", testId);

    if (error) {
      console.error("Error toggling publish status:", error);
      throw error;
    }
    
    toast({
      title: !currentStatus ? "تم نشر الاختبار بنجاح" : "تم إلغاء نشر الاختبار بنجاح",
    });
    
    fetchTests();
  } catch (error: any) {
    toast({
      title: "خطأ في تغيير حالة النشر",
      description: error.message,
      variant: "destructive",
    });
  }
};

// Update the handleDeleteTest function to ensure it works regardless of test status
const handleDeleteTest = async (testId: string) => {
  try {
    const { error } = await supabase
      .from("tests")
      .delete()
      .eq("id", testId);

    if (error) {
      console.error("Error deleting test:", error);
      throw error;
    }
    
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

  // Add function to handle test category update
  const getCategoryText = (category?: string) => {
    return category === 'sample' ? 'اختبارات نموذجية' : 'اختبارات اسبوعية';
  };

  return (
    <Layout>
      <section className="container mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">إدارة الاختبارات</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            أنشئ وأدر اختباراتك الخاصة وشاركها مع الآخرين
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="my-tests">اختباراتي</TabsTrigger>
            <TabsTrigger value="create-test">إنشاء اختبار جديد</TabsTrigger>
          </TabsList>
          
          <TabsContent value="my-tests">
            <Card>
              <CardHeader>
                <CardTitle>اختباراتي</CardTitle>
                <CardDescription>قائمة بجميع الاختبارات التي أنشأتها</CardDescription>
              </CardHeader>
              <CardContent>
                <TestList 
                  tests={tests} 
                  loading={loading} 
                  onDelete={handleDeleteTest}
                  onTogglePublish={handleTogglePublish}
                  getCategoryText={getCategoryText}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="create-test">
            <Card>
              <CardHeader>
                <CardTitle>إنشاء اختبار جديد</CardTitle>
                <CardDescription>أدخل تفاصيل الاختبار الجديد</CardDescription>
              </CardHeader>
              <CardContent>
                <TestForm onSubmit={handleCreateTest} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </Layout>
  );
};

export default TestManagement;
