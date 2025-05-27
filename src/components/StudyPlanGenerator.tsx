import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  CalendarIcon,
  BookOpen,
  Calculator,
  Target,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  Clock,
  TrendingUp,
  Sparkles,
  Zap,
  Star,
  Save
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useStudyPlans } from '@/hooks/useStudyPlans';

interface StudyDay {
  dayNumber: number;
  date: Date;
  verbalTests: number;
  quantitativeTests: number;
  totalTests: number;
  verbalRange: { start: number; end: number };
  quantitativeRange: { start: number; end: number };
  isReviewDay: boolean;
  isFinalReview: boolean;
  roundNumber?: number;
  completed?: boolean;
}

interface StudyPlan {
  totalDays: number;
  reviewRounds: number;
  studyDays: StudyDay[];
  finalReviewDay: StudyDay;
}

const StudyPlanGenerator: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { savePlan } = useStudyPlans();
  const [testDate, setTestDate] = useState<Date | undefined>(undefined);
  const [reviewRounds, setReviewRounds] = useState<string>('2');
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Constants for test counts
  const VERBAL_TESTS = 108;
  const QUANTITATIVE_TESTS = 102;
  const TOTAL_TESTS = VERBAL_TESTS + QUANTITATIVE_TESTS;

  // Arabic day names
  const arabicDays = [
    'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'
  ];

  const validateInputs = (): string[] => {
    const validationErrors: string[] = [];
    const rounds = parseInt(reviewRounds);

    if (!testDate) {
      validationErrors.push('يرجى تحديد تاريخ الاختبار');
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (testDate <= today) {
        validationErrors.push('تاريخ الاختبار يجب أن يكون في المستقبل');
      }

      const daysDifference = Math.ceil((testDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDifference < rounds + 1) {
        validationErrors.push(`تحتاج على الأقل ${rounds + 1} أيام للخطة المطلوبة`);
      }
    }

    if (isNaN(rounds) || rounds < 1 || rounds > 5) {
      validationErrors.push('عدد جولات المراجعة يجب أن يكون بين 1 و 5');
    }

    return validationErrors;
  };

  const distributeTests = (totalTests: number, days: number): number[] => {
    const baseTestsPerDay = Math.floor(totalTests / days);
    const remainder = totalTests % days;

    const distribution: number[] = new Array(days).fill(baseTestsPerDay);

    // Distribute remainder across different days
    for (let i = 0; i < remainder; i++) {
      distribution[i]++;
    }

    return distribution;
  };

  const generateStudyPlan = async (): Promise<void> => {
    const validationErrors = validateInputs();

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);
    setIsGenerating(true);

    // Add a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));

    const rounds = parseInt(reviewRounds);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalDays = Math.ceil((testDate!.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const studyDays = totalDays - 1; // Reserve last day for final review
    const daysPerRound = Math.floor(studyDays / rounds);
    const extraDays = studyDays % rounds;

    const studyDaysList: StudyDay[] = [];
    let currentDay = 1;

    // Generate study days for each round
    for (let round = 1; round <= rounds; round++) {
      const roundDays = daysPerRound + (round <= extraDays ? 1 : 0);

      // Distribute verbal tests
      const verbalDistribution = distributeTests(VERBAL_TESTS, roundDays);
      const quantitativeDistribution = distributeTests(QUANTITATIVE_TESTS, roundDays);

      // Track running totals for ranges (reset for each round)
      let verbalRunningTotal = 0;
      let quantitativeRunningTotal = 0;

      for (let dayInRound = 0; dayInRound < roundDays; dayInRound++) {
        const currentDate = new Date(today);
        currentDate.setDate(today.getDate() + currentDay - 1);

        const verbalCount = verbalDistribution[dayInRound];
        const quantitativeCount = quantitativeDistribution[dayInRound];

        // Calculate ranges
        const verbalStart = verbalRunningTotal + 1;
        const verbalEnd = verbalRunningTotal + verbalCount;
        const quantitativeStart = quantitativeRunningTotal + 1;
        const quantitativeEnd = quantitativeRunningTotal + quantitativeCount;

        studyDaysList.push({
          dayNumber: currentDay,
          date: currentDate,
          verbalTests: verbalCount,
          quantitativeTests: quantitativeCount,
          totalTests: verbalCount + quantitativeCount,
          verbalRange: { start: verbalStart, end: verbalEnd },
          quantitativeRange: { start: quantitativeStart, end: quantitativeEnd },
          isReviewDay: false,
          isFinalReview: false,
          roundNumber: round,
          completed: false
        });

        // Update running totals
        verbalRunningTotal += verbalCount;
        quantitativeRunningTotal += quantitativeCount;
        currentDay++;
      }
    }

    // Add final review day
    const finalReviewDay: StudyDay = {
      dayNumber: totalDays,
      date: testDate!,
      verbalTests: 0,
      quantitativeTests: 0,
      totalTests: 0,
      verbalRange: { start: 0, end: 0 },
      quantitativeRange: { start: 0, end: 0 },
      isReviewDay: true,
      isFinalReview: true,
      completed: false
    };

    const plan: StudyPlan = {
      totalDays,
      reviewRounds: rounds,
      studyDays: studyDaysList,
      finalReviewDay
    };

    setStudyPlan(plan);
    setIsGenerating(false);
  };



  const resetPlan = (): void => {
    setStudyPlan(null);
    setTestDate(undefined);
    setReviewRounds('2');
    setErrors([]);
    setIsGenerating(false);
  };

  const savePlanToProfile = async (): Promise<void> => {
    if (!studyPlan) return;

    // Check if user is authenticated
    if (!isLoggedIn) {
      toast.error('يجب تسجيل الدخول أولاً', {
        description: 'قم بتسجيل الدخول لحفظ الخطة في ملفك الشخصي',
        action: {
          label: 'تسجيل الدخول',
          onClick: () => navigate('/login')
        },
        duration: 5000,
      });
      return;
    }

    setIsSaving(true);

    try {
      const planName = `خطة ${format(studyPlan.finalReviewDay.date, 'dd/MM/yyyy')}`;

      const planData = {
        name: planName,
        total_days: studyPlan.totalDays,
        review_rounds: studyPlan.reviewRounds,
        test_date: studyPlan.finalReviewDay.date.toISOString().split('T')[0],
        study_days: studyPlan.studyDays,
        final_review_day: studyPlan.finalReviewDay
      };

      const savedPlan = await savePlan(planData);

      if (savedPlan) {
        toast.success('تم حفظ الخطة في ملفك الشخصي بنجاح! 🎉', {
          description: 'يمكنك الآن الوصول إليها من صفحة الملف الشخصي',
          duration: 4000,
        });
      }
    } catch (error) {
      console.error('Error saving plan:', error);
      toast.error('حدث خطأ أثناء حفظ الخطة', {
        description: 'يرجى المحاولة مرة أخرى',
      });
    } finally {
      setIsSaving(false);
    }
  };



  return (
    <div className="max-w-7xl mx-auto p-6 space-y-12" dir="rtl">
      {/* Modern Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center relative"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-3xl"></div>
        </div>

        <div className="inline-flex items-center gap-3 px-8 py-4 mb-8 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 backdrop-blur-sm">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center">
            <Target className="w-6 h-6 text-black" />
          </div>
          <span className="text-primary font-bold text-xl">مولد خطة الدراسة الذكي</span>
          <Sparkles className="w-5 h-5 text-accent" />
        </div>

        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
          خطط طريقك للنجاح
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          أنشئ خطة دراسية مخصصة ومنظمة بذكاء لتحضيرك المثالي لاختبار القدرات
        </p>

        {/* Feature highlights */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          {[
            { icon: Zap, text: "توزيع ذكي" },
            { icon: Target, text: "مخصص لك" },
            { icon: Star, text: "سهل الاستخدام" }
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-2 px-4 py-2 bg-background/50 rounded-full border border-primary/10">
              <item.icon className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">{item.text}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {!studyPlan ? (
        /* Modern Input Form */
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="bg-gradient-to-br from-card/90 to-card/60 border-0 rounded-3xl backdrop-blur-xl shadow-2xl shadow-primary/10">
            <CardHeader className="text-center pb-8 pt-12">
              <div className="w-20 h-20 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CalendarIcon className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-bold text-foreground mb-3">
                إعداد خطة الدراسة المخصصة
              </CardTitle>
              <p className="text-muted-foreground text-lg">
                أدخل تفاصيل اختبارك وسنقوم بإنشاء خطة مثالية لك
              </p>
            </CardHeader>

            <CardContent className="px-12 pb-12 space-y-8">
              {/* Error Messages */}
              {errors.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 bg-destructive/10 border border-destructive/20 rounded-2xl"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <AlertCircle className="w-6 h-6 text-destructive" />
                    <span className="font-bold text-destructive text-lg">تحتاج لتصحيح هذه النقاط:</span>
                  </div>
                  <ul className="space-y-2">
                    {errors.map((error, index) => (
                      <li key={index} className="flex items-center gap-2 text-destructive">
                        <div className="w-1.5 h-1.5 bg-destructive rounded-full"></div>
                        {error}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              <div className="grid md:grid-cols-2 gap-8">
                {/* Test Date Input with Shadcn Calendar */}
                <div className="space-y-4">
                  <Label className="text-xl font-bold text-foreground flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                      <CalendarIcon className="w-5 h-5 text-primary" />
                    </div>
                    تاريخ الاختبار
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-right font-normal h-14 text-lg bg-background/50 border-primary/20 rounded-xl hover:bg-background/80",
                          !testDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="ml-2 h-5 w-5 text-primary" />
                        {testDate ? (
                          format(testDate, "PPP", { locale: ar })
                        ) : (
                          <span>اختر تاريخ الاختبار</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={testDate}
                        onSelect={setTestDate}
                        disabled={(date) => date <= new Date()}
                        initialFocus
                        locale={ar}
                      />
                    </PopoverContent>
                  </Popover>
                  <p className="text-sm text-muted-foreground">
                    اختر التاريخ المحدد لاختبار القدرات
                  </p>
                </div>

                {/* Review Rounds Select */}
                <div className="space-y-4">
                  <Label className="text-xl font-bold text-foreground flex items-center gap-3">
                    <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                      <RotateCcw className="w-5 h-5 text-accent" />
                    </div>
                    عدد جولات المراجعة
                  </Label>
                  <Select value={reviewRounds} onValueChange={setReviewRounds}>
                    <SelectTrigger className="h-14 text-lg bg-background/50 border-primary/20 rounded-xl">
                      <SelectValue placeholder="اختر عدد الجولات" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">جولة واحدة</SelectItem>
                      <SelectItem value="2">جولتان (موصى به)</SelectItem>
                      <SelectItem value="3">3 جولات</SelectItem>
                      <SelectItem value="4">4 جولات</SelectItem>
                      <SelectItem value="5">5 جولات</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    كل جولة تشمل جميع الاختبارات (108 لفظي + 102 كمي)
                  </p>
                </div>
              </div>

              {/* Generate Button */}
              <div className="text-center pt-8">
                <Button
                  onClick={generateStudyPlan}
                  disabled={isGenerating}
                  size="lg"
                  className="w-full sm:w-auto px-6 sm:px-16 py-6 text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-black rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin ml-2"></div>
                      <span className="hidden sm:inline">جاري إنشاء الخطة...</span>
                      <span className="sm:hidden">جاري الإنشاء...</span>
                    </>
                  ) : (
                    <>
                      <Target className="w-5 h-5 sm:w-6 sm:h-6 ml-2" />
                      <span className="hidden sm:inline">إنشاء خطة الدراسة الذكية</span>
                      <span className="sm:hidden">إنشاء الخطة</span>
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        /* Modern Study Plan Display */
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Success Header */}
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-12 h-12 text-white" />
            </motion.div>
            <h2 className="text-4xl font-bold text-foreground mb-3">
              🎉 خطتك جاهزة للنجاح!
            </h2>
            <p className="text-xl text-muted-foreground">
              خطة دراسية ذكية ومنظمة خصيصاً لك
            </p>
          </div>

          {/* Plan Overview Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-2xl p-4 sm:p-6 text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-blue-500 mb-1 sm:mb-2">{studyPlan.totalDays}</div>
              <div className="text-sm sm:text-base text-muted-foreground font-medium">إجمالي الأيام</div>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-2xl p-4 sm:p-6 text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-purple-500 mb-1 sm:mb-2">{studyPlan.reviewRounds}</div>
              <div className="text-sm sm:text-base text-muted-foreground font-medium">جولات المراجعة</div>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-2xl p-4 sm:p-6 text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-green-500 mb-1 sm:mb-2">{TOTAL_TESTS}</div>
              <div className="text-sm sm:text-base text-muted-foreground font-medium">اختبار لكل جولة</div>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-2xl p-4 sm:p-6 text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
              </div>
              <div className="text-base sm:text-lg font-bold text-orange-500 mb-1 sm:mb-2">
                {format(studyPlan.finalReviewDay.date, "dd/MM", { locale: ar })}
              </div>
              <div className="text-sm sm:text-base text-muted-foreground font-medium">تاريخ الاختبار</div>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              onClick={savePlanToProfile}
              disabled={isSaving}
              size="lg"
              className={`flex items-center justify-center gap-3 w-full sm:w-auto px-6 sm:px-8 py-4 text-base sm:text-lg font-bold rounded-xl hover:scale-105 transition-transform duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                isLoggedIn
                  ? 'bg-gradient-to-r from-primary to-accent text-black'
                  : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white hover:from-primary hover:to-accent hover:text-black'
              }`}
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  <span className="hidden sm:inline">جاري الحفظ...</span>
                  <span className="sm:hidden">جاري الحفظ...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">{isLoggedIn ? 'حفظ في الملف الشخصي' : 'تسجيل الدخول للحفظ'}</span>
                  <span className="sm:hidden">{isLoggedIn ? 'حفظ الخطة' : 'تسجيل الدخول'}</span>
                </>
              )}
            </Button>

            <Button
              onClick={resetPlan}
              variant="outline"
              size="lg"
              className="flex items-center justify-center gap-3 w-full sm:w-auto px-6 sm:px-8 py-4 text-base sm:text-lg font-medium bg-background/50 border-primary/20 rounded-xl hover:bg-background/80"
            >
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">خطة جديدة</span>
              <span className="sm:hidden">جديدة</span>
            </Button>
          </div>

          {/* Study Days by Round - Modern Design */}
          {Array.from({ length: studyPlan.reviewRounds }, (_, roundIndex) => {
            const roundNumber = roundIndex + 1;
            const roundDays = studyPlan.studyDays.filter(day => day.roundNumber === roundNumber);

            return (
              <motion.div
                key={roundNumber}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: roundIndex * 0.1 }}
              >
                <Card className="bg-gradient-to-br from-card/90 to-card/60 border-0 rounded-3xl backdrop-blur-xl shadow-xl">
                  <CardHeader className="pb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
                          <span className="text-2xl font-bold text-black">{roundNumber}</span>
                        </div>
                        <div>
                          <CardTitle className="text-2xl font-bold text-foreground">
                            الجولة {roundNumber}
                          </CardTitle>
                          <p className="text-muted-foreground">
                            {roundDays.length} أيام دراسية
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-primary/20 text-primary px-4 py-2 text-lg font-bold">
                        {TOTAL_TESTS} اختبار
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {roundDays.map((day, dayIndex) => (
                      <motion.div
                        key={day.dayNumber}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: dayIndex * 0.05 }}
                        className="group p-4 sm:p-6 bg-gradient-to-r from-background/50 to-background/30 rounded-2xl border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
                      >
                        {/* Mobile Layout */}
                        <div className="block sm:hidden space-y-4">
                          {/* Day Header */}
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
                              <span className="text-lg font-bold text-primary">{day.dayNumber}</span>
                            </div>
                            <div className="flex-1">
                              <div className="text-base font-bold text-foreground mb-1">
                                {format(day.date, "dd/MM/yyyy", { locale: ar })}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {arabicDays[day.date.getDay()]}
                              </div>
                            </div>
                          </div>

                          {/* Tests Grid */}
                          <div className="grid grid-cols-3 gap-3">
                            <div className="text-center p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                              <div className="flex items-center justify-center gap-1 mb-2">
                                <BookOpen className="w-4 h-4 text-blue-500" />
                                <span className="text-xs text-muted-foreground">لفظي</span>
                              </div>
                              <div className="text-lg font-bold text-blue-500 mb-1">
                                {day.verbalRange.start}-{day.verbalRange.end}
                              </div>
                              <div className="text-xs text-muted-foreground">({day.verbalTests})</div>
                            </div>

                            <div className="text-center p-3 bg-green-500/10 rounded-xl border border-green-500/20">
                              <div className="flex items-center justify-center gap-1 mb-2">
                                <Calculator className="w-4 h-4 text-green-500" />
                                <span className="text-xs text-muted-foreground">كمي</span>
                              </div>
                              <div className="text-lg font-bold text-green-500 mb-1">
                                {day.quantitativeRange.start}-{day.quantitativeRange.end}
                              </div>
                              <div className="text-xs text-muted-foreground">({day.quantitativeTests})</div>
                            </div>

                            <div className="text-center p-3 bg-primary/10 rounded-xl border border-primary/20">
                              <div className="flex items-center justify-center gap-1 mb-2">
                                <TrendingUp className="w-4 h-4 text-primary" />
                                <span className="text-xs text-muted-foreground">المجموع</span>
                              </div>
                              <div className="text-lg font-bold text-primary mb-1">{day.totalTests}</div>
                              <div className="text-xs text-muted-foreground">اختبار</div>
                            </div>
                          </div>
                        </div>

                        {/* Desktop Layout */}
                        <div className="hidden sm:flex items-center justify-between">
                          <div className="flex items-center gap-6">
                            <div className="w-14 h-14 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                              <span className="text-xl font-bold text-primary">{day.dayNumber}</span>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-foreground mb-1">
                                {format(day.date, "EEEE، dd MMMM yyyy", { locale: ar })}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {arabicDays[day.date.getDay()]}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-6 lg:gap-8">
                            <div className="text-center">
                              <div className="flex items-center gap-2 mb-1">
                                <BookOpen className="w-5 h-5 text-blue-500" />
                                <span className="text-sm text-muted-foreground">لفظي</span>
                              </div>
                              <div className="text-xl lg:text-2xl font-bold text-blue-500">
                                {day.verbalRange.start}-{day.verbalRange.end}
                              </div>
                              <div className="text-xs text-muted-foreground">({day.verbalTests} اختبار)</div>
                            </div>

                            <div className="text-center">
                              <div className="flex items-center gap-2 mb-1">
                                <Calculator className="w-5 h-5 text-green-500" />
                                <span className="text-sm text-muted-foreground">كمي</span>
                              </div>
                              <div className="text-xl lg:text-2xl font-bold text-green-500">
                                {day.quantitativeRange.start}-{day.quantitativeRange.end}
                              </div>
                              <div className="text-xs text-muted-foreground">({day.quantitativeTests} اختبار)</div>
                            </div>

                            <div className="text-center">
                              <div className="flex items-center gap-2 mb-1">
                                <TrendingUp className="w-5 h-5 text-primary" />
                                <span className="text-sm text-muted-foreground">المجموع</span>
                              </div>
                              <div className="text-xl lg:text-2xl font-bold text-primary">{day.totalTests}</div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}

          {/* Final Review Day - Special Design */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-3xl overflow-hidden relative">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-orange-500/5"></div>
              <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-full blur-2xl"></div>

              <CardHeader className="relative z-10 pb-6">
                <div className="flex items-center gap-3 sm:gap-4 mb-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
                      🎯 اليوم النهائي
                    </CardTitle>
                    <p className="text-amber-600 font-medium text-base sm:text-lg">
                      يوم الاختبار - مراجعة فقط
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="relative z-10">
                <div className="p-4 sm:p-8 bg-gradient-to-r from-background/60 to-background/40 rounded-2xl border border-amber-500/20 backdrop-blur-sm">
                  {/* Mobile Layout */}
                  <div className="block sm:hidden space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center">
                        <span className="text-2xl font-bold text-amber-600">{studyPlan.finalReviewDay.dayNumber}</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-lg font-bold text-foreground mb-1">
                          {format(studyPlan.finalReviewDay.date, "dd/MM/yyyy", { locale: ar })}
                        </div>
                        <div className="text-amber-600 font-medium text-sm">
                          مراجعة الأخطاء والنقاط المهمة فقط
                        </div>
                      </div>
                    </div>

                    <div className="text-center p-4 bg-amber-500/10 rounded-xl">
                      <div className="text-4xl mb-2">🏆</div>
                      <div className="text-base font-bold text-amber-600">يوم النجاح</div>
                      <div className="text-sm text-muted-foreground">لا اختبارات جديدة</div>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden sm:flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center">
                        <span className="text-3xl font-bold text-amber-600">{studyPlan.finalReviewDay.dayNumber}</span>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-foreground mb-2">
                          {format(studyPlan.finalReviewDay.date, "EEEE، dd MMMM yyyy", { locale: ar })}
                        </div>
                        <div className="text-amber-600 font-medium text-lg">
                          مراجعة الأخطاء والنقاط المهمة فقط
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-6xl mb-2">🏆</div>
                      <div className="text-lg font-bold text-amber-600">يوم النجاح</div>
                      <div className="text-sm text-muted-foreground">لا اختبارات جديدة</div>
                    </div>
                  </div>

                  {/* Success Tips */}
                  <div className="mt-6 p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
                    <h4 className="font-bold text-amber-700 mb-2">💡 نصائح لليوم النهائي:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• راجع الأخطاء التي وقعت فيها في الجولات السابقة</li>
                      <li>• تأكد من النوم الكافي والاستيقاظ مبكراً</li>
                      <li>• تناول إفطار صحي ومتوازن</li>
                      <li>• وصل مبكراً لمكان الاختبار</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default StudyPlanGenerator;
