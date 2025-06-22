import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ENV } from '@/config/environment';

const RedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('جاري تسجيل الدخول...');

  useEffect(() => {
    // استخراج معلومات المصادقة من عنوان URL
    const handleAuthRedirect = async () => {
      try {
        // التحقق من وجود جلسة نشطة
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('خطأ في التحقق من الجلسة:', error);
          setMessage('حدث خطأ أثناء تسجيل الدخول. جاري إعادة التوجيه...');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }
        
        if (session) {
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
            setTimeout(() => navigate('/'), 1000);
          }
        } else {
          // لم يتم العثور على جلسة، توجيه المستخدم إلى صفحة تسجيل الدخول
          setMessage('لم يتم العثور على بيانات تسجيل الدخول. جاري إعادة التوجيه...');
          setTimeout(() => navigate('/login'), 1000);
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="text-center p-8 rounded-lg shadow-lg bg-card max-w-md w-full">
        <div className="w-16 h-16 border-4 border-primary border-solid rounded-full border-t-transparent animate-spin mx-auto"></div>
        <p className="mt-6 text-lg font-medium">{message}</p>
        {!isLoading && (
          <p className="mt-2 text-sm text-muted-foreground">
            إذا لم يتم إعادة توجيهك تلقائيًا، 
            <button 
              onClick={() => navigate('/')} 
              className="text-primary hover:underline focus:outline-none mr-2"
            >
              انقر هنا
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default RedirectHandler;
