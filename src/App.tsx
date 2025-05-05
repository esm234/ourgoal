import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Home from "@/pages/Home";
import QiyasTests from "@/pages/QiyasTests";
import TakeTest from "@/pages/TakeTest";
import EquivalencyCalculator from "@/pages/EquivalencyCalculator";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import TestManagement from "@/pages/TestManagement";
import TestQuestions from "@/pages/TestQuestions";
import EditTest from "@/pages/EditTest";
import UserProfile from "@/pages/UserProfile";
import ProfileSetup from "@/pages/ProfileSetup";
import AdminDashboard from "@/pages/AdminDashboard";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";


const queryClient = new QueryClient();

const App = () => {
  
  // إضافة حماية ضد التفتيش
  useEffect(() => {
    // استدعاء وظيفة مكافحة التفتيش
    initAntiDebug();

    // تعطيل النقر بزر الماوس الأيمن
    const disableRightClick = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };
    
    // تعطيل اختصارات لوحة المفاتيح المتعلقة بأدوات المطور
    const disableDevTools = (e: KeyboardEvent) => {
      // F12 key
      if (e.keyCode === 123) {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+I / Cmd+Option+I
      if ((e.ctrlKey && e.shiftKey && e.keyCode === 73) || 
          (e.metaKey && e.altKey && e.keyCode === 73)) {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+J / Cmd+Option+J
      if ((e.ctrlKey && e.shiftKey && e.keyCode === 74) || 
          (e.metaKey && e.altKey && e.keyCode === 74)) {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+C / Cmd+Option+C
      if ((e.ctrlKey && e.shiftKey && e.keyCode === 67) || 
          (e.metaKey && e.altKey && e.keyCode === 67)) {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+U / Cmd+U (View Source)
      if ((e.ctrlKey && e.keyCode === 85) || 
          (e.metaKey && e.keyCode === 85)) {
        e.preventDefault();
        return false;
      }
    };
    
    // تعطيل التفتيش باستخدام كائن DevTools
    const disableConsole = () => {
      // محاولة الكشف عن فتح أدوات المطور
      const checkDevTools = setInterval(() => {
        const widthThreshold = window.outerWidth - window.innerWidth > 160;
        const heightThreshold = window.outerHeight - window.innerHeight > 160;
        
        if (widthThreshold || heightThreshold) {
          // يمكنك إضافة إجراء هنا، مثل إعادة توجيه الصفحة
          // window.location.href = '/';
          document.body.innerHTML = "تم اكتشاف محاولة تفتيش الموقع";
        }
      }, 1000);
      
      return () => clearInterval(checkDevTools);
    };
    
    document.addEventListener('contextmenu', disableRightClick);
    document.addEventListener('keydown', disableDevTools);
    const cleanup = disableConsole();
    
    return () => {
      document.removeEventListener('contextmenu', disableRightClick);
      document.removeEventListener('keydown', disableDevTools);
      cleanup();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/qiyas-tests" element={<QiyasTests />} />
              <Route path="/qiyas-tests/:testId" element={<TakeTest />} />
              <Route path="/equivalency-calculator" element={<EquivalencyCalculator />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/profile-setup" element={<ProfileSetup />} />

              {/* Protected Routes */}
              <Route path="/test-management" element={
                <ProtectedRoute>
                  <TestManagement />
                </ProtectedRoute>
              } />
              <Route path="/test-management/:testId/questions" element={
                <ProtectedRoute>
                  <TestQuestions />
                </ProtectedRoute>
              } />
              <Route path="/test-management/:testId/edit" element={
                <ProtectedRoute>
                  <EditTest />
                </ProtectedRoute>
              } />
              <Route path="/user-profile" element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              } />

              <Route path="/admin" element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

