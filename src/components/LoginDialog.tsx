import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LogIn, User, Lock } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

interface LoginDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  redirectPath?: string;
  description?: string;
}

const LoginDialog = ({
  isOpen,
  setIsOpen,
  redirectPath = "/user-profile",
  description = "يرجى تسجيل الدخول للوصول إلى ملفك الشخصي ومشاهدة تقارير الأداء الخاصة بك"
}: LoginDialogProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, signInWithGoogle } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (data: z.infer<typeof loginSchema>) => {
    setIsSubmitting(true);
    try {
      const { error } = await login(data.email, data.password);

      if (error) {
        throw error;
      } else {
        toast({
          title: "تم تسجيل الدخول بنجاح",
        });
        setIsOpen(false);
        navigate(redirectPath);
      }
    } catch (error: any) {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: error.message || "حدث خطأ أثناء تسجيل الدخول",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        throw error;
      }
      // Note: Redirect is handled by Supabase OAuth flow
    } catch (error: any) {
      toast({
        title: "خطأ في تسجيل الدخول بواسطة Google",
        description: error.message || "حدث خطأ أثناء تسجيل الدخول",
        variant: "destructive",
      });
      setIsGoogleLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] rounded-xl border-border/50 overflow-hidden bg-gradient-to-b from-background to-background/90">
        <DialogHeader className="text-center pt-6">
          <div className="mx-auto mb-4 bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center">
            <User className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-2xl">تسجيل الدخول</DialogTitle>
          <DialogDescription className="mt-2 text-muted-foreground">
            {description}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="text-right">
                  <FormLabel>البريد الإلكتروني</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-muted-foreground">
                        <User size={16} />
                      </span>
                      <Input
                        placeholder="name@example.com"
                        {...field}
                        type="email"
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
              name="password"
              render={({ field }) => (
                <FormItem className="text-right">
                  <div className="flex items-center justify-between">
                    <Button
                      variant="link"
                      className="p-0 h-auto text-xs text-primary"
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        navigate("/forgot-password");
                      }}
                    >
                      نسيت كلمة المرور؟
                    </Button>
                    <FormLabel>كلمة المرور</FormLabel>
                  </div>
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

            <DialogFooter className="flex flex-col gap-3 sm:gap-0 mt-6">
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                disabled={isSubmitting}
              >
                <LogIn size={18} />
                تسجيل الدخول
              </Button>
              
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border"></span>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-background px-2 text-muted-foreground">أو</span>
                </div>
              </div>
              
              <Button
                type="button"
                variant="outline"
                className="w-full py-2 rounded-lg flex items-center justify-center gap-2"
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                تسجيل الدخول باستخدام Google
              </Button>
              
              <div className="text-center mt-4 text-sm">
                ليس لديك حساب؟{" "}
                <Button
                  variant="link"
                  className="p-0"
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/login");
                  }}
                >
                  إنشاء حساب جديد
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
