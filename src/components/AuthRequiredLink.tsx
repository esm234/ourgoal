import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoginDialog from "./LoginDialog";

interface AuthRequiredLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  loginMessage?: string;
}

const AuthRequiredLink: React.FC<AuthRequiredLinkProps> = ({
  to,
  children,
  className = "",
  loginMessage = "يرجى تسجيل الدخول للوصول إلى هذه الميزة"
}) => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (isLoggedIn) {
      navigate(to);
    } else {
      setShowLoginDialog(true);
    }
  };

  return (
    <>
      <a href="#" onClick={handleClick} className={className}>
        {children}
      </a>
      
      <LoginDialog
        isOpen={showLoginDialog}
        setIsOpen={setShowLoginDialog}
        redirectPath={to}
        description={loginMessage}
      />
    </>
  );
};

export default AuthRequiredLink; 