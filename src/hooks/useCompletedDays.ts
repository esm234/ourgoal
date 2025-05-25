import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useCompletedDays = (planId?: string) => {
  const { user } = useAuth();
  const [completedDays, setCompletedDays] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load completed days for a specific plan
  const loadCompletedDays = async (targetPlanId?: string) => {
    const currentPlanId = targetPlanId || planId;

    if (!user || !currentPlanId) {
      setCompletedDays(new Set());
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('study_plans')
        .select('completed_days')
        .eq('id', currentPlanId)
        .eq('user_id', user.id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      const dayNumbers = data?.completed_days || [];
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
    const currentPlanId = targetPlanId || planId;

    if (!user || !currentPlanId) {
      toast.error('يجب تسجيل الدخول أولاً');
      return false;
    }

    try {
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

      // Update in database
      const { error: updateError } = await supabase
        .from('study_plans')
        .update({
          completed_days: newCompletedArray,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentPlanId)
        .eq('user_id', user.id);

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

  // Get total completed days for user (across all plans)
  const getTotalCompletedDays = async (): Promise<number> => {
    if (!user) return 0;

    try {
      const { data, error: fetchError } = await supabase
        .from('study_plans')
        .select('completed_days')
        .eq('user_id', user.id);

      if (fetchError) {
        throw fetchError;
      }

      // Sum all completed days from all plans
      const totalCompleted = data?.reduce((total, plan) => {
        const completedDays = plan.completed_days || [];
        return total + completedDays.length;
      }, 0) || 0;

      return totalCompleted;
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

  // Load completed days when planId or user changes
  useEffect(() => {
    loadCompletedDays();
  }, [planId, user]);

  return {
    completedDays,
    loading,
    error,
    toggleDayCompletion,
    getTotalCompletedDays,
    refreshCompletedDays: loadCompletedDays
  };
};
