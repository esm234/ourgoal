import React, { useState, useRef, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleSlide = (direction: 'prev' | 'next') => {
    if (direction === 'next') {
      setCurrentSlide((prev) => (prev === 3 ? 0 : prev + 1));
    } else {
      setCurrentSlide((prev) => (prev === 0 ? 3 : prev - 1));
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
  }, [currentSlide]);

  useEffect(() => {
    const interval = setInterval(() => {
      handleSlide('next');
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-background py-20 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 mb-10 lg:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
                منصة الإعداد لاختبارات <span className="text-primary">اسرار للتفوق</span>
              </h1>
              <p className="text-xl mb-8 text-muted-foreground">
                تدرب على اختبارات قياس المختلطة (لفظي + كمي) وحسن معدلك التقديري للمعادلة المصرية في السعودية
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/qiyas-tests">
                  <Button className="text-lg px-6 py-6 bg-primary hover:bg-primary/90 flex items-center">
                    ابدأ اختبار قياس الآن
                    <ArrowRight className="mr-2" size={18} />
                  </Button>
                </Link>
                <Link to="/equivalency-calculator">
                  <Button variant="outline" className="text-lg px-6 py-6 flex items-center">
                    حساب المعدل التقديري
                    <ArrowRight className="mr-2" size={18} />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2">
              <img
                src="https://lh7-us.googleusercontent.com/pbYvrUffQasCqI5i42vKBc3U55GKAFa-N5ay84n7xjEiGM7a6x4drbhVuZRM6KwBCPtzls-Yb7u-QNDrUPksvxC7J14YXurFNIibdg_Hjrm2tWSP3pNW4Pt5Wf1x3o5i19QiPihN-xBTyqI7UuvvMO1b0KWQ7nB2XHGm9kr7N1vhVg4mpqJrkhreRlH9MpBTeFnqtKph?key=hEv8vchztg3tFh4Mt59OTQ"
                alt="طلاب يدرسون"
                className="rounded-lg shadow-xl w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 bg-card">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">خدماتنا</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              نقدم مجموعة من الخدمات المتميزة لمساعدة طلاب المعادلة المصرية على تحقيق أعلى الدرجات
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 bg-background border-2 border-primary rounded-xl hover:shadow-lg transition-shadow">
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8 text-primary"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">اختبارات قياس تجريبية</h3>
              <p className="text-muted-foreground">
                اختبارات مختلطة بين اللفظي والكمي تحاكي اختبار قياس الحقيقي لتكون مستعداً تماماً
              </p>
            </Card>

            <Card className="p-6 bg-background border-2 border-primary rounded-xl hover:shadow-lg transition-shadow">
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8 text-primary"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">تحليل أداء مفصل</h3>
              <p className="text-muted-foreground">
                تقارير تفصيلية توضح نقاط القوة والضعف لديك في مختلف أقسام الاختبار لتركز على تحسينها
              </p>
            </Card>

            <Card className="p-6 bg-background border-2 border-primary rounded-xl hover:shadow-lg transition-shadow">
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8 text-primary"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">حاسبة المعادلة التقديرية</h3>
              <p className="text-muted-foreground">
                احسب معدلك التقديري للمعادلة المصرية بناء على نتائج الثانوية واختبار القدرات
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Learning Path Section */}
      <section className="py-20 px-4 bg-card">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">مسار التعلم لاختبار القدرات</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              خطة منهجية للتحضير لاختبار القدرات العامة
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
              {/* Background */}
              <rect width="800" height="600" fill="#0f172a" rx="10" ry="10"/>
              
              {/* Title */}
              <text x="400" y="50" font-family="Arial, sans-serif" font-size="28" fill="#06b6d4" text-anchor="middle" font-weight="bold">مسار التعلم لاختبار القدرات</text>
              
              {/* Main Flow Path */}
              <path d="M150,110 C150,110 650,110 650,110 C700,110 700,500 650,500 C650,500 150,500 150,500 C100,500 100,110 150,110 Z" fill="none" stroke="#0284c7" stroke-width="4" stroke-dasharray="8,4"/>

              {/* Stages Boxes */}
              {/* Stage 1 */}
              <rect x="250" y="130" width="300" height="60" rx="10" ry="10" fill="#164e63" stroke="#0ea5e9" stroke-width="2"/>
              <text x="400" y="167" font-family="Arial, sans-serif" font-size="16" fill="#ffffff" text-anchor="middle" font-weight="bold">المرحلة الأولى: التأسيس</text>

              {/* Stage 2 */}
              <rect x="250" y="220" width="300" height="60" rx="10" ry="10" fill="#164e63" stroke="#0ea5e9" stroke-width="2"/>
              <text x="400" y="257" font-family="Arial, sans-serif" font-size="16" fill="#ffffff" text-anchor="middle" font-weight="bold">المرحلة الثانية: المحوسب</text>

              {/* Stage 3 */}
              <rect x="250" y="310" width="300" height="60" rx="10" ry="10" fill="#164e63" stroke="#0ea5e9" stroke-width="2"/>
              <text x="400" y="347" font-family="Arial, sans-serif" font-size="16" fill="#ffffff" text-anchor="middle" font-weight="bold">المرحلة الثالثة: مراجعة على البنوك</text>

              {/* Stage 4 */}
              <rect x="250" y="400" width="300" height="60" rx="10" ry="10" fill="#164e63" stroke="#0ea5e9" stroke-width="2"/>
              <text x="400" y="437" font-family="Arial, sans-serif" font-size="16" fill="#ffffff" text-anchor="middle" font-weight="bold">المرحلة الرابعة: المراجعة النهائية</text>

              {/* Final Stage */}
              <rect x="200" y="500" width="400" height="60" rx="10" ry="10" fill="#0c4a6e" stroke="#22d3ee" stroke-width="3"/>
              <text x="400" y="537" font-family="Arial, sans-serif" font-size="18" fill="#ffffff" text-anchor="middle" font-weight="bold">جاهزيتك لدخول الاختبار بالتوفيق</text>

              {/* Connecting Arrows */}
              <polyline points="400,190 400,220" fill="none" stroke="#06b6d4" stroke-width="3" stroke-linecap="round" marker-end="url(#arrowhead)"/>
              <polyline points="400,280 400,310" fill="none" stroke="#06b6d4" stroke-width="3" stroke-linecap="round" marker-end="url(#arrowhead)"/>
              <polyline points="400,370 400,400" fill="none" stroke="#06b6d4" stroke-width="3" stroke-linecap="round" marker-end="url(#arrowhead)"/>
              <polyline points="400,460 400,500" fill="none" stroke="#06b6d4" stroke-width="3" stroke-linecap="round" marker-end="url(#arrowhead)"/>

              {/* Arrow Definition */}
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#06b6d4"/>
                </marker>
              </defs>

              {/* Side Notes */}
              {/* Stage 1 Notes */}
              <rect x="100" y="130" width="130" height="60" rx="8" ry="8" fill="#075985" stroke="#0ea5e9" stroke-width="1"/>
              <text x="165" y="150" font-family="Arial, sans-serif" font-size="12" fill="#ffffff" text-anchor="middle">تأسيس الكمي</text>
              <text x="165" y="170" font-family="Arial, sans-serif" font-size="12" fill="#ffffff" text-anchor="middle">٤-٦ أسابيع</text>
              <text x="165" y="190" font-family="Arial, sans-serif" font-size="12" fill="#ffffff" text-anchor="middle">ساعتين يومياً أقل شي</text>

              {/* Stage 2 Notes */}
              <rect x="100" y="220" width="130" height="60" rx="8" ry="8" fill="#075985" stroke="#0ea5e9" stroke-width="1"/>
              <text x="165" y="245" font-family="Arial, sans-serif" font-size="12" fill="#ffffff" text-anchor="middle">كمي</text>
              <text x="165" y="265" font-family="Arial, sans-serif" font-size="12" fill="#ffffff" text-anchor="middle">٣ اختبارات أقل شي في البداية</text>

              {/* Stage 3 Notes */}
              <rect x="100" y="310" width="130" height="60" rx="8" ry="8" fill="#075985" stroke="#0ea5e9" stroke-width="1"/>
              <text x="165" y="335" font-family="Arial, sans-serif" font-size="12" fill="#ffffff" text-anchor="middle">كمي</text>
              <text x="165" y="355" font-family="Arial, sans-serif" font-size="12" fill="#ffffff" text-anchor="middle">ساعتين أقل شي</text>

              {/* Stage 4 Notes */}
              <rect x="100" y="400" width="130" height="60" rx="8" ry="8" fill="#075985" stroke="#0ea5e9" stroke-width="1"/>
              <text x="165" y="425" font-family="Arial, sans-serif" font-size="12" fill="#ffffff" text-anchor="middle">الكمي</text>
              <text x="165" y="445" font-family="Arial, sans-serif" font-size="12" fill="#ffffff" text-anchor="middle">مجلدات أخطائك</text>

              {/* Right Side Notes */}
              {/* Stage 1 Right */}
              <rect x="570" y="130" width="130" height="60" rx="8" ry="8" fill="#075985" stroke="#0ea5e9" stroke-width="1"/>
              <text x="635" y="155" font-family="Arial, sans-serif" font-size="12" fill="#ffffff" text-anchor="middle">تأسيس لفظي</text>
              <text x="635" y="175" font-family="Arial, sans-serif" font-size="12" fill="#ffffff" text-anchor="middle">٢-٤ أسابيع</text>

              {/* Stage 2 Right */}
              <rect x="570" y="220" width="130" height="60" rx="8" ry="8" fill="#075985" stroke="#0ea5e9" stroke-width="1"/>
              <text x="635" y="245" font-family="Arial, sans-serif" font-size="12" fill="#ffffff" text-anchor="middle">لفظي</text>
              <text x="635" y="265" font-family="Arial, sans-serif" font-size="12" fill="#ffffff" text-anchor="middle">فيديوهين في اليوم أقل شي</text>

              {/* Stage 3 Right */}
              <rect x="570" y="310" width="130" height="60" rx="8" ry="8" fill="#075985" stroke="#0ea5e9" stroke-width="1"/>
              <text x="635" y="335" font-family="Arial, sans-serif" font-size="12" fill="#ffffff" text-anchor="middle">لفظي</text>
              <text x="635" y="355" font-family="Arial, sans-serif" font-size="12" fill="#ffffff" text-anchor="middle">ساعتين مذاكرة أقل شي</text>

              {/* Stage 4 Right */}
              <rect x="570" y="400" width="130" height="60" rx="8" ry="8" fill="#075985" stroke="#0ea5e9" stroke-width="1"/>
              <text x="635" y="425" font-family="Arial, sans-serif" font-size="12" fill="#ffffff" text-anchor="middle">لفظي</text>
              <text x="635" y="445" font-family="Arial, sans-serif" font-size="12" fill="#ffffff" text-anchor="middle">مراجعة جميع أخطائك</text>
            </svg>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 bg-[#1A2237]">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">خبراؤنا</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              فريق من الخبراء المتخصصين في مجال التعليم والتدريب
            </p>
          </div>

          <div className="relative max-w-6xl mx-auto">
            {/* Slider Container */}
            <div className="overflow-hidden">
              <div className="flex transition-transform duration-500 ease-in-out" id="teamSlider">
                {/* Team Member 1 */}
                <div className="min-w-[300px] md:min-w-[400px] p-4">
                  <Card className="bg-[#1A2237] border-2 border-[#03DAC6] rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white text-center mb-2">محمد منصور</h3>
                      <p className="text-gray-300 text-center">مدير المنصة</p>
                    </div>
                  </Card>
                </div>

                {/* Team Member 2 */}
                <div className="min-w-[300px] md:min-w-[400px] p-4">
                  <Card className="bg-[#1A2237] border-2 border-[#03DAC6] rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white text-center mb-2">اسلام احمد</h3>
                      <p className="text-gray-300 text-center">مطور المنصة</p>
                    </div>
                  </Card>
                </div>

                {/* Team Member 3 */}
                <div className="min-w-[300px] md:min-w-[400px] p-4">
                  <Card className="bg-[#1A2237] border-2 border-[#03DAC6] rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white text-center mb-2">محمد اسامه</h3>
                      <p className="text-gray-300 text-center">خبير الرياضيات</p>
                    </div>
                  </Card>
                </div>

                {/* Team Member 4 */}
                <div className="min-w-[300px] md:min-w-[400px] p-4">
                  <Card className="bg-[#1A2237] border-2 border-[#03DAC6] rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white text-center mb-2">عمر علام</h3>
                      <p className="text-gray-300 text-center">خبير الفيزياء</p>
                    </div>
                  </Card>
                </div>

                {/* Team Member 5 */}
                <div className="min-w-[300px] md:min-w-[400px] p-4">
                  <Card className="bg-[#1A2237] border-2 border-[#03DAC6] rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white text-center mb-2">احمد طلبه</h3>
                      <p className="text-gray-300 text-center">خبير الكيمياء</p>
                    </div>
                  </Card>
                </div>

                {/* Team Member 6 */}
                <div className="min-w-[300px] md:min-w-[400px] p-4">
                  <Card className="bg-[#1A2237] border-2 border-[#03DAC6] rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white text-center mb-2">احمد المعني</h3>
                      <p className="text-gray-300 text-center">خبير اللغة العربية</p>
                    </div>
                  </Card>
                </div>

                {/* Team Member 7 */}
                <div className="min-w-[300px] md:min-w-[400px] p-4">
                  <Card className="bg-[#1A2237] border-2 border-[#03DAC6] rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white text-center mb-2">ماهيتاب ايهاب</h3>
                      <p className="text-gray-300 text-center">خبيرة الرياضيات</p>
                    </div>
                  </Card>
                </div>

                {/* Team Member 8 */}
                <div className="min-w-[300px] md:min-w-[400px] p-4">
                  <Card className="bg-[#1A2237] border-2 border-[#03DAC6] rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white text-center mb-2">بسنت</h3>
                      <p className="text-gray-300 text-center">خبيرة اللغة العربية</p>
                    </div>
                  </Card>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#03DAC6] text-white p-2 rounded-full shadow-lg hover:bg-[#03DAC6]/90 transition-colors"
              onClick={() => handleSlide('prev')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#03DAC6] text-white p-2 rounded-full shadow-lg hover:bg-[#03DAC6]/90 transition-colors"
              onClick={() => handleSlide('next')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Indicators */}
            <div className="flex justify-center mt-8 space-x-2">
              {[0, 1, 2, 3].map((index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    currentSlide === index ? 'bg-[#03DAC6]' : 'bg-gray-400'
                  }`}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
