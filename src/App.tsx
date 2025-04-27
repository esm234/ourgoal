import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Home from "@/pages/Home";
import QiyasTests from "@/pages/QiyasTests";
import TakeTest from "@/pages/TakeTest";
import Performance from "@/pages/Performance";
import EquivalencyCalculator from "@/pages/EquivalencyCalculator";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import TestManagement from "@/pages/TestManagement";
import TestQuestions from "@/pages/TestQuestions";
import EditTest from "@/pages/EditTest";
import Layout from "@/components/Layout";

const queryClient = new QueryClient();

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Layout>
                    <Route path="/" element={<Home />} />
                    <Route path="/qiyas-tests" element={<QiyasTests />} />
                    <Route path="/qiyas-tests/:testId" element={<TakeTest />} />
                    <Route path="/performance" element={<Performance />} />
                    <Route path="/equivalency-calculator" element={<EquivalencyCalculator />} />
                    <Route path="/test-management" element={<TestManagement />} />
                    <Route path="/test-management/:testId/questions" element={<TestQuestions />} />
                    <Route path="/test-management/:testId/edit" element={<EditTest />} />
                    <Route path="*" element={<NotFound />} />
                  </Layout>
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
