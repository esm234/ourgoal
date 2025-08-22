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
  Flame,
  Rocket,
  BookOpen,
  GraduationCap,
  Shield,
  Gift,
  ChevronRight,
  ArrowUpRight,
  Gem,
  Infinity
} from "lucide-react";
import { addSystemUpdateNotification } from "@/services/localNotifications";
import { SHOW_COURSES_BANNER } from '../config/environment';

// مفتاح التخزين المحلي للإشعارات
const NOTIFICATIONS_STORAGE_KEY = 'ourgoal_local_notifications';
const CURRENT_VERSION = '2.5.0';
const UPDATE_NOTIFICATION_SHOWN_KEY = 'ourgoal_update_notification_shown';
const SHOW_EXAM_SIMULATOR_AD = true;

const Home = () => {
  const [hoveredMember, setHoveredMember] = useState(null);
  const [activeFeature, setActiveFeature] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  // تأثير حركة السكرول
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // بيانات أفضل الشخصيات
  const topMembers = [
    {
      id: 1,
      name: "محمد عصام",
      role: "أفضل أدمن لعام 2025",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sara2025&backgroundColor=ffd5dc",
      achievement: "أدار المجتمع بكفاءة عالية وحقق أفضل النتائج",
      badge: "👑",
      rank: 1,
      stats: { posts: 450, helps: 1200, rating: 5.0 },
      color: "from-yellow-400 via-amber-400 to-orange-500",
      borderColor: "from-yellow-500 to-amber-600",
      icon: Crown,
      glowColor: "yellow"
    },
    {
      id: 2,
      name: "محمد علاء",
      role: "أنشط عضو في المناقشات",
      image: "/IMG_20250822_042926_275.jpg",
      achievement: "شارك بفاعلية في النقاشات وكان له أثر مميز بين الزملاء",
      badge: "🔥",
      rank: 2,
      stats: { posts: 380, helps: 950, rating: 4.9 },
      color: "from-purple-400 via-pink-400 to-rose-500",
      borderColor: "from-purple-500 to-pink-600",
      icon: Flame,
      glowColor: "purple"
    },
    {
      id: 3,
      name: "ابراهيم حسن",
      role: "أفضل مساهم",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mohammed2025&backgroundColor=c0aede",
      achievement: "ساهم بشكل فعال في تطوير المحتوى",
      badge: "⭐",
      rank: 3,
      stats: { posts: 320, helps: 780, rating: 4.8 },
      color: "from-blue-400 via-cyan-400 to-teal-500",
      borderColor: "from-blue-500 to-cyan-600",
      icon: Star,
      glowColor: "blue"
    },
    {
      id: 4,
      name: "نورا أحمد",
      role: "أفضل داعمة",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nora2025&backgroundColor=ffd5dc",
      achievement: "قدمت الدعم المستمر للأعضاء الجدد",
      badge: "💝",
      rank: 4,
      stats: { posts: 280, helps: 650, rating: 4.7 },
      color: "from-green-400 via-emerald-400 to-teal-500",
      borderColor: "from-green-500 to-emerald-600",
      icon: Heart,
      glowColor: "green"
    }
  ];

  useEffect(() => {
    const updateNotificationShown = localStorage.getItem(UPDATE_NOTIFICATION_SHOWN_KEY);
    if (updateNotificationShown === CURRENT_VERSION) return;

    const storedNotifications = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    let hasVersionNotification = false;

    if (storedNotifications) {
      try {
        const notifications = JSON.parse(storedNotifications);
        hasVersionNotification = notifications.some(
          (notification) => 
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
        'تم إطلاق تحديث جديد للنظام يتضمن العديد من الميزات والتحسينات الجديدة.',
        [
          'إضافة صفحة دورات واضافة دورة the last dance',
          'تحديث نظام البومودورو مع إضافة إحصائيات متقدمة',
          'اضافة نظام اشعارات',
          'تحسينات في الأداء وإصلاح مشكلات متعددة'
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
    "description": "منصة تعليمية متخصصة في مساعدة الطلاب على التحضير لاختبار القدرات العامة",
    "url": "https://ourgoal.site"
  };

  return (
    <Layout>
      <SEO
        title="اور جول - Our Goal | منصة تعليمية لاختبار القدرات"
        description="منصة تعليمية متخصصة في مساعدة الطلاب على التحضير لاختبار القدرات العامة."
        keywords="اختبار القدرات, قدرات, تدريب, دراسة, منصة تعليمية"
        url="/"
        type="website"
        structuredData={homeStructuredData}
      />

      {/* نظام Slider للإعلانات */}
      <AdsSlider 
        showExamAd={SHOW_EXAM_SIMULATOR_AD} 
        showCoursesBanner={SHOW_COURSES_BANNER} 
      />

      {/* 🚀 Hero Section - تصميم ثوري جديد */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* خلفية ديناميكية متطورة */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background">
          {/* شبكة نقاط متحركة */}
          <div className="absolute inset-0" style={{ 
            backgroundImage: `radial-gradient(circle at 2px 2px, ${getComputedStyle(document.documentElement).getPropertyValue('--primary')}15 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
            transform: `translateY(${scrollY * 0.1}px)`
          }}></div>
          
          {/* كرات ثلاثية الأبعاد */}
          <div className="absolute top-20 left-20 w-96 h-96">
            <div className="relative w-full h-full animate-float">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute inset-8 bg-gradient-to-r from-accent/15 to-primary/15 rounded-full blur-2xl animate-pulse delay-500"></div>
            </div>
          </div>
          
          <div className="absolute bottom-20 right-20 w-80 h-80">
            <div className="relative w-full h-full animate-float-reverse">
              <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-primary/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10 pt-20">
          <div className="max-w-7xl mx-auto">
            {/* شارة متحركة */}
            <div className="flex justify-center mb-12">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent blur-xl opacity-50 animate-pulse"></div>
                <div className="relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 backdrop-blur-xl">
                  <Rocket className="w-6 h-6 text-primary animate-bounce" />
                  <span className="text-primary font-bold text-lg">منصة رائدة في التعليم الرقمي</span>
                  <Badge className="bg-gradient-to-r from-primary to-accent text-black border-0 animate-pulse">
                    جديد
                  </Badge>
                </div>
              </div>
            </div>

            {/* العنوان الرئيسي بتأثير 3D */}
            <div className="text-center mb-16">
              <h1 className="relative">
                <span className="block text-6xl md:text-7xl lg:text-8xl font-black mb-6 text-foreground">
                  <span className="inline-block hover:scale-110 transition-transform duration-300">مجتمع</span>{' '}
                  <span className="inline-block hover:scale-110 transition-transform duration-300 delay-100">يساعدك</span>
                </span>
                <span className="block text-5xl md:text-6xl lg:text-7xl font-black">
                  <span className="text-transparent bg-gradient-to-r from-primary via-accent to-primary bg-clip-text animate-gradient bg-300%">
                    في تحقيق هدفك
                  </span>
                </span>
              </h1>

              <p className="text-2xl md:text-3xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-12">
                انضم لأكثر من <span className="text-primary font-bold">23,700</span> طالب في رحلة النجاح
              </p>
            </div>

            {/* أزرار CTA متطورة */}
            <div className="flex flex-wrap gap-6 justify-center mb-20">
              <a href="https://linktr.ee/Our_goal" target="_blank" rel="noopener noreferrer">
                <Button className="group relative px-10 py-8 text-xl font-bold overflow-hidden rounded-2xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent transition-transform group-hover:scale-110"></div>
                  <span className="relative flex items-center gap-3 text-black">
                    <Users className="w-7 h-7 group-hover:rotate-12 transition-transform" />
                    انضم للمجتمع
                    <ArrowUpRight className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </span>
                </Button>
              </a>

              <Link to="/equivalency-calculator">
                <Button variant="outline" className="px-10 py-8 text-xl border-2 hover:bg-primary/10 rounded-2xl group">
                  <Calculator className="w-7 h-7 ml-3 group-hover:rotate-12 transition-transform" />
                  حاسبة المعادلة
                  <Sparkles className="w-5 h-5 mr-2 text-primary animate-pulse" />
                </Button>
              </Link>
            </div>

            {/* إحصائيات ديناميكية */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                { label: "عضو نشط", value: "23.7K+", icon: Users, color: "from-primary to-accent" },
                { label: "اختبار تجريبي", value: "150+", icon: FileText, color: "from-accent to-primary" },
                { label: "ملف تعليمي", value: "100+", icon: BookOpen, color: "from-primary to-accent" },
                { label: "ساعة دعم", value: "24/7", icon: Clock, color: "from-accent to-primary" }
              ].map((stat, index) => (
                <div key={index} className="group relative">
                  <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity`}></div>
                  <Card className="relative p-6 bg-card/80 backdrop-blur-xl border-primary/20 rounded-2xl hover:scale-105 transition-transform">
                    <stat.icon className="w-8 h-8 text-primary mb-3 mx-auto" />
                    <div className="text-3xl font-black text-primary mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* مؤشر السكرول المتطور */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex flex-col items-center gap-2 animate-bounce">
            <div className="w-8 h-12 border-2 border-primary/50 rounded-full flex justify-center relative overflow-hidden">
              <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-scroll-indicator"></div>
            </div>
            <span className="text-xs text-muted-foreground">اكتشف المزيد</span>
          </div>
        </div>
      </section>

      {/* 🏆 قسم أبطال المجتمع - تصميم ثوري */}
      <section className="py-32 px-4 relative overflow-hidden">
        {/* خلفية متحركة معقدة */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/3 to-background"></div>
          
          {/* جزيئات متحركة */}
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 5}s`
              }}
            >
              <div className={`w-2 h-2 bg-primary/20 rounded-full blur-sm`}></div>
            </div>
          ))}

          {/* موجات ضوئية */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-pulse"></div>
            <div className="absolute top-2/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent animate-pulse delay-1000"></div>
            <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-pulse delay-2000"></div>
          </div>
        </div>

        <div className="container mx-auto relative z-10">
          {/* رأس القسم المتطور */}
          <div className="text-center mb-24">
            <div className="relative inline-block mb-12">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-500 blur-2xl opacity-30 animate-pulse"></div>
              <div className="relative inline-flex items-center gap-4 px-12 py-6 rounded-full bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-2 border-yellow-500/30 backdrop-blur-xl">
                <Trophy className="w-10 h-10 text-yellow-500 animate-bounce" />
                <span className="text-yellow-500 font-black text-2xl">أبطال عام 2025</span>
                <Crown className="w-8 h-8 text-yellow-500 animate-pulse" />
              </div>
            </div>

            <h2 className="text-7xl md:text-8xl lg:text-9xl font-black mb-8 leading-none">
              <span className="block text-transparent bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-500 bg-clip-text animate-gradient bg-300% mb-4">
                نجوم
              </span>
              <span className="block text-5xl md:text-6xl lg:text-7xl text-foreground">
                مجتمعنا
              </span>
            </h2>

            <p className="text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-16">
              شخصيات استثنائية صنعت الفرق وألهمت آلاف الطلاب في رحلة النجاح
            </p>

            {/* مؤشرات الإنجاز المتطورة */}
            <div className="flex flex-wrap justify-center gap-6 mb-16">
              {[
                { icon: Crown, label: "4 أبطال", color: "from-yellow-500 to-amber-500" },
                { icon: Star, label: "إنجازات فريدة", color: "from-purple-500 to-pink-500" },
                { icon: Award, label: "تأثير حقيقي", color: "from-blue-500 to-cyan-500" },
                { icon: Gem, label: "قيمة مضافة", color: "from-green-500 to-emerald-500" }
              ].map((item, index) => (
                <div key={index} className="group relative">
                  <div className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity`}></div>
                  <div className={`relative flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r ${item.color}/10 border border-current/20 backdrop-blur-sm`}>
                    <item.icon className="w-6 h-6" style={{ color: `rgb(${item.color.includes('yellow') ? '234, 179, 8' : item.color.includes('purple') ? '168, 85, 247' : item.color.includes('blue') ? '59, 130, 246' : '34, 197, 94'})` }} />
                    <span className="font-bold" style={{ color: `rgb(${item.color.includes('yellow') ? '234, 179, 8' : item.color.includes('purple') ? '168, 85, 247' : item.color.includes('blue') ? '59, 130, 246' : '34, 197, 94'})` }}>
                      {item.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* شبكة البطاقات الثورية */}
          <div className="grid md:grid-cols-2 gap-12 max-w-7xl mx-auto mb-20">
            {topMembers.map((member, index) => (
              <div
                key={member.id}
                className="group relative"
                onMouseEnter={() => setHoveredMember(member.id)}
                onMouseLeave={() => setHoveredMember(null)}
              >
                {/* هالة خارجية متحركة */}
                <div className={`absolute -inset-4 bg-gradient-to-r ${member.color} rounded-3xl blur-2xl opacity-0 group-hover:opacity-30 transition-all duration-700 animate-pulse`}></div>
                
                {/* البطاقة الرئيسية */}
                <Card className="relative p-8 bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-2xl border-2 border-primary/20 rounded-3xl overflow-hidden transition-all duration-500 hover:scale-105 hover:border-primary/40 hover:shadow-2xl">
                  {/* خلفية ديناميكية */}
                  <div className="absolute inset-0">
                    <div className={`absolute inset-0 bg-gradient-to-br ${member.color} opacity-5`}></div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-accent/10 to-transparent rounded-full blur-xl"></div>
                  </div>

                  {/* رقم الترتيب ثلاثي الأبعاد */}
                  <div className="absolute -top-4 -right-4 z-20">
                    <div className="relative">
                      <div className={`absolute inset-0 bg-gradient-to-r ${member.borderColor} rounded-2xl blur-md opacity-50`}></div>
                      <div className={`relative w-20 h-20 bg-gradient-to-r ${member.borderColor} rounded-2xl flex items-center justify-center shadow-2xl transform rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-500`}>
                        <span className="text-3xl font-black text-black">#{member.rank}</span>
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10">
                    {/* الصورة مع إطار متطور */}
                    <div className="relative mb-8 flex justify-center">
                      <div className="relative group/image">
                        <div className={`absolute -inset-2 bg-gradient-to-r ${member.borderColor} rounded-2xl blur-lg opacity-50 group-hover/image:opacity-100 transition-opacity`}></div>
                        <div className={`relative w-72 h-48 bg-gradient-to-r ${member.borderColor} p-1 rounded-2xl overflow-hidden`}>
                          <div className="w-full h-full bg-card rounded-xl overflow-hidden">
                            <img 
                              src={member.image} 
                              alt={member.name}
                              className="w-full h-full object-cover rounded-xl group-hover/image:scale-110 transition-transform duration-500"
                            />
                          </div>
                        </div>
                        
                        {/* شارة متحركة */}
                        <div className="absolute -bottom-3 -right-3 text-5xl animate-bounce">
                          {member.badge}
                        </div>
                      </div>
                    </div>

                    {/* معلومات العضو */}
                    <div className="text-center">
                      <h3 className="text-4xl font-black mb-4 text-foreground group-hover:text-primary transition-colors">
                        {member.name}
                      </h3>
                      
                      <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r ${member.color} mb-6 shadow-lg`}>
                        <member.icon className="w-6 h-6 text-black" />
                        <span className="text-black font-bold text-lg">{member.role}</span>
                      </div>
                      
                      <p className="text-muted-foreground leading-relaxed mb-8 text-lg">
                        {member.achievement}
                      </p>

                      {/* إحصائيات العضو */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{member.stats.posts}</div>
                          <div className="text-xs text-muted-foreground">مشاركة</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{member.stats.helps}</div>
                          <div className="text-xs text-muted-foreground">مساعدة</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{member.stats.rating}</div>
                          <div className="text-xs text-muted-foreground">تقييم</div>
                        </div>
                      </div>

                      {/* نجوم التقييم */}
                      <div className="flex justify-center gap-1 mb-6">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        ))}
                      </div>
                      
                      <Badge className={`bg-gradient-to-r ${member.color} text-black border-0 font-bold px-6 py-2 text-lg shadow-lg`}>
                        بطل 2025 🏆
                      </Badge>
                    </div>
                  </div>

                  {/* تأثيرات الهوفر المتطورة */}
                  {hoveredMember === member.id && (
                    <div className="absolute inset-0 pointer-events-none">
                      {[...Array(8)].map((_, i) => (
                        <Sparkles
                          key={i}
                          className={`absolute text-${member.glowColor}-400 w-6 h-6 animate-ping`}
                          style={{
                            top: `${10 + Math.random() * 80}%`,
                            left: `${10 + Math.random() * 80}%`,
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

          {/* رسالة تحفيزية متطورة */}
          <div className="text-center">
            <div className="relative max-w-6xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-2xl"></div>
              <Card className="relative p-16 bg-gradient-to-br from-primary/10 via-card/90 to-accent/10 border-2 border-primary/20 rounded-3xl backdrop-blur-xl overflow-hidden">
                {/* خلفية متحركة */}
                <div className="absolute inset-0">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-r from-yellow-400/10 to-amber-400/10 rounded-full blur-3xl animate-pulse"></div>
                  <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                <div className="relative z-10">
                  <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-bounce shadow-2xl">
                                        <Trophy className="w-12 h-12 text-black" />
                  </div>

                  <h3 className="text-5xl md:text-6xl font-black mb-6 text-foreground">
                    كن البطل القادم!
                  </h3>

                  <p className="text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
                    هؤلاء أعضاء من جروب أور جول ساهموا بمساعدة زملائهم بشكل مستمر، وكان لهم دور إيجابي في دعم مئات الطلاب. 
                    انضم إلينا وشارك بعلمك لتكون جزءاً من هذا العطاء.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
                    <a href="https://linktr.ee/Our_goal" target="_blank" rel="noopener noreferrer">
                      <Button size="lg" className="group px-12 py-6 text-xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black rounded-2xl shadow-2xl shadow-yellow-500/30 transition-all duration-300 hover:scale-105">
                        <Users className="w-6 h-6 ml-3 group-hover:rotate-12 transition-transform" />
                        انضم للأبطال
                        <Rocket className="w-5 h-5 mr-2 group-hover:translate-y-1 transition-transform" />
                      </Button>
                    </a>

                    <Button variant="outline" size="lg" className="px-12 py-6 text-xl border-2 border-primary/30 hover:border-primary hover:bg-primary/10 rounded-2xl transition-all duration-300 group">
                      <MessageCircle className="w-6 h-6 ml-3 group-hover:scale-110 transition-transform" />
                      شارك في المناقشات
                    </Button>
                  </div>

                  {/* شارات التحفيز المتطورة */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-primary/20">
                    {[
                      { icon: Sparkles, label: "كن متميزاً", color: "text-yellow-500" },
                      { icon: Heart, label: "ساعد الآخرين", color: "text-pink-500" },
                      { icon: TrendingUp, label: "تطور باستمرار", color: "text-green-500" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-center gap-3 text-muted-foreground group hover:scale-105 transition-transform">
                        <item.icon className={`w-6 h-6 ${item.color} group-hover:animate-pulse`} />
                        <span className="font-medium text-lg">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 🎯 قسم الخدمات - تصميم تفاعلي ثوري */}
      <section className="py-32 px-4 relative overflow-hidden">
        {/* خلفية متحركة معقدة */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-accent/5 to-background"></div>
          
          {/* شبكة هندسية متحركة */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(90deg, ${getComputedStyle(document.documentElement).getPropertyValue('--primary')}20 1px, transparent 1px), linear-gradient(${getComputedStyle(document.documentElement).getPropertyValue('--primary')}20 1px, transparent 1px)`,
              backgroundSize: '100px 100px',
              transform: `translate(${scrollY * 0.05}px, ${scrollY * 0.03}px)`
            }}></div>
          </div>

          {/* دوائر ضوئية متحركة */}
          <div className="absolute top-20 right-20 w-[600px] h-[600px] bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 left-20 w-[500px] h-[500px] bg-gradient-to-r from-accent/10 to-primary/10 rounded-full blur-3xl animate-float-reverse"></div>
        </div>

        <div className="container mx-auto relative z-10">
          {/* رأس القسم المتطور */}
          <div className="text-center mb-24">
            <div className="relative inline-block mb-12">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent blur-2xl opacity-30 animate-pulse"></div>
              <div className="relative inline-flex items-center gap-4 px-10 py-5 rounded-full bg-gradient-to-r from-primary/15 to-accent/15 border border-primary/30 backdrop-blur-xl">
                <Zap className="w-8 h-8 text-primary animate-bounce" />
                <span className="text-primary font-black text-xl">خدمات متطورة</span>
                <Badge className="bg-gradient-to-r from-primary to-accent text-black border-0 animate-pulse">
                  مبتكر
                </Badge>
              </div>
            </div>

            <h2 className="text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight">
              <span className="block text-foreground mb-4">كيف نساعدك</span>
              <span className="block text-transparent bg-gradient-to-r from-primary via-accent to-primary bg-clip-text animate-gradient bg-300%">
                في رحلتك
              </span>
            </h2>

            <p className="text-2xl text-muted-foreground max-w-5xl mx-auto leading-relaxed mb-12">
              مجموعة من الأدوات والخدمات المتطورة لضمان نجاحك في اختبار القدرات
            </p>

            {/* مؤشرات الجودة */}
            <div className="flex flex-wrap justify-center gap-6 mb-16">
              {[
                { icon: Shield, label: "موثوق", count: "100%" },
                { icon: Zap, label: "سريع", count: "فوري" },
                { icon: Gift, label: "مجاني", count: "بالكامل" },
                { icon: Infinity, label: "دائم", count: "24/7" }
              ].map((item, index) => (
                <div key={index} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 backdrop-blur-sm">
                    <item.icon className="w-5 h-5 text-primary" />
                    <span className="font-bold text-primary">{item.label}</span>
                    <Badge variant="secondary" className="bg-primary/20 text-primary border-0 text-xs">
                      {item.count}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* شبكة الخدمات التفاعلية */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {/* خدمة 1 - حاسبة المعادلة */}
            <Link to="/equivalency-calculator" className="group relative block">
              <div className="absolute -inset-2 bg-gradient-to-r from-primary/30 to-accent/30 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
              <Card className="relative p-10 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-2xl border-2 border-primary/20 rounded-3xl hover:border-primary/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl group overflow-hidden">
                {/* خلفية ديناميكية */}
                <div className="absolute inset-0">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-accent/20 to-transparent rounded-full blur-xl group-hover:scale-125 transition-transform duration-700"></div>
                </div>

                <div className="relative z-10">
                  {/* أيقونة ثلاثية الأبعاد */}
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                    <div className="relative w-24 h-24 bg-gradient-to-br from-primary/30 to-accent/30 rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl">
                      <Calculator className="w-12 h-12 text-primary" />
                    </div>
                  </div>

                  <h3 className="text-3xl font-black mb-6 text-foreground group-hover:text-primary transition-colors duration-300">
                    حاسبة المعادلة الذكية
                  </h3>

                  <p className="text-muted-foreground mb-8 leading-relaxed text-lg">
                    احسب معدلك التقديري بدقة عالية باستخدام أحدث معادلات القبول الجامعي مع واجهة سهلة وسريعة
                  </p>

                  {/* مميزات الخدمة */}
                  <div className="space-y-3 mb-8">
                    {[
                      "دقة 100% في الحسابات",
                      "واجهة سهلة الاستخدام", 
                      "نتائج فورية ومفصلة"
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-primary" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-primary font-bold text-lg group-hover:gap-4 transition-all duration-300">
                      <span>احسب معدلك</span>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                    
                    <Badge className="bg-gradient-to-r from-primary to-accent text-black border-0 font-bold">
                      مجاني
                    </Badge>
                  </div>
                </div>
              </Card>
            </Link>

            {/* خدمة 2 - الملفات التعليمية */}
            <Link to="/files" className="group relative block">
              <div className="absolute -inset-2 bg-gradient-to-r from-accent/30 to-primary/30 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
              <Card className="relative p-10 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-2xl border-2 border-primary/20 rounded-3xl hover:border-accent/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl group overflow-hidden">
                <div className="absolute inset-0">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-xl group-hover:scale-125 transition-transform duration-700"></div>
                </div>

                <div className="relative z-10">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                    <div className="relative w-24 h-24 bg-gradient-to-br from-accent/30 to-primary/30 rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 shadow-2xl">
                      <FileText className="w-12 h-12 text-accent" />
                    </div>
                  </div>

                  <h3 className="text-3xl font-black mb-6 text-foreground group-hover:text-accent transition-colors duration-300">
                    مكتبة شاملة
                  </h3>

                  <p className="text-muted-foreground mb-8 leading-relaxed text-lg">
                    مجموعة ضخمة من الملفات والمواد التعليمية المتخصصة لكلا القسمين الكمي واللفظي
                  </p>

                  <div className="space-y-3 mb-8">
                    {[
                      "ملفات كمي ولفظي متنوعة",
                      "محتوى محدث باستمرار",
                      "تنظيم ذكي وسهل التصفح"
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-accent" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-accent font-bold text-lg group-hover:gap-4 transition-all duration-300">
                      <span>تصفح المكتبة</span>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                    
                    <Badge className="bg-gradient-to-r from-accent to-primary text-black border-0 font-bold">
                      +100 ملف
                    </Badge>
                  </div>
                </div>
              </Card>
            </Link>

            {/* خدمة 3 - المجتمع */}
            <a href="https://linktr.ee/Our_goal" target="_blank" rel="noopener noreferrer" className="group relative block">
              <div className="absolute -inset-2 bg-gradient-to-r from-primary/30 to-accent/30 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
              <Card className="relative p-10 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-2xl border-2 border-primary/20 rounded-3xl hover:border-primary/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl group overflow-hidden">
                <div className="absolute inset-0">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-accent/20 to-transparent rounded-full blur-xl group-hover:scale-125 transition-transform duration-700"></div>
                </div>

                <div className="relative z-10">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                    <div className="relative w-24 h-24 bg-gradient-to-br from-primary/30 to-accent/30 rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl">
                      <Users className="w-12 h-12 text-primary" />
                    </div>
                  </div>

                  <h3 className="text-3xl font-black mb-6 text-foreground group-hover:text-primary transition-colors duration-300">
                    مجتمع نشط
                  </h3>

                  <p className="text-muted-foreground mb-8 leading-relaxed text-lg">
                    انضم لأكبر مجتمع تعليمي متعاون، حيث يساعد الجميع بعضهم البعض في رحلة النجاح
                  </p>

                  <div className="space-y-3 mb-8">
                    {[
                      "أكثر من 23,700 عضو نشط",
                      "دعم ومساعدة مستمرة",
                      "تبادل الخبرات والتجارب"
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-primary" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-primary font-bold text-lg group-hover:gap-4 transition-all duration-300">
                      <span>انضم الآن</span>
                      <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </div>
                    
                    <Badge className="bg-gradient-to-r from-primary to-accent text-black border-0 font-bold">
                      مجاني
                    </Badge>
                  </div>
                </div>
              </Card>
            </a>
          </div>

          {/* خدمة مميزة - مولد الخطة الدراسية */}
          <Link to="/study-plan" className="group relative block">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
            <Card className="relative p-12 bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-2xl border-2 border-primary/30 rounded-3xl hover:border-primary/60 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl group overflow-hidden">
              {/* خلفية متحركة معقدة */}
              <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-primary/15 to-transparent rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-accent/15 to-transparent rounded-full blur-2xl group-hover:scale-125 transition-transform duration-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-3xl group-hover:rotate-180 transition-transform duration-[2000ms]"></div>
              </div>

              <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  {/* أيقونة مميزة */}
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity animate-pulse"></div>
                    <div className="relative w-28 h-28 bg-gradient-to-br from-primary/40 to-accent/40 rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-2xl">
                      <Target className="w-14 h-14 text-primary" />
                    </div>
                  </div>

                  <h3 className="text-4xl md:text-5xl font-black mb-6 text-foreground group-hover:text-primary transition-colors duration-300">
                    مولد الخطة الذكي
                  </h3>

                  <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                    أنشئ خطة دراسية مخصصة ومنظمة بناءً على تاريخ اختبارك مع توزيع ذكي للمواضيع والاختبارات
                  </p>

                  <div className="flex items-center gap-4 text-primary font-bold text-xl group-hover:gap-6 transition-all duration-300 mb-8">
                    <span>أنشئ خطتك الآن</span>
                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <ArrowRight className="w-6 h-6 text-black" />
                    </div>
                  </div>

                  {/* مميزات متقدمة */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: Brain, label: "ذكي", desc: "توزيع تلقائي" },
                      { icon: Clock, label: "مرن", desc: "حسب وقتك" },
                      { icon: Target, label: "منظم", desc: "خطة واضحة" },
                      { icon: FileText, label: "قابل للتصدير", desc: "احفظ خطتك" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10 group-hover:bg-primary/10 transition-colors">
                        <item.icon className="w-6 h-6 text-primary" />
                        <div>
                          <div className="font-bold text-primary text-sm">{item.label}</div>
                          <div className="text-xs text-muted-foreground">{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* معاينة تفاعلية */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
                  <div className="relative bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-primary/20 group-hover:border-primary/40 transition-colors">
                    <div className="text-center mb-4">
                      <div className="text-2xl font-bold text-primary mb-2">خطة دراسية ذكية</div>
                      <div className="text-sm text-muted-foreground">مخصصة حسب احتياجاتك</div>
                    </div>
                    
                    <div className="space-y-3">
                      {[
                        { day: "الأسبوع الأول", topic: "أساسيات الكمي", progress: 85 },
                        { day: "الأسبوع الثاني", topic: "المفردات اللفظية", progress: 70 },
                        { day: "الأسبوع الثالث", topic: "اختبارات تجريبية", progress: 45 }
                      ].map((item, index) => (
                        <div key={index} className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-sm">{item.day}</span>
                            <span className="text-xs text-primary font-bold">{item.progress}%</span>
                          </div>
                          <div className="text-xs text-muted-foreground mb-2">{item.topic}</div>
                          <div className="w-full bg-primary/10 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-1000 group-hover:animate-pulse"
                              style={{ width: `${item.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </section>

      {/* قسم الأحداث */}
      <EventsSection />

      {/* 🎉 قسم النجاحات والدعوة للانضمام - تصميم احتفالي */}
      <section className="py-32 px-4 relative overflow-hidden">
        {/* خلفية احتفالية */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/8 to-background"></div>
          
          {/* كونفيتي متحرك */}
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            >
              <div className={`w-3 h-3 ${Math.random() > 0.5 ? 'bg-primary' : 'bg-accent'} rounded-full opacity-60`}></div>
            </div>
          ))}

          {/* أضواء متحركة */}
          <div className="absolute top-10 right-10 w-[800px] h-[800px] bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-10 left-10 w-[600px] h-[600px] bg-gradient-to-r from-accent/10 to-primary/10 rounded-full blur-3xl animate-float-reverse"></div>
        </div>

        <div className="container mx-auto relative z-10">
          {/* رأس القسم الاحتفالي */}
          <div className="text-center mb-20">
            <div className="relative inline-block mb-12">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent blur-2xl opacity-40 animate-pulse"></div>
              <h2 className="relative text-6xl md:text-7xl lg:text-8xl font-black leading-tight">
                <span className="block text-foreground mb-4">نجاحات</span>
                <span className="block text-transparent bg-gradient-to-r from-primary via-accent to-primary bg-clip-text animate-gradient bg-300%">
                  مجتمعنا
                </span>
              </h2>
            </div>

            <p className="text-2xl text-muted-foreground mb-16 max-w-4xl mx-auto leading-relaxed">
              مجتمع متعاون من الطلاب والخريجين، نساعد بعضنا البعض في تحقيق الأهداف الأكاديمية والوصول للنجاح
            </p>
          </div>

          {/* إحصائيات النجاح المتطورة */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {[
              { icon: Users, value: "+23.7K", label: "طالب متفاعل", color: "from-blue-500 to-cyan-500" },
              { icon: Trophy, value: "+100", label: "ملف تعليمي", color: "from-yellow-500 to-amber-500" },
              { icon: Star, value: "مجاني", label: "بالكامل", color: "from-purple-500 to-pink-500" },
              { icon: Calculator, value: "دقيق", label: "حاسبة المعادلة", color: "from-green-500 to-emerald-500" }
            ].map((stat, index) => (
              <div key={index} className="group relative">
                <div className={`absolute -inset-2 bg-gradient-to-r ${stat.color} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-all duration-700`}></div>
                <Card className="relative p-8 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-xl border-2 border-primary/20 rounded-3xl hover:border-primary/40 transition-all duration-500 hover:scale-105 group overflow-hidden">
                  {/* خلفية متحركة */}
                  <div className="absolute inset-0">
                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>
                  </div>

                  <div className="relative z-10 text-center">
                    <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl`}>
                      <stat.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-4xl font-black mb-3" style={{ 
                      background: `linear-gradient(135deg, ${stat.color.split(' ')[0].replace('from-', '')}, ${stat.color.split(' ')[2].replace('to-', '')})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>
                      {stat.value}
                    </div>
                    <div className="text-muted-foreground font-medium">{stat.label}</div>
                  </div>
                </Card>
              </div>
            ))}
          </div>

          {/* دعوة نهائية مبهرة */}
          <div className="relative max-w-6xl mx-auto">
            <div className="absolute -inset-8 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-3xl animate-pulse"></div>
            <Card className="relative p-16 bg-gradient-to-br from-primary/10 via-card/95 to-accent/10 backdrop-blur-2xl border-2 border-primary/30 rounded-3xl overflow-hidden">
              {/* خلفية احتفالية */}
              <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-r from-primary/15 to-accent/15 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-r from-accent/15 to-primary/15 rounded-full blur-3xl animate-float-reverse"></div>
                
                {/* نجوم متلألئة */}
                {[...Array(12)].map((_, i) => (
                  <Sparkles
                    key={i}
                    className="absolute text-primary/40 animate-twinkle"
                    style={{
                      top: `${10 + Math.random() * 80}%`,
                      left: `${10 + Math.random() * 80}%`,
                      animationDelay: `${i * 0.5}s`,
                      fontSize: `${16 + Math.random() * 8}px`
                    }}
                  />
                ))}
              </div>

              <div className="relative z-10 text-center">
                {/* أيقونة مركزية مبهرة */}
                <div className="relative mb-12">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-3xl blur-2xl opacity-50 animate-pulse"></div>
                  <div className="relative w-32 h-32 bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center mx-auto shadow-2xl animate-float">
                    <Users className="w-16 h-16 text-white" />
                  </div>
                </div>

                <h3 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight">
                  <span className="block text-foreground mb-2">انضم لمجتمعنا</span>
                  <span className="block text-transparent bg-gradient-to-r from-primary via-accent to-primary bg-clip-text animate-gradient bg-300%">
                    المتعاون اليوم
                  </span>
                </h3>

                <p className="text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
                  كن جزءاً من أكبر مجتمع تعليمي متعاون، حيث نساعد بعضنا البعض في الدراسة والتحضير ونشارك التجارب والنصائح
                </p>

                {/* أزرار الدعوة المتطورة */}
                <div className="flex flex-col sm:flex-row gap-8 justify-center mb-16">
                  <a href="https://linktr.ee/Our_goal" target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="group relative px-12 py-8 text-2xl font-black overflow-hidden rounded-2xl shadow-2xl">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent transition-transform group-hover:scale-110"></div>
                      <span className="relative flex items-center gap-4 text-black">
                        <Users className="w-8 h-8 group-hover:rotate-12 transition-transform" />
                        انضم للمجتمع الآن
                        <Rocket className="w-7 h-7 group-hover:translate-y-1 transition-transform" />
                      </span>
                    </Button>
                  </a>

                  <Link to="/files">
                    <Button variant="outline" size="lg" className="px-12 py-8 text-2xl border-2 border-primary/40 hover:border-primary hover:bg-primary/10 rounded-2xl transition-all duration-300 group">
                      <FileText className="w-8 h-8 ml-4 group-hover:scale-110 transition-transform" />
                      تصفح الملفات
                      <ArrowRight className="w-6 h-6 mr-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>

                {/* مؤشرات المجتمع المتطورة */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t-2 border-primary/20">
                  {[
                    { icon: Users, label: "مجتمع متعاون", desc: "نساعد بعضنا البعض", color: "text-blue-500" },
                    { icon: Star, label: "تجارب حقيقية", desc: "من طلاب نجحوا فعلاً", color: "text-yellow-500" },
                    { icon: CheckCircle, label: "دعم شامل", desc: "في جميع المراحل", color: "text-green-500" }
                  ].map((item, index) => (
                    <div key={index} className="group text-center">
                      <div className={`w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                        <item.icon className={`w-8 h-8 ${item.color}`} />
                      </div>
                      <div className="font-bold text-lg text-foreground mb-2">{item.label}</div>
                      <div className="text-muted-foreground text-sm">{item.desc}</div>
                    </div>
                  ))}
                </div>

                {/* شارة الثقة النهائية */}
                <div className="mt-12 pt-8 border-t border-primary/10">
                  <div className="inline-flex items-center gap-4 px-8 py-4 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 backdrop-blur-sm">
                    <Shield className="w-6 h-6 text-primary" />
                    <span className="text-primary font-bold text-lg">موثوق من آلاف الطلاب</span>
                    <Badge className="bg-gradient-to-r from-primary to-accent text-black border-0 font-bold">
                      معتمد
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

// إضافة الأنيميشنز المخصصة في CSS
const customStyles = `
  @keyframes gradient {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(5deg); }
  }
  
  @keyframes float-reverse {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(20px) rotate(-5deg); }
  }
  
  @keyframes confetti {
    0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
  }
  
  @keyframes twinkle {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.2); }
  }
  
  @keyframes scroll-indicator {
    0% { transform: translateY(0); opacity: 1; }
    100% { transform: translateY(16px); opacity: 0; }
  }
  
  .animate-gradient { animation: gradient 3s ease infinite; }
  .animate-float { animation: float 6s ease-in-out infinite; }
  .animate-float-reverse { animation: float-reverse 8s ease-in-out infinite; }
  .animate-confetti { animation: confetti 4s linear infinite; }
  .animate-twinkle { animation: twinkle 2s ease-in-out infinite; }
  .animate-scroll-indicator { animation: scroll-indicator 2s ease-in-out infinite; }
  .bg-300\\% { background-size: 300% 300%; }
`;

// إضافة الستايلز للصفحة
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = customStyles;
  document.head.appendChild(styleSheet);
}

export default Home;
