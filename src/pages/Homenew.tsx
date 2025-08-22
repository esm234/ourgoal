import React, { useState, useEffect } from 'react';
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import EventsSection from "@/components/EventsSection";
import AdsSlider from "@/components/AdsSlider";
import {
  ArrowRight,
  Calculator,
  Trophy,
  Users,
  Star,
  CheckCircle,
  FileText,
  Target,
  Brain,
  Zap,
  Clock,
  Lightbulb,
  Crown,
  Award,
  Medal,
  Sparkles,
  Heart,
  MessageCircle,
  TrendingUp,
  UserCheck,
  Flame
} from "lucide-react";
import { addSystemUpdateNotification } from "@/services/localNotifications";
import { SHOW_COURSES_BANNER } from '../config/environment';

// مفتاح التخزين المحلي للإشعارات
const NOTIFICATIONS_STORAGE_KEY = 'ourgoal_local_notifications';

// رقم الإصدار الحالي
const CURRENT_VERSION = '2.5.0';

// مفتاح لتتبع ما إذا تم عرض إشعار التحديث
const UPDATE_NOTIFICATION_SHOWN_KEY = 'ourgoal_update_notification_shown';

// متغير لإظهار إعلان محاكي الاختبار
const SHOW_EXAM_SIMULATOR_AD = true;

const Home = () => {
  const [hoveredMember, setHoveredMember] = useState(null);

  // بيانات أفضل الشخصيات - 4 فقط
  const topMembers = [
    {
      id: 1,
      name: "محمد علاء",
      role: "أفضل أدمن لعام 2025",
      image: "/IMG_20250822_042926_275.jpg",
      achievement: "قدم أكثر من 1000 مساعدة وأدار المجتمع بكفاءة عالية",
      badge: "👑",
      rank: 1,
      color: "from-yellow-400 via-amber-400 to-orange-500",
      borderColor: "from-yellow-500 to-amber-600",
      stats: { 
        helps: "1000+", 
        posts: "500+", 
        likes: "10K+",
        rating: "5.0"
      },
      icon: Crown,
      glowColor: "yellow"
    },
    {
      id: 2,
      name: "محمد عصام",
      role: "أنشط عضو في المناقشات",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sara2025&backgroundColor=ffd5dc",
      achievement: "شاركت في أكثر من 800 نقاش وساعدت مئات الطلاب",
      badge: "🔥",
      rank: 2,
      color: "from-purple-400 via-pink-400 to-rose-500",
      borderColor: "from-purple-500 to-pink-600",
      stats: { 
        discussions: "800+", 
        solutions: "400+", 
        upvotes: "5K+",
        rating: "4.9"
      },
      icon: Flame,
      glowColor: "purple"
    },
    {
      id: 3,
      name: "ابراهيم حسن",
      role: "أفضل منشئ محتوى",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mohammed2025&backgroundColor=c0aede",
      achievement: "أنشأ أكثر من 100 ملف تعليمي حقق 20 ألف تحميل",
      badge: "⭐",
      rank: 3,
      color: "from-blue-400 via-cyan-400 to-teal-500",
      borderColor: "from-blue-500 to-cyan-600",
      stats: { 
        files: "100+", 
        downloads: "20K+", 
        quality: "98%",
        rating: "4.9"
      },
      icon: Star,
      glowColor: "blue"
    },
    {
      id: 4,
      name: "نورا السالم",
      role: "أفضل داعم للمجتمع",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nora2025&backgroundColor=ffd5dc",
      achievement: "ساعدت أكثر من 500 طالب وحصلت على أعلى تقييم",
      badge: "💝",
      rank: 4,
      color: "from-green-400 via-emerald-400 to-teal-500",
      borderColor: "from-green-500 to-emerald-600",
      stats: { 
        helped: "500+", 
        thanks: "2K+", 
        impact: "95%",
        rating: "5.0"
      },
      icon: Heart,
      glowColor: "green"
    }
  ];

  useEffect(() => {
    const updateNotificationShown = localStorage.getItem(UPDATE_NOTIFICATION_SHOWN_KEY);
    
    if (updateNotificationShown === CURRENT_VERSION) {
      return;
    }
    
    const storedNotifications = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    
    let hasVersionNotification = false;
    
    if (storedNotifications) {
      try {
        const notifications = JSON.parse(storedNotifications);
        
        hasVersionNotification = notifications.some(
          (notification: any) => 
            notification.type === 'system' && 
            notification.metadata?.category === 'update' &&
            notification.metadata?.version === CURRENT_VERSION
        );
      } catch (error) {
        console.error('خطأ في تحليل الإشعارات المخزنة:', error);
      }
    }
    
    if (!hasVersionNotification) {
      addSystemUpdateNotification(
        'تحديث جديد: إصدار 2.5.0',
        'تم إطلاق تحديث جديد للنظام يتضمن العديد من الميزات والتحسينات الجديدة. انقر لعرض التفاصيل.',
        [
          'إضافة صفحة دورات واضافة دورة the last dance - دورة تاسيس لفظي',
          'تحديث نظام البومودورو مع إضافة إحصائيات متقدمة',
          'اضافة نظام اشعارات',
          'تحسينات في الأداء وإصلاح مشكلات متعددة',
          'دعم وضع الظلام الكامل في جميع صفحات التطبيق'
        ],
        '2.5.0',
        'high'
      );
    }
    
    localStorage.setItem(UPDATE_NOTIFICATION_SHOWN_KEY, CURRENT_VERSION);
  }, []);

  const homeStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "اور جول - Our Goal",
    "alternateName": "Our Goal",
    "description": "منصة تعليمية متخصصة في مساعدة الطلاب على التحضير لاختبار القدرات العامة",
    "url": "https://ourgoal.site",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://ourgoal.site/files?search={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "mainEntity": {
      "@type": "EducationalOrganization",
      "name": "اور جول - Our Goal",
      "description": "مجتمع تعليمي متعاون لمساعدة الطلاب في التحضير لاختبار القدرات",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "خدمات التدريب على اختبار القدرات",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Course",
              "name": "حاسبة المعادلة",
              "description": "حاسبة لتحويل درجات اختبار القدرات إلى معدل تقديري"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Course",
              "name": "خطة دراسية مخصصة",
              "description": "مولد خطط دراسية ذكية لاختبار القدرات"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Course",
              "name": "ملفات تدريبية",
              "description": "مواد تعليمية شاملة للقسمين الكمي واللفظي"
            }
          }
        ]
      }
    }
  };

      
