import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Home from "@/pages/Home";
import EquivalencyCalculator from "@/pages/EquivalencyCalculator";
import Files from "@/pages/Files";
import FileDetails from "@/pages/FileDetails";
import StudyPlan from "@/pages/StudyPlan";
import Profile from "@/pages/Profile";
import Welcome from "@/pages/Welcome";
import PlanDetails from "@/pages/PlanDetails";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminFiles from "@/pages/AdminFiles";
import AdminExams from "@/pages/AdminExams";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import FAQ from "@/pages/FAQ";
import MaintenancePage from "@/components/MaintenancePage";
import ScrollToTop from "@/components/ScrollToTop";

// Set this to true to enable maintenance mode
const MAINTENANCE_MODE = false;

const queryClient = new QueryClient();

const App = () => {
  if (MAINTENANCE_MODE) {
    return <MaintenancePage />;
  }

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/equivalency-calculator" element={<EquivalencyCalculator />} />
              <Route path="/files" element={<Files />} />
              <Route path="/files/:id" element={<FileDetails />} />
              <Route path="/study-plan" element={<StudyPlan />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/plan-details/:planId" element={<PlanDetails />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              <Route path="/admin" element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />

              <Route path="/admin/files" element={
                <ProtectedRoute adminOnly={true}>
                  <AdminFiles />
                </ProtectedRoute>
              } />

              <Route path="/admin/files/:fileId/exams" element={
                <ProtectedRoute adminOnly={true}>
                  <AdminExams />
                </ProtectedRoute>
              } />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
