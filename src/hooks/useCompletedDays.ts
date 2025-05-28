import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Interface for tracking daily completions
interface DailyCompletionRecord {
  date: string; // YYYY-MM-DD format
  completed_days: number[];
  count: number;
}

export const useCompletedDays = () => {
  const { user } = useAuth();
  const [completedDays, setCompletedDays] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dailyCompletions, setDailyCompletions] = useState<DailyCompletionRecord[]>([]);

  // Constants
  const DAILY_COMPLETION_LIMIT = 2;

  // Helper functions for daily completion tracking
  const getTodayString = () => {
    return new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  const getTodayCompletions = () => {
    const today = getTodayString();
    return dailyCompletions.find(record => record.date === today) || { date: today, completed_days: [], count: 0 };
  };

  const canCompleteMoreToday = () => {
    const todayRecord = getTodayCompletions();
    return todayRecord.count < DAILY_COMPLETION_LIMIT;
  };

  const getRemainingCompletionsToday = () => {
    const todayRecord = getTodayCompletions();
    return Math.max(0, DAILY_COMPLETION_LIMIT - todayRecord.count);
  };

  // Load completed days from user's profile
  const loadCompletedDays = async (targetPlanId?: string) => {
    if (!user) {
      setCompletedDays(new Set());
      setDailyCompletions([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('study_plan')
        .eq('id', user.id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      // Get completed days from the study plan stored in profile
      const studyPlan = data?.study_plan as any;
      const dayNumbers = studyPlan?.completed_days || [];
      setCompletedDays(new Set(dayNumbers));

      // Load daily completion records from localStorage
      const localStorageKey = `daily_completions_${user.id}`;
      const localData = localStorage.getItem(localStorageKey);
      let dailyRecords: DailyCompletionRecord[] = [];

      if (localData) {
        try {
          dailyRecords = JSON.parse(localData);
        } catch (e) {
          console.warn('Failed to parse localStorage daily completions:', e);
        }
      }

      setDailyCompletions(dailyRecords);
    } catch (err) {
      console.error('Error loading completed days:', err);
      setError('حدث خطأ في تحميل الأيام المكتملة');
    } finally {
      setLoading(false);
    }
  };

  // Toggle day completion
  const toggleDayCompletion = async (dayNumber: number, targetPlanId?: string) => {
    if (!user) {
      toast.error('يجب تسجيل الدخول أولاً');
      return false;
    }

    const isCompleted = completedDays.has(dayNumber);
    const today = getTodayString();
    const todayRecord = getTodayCompletions();

    // Check daily limit when trying to complete a day
    if (!isCompleted && !canCompleteMoreToday()) {
      toast.error(`لقد وصلت للحد الأقصى اليومي! يمكنك إكمال ${DAILY_COMPLETION_LIMIT} أيام فقط في اليوم الواحد.`);
      return false;
    }

    try {
      // First, get the current study plan from profile
      const { data: profileData, error: fetchError } = await supabase
        .from('profiles')
        .select('study_plan')
        .eq('id', user.id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      const currentStudyPlan = profileData?.study_plan as any;
      if (!currentStudyPlan) {
        toast.error('لم يتم العثور على خطة دراسة');
        return false;
      }

      let newCompletedArray: number[];
      let updatedDailyCompletions = [...dailyCompletions];

      if (isCompleted) {
        // Remove completion
        newCompletedArray = Array.from(completedDays).filter(day => day !== dayNumber);

        // Update daily completions - remove from today's record
        const todayIndex = updatedDailyCompletions.findIndex(record => record.date === today);
        if (todayIndex >= 0) {
          updatedDailyCompletions[todayIndex] = {
            ...updatedDailyCompletions[todayIndex],
            completed_days: updatedDailyCompletions[todayIndex].completed_days.filter(day => day !== dayNumber),
            count: Math.max(0, updatedDailyCompletions[todayIndex].count - 1)
          };
        }

        toast.success('تم إلغاء تحديد اليوم');
      } else {
        // Add completion
        newCompletedArray = [...Array.from(completedDays), dayNumber].sort((a, b) => a - b);

        // Update daily completions - add to today's record
        const todayIndex = updatedDailyCompletions.findIndex(record => record.date === today);
        if (todayIndex >= 0) {
          updatedDailyCompletions[todayIndex] = {
            ...updatedDailyCompletions[todayIndex],
            completed_days: [...updatedDailyCompletions[todayIndex].completed_days, dayNumber],
            count: updatedDailyCompletions[todayIndex].count + 1
          };
        } else {
          updatedDailyCompletions.push({
            date: today,
            completed_days: [dayNumber],
            count: 1
          });
        }

        const remaining = getRemainingCompletionsToday() - 1;
        if (remaining > 0) {
          toast.success(`🎉 أحسنت! تم تحديد اليوم كمكتمل. يمكنك إكمال ${remaining} أيام أخرى اليوم.`);
        } else {
          toast.success('🎉 أحسنت! تم تحديد اليوم كمكتمل. وصلت للحد الأقصى اليومي!');
        }
      }

      // Update the study plan with new completed days
      const updatedStudyPlan = {
        ...currentStudyPlan,
        completed_days: newCompletedArray
      };

      // Update in database (only study plan)
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          study_plan: updatedStudyPlan,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      // Save daily completions to localStorage
      const localStorageKey = `daily_completions_${user.id}`;
      localStorage.setItem(localStorageKey, JSON.stringify(updatedDailyCompletions));

      // Update local state
      setCompletedDays(new Set(newCompletedArray));
      setDailyCompletions(updatedDailyCompletions);

      // Update XP calculation automatically (this will also update study_days via trigger)
      await updateUserXP();

      toast.success('تم تحديث حالة اليوم بنجاح! استخدم زر "تحديث" في المتصدرين لرؤية التغييرات.');
      return true;
    } catch (err) {
      console.error('Error toggling day completion:', err);
      toast.error('حدث خطأ في تحديث حالة اليوم');
      return false;
    }
  };

  // Get total completed days for user (from profile)
  const getTotalCompletedDays = async (): Promise<number> => {
    if (!user) return 0;

    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('study_plan')
        .eq('id', user.id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      // Get completed days from the study plan stored in profile
      const studyPlan = data?.study_plan as any;
      const completedDays = studyPlan?.completed_days || [];

      return completedDays.length;
    } catch (err) {
      console.error('Error getting total completed days:', err);
      return 0;
    }
  };

  // Note: User stats are now updated automatically via database triggers

  // Update user XP
  const updateUserXP = async () => {
    if (!user) return;

    try {
      // Try the basic database function first
      const { error: xpError } = await supabase.rpc('calculate_user_xp_basic', {
        target_user_id: user.id
      });

      if (xpError) {
        console.error('Error calculating user XP with database function:', xpError);
        // Fallback to manual XP calculation
        await calculateXPManually();
      }
    } catch (err) {
      console.error('Error updating user XP:', err);
      // Fallback to manual XP calculation
      await calculateXPManually();
    }
  };

  // Manual XP calculation as fallback
  const calculateXPManually = async () => {
    if (!user) return;

    try {
      // Get user profile and username
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('username, study_plan, completed_plans')
        .eq('id', user.id)
        .single();

      if (profileError) {
        throw profileError;
      }

      const studyPlan = profileData?.study_plan as any;
      const completedDaysArray = studyPlan?.completed_days || [];
      const completedPlansArray = profileData?.completed_plans || [];
      const username = profileData?.username || 'مستخدم';

      // Calculate XP components
      let totalXP = 0;

      // 1. XP from current plan (using completed_days array)
      const currentPlanXP = completedDaysArray.length * 100; // 100 XP per completed day
      totalXP += currentPlanXP;

      // 2. XP from completed plans
      const completedPlansXP = completedPlansArray.reduce((sum: number, plan: any) => {
        return sum + (plan.xp_earned || 0);
      }, 0);
      totalXP += completedPlansXP;

      // 3. XP from events
      const { data: eventsData } = await supabase
        .from('event_participations')
        .select('xp_earned')
        .eq('user_id', user.id);

      const eventsXP = eventsData?.reduce((sum, event) => sum + (event.xp_earned || 0), 0) || 0;
      totalXP += eventsXP;

      // Update user XP
      await supabase
        .from('user_xp')
        .upsert({
          user_id: user.id,
          username: username,
          total_xp: totalXP,
          last_calculated: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      console.log('XP updated manually:', {
        totalXP,
        currentPlanXP,
        completedPlansXP,
        eventsXP,
        completedDaysCount: completedDaysArray.length
      });
    } catch (err) {
      console.error('Error in manual XP calculation:', err);
    }
  };

  // Check if all days in the plan are completed
  const areAllDaysCompleted = (studyPlan: any) => {
    if (!studyPlan) return false;
    const totalDays = (studyPlan.study_days?.length || 0) + 1; // +1 for final review day
    return completedDays.size === totalDays;
  };

  // Load completed days when user changes
  useEffect(() => {
    loadCompletedDays();
  }, [user]);

  return {
    completedDays,
    loading,
    error,
    toggleDayCompletion,
    getTotalCompletedDays,
    refreshCompletedDays: loadCompletedDays,
    // New daily limit functions
    canCompleteMoreToday,
    getRemainingCompletionsToday,
    getTodayCompletions,
    areAllDaysCompleted,
    DAILY_COMPLETION_LIMIT
  };
};
