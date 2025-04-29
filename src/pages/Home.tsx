import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight, Book, Calculator, ChevronRight, FileText, GraduationCap, BarChart3, Users } from "lucide-react";
import AuthRequiredLink from "@/components/AuthRequiredLink";

const Home = () => {
  return (
    <Layout>
      {/* Hero Section - Modern Redesign */}
      <section className="bg-gradient-to-br from-background to-background/90 py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,white)]"></div>
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-1/2">
              <div className="inline-block px-4 py-1.5 mb-6 rounded-full text-sm font-medium bg-primary/10 text-primary">
                منصة اختبارات قياس الأولى في الوطن العربي
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground tracking-tight">
                منصة <span className="text-primary relative">اسرار للتفوق <span className="absolute bottom-1 left-0 right-0 h-2 bg-primary/20"></span></span> لاختبارات قياس
              </h1>
              <p className="text-xl mb-8 text-muted-foreground leading-relaxed">
                تدرب على اختبارات قياس المختلطة (لفظي + كمي) وحسن معدلك التقديري للمعادلة المصرية في السعودية
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/qiyas-tests">
                  <Button size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 flex items-center gap-2 rounded-xl shadow-lg shadow-primary/20 transition-all duration-300 hover:translate-y-[-2px]">
                    ابدأ اختبار قياس الآن
                    <ArrowRight size={18} />
                  </Button>
                </Link>
                <Link to="/equivalency-calculator">
                  <Button variant="outline" size="lg" className="text-lg px-8 py-6 flex items-center gap-2 rounded-xl border-2 hover:bg-primary/5 transition-all duration-300 hover:translate-y-[-2px]">
                    حساب المعدل التقديري
                    <Calculator size={18} />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary to-primary/50 blur-xl opacity-30"></div>
              <img
                src="https://lh7-us.googleusercontent.com/KSYH2NPv3M7_lKp0UxDsGOcGD4VgGST6-NHzxybVB5TVyisNC7rXCJsMg_fY3OJEjgJxRRhvxUr7HQ6EsqLUwCGUoCrmh5jA8j4JqiiuBTyMLWc7so5jtr6NacI-GmnYsJEpVd2s-59OhERbXIy0UCSlXH7mB1bCqZbJlEisyb7i75wSYozxuXtb6iCfmxjeszJMK3fY?key=hEv8vchztg3tFh4Mt59OTQ"
                alt="طلاب يدرسون"
                  className="rounded-2xl shadow-2xl w-full h-auto object-cover border border-white/10 relative z-10"
              />
                <div className="absolute -z-10 inset-y-1/3 right-0 left-1/2 bg-primary/20 blur-[100px] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Modern Redesign */}
      <section className="py-24 px-4 bg-card/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full text-sm font-medium bg-primary/10 text-primary">
              <span>خدماتنا المميزة</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">كل ما تحتاجه للتفوق في اختبار قياس</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              نقدم مجموعة من الخدمات المتميزة لمساعدة طلاب المعادلة المصرية على تحقيق أعلى الدرجات
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-8 bg-background hover:bg-background/80 border border-border/50 rounded-2xl hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px] group">
              <div className="bg-primary/10 p-4 rounded-xl w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                <Book className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">اختبارات قياس تجريبية</h3>
              <p className="text-muted-foreground">
                اختبارات مختلطة بين اللفظي والكمي تحاكي اختبار قياس الحقيقي لتكون مستعداً تماماً
              </p>
              <Link to="/qiyas-tests" className="inline-flex items-center mt-4 text-primary hover:underline font-medium">
                ابدأ الآن <ChevronRight size={16} className="mr-1" />
              </Link>
            </Card>

            <Card className="p-8 bg-background hover:bg-background/80 border border-border/50 rounded-2xl hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px] group">
              <div className="bg-primary/10 p-4 rounded-xl w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                <BarChart3 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">تحليل أداء مفصل</h3>
              <p className="text-muted-foreground">
                تقارير تفصيلية توضح نقاط القوة والضعف لديك في مختلف أقسام الاختبار لتركز على تحسينها
              </p>
              <AuthRequiredLink 
                to="/user-profile" 
                className="inline-flex items-center mt-4 text-primary hover:underline font-medium"
                loginMessage="يرجى تسجيل الدخول لمشاهدة تقارير الأداء الخاصة بك وتحليل نتائج اختباراتك السابقة"
              >
                شاهد التقارير <ChevronRight size={16} className="mr-1" />
              </AuthRequiredLink>
            </Card>

            <Card className="p-8 bg-background hover:bg-background/80 border border-border/50 rounded-2xl hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px] group">
              <div className="bg-primary/10 p-4 rounded-xl w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                <Calculator className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">حاسبة المعادلة التقديرية</h3>
              <p className="text-muted-foreground">
                احسب معدلك التقديري للمعادلة المصرية بناء على نتائج الثانوية واختبار القدرات
              </p>
              <Link to="/equivalency-calculator" className="inline-flex items-center mt-4 text-primary hover:underline font-medium">
                احسب الآن <ChevronRight size={16} className="mr-1" />
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Learning Path Section - Modern Redesign */}
      <section className="py-24 px-4 bg-gradient-to-b from-background to-card/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full text-sm font-medium bg-primary/10 text-primary">
              <GraduationCap size={16} />
              <span>خطة النجاح</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">مسار التعلم لاختبار القدرات</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              خطة منهجية متكاملة للتحضير لاختبار القدرات العامة وتحقيق أعلى الدرجات
            </p>
          </div>

          <div className="max-w-4xl mx-auto relative">
            <div className="absolute left-1/2 top-8 bottom-8 w-1 bg-primary/20 -translate-x-1/2 rounded-full"></div>
            
            <div className="space-y-12">
              <div className="relative">
                <div className="absolute left-1/2 top-8 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center -translate-x-1/2 z-10">1</div>
                <div className="mr-auto ml-[calc(50%+2rem)] bg-background border border-border/50 rounded-2xl shadow-lg p-6 relative">
                  <h3 className="text-xl font-bold mb-2">المرحلة الأولى: التأسيس</h3>
                  <p className="text-muted-foreground mb-3">تأسيس الكمي واللفظي لبناء قاعدة قوية للمهارات الأساسية</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">٤-٦ أسابيع</span>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">ساعتين يومياً أقل شي</span>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute left-1/2 top-8 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center -translate-x-1/2 z-10">2</div>
                <div className="ml-auto mr-[calc(50%+2rem)] bg-background border border-border/50 rounded-2xl shadow-lg p-6 relative">
                  <h3 className="text-xl font-bold mb-2">المرحلة الثانية: المحوسب</h3>
                  <p className="text-muted-foreground mb-3">التدرب على نظام الاختبار المحوسب والتكيف معه</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">٣ اختبارات أقل شي في البداية</span>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">فيديوهين في اليوم أقل شي</span>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute left-1/2 top-8 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center -translate-x-1/2 z-10">3</div>
                <div className="mr-auto ml-[calc(50%+2rem)] bg-background border border-border/50 rounded-2xl shadow-lg p-6 relative">
                  <h3 className="text-xl font-bold mb-2">المرحلة الثالثة: مراجعة على البنوك</h3>
                  <p className="text-muted-foreground mb-3">مراجعة شاملة لبنوك الأسئلة وتحديد نقاط القوة والضعف</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">ساعتين مذاكرة أقل شي</span>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute left-1/2 top-8 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center -translate-x-1/2 z-10">4</div>
                <div className="ml-auto mr-[calc(50%+2rem)] bg-background border border-border/50 rounded-2xl shadow-lg p-6 relative">
                  <h3 className="text-xl font-bold mb-2">المرحلة الرابعة: المراجعة النهائية</h3>
                  <p className="text-muted-foreground mb-3">التركيز على مراجعة الأخطاء السابقة والتدرب على إدارة الوقت</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">مجلدات أخطائك</span>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">مراجعة جميع أخطائك</span>
                  </div>
                </div>
              </div>
              
              <div className="relative pt-10">
                <div className="absolute left-1/2 top-16 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center -translate-x-1/2 z-10">
                  <GraduationCap size={24} />
                </div>
                <div className="bg-primary/10 border border-primary/30 rounded-2xl shadow-lg p-6 text-center mt-6">
                  <h3 className="text-2xl font-bold mt-6 text-primary">جاهزيتك لدخول الاختبار بالتوفيق</h3>
                  <p className="text-muted-foreground mt-2 mb-4">أنت الآن جاهز لخوض الاختبار بثقة وتحقيق أعلى الدرجات</p>
                  <Button className="bg-primary hover:bg-primary/90">ابدأ الرحلة الآن</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section - Modern Redesign */}
      <section className="py-24 px-4 bg-gradient-to-br from-[#1A2237] to-[#111827]">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full text-sm font-medium bg-white/10 text-white">
              <Users size={16} />
              <span>فريق العمل</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white tracking-tight">مشرفين المنصة</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              فريق من الخبراء والمتخصصين لمساعدتك في رحلة التفوق
            </p>
          </div>

          {/* Team Members Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden group hover:bg-white/10 transition-all duration-300 hover:-translate-y-2">
                <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-1">اسلام احمد</h3>
                <p className="text-primary/90 mb-4">مطور الموقع</p>
                <p className="text-gray-300 text-sm">المطور مسؤول عن برمجة الموقع واضافة الميزات.</p>
                <div className="flex gap-3 mt-4">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden group hover:bg-white/10 transition-all duration-300 hover:-translate-y-2">
                <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-1">محمد منصور</h3>
                <p className="text-primary/90 mb-4">مدير المنصة</p>
                <p className="text-gray-300 text-sm">المتخصص في اضافة الاختبارات.</p>
                <div className="flex gap-3 mt-4">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07a4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden group hover:bg-white/10 transition-all duration-300 hover:-translate-y-2">
                <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-1">عمر علام</h3>
                <p className="text-primary/90 mb-4">مدير المنصة</p>
                <p className="text-gray-300 text-sm">المتخصص في اضافة الاختبارات.</p>
                <div className="flex gap-3 mt-4">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996a4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07a4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden group hover:bg-white/10 transition-all duration-300 hover:-translate-y-2">
                <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-1">محمد اسامة</h3>
                <p className="text-primary/90 mb-4">مدير المنصة</p>
                <p className="text-gray-300 text-sm">المتخصص في اضافة الاختبارات.</p>
                <div className="flex gap-3 mt-4">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996a4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07a4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
