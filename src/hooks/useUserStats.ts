import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface UserStats {
  user_id: string;
  total_plans_created: number;
  total_study_days: number;
  completed_tasks: number;
  current_streak: number;
  updated_at: string;
}

export const useUserStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user statistics
  const loadStats = async () => {
    if (!user) {
      setStats(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // First try to get existing stats
      const { data: existingStats, error: fetchError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingStats) {
        setStats(existingStats);
      } else {
        // Create initial stats if they don't exist
        await createInitialStats();
      }
    } catch (err) {
      console.error('Error loading user stats:', err);
      setError('حدث خطأ في تحميل الإحصائيات');
    } finally {
      setLoading(false);
    }
  };

  // Create initial stats for new user
  const createInitialStats = async () => {
    if (!user) return;

    try {
      const { data, error: insertError } = await supabase
        .from('user_stats')
        .insert({
          user_id: user.id,
          total_plans_created: 0,
          total_study_days: 0,
          completed_tasks: 0,
          current_streak: 0
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      setStats(data);
    } catch (err) {
      console.error('Error creating initial stats:', err);
    }
  };

  // Update stats using the database function
  const updateStats = async () => {
    if (!user) return;

    try {
      console.log('Updating user stats for:', user.id);

      const { error } = await supabase.rpc('update_user_stats', {
        user_uuid: user.id
      });

      if (error) {
        console.error('Database function error:', error);
        throw error;
      }

      console.log('User stats updated successfully');

      // Reload stats after update
      await loadStats();
    } catch (err) {
      console.error('Error updating user stats:', err);
      // Try to calculate stats manually if database function fails
      await calculateStatsManually();
    }
  };

  // Manual stats calculation as fallback
  const calculateStatsManually = async () => {
    if (!user) return;

    try {
      console.log('Calculating stats manually for:', user.id);

      // Get study plan from profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('study_plan')
        .eq('id', user.id)
        .single();

      if (profileError) {
        throw profileError;
      }

      const studyPlan = profileData?.study_plan as any;
      const completedDays = studyPlan?.completed_days || [];
      const totalPlansCreated = studyPlan ? 1 : 0;
      const totalStudyDays = completedDays.length;

      // Get completed tasks count
      const { data: tasksData, error: tasksError } = await supabase
        .from('daily_tasks')
        .select('id')
        .eq('user_id', user.id)
        .eq('completed', true);

      if (tasksError) {
        throw tasksError;
      }

      const completedTasks = tasksData?.length || 0;

      // Calculate streak (simplified)
      const currentStreak = await calculateStreak();

      // Update or insert stats manually
      const { error: upsertError } = await supabase
        .from('user_stats')
        .upsert({
          user_id: user.id,
          total_plans_created: totalPlansCreated,
          total_study_days: totalStudyDays,
          completed_tasks: completedTasks,
          current_streak: currentStreak,
          updated_at: new Date().toISOString()
        });

      if (upsertError) {
        throw upsertError;
      }

      console.log('Manual stats calculation completed:', {
        totalPlansCreated,
        totalStudyDays,
        completedTasks,
        currentStreak
      });

      // Reload stats
      await loadStats();
    } catch (err) {
      console.error('Error in manual stats calculation:', err);
    }
  };

  // Calculate current streak from daily tasks
  const calculateStreak = async (): Promise<number> => {
    if (!user) return 0;

    try {
      // Get completed tasks ordered by date (most recent first)
      const { data: tasks, error: fetchError } = await supabase
        .from('daily_tasks')
        .select('task_date')
        .eq('user_id', user.id)
        .eq('completed', true)
        .order('task_date', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      if (!tasks || tasks.length === 0) return 0;

      // Get unique dates and calculate streak
      const uniqueDates = [...new Set(tasks.map(task => task.task_date))].sort().reverse();
      let streak = 0;
      let currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      for (const dateStr of uniqueDates) {
        const taskDate = new Date(dateStr);
        taskDate.setHours(0, 0, 0, 0);

        const diffDays = Math.floor((currentDate.getTime() - taskDate.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === streak) {
          streak++;
          currentDate = taskDate;
        } else {
          break;
        }
      }

      return streak;
    } catch (err) {
      console.error('Error calculating streak:', err);
      return 0;
    }
  };

  // Update streak manually
  const updateStreak = async () => {
    if (!user || !stats) return;

    try {
      const newStreak = await calculateStreak();

      const { error } = await supabase
        .from('user_stats')
        .update({
          current_streak: newStreak,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      setStats(prev => prev ? { ...prev, current_streak: newStreak } : null);
    } catch (err) {
      console.error('Error updating streak:', err);
    }
  };

  // Get formatted stats for display
  const getFormattedStats = () => {
    if (!stats) {
      return {
        totalPlansCreated: 0,
        totalStudyDays: 0,
        completedTasks: 0,
        currentStreak: 0
      };
    }

    return {
      totalPlansCreated: stats.total_plans_created,
      totalStudyDays: stats.total_study_days,
      completedTasks: stats.completed_tasks,
      currentStreak: stats.current_streak
    };
  };

  // Load stats when user changes
  useEffect(() => {
    loadStats();
  }, [user]);

  return {
    stats,
    loading,
    error,
    updateStats,
    updateStreak,
    getFormattedStats,
    refreshStats: loadStats
  };
};
