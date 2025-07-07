import { Link } from "react-router-dom";
import {
  Lightbulb,
  Mail,
  Phone,
  MapPin,
  Star,
  Award,
  Users,
  BookOpen,
  Calculator,
  Home,
  Target,
  Send
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SHOW_COURSES_PAGE } from '../config/environment';

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-secondary via-secondary/90 to-background overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-r from-accent/10 to-primary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-xl blur-md opacity-50"></div>
                  <div className="relative bg-gradient-to-br from-primary to-accent p-3 rounded-xl shadow-lg">
                    <Lightbulb className="w-8 h-8 text-black" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text">
                    اور جول
                  </h3>
                  <p className="text-sm text-muted-foreground">منصة التميز التعليمي</p>
                </div>
              </div>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                مجتمع متعاون يجمع أشخاص من مختلف الخلفيات لمساعدة بعضهم البعض في التحضير لاختبار قياس ومشاركة التجارب والنصائح
              </p>

              {/* Community Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl border border-primary/20">
                  <div className="text-2xl font-bold text-primary">+23.7k</div>
                  <div className="text-xs text-muted-foreground">عضو في المجتمع</div>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-accent/10 to-primary/10 rounded-xl border border-accent/20">
                  <div className="text-2xl font-bold text-accent">4.8</div>
                  <div className="text-xs text-muted-foreground">تقييم المجتمع</div>
                </div>
              </div>

              {/* Community Badge */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl border border-primary/30">
                  <Star className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">مجتمع متميز</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">روابط سريعة</h3>
              </div>

              <ul className="space-y-3">
                <li>
                  <Link to="/" className="group flex items-center gap-3 text-muted-foreground hover:text-primary transition-all duration-300">
                    <Home className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                    <span>الرئيسية</span>
                  </Link>
                </li>
                <li>
                  <Link to="/equivalency-calculator" className="group flex items-center gap-3 text-muted-foreground hover:text-primary transition-all duration-300">
                    <Calculator className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                    <span>حاسبة المعادلة</span>
                  </Link>
                </li>
                <li>
                  <Link to="/files" className="group flex items-center gap-3 text-muted-foreground hover:text-primary transition-all duration-300">
                    <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                    <span>ملفات تعليمية</span>
                    <Badge variant="secondary" className="bg-primary/20 text-primary text-xs">جديد</Badge>
                  </Link>
                </li>
                <li>
                  <Link to="/study-plan" className="group flex items-center gap-3 text-muted-foreground hover:text-primary transition-all duration-300">
                    <Target className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                    <span>خطة الدراسة</span>
                    <Badge variant="secondary" className="bg-accent/20 text-accent text-xs">مولد ذكي</Badge>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">تواصل معنا</h3>
              </div>

              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">البريد الإلكتروني</div>
                    <div className="text-foreground font-medium">infoourgoal@gmail.com</div>
                  </div>
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Phone className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">الهاتف</div>
                    <div className="text-foreground font-medium">+966 54 3310024</div>
                  </div>
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">العنوان</div>
                    <div className="text-foreground font-medium">الرياض، السعودية</div>
                  </div>
                </li>
              </ul>
            </div>

            {/* Telegram & Newsletter */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                  <Send className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">تواصل مباشر</h3>
              </div>

              {/* Telegram Button */}
              <a
                href="t.me/Our_goal_is_success"
                target="_blank"
                rel="noopener noreferrer"
                className="group block mb-6"
              >
                <div className="p-4 bg-gradient-to-r from-[#0088cc]/20 to-[#0088cc]/10 border border-[#0088cc]/30 rounded-2xl hover:border-[#0088cc]/50 transition-all duration-300 hover:scale-105">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-[#0088cc] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Send className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-foreground font-bold">تليجرام</div>
                      <div className="text-sm text-muted-foreground">انضم للمجتمع</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">انضم لقناة المجتمع والدعم</p>
                </div>
              </a>

              {/* Community Highlights */}
              <div className="p-4 bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="text-foreground font-bold">مجتمع متعاون</span>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Star className="w-3 h-3 text-primary" />
                    <span>تجارب حقيقية</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Users className="w-3 h-3 text-primary" />
                    <span>أشخاص يساعدون أشخاص</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Award className="w-3 h-3 text-primary" />
                    <span>دعم شامل</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-primary/10 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                  <Lightbulb className="w-3 h-3 text-black" />
                </div>
                <span className="text-muted-foreground text-sm">
                  © {new Date().getFullYear()} منصة اور جول. جميع الحقوق محفوظة.
                </span>
                {/* المصباح الزخرفي يتحول إلى زر إذا كانت صفحة الكورسات مفعلة */}
                {SHOW_COURSES_PAGE ? (
                  <Link
                    to="/mockexam"
                    className="w-6 h-6 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-200 border border-primary/30"
                    title="الدورة الشاملة"
                  >
                    <Lightbulb className="w-3 h-3 text-black" />
                  </Link>
                ) : (
                  <div className="w-6 h-6 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                    <Lightbulb className="w-3 h-3 text-black" />
                  </div>
                )}
              </div>

              {/* Developer Credit */}
              <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
                <div className="w-4 h-4 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                  <span className="text-[10px] font-bold text-black">E</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  برمجة وتطوير: <span className="text-primary font-medium">Eslam</span>
                </span>
              </div>
           
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link to="/privacy" className="hover:text-primary transition-colors duration-300">
                سياسة الخصوصية
              </Link>
              <Link to="/terms" className="hover:text-primary transition-colors duration-300">
                شروط الاستخدام
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span>متاح الآن</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
