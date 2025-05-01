import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowRight, Lock, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const resetPasswordSchema = z.object({
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
  confirmPassword: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "كلمات المرور غير متطابقة",
  path: ["confirmPassword"],
});

const ResetPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { updatePassword, logout } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Check if we have a valid hash in the URL and handle auto-login
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || !hash.includes('type=recovery')) {
      toast({
        title: "رابط غير صالح",
        description: "يبدو أن رابط إعادة تعيين كلمة المرور غير صالح أو منتهي الصلاحية",
        variant: "destructive",
      });
      // Redirect to home page if the hash is invalid
      navigate("/");
      return;
    }
    
    // After password reset, we'll manually log the user out for security
    const handlePasswordReset = async () => {
      // We'll let the user update their password first, then log them out
      // This ensures they have to log in with their new password
    };
    
    handlePasswordReset();
  }, [toast, navigate]);

  const handleSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    setIsSubmitting(true);
    try {
      const { error } = await updatePassword(data.password);
      
      if (error) {
        throw error;
      } else {
        setResetComplete(true);
        toast({
          title: "تم تغيير كلمة المرور بنجاح",
          description: "يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة",
        });
        
        // Log the user out after password reset for security
        await logout();
      }
    } catch (error: any) {
      toast({
        title: "خطأ في تغيير كلمة المرور",
        description: error.message || "حدث خطأ أثناء تغيير كلمة المرور",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>إعادة تعيين كلمة المرور</CardTitle>
              <CardDescription>
                أدخل كلمة المرور الجديدة لحسابك
              </CardDescription>
            </CardHeader>
            <CardContent>
              {resetComplete ? (
                <div className="text-center py-4">
                  <div className="mx-auto mb-4 bg-green-500/10 p-3 rounded-full w-16 h-16 flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">تم تغيير كلمة المرور!</h3>
                  <p className="text-muted-foreground mb-4">
                    تم تغيير كلمة المرور الخاصة بك بنجاح. يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة.
                  </p>
                  <Button 
                    className="mt-2"
                    onClick={() => navigate("/login")}
                  >
                    الذهاب إلى تسجيل الدخول
                  </Button>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="text-right">
                          <FormLabel>كلمة المرور الجديدة</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-2.5 text-muted-foreground">
                                <Lock size={16} />
                              </span>
                              <Input 
                                placeholder="••••••••" 
                                {...field} 
                                type="password"
                                dir="ltr"
                                className="pl-10"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem className="text-right">
                          <FormLabel>تأكيد كلمة المرور</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-2.5 text-muted-foreground">
                                <Lock size={16} />
                              </span>
                              <Input 
                                placeholder="••••••••" 
                                {...field} 
                                type="password"
                                dir="ltr"
                                className="pl-10"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "جاري التغيير..." : "تغيير كلمة المرور"}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button 
                variant="link" 
                onClick={() => navigate("/login")}
                className="flex items-center gap-1"
              >
                <span>العودة إلى تسجيل الدخول</span>
                <ArrowRight size={16} />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ResetPassword;




