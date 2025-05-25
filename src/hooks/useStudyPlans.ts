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
  id: string;
  user_id: string;
  name: string;
  total_days: number;
  review_rounds: number;
  test_date: string;
  study_days: StudyDay[];
  final_review_day: StudyDay;
  created_at: string;
  updated_at: string;
}

export const useStudyPlans = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState<StudyPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user's study plans
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
        .from('study_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setPlans(data || []);
    } catch (err) {
      console.error('Error loading study plans:', err);
      setError('حدث خطأ في تحميل خطط الدراسة');
      toast.error('حدث خطأ في تحميل خطط الدراسة');
    } finally {
      setLoading(false);
    }
  };

  // Save a new study plan
  const savePlan = async (planData: Omit<StudyPlan, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      toast.error('يجب تسجيل الدخول أولاً');
      return null;
    }

    try {
      const { data, error: insertError } = await supabase
        .from('study_plans')
        .insert({
          user_id: user.id,
          name: planData.name,
          total_days: planData.total_days,
          review_rounds: planData.review_rounds,
          test_date: planData.test_date,
          study_days: planData.study_days,
          final_review_day: planData.final_review_day
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      // Update local state
      setPlans(prev => [data, ...prev]);
      
      // Update user stats
      await updateUserStats();
      
      toast.success('تم حفظ خطة الدراسة بنجاح');
      return data;
    } catch (err) {
      console.error('Error saving study plan:', err);
      toast.error('حدث خطأ في حفظ خطة الدراسة');
      return null;
    }
  };

  // Delete a study plan
  const deletePlan = async (planId: string) => {
    if (!user) return false;

    try {
      const { error: deleteError } = await supabase
        .from('study_plans')
        .delete()
        .eq('id', planId)
        .eq('user_id', user.id);

      if (deleteError) {
        throw deleteError;
      }

      // Update local state
      setPlans(prev => prev.filter(plan => plan.id !== planId));
      
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

  // Get a specific plan
  const getPlan = async (planId: string): Promise<StudyPlan | null> => {
    if (!user) return null;

    try {
      const { data, error: fetchError } = await supabase
        .from('study_plans')
        .select('*')
        .eq('id', planId)
        .eq('user_id', user.id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      return data;
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
