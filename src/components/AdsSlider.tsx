import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Target,
  Brain,
  Zap,
  Clock,
  Lightbulb,
  CheckCircle,
  LucideIcon,
  Play,
  Pause
} from "lucide-react";

// تعريف نوع البيانات للميزة
interface Feature {
  icon: LucideIcon;
  title: string;
  subtitle: string;
}

// تعريف نوع البيانات للإعلان
interface AdData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  imageAlt: string;
  badge: string;
  badgeType: 'beta' | 'new';
  buttonText: string;
  buttonDisabled: boolean;
  features: Feature[];
  colors: {
    primary: string;
    accent: string;
    button: string;
  };
  linkTo: string | null;
  external: boolean;
}

// تعريف props للمكون
interface AdsSliderProps {
  showExamAd?: boolean;
  showCoursesBanner?: boolean;
}

// بيانات الإعلانات
const adsData: AdData[] = [
  {
    id: 'exam-simulator',
    title: 'محاكي الاختبار التفاعلي',
    subtitle: 'محاكي الاختبار',
    description: 'تجربة محاكاة واقعية لاختبار القدرات مع تقييم ذكي وتحليل مفصل لنقاط القوة والضعف لديك.',
    image: '/Screenshot_٢٠٢٥٠٧٢٩_١٥٠٢٢٢_Chrome.jpg',
    imageAlt: 'معاينة محاكي اختبار القدرات - تجربة تفاعلية واقعية',
    badge: 'جديد 🔥',
    badgeType: 'new',
    buttonText: ' استكشف المحاكي الان',
    buttonDisabled: false,
    features: [
      { icon: Brain, title: 'محاكاة واقعية', subtitle: 'بيئة الاختبار الحقيقية' },
      { icon: Zap, title: 'تقييم فوري', subtitle: 'نتائج لحظية' },
      { icon: Target, title: 'تحليل ذكي', subtitle: 'إحصائيات مفصلة' },
      { icon: CheckCircle, title: 'مجاني', subtitle: 'بدون أي رسوم' }
    ],
    colors: {
      primary: 'from-slate-900 via-purple-900 to-slate-900',
      accent: 'from-cyan-400 via-blue-400 to-purple-400',
      button: 'from-gray-600 to-gray-700'
    },
    linkTo: "exam.ourgoal.site",
    external: true
  },
  {
    id: 'last-dance-course',
    title: 'دورة The Last Dance للقدرات اللفظية',
    subtitle: 'The Last Dance',
    description: 'دورة تأسيسية متخصصة في القدرات اللفظية، مصممة لتكون رحلتك الأخيرة نحو الإتقان الكامل. تغطي جميع أنواع الأسئلة اللفظية بطريقة عملية ومبسطة.',
    image: '/photo_٢٠٢٥-٠٦-١٤_١٨-٣٣-٤٢.jpg',
    imageAlt: 'The Last Dance Course - دورة التأسيس اللفظي الشاملة',
    badge: '🔥 جديد',
    badgeType: 'new',
    buttonText: 'استكشف الدورة الآن',
    buttonDisabled: false,
    features: [
      { icon: CheckCircle, title: 'مجاني 100%', subtitle: 'بدون أي رسوم' },
      { icon: Target, title: 'فيديوهات شرح', subtitle: 'محتوى بصري' },
      { icon: CheckCircle, title: 'ملفات PDF', subtitle: 'مواد للتحميل' },
      { icon: Brain, title: 'اختبارات تفاعلية', subtitle: 'تطبيق عملي' }
    ],
    colors: {
      primary: 'from-blue-900 via-indigo-900 to-purple-900',
      accent: 'from-blue-400 via-indigo-400 to-purple-400',
      button: 'from-white to-white'
    },
    linkTo: '/courses/the-last-dance',
    external: false
  }
];

