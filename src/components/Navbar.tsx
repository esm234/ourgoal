import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Home, Calculator, LogIn, Menu, X, ShieldAlert, FileText, Target, User } from "lucide-react";
import LogoutButton from "./LogoutButton";

const Navbar = () => {
  const { isLoggedIn, role } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleToggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLinkClick = () => {
    // Scroll to top when navigation link is clicked
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  };

  const handleMobileLinkClick = () => {
    // Close mobile menu and scroll to top
    setIsMobileMenuOpen(false);
    handleLinkClick();
  };

  return (
    <nav className="bg-secondary py-4 px-6 shadow-md border-b border-primary/20">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary" onClick={handleLinkClick}>
            <img
              src="https://lh7-us.googleusercontent.com/d7hBCrZA_3y0BdJCEoFFXi8tGUcMNF5BzrJUvfJAwE22sCigDAhos0MacvrlSxtlA1woVP0wooNtrZxVOOQHhjK1oGOnCfsY638wT9a3yGV8CTGJ1--a7mSmMdb6gTjZcCsPvp-ClDd2HzPQqIrqXDEx5ns4T5M9x5mUc9lgrA2mei02TV1aQCNv0yx0cyTS-qfk192H?key=-6GPA2o9SRVVzzH5bmoicQ"
              alt="اور جول"
              className="w-14 h-14 object-contain rounded-lg"
            />
            Our goal is Success
          </Link>

          {/* Mobile Menu Button */}
          <div className="block lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleMenu}
              className="text-foreground hover:bg-primary/20 hover:text-primary"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 space-x-reverse">
            <Link
              to="/"
              className="flex items-center px-3 py-2 mx-2 rounded-md hover:bg-primary/10 hover:text-primary transition-colors"
              onClick={handleLinkClick}
            >
              <Home size={20} className="ml-2" />
              <span>الرئيسية</span>
            </Link>

            <Link
              to="/equivalency-calculator"
              className="flex items-center px-3 py-2 mx-2 rounded-md hover:bg-primary/10 hover:text-primary transition-colors"
              onClick={handleLinkClick}
            >
              <Calculator size={20} className="ml-2" />
              <span>حاسبة المعادلة</span>
            </Link>
            <Link
              to="/files"
              className="flex items-center px-3 py-2 mx-2 rounded-md hover:bg-primary/10 hover:text-primary transition-colors"
              onClick={handleLinkClick}
            >
              <FileText size={20} className="ml-2" />
              <span>ملفات تعليمية</span>
            </Link>
            <Link
              to="/study-plan"
              className="flex items-center px-3 py-2 mx-2 rounded-md hover:bg-primary/10 hover:text-primary transition-colors"
              onClick={handleLinkClick}
            >
              <Target size={20} className="ml-2" />
              <span>خطة الدراسة</span>
            </Link>

            {isLoggedIn ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center px-3 py-2 mx-2 rounded-md hover:bg-primary/10 hover:text-primary transition-colors"
                  onClick={handleLinkClick}
                >
                  <User size={20} className="ml-2" />
                  <span>الملف الشخصي</span>
                </Link>
              </>
            ) : null}

            <div className="flex items-center">
              {isLoggedIn ? (
                <>
                  {role === 'admin' && (
                    <Link
                      to="/admin"
                      className="flex items-center px-3 py-2 mx-2 rounded-md hover:bg-primary/10 hover:text-primary transition-colors"
                      onClick={handleLinkClick}
                    >
                      <ShieldAlert size={20} className="ml-2" />
                      <span>لوحة التحكم</span>
                    </Link>
                  )}
                  <LogoutButton className="px-3 py-2 mx-2 rounded-md hover:bg-primary/10 hover:text-primary transition-colors" />
                </>
              ) : (
                <Link to="/login" onClick={handleLinkClick}>
                  <Button
                    variant="ghost"
                    className="flex items-center px-3 py-2 mx-2 rounded-md hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <LogIn size={20} className="ml-2" />
                    <span>تسجيل الدخول</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 flex flex-col space-y-2">
            <Link
              to="/"
              className="flex items-center px-3 py-2 rounded-md hover:bg-primary/10 hover:text-primary transition-colors"
              onClick={handleMobileLinkClick}
            >
              <Home size={20} className="ml-2" />
              <span>الرئيسية</span>
            </Link>

            <Link
              to="/equivalency-calculator"
              className="flex items-center px-3 py-2 rounded-md hover:bg-primary/10 hover:text-primary transition-colors"
              onClick={handleMobileLinkClick}
            >
              <Calculator size={20} className="ml-2" />
              <span>حاسبة المعادلة</span>
            </Link>
            <Link
              to="/files"
              className="flex items-center px-3 py-2 rounded-md hover:bg-primary/10 hover:text-primary transition-colors"
              onClick={handleMobileLinkClick}
            >
              <FileText size={20} className="ml-2" />
              <span>ملفات تعليمية</span>
            </Link>
            <Link
              to="/study-plan"
              className="flex items-center px-3 py-2 rounded-md hover:bg-primary/10 hover:text-primary transition-colors"
              onClick={handleMobileLinkClick}
            >
              <Target size={20} className="ml-2" />
              <span>خطة الدراسة</span>
            </Link>

            {isLoggedIn && (
              <Link
                to="/profile"
                className="flex items-center px-3 py-2 rounded-md hover:bg-primary/10 hover:text-primary transition-colors"
                onClick={handleMobileLinkClick}
              >
                <User size={20} className="ml-2" />
                <span>الملف الشخصي</span>
              </Link>
            )}

            {isLoggedIn ? (
              <>
                {role === 'admin' && (
                  <Link
                    to="/admin"
                    className="flex items-center px-3 py-2 rounded-md hover:bg-primary/10 hover:text-primary transition-colors"
                    onClick={handleMobileLinkClick}
                  >
                    <ShieldAlert size={20} className="ml-2" />
                    <span>لوحة التحكم</span>
                  </Link>
                )}
                <LogoutButton
                  fullWidth
                  className="px-3 py-2 rounded-md hover:bg-primary/10 hover:text-primary transition-colors"
                  onLogoutSuccess={() => setIsMobileMenuOpen(false)}
                />
              </>
            ) : (
              <Link
                to="/login"
                className="w-full"
                onClick={handleMobileLinkClick}
              >
                <Button
                  variant="ghost"
                  className="flex items-center justify-start px-3 py-2 rounded-md hover:bg-primary/10 hover:text-primary transition-colors w-full"
                >
                  <LogIn size={20} className="ml-2" />
                  <span>تسجيل الدخول</span>
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
