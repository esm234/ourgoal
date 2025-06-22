import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const RedirectHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // استخراج معلومات المصادقة من عنوان URL
    const handleAuthRedirect = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('خطأ في التحقق من الجلسة:', error);
        navigate('/login');
        return;
      }
      
      if (session) {
        // تم تسجيل الدخول بنجاح، توجيه المستخدم إلى الصفحة الرئيسية
        navigate('/');
      } else {
        // لم يتم العثور على جلسة، توجيه المستخدم إلى صفحة تسجيل الدخول
        navigate('/login');
      }
    };

    handleAuthRedirect();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-16 h-16 border-4 border-primary border-solid rounded-full border-t-transparent animate-spin"></div>
      <p className="mt-4 text-lg">جاري تسجيل الدخول...</p>
    </div>
  );
};

export default RedirectHandler;
