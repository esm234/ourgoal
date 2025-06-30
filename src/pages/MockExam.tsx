import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, BookOpen, Play, Filter, GraduationCap, Target, Settings, CheckCircle, ArrowRight, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const StartScreen = () => {
  // Add scrollbar stability on component mount
  useEffect(() => {
    // Ensure scrollbar is always visible to prevent layout shifts
    document.documentElement.style.overflowY = 'scroll';
    
    return () => {
      // Cleanup on unmount
      document.documentElement.style.overflowY = '';
    };
  }, []);

  // Load saved settings from localStorage
  const loadSavedSettings = () => {
    try {
      const saved = localStorage.getItem('examSettings');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading saved settings:', error);
    }
    return {
      examMode: 'sectioned',
      timerMode: 'none',
      selectedTimerDuration: 13,
      questionTypeFilter: 'all',
      selectedQuestionType: 'analogy',
      rcQuestionOrder: 'sequential'
    };
  };

  // Local state for configuration with saved settings
  const [settings, setSettings] = useState(loadSavedSettings());
  const {
    examMode,
    timerMode,
    selectedTimerDuration,
    questionTypeFilter,
    selectedQuestionType,
    rcQuestionOrder
  } = settings;

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('examSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const questionTypes = [
    { value: 'analogy', label: 'التناظر اللفظي', icon: '🔗', description: 'العلاقات بين الكلمات' },
    { value: 'completion', label: 'إكمال الجمل', icon: '📝', description: 'ملء الفراغات المناسبة' },
    { value: 'error', label: 'الخطأ السياقي', icon: '🔍', description: 'تحديد الأخطاء اللغوية' },
    { value: 'rc', label: 'استيعاب المقروء', icon: '📖', description: 'فهم النصوص والمقاطع' },
    { value: 'odd', label: 'المفردة الشاذة', icon: '🎯', description: 'تحديد الكلمة المختلفة' }
  ];

  const [showExamScreen, setShowExamScreen] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // لاحقًا: سنحمّل الأسئلة الحقيقية حسب الإعدادات
  const dummyQuestions = [
    { question: 'ما هو جمع كلمة "كتاب"؟', options: ['كتب', 'كتابات', 'كتابون', 'كتبة'], answer: 0 },
    { question: 'ما مرادف كلمة "سعيد"؟', options: ['حزين', 'فرحان', 'غاضب', 'متعب'], answer: 1 },
  ];

  const navigate = useNavigate();

  const handleStartExam = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate('/mock-exam/exam', { state: settings });
  };

  const handleTimerModeChange = (mode) => {
    updateSetting('timerMode', mode);
  };

  const handleTimerDurationChange = (duration) => {
    updateSetting('selectedTimerDuration', parseInt(duration));
  };

  const getQuestionTypeInfo = () => {
    return questionTypes.find(type => type.value === selectedQuestionType);
  };

  // Helper function to get the display text for selected question type
  const getSelectedQuestionTypeDisplay = () => {
    const selectedType = questionTypes.find(type => type.value === selectedQuestionType);
    return selectedType ? selectedType.label : 'اختر نوع الأسئلة';
  };

  // Helper function to get the display text for selected timer duration
  const getSelectedTimerDurationDisplay = () => {
    return `${selectedTimerDuration} دقيقة`;
  };

  if (showExamScreen) {
    const q = dummyQuestions[currentQuestionIndex];
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-100 flex flex-col items-center justify-center" dir="rtl">
        <div className="w-full max-w-xl bg-white/90 rounded-2xl shadow-2xl p-8 mt-12">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm text-gray-500">سؤال {currentQuestionIndex + 1} من {dummyQuestions.length}</span>
            <button className="text-xs text-purple-600 underline" onClick={() => setShowExamScreen(false)}>عودة للإعدادات</button>
          </div>
          <div className="mb-6 text-lg font-bold text-gray-900">{q.question}</div>
          <div className="space-y-3 mb-8">
            {q.options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <input type="radio" name="answer" id={`opt${i}`} className="accent-purple-600" />
                <label htmlFor={`opt${i}`}>{opt}</label>
              </div>
            ))}
          </div>
          <div className="flex justify-between">
            <button
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 disabled:opacity-50"
              onClick={() => setCurrentQuestionIndex(i => i - 1)}
              disabled={currentQuestionIndex === 0}
            >
              السابق
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-purple-600 text-white disabled:opacity-50"
              onClick={() => setCurrentQuestionIndex(i => i + 1)}
              disabled={currentQuestionIndex === dummyQuestions.length - 1}
            >
              التالي
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-100" dir="rtl">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-6">
              <GraduationCap className="h-16 w-16 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            مركز اختبارات اللفظي
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            موقع متكامل لاختبارات القدرات اللفظية مع أدوات متقدمة للتدريب والتقييم
          </p>
          <div className="flex justify-center gap-8 text-blue-100">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <span>أكثر من 6000+ سؤال</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <span>6 أقسام مخصصة</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <span>تقييم فوري</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">إعدادات الاختبار</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            اختر الإعدادات المناسبة لك لبدء تجربة اختبار مخصصة وفعالة
          </p>
        </div>

        {/* Configuration Cards - 4 cards side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
          {/* Question Type Filter */}
          <Card className="text-right border-2 border-transparent shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full p-3 transition-transform duration-300 hover:scale-110">
                  <Filter className="h-6 w-6 text-white" />
                </div>
              </div>
              <CardTitle className="text-center text-lg font-bold text-gray-900">
                نوع الأسئلة
              </CardTitle>
              <CardDescription className="text-center text-gray-600 text-sm">
                اختر نوع اسئلة الاختبار
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <RadioGroup 
                value={questionTypeFilter} 
                onValueChange={(value) => {
                  updateSetting('questionTypeFilter', value);
                }}
              >
                <div 
                  className={`rounded-lg border-2 transition-all duration-300 hover:shadow-md hover:scale-[1.02] cursor-pointer ${questionTypeFilter === 'all' ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-400 shadow-md p-3' : 'bg-white border-gray-200 p-3 hover:border-purple-300 hover:bg-purple-50'}`}
                >
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="all" id="all-types" className="text-purple-600" />
                    <Label htmlFor="all-types" className="cursor-pointer flex-1 text-right">
                      <div>
                        <div className="font-bold text-gray-900 text-sm mb-1">جميع الأنواع</div>
                        <div className="text-xs text-gray-600">اختبار شامل على جميع انواع الاسئلة</div>
                      </div>
                    </Label>
                  </div>
                </div>
                <div 
                  className={`rounded-lg border-2 transition-all duration-300 hover:shadow-md hover:scale-[1.02] cursor-pointer ${questionTypeFilter === 'specific' ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-400 shadow-md p-3' : 'bg-white border-gray-200 p-3 hover:border-purple-300 hover:bg-purple-50'}`}
                >
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="specific" id="specific-type" className="text-purple-600" />
                    <Label htmlFor="specific-type" className="cursor-pointer flex-1 text-right">
                      <div>
                        <div className="font-bold text-gray-900 text-sm mb-1">نوع معين</div>
                        <div className="text-xs text-gray-600">تدريب مركز على نوع واحد</div>
                      </div>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
              
              {/* Fixed layout shift solution for question type dropdown */}
              <div className={`mt-4 space-y-3 transition-opacity duration-300 ${questionTypeFilter === 'specific' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className={`transition-all duration-300 overflow-hidden ${questionTypeFilter === 'specific' ? 'max-h-[100px]' : 'max-h-0'}`}>
                  <label className="text-xs font-bold block text-right text-gray-900 mb-1" dir="rtl">
                    اختر نوع الأسئلة:
                  </label>
                  <select
                    value={selectedQuestionType}
                    onChange={e => updateSetting('selectedQuestionType', e.target.value)}
                    className="w-full h-10 border-2 border-gray-200 rounded-md bg-white text-gray-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                  >
                    {questionTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exam Mode Configuration */}
          <Card className="text-right border-2 border-transparent shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full p-3 transition-transform duration-300 hover:scale-110">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
              </div>
              <CardTitle className="text-center text-lg font-bold text-gray-900">
                نمط الاختبار
              </CardTitle>
              <CardDescription className="text-center text-gray-600 text-sm">
                اختر طريقة عرض الأسئلة
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <RadioGroup 
                value={examMode} 
                onValueChange={(value) => {
                  updateSetting('examMode', value);
                }}
              >
                <div 
                  className={`rounded-lg border-2 transition-all duration-300 hover:shadow-md hover:scale-[1.02] cursor-pointer ${examMode === 'sectioned' ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-400 shadow-md p-3' : 'bg-white border-gray-200 p-3 hover:border-purple-300 hover:bg-purple-50'}`}
                >
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="sectioned" id="sectioned" className="text-purple-600" />
                    <Label htmlFor="sectioned" className="cursor-pointer flex-1 text-right">
                      <div>
                        <div className="font-bold text-gray-900 text-sm mb-1">أقسام مع مراجعة</div>
                        <div className="text-xs text-gray-600">
                          اختبار مقسم مع امكانية المراجعة
                        </div>
                      </div>
                    </Label>
                  </div>
                </div>
                <div 
                  className={`rounded-lg border-2 transition-all duration-300 hover:shadow-md hover:scale-[1.02] cursor-pointer ${examMode === 'single' ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-400 shadow-md p-3' : 'bg-white border-gray-200 p-3 hover:border-purple-300 hover:bg-purple-50'}`}
                >
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="single" id="single" className="text-purple-600" />
                    <Label htmlFor="single" className="cursor-pointer flex-1 text-right">
                      <div>
                        <div className="font-bold text-gray-900 text-sm mb-1">مجمع في قسم واحد</div>
                        <div className="text-xs text-gray-600">
                          جميع الأسئلة متتالية بدون توقف
                        </div>
                      </div>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Timer Configuration */}
          <Card className="text-right border-2 border-transparent shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-gradient-to-r from-purple-500 to-orange-500 rounded-full p-3 transition-transform duration-300 hover:scale-110">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
              <CardTitle className="text-center text-lg font-bold text-gray-900">
                إعدادات المؤقت
              </CardTitle>
              <CardDescription className="text-center text-gray-600 text-sm">
                اختر نمط المؤقت المناسب
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <RadioGroup 
                value={timerMode} 
                onValueChange={(value) => {
                  updateSetting('timerMode', value);
                }}
              >
                <div 
                  className={`rounded-lg border-2 transition-all duration-300 hover:shadow-md hover:scale-[1.02] cursor-pointer ${timerMode === 'none' ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-400 shadow-md p-3' : 'bg-white border-gray-200 p-3 hover:border-purple-300 hover:bg-purple-50'}`}
                >
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="none" id="no-timer" className="text-purple-600" />
                    <Label htmlFor="no-timer" className="cursor-pointer flex-1 text-right">
                      <div>
                        <div className="font-bold text-gray-900 text-sm mb-1">بدون مؤقت</div>
                        <div className="text-xs text-gray-600">
                          اختبار بدون مؤقت
                        </div>
                      </div>
                    </Label>
                  </div>
                </div>
                <div 
                  className={`rounded-lg border-2 transition-all duration-300 hover:shadow-md hover:scale-[1.02] cursor-pointer ${timerMode === 'total' ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-400 shadow-md p-3' : 'bg-white border-gray-200 p-3 hover:border-purple-300 hover:bg-purple-50'}`}
                >
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="total" id="total-timer" className="text-purple-600" />
                    <Label htmlFor="total-timer" className="cursor-pointer flex-1 text-right">
                      <div>
                        <div className="font-bold text-gray-900 text-sm mb-1">مع مؤقت</div>
                        <div className="text-xs text-gray-600">
                          اختبار مع مؤقت
                        </div>
                      </div>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
              
              {/* Fixed layout shift solution for timer dropdown */}
              <div className={`mt-4 space-y-3 transition-opacity duration-300 ${timerMode !== 'none' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className={`transition-all duration-300 overflow-hidden ${timerMode !== 'none' ? 'max-h-[100px]' : 'max-h-0'}`}>
                  <label className="text-xs font-bold block text-right text-gray-900 mb-1" dir="rtl">
                    مدة المؤقت:
                  </label>
                  <select
                    value={selectedTimerDuration}
                    onChange={e => updateSetting('selectedTimerDuration', parseInt(e.target.value))}
                    className="w-full h-10 border-2 border-gray-200 rounded-md bg-white text-gray-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                  >
                    {[5,10,13,15,20,25,30,45,60,90,120].map(val => (
                      <option key={val} value={val}>{val} دقيقة</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reading Comprehension Order - Moved to be last */}
          <Card className="text-right border-2 border-transparent shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full p-3 transition-transform duration-300 hover:scale-110">
                  <Target className="h-6 w-6 text-white" />
                </div>
              </div>
              <CardTitle className="text-center text-lg font-bold text-gray-900">
                ترتيب استيعاب المقروء
              </CardTitle>
              <CardDescription className="text-center text-gray-600 text-sm">
                اختر ترتيب أسئلة استيعاب المقروء
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <RadioGroup 
                value={rcQuestionOrder} 
                onValueChange={(value) => {
                  updateSetting('rcQuestionOrder', value);
                }}
              >
                <div 
                  className={`rounded-lg border-2 transition-all duration-300 hover:shadow-md hover:scale-[1.02] cursor-pointer ${rcQuestionOrder === 'sequential' ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-400 shadow-md p-3' : 'bg-white border-gray-200 p-3 hover:border-purple-300 hover:bg-purple-50'}`}
                >
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="sequential" id="sequential" className="text-purple-600" />
                    <Label htmlFor="sequential" className="cursor-pointer flex-1 text-right">
                      <div>
                        <div className="font-bold text-gray-900 text-sm mb-1">متتالية</div>
                        <div className="text-xs text-gray-600">
                          أسئلة من نفس النص تأتي متتابعة
                        </div>
                      </div>
                    </Label>
                  </div>
                </div>
                <div 
                  className={`rounded-lg border-2 transition-all duration-300 hover:shadow-md hover:scale-[1.02] cursor-pointer ${rcQuestionOrder === 'random' ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-400 shadow-md p-3' : 'bg-white border-gray-200 p-3 hover:border-purple-300 hover:bg-purple-50'}`}
                >
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="random" id="random" className="text-purple-600" />
                    <Label htmlFor="random" className="cursor-pointer flex-1 text-right">
                      <div>
                        <div className="font-bold text-gray-900 text-sm mb-1">عشوائية</div>
                        <div className="text-xs text-gray-600">
                          توزيع عشوائي كامل للأسئلة
                        </div>
                      </div>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        {/* Start Button Section */}
        <div className="text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 max-w-4xl mx-auto">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">جاهز للبدء؟</h3>
              <p className="text-gray-600">
                {questionTypeFilter === 'specific' 
                  ? `اختبار ${getQuestionTypeInfo()?.label} - ${examMode === 'sectioned' ? 'مع مراجعة' : 'متتالي'} - ${timerMode === 'none' ? 'بدون مؤقت' : `${selectedTimerDuration} دقيقة`}`
                  : `اختبار شامل - ${examMode === 'sectioned' ? 'مع مراجعة' : 'متتالي'} - ${timerMode === 'none' ? 'بدون مؤقت' : `${selectedTimerDuration} دقيقة`}`
                }
              </p>
            </div>
            
            <Button 
              onClick={handleStartExam}
              size="lg"
              className="px-12 py-6 text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Play className="h-7 w-7 ml-3" />
              بدء الاختبار
              <ArrowRight className="h-6 w-6 mr-3" />
            </Button>
            
            {questionTypeFilter === 'specific' && (
              <div className="mt-4 inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium hover:bg-purple-200 transition-colors">
                <Target className="h-4 w-4" />
                <span>{getQuestionTypeInfo()?.label}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Features Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center hover:bg-blue-200 transition-colors">
              <Target className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">تدريب مخصص</h3>
            <p className="text-gray-600 text-sm">اختر نوع الأسئلة التي تريد التركيز عليها</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center hover:bg-green-200 transition-colors">
              <Settings className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">إعدادات مرنة</h3>
            <p className="text-gray-600 text-sm">تحكم كامل في وقت الاختبار ونمط العرض</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center hover:bg-purple-200 transition-colors">
              <CheckCircle className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">تقييم فوري</h3>
            <p className="text-gray-600 text-sm">احصل على النتائج والتحليل فور انتهاء الاختبار</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;