import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import TestForm from "@/components/test-management/TestForm";
import { Test } from "@/types/testManagement";

const EditTest = () => {
  const { testId } = useParams();
  const { isLoggedIn, role } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [test, setTest] = useState<Test | null>(null);
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

    if (testId) {
      fetchTestDetails();
    }
  }, [isLoggedIn, role, testId, navigate]);

  const fetchTestDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("tests")
        .select("*")
        .eq("id", testId)
        .single();

      if (error) throw error;
      
      if (data) {
        const formattedTest: Test = {
          ...data,
          category: data.category as 'sample' | 'user'
        };
        setTest(formattedTest);
      }
    } catch (error: any) {
      toast({
        title: "خطأ في جلب تفاصيل الاختبار",
        description: error.message,
        variant: "destructive",
      });
      navigate("/test-management");
    } finally {
      setLoading(false);
    }
  };

const handleUpdateTest = async (data: { title: string; description: string; duration: number; category: 'sample' | 'user' }) => {
  try {
    const { error } = await supabase
      .from("tests")
      .update({
        title: data.title,
        description: data.description,
        duration: data.duration,
        category: data.category
      })
      .eq("id", testId);

    if (error) {
      console.error("Error updating test:", error);
      throw error;
    }
    
    toast({
      title: "تم تحديث الاختبار بنجاح",
    });
    
    navigate("/test-management");
  } catch (error: any) {
    toast({
      title: "خطأ في تحديث الاختبار",
      description: error.message,
      variant: "destructive",
    });
  }
};
  if (!isLoggedIn || role !== "admin") {
    return null;
  }

  if (loading) {
    return (
      <Layout>
        <section className="container mx-auto py-16 px-4">
          <div className="max-w-2xl mx-auto">
            <p>جاري تحميل البيانات...</p>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="container mx-auto py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <Button variant="outline" asChild className="mb-6">
            <Link to="/test-management">
              <ArrowLeft className="h-4 w-4 mr-1" />
              العودة إلى قائمة الاختبارات
            </Link>
          </Button>
          
          <Card>
            <CardHeader>
              <CardTitle>تعديل الاختبار</CardTitle>
              <CardDescription>تعديل بيانات الاختبار</CardDescription>
            </CardHeader>
            <CardContent>
              {test && (
                <TestForm 
                  onSubmit={handleUpdateTest}
                  defaultValues={{
                    title: test.title,
                    description: test.description || "",
                    duration: test.duration,
                  }}
                  isEdit={true}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default EditTest;
