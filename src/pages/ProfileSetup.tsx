import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { motion } from "framer-motion";
import { CheckCircle2, User, ArrowRight } from "lucide-react";

const formSchema = z.object({
  username: z.string()
    .min(2, "الاسم يجب أن يكون على الأقل حرفين")
    .max(50, "الاسم لا يمكن أن يتجاوز 50 حرف"),
});

const ProfileSetup = () => {
  const { user, isLoggedIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  useEffect(() => {
    // Redirect if not logged in
    if (!isLoggedIn) {
      navigate("/login");
    }
    
    // Check if user already has a profile
    const checkProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", user.id)
          .single();
          
        if (!error && data && data.username) {
          // If username already set, redirect to homepage
          navigate("/");
        }
      } catch (error) {
        console.error("Error checking profile:", error);
      }
    };
    
    if (isLoggedIn) {
      checkProfile();
    }
  }, [isLoggedIn, user, navigate]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ username: data.username })
        .eq("id", user.id);
        
      if (error) throw error;
      
      toast({
        title: "تم حفظ الملف الشخصي",
        description: "تم اكتمال إعداد حسابك بنجاح",
      });
      
      // Redirect to homepage or user profile
      navigate("/user-profile");
    } catch (error: any) {
      toast({
        title: "خطأ في حفظ الملف الشخصي",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoggedIn || !user) {
    return null;
  }

  return (
    <Layout>
      <section className="container mx-auto py-16 px-4 min-h-screen flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full"
        >
          <Card className="border-primary/20 shadow-lg shadow-primary/10">
            <CardHeader className="text-center pb-6">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="w-16 h-16 rounded-full bg-primary/20 mx-auto mb-4 flex items-center justify-center"
              >
                <User className="h-8 w-8 text-primary" />
              </motion.div>
              <CardTitle className="text-2xl font-bold">أهلاً بك في منصة اسرار للتفوق!</CardTitle>
              <CardDescription className="text-base mt-2">
                لنكمل إعداد حسابك الشخصي
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-primary/5 rounded-lg p-4 mb-6 border border-primary/20">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium text-base">تم إنشاء حسابك بنجاح</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      الآن، أضف اسمك لتخصيص تجربتك وإكمال ملفك الشخصي
                    </p>
                  </div>
                </div>
              </div>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem className="text-right">
                        <FormLabel>الاسم الكامل</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="أدخل اسمك الكامل" 
                            {...field} 
                            className="text-right"
                            dir="rtl"
                          />
                        </FormControl>
                        <FormDescription>
                          هذا الاسم سيظهر في ملفك الشخصي وتفاعلاتك في المنصة
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "جاري الحفظ..." : (
                      <>
                        إكمال التسجيل
                        <ArrowRight className="mr-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-4">
              <p className="text-sm text-center text-muted-foreground">
                يمكنك تغيير معلوماتك لاحقاً من صفحة الملف الشخصي
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </section>
    </Layout>
  );
};

export default ProfileSetup; 
