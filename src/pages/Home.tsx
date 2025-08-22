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
  name: "محمد عصام",
  role: "أفضل مسؤول لعام 2025",
  image: "https://lh7-rt.googleusercontent.com/formsz/AN7BsVBMOASvteMobnGZZppJjAdUNcbfGFjYCMdQjvvmZKkcHKuEEcCkvAaFe1sxOKWvTlHJIE0p1qEY-m5BYlAwc3KhNHYCNAj-tsT2W1GPzetovCNpiaLQezJFGyvgAKrzkDcZJlfkJvLxta3l_9HuTdBE5_8N-qNEFd88AA?key=QMELdh9ZpzbLaaa6u5zbXg",
  achievement: "أدار المجتمع بكفاءة عالية وحقق أفضل النتائج",
  badge: "👑",
  rank: 1,
  color: "from-yellow-400 via-amber-400 to-orange-500",
  borderColor: "from-yellow-500 to-amber-600",
  icon: Crown,
  glowColor: "yellow"
},
{
  id: 2,
  name: "محمد علاء",
  role: "أفضل شخصية لعام 2025",
  image: "/IMG_20250822_042926_275.jpg",
  achievement: "أثبت وجوده بحضوره المميز وأسلوبه الراقي، وكان مصدر إلهام وقدوة لباقي الأعضاء",
  badge: "🔥",
  rank: 2,
  color: "from-purple-400 via-pink-400 to-rose-500",
  borderColor: "from-purple-500 to-pink-600",
  icon: Flame,
  glowColor: "purple"
},
{
  id: 3,
  name: "عبدالرحمن وليد",
  role: "أفضل ليدر لعام 2025",
  image: "/2033920b-73bd-4bf5-9901-d2f4ad1325e8.jpeg",
  achievement: "أدار تيم التجميعات بروح قياديه وحماسيه ، عرف يوجّه ويدعم كل فرد فيه حتى صنع تيم متكامل مبدع وملهم",
  badge: "⭐",
  rank: 3,
  color: "from-blue-400 via-cyan-400 to-teal-500",
  borderColor: "from-blue-500 to-cyan-600",
  icon: Star,
  glowColor: "blue"
},
{
  id: 4,
  name: "نور محمود",
  role: "أفضل ادمن لعام 2025",
  image: "https://lh7-rt.googleusercontent.com/formsz/AN7BsVCiS_-DNi_iDZXz6TBXkFjV3XYS-UQyaA87zF6OXSyjlMcfBDnK9gOqSso9ye2p6hfIt-nYXb1JPV6AWwX8qWv1F5UyLbPUfIOaAEbnKaB_KV2qP-UqDZj0yVwCH1I6Vt0pDMlerpny-tW_WkrjwybgfdbkPocoqYYFDA?key=QMELdh9ZpzbLaaa6u5zbXg",
  achievement: "تابعت الجروب باستمرار ، وقدمت دعم مستمر لزملائها وكانت الاخت الأكبر لأعضاء الجروب ، ورغم الصعوبات اللي واجهتها إلا انها استمرّت بتقديم الدعم",
  badge: "💝",
  rank: 4,
  color: "from-green-400 via-emerald-400 to-teal-500",
  borderColor: "from-green-500 to-emerald-600",
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

{/* ⭐⭐⭐ قسم أفضل شخصيات المجتمع لعام 2025 - النسخة المحسنة للهواتف ⭐⭐⭐ */}

<section className="py-16 sm:py-24 md:py-32 px-4 relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-background">
  {/* خلفية متحركة رائعة */}
  <div className="absolute inset-0">
    <div className="absolute top-0 left-0 w-full h-full">
      {/* نجوم متحركة */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-pulse hidden sm:block"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}
        >
          <Sparkles className={`w-3 h-3 sm:w-4 sm:h-4 text-yellow-400/30`} />
        </div>
      ))}
    </div>


