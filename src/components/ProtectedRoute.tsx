import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const { isLoggedIn, loading, role } = useAuth();
  const location = useLocation();
  const { toast } = useToast();

  // If still loading auth state, show nothing (or could show a loader)
  if (loading) {
    return null;
  }

  // If not logged in, redirect to login page with the return url
  if (!isLoggedIn) {
    // حفظ المسار الحالي للعودة إليه بعد تسجيل الدخول
    sessionStorage.setItem('redirectPath', location.pathname + location.search);
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If adminOnly and user is not an admin, redirect to home with a message
  if (adminOnly && role !== 'admin') {
    toast({
      title: "غير مصرح",
      description: "هذه الصفحة متاحة للمشرفين فقط",
      variant: "destructive",
    });
    return <Navigate to="/" replace />;
  }

  // If logged in and passes admin check, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;
