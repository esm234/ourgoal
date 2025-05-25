import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface DailyTask {
  id: string;
  user_id: string;
  text: string;
  category: 'verbal' | 'quantitative' | 'general';
  completed: boolean;
  task_date: string;
  created_at: string;
  updated_at: string;
}

export const useDailyTasks = (date?: string) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const today = date || new Date().toISOString().split('T')[0];

  // Load tasks for a specific date
  const loadTasks = async (targetDate?: string) => {
    const currentDate = targetDate || today;
    
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('daily_tasks')
        .select('*')
        .eq('user_id', user.id)
        .eq('task_date', currentDate)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setTasks(data || []);
    } catch (err) {
      console.error('Error loading daily tasks:', err);
      setError('حدث خطأ في تحميل المهام');
    } finally {
      setLoading(false);
    }
  };

  // Add a new task
  const addTask = async (text: string, category: 'verbal' | 'quantitative' | 'general' = 'general', taskDate?: string) => {
    if (!user) {
      toast.error('يجب تسجيل الدخول أولاً');
      return null;
    }

    if (!text.trim()) {
      toast.error('يجب كتابة نص المهمة');
      return null;
    }

    try {
      const { data, error: insertError } = await supabase
        .from('daily_tasks')
        .insert({
          user_id: user.id,
          text: text.trim(),
          category,
          task_date: taskDate || today,
          completed: false
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      // Update local state
      setTasks(prev => [data, ...prev]);
      
      toast.success('تم إضافة المهمة بنجاح');
      return data;
    } catch (err) {
      console.error('Error adding task:', err);
      toast.error('حدث خطأ في إضافة المهمة');
      return null;
    }
  };

  // Toggle task completion
  const toggleTask = async (taskId: string) => {
    if (!user) return false;

    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return false;

      const newCompleted = !task.completed;

      const { error: updateError } = await supabase
        .from('daily_tasks')
        .update({ 
          completed: newCompleted,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId)
        .eq('user_id', user.id);

      if (updateError) {
        throw updateError;
      }

      // Update local state
      setTasks(prev => 
        prev.map(t => 
          t.id === taskId 
            ? { ...t, completed: newCompleted, updated_at: new Date().toISOString() }
            : t
        )
      );

      // Update user stats
      await updateUserStats();
      
      if (newCompleted) {
        toast.success('🎉 أحسنت! تم إكمال المهمة');
      } else {
        toast.success('تم إلغاء إكمال المهمة');
      }
      
      return true;
    } catch (err) {
      console.error('Error toggling task:', err);
      toast.error('حدث خطأ في تحديث المهمة');
      return false;
    }
  };

  // Delete a task
  const deleteTask = async (taskId: string) => {
    if (!user) return false;

    try {
      const { error: deleteError } = await supabase
        .from('daily_tasks')
        .delete()
        .eq('id', taskId)
        .eq('user_id', user.id);

      if (deleteError) {
        throw deleteError;
      }

      // Update local state
      setTasks(prev => prev.filter(t => t.id !== taskId));
      
      // Update user stats
      await updateUserStats();
      
      toast.success('تم حذف المهمة');
      return true;
    } catch (err) {
      console.error('Error deleting task:', err);
      toast.error('حدث خطأ في حذف المهمة');
      return false;
    }
  };

  // Get tasks by category
  const getTasksByCategory = (category: 'verbal' | 'quantitative' | 'general') => {
    return tasks.filter(task => task.category === category);
  };

  // Get completed tasks count
  const getCompletedCount = () => {
    return tasks.filter(task => task.completed).length;
  };

  // Get total tasks count
  const getTotalCount = () => {
    return tasks.length;
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

  // Load tasks when user or date changes
  useEffect(() => {
    loadTasks();
  }, [user, today]);

  return {
    tasks,
    loading,
    error,
    addTask,
    toggleTask,
    deleteTask,
    getTasksByCategory,
    getCompletedCount,
    getTotalCount,
    refreshTasks: loadTasks
  };
};