{/* دوائر متحركة ضخمة - مخفية في الهواتف */}
<div className="absolute top-10 right-10 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-gradient-to-r from-yellow-400/10 to-amber-400/10 rounded-full blur-3xl animate-pulse"></div>
<div className="absolute bottom-10 left-10 w-[200px] h-[200px] sm:w-[400px] sm:h-[400px] bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] bg-gradient-to-r from-blue-400/5 to-cyan-400/5 rounded-full blur-3xl animate-pulse delay-500"></div>


  </div>

  <div className="container mx-auto relative z-10">
    {/* رأس القسم الفخم */}
    <div className="text-center mb-12 sm:mb-16 md:mb-20">
      {/* شارة العام الجديد */}
      <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 mb-6 sm:mb-8 md:mb-10 rounded-full bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-2 border-yellow-500/30 backdrop-blur-sm animate-pulse">
        <Trophy className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-yellow-500" />
        <span className="text-yellow-500 font-bold text-sm sm:text-lg md:text-xl">تكريم خاص لعام 2025</span>
        <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-black border-0 text-xs sm:text-sm font-bold px-2 sm:px-3 py-1">
          حصري
        </Badge>
      </div>


  {/* العنوان الضخم */}
  <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-4 sm:mb-6 md:mb-8 leading-tight">
    <span className="block text-transparent bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-500 bg-clip-text animate-gradient mb-2 sm:mb-4">
      أبطال المجتمع
    </span>
    <span className="block text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl text-foreground">
      لعام 2025
    </span>
  </h2>

  <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8 sm:mb-10 md:mb-12 px-4">
    تكريم خاص للشخصيات التي صنعت الفرق وساهمت في نجاح آلاف الطلاب
  </p>

  {/* مؤشرات الإنجاز */}
  <div className="flex items-center justify-center gap-3 sm:gap-6 md:gap-8 flex-wrap mb-8 sm:mb-12 md:mb-16">
    <div className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1 sm:py-2 rounded-full bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20">
      <Crown className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-yellow-500" />
      <span className="text-yellow-500 font-bold text-xs sm:text-sm">4 أبطال</span>
    </div>
    <div className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1 sm:py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
      <Star className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-purple-500" />
      <span className="text-purple-500 font-bold text-xs sm:text-sm">إنجازات استثنائية</span>
    </div>
    <div className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1 sm:py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
      <Award className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-blue-500" />
      <span className="text-blue-500 font-bold text-xs sm:text-sm">تأثير حقيقي</span>
    </div>
  </div>
</div>

