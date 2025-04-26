
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { LogIn } from "lucide-react";

// Define the form schema with validation
const formSchema = z.object({
  username: z
    .string()
    .min(3, { message: "يجب أن يكون اسم المستخدم على الأقل 3 أحرف" }),
  password: z
    .string()
    .min(3, { message: "يجب أن تكون كلمة المرور على الأقل 3 أحرف" }),
});

type FormValues = z.infer<typeof formSchema>;

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    setIsLoading(true);
    // Simulate API request
    setTimeout(() => {
      login(data.username, data.password);
      setIsLoading(false);
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: `مرحباً، ${data.username}`,
      });
      navigate("/");
    }, 1000);
  };

  return (
    <Layout>
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">تسجيل الدخول</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              قم بتسجيل الدخول للوصول إلى جميع خدمات المنصة وتتبع تقدمك
            </p>
          </div>

          <div className="flex justify-center">
            <Card className="w-full max-w-md border-2 border-border bg-secondary">
              <CardContent className="p-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>اسم المستخدم</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="ادخل اسم المستخدم"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>كلمة المرور</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="ادخل كلمة المرور"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90 flex items-center justify-center"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                      ) : (
                        <LogIn className="ml-2" size={18} />
                      )}
                      تسجيل الدخول
                    </Button>
                  </form>
                </Form>
                
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  <p>هذا تسجيل دخول تجريبي. يمكنك إدخال أي اسم مستخدم وكلمة مرور.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Login;
