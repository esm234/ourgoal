import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  User,
  Sparkles,
  Target,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Welcome: React.FC = () => {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameError, setUsernameError] = useState('');

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
  }, [isLoggedIn, navigate]);

  // Check if user already has a username set
  useEffect(() => {
    if (user) {
      checkExistingProfile();
    }
  }, [user]);

  const checkExistingProfile = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single();

      // Only redirect if profile exists AND has a username
      if (!error && profile && profile.username && profile.username.trim()) {
        navigate('/profile');
      }
    } catch (error) {
      console.error('Error checking profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkUsernameAvailability = async (usernameToCheck: string) => {
    if (!usernameToCheck.trim() || usernameToCheck.length < 2) {
      setUsernameError('');
      return;
    }

    try {
      setIsCheckingUsername(true);
      setUsernameError('');

      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', usernameToCheck.trim())
        .neq('id', user?.id || '') // Exclude current user
        .single();

      if (!error && data) {
        setUsernameError('هذا الاسم مستخدم بالفعل، يرجى اختيار اسم آخر');
      } else if (error && error.code === 'PGRST116') {
        // No rows found, username is available
        setUsernameError('');
      }
    } catch (error) {
      console.error('Error checking username:', error);
    } finally {
      setIsCheckingUsername(false);
    }
  };

  // Debounced username check
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (username.trim()) {
        checkUsernameAvailability(username);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [username, user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      toast.error('يرجى إدخال اسمك');
      return;
    }

    if (username.trim().length < 2) {
      toast.error('الاسم يجب أن يكون على الأقل حرفين');
      return;
    }

    if (usernameError) {
      toast.error('يرجى اختيار اسم مستخدم آخر');
      return;
    }

    if (!user) {
      toast.error('حدث خطأ في المصادقة');
      return;
    }

    try {
      setIsSubmitting(true);

      // First, check if profile exists
      console.log('Checking for existing profile for user:', user.id);
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('id, username')
        .eq('id', user.id)
        .single();

      console.log('Profile check result:', { existingProfile, checkError });

      let result;

      if (checkError && checkError.code === 'PGRST116') {
        // Profile doesn't exist, create new one
        console.log('Creating new profile...');
        result = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            username: username.trim(),
            role: 'user'
          });
        console.log('Insert result:', result);
      } else if (existingProfile) {
        // Profile exists, update username
        console.log('Updating existing profile...');
        result = await supabase
          .from('profiles')
          .update({
            username: username.trim()
          })
          .eq('id', user.id);
        console.log('Update result:', result);
      } else {
        console.error('Unexpected state:', { checkError, existingProfile });
        throw new Error('Unexpected error checking profile');
      }

      if (result.error) {
        console.error('Error saving profile:', result.error);
        toast.error(`حدث خطأ أثناء حفظ البيانات: ${result.error.message}`);
        return;
      }

      toast.success('مرحباً بك! تم حفظ ملفك الشخصي بنجاح 🎉');
      navigate('/profile');
    } catch (error: any) {
      console.error('Error creating/updating profile:', error);
      toast.error(`حدث خطأ غير متوقع: ${error.message || 'خطأ غير معروف'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <section className="min-h-screen py-16 px-4 bg-gradient-to-br from-background via-secondary/30 to-background relative overflow-hidden flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">جاري التحقق من بياناتك...</p>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="min-h-screen py-16 px-4 bg-gradient-to-br from-background via-secondary/30 to-background relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.03] [mask-image:radial-gradient(ellipse_at_center,white_20%,transparent_75%)]"></div>

        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-r from-accent/15 to-primary/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto max-w-2xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            {/* Welcome Header */}
            <div className="inline-flex items-center gap-3 px-8 py-4 mb-8 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 backdrop-blur-sm">
              <Sparkles className="w-8 h-8 text-primary" />
              <span className="text-primary font-bold text-2xl">مرحباً بك في Our Goal</span>
              <Sparkles className="w-8 h-8 text-accent" />
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
              🎉 أهلاً وسهلاً!
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              نحن سعداء لانضمامك إلى مجتمعنا التعليمي المتعاون
            </p>
            
            <div className="p-4 mb-8 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-700 dark:text-blue-400">
              <p className="font-medium">
                لإكمال عملية التسجيل، يرجى إضافة اسم المستخدم الخاص بك أدناه. هذا ضروري للوصول إلى جميع ميزات المنصة بما في ذلك الخطط الدراسية والفعاليات.
              </p>
            </div>

            {/* Features Preview */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
                { icon: Target, title: "خطط دراسية ذكية", desc: "مولد خطط مخصص" },
                { icon: CheckCircle, title: "مهام يومية", desc: "تتبع تقدمك" },
                { icon: User, title: "ملف شخصي", desc: "إحصائيات مفصلة" }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="p-6 bg-background/50 rounded-2xl border border-primary/10 backdrop-blur-sm"
                >
                  <feature.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-bold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Welcome Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-card/90 to-card/60 border-0 rounded-3xl backdrop-blur-xl shadow-2xl shadow-primary/10">
              <CardHeader className="text-center pb-8 pt-12">
                <div className="w-20 h-20 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <User className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="text-3xl font-bold text-foreground mb-3">
                  أخبرنا عن نفسك
                </CardTitle>
                <p className="text-muted-foreground text-lg">
                  ما الاسم الذي تود أن نناديك به؟
                </p>
              </CardHeader>

              <CardContent className="px-12 pb-12">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-4">
                    <Label htmlFor="username" className="text-xl font-bold text-foreground flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      اسمك المفضل
                    </Label>
                    <div className="relative">
                      <Input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="مثال: أحمد، فاطمة، محمد..."
                        className={`text-lg p-6 bg-background/50 rounded-xl text-center font-medium transition-colors ${
                          usernameError
                            ? 'border-destructive/50 focus:border-destructive'
                            : 'border-primary/20 focus:border-primary'
                        }`}
                        maxLength={50}
                        required
                      />
                      {isCheckingUsername && (
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>

                    {usernameError ? (
                      <p className="text-sm text-destructive text-center font-medium">
                        {usernameError}
                      </p>
                    ) : username.trim() && !isCheckingUsername ? (
                      <p className="text-sm text-green-600 text-center font-medium">
                        ✓ الاسم متاح
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center">
                        سيظهر هذا الاسم في ملفك الشخصي وعند التفاعل مع المجتمع
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting || !username.trim() || usernameError !== '' || isCheckingUsername}
                    className="w-full py-6 text-xl font-bold bg-gradient-to-r from-primary to-accent text-black rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin ml-2"></div>
                        جاري الحفظ...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-6 h-6 ml-2" />
                        ابدأ رحلتك التعليمية
                        <ArrowRight className="w-6 h-6 mr-2" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-8 p-6 bg-primary/5 rounded-2xl border border-primary/10">
                  <h4 className="font-bold text-primary mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    ما ينتظرك بعد ذلك:
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      إنشاء خطط دراسية مخصصة لاختبار القدرات
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      تتبع مهامك اليومية وتقدمك الدراسي
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      الوصول إلى مكتبة شاملة من الملفات التعليمية
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      الانضمام إلى مجتمع متعاون من الطلاب
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Welcome;
