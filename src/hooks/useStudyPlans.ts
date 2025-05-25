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
}

export const useStudyPlans = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState<StudyPlan[]>([]);
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
        .select('study_plan')
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

      // If user already has a plan, show confirmation dialog
      if (profileData?.study_plan) {
        const existingPlan = profileData.study_plan as StudyPlan;
        toast.error('لديك خطة دراسة محفوظة بالفعل!', {
          description: `الخطة الحالية: ${existingPlan.name}. يجب حذف الخطة الحالية أولاً لحفظ خطة جديدة.`,
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

      // Update user stats
      await updateUserStats();

      toast.success('تم حفظ خطة الدراسة بنجاح');
      return newPlan;
    } catch (err) {
      console.error('Error saving study plan:', err);
      toast.error('حدث خطأ في حفظ خطة الدراسة');
      return null;
    }
  };

  // Delete the user's study plan
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

      // Update user stats
      await updateUserStats();

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

  // Update user stats
  const updateUserStats = async () => {
    if (!user) return;

    try {
      const { error } = await supabase.rpc('update_user_stats', {
        user_uuid: user.id
      });

      if (error) {
        console.error('Error updating user stats:', error);
      }
    } catch (err) {
      console.error('Error calling update_user_stats:', err);
    }
  };

  // Load plans when user changes
  useEffect(() => {
    loadPlans();
  }, [user]);

  return {
    plans,
    loading,
    error,
    savePlan,
    deletePlan,
    getPlan,
    refreshPlans: loadPlans
  };
};
