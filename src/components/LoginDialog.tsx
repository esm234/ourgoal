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
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
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
                  <FormLabel>كلمة المرور</FormLabel>
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