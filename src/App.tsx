import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import Login from "@/pages/Login";
import ProfileSetup from "@/pages/ProfileSetup";
// ... other imports ...

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn, loading, needsProfileSetup } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (needsProfileSetup) {
    return <Navigate to="/profile-setup" />;
  }

  return <>{children}</>;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout>
                  {/* Your protected routes here */}
                </Layout>
              </PrivateRoute>
            }
          />
          {/* Add other routes here */}
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
};

export default App;
