import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();
  const location = useLocation();

  // If still loading auth state, show nothing (or could show a loader)
  if (loading) {
    return null;
  }

  // If not logged in, redirect to login page with the return url
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If logged in, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute; 