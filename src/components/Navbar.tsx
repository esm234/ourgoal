import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import {
  Home,
  Calculator,
  LogIn,
  Menu,
  X,
  FileText,
  Target,
  User,
  HelpCircle,
  LogOut,
  Trophy,
  Timer,
  Bell,
  BookOpen,
  GraduationCap,
  MonitorPlay,
  Star,

} from "lucide-react";
import NotificationBell from "./notifications/NotificationBell";
import {
  SHOW_COURSES_BANNER,
  SHOW_NOTIFICATIONS_BELL,
} from "../config/environment";

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleToggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLinkClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
    handleLinkClick();
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsMobileMenuOpen(false);
      handleLinkClick();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const linkClasses =
    "flex items-center px-4 py-2 mx-1 rounded-md hover:bg-primary/10 hover:text-primary transition-colors text-sm font-medium";

  return (
    <nav className="bg-secondary py-4 px-6 shadow-md border-b border-primary/20">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-primary"
            onClick={handleLinkClick}
          >
            <img
              src="https://lh7-us.googleusercontent.com/d7hBCrZA_3y0BdJCEoFFXi8tGUcMNF5BzrJUvfJAwE22sCigDAhos0MacvrlSxtlA1woVP0wooNtrZxVOOQHhjK1oGOnCfsY638wT9a3yGV8CTGJ1--a7mSmMdb6gTjZcCsPvp-ClDd2HzPQqIrqXDEx5ns4T5M9x5mUc9lgrA2mei02TV1aQCNv0yx0cyTS-qfk192H?key=-6GPA2o9SRVVzzH5bmoicQ"
              alt="اور جول"
              className="w-12 h-12 object-contain rounded-lg"
            />
            Our goal is success
          </Link>

          {/* Mobile Menu Button */}
          <div className="block max-[1200px]:block min-[1201px]:hidden">
            <div className="flex items-center">
              {SHOW_NOTIFICATIONS_BELL && <NotificationBell className="mr-2" />}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleToggleMenu}
                className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden min-[1201px]:flex items-center space-x-1 space-x-reverse">
            <Link to="/" className={linkClasses} onClick={handleLinkClick}>
              <Home size={20} className="ml-2" />
              <span>الرئيسية</span>
            </Link>

            <Link
              to="/equivalency-calculator"
              className={linkClasses}
              onClick={handleLinkClick}
            >
              <Calculator size={20} className="ml-2" />
              <span>حاسبة المعادلة</span>
            </Link>

            {/* New External Link */}
            <a
              href="https://exam.ourgoal.site"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClasses}
            >
              <MonitorPlay size={20} className="ml-2" />
              <span>المحاكي</span>
            </a>

            {/* Educational Resources Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={linkClasses}>
                  <GraduationCap size={20} className="ml-2" />
                  <span>المصادر التعليمية</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-secondary border-primary/20"
              >
                <DropdownMenuItem asChild>
                  <Link
                    to="/files"
                    className="flex items-center cursor-pointer hover:bg-primary/10 transition-colors"
                    onClick={handleLinkClick}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    <span>الملفات والتجميعات</span>
                  </Link>
                </DropdownMenuItem>
                {SHOW_COURSES_BANNER && (
                  <DropdownMenuItem asChild>
                    <Link
                      to="/courses"
                      className="flex items-center cursor-pointer hover:bg-primary/10 transition-colors"
                      onClick={handleLinkClick}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      <span>الدورات</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link
                    to="/faq"
                    className="flex items-center cursor-pointer hover:bg-primary/10 transition-colors"
                    onClick={handleLinkClick}
                  >
                    <HelpCircle className="w-4 h-4 mr-2" />
                    <span>الأسئلة الشائعة</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              to="/study-plan"
              className={linkClasses}
              onClick={handleLinkClick}
            >
              <Target size={20} className="ml-2" />
              <span>خطة الدراسة</span>
            </Link>

            {isLoggedIn && (
              <Link
                to="/weekly-events"
                className={linkClasses}
                onClick={handleLinkClick}
              >
                <Trophy size={20} className="ml-2" />
                <span>الفعاليات الاسبوعية</span>
              </Link>
            )}

            {isLoggedIn ? (
              <>
                {SHOW_NOTIFICATIONS_BELL && (
                  <NotificationBell className="mx-2" />
                )}
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
                  <DropdownMenuContent
                    align="end"
                    className="bg-secondary border-primary/20"
                  >
                    <DropdownMenuItem asChild>
                      <Link
                        to="/profile"
                        className="flex items-center cursor-pointer hover:bg-primary/10 transition-colors"
                        onClick={handleLinkClick}
                      >
                        <User className="w-4 h-4 mr-2" />
                        <span>الملف الشخصي</span>
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
                    {SHOW_NOTIFICATIONS_BELL && (
                      <DropdownMenuItem asChild>
                        <Link
                          to="/notifications"
                          className="flex items-center cursor-pointer hover:bg-primary/10 transition-colors"
                          onClick={handleLinkClick}
                        >
                          <Bell className="w-4 h-4 mr-2" />
                          <span>الإشعارات</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="bg-primary/20" />
                    <DropdownMenuItem
                      className="cursor-pointer hover:bg-primary/10 transition-colors"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      <span>تسجيل الخروج</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link to="/login" onClick={handleLinkClick}>
                <Button variant="ghost" className={linkClasses}>
                  <LogIn size={20} className="ml-2" />
                  <span>تسجيل الدخول</span>
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="max-[1200px]:block min-[1201px]:hidden mt-4 flex flex-col space-y-2">
            <Link to="/" className={linkClasses} onClick={handleMobileLinkClick}>
              <Home size={20} className="ml-2" />
              <span>الرئيسية</span>
            </Link>

            <Link
              to="/equivalency-calculator"
              className={linkClasses}
              onClick={handleMobileLinkClick}
            >
              <Calculator size={20} className="ml-2" />
              <span>حاسبة المعادلة</span>
            </Link>

            {/* External Link Mobile */}
            <a
              href="https://exam.ourgoal.site"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClasses}
            >
              <MonitorPlay size={20} className="ml-2" />
              <span>المحاكي</span>
            </a>

            {/* Educational Resources */}
            <div className="pl-4 border-l-2 border-primary/20">
              <div className="flex items-center px-3 py-2 text-primary font-medium">
                <GraduationCap size={20} className="ml-2" />
                <span>المصادر التعليمية</span>
              </div>
              <Link
                to="/files"
                className={linkClasses + " pr-6"}
                onClick={handleMobileLinkClick}
              >
                <FileText size={18} className="ml-2" />
                <span>الملفات والتجميعات</span>
              </Link>
              {SHOW_COURSES_BANNER && (
                <Link
                  to="/courses"
                  className={linkClasses + " pr-6"}
                  onClick={handleMobileLinkClick}
                >
                  <BookOpen size={18} className="ml-2" />
                  <span>الدورات</span>
                </Link>
              )}
              <Link
                to="/faq"
                className={linkClasses + " pr-6"}
                onClick={handleMobileLinkClick}
              >
                <HelpCircle size={18} className="ml-2" />
                <span>الأسئلة الشائعة</span>
              </Link>
            </div>

            <Link
              to="/study-plan"
              className={linkClasses}
              onClick={handleMobileLinkClick}
            >
              <Target size={20} className="ml-2" />
              <span>خطة الدراسة</span>
            </Link>

            {isLoggedIn && (
              <>
                <Link
                  to="/weekly-events"
                  className={linkClasses}
                  onClick={handleMobileLinkClick}
                >
                  <Trophy size={20} className="ml-2" />
                  <span>الفعاليات</span>
                </Link>
                <Link
                  to="/profile"
                  className={linkClasses}
                  onClick={handleMobileLinkClick}
                >
                  <User size={20} className="ml-2" />
                  <span>الملف الشخصي</span>
                </Link>
                <Link
                  to="/pomodoro"
                  className={linkClasses}
                  onClick={handleMobileLinkClick}
                >
                  <Timer size={20} className="ml-2" />
                  <span>مؤقت البومودورو</span>
                </Link>
                {SHOW_NOTIFICATIONS_BELL && (
                  <Link
                    to="/notifications"
                    className={linkClasses}
                    onClick={handleMobileLinkClick}
                  >
                    <Bell size={20} className="ml-2" />
                    <span>الإشعارات</span>
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className={linkClasses}
                >
                  <LogOut size={20} className="ml-2" />
                  <span>تسجيل الخروج</span>
                </button>
              </>
            )}

            {!isLoggedIn && (
              <Link
                to="/login"
                className={linkClasses}
                onClick={handleMobileLinkClick}
              >
                <LogIn size={20} className="ml-2" />
                <span>تسجيل الدخول</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
