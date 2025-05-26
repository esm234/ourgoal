import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { Home, Calculator, LogIn, Menu, X, FileText, Target, User, HelpCircle, LogOut, Trophy, Timer } from "lucide-react";

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();
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

  const handleLogout = async () => {
    try {
      await logout();
      setIsMobileMenuOpen(false);
      handleLinkClick();
    } catch (error) {
      console.error('Error logging out:', error);
    }
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
            <Link
              to="/faq"
              className="flex items-center px-3 py-2 mx-2 rounded-md hover:bg-primary/10 hover:text-primary transition-colors"
              onClick={handleLinkClick}
            >
              <HelpCircle size={20} className="ml-2" />
              <span>الأسئلة الشائعة</span>
            </Link>

            {isLoggedIn && (
              <Link
                to="/weekly-events"
                className="flex items-center px-3 py-2 mx-2 rounded-md hover:bg-primary/10 hover:text-primary transition-colors"
                onClick={handleLinkClick}
              >
                <Trophy size={20} className="ml-2" />
                <span>الفعاليات الأسبوعية</span>
              </Link>
            )}

            {isLoggedIn ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      <User size={20} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-background/95 backdrop-blur-xl border-primary/20">
                    <DropdownMenuItem asChild>
                      <Link
                        to="/profile"
                        className="flex items-center cursor-pointer hover:bg-primary/10 transition-colors"
                        onClick={handleLinkClick}
                      >
                        <User className="w-4 h-4 mr-2" />
                        <span>عرض الملف الشخصي</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/pomodoro"
                        className="flex items-center cursor-pointer hover:bg-primary/10 transition-colors"
                        onClick={handleLinkClick}
                      >
                        <Timer className="w-4 h-4 mr-2" />
                        <span>مؤقت البومودورو</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-primary/20" />
                    <DropdownMenuItem
                      className="cursor-pointer hover:bg-destructive/10 text-destructive hover:text-destructive transition-colors"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      <span>تسجيل الخروج</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : null}

            <div className="flex items-center">
              {!isLoggedIn && (
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
            <Link
              to="/faq"
              className="flex items-center px-3 py-2 rounded-md hover:bg-primary/10 hover:text-primary transition-colors"
              onClick={handleMobileLinkClick}
            >
              <HelpCircle size={20} className="ml-2" />
              <span>الأسئلة الشائعة</span>
            </Link>

            {isLoggedIn && (
              <Link
                to="/weekly-events"
                className="flex items-center px-3 py-2 rounded-md hover:bg-primary/10 hover:text-primary transition-colors"
                onClick={handleMobileLinkClick}
              >
                <Trophy size={20} className="ml-2" />
                <span>الفعاليات الأسبوعية</span>
              </Link>
            )}

            {isLoggedIn && (
              <>
                <Link
                  to="/profile"
                  className="flex items-center px-3 py-2 rounded-md hover:bg-primary/10 hover:text-primary transition-colors"
                  onClick={handleMobileLinkClick}
                >
                  <User size={20} className="ml-2" />
                  <span>الملف الشخصي</span>
                </Link>

                <Link
                  to="/pomodoro"
                  className="flex items-center px-3 py-2 rounded-md hover:bg-primary/10 hover:text-primary transition-colors"
                  onClick={handleMobileLinkClick}
                >
                  <Timer size={20} className="ml-2" />
                  <span>مؤقت البومودورو</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 rounded-md hover:bg-destructive/10 text-destructive hover:text-destructive transition-colors w-full text-right"
                >
                  <LogOut size={20} className="ml-2" />
                  <span>تسجيل الخروج</span>
                </button>
              </>
            )}

            {!isLoggedIn && (
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
