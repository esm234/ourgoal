import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  User,
  Calendar,
  CheckCircle,
  Plus,
  Trash2,
  Target,
  BookOpen,
  Calculator,
  Clock,
  Star,
  TrendingUp,
  Eye,
  ArrowRight,
  Trophy
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useStudyPlans } from '@/hooks/useStudyPlans';
import { useUserStats } from '@/hooks/useUserStats';
import { useDailyTasks } from '@/hooks/useDailyTasks';
import { useDashboardData } from '@/hooks/useDashboardData';
import XPLeaderboard from '@/components/XPLeaderboard';
import SingleStudyPlanManager from '@/components/SingleStudyPlanManager';
import { useUserEventHistory } from '@/hooks/useWeeklyEvents';
import { formatTimeRemaining, getCategoryLabel } from '@/types/weeklyEvents';

const Profile: React.FC = () => {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // Use custom hooks
  const { plans: savedPlans, loading: plansLoading, deletePlan, updatePlan } = useStudyPlans();
  const { stats, loading: statsLoading, getFormattedStats } = useUserStats();
  const {
    tasks: dailyTasks,
    loading: tasksLoading,
    addTask,
    toggleTask,
    deleteTask
  } = useDailyTasks();

  // Event history hook
  const { history: eventHistory, totalXpEarned, loading: historyLoading } = useUserEventHistory();

  const [newTaskText, setNewTaskText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'verbal' | 'quantitative' | 'general'>('general');
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Get formatted stats
  const userStats = getFormattedStats();

  const today = new Date().toISOString().split('T')[0];

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
  }, [isLoggedIn, navigate]);

  // Load data on component mount
  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      // Fetch user profile from Supabase
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        // If no profile exists, redirect to welcome page
        if (error.code === 'PGRST116') {
          navigate('/welcome');
          return;
        }
      } else {
        // If profile exists but no username, redirect to welcome
        if (!profile?.username || !profile.username.trim()) {
          navigate('/welcome');
          return;
        }
        setUserName(profile.username);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('حدث خطأ في تحميل البيانات');
    } finally {
      setIsLoading(false);
    }
  };



  const addDailyTask = async () => {
    if (!newTaskText.trim()) return;

    const success = await addTask(newTaskText, selectedCategory, today);
    if (success) {
      setNewTaskText('');
    }
  };

  const handleToggleTask = async (taskId: string) => {
    await toggleTask(taskId);
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId);
  };

  const handleDeletePlan = async () => {
    await deletePlan();
  };

  const handleUpdatePlan = async (updatedPlan: any) => {
    return await updatePlan(updatedPlan);
  };

  const getTodayTasks = () => {
    return dailyTasks.filter(task => task.task_date === today);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'verbal': return <BookOpen className="w-4 h-4" />;
      case 'quantitative': return <Calculator className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'verbal': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'quantitative': return 'text-green-500 bg-green-500/10 border-green-500/20';
      default: return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
    }
  };

  const viewPlanDetails = (plan: any) => {
    // Since we're storing plan in profile, we don't have an ID
    // We'll navigate to a special route for the user's plan
    navigate('/plan-details/current');
  };

  if (isLoading || plansLoading || statsLoading || tasksLoading) {
    return (
      <Layout>
        <section className="min-h-screen py-16 px-4 bg-gradient-to-br from-background via-secondary/30 to-background relative overflow-hidden flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">جاري تحميل ملفك الشخصي...</p>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="min-h-screen py-16 px-4 bg-gradient-to-br from-background via-secondary/30 to-background relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.03] [mask-image:radial-gradient(ellipse_at_center,white_20%,transparent_75%)]"></div>

        <div className="container mx-auto max-w-7xl relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="w-24 h-24 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <User className="w-12 h-12 text-black" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              مرحباً، {userName || 'الطالب'}
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              مرحباً بك في ملفك الشخصي
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
          >
            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-blue-500" />
              </div>
              <div className="text-3xl font-bold text-blue-500 mb-2">{userStats.totalPlansCreated}</div>
              <div className="text-muted-foreground font-medium">خطة دراسية</div>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-6 h-6 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-green-500 mb-2">{eventHistory.length}</div>
              <div className="text-muted-foreground font-medium">فعاليات مكتملة</div>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-orange-500" />
              </div>
              <div className="text-3xl font-bold text-orange-500 mb-2">{totalXpEarned}</div>
              <div className="text-muted-foreground font-medium">نقاط خبرة</div>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-purple-500" />
              </div>
              <div className="text-3xl font-bold text-purple-500 mb-2">{userStats.totalStudyDays}</div>
              <div className="text-muted-foreground font-medium">يوم دراسة</div>
            </Card>
          </motion.div>

          {/* Main Content Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Tabs defaultValue="history" dir="rtl" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="grid grid-cols-3 w-full max-w-2xl bg-transparent p-2">
                  <TabsTrigger
                    value="history"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-black font-bold py-3 px-4 rounded-xl transition-all duration-300 data-[state=inactive]:text-muted-foreground hover:text-foreground"
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    سجل الأنشطة
                  </TabsTrigger>
                  <TabsTrigger
                    value="plans"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-black font-bold py-3 px-4 rounded-xl transition-all duration-300 data-[state=inactive]:text-muted-foreground hover:text-foreground"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    خطط الدراسة
                  </TabsTrigger>
                  <TabsTrigger
                    value="leaderboard"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-black font-bold py-3 px-4 rounded-xl transition-all duration-300 data-[state=inactive]:text-muted-foreground hover:text-foreground"
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    المتصدرون
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Activity History Tab */}
              <TabsContent value="history" className="mt-0">
                <div className="space-y-6">
                  {/* XP Summary Card */}
                  <Card className="bg-gradient-to-br from-card/90 to-card/60 border-0 rounded-3xl backdrop-blur-xl shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold flex items-center gap-3">
                        <Trophy className="w-6 h-6 text-primary" />
                        ملخص نقاط الخبرة من الفعاليات
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl">
                          <div className="text-2xl font-bold text-primary">{eventHistory.length}</div>
                          <div className="text-sm text-muted-foreground">فعاليات مكتملة</div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl">
                          <div className="text-2xl font-bold text-green-600">{totalXpEarned}</div>
                          <div className="text-sm text-muted-foreground">نقاط خبرة مكتسبة</div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl">
                          <div className="text-2xl font-bold text-blue-600">
                            {eventHistory.length > 0 ? Math.round(eventHistory.reduce((sum, event) => sum + event.percentage, 0) / eventHistory.length) : 0}%
                          </div>
                          <div className="text-sm text-muted-foreground">متوسط النتائج</div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl">
                          <div className="text-2xl font-bold text-purple-600">
                            {eventHistory.filter(event => event.rank_position <= 3).length}
                          </div>
                          <div className="text-sm text-muted-foreground">مراكز متقدمة</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Event History List */}
                  <Card className="bg-gradient-to-br from-card/90 to-card/60 border-0 rounded-3xl backdrop-blur-xl shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold flex items-center gap-3">
                        <Calendar className="w-6 h-6 text-primary" />
                        سجل الفعاليات المشاركة
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {historyLoading ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                          <p className="text-muted-foreground">جاري تحميل السجل...</p>
                        </div>
                      ) : eventHistory.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                          <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <p className="text-lg font-medium mb-2">لم تشارك في أي فعالية بعد</p>
                          <p className="text-sm">شارك في الفعاليات الأسبوعية لتظهر هنا</p>
                        </div>
                      ) : (
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                          {eventHistory.map((event, index) => (
                            <div
                              key={`${event.event_id}-${index}`}
                              className="p-4 rounded-xl border bg-background/50 border-primary/20 hover:border-primary/40 transition-all duration-300"
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg">
                                    {event.event_category === 'verbal' ? (
                                      <BookOpen className="w-5 h-5 text-primary" />
                                    ) : event.event_category === 'quantitative' ? (
                                      <Calculator className="w-5 h-5 text-primary" />
                                    ) : (
                                      <Target className="w-5 h-5 text-primary" />
                                    )}
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-lg">{event.event_title}</h4>
                                    <p className="text-sm text-muted-foreground">
                                      {getCategoryLabel(event.event_category)} • {format(new Date(event.completed_at), 'dd MMMM yyyy', { locale: ar })}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-left">
                                  <Badge className={`${
                                    event.rank_position === 1 ? 'bg-yellow-500' :
                                    event.rank_position === 2 ? 'bg-gray-400' :
                                    event.rank_position === 3 ? 'bg-amber-600' :
                                    'bg-primary'
                                  } text-white`}>
                                    المركز #{event.rank_position}
                                  </Badge>
                                </div>
                              </div>

                              <div className="grid grid-cols-3 gap-4 text-sm">
                                <div className="text-center p-3 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-lg">
                                  <div className="font-bold text-green-600">{event.score}/{event.total_questions}</div>
                                  <div className="text-muted-foreground">النتيجة</div>
                                </div>
                                <div className="text-center p-3 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-lg">
                                  <div className="font-bold text-blue-600">{event.percentage}%</div>
                                  <div className="text-muted-foreground">النسبة المئوية</div>
                                </div>
                                <div className="text-center p-3 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-lg">
                                  <div className="font-bold text-purple-600">+{event.xp_earned}</div>
                                  <div className="text-muted-foreground">نقاط خبرة</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Study Plans Tab */}
              <TabsContent value="plans" className="mt-0">
                <div className="space-y-6">
                  <SingleStudyPlanManager
                    studyPlan={savedPlans.length > 0 ? savedPlans[0] : null}
                    onDelete={handleDeletePlan}
                    onUpdate={handleUpdatePlan}
                    onViewDetails={viewPlanDetails}
                  />

                  {/* Quick Action Button */}
                  <div className="text-center">
                    <Button
                      onClick={() => navigate('/study-plan')}
                      className="bg-gradient-to-r from-primary to-accent text-black font-bold px-8 py-3 rounded-xl"
                    >
                      <Target className="w-5 h-5 mr-2" />
                      {savedPlans.length > 0 ? 'إنشاء خطة جديدة' : 'إنشاء أول خطة'}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* XP Leaderboard Tab */}
              <TabsContent value="leaderboard" className="mt-0">
                <XPLeaderboard />
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Profile;
