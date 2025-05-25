import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useCompletedDays = () => {
  const { user } = useAuth();
  const [completedDays, setCompletedDays] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load completed days from user's profile
  const loadCompletedDays = async (targetPlanId?: string) => {
    if (!user) {
      setCompletedDays(new Set());
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

      const isCompleted = completedDays.has(dayNumber);
      let newCompletedArray: number[];

      if (isCompleted) {
        // Remove completion
        newCompletedArray = Array.from(completedDays).filter(day => day !== dayNumber);
        toast.success('تم إلغاء تحديد اليوم');
      } else {
        // Add completion
        newCompletedArray = [...Array.from(completedDays), dayNumber].sort((a, b) => a - b);
        toast.success('🎉 أحسنت! تم تحديد اليوم كمكتمل');
      }

      // Update the study plan with new completed days
      const updatedStudyPlan = {
        ...currentStudyPlan,
        completed_days: newCompletedArray
      };

      // Update in database
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

      // Update local state
      setCompletedDays(new Set(newCompletedArray));

      // Update user stats
      await updateUserStats();

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

  // Update user stats
  const updateUserStats = async () => {
    if (!user) return;

    try {
      // Update basic user stats
      const { error: statsError } = await supabase.rpc('update_user_stats', {
        user_uuid: user.id
      });

      if (statsError) {
        console.error('Error updating user stats:', statsError);
      }

      // Calculate and update XP
      const { error: xpError } = await supabase.rpc('calculate_user_xp', {
        user_uuid: user.id
      });

      if (xpError) {
        console.error('Error calculating user XP:', xpError);
      }
    } catch (err) {
      console.error('Error updating user stats and XP:', err);
    }
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
    refreshCompletedDays: loadCompletedDays
  };
};
