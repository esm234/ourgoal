import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import LZString from 'lz-string';

export interface DashboardData {
  user_stats: {
    total_plans_created: number;
    total_study_days: number;
    completed_tasks: number;
    current_streak: number;
    created_at: string;
    updated_at: string;
  } | null;
  user_plans: Array<{
    id: string;
    name: string;
    total_days: number;
    review_rounds: number;
    test_date: string;
    completed_days: number[];
    completed_count: number;
    created_at: string;
  }>;
  user_xp: {
    username: string;
    completed_days: number;
    total_xp: number;
    last_calculated: string;
    rank: number;
  } | null;
  leaderboard: Array<{
    user_id: string;
    username: string;
    completed_days: number;
    total_xp: number;
    rank: number;
  }>;
}

const CACHE_KEYS = {
  DASHBOARD_DATA: 'dashboard_data_cache',
  LEADERBOARD: 'leaderboard_cache',
  USER_STATS: 'user_stats_cache'
};

const CACHE_DURATIONS = {
  DASHBOARD_DATA: 5 * 60 * 1000, // 5 دقائق
  LEADERBOARD: 10 * 60 * 1000,   // 10 دقائق
  USER_STATS: 15 * 60 * 1000     // 15 دقيقة
};

export const useDashboardData = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<number>(0);

  // ضغط البيانات للتخزين المؤقت
  const compressData = (data: any): string => {
    try {
      return LZString.compress(JSON.stringify(data));
    } catch (err) {
      console.error('Error compressing data:', err);
      return JSON.stringify(data);
    }
  };

  // إلغاء ضغط البيانات
  const decompressData = (compressedData: string): any => {
    try {
      const decompressed = LZString.decompress(compressedData);
      return decompressed ? JSON.parse(decompressed) : JSON.parse(compressedData);
    } catch (err) {
      console.error('Error decompressing data:', err);
      return null;
    }
  };

  // التحقق من صحة التخزين المؤقت
  const isCacheValid = (cacheKey: string, duration: number): boolean => {
    const cached = localStorage.getItem(cacheKey);
    if (!cached) return false;

    try {
      const { timestamp } = JSON.parse(cached);
      return Date.now() - timestamp < duration;
    } catch {
      return false;
    }
  };

  // جلب البيانات من التخزين المؤقت
  const getCachedData = (cacheKey: string): any => {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (!cached) return null;

      const { data } = JSON.parse(cached);
      return decompressData(data);
    } catch (err) {
      console.error('Error getting cached data:', err);
      return null;
    }
  };

  // حفظ البيانات في التخزين المؤقت
  const setCachedData = (cacheKey: string, data: any): void => {
    try {
      const cacheEntry = {
        data: compressData(data),
        timestamp: Date.now()
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheEntry));
    } catch (err) {
      console.error('Error setting cached data:', err);
    }
  };

  // جلب جميع بيانات لوحة التحكم
  const fetchDashboardData = useCallback(async (forceRefresh = false) => {
    if (!user) {
      setDashboardData(null);
      setLoading(false);
      return;
    }

    // التحقق من التخزين المؤقت أولاً
    if (!forceRefresh && isCacheValid(CACHE_KEYS.DASHBOARD_DATA, CACHE_DURATIONS.DASHBOARD_DATA)) {
      const cachedData = getCachedData(CACHE_KEYS.DASHBOARD_DATA);
      if (cachedData) {
        setDashboardData(cachedData);
        setLoading(false);
        return;
      }
    }

    try {
      setLoading(true);
      setError(null);

      console.log('Fetching dashboard data for user:', user.id);

      const { data, error: fetchError } = await supabase.rpc('get_user_dashboard_stats', {
        target_user_id: user.id
      });

      if (fetchError) {
        throw fetchError;
      }

      console.log('Dashboard data received:', data);

      // Transform the data to match expected format
      const transformedData = {
        user_stats: data && data.length > 0 ? {
          username: data[0].username,
          role: data[0].role,
          total_xp: data[0].total_xp,
          study_days: data[0].study_days,
          current_streak: data[0].current_streak,
          max_streak: data[0].max_streak,
          activity_count: data[0].activity_count,
          isAdmin: data[0].isadmin
        } : null,
        user_plans: [], // Will be loaded separately if needed
        user_xp: data && data.length > 0 ? {
          total_xp: data[0].total_xp
        } : null,
        leaderboard: [] // Will be loaded separately if needed
      };

      // حفظ في التخزين المؤقت
      setCachedData(CACHE_KEYS.DASHBOARD_DATA, transformedData);

      setDashboardData(transformedData);
      setLastFetch(Date.now());
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('حدث خطأ في تحميل البيانات');

      // محاولة استخدام البيانات المخزنة مؤقتاً حتى لو انتهت صلاحيتها
      const cachedData = getCachedData(CACHE_KEYS.DASHBOARD_DATA);
      if (cachedData) {
        setDashboardData(cachedData);
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  // جلب المتصدرين فقط
  const fetchLeaderboardOnly = useCallback(async () => {
    if (!user) return;

    // التحقق من التخزين المؤقت
    if (isCacheValid(CACHE_KEYS.LEADERBOARD, CACHE_DURATIONS.LEADERBOARD)) {
      const cachedLeaderboard = getCachedData(CACHE_KEYS.LEADERBOARD);
      if (cachedLeaderboard && dashboardData) {
        setDashboardData({
          ...dashboardData,
          leaderboard: cachedLeaderboard
        });
        return;
      }
    }

    try {
      const { data, error } = await supabase.rpc('get_user_dashboard_stats', {
        target_user_id: user.id
      });

      if (error) throw error;

      // Since our function doesn't return leaderboard, we'll skip this for now
      // TODO: Implement separate leaderboard function if needed
      console.log('Leaderboard fetch skipped - function returns user stats only');
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
    }
  }, [user, dashboardData]);

  // تحديث XP المستخدم (بدون مسح التخزين المؤقت أو التحديث التلقائي)
  const updateUserXP = useCallback(async () => {
    if (!user) return;

    try {
      const { error } = await supabase.rpc('calculate_user_xp_basic', {
        target_user_id: user.id
      });

      if (error) throw error;

      // XP updated in database only - cache remains unchanged
      // User must manually click refresh to see updated leaderboard
      console.log('XP updated in database - use refresh button to see changes');
    } catch (err) {
      console.error('Error updating user XP:', err);
    }
  }, [user]);

  // مسح التخزين المؤقت
  const clearCache = useCallback(() => {
    Object.values(CACHE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }, []);

  // جلب البيانات عند تحميل المكون
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // تحديث تلقائي معطل لتوفير استهلاك API
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (Date.now() - lastFetch > 10 * 60 * 1000) { // 10 دقائق
  //       fetchDashboardData();
  //     }
  //   }, 60 * 1000); // فحص كل دقيقة

  //   return () => clearInterval(interval);
  // }, [lastFetch, fetchDashboardData]);

  return {
    dashboardData,
    loading,
    error,
    refreshData: () => {
      // Clear cache and force refresh
      localStorage.removeItem(CACHE_KEYS.DASHBOARD_DATA);
      localStorage.removeItem(CACHE_KEYS.LEADERBOARD);
      return fetchDashboardData(true);
    },
    refreshLeaderboard: () => {
      // Clear cache and force refresh
      localStorage.removeItem(CACHE_KEYS.LEADERBOARD);
      return fetchLeaderboardOnly();
    },
    updateUserXP,
    clearCache,

    // بيانات منفصلة للسهولة
    userStats: dashboardData?.user_stats,
    userPlans: dashboardData?.user_plans || [],
    userXP: dashboardData?.user_xp,
    leaderboard: dashboardData?.leaderboard || [],

    // معلومات التخزين المؤقت
    isCached: isCacheValid(CACHE_KEYS.DASHBOARD_DATA, CACHE_DURATIONS.DASHBOARD_DATA),
    lastFetch: new Date(lastFetch)
  };
};