{/* شبكة البطاقات المحسنة للهواتف - 1 عمود في الهاتف، 2 في التابلت، 2 في الديسكتوب */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 md:gap-12 max-w-6xl mx-auto">
  {topMembers.map((member, index) => (
    <div
      key={member.id}
      className="relative group"
      onMouseEnter={() => setHoveredMember(member.id)}
      onMouseLeave={() => setHoveredMember(null)}
    >
      {/* هالة متحركة خلف البطاقة */}
      <div className={`absolute inset-0 bg-gradient-to-r ${member.color} rounded-2xl sm:rounded-3xl blur-xl sm:blur-2xl opacity-20 group-hover:opacity-40 transition-all duration-700 animate-pulse`}></div>
      
      {/* البطاقة الرئيسية */}
      <Card className="relative p-4 sm:p-6 md:p-8 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-xl border-2 border-primary/20 rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 hover:scale-105 hover:border-primary/40">
        {/* خلفية متحركة داخل البطاقة */}
        <div className="absolute inset-0 opacity-10">
          <div className={`absolute top-0 right-0 w-full h-full bg-gradient-to-br ${member.color} opacity-20`}></div>
        </div>

        {/* رقم الترتيب الفخم */}
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-gradient-to-r ${member.borderColor} rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl transform rotate-12 group-hover:rotate-0 transition-all duration-500`}>
            <span className="text-sm sm:text-lg md:text-2xl font-black text-black">#{member.rank}</span>
          </div>
        </div>

        {/* المحتوى */}
        <div className="relative z-10">
          <div className="flex flex-col items-center text-center">
            {/* الصورة المحسنة للهواتف */}
            <div className="relative mb-4 sm:mb-6">
              <div className={`absolute inset-0 bg-gradient-to-r ${member.borderColor} rounded-xl sm:rounded-2xl blur-md opacity-50 animate-pulse`}></div>
              <div className={`relative w-48 h-32 sm:w-56 sm:h-36 md:w-64 md:h-40 bg-gradient-to-r ${member.borderColor} p-1 rounded-xl sm:rounded-2xl`}>
                <div className="w-full h-full bg-card rounded-lg sm:rounded-xl overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full rounded-lg sm:rounded-xl object-contain"
                  />
                </div>
              </div>
              {/* الشارة */}
              <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 text-2xl sm:text-3xl md:text-4xl animate-bounce">
                {member.badge}
              </div>
            </div>

            {/* معلومات العضو */}
            <div className="w-full">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black mb-2 sm:mb-3 text-foreground">
                {member.name}
              </h3>
              
              <div className={`inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1 sm:py-2 rounded-full bg-gradient-to-r ${member.color} mb-3 sm:mb-4`}>
                <member.icon className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-black" />
                <span className="text-black font-bold text-xs sm:text-sm">{member.role}</span>
              </div>
              
              <p className="text-muted-foreground leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base md:text-lg">
                {member.achievement}
              </p>

              {/* شريط التميز */}
              <div className={`pt-4 sm:pt-6 border-t border-primary/10`}>
                <div className="flex items-center justify-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-yellow-500" />
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-yellow-500" />
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-yellow-500" />
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-yellow-500" />
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-yellow-500" />
                  </div>
                  <span className="text-xs sm:text-sm text-muted-foreground">عضو متميز</span>
                </div>
                
                <Badge className={`bg-gradient-to-r ${member.color} text-black border-0 font-bold px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm`}>
                  بطل 2025
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* تأثيرات الهوفر - مخفية في الهواتف الصغيرة */}
        {hoveredMember === member.id && (
          <div className="absolute inset-0 pointer-events-none hidden sm:block">
            <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-r ${member.color} opacity-5 animate-pulse`}></div>
            {[...Array(5)].map((_, i) => (
              <Sparkles
                key={i}
                className={`absolute text-${member.glowColor}-400 w-3 h-3 sm:w-4 sm:h-4 animate-ping`}
                style={{
                  top: `${20 + Math.random() * 60}%`,
                  left: `${20 + Math.random() * 60}%`,
                  animationDelay: `${i * 0.2}s`
                }}
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  ))}
</div>

{/* رسالة تحفيزية */}
<div className="text-center mt-12 sm:mt-16 md:mt-20">
  <Card className="max-w-4xl mx-auto p-6 sm:p-8 md:p-12 bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/20 rounded-2xl sm:rounded-3xl relative overflow-hidden">
    {/* خلفية متحركة */}
    <div className="absolute inset-0">
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-gradient-to-r from-yellow-400/20 to-amber-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-36 sm:h-36 md:w-48 md:h-48 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-500"></div>
    </div>

    <div className="relative z-10">
      <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 animate-bounce">
        <Trophy className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-black" />
      </div>

      <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-foreground">
        كن البطل القادم!
      </h3>

      <p className="text-sm sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
        هؤلاء أعضاء من جروب أور جول ساهموا بمساعدة زملائهم بشكل مستمر، وكان لهم دور إيجابي في دعم مئات الطلاب انضم إلينا وشارك بعلمك لتكون جزءاً من هذا العطاء.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
        <a
          href="https://linktr.ee/Our_goal"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto"
        >
          <Button size="lg" className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black rounded-xl shadow-lg shadow-yellow-500/30 transition-all duration-300 hover:scale-105">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            انضم للأبطال
          </Button>
        </a>

        <Button variant="outline" size="lg" className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg border-2 border-primary/30 hover:border-primary hover:bg-primary/5 rounded-xl transition-all duration-300">
          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
          شارك في المناقشة
        </Button>
      </div>

      {/* شارات التحفيز */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-6 mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-primary/10 flex-wrap">
        <div className="flex items-center gap-1 sm:gap-2 text-muted-foreground">
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-yellow-500" />
          <span className="text-xs sm:text-sm">كن متميزاً</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 text-muted-foreground">
          <Heart className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-pink-500" />
          <span className="text-xs sm:text-sm">ساعد الآخرين</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 text-muted-foreground">
          <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-green-500" />
          <span className="text-xs sm:text-sm">تطور باستمرار</span>
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
