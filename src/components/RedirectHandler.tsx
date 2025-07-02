import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const RedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('جاري تسجيل الدخول...');

  useEffect(() => {
    // التحقق من وجود hash في URL (للـ OAuth redirects)
    const hash = window.location.hash;
    const isOAuthRedirect = hash.includes('access_token') || hash.includes('type=recovery');

    // فقط قم بمعالجة إعادة التوجيه إذا كان هناك OAuth redirect
    if (!isOAuthRedirect) {
      return;
    }

    // استخراج معلومات المصادقة من عنوان URL
    const handleAuthRedirect = async () => {
      setIsLoading(true);
      try {
        setMessage('جاري معالجة تسجيل الدخول...');
        // انتظار قليل للسماح لـ Supabase بمعالجة الـ OAuth
        await new Promise(resolve => setTimeout(resolve, 1500));

        // التحقق من وجود جلسة نشطة
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('خطأ في التحقق من الجلسة:', error);
          setMessage('حدث خطأ أثناء تسجيل الدخول. جاري إعادة التوجيه...');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        if (session) {
          console.log('تم العثور على جلسة نشطة:', session.user.email);

          // التحقق مما إذا كان المستخدم جديدًا أم لا
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('username, created_at')
            .eq('id', session.user.id)
            .single();

          if (profileError && profileError.code !== 'PGRST116') {
            console.error('خطأ في جلب معلومات الملف الشخصي:', profileError);
          }

          // إذا كان المستخدم جديدًا أو لم يكن لديه اسم مستخدم، توجيهه إلى صفحة الترحيب
          if (!profile || !profile.username) {
            setMessage('مرحبًا بك! جاري إعدادك...');
            setTimeout(() => navigate('/welcome'), 1000);
          } else {
            // المستخدم موجود بالفعل، توجيهه إلى الصفحة الرئيسية
            setMessage('تم تسجيل الدخول بنجاح! جاري التوجيه...');

            // التحقق من وجود مسار مخزن للعودة إليه
            const redirectPath = sessionStorage.getItem('redirectPath');
            if (redirectPath && redirectPath !== '/login' && redirectPath !== '/signup') {
              sessionStorage.removeItem('redirectPath');
              setTimeout(() => navigate(redirectPath), 1000);
            } else {
              setTimeout(() => navigate('/'), 1000);
            }
          }
        } else {
          // لم يتم العثور على جلسة
          console.log('لم يتم العثور على جلسة نشطة');
          setMessage('فشل في تسجيل الدخول. يرجى المحاولة مرة أخرى.');
          setTimeout(() => navigate('/login'), 2000);
        }
      } catch (err) {
        console.error('خطأ غير متوقع:', err);
        setMessage('حدث خطأ غير متوقع. جاري إعادة التوجيه...');
        setTimeout(() => navigate('/login'), 2000);
      } finally {
        setIsLoading(false);
      }
    };

    // تنفيذ معالجة إعادة التوجيه
    handleAuthRedirect();
  }, [navigate, location]);

  // فقط اعرض الرسالة إذا كان هناك OAuth redirect وجاري التحميل
  if (!isLoading) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="text-center p-8 rounded-lg shadow-lg bg-card max-w-md w-full">
        <div className="w-16 h-16 border-4 border-primary border-solid rounded-full border-t-transparent animate-spin mx-auto"></div>
        <p className="mt-6 text-lg font-medium">{message}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          إذا لم يتم إعادة توجيهك تلقائيًا،
          <button
            onClick={() => navigate('/')}
            className="text-primary hover:underline focus:outline-none mr-2"
          >
            انقر هنا
          </button>
        </p>
      </div>
    </div>
  );
};

export default RedirectHandler;
