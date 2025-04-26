
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Home from "@/pages/Home";
import QiyasTests from "@/pages/QiyasTests";
import TakeTest from "@/pages/TakeTest";
import Performance from "@/pages/Performance";
import EquivalencyCalculator from "@/pages/EquivalencyCalculator";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
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
            <Route path="/performance" element={<Performance />} />
            <Route path="/equivalency-calculator" element={<EquivalencyCalculator />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
