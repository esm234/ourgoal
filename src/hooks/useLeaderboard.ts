import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface LeaderboardUser {
  id: string;
  user_id: string;
  username: string;
  completed_days: number;
  total_tests: number;
  average_tests_per_day: number;
  total_xp: number;
  last_calculated: string;
  rank?: number;
}

export const useLeaderboard = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [userRank, setUserRank] = useState<LeaderboardUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load leaderboard data
  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get top 5 users with proper sorting
      const { data: topUsers, error: leaderboardError } = await supabase
        .from('user_xp')
        .select('*')
        .gt('total_xp', 0) // Only users with XP > 0
        .order('total_xp', { ascending: false })
        .order('updated_at', { ascending: true }) // Secondary sort by oldest update (tie breaker)
        .limit(5);

      if (leaderboardError) {
        throw leaderboardError;
      }

      // If no users found, try to initialize with current user
      if ((!topUsers || topUsers.length === 0) && user) {
        await calculateUserXP();
        // Try again after initialization
        const { data: retryUsers } = await supabase
          .from('user_xp')
          .select('*')
          .order('total_xp', { ascending: false })
          .limit(5);

        if (retryUsers && retryUsers.length > 0) {
          const rankedUsers = retryUsers.map((user, index) => ({
            ...user,
            rank: index + 1
          }));
          setLeaderboard(rankedUsers);
        } else {
          // Show empty state if no users
          setLeaderboard([]);
        }
      } else {
        // Add rank to users
        const rankedUsers = (topUsers || []).map((user, index) => ({
          ...user,
          rank: index + 1
        }));
        setLeaderboard(rankedUsers);
      }

      // Get current user's rank if logged in
      if (user) {
        await loadUserRank();
      }
    } catch (err) {
      console.error('Error loading leaderboard:', err);
      setError('حدث خطأ في تحميل المتصدرين');
      // Show empty state on error
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  };

  // Demo leaderboard data
  const getDemoLeaderboard = (): LeaderboardUser[] => [
    {
      id: 'demo-1',
      user_id: 'demo-1',
      username: 'أحمد المجتهد',
      completed_days: 25,
      total_tests: 300,
      average_tests_per_day: 12,
      total_xp: 7500,
      last_calculated: new Date().toISOString(),
      rank: 1
    },
    {
      id: 'demo-2',
      user_id: 'demo-2',
      username: 'فاطمة المثابرة',
      completed_days: 20,
      total_tests: 280,
      average_tests_per_day: 14,
      total_xp: 5000,
      last_calculated: new Date().toISOString(),
      rank: 2
    },
    {
      id: 'demo-3',
      user_id: 'demo-3',
      username: 'محمد المنتظم',
      completed_days: 18,
      total_tests: 180,
      average_tests_per_day: 10,
      total_xp: 5400,
      last_calculated: new Date().toISOString(),
      rank: 3
    }
  ];

  // Load current user's rank
  const loadUserRank = async () => {
    if (!user) return;

    try {
      // Get user's XP data
      const { data: userData, error: userError } = await supabase
        .from('user_xp')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (userError && userError.code !== 'PGRST116') {
        throw userError;
      }

      if (userData) {
        // Calculate user's rank more accurately
        const { data: rankData, error: rankError } = await supabase
          .from('user_xp')
          .select('user_id, total_xp')
          .gt('total_xp', userData.total_xp)
          .order('total_xp', { ascending: false });

        if (rankError) {
          throw rankError;
        }

        // Count users with higher XP
        const rank = (rankData?.length || 0) + 1;

        setUserRank({ ...userData, rank });
      }
    } catch (err) {
      console.error('Error loading user rank:', err);
    }
  };

  // Calculate XP for current user
  const calculateUserXP = async () => {
    if (!user) {
      console.log('No user logged in');
      return null;
    }

    try {
      console.log('Calculating XP for user:', user.id);

      // Try the basic database function first
      const { data, error } = await supabase.rpc('calculate_user_xp_basic', {
        target_user_id: user.id
      });

      if (error) {
        console.error('Database function error:', error);
        // Fallback to manual calculation
        return await calculateXPManually();
      }

      console.log('XP calculation result:', data);

      // Note: Leaderboard refresh is now manual only to save API calls
      return data;
    } catch (err) {
      console.error('Error calculating user XP:', err);
      // Fallback to manual calculation
      return await calculateXPManually();
    }
  };

  // Manual XP calculation as fallback
  const calculateXPManually = async () => {
    if (!user) return null;

    try {
      console.log('Calculating XP manually for user:', user.id);

      // Get user profile and username
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('username, completed_plans, study_plan')
        .eq('id', user.id)
        .single();

      if (profileError) {
        throw profileError;
      }

      const username = profileData?.username || 'مستخدم';

      // Calculate XP from different sources
      let totalXP = 0;

      // 1. XP from events (get from event_participations table)
      const { data: eventsData, error: eventsError } = await supabase
        .from('event_participations')
        .select('xp_earned')
        .eq('user_id', user.id);

      const eventsXP = eventsData?.reduce((sum, event) => sum + (event.xp_earned || 0), 0) || 0;
      totalXP += eventsXP;

      console.log('📊 Events XP Details:', {
        eventsCount: eventsData?.length || 0,
        eventsData: eventsData?.map(e => ({ xp_earned: e.xp_earned })),
        totalEventsXP: eventsXP
      });

      // 2. XP from completed plans
      const completedPlans = profileData?.completed_plans as any[] || [];
      const completedPlansXP = completedPlans.reduce((sum, plan) => sum + (plan.xp_earned || 0), 0);
      totalXP += completedPlansXP;

      // 3. XP from current plan (only actually completed days)
      const currentPlan = profileData?.study_plan as any;
      let currentPlanXP = 0;
      if (currentPlan && currentPlan.study_days) {
        // Count only days that are actually marked as completed
        const completedDays = currentPlan.study_days.filter((day: any) => day.completed === true).length;

        // Add final review day if it's completed
        let finalReviewCompleted = 0;
        if (currentPlan.final_review_day && currentPlan.final_review_day.completed === true) {
          finalReviewCompleted = 1;
        }

        currentPlanXP = (completedDays + finalReviewCompleted) * 100; // 100 XP per actually completed day

        // Debug logging
        console.log('Current plan XP calculation:', {
          totalStudyDays: currentPlan.study_days.length,
          completedDays,
          finalReviewCompleted,
          currentPlanXP,
          sampleDay: currentPlan.study_days[0],
          finalReviewDay: currentPlan.final_review_day
        });
      }
      totalXP += currentPlanXP;

      console.log('Manual XP calculation:', {
        eventsXP,
        completedPlansXP,
        currentPlanXP,
        totalXP
      });

      // Insert or update user XP (using minimal columns)
      const { error: upsertError } = await supabase
        .from('user_xp')
        .upsert({
          user_id: user.id,
          username: username,
          total_xp: totalXP,
          updated_at: new Date().toISOString()
        });

      if (upsertError) {
        throw upsertError;
      }

      // Note: Leaderboard refresh is now manual only to save API calls
      return totalXP;
    } catch (err) {
      console.error('Error in manual XP calculation:', err);
      return null;
    }
  };

  // Refresh all users XP (admin function)
  const refreshAllXP = async () => {
    try {
      const { data, error } = await supabase.rpc('refresh_all_user_xp');

      if (error) {
        throw error;
      }

      // Note: Leaderboard refresh is now manual only to save API calls
      return data;
    } catch (err) {
      console.error('Error refreshing all XP:', err);
      return null;
    }
  };

  // Update user XP in leaderboard after event participation
  const updateUserXPFromProfile = async () => {
    if (!user) return;

    try {
      // Recalculate XP using the manual calculation method
      const totalXP = await calculateXPManually();

      if (totalXP !== null) {
        // Refresh leaderboard to show updated data
        await loadLeaderboard();
      }
    } catch (err) {
      console.error('Error updating user XP from profile:', err);
    }
  };

  // Get XP level and progress
  const getXPLevel = (xp: number) => {
    const level = Math.floor(xp / 1000) + 1;
    const currentLevelXP = (level - 1) * 1000;
    const nextLevelXP = level * 1000;
    const progress = ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

    return {
      level,
      progress: Math.min(progress, 100),
      currentXP: xp - currentLevelXP,
      requiredXP: nextLevelXP - currentLevelXP
    };
  };

  // Get difficulty badge based on average tests per day
  const getDifficultyBadge = (avgTests: number) => {
    if (avgTests <= 10) return { label: 'متأني', color: 'from-purple-500 to-purple-600', icon: '🐢' };
    if (avgTests <= 15) return { label: 'متوازن', color: 'from-blue-500 to-blue-600', icon: '⚖️' };
    if (avgTests <= 20) return { label: 'نشط', color: 'from-green-500 to-green-600', icon: '🚀' };
    if (avgTests <= 25) return { label: 'سريع', color: 'from-orange-500 to-orange-600', icon: '⚡' };
    return { label: 'مكثف', color: 'from-red-500 to-red-600', icon: '🔥' };
  };

  // Load data on mount and when user changes
  useEffect(() => {
    loadLeaderboard();
  }, [user]);

  // Listen for XP updates
  useEffect(() => {
    const handleXPUpdate = async () => {
      if (user) {
        await updateUserXPFromProfile();
      }
    };

    window.addEventListener('xpUpdated', handleXPUpdate);

    return () => {
      window.removeEventListener('xpUpdated', handleXPUpdate);
    };
  }, [user]);

  return {
    leaderboard,
    userRank,
    loading,
    error,
    calculateUserXP,
    refreshAllXP,
    updateUserXPFromProfile,
    getXPLevel,
    getDifficultyBadge,
    refreshLeaderboard: loadLeaderboard
  };
};
