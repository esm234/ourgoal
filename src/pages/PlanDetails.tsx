import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  BookOpen,
  Calculator,
  TrendingUp,
  Trophy,
  Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useStudyPlans } from '@/hooks/useStudyPlans';
import { useCompletedDays } from '@/hooks/useCompletedDays';
import { useAuth } from '@/contexts/AuthContext';
import CompletionCertificate from '@/components/CompletionCertificate';
import { supabase } from '@/integrations/supabase/client';



const PlanDetails: React.FC = () => {
  const navigate = useNavigate();
  const { planId } = useParams();
  const { user } = useAuth();
  const { getPlan } = useStudyPlans();
  const {
    completedDays,
    loading: completedLoading,
    toggleDayCompletion,
    canCompleteMoreToday,
    getRemainingCompletionsToday,
    DAILY_COMPLETION_LIMIT
  } = useCompletedDays();

  const [plan, setPlan] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState<string>('');
  const [showCertificate, setShowCertificate] = useState(false);
  const [wasJustCompleted, setWasJustCompleted] = useState(false);

  useEffect(() => {
    loadPlanDetails();
    loadUserData();
  }, [planId]);

  // فحص الإتمام عند تغيير الأيام المكتملة
  useEffect(() => {
    checkPlanCompletion();
  }, [completedDays, plan]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else if (profile?.username) {
        setUserName(profile.username);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const checkPlanCompletion = () => {
    if (!plan || completedLoading) return;

    const totalDays = plan.study_days.length + 1; // +1 for final review day
    const isNowCompleted = completedDays.size === totalDays;

    // إذا تم إكمال الخطة للتو (لم تكن مكتملة من قبل)
    if (isNowCompleted && !wasJustCompleted) {
      // إضافة إشعار محلي عند إكمال الخطة
      import('@/services/localNotifications').then(module => {
        const { localNotificationService } = module;
        localNotificationService.addPlanCompletedNotification({
          planId: planId || '',
          planTitle: plan.name
        });
      });
      
      setWasJustCompleted(true);
      setShowCertificate(true);
    }
  };

  const loadPlanDetails = async () => {
    if (!planId) {
      navigate('/profile');
      return;
    }

    try {
      setIsLoading(true);

      // Get plan from user's profile
      const planData = await getPlan();

      if (planData) {
        setPlan(planData);
      } else {
        toast.error('لم يتم العثور على الخطة');
        navigate('/profile');
      }
    } catch (error) {
      console.error('Error loading plan details:', error);
      toast.error('حدث خطأ في تحميل تفاصيل الخطة');
      navigate('/profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleDay = async (dayNumber: number) => {
    const isCompleted = completedDays.has(dayNumber);

    // If trying to complete a day and reached daily limit, show warning
    if (!isCompleted && !canCompleteMoreToday()) {
      toast.error(`لقد وصلت للحد الأقصى اليومي! يمكنك إكمال ${DAILY_COMPLETION_LIMIT} أيام فقط في اليوم الواحد.`);
      return;
    }

    await toggleDayCompletion(dayNumber);
  };

  const getProgressPercentage = () => {
    if (!plan) return 0;
    const totalDays = plan.study_days.length + 1; // +1 for final review day
    return Math.round((completedDays.size / totalDays) * 100);
  };

  const getCompletedDaysInRound = (roundNumber: number) => {
    if (!plan) return 0;
    const roundDays = plan.study_days.filter((day: any) => day.roundNumber === roundNumber);
    return roundDays.filter((day: any) => completedDays.has(day.dayNumber)).length;
  };



  if (isLoading) {
    return (
      <Layout>
        <section className="min-h-screen py-16 px-4 bg-gradient-to-br from-background via-secondary/30 to-background relative overflow-hidden flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">جاري تحميل تفاصيل الخطة...</p>
          </div>
        </section>
      </Layout>
    );
  }

  if (!plan) {
    return (
      <Layout>
        <section className="min-h-screen py-16 px-4 bg-gradient-to-br from-background via-secondary/30 to-background relative overflow-hidden flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">لم يتم العثور على الخطة</h2>
            <Button onClick={() => navigate('/profile')} className="bg-gradient-to-r from-primary to-accent text-black">
              العودة للملف الشخصي
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  const progressPercentage = getProgressPercentage();

  return (
    <Layout>
      <section className="min-h-screen py-16 px-4 bg-gradient-to-br from-background via-secondary/30 to-background relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.03] [mask-image:radial-gradient(ellipse_at_center,white_20%,transparent_75%)]"></div>

        <div className="container mx-auto max-w-6xl relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="flex items-center justify-start mb-6">
              <Button
                onClick={() => navigate('/profile')}
                variant="outline"
                className="bg-background/50 border-primary/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                العودة للملف الشخصي
              </Button>
            </div>

            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                {plan.name}
              </h1>
              <p className="text-xl text-muted-foreground mb-6">
                تفاصيل خطة الدراسة وتتبع التقدم
              </p>
            </div>
          </motion.div>

          {/* Progress Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-br from-card/90 to-card/60 border-0 rounded-3xl backdrop-blur-xl shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  <Trophy className="w-6 h-6 text-primary" />
                  تقدمك في الخطة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium">نسبة الإنجاز</span>
                    <span className="text-2xl font-bold text-primary">{progressPercentage}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-3" />
                  <p className="text-sm text-muted-foreground">
                    {completedDays.size} من {plan.study_days.length + 1} أيام مكتملة
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-background/50 rounded-xl">
                    <div className="text-2xl font-bold text-blue-500">{plan.total_days}</div>
                    <div className="text-sm text-muted-foreground">إجمالي الأيام</div>
                  </div>
                  <div className="text-center p-4 bg-background/50 rounded-xl">
                    <div className="text-2xl font-bold text-green-500">{completedDays.size}</div>
                    <div className="text-sm text-muted-foreground">أيام مكتملة</div>
                  </div>
                  <div className="text-center p-4 bg-background/50 rounded-xl">
                    <div className="text-2xl font-bold text-purple-500">{plan.review_rounds}</div>
                    <div className="text-sm text-muted-foreground">جولات المراجعة</div>
                  </div>
                  <div className="text-center p-4 bg-background/50 rounded-xl">
                    <div className="text-2xl font-bold text-orange-500">
                      {format(new Date(plan.test_date), 'dd/MM', { locale: ar })}
                    </div>
                    <div className="text-sm text-muted-foreground">تاريخ الاختبار</div>
                  </div>
                </div>

                {/* Daily Completion Limit Info */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-blue-800">الحد اليومي للإكمال</div>
                        <div className="text-sm text-blue-600">
                          يمكنك إكمال {DAILY_COMPLETION_LIMIT} أيام كحد أقصى في اليوم الواحد
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{getRemainingCompletionsToday()}</div>
                      <div className="text-xs text-blue-500">متبقي اليوم</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Study Days by Round */}
          <div className="space-y-8">
            {Array.from({ length: plan.review_rounds }, (_, roundIndex) => {
              const roundNumber = roundIndex + 1;
              const roundDays = plan.study_days.filter((day: any) => day.roundNumber === roundNumber);
              const completedInRound = getCompletedDaysInRound(roundNumber);
              const roundProgress = Math.round((completedInRound / roundDays.length) * 100);

              return (
                <motion.div
                  key={roundNumber}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: roundIndex * 0.1 }}
                >
                  <Card className="bg-gradient-to-br from-card/90 to-card/60 border-0 rounded-3xl backdrop-blur-xl shadow-xl">
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                            <span className="text-lg sm:text-2xl font-bold text-black">{roundNumber}</span>
                          </div>
                          <div>
                            <CardTitle className="text-lg sm:text-2xl font-bold text-foreground">
                              الجولة {roundNumber}
                            </CardTitle>
                            <p className="text-sm sm:text-base text-muted-foreground">
                              {completedInRound} من {roundDays.length} أيام مكتملة
                            </p>
                          </div>
                        </div>
                        <div className="text-center sm:text-right">
                          <div className="text-2xl sm:text-3xl font-bold text-primary">{roundProgress}%</div>
                          <div className="text-sm text-muted-foreground">مكتمل</div>
                        </div>
                      </div>
                      <Progress value={roundProgress} className="h-2 mt-4" />
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {roundDays.map((day: any, dayIndex: number) => {
                        const isCompleted = completedDays.has(day.dayNumber);
                        const canComplete = isCompleted || canCompleteMoreToday();

                        return (
                          <motion.div
                            key={day.dayNumber}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: dayIndex * 0.05 }}
                            className={`group p-6 rounded-2xl border transition-all duration-300 ${
                              canComplete ? 'cursor-pointer' : 'cursor-not-allowed'
                            } ${
                              isCompleted
                                ? 'bg-green-500/10 border-green-500/30 shadow-lg'
                                : canComplete
                                ? 'bg-background/50 border-primary/10 hover:border-primary/30'
                                : 'bg-orange-50/80 border-orange-200/60 relative'
                            }`}
                            onClick={() => canComplete && handleToggleDay(day.dayNumber)}
                            title={!canComplete ? `وصلت للحد الأقصى اليومي (${DAILY_COMPLETION_LIMIT} أيام)` : ''}
                          >
                            {/* Daily limit overlay for disabled days */}
                            {!canComplete && (
                              <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                🔒 محدود
                              </div>
                            )}
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                              <div className="flex items-center gap-4 sm:gap-6">
                                <Checkbox
                                  checked={isCompleted}
                                  onChange={() => canComplete && handleToggleDay(day.dayNumber)}
                                  disabled={!canComplete}
                                  className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"
                                />
                                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                                  isCompleted
                                    ? 'bg-green-500/20 scale-110'
                                    : canComplete
                                    ? 'bg-gradient-to-r from-primary/20 to-accent/20 group-hover:scale-110'
                                    : 'bg-orange-200/60'
                                }`}>
                                  <span className={`text-lg sm:text-xl font-bold ${
                                    isCompleted
                                      ? 'text-green-500'
                                      : canComplete
                                      ? 'text-primary'
                                      : 'text-orange-600'
                                  }`}>
                                    {day.dayNumber}
                                  </span>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className={`text-sm sm:text-lg font-bold mb-1 break-words ${
                                    canComplete ? 'text-foreground' : 'text-orange-700'
                                  }`}>
                                    {format(new Date(day.date), "EEEE، dd MMMM yyyy", { locale: ar })}
                                  </div>
                                  {isCompleted && (
                                    <Badge className="bg-green-500/20 text-green-500 border-green-500/30 text-xs">
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                      مكتمل
                                    </Badge>
                                  )}
                                  {!canComplete && !isCompleted && (
                                    <Badge className="bg-orange-500/20 text-orange-700 border-orange-500/30 text-xs">
                                      🔒 وصلت للحد الأقصى اليومي
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:flex lg:items-center lg:gap-6 xl:gap-8">
                                <div className="text-center">
                                  <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1">
                                    <BookOpen className={`w-4 h-4 sm:w-5 sm:h-5 ${canComplete ? 'text-blue-500' : 'text-orange-600'}`} />
                                    <span className={`text-xs sm:text-sm ${canComplete ? 'text-muted-foreground' : 'text-orange-600'}`}>لفظي</span>
                                  </div>
                                  <div className={`text-lg sm:text-2xl font-bold ${canComplete ? 'text-blue-500' : 'text-orange-700'}`}>
                                    {day.verbalRange?.start}-{day.verbalRange?.end}
                                  </div>
                                  <div className={`text-xs ${canComplete ? 'text-muted-foreground' : 'text-orange-600'}`}>({day.verbalTests} اختبار)</div>
                                </div>

                                <div className="text-center">
                                  <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1">
                                    <Calculator className={`w-4 h-4 sm:w-5 sm:h-5 ${canComplete ? 'text-green-500' : 'text-orange-600'}`} />
                                    <span className={`text-xs sm:text-sm ${canComplete ? 'text-muted-foreground' : 'text-orange-600'}`}>كمي</span>
                                  </div>
                                  <div className={`text-lg sm:text-2xl font-bold ${canComplete ? 'text-green-500' : 'text-orange-700'}`}>
                                    {day.quantitativeRange?.start}-{day.quantitativeRange?.end}
                                  </div>
                                  <div className={`text-xs ${canComplete ? 'text-muted-foreground' : 'text-orange-600'}`}>({day.quantitativeTests} اختبار)</div>
                                </div>

                                <div className="text-center">
                                  <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1">
                                    <TrendingUp className={`w-4 h-4 sm:w-5 sm:h-5 ${canComplete ? 'text-primary' : 'text-orange-600'}`} />
                                    <span className={`text-xs sm:text-sm ${canComplete ? 'text-muted-foreground' : 'text-orange-600'}`}>المجموع</span>
                                  </div>
                                  <div className={`text-lg sm:text-2xl font-bold ${canComplete ? 'text-primary' : 'text-orange-700'}`}>{day.totalTests}</div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}

            {/* Final Review Day */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-3xl overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-orange-500/5"></div>

                <CardHeader className="relative z-10">
                  <CardTitle className="text-2xl font-bold flex items-center gap-3">
                    <Clock className="w-6 h-6 text-amber-600" />
                    🎯 اليوم النهائي - مراجعة فقط
                  </CardTitle>
                </CardHeader>

                <CardContent className="relative z-10">
                  {(() => {
                    const isCompleted = completedDays.has(plan.final_review_day.dayNumber);
                    const canComplete = isCompleted || canCompleteMoreToday();

                    return (
                      <div
                        className={`p-8 rounded-2xl border transition-all duration-300 relative ${
                          canComplete ? 'cursor-pointer' : 'cursor-not-allowed'
                        } ${
                          isCompleted
                            ? 'bg-amber-500/20 border-amber-500/40 shadow-lg'
                            : canComplete
                            ? 'bg-background/60 border-amber-500/20 hover:border-amber-500/40'
                            : 'bg-orange-50/80 border-orange-200/60'
                        }`}
                        onClick={() => canComplete && handleToggleDay(plan.final_review_day.dayNumber)}
                        title={!canComplete ? `وصلت للحد الأقصى اليومي (${DAILY_COMPLETION_LIMIT} أيام)` : ''}
                      >
                        {/* Daily limit overlay for disabled final review day */}
                        {!canComplete && (
                          <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            🔒 محدود
                          </div>
                        )}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                      <div className="flex items-center gap-4 sm:gap-6">
                        <Checkbox
                          checked={isCompleted}
                          onChange={() => canComplete && handleToggleDay(plan.final_review_day.dayNumber)}
                          disabled={!canComplete}
                          className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"
                        />
                        <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                          isCompleted
                            ? 'bg-amber-500/30 scale-110'
                            : canComplete
                            ? 'bg-amber-500/20'
                            : 'bg-orange-200/60'
                        }`}>
                          <span className={`text-2xl sm:text-3xl font-bold ${
                            isCompleted
                              ? 'text-amber-600'
                              : canComplete
                              ? 'text-amber-600'
                              : 'text-orange-600'
                          }`}>{plan.final_review_day.dayNumber}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className={`text-lg sm:text-2xl font-bold mb-2 break-words ${
                            canComplete ? 'text-foreground' : 'text-orange-700'
                          }`}>
                            {format(new Date(plan.final_review_day.date), "EEEE، dd MMMM yyyy", { locale: ar })}
                          </div>
                          <div className={`font-medium text-sm sm:text-lg ${
                            canComplete ? 'text-amber-600' : 'text-orange-600'
                          }`}>
                            مراجعة الأخطاء والنقاط المهمة فقط
                          </div>
                          {isCompleted && (
                            <Badge className="bg-amber-500/20 text-amber-600 border-amber-500/30 mt-2 text-xs">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              مكتمل - أحسنت!
                            </Badge>
                          )}
                          {!canComplete && !isCompleted && (
                            <Badge className="bg-orange-500/20 text-orange-700 border-orange-500/30 mt-2 text-xs">
                              🔒 وصلت للحد الأقصى اليومي
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="text-center lg:text-right">
                        <div className="text-4xl sm:text-6xl mb-2">🏆</div>
                        <div className="text-base sm:text-lg font-bold text-amber-600">يوم النجاح</div>
                      </div>
                    </div>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* شهادة الإتمام */}
        <CompletionCertificate
          isOpen={showCertificate}
          onClose={() => setShowCertificate(false)}
          userName={userName || 'الطالب'}
          planName={plan?.name || 'خطة الدراسة'}
          completionDate={new Date()}
          totalDays={plan ? plan.study_days.length + 1 : 0}
        />
      </section>
    </Layout>
  );
};

export default PlanDetails;