return (
    <Layout>
      <SEO
        title="اور جول - Our Goal | منصة تعليمية لاختبار القدرات"
        description="منصة تعليمية متخصصة في مساعدة الطلاب على التحضير لاختبار القدرات العامة. نوفر خطط دراسية مخصصة، ملفات تدريبية، وحاسبة المعادلة لضمان نجاحك."
        keywords="اختبار القدرات, قدرات, تدريب, دراسة, منصة تعليمية, اور جول, Our Goal, قياس, اختبارات, تحضير, خطة دراسية, حاسبة المعادلة, ملفات تدريبية, مجتمع تعليمي"
        url="/"
        type="website"
        structuredData={homeStructuredData}
      />

      {/* نظام Slider للإعلانات الجديد */}
      <AdsSlider 
        showExamAd={SHOW_EXAM_SIMULATOR_AD} 
        showCoursesBanner={SHOW_COURSES_BANNER} 
      />


      {/* Modern Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-secondary/30 to-background">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-r from-accent/15 to-primary/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 pt-20">
          <div className="text-center max-w-5xl mx-auto">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-6 py-3 mb-8 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 backdrop-blur-sm">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-primary font-medium">مجتمع متعاون للتحضير لقياس</span>
              <Badge variant="secondary" className="bg-primary/20 text-primary border-0">نساعدك في النجاح</Badge>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
              <span className="block text-foreground mb-2">مجموعة تساعدك</span>
              <span className="block text-transparent bg-gradient-to-r from-primary via-accent to-primary bg-clip-text animate-pulse">
                في تحقيق هدفك
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              مجموعة من الأشخاص الذين اجتازوا اختبار قياس، نشارك تجاربنا ونقدم الدعم والمساعدة لتحقيق أفضل النتائج
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <a
                href="https://linktr.ee/Our_goal"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" className="group relative px-8 py-6 text-lg font-bold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-black rounded-2xl shadow-2xl shadow-primary/30 transition-all duration-500 hover:scale-105 hover:shadow-3xl hover:shadow-primary/50">
                  <span className="flex items-center gap-3">
                    <Users className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                    انضم للمجتمع
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Button>
              </a>

              <Link to="/equivalency-calculator">
                <Button variant="outline" size="lg" className="px-8 py-6 text-lg border-2 border-primary/30 hover:border-primary hover:bg-primary/5 rounded-2xl transition-all duration-300 hover:scale-105">
                  <Calculator className="w-5 h-5 ml-2" />
                  حاسبة المعادلة
                </Button>
              </Link>
            </div>

                        {/* Community Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">+23.7k</div>
                <div className="text-muted-foreground">عضو في المجتمع</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">+150</div>
                <div className="text-muted-foreground">اختبار متاح</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">+100</div>
                <div className="text-muted-foreground"> ملفاتنا</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">24/7</div>
                <div className="text-muted-foreground">مجتمع نشط  </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

   {/* ⭐⭐⭐ قسم أفضل شخصيات المجتمع لعام 2025 - التصميم المحسن ⭐⭐⭐ */}
      <section className="py-32 px-4 relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-background">
        {/* خلفية متحركة رائعة */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full">
            {/* نجوم متحركة */}
            {[...Array(25)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-pulse"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`
                }}
              >
                <Sparkles className={`w-${3 + Math.floor(Math.random() * 3)} h-${3 + Math.floor(Math.random() * 3)} text-yellow-400/30`} />
              </div>
            ))}
          </div>
          
          {/* دوائر متحركة ضخمة */}
          <div className="absolute top-10 right-10 w-[600px] h-[600px] bg-gradient-to-r from-yellow-400/10 to-amber-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-r from-blue-400/5 to-cyan-400/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="container mx-auto relative z-10">
          {/* رأس القسم الفخم */}
          <div className="text-center mb-24">
            {/* شارة العام الجديد */}
            <div className="inline-flex items-center gap-3 px-10 py-5 mb-12 rounded-full bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-2 border-yellow-500/30 backdrop-blur-sm animate-pulse shadow-2xl shadow-yellow-500/20">
              <Trophy className="w-10 h-10 text-yellow-500" />
              <span className="text-yellow-500 font-bold text-2xl">تكريم خاص لعام 2025</span>
              <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-black border-0 text-lg font-bold px-4 py-2">
                حصري
              </Badge>
            </div>

            {/* العنوان الضخم */}
            <h2 className="text-6xl md:text-7xl lg:text-8xl font-black mb-10 leading-tight">
              <span className="block text-transparent bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-500 bg-clip-text animate-gradient mb-6">
                أبطال المجتمع
              </span>
              <span className="block text-4xl md:text-5xl lg:text-6xl text-foreground">
                لعام 2025
              </span>
            </h2>

            <p className="text-2xl md:text-3xl text-muted-foreground max-w-5xl mx-auto leading-relaxed mb-16">
              تكريم خاص للشخصيات التي صنعت الفرق وساهمت في نجاح آلاف الطلاب
            </p>

            {/* مؤشرات الإنجاز */}
            <div className="flex items-center justify-center gap-10 flex-wrap mb-20">
              <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 shadow-lg">
                <Crown className="w-6 h-6 text-yellow-500" />
                <span className="text-yellow-500 font-bold text-lg">4 أبطال</span>
              </div>
              <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 shadow-lg">
                <Star className="w-6 h-6 text-purple-500" />
                <span className="text-purple-500 font-bold text-lg">إنجازات استثنائية</span>
              </div>
              <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 shadow-lg">
                <Award className="w-6 h-6 text-blue-500" />
                <span className="text-blue-500 font-bold text-lg">تأثير حقيقي</span>
              </div>
            </div>
          </div>

          {/* شبكة البطاقات المحسنة - 2x2 */}
          <div className="grid md:grid-cols-2 gap-16 max-w-7xl mx-auto">
            {topMembers.map((member, index) => (
              <div
                key={member.id}
                className="relative group"
                onMouseEnter={() => setHoveredMember(member.id)}
                onMouseLeave={() => setHoveredMember(null)}
              >
                {/* هالة متحركة خلف البطاقة */}
                <div className={`absolute inset-0 bg-gradient-to-r ${member.color} rounded-3xl blur-3xl opacity-20 group-hover:opacity-50 transition-all duration-700 animate-pulse scale-110`}></div>
                
                {/* البطاقة الرئيسية */}
                <Card className="relative p-10 bg-gradient-to-br from-card/95 to-card/60 backdrop-blur-xl border-2 border-primary/20 rounded-3xl overflow-hidden transition-all duration-500 hover:scale-105 hover:border-primary/50 shadow-2xl hover:shadow-3xl">
                  {/* خلفية متحركة داخل البطاقة */}
                  <div className="absolute inset-0 opacity-10">
                    <div className={`absolute top-0 right-0 w-full h-full bg-gradient-to-br ${member.color} opacity-30`}></div>
                  </div>

                  {/* رقم الترتيب الفخم */}
                  <div className="absolute top-6 right-6 z-20">
                    <div className={`w-20 h-20 bg-gradient-to-r ${member.borderColor} rounded-2xl flex items-center justify-center shadow-2xl transform rotate-12 group-hover:rotate-0 transition-all duration-500`}>
                      <span className="text-3xl font-black text-black">#{member.rank}</span>
                    </div>
                  </div>

                  {/* المحتوى */}
                  <div className="relative z-10">
                    <div className="flex flex-col items-center text-center">
                      {/* الصورة الأكبر مع إطار فخم */}
                      <div className="relative mb-8">
                        <div className={`absolute inset-0 bg-gradient-to-r ${member.borderColor} rounded-3xl blur-lg opacity-60 animate-pulse scale-110`}></div>
                        <div className={`relative w-72 h-48 bg-gradient-to-r ${member.borderColor} p-2 rounded-3xl shadow-2xl`}>
                          <div className="w-full h-full bg-card rounded-2xl overflow-hidden">
                            <img 
                              src={member.image} 
                              alt={member.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          </div>
                        </div>
                        {/* الشارة الأكبر */}
                        <div className="absolute -bottom-3 -right-3 text-5xl animate-bounce shadow-2xl">
                          {member.badge}
                        </div>
                      </div>

                      {/* معلومات العضو */}
                      <div className="w-full">
                        <h3 className="text-4xl font-black mb-4 text-foreground group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent group-hover:bg-clip-text transition-all duration-300">
                          {member.name}
                        </h3>
                        
                        <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r ${member.color} mb-6 shadow-lg`}>
                          <member.icon className="w-6 h-6 text-black" />
                          <span className="text-black font-bold text-lg">{member.role}</span>
                        </div>
                        
                        <p className="text-muted-foreground leading-relaxed mb-8 text-xl max-w-md mx-auto">
                          {member.achievement}
                        </p>

                        {/* إحصائيات العضو */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                          {Object.entries(member.stats).map(([key, value], idx) => (
                            <div key={idx} className="text-center p-3 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10">
                              <div className="text-2xl font-bold text-primary">{value}</div>
                              <div className="text-sm text-muted-foreground capitalize">{key}</div>
                            </div>
                          ))}
                        </div>

                        {/* شريط التميز */}
                        <div className={`pt-8 border-t border-primary/20`}>
                          <div className="flex items-center justify-center gap-2 mb-6">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                            ))}
                          </div>
                          
                          <Badge className={`bg-gradient-to-r ${member.color} text-black border-0 font-bold px-6 py-3 text-lg shadow-lg`}>
                            🏆 بطل 2025
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* تأثيرات الهوفر المحسنة */}
                  {hoveredMember === member.id && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-r ${member.color} opacity-10 animate-pulse`}></div>
                      {[...Array(8)].map((_, i) => (
                        <Sparkles
                          key={i}
                          className={`absolute text-${member.glowColor}-400 w-5 h-5 animate-ping`}
                          style={{
                            top: `${15 + Math.random() * 70}%`,
                            left: `${15 + Math.random() * 70}%`,
                            animationDelay: `${i * 0.15}s`
                          }}
                        />
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            ))}
          </div>

          {/* رسالة تحفيزية محسنة */}
          <div className="text-center mt-24">
            <Card className="max-w-5xl mx-auto p-16 bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/20 rounded-3xl relative overflow-hidden shadow-2xl">
              {/* خلفية متحركة */}
              <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-r from-yellow-400/20 to-amber-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-500"></div>
              </div>

              <div className="relative z-10">
                                <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-bounce shadow-2xl">
                  <Trophy className="w-12 h-12 text-black" />
                </div>

                <h3 className="text-5xl font-bold mb-6 text-foreground">
                  كن البطل القادم!
                </h3>

                <p className="text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
                  هؤلاء الأبطال بدأوا مثلك تماماً، بالعمل الجاد والمساعدة المستمرة وصلوا لهذا المستوى. 
                  انضم لمجتمعنا وكن جزءاً من قصة النجاح القادمة!
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center mb-10">
                  <a
                    href="https://linktr.ee/Our_goal"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="lg" className="px-10 py-5 text-xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black rounded-2xl shadow-lg shadow-yellow-500/30 transition-all duration-300 hover:scale-105">
                      <Users className="w-6 h-6 ml-2" />
                      انضم للأبطال
                    </Button>
                  </a>

                  <Button variant="outline" size="lg" className="px-10 py-5 text-xl border-2 border-primary/30 hover:border-primary hover:bg-primary/5 rounded-2xl transition-all duration-300">
                    <MessageCircle className="w-6 h-6 ml-2" />
                    شارك في المناقشات
                  </Button>
                </div>

                {/* شارات التحفيز */}
                <div className="flex items-center justify-center gap-8 mt-10 pt-10 border-t border-primary/10">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Sparkles className="w-6 h-6 text-yellow-500" />
                    <span className="text-lg">كن متميزاً</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Heart className="w-6 h-6 text-pink-500" />
                    <span className="text-lg">ساعد الآخرين</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <TrendingUp className="w-6 h-6 text-green-500" />
                    <span className="text-lg">تطور باستمرار</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

 




                




      {/* Beautiful Features Section */}
      <section className="py-32 px-4 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-r from-accent/10 to-primary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto relative z-10">
          {/* Enhanced Section Header */}
          <div className="text-center mb-24">
            <div className="inline-flex items-center gap-3 px-8 py-4 mb-8 rounded-full bg-gradient-to-r from-primary/15 to-accent/15 border border-primary/30 backdrop-blur-sm">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-black" />
              </div>
              <span className="text-primary font-bold text-lg">مجتمع متعاون ومساعد</span>
              <Badge variant="secondary" className="bg-primary/20 text-primary border-0 text-xs">نساعدك</Badge>
            </div>

            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
              <span className="block text-foreground mb-2">كيف نساعدك</span>
              <span className="block text-transparent bg-gradient-to-r from-primary via-accent to-primary bg-clip-text animate-gradient">
                في رحلتك
              </span>
            </h2>

            <p className="text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
              مجموعة من الأشخاص الذين مروا بنفس التجربة، نشارك معك ما تعلمناه ونساعدك على تجنب الأخطاء وتحقيق أفضل النتائج
            </p>

            {/* New Features Coming Soon Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-3 mb-8 rounded-full bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/20 backdrop-blur-sm">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              <span className="text-accent font-medium">نطور خدمات ومميزات جديدة لتجربة أفضل</span>
              <Badge variant="secondary" className="bg-accent/20 text-accent border-0 text-xs">قريباً</Badge>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span>تجارب حقيقية</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span>مساعدة شاملة</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span>دعم مستمر</span>
              </div>
            </div>
          </div>

          {/* Enhanced Features Grid */}
          <div className="grid lg:grid-cols-3 gap-12 mb-20">
            {/* Feature 1 - Calculator */}
            <Link to="/equivalency-calculator" className="group relative block">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
              <Card className="relative p-10 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border border-primary/20 rounded-3xl hover:border-primary/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/25 group overflow-hidden cursor-pointer">
                {/* Floating Elements */}
                <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-r from-accent/10 to-primary/10 rounded-full blur-xl opacity-30 group-hover:opacity-70 transition-opacity duration-500"></div>

                <div className="relative z-10">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/30 to-accent/30 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                    <Calculator className="w-10 h-10 text-primary" />
                  </div>

                  <h3 className="text-3xl font-bold mb-6 text-foreground group-hover:text-primary transition-colors duration-300">
                    حاسبة المعادلة
                  </h3>

                  <p className="text-muted-foreground mb-8 leading-relaxed text-lg">
                    احسب معدلك التقديري بدقة عالية باستخدام أحدث معادلات القبول الجامعي، أداة مجانية وسهلة الاستخدام
                  </p>

                  <div className="flex items-center gap-3 text-primary font-bold text-lg group-hover:gap-4 transition-all duration-300">
                    <span>احسب معدلك</span>
                    <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <ArrowRight className="w-4 h-4 text-black" />
                    </div>
                  </div>

                  {/* Feature Stats */}
                  <div className="flex items-center gap-6 mt-8 pt-6 border-t border-primary/10">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">دقيق</div>
                      <div className="text-xs text-muted-foreground">100%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">سريع</div>
                      <div className="text-xs text-muted-foreground">فوري</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">مجاني</div>
                      <div className="text-xs text-muted-foreground">بالكامل</div>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>

            {/* Feature 2 - Educational Resources */}
            <Link to="/files" className="group relative block">
              <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-primary/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
              <Card className="relative p-10 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border border-primary/20 rounded-3xl hover:border-accent/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-accent/25 group overflow-hidden cursor-pointer">
                {/* Floating Elements */}
                <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-r from-accent/10 to-primary/10 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-xl opacity-30 group-hover:opacity-70 transition-opacity duration-500"></div>

                <div className="relative z-10">
                  <div className="w-20 h-20 bg-gradient-to-br from-accent/30 to-primary/30 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 shadow-lg">
                    <FileText className="w-10 h-10 text-accent" />
                  </div>

                  <h3 className="text-3xl font-bold mb-6 text-foreground group-hover:text-accent transition-colors duration-300">
                    ملفات ومواد تعليمية
                  </h3>

                  <p className="text-muted-foreground mb-8 leading-relaxed text-lg">
                    مجموعة شاملة من الملفات والمواد التعليمية المفيدة لكلا القسمين الكمي واللفظي، مع شروحات وأمثلة تطبيقية
                  </p>

                  <div className="flex items-center gap-3 text-accent font-bold text-lg group-hover:gap-4 transition-all duration-300">
                    <span>تصفح المواد</span>
                    <div className="w-8 h-8 bg-gradient-to-r from-accent to-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <ArrowRight className="w-4 h-4 text-black" />
                    </div>
                  </div>

                  {/* Feature Stats */}
                  <div className="flex items-center gap-6 mt-8 pt-6 border-t border-accent/10">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">الكمي</div>
                      <div className="text-xs text-muted-foreground">تاسيس ومحوسب</div>
                    </div>
                    <div className="text-center">
                                            <div className="text-2xl font-bold text-accent">اللفظي</div>
                      <div className="text-xs text-muted-foreground">ملخصات</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">شامل</div>
                      <div className="text-xs text-muted-foreground">لكلا القسمين</div>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>

            {/* Feature 3 - Community Support */}
            <a
              href="https://linktr.ee/Our_goal"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
              <Card className="relative p-10 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border border-primary/20 rounded-3xl hover:border-primary/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/25 group overflow-hidden cursor-pointer">
                {/* Floating Elements */}
                <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-r from-accent/10 to-primary/10 rounded-full blur-xl opacity-30 group-hover:opacity-70 transition-opacity duration-500"></div>

                <div className="relative z-10">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/30 to-accent/30 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                    <Users className="w-10 h-10 text-primary" />
                  </div>

                  <h3 className="text-3xl font-bold mb-6 text-foreground group-hover:text-primary transition-colors duration-300">
                    مجتمع داعم ومتفاعل
                  </h3>

                  <p className="text-muted-foreground mb-8 leading-relaxed text-lg">
                    انضم لمجتمع من الأشخاص المتحمسين، نساعد بعضنا البعض، نجيب على الأسئلة، ونشارك النصائح والتجارب
                  </p>

                  <div className="flex items-center gap-3 text-primary font-bold text-lg group-hover:gap-4 transition-all duration-300">
                    <span>انضم للمجتمع</span>
                    <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <ArrowRight className="w-4 h-4 text-black" />
                    </div>
                  </div>

                  {/* Feature Stats */}
                  <div className="flex items-center gap-6 mt-8 pt-6 border-t border-primary/10">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">+23.7k</div>
                      <div className="text-xs text-muted-foreground">عضو</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">نشط</div>
                      <div className="text-xs text-muted-foreground">دائماً</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">مساعدة</div>
                      <div className="text-xs text-muted-foreground">فورية</div>
                    </div>
                  </div>
                </div>
              </Card>
            </a>

          </div>

          {/* Study Plan Generator - Featured Section */}
          <Link to="/study-plan" className="group relative block">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
            <Card className="relative p-10 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border border-primary/20 rounded-3xl hover:border-primary/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/25 group overflow-hidden cursor-pointer">
              {/* Floating Elements */}
              <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-r from-accent/10 to-primary/10 rounded-full blur-xl opacity-30 group-hover:opacity-70 transition-opacity duration-500"></div>

              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-primary/30 to-accent/30 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                  <Target className="w-10 h-10 text-primary" />
                </div>

                <h3 className="text-3xl font-bold mb-6 text-foreground group-hover:text-primary transition-colors duration-300">
                  مولد خطة الدراسة الذكي
                </h3>

                <p className="text-muted-foreground mb-8 leading-relaxed text-lg">
                  أنشئ خطة دراسية مخصصة ومنظمة بناءً على تاريخ اختبارك وعدد مرات المراجعة المطلوبة، مع توزيع ذكي للاختبارات
                </p>

                <div className="flex items-center gap-3 text-primary font-bold text-lg group-hover:gap-4 transition-all duration-300">
                  <span>أنشئ خطتك الآن</span>
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <ArrowRight className="w-4 h-4 text-black" />
                  </div>
                </div>

                {/* Feature Stats */}
                <div className="flex items-center gap-6 mt-8 pt-6 border-t border-primary/10">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">ذكي</div>
                    <div className="text-xs text-muted-foreground">توزيع تلقائي</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">مخصص</div>
                    <div className="text-xs text-muted-foreground">حسب وقتك</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">منظم</div>
                    <div className="text-xs text-muted-foreground">خطة واضحة</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">قابل للتصدير</div>
                    <div className="text-xs text-muted-foreground">احفظ خطتك</div>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </section>

      {/* Events Section */}
      <EventsSection />

      {/* Success Stories & CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-secondary/30 to-background relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-r from-accent/10 to-primary/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto relative z-10">
          {/* Community Success */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-foreground">
              نجاحات <span className="text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text">مجتمعنا</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              مجتمع متعاون من الطلاب والخريجين، نساعد بعضنا البعض في تحقيق الأهداف الأكاديمية
            </p>
          </div>

          {/* Community Metrics */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <Card className="p-6 text-center bg-gradient-to-br from-card to-card/50 border border-primary/10 rounded-2xl">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div className="text-3xl font-bold text-primary mb-2">+23.7k</div>
              <div className="text-muted-foreground">طالب في المجتمع</div>
            </Card>

            <Card className="p-6 text-center bg-gradient-to-br from-card to-card/50 border border-primary/10 rounded-2xl">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <div className="text-3xl font-bold text-primary mb-2">+100</div>
              <div className="text-muted-foreground">ملف لفظي وكمي</div>
            </Card>

            <Card className="p-6 text-center bg-gradient-to-br from-card to-card/50 border border-primary/10 rounded-2xl">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <div className="text-3xl font-bold text-primary mb-2">مجاني</div>
              <div className="text-muted-foreground">بالكامل</div>
            </Card>

            <Card className="p-6 text-center bg-gradient-to-br from-card to-card/50 border border-primary/10 rounded-2xl">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-6 h-6 text-primary" />
              </div>
              <div className="text-3xl font-bold text-primary mb-2">دقيق</div>
              <div className="text-muted-foreground">حاسبة المعادلة</div>
            </Card>
          </div>

          {/* Final CTA */}
          <div className="text-center">
            <Card className="max-w-4xl mx-auto p-12 bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 rounded-3xl">
              <div className="mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Users className="w-10 h-10 text-black" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                  انضم لمجتمعنا المتعاون اليوم
                </h3>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  كن جزءاً من مجتمع متعاون، نساعد بعضنا البعض في الدراسة والتحضير الأكاديمي ونشارك التجارب والنصائح
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://linktr.ee/Our_goal"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="lg" className="px-8 py-4 text-lg font-bold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-black rounded-xl shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-105">
                    <Users className="w-5 h-5 ml-2" />
                    انضم للمجتمع الآن
                  </Button>
                </a>

                <Link to="/files" className="group">
                  <Button variant="outline" size="lg" className="px-8 py-4 text-lg border-2 border-primary/30 hover:border-primary hover:bg-primary/5 rounded-xl transition-all duration-300">
                    <FileText className="w-5 h-5 ml-2" />
                    تصفح الملفات
                  </Button>
                </Link>
              </div>

              {/* Community Indicators */}
              <div className="flex items-center justify-center gap-8 mt-8 pt-8 border-t border-primary/10">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-5 h-5 text-primary" />
                  <span>مجتمع متعاون</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Star className="w-5 h-5 text-primary" />
                  <span>تجارب حقيقية</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>دعم شامل</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

    </Layout>
  );
};

export default Home;
