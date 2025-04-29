import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface LogoutButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  className?: string;
  onLogoutSuccess?: () => void;
  fullWidth?: boolean;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({
  variant = 'ghost',
  className = '',
  onLogoutSuccess,
  fullWidth = false,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoggedIn } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    if (!isLoggedIn) return;
    
    setIsLoggingOut(true);
    try {
      // Clear any stored auth data from localStorage
      localStorage.removeItem("sb-upucoktebmehokwamavi-auth-token");
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      toast({
        title: "تم تسجيل الخروج بنجاح",
        description: "سيتم تحويلك إلى الصفحة الرئيسية",
      });
      
      if (onLogoutSuccess) {
        onLogoutSuccess();
      }
      
      // Navigate to home page and force a complete page reload
      navigate('/');
      window.location.href = '/'; // Force a complete page reload to clear all state
      
    } catch (error: any) {
      toast({
        title: "خطأ في تسجيل الخروج",
        description: error.message || "حدث خطأ أثناء تسجيل الخروج",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Button
      variant={variant}
      className={`flex items-center ${fullWidth ? 'justify-start w-full' : ''} ${className}`}
      onClick={handleLogout}
      disabled={isLoggingOut}
    >
      <LogOut size={20} className="ml-2" />
      <span>{isLoggingOut ? 'جاري تسجيل الخروج...' : 'تسجيل الخروج'}</span>
    </Button>
  );
};

export default LogoutButton; 