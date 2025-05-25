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

const Profile: React.FC = () => {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // Use custom hooks
  const { plans: savedPlans, loading: plansLoading, deletePlan } = useStudyPlans();
  const { stats, loading: statsLoading, getFormattedStats } = useUserStats();
  const {
    tasks: dailyTasks,
    loading: tasksLoading,
    addTask,
    toggleTask,
    deleteTask
  } = useDailyTasks();

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

  const handleDeletePlan = async (planId: string) => {
    await deletePlan(planId);
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
    navigate(`/plan-details/${plan.id}`);
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
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-green-500 mb-2">{userStats.completedTasks}</div>
              <div className="text-muted-foreground font-medium">مهمة مكتملة</div>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-orange-500" />
              </div>
              <div className="text-3xl font-bold text-orange-500 mb-2">{userStats.currentStreak}</div>
              <div className="text-muted-foreground font-medium">أيام متتالية</div>
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
            <Tabs defaultValue="tasks" dir="rtl" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="grid grid-cols-3 w-full max-w-2xl bg-transparent p-2">
                  <TabsTrigger
                    value="tasks"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-black font-bold py-3 px-4 rounded-xl transition-all duration-300 data-[state=inactive]:text-muted-foreground hover:text-foreground"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    المهام اليومية
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

              {/* Daily Tasks Tab */}
              <TabsContent value="tasks" className="mt-0">
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Add New Task */}
                  <Card className="bg-gradient-to-br from-card/90 to-card/60 border-0 rounded-3xl backdrop-blur-xl shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold flex items-center gap-3">
                        <Plus className="w-6 h-6 text-primary" />
                        إضافة مهمة جديدة
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <Input
                          value={newTaskText}
                          onChange={(e) => setNewTaskText(e.target.value)}
                          placeholder="اكتب مهمتك هنا..."
                          className="text-lg p-4 bg-background/50 border-primary/20 rounded-xl"
                          onKeyPress={(e) => e.key === 'Enter' && addDailyTask()}
                        />

                        <div className="flex gap-2">
                          {[
                            { value: 'verbal', label: 'لفظي', icon: BookOpen },
                            { value: 'quantitative', label: 'كمي', icon: Calculator },
                            { value: 'general', label: 'عام', icon: Target }
                          ].map((category) => (
                            <Button
                              key={category.value}
                              variant={selectedCategory === category.value ? "default" : "outline"}
                              onClick={() => setSelectedCategory(category.value as any)}
                              className={`flex items-center gap-2 ${
                                selectedCategory === category.value
                                  ? 'bg-gradient-to-r from-primary to-accent text-black'
                                  : 'bg-background/50 border-primary/20'
                              }`}
                            >
                              <category.icon className="w-4 h-4" />
                              {category.label}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <Button
                        onClick={addDailyTask}
                        disabled={!newTaskText.trim()}
                        className="w-full bg-gradient-to-r from-primary to-accent text-black font-bold py-3 rounded-xl"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        إضافة المهمة
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Today's Tasks */}
                  <Card className="bg-gradient-to-br from-card/90 to-card/60 border-0 rounded-3xl backdrop-blur-xl shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold flex items-center gap-3">
                        <Clock className="w-6 h-6 text-primary" />
                        مهام اليوم ({format(new Date(), 'dd MMMM', { locale: ar })})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {getTodayTasks().length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>لا توجد مهام لليوم</p>
                            <p className="text-sm">أضف مهمة جديدة للبدء</p>
                          </div>
                        ) : (
                          getTodayTasks().map((task) => (
                            <div
                              key={task.id}
                              className={`p-4 rounded-xl border transition-all duration-300 ${
                                task.completed
                                  ? 'bg-green-500/10 border-green-500/20'
                                  : 'bg-background/50 border-primary/20 hover:border-primary/40'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Checkbox
                                    checked={task.completed}
                                    onCheckedChange={() => handleToggleTask(task.id)}
                                    className="w-5 h-5"
                                  />
                                  <span className={`${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                                    {task.text}
                                  </span>
                                  <Badge className={`${getCategoryColor(task.category)} text-xs`}>
                                    {getCategoryIcon(task.category)}
                                    <span className="mr-1">
                                      {task.category === 'verbal' ? 'لفظي' :
                                       task.category === 'quantitative' ? 'كمي' : 'عام'}
                                    </span>
                                  </Badge>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteTask(task.id)}
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Study Plans Tab */}
              <TabsContent value="plans" className="mt-0">
                <div className="space-y-6">
                  {savedPlans.length === 0 ? (
                    <Card className="bg-gradient-to-br from-card/90 to-card/60 border-0 rounded-3xl backdrop-blur-xl shadow-xl">
                      <CardContent className="text-center py-16">
                        <Calendar className="w-16 h-16 mx-auto mb-6 text-muted-foreground opacity-50" />
                        <h3 className="text-2xl font-bold text-foreground mb-4">لا توجد خطط دراسية محفوظة</h3>
                        <p className="text-muted-foreground mb-6">
                          ابدأ بإنشاء خطة دراسية جديدة من مولد خطة الدراسة
                        </p>
                        <Button
                          onClick={() => window.location.href = '/study-plan'}
                          className="bg-gradient-to-r from-primary to-accent text-black font-bold px-8 py-3 rounded-xl"
                        >
                          <Target className="w-5 h-5 mr-2" />
                          إنشاء خطة جديدة
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {savedPlans.map((plan) => (
                        <motion.div
                          key={plan.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Card className="bg-gradient-to-br from-card/90 to-card/60 border-0 rounded-3xl backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300">
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-bold text-foreground">
                                  {plan.name}
                                </CardTitle>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeletePlan(plan.id)}
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="grid grid-cols-2 gap-4 text-center">
                                <div className="p-3 bg-background/50 rounded-xl">
                                  <div className="text-xl font-bold text-primary">{plan.total_days}</div>
                                  <div className="text-xs text-muted-foreground">أيام</div>
                                </div>
                                <div className="p-3 bg-background/50 rounded-xl">
                                  <div className="text-xl font-bold text-accent">{plan.review_rounds}</div>
                                  <div className="text-xs text-muted-foreground">جولات</div>
                                </div>
                              </div>

                              <div className="text-center">
                                <div className="text-sm text-muted-foreground mb-1">تاريخ الاختبار</div>
                                <div className="font-bold text-foreground">
                                  {format(new Date(plan.test_date), 'dd MMMM yyyy', { locale: ar })}
                                </div>
                              </div>

                              <div className="text-center">
                                <div className="text-xs text-muted-foreground mb-4">
                                  تم الإنشاء: {format(new Date(plan.created_at), 'dd/MM/yyyy', { locale: ar })}
                                </div>
                                <Button
                                  onClick={() => viewPlanDetails(plan)}
                                  className="w-full bg-gradient-to-r from-primary to-accent text-black font-bold py-2 rounded-xl hover:scale-105 transition-transform duration-300"
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  عرض التفاصيل
                                  <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  )}
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
