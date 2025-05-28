import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface StudyDay {
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

export interface StudyPlan {
  name: string;
  total_days: number;
  review_rounds: number;
  test_date: string;
  study_days: StudyDay[];
  final_review_day: StudyDay;
  created_at: string;
  updated_at?: string;
}

export interface CompletedPlan {
  name: string;
  total_days: number;
  review_rounds: number;
  test_date: string;
  completed_days: number;
  xp_earned: number;
  completed_at: string;
  original_created_at: string;
}

export const useStudyPlans = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState<StudyPlan[]>([]);
  const [completedPlans, setCompletedPlans] = useState<CompletedPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user's study plan from profile
  const loadPlans = async () => {
    if (!user) {
      setPlans([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('study_plan, completed_plans')
        .eq('id', user.id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      // If user has a study plan, set it as the only plan
      if (data?.study_plan) {
        setPlans([data.study_plan as StudyPlan]);
      } else {
        setPlans([]);
      }

      // Load completed plans
      if (data?.completed_plans) {
        setCompletedPlans(data.completed_plans as CompletedPlan[]);
      } else {
        setCompletedPlans([]);
      }
    } catch (err) {
      console.error('Error loading study plan:', err);
      setError('حدث خطأ في تحميل خطة الدراسة');
      toast.error('حدث خطأ في تحميل خطة الدراسة');
    } finally {
      setLoading(false);
    }
  };

  // Save a new study plan
  const savePlan = async (planData: Omit<StudyPlan, 'created_at'>) => {
    if (!user) {
      toast.error('يجب تسجيل الدخول أولاً');
      return null;
    }

    try {
      // Check if user already has a study plan
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('study_plan')
        .eq('id', user.id)
        .single();

      if (profileError) {
        throw profileError;
      }

      // If user already has a current plan, show confirmation dialog
      if (profileData?.study_plan) {
        const existingPlan = profileData.study_plan as StudyPlan;
        toast.error('لديك خطة دراسة حالية بالفعل!', {
          description: `الخطة الحالية: ${existingPlan.name}. يجب إكمال أو حذف الخطة الحالية أولاً لحفظ خطة جديدة.`,
          duration: 6000,
        });
        return null;
      }

      // Create new plan with timestamp
      const newPlan: StudyPlan = {
        ...planData,
        created_at: new Date().toISOString()
      };

      // Save plan to profile
      const { data, error: updateError } = await supabase
        .from('profiles')
        .update({ study_plan: newPlan })
        .eq('id', user.id)
        .select('study_plan')
        .single();

      if (updateError) {
        throw updateError;
      }

      // Update local state
      setPlans([newPlan]);

      // User stats will be updated automatically via database triggers

      toast.success('تم حفظ خطة الدراسة بنجاح');
      return newPlan;
    } catch (err) {
      console.error('Error saving study plan:', err);
      toast.error('حدث خطأ في حفظ خطة الدراسة');
      return null;
    }
  };

  // Complete current plan and move to completed plans
  const completePlan = async () => {
    if (!user) return false;

    try {
      console.log('🏁 Starting plan completion process for user:', user.id);

      // Call the database function to complete the plan
      const { data, error: completeError } = await supabase.rpc('complete_current_plan', {
        target_user_id: user.id
      });

      if (completeError) {
        console.error('❌ Error completing plan:', completeError);
        throw completeError;
      }

      if (!data) {
        console.log('⚠️ No current plan found to complete');
        toast.error('لا توجد خطة حالية لإكمالها');
        return false;
      }

      console.log('✅ Plan completion successful, result:', data);

      // Wait a moment for database operations to complete
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Reload plans to get updated data
      console.log('🔄 Reloading plans data...');
      await loadPlans();

      // Verify XP calculation after completion
      console.log('🧮 Verifying XP calculation after plan completion...');
      try {
        const { data: xpData, error: xpError } = await supabase.rpc('calculate_user_xp_basic', {
          target_user_id: user.id
        });

        if (!xpError && xpData !== null) {
          console.log('✅ XP verified after plan completion:', xpData);
        } else {
          console.warn('⚠️ XP verification failed:', { error: xpError, data: xpData });

          // Try alternative verification by checking user_xp table directly
          const { data: userXpData, error: userXpError } = await supabase
            .from('user_xp')
            .select('total_xp')
            .eq('user_id', user.id)
            .single();

          if (!userXpError && userXpData) {
            console.log('✅ XP verified via user_xp table:', userXpData.total_xp);
          } else {
            console.warn('⚠️ Could not verify XP via user_xp table:', userXpError);
          }
        }
      } catch (xpErr) {
        console.warn('⚠️ XP verification error:', xpErr);
      }

      // Trigger leaderboard update by dispatching a custom event
      console.log('📢 Triggering leaderboard update...');
      window.dispatchEvent(new CustomEvent('xpUpdated'));

      toast.success('تم إكمال الخطة وحفظها في الخطط المكتملة! يمكنك الآن إنشاء خطة جديدة.');
      return true;
    } catch (err) {
      console.error('❌ Error completing study plan:', err);
      toast.error('حدث خطأ في إكمال خطة الدراسة');
      return false;
    }
  };

  // Delete the user's study plan (without completing)
  const deletePlan = async () => {
    if (!user) return false;

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ study_plan: null })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      // Update local state
      setPlans([]);

      // User stats will be updated automatically via database triggers

      toast.success('تم حذف خطة الدراسة');
      return true;
    } catch (err) {
      console.error('Error deleting study plan:', err);
      toast.error('حدث خطأ في حذف خطة الدراسة');
      return false;
    }
  };

  // Get the user's study plan
  const getPlan = async (): Promise<StudyPlan | null> => {
    if (!user) return null;

    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('study_plan')
        .eq('id', user.id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      return data?.study_plan as StudyPlan || null;
    } catch (err) {
      console.error('Error fetching study plan:', err);
      return null;
    }
  };

  // Note: User stats are now updated automatically via database triggers

  // Load plans when user changes
  useEffect(() => {
    loadPlans();
  }, [user]);

  // Update existing study plan
  const updatePlan = async (updatedPlan: StudyPlan) => {
    if (!user) {
      toast.error('يجب تسجيل الدخول أولاً');
      return false;
    }

    try {
      // Add updated timestamp
      const planWithTimestamp = {
        ...updatedPlan,
        updated_at: new Date().toISOString()
      };

      // Update plan in profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          study_plan: planWithTimestamp,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      // Update local state
      setPlans([planWithTimestamp]);

      // User stats will be updated automatically via database triggers

      toast.success('تم تحديث خطة الدراسة بنجاح');
      return true;
    } catch (err) {
      console.error('Error updating study plan:', err);
      toast.error('حدث خطأ في تحديث خطة الدراسة');
      return false;
    }
  };

  return {
    plans,
    completedPlans,
    loading,
    error,
    savePlan,
    updatePlan,
    deletePlan,
    completePlan,
    getPlan,
    refreshPlans: loadPlans
  };
};