const AdsSlider: React.FC<AdsSliderProps> = ({ showExamAd = true, showCoursesBanner = true }) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);

  // تحديد الإعلانات المعروضة
  const activeAds = adsData.filter(ad => {
    if (ad.id === 'exam-simulator' && !showExamAd) return false;
    if (ad.id === 'last-dance-course' && !showCoursesBanner) return false;
    return true;
  });

  // إذا لم تكن هناك إعلانات لعرضها
  if (activeAds.length === 0) return null;

  // التبديل التلقائي مع progress bar
  useEffect(() => {
    if (!isAutoPlaying || activeAds.length <= 1) return;

    const duration = 8000; // 8 ثواني  
    const interval = 50; // تحديث كل 50ms  
    const increment = (interval / duration) * 100;  

    const progressInterval = setInterval(() => {  
      setProgress(prev => {  
        if (prev >= 100) {  
          setCurrentSlide(current => (current + 1) % activeAds.length);  
          return 0;  
        }  
        return prev + increment;  
      });  
    }, interval);  

    return () => clearInterval(progressInterval);
  }, [isAutoPlaying, activeAds.length, currentSlide]);

  const handleSlideChange = (index: number): void => {
    setCurrentSlide(index);
    setProgress(0);
    setIsAutoPlaying(false);
    // إعادة تشغيل التلقائي بعد 15 ثانية
    setTimeout(() => setIsAutoPlaying(true), 15000);
  };

  const toggleAutoPlay = (): void => {
    setIsAutoPlaying(!isAutoPlaying);
    if (isAutoPlaying) {
      setProgress(0);
    }
  };

  const currentAd = activeAds[currentSlide];

  return (
    <section className="relative py-16 flex items-center justify-center overflow-hidden">
      {/* خلفية متحركة مع تأثيرات بصرية محسنة */}
      <div className={`absolute inset-0 bg-gradient-to-br ${currentAd.colors.primary} transition-all duration-1000`}>
        {/* شبكة نقاط ديناميكية */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(156, 146, 172, 0.3) 1px, transparent 0)',
          backgroundSize: '40px 40px',
          animation: 'float 20s ease-in-out infinite'
        }}></div>

        {/* كرات متحركة محسنة */}  
        <div className="absolute top-10 left-10 w-80 h-80 bg-gradient-to-r from-cyan-500/25 to-blue-500/25 rounded-full blur-3xl animate-pulse"></div>  
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-bounce" style={{animationDuration: '6s'}}></div>  
        <div className="absolute bottom-10 left-1/3 w-72 h-72 bg-gradient-to-r from-indigo-500/25 to-cyan-500/25 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>  
          
        {/* موجات متحركة */}  
        <div className="absolute inset-0 opacity-20">  
          <div className="absolute top-1/4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent animate-pulse"></div>  
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400/60 to-transparent animate-pulse" style={{animationDelay: '1s'}}></div>  
          <div className="absolute top-3/4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400/60 to-transparent animate-pulse" style={{animationDelay: '2s'}}></div>  
        </div>  

        {/* تأثير الجسيمات المتحركة */}  
        <div className="absolute inset-0">  
          {[...Array(6)].map((_, i) => (  
            <div  
              key={i}  
              className="absolute w-1 h-1 bg-white/40 rounded-full animate-ping"  
              style={{  
                top: `${Math.random() * 100}%`,  
                left: `${Math.random() * 100}%`,  
                animationDelay: `${i * 0.5}s`,  
                animationDuration: `${2 + Math.random() * 2}s`  
              }}  
            ></div>  
          ))}  
        </div>  
      </div>  

      <div className="container mx-auto px-4 relative z-10">  
        <div className="relative">  
          {/* الحاوية الرئيسية مع تحسينات بصرية */}  
          <div className="relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-2xl rounded-[2.5rem] border border-white/25 shadow-2xl shadow-black/30 overflow-hidden">  
            {/* تأثير الإضاءة العلوية المحسن */}  
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>  
            <div className="absolute top-0 left-1/4 right-1/4 h-20 bg-gradient-to-b from-white/10 to-transparent blur-xl"></div>  
              
            {/* Progress Bar للتوقيت */}  
            {activeAds.length > 1 && (  
              <div className="absolute top-0 left-0 right-0 z-20">  
                <div className="h-1 bg-black/20 backdrop-blur-sm">  
                  <div   
                    className={`h-full bg-gradient-to-r ${currentAd.colors.accent} transition-all duration-75 ease-linear relative overflow-hidden`}  
                    style={{ width: `${progress}%` }}  
                  >  
                    {/* تأثير الوميض على شريط التقدم */}  
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>  
                  </div>  
                </div>  
                  
                {/* مؤشر التحكم في التشغيل */}  
                <div className="absolute top-4 right-6">  
                  <button  
                    onClick={toggleAutoPlay}  
                    className="group flex items-center justify-center w-10 h-10 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full border border-white/20 transition-all duration-300 hover:scale-110"  
                  >  
                    {isAutoPlaying ? (  
                      <Pause className="w-4 h-4 text-white group-hover:text-cyan-300 transition-colors" />  
                    ) : (  
                      <Play className="w-4 h-4 text-white group-hover:text-cyan-300 transition-colors ml-0.5" />  
                    )}  
                  </button>  
                </div>  
              </div>  
            )}  
              
            {/* محتوى الـ Slider */}  
            <div className="grid lg:grid-cols-2 items-center min-h-[600px] pt-4">  
              {/* القسم الأيسر - المحتوى */}  
              <div className="relative p-8 lg:p-12 xl:p-16">  
                {/* شارة العلامة التجارية محسنة */}  
                <div className="inline-flex items-center gap-3 px-6 py-3 mb-8 rounded-full bg-gradient-to-r from-cyan-500/25 to-blue-500/25 border border-cyan-400/40 backdrop-blur-sm transition-all duration-500 hover:scale-105">  
                  <div className="relative flex items-center">  
                    <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping"></div>  
                    <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full absolute animate-pulse"></div>  
                  </div>  
                  <span className="text-cyan-200 font-bold text-sm tracking-wide">{currentAd.badge}</span>  
                  <Badge className={`${currentAd.badgeType === 'beta' ? 'bg-cyan-500/40 text-cyan-100' : 'bg-orange-500/40 text-orange-100'} border-0 text-xs px-3 py-1 animate-pulse`}>  
                    {currentAd.badgeType === 'beta' ? 'Beta' : 'New'}  
                  </Badge>  
                </div>  

                {/* العنوان الرئيسي مع تأثيرات محسنة */}  
                <h2 className="text-4xl lg:text-5xl xl:text-6xl font-black mb-6 leading-tight">  
                  <span className="block text-white mb-2 drop-shadow-lg">{currentAd.subtitle}</span>  
                  <span className={`block text-transparent bg-gradient-to-r ${currentAd.colors.accent} bg-clip-text animate-gradient drop-shadow-lg`}>  
                    {currentAd.id === 'exam-simulator' ? 'التفاعلي' : 'اللفظية'}  
                  </span>  
                </h2>  

                {/* الوصف محسن */}  
                <p className="text-gray-300 text-lg lg:text-xl mb-10 leading-relaxed max-w-lg">  
                  {currentAd.description}  
                </p>  

                {/* المميزات بتصميم بطاقات صغيرة */}  
                <div className="grid grid-cols-2 gap-4 mb-10">  
                  {currentAd.features.map((feature, index) => (  
                    <div key={index} className="group flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">  
                      <div className={`w-10 h-10 bg-gradient-to-br ${index % 2 === 0 ? 'from-cyan-500 to-blue-600' : 'from-purple-500 to-pink-600'} rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-300`}>  
                        <feature.icon className="w-5 h-5 text-white" />  
                      </div>  
                      <div>  
                        <div className="text-white font-bold text-sm">{feature.title}</div>  
                        <div className="text-gray-400 text-xs">{feature.subtitle}</div>  
                      </div>  
                    </div>  
                  ))}  
                </div>  

                {/* الزر والنص التحفيزي */}
                <div className="space-y-4">
                  {currentAd.linkTo ? (
                    currentAd.external ? (
                      <a href={`https://${currentAd.linkTo}`} target="_blank" rel="noopener noreferrer">
                        <Button 
                          size="lg" 
                          className={`group relative px-8 py-4 bg-gradient-to-r ${currentAd.colors.button} ${currentAd.id === 'last-dance-course' ? 'text-blue-600 hover:bg-white/90' : 'text-gray-300 cursor-not-allowed'} rounded-xl text-lg font-bold overflow-hidden`}
                          disabled={currentAd.buttonDisabled}
                        >
                          {!currentAd.buttonDisabled && (
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          )}
                          {currentAd.buttonDisabled ? (
                            <Clock className="w-5 h-5 mr-3 relative z-10" />
                          ) : (
                            <Target className="w-5 h-5 mr-3 relative z-10" />
                          )}
                          <span className="relative z-10">{currentAd.buttonText}</span>
                        </Button>
                      </a>
                    ) : (
                      <Link to={currentAd.linkTo}>
                        <Button 
                          size="lg" 
                          className={`group relative px-8 py-4 bg-gradient-to-r ${currentAd.colors.button} ${currentAd.id === 'last-dance-course' ? 'text-blue-600 hover:bg-white/90' : 'text-gray-300 cursor-not-allowed'} rounded-xl text-lg font-bold overflow-hidden`}
                          disabled={currentAd.buttonDisabled}
                        >
                          {!currentAd.buttonDisabled && (
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          )}
                          {currentAd.buttonDisabled ? (
                            <Clock className="w-5 h-5 mr-3 relative z-10" />
                          ) : (
                            <Target className="w-5 h-5 mr-3 relative z-10" />
                          )}
                          <span className="relative z-10">{currentAd.buttonText}</span>
                        </Button>
                      </Link>
                    )
                  ) : (
                    <Button   
                      disabled   
                      size="lg"   
                      className="group relative px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-gray-300 cursor-not-allowed rounded-xl text-lg font-bold overflow-hidden"  
                    >  
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>  
                      <Clock className="w-5 h-5 mr-3 relative z-10" />  
                      <span className="relative z-10">{currentAd.buttonText}</span>  
                    </Button>  
                  )}
                    
                  <div className="flex items-center gap-2 text-gray-400 text-sm">  
                    <Lightbulb className="w-4 h-4 text-yellow-400 animate-pulse" />  
                    <span>  
                      {currentAd.id === 'exam-simulator'   
                        ? 'نعمل على إضافة المزيد من المميزات المبتكرة'   
                        : 'دورة مجانية بالكامل مع محتوى تفاعلي متميز'  
                      }  
                    </span>  
                  </div>  
                </div>  
              </div>  

              {/* القسم الأيمن - عرض الصورة بطريقة احترافية */}  
              <div className="relative lg:h-[600px] flex items-center justify-center p-8">  
                {/* حاوية الصورة مع تأثيرات بصرية */}  
                <div className="relative group">  
                  {/* إطار خارجي متحرك */}  
                  <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-pink-500/30 rounded-2xl blur-xl opacity-70 group-hover:opacity-100 transition-all duration-700 animate-pulse"></div>  
                    
                  {/* إطار داخلي */}  
                  <div className="absolute -inset-2 bg-gradient-to-r from-white/10 to-white/5 rounded-xl backdrop-blur-sm"></div>  
                    
                  {/* الصورة الرئيسية */}  
                  <div className="relative overflow-hidden rounded-lg shadow-2xl border border-white/20 bg-black/20 backdrop-blur-sm">  
                    <img  
                      src={currentAd.image}  
                      alt={currentAd.imageAlt}  
                      className="w-full h-auto max-w-md lg:max-w-lg xl:max-w-xl object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"  
                      loading="lazy"  
                    />  
                      
                    {/* طبقة تحسين بصري فوق الصورة */}  
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>  
                      
                    {/* مؤشرات تفاعلية */}  
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">  
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>  
                      <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse delay-200"></div>  
                      <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse delay-400"></div>  
                    </div>  
                      
                    {/* شارة "معاينة" */}  
                    <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-full border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">  
                      معاينة {currentAd.id === 'exam-simulator' ? 'المحاكي' : 'الدورة'}  
                    </div>  
                  </div>  

                  {/* تأثيرات الإضاءة المحيطة */}  
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl -z-10 group-hover:scale-110 transition-transform duration-1000"></div>  
                </div>  

                {/* عناصر تزيينية طائفة */}  
                <div className="absolute top-10 right-10 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>  
                <div className="absolute bottom-16 left-8 w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-500"></div>  
                <div className="absolute top-1/3 left-4 w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-1000"></div>  
              </div>  
            </div>  

            {/* شريط الحالة السفلي مع مؤشر التقدم */}  
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700/50">  
              <div   
                className={`h-full bg-gradient-to-r ${currentAd.colors.accent} opacity-70 transition-all duration-300`}  
                style={{   
                  width: `${((currentSlide + 1) / activeAds.length) * 100}%`  
                }}  
              ></div>  
            </div>  
          </div>  

          {/* تأثير الظل السفلي */}  
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-3/4 h-6 bg-black/20 blur-xl rounded-full"></div>  
        </div>  

        {/* مؤشرات الصور الصغيرة في الأسفل */}  
        {activeAds.length > 1 && (  
          <div className="flex justify-center items-center gap-4 mt-8">  
            {activeAds.map((ad, index) => (  
              <button  
                key={ad.id}  
                onClick={() => handleSlideChange(index)}  
                className={`group relative overflow-hidden rounded-xl transition-all duration-300 hover:scale-110 ${  
                  currentSlide === index   
                    ? 'ring-4 ring-cyan-400/50 shadow-lg shadow-cyan-400/25'   
                    : 'opacity-60 hover:opacity-100'  
                }`}  
              >  
                {/* خلفية متدرجة للمؤشر النشط */}  
                {currentSlide === index && (  
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 animate-pulse"></div>  
                )}  
                  
                {/* الصورة المصغرة */}  
                <img  
                  src={ad.image}  
                  alt={`مؤشر ${ad.subtitle}`}  
                  className="w-16 h-12 lg:w-20 lg:h-14 object-cover rounded-xl border-2 border-white/20 group-hover:border-white/40 transition-all duration-300"  
                />  
                  
                {/* تسمية الإعلان */}  
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm text-white text-xs py-1 px-2 rounded-b-xl">  
                  {ad.subtitle}  
                </div>  
                  
                {/* مؤشر التشغيل للإعلان النشط */}  
                {currentSlide === index && (  
                  <div className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>  
                )}  
              </button>  
            ))}  
          </div>  
        )}  
      </div>  
    </section>
  );
};

export default AdsSlider;
