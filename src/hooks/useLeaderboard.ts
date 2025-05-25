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

      // Get top 5 users
      const { data: topUsers, error: leaderboardError } = await supabase
        .from('user_xp')
        .select('*')
        .order('total_xp', { ascending: false })
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
        // Calculate user's rank
        const { data: rankData, error: rankError } = await supabase
          .from('user_xp')
          .select('user_id')
          .gt('total_xp', userData.total_xp);

        if (rankError) {
          throw rankError;
        }

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

      const { data, error } = await supabase.rpc('calculate_user_xp', {
        user_uuid: user.id
      });

      if (error) {
        console.error('Supabase RPC error:', error);
        throw error;
      }

      console.log('XP calculation result:', data);

      // Refresh leaderboard after calculation
      await loadLeaderboard();

      return data;
    } catch (err) {
      console.error('Error calculating user XP:', err);
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

      // Refresh leaderboard after calculation
      await loadLeaderboard();

      return data;
    } catch (err) {
      console.error('Error refreshing all XP:', err);
      return null;
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

  return {
    leaderboard,
    userRank,
    loading,
    error,
    calculateUserXP,
    refreshAllXP,
    getXPLevel,
    getDifficultyBadge,
    refreshLeaderboard: loadLeaderboard
  };
};
