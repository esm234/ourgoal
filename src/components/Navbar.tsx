import { useState } from “react”;
import { Link } from “react-router-dom”;
import { Button } from “@/components/ui/button”;
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from “@/components/ui/dropdown-menu”;
import { useAuth } from “@/contexts/AuthContext”;
import { Home, Calculator, LogIn, Menu, X, FileText, Target, User, HelpCircle, LogOut, Trophy, Timer, Bell, BookOpen, ExternalLink } from “lucide-react”;
import NotificationBell from “./notifications/NotificationBell”;
import { SHOW_COURSES_BANNER, SHOW_NOTIFICATIONS_BELL } from ‘../config/environment’;

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
behavior: ‘smooth’
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
console.error(‘Error logging out:’, error);
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
Our goal is success
</Link>

```
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

        <a
href=""
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center px-3 py-2 mx-2 rounded-md hover:bg-primary/10 hover:text-primary transition-colors"
        >
          <ExternalLink size={20} className="ml-2" />
          <span>محاكي اور جول</span>
        </a>

        <Link
          to="/files"
          className="flex items-center px-3 py-2 mx-2 rounded-md hover:bg-primary/10 hover:text-primary transition-colors"
          onClick={handleLinkClick}
        >
          <FileText size={20} className="ml-2" />
          <span>الملفات </span>
        </Link>
        {SHOW_COURSES_BANNER && (
          <Link
            to="/courses"
            className="flex items-center px-3 py-2 mx-2 rounded-md hover:bg-primary/10 hover:text-primary transition-colors"
            onClick={handleLinkClick}
          >
            <BookOpen size={20} className="ml-2" />
            <span> الدورات</span>
          </Link>
        )}
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
            <span>الفعاليات الاسبوعية</span>
          </Link>
        )}

        {isLoggedIn ? (
          <>
            {/* Notification Bell for Desktop */}
            {SHOW_NOTIFICATIONS_BELL && <NotificationBell className="mx-2" />}
            
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
              <DropdownMenuContent align="end" className="bg-secondary border-primary/20">
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
      <div className="max-[1200px]:block min-[1201px]:hidden mt-4 flex flex-col space-y-2">
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

        <a
          href=""
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center px-3 py-2 rounded-md hover:bg-primary/10 hover:text-primary transition-colors"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <ExternalLink size={20} className="ml-2" />
          <span>محاكي اور جول</span>
        </a>

        <Link
          to="/files"
          className="flex items-center px-3 py-2 rounded-md hover:bg-primary/10 hover:text-primary transition-colors"
          onClick={handleMobileLinkClick}
        >
          <FileText size={20} className="ml-2" />
          <span>ملفات تعليمية</span>
        </Link>
        {SHOW_COURSES_BANNER && (
          <Link
            to="/courses"
            className="flex items-center px-3 py-2 rounded-md hover:bg-primary/10 hover:text-primary transition-colors"
            onClick={handleMobileLinkClick}
          >
            <BookOpen size={20} className="ml-2" />
            <span>الدورات </span>
          </Link>
        )}
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
          <>
            <Link
              to="/weekly-events"
              className="flex items-center px-3 py-2 rounded-md hover:bg-primary/10 hover:text-primary transition-colors"
              onClick={handleMobileLinkClick}
            >
              <Trophy size={20} className="ml-2" />
              <span>الفعاليات</span>
            </Link>
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
            {SHOW_NOTIFICATIONS_BELL && (
              <Link
                to="/notifications"
                className="flex items-center px-3 py-2 rounded-md hover:bg-primary/10 hover:text-primary transition-colors"
                onClick={handleMobileLinkClick}
              >
                <Bell size={20} className="ml-2" />
                <span>الإشعارات</span>
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 rounded-md hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <LogOut size={20} className="ml-2" />
              <span>تسجيل الخروج</span>
            </button>
          </>
        )}

        {!isLoggedIn && (
          <Link
            to="/login"
            className="flex items-center px-3 py-2 rounded-md hover:bg-primary/10 hover:text-primary transition-colors"
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
