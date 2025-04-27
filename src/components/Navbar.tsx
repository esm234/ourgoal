import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Home, Book, Calculator, BarChart, LogIn, LogOut, Menu, X, User } from "lucide-react";

const Navbar = () => {
  const { isLoggedIn, username, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Theme state and effect
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleToggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-secondary py-4 px-6 shadow-md transition-colors duration-500">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-primary">
            منصة اسرار للتفوق
          </Link>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="ml-2 p-2 rounded-full shadow-md bg-secondary border border-border text-2xl transition-colors duration-300 hover:bg-primary/10"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? '🌞' : '🌙'}
          </button>

          {/* Mobile Menu Button */}
          <div className="block lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleMenu}
              className="text-foreground"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 space-x-reverse">
            <Link
              to="/"
              className="flex items-center px-3 py-2 mx-2 rounded-md hover:bg-muted transition-colors"
            >
              <Home size={20} className="ml-2" />
              <span>الرئيسية</span>
            </Link>
            <Link
              to="/qiyas-tests"
              className="flex items-center px-3 py-2 mx-2 rounded-md hover:bg-muted transition-colors"
            >
              <Book size={20} className="ml-2" />
              <span>اختبارات قياس</span>
            </Link>
            <Link
              to="/equivalency-calculator"
              className="flex items-center px-3 py-2 mx-2 rounded-md hover:bg-muted transition-colors"
            >
              <Calculator size={20} className="ml-2" />
              <span>حاسبة المعادلة</span>
            </Link>
            <Link
              to="/performance"
              className="flex items-center px-3 py-2 mx-2 rounded-md hover:bg-muted transition-colors"
            >
              <BarChart size={20} className="ml-2" />
              <span>لوحة الأداء</span>
            </Link>

            {isLoggedIn ? (
              <div className="flex items-center">
                <div className="flex items-center px-3 py-2 mx-2 text-foreground">
                  <User size={20} className="ml-2" />
                  <span>مرحباً، {username}</span>
                </div>
                <Button
                  variant="ghost"
                  className="flex items-center px-3 py-2 mx-2 rounded-md hover:bg-muted transition-colors"
                  onClick={logout}
                >
                  <LogOut size={20} className="ml-2" />
                  <span>تسجيل الخروج</span>
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button
                  variant="ghost"
                  className="flex items-center px-3 py-2 mx-2 rounded-md hover:bg-muted transition-colors"
                >
                  <LogIn size={20} className="ml-2" />
                  <span>تسجيل الدخول</span>
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 flex flex-col space-y-2">
            <Link
              to="/"
              className="flex items-center px-3 py-2 rounded-md hover:bg-muted transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Home size={20} className="ml-2" />
              <span>الرئيسية</span>
            </Link>
            <Link
              to="/qiyas-tests"
              className="flex items-center px-3 py-2 rounded-md hover:bg-muted transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Book size={20} className="ml-2" />
              <span>اختبارات قياس</span>
            </Link>
            <Link
              to="/equivalency-calculator"
              className="flex items-center px-3 py-2 rounded-md hover:bg-muted transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Calculator size={20} className="ml-2" />
              <span>جلسة المعادلة</span>
            </Link>
            <Link
              to="/performance"
              className="flex items-center px-3 py-2 rounded-md hover:bg-muted transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <BarChart size={20} className="ml-2" />
              <span>لوحة الأداء</span>
            </Link>

            {isLoggedIn ? (
              <>
                <div className="flex items-center px-3 py-2 text-foreground">
                  <User size={20} className="ml-2" />
                  <span>مرحباً، {username}</span>
                </div>
                <Button
                  variant="ghost"
                  className="flex items-center justify-start px-3 py-2 rounded-md hover:bg-muted transition-colors w-full"
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <LogOut size={20} className="ml-2" />
                  <span>تسجيل الخروج</span>
                </Button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="w-full"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Button
                  variant="ghost"
                  className="flex items-center justify-start px-3 py-2 rounded-md hover:bg-muted transition-colors w-full"
                >
                  <LogIn size={20} className="ml-2" />
                  <span>تسجيل الدخول</span>
                </Button>
              </Link>
            )}

            {/* Theme Toggle Button for mobile */}
            <button
              onClick={toggleTheme}
              className="mt-2 p-2 rounded-full shadow-md bg-secondary border border-border text-2xl transition-colors duration-300 hover:bg-primary/10 self-end"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? '🌞' : '🌙'}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
