import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import {
  WeeklyEvent,
  EventParticipation,
  LeaderboardEntry,
  UserEventHistory,
  EventsResponse,
  LeaderboardResponse,
  HistoryResponse
} from '@/types/weeklyEvents';

export const useWeeklyEvents = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<WeeklyEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all enabled events
  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Update event statuses first
      await supabase.rpc('update_event_status');

      // Fetch enabled events
      const { data, error: fetchError } = await supabase
        .from('weekly_events')
        .select('*')
        .eq('is_enabled', true)
        .order('start_time', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      setEvents(data || []);
    } catch (err) {
      console.error('Error loading events:', err);
      setError('حدث خطأ في تحميل الفعاليات');
    } finally {
      setLoading(false);
    }
  }, []);

  // Get events by status
  const getEventsByStatus = useCallback((status: 'upcoming' | 'active' | 'finished') => {
    return events.filter(event => event.status === status);
  }, [events]);

  // Check if user has participated in an event
  const hasUserParticipated = useCallback(async (eventId: number): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('event_participations')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .single();

      return !error && !!data;
    } catch {
      return false;
    }
  }, [user]);

  // Get user's participation for an event
  const getUserParticipation = useCallback(async (eventId: number): Promise<EventParticipation | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('event_participations')
        .select('*')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .single();

      if (error) return null;
      return data;
    } catch {
      return null;
    }
  }, [user]);

  // Submit event participation (optimized for minimal storage)
  const submitParticipation = useCallback(async (
    eventId: number,
    answers: number[],
    score: number,
    totalQuestions: number,
    timeTakenMinutes: number,
    xpEarned: number
  ): Promise<boolean> => {
    if (!user) {
      toast.error('يجب تسجيل الدخول أولاً');
      return false;
    }

    try {
      // Check if already participated
      const hasParticipated = await hasUserParticipated(eventId);
      if (hasParticipated) {
        toast.error('لقد شاركت في هذه الفعالية من قبل');
        return false;
      }

      // Insert participation record
      const { error: insertError } = await supabase
        .from('event_participations')
        .insert({
          event_id: eventId,
          user_id: user.id,
          answers: answers, // Stored as JSON array of indices
          score,
          total_questions: totalQuestions,
          time_taken_minutes: timeTakenMinutes,
          xp_earned: xpEarned
        });

      if (insertError) {
        throw insertError;
      }

      // Add XP to user's total
      await supabase.rpc('add_event_xp_to_user', {
        target_user_id: user.id,
        xp_amount: xpEarned
      });

      toast.success(`🎉 تم إكمال الاختبار! حصلت على ${xpEarned} نقطة خبرة`);
      return true;
    } catch (err) {
      console.error('Error submitting participation:', err);
      toast.error('حدث خطأ في إرسال النتائج');
      return false;
    }
  }, [user, hasUserParticipated]);

  // Load events on mount
  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  return {
    events,
    loading,
    error,
    loadEvents,
    getEventsByStatus,
    hasUserParticipated,
    getUserParticipation,
    submitParticipation
  };
};

// Hook for event leaderboard
export const useEventLeaderboard = (eventId: number | null) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userPosition, setUserPosition] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const loadLeaderboard = useCallback(async () => {
    if (!eventId) return;

    try {
      setLoading(true);

      const { data, error } = await supabase.rpc('get_event_leaderboard', {
        target_event_id: eventId,
        limit_count: 10
      });

      if (error) {
        throw error;
      }

      setLeaderboard(data || []);

      // Find user's position
      if (user) {
        const userEntry = data?.find((entry: LeaderboardEntry) => entry.user_id === user.id);
        setUserPosition(userEntry?.rank_position || null);
      }
    } catch (err) {
      console.error('Error loading leaderboard:', err);
    } finally {
      setLoading(false);
    }
  }, [eventId, user]);

  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  return {
    leaderboard,
    userPosition,
    loading,
    refreshLeaderboard: loadLeaderboard
  };
};

// Hook for user event history
export const useUserEventHistory = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<UserEventHistory[]>([]);
  const [totalXpEarned, setTotalXpEarned] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadHistory = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);

      const { data, error } = await supabase.rpc('get_user_event_history', {
        target_user_id: user.id
      });

      if (error) {
        throw error;
      }

      setHistory(data || []);

      // Calculate total XP earned from events
      const totalXp = (data || []).reduce((sum: number, event: UserEventHistory) => sum + event.xp_earned, 0);
      setTotalXpEarned(totalXp);
    } catch (err) {
      console.error('Error loading event history:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return {
    history,
    totalXpEarned,
    loading,
    refreshHistory: loadHistory
  };
};

// Hook for real-time event status updates
export const useEventTimer = (event: WeeklyEvent | null) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isActive, setIsActive] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);

  useEffect(() => {
    if (!event) return;

    const updateTimer = () => {
      const now = new Date();
      const startTime = new Date(event.start_time);
      const endTime = new Date(startTime.getTime() + event.duration_minutes * 60000);

      const timeToStart = startTime.getTime() - now.getTime();
      const timeToEnd = endTime.getTime() - now.getTime();

      setHasStarted(now >= startTime);
      setHasEnded(now > endTime);
      setIsActive(now >= startTime && now <= endTime && event.is_enabled);

      if (now < startTime) {
        // Event hasn't started yet
        setTimeRemaining(Math.max(0, Math.floor(timeToStart / 1000)));
      } else if (now <= endTime && event.is_enabled) {
        // Event is active
        setTimeRemaining(Math.max(0, Math.floor(timeToEnd / 1000)));
      } else {
        // Event has ended
        setTimeRemaining(0);
      }
    };

    // Update immediately
    updateTimer();

    // Update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [event]);

  return {
    timeRemaining,
    isActive,
    hasStarted,
    hasEnded
  };
};

// Hook for admin events management (fetches ALL events)
export const useAdminWeeklyEvents = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<WeeklyEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all events (enabled and disabled) for admin
  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Update event statuses first
      await supabase.rpc('update_event_status');

      // Fetch ALL events (not just enabled ones)
      const { data, error: fetchError } = await supabase
        .from('weekly_events')
        .select('*')
        .order('start_time', { ascending: false }); // Most recent first for admin

      if (fetchError) {
        throw fetchError;
      }

      setEvents(data || []);
    } catch (err) {
      console.error('Error loading admin events:', err);
      setError('حدث خطأ في تحميل الفعاليات');
    } finally {
      setLoading(false);
    }
  }, []);

  // Get events by status
  const getEventsByStatus = useCallback((status: 'upcoming' | 'active' | 'finished') => {
    return events.filter(event => event.status === status);
  }, [events]);

  // Delete event
  const deleteEvent = useCallback(async (eventId: number): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('weekly_events')
        .delete()
        .eq('id', eventId);

      if (error) {
        throw error;
      }

      // Reload events after deletion
      await loadEvents();
      return true;
    } catch (err) {
      console.error('Error deleting event:', err);
      return false;
    }
  }, [loadEvents]);

  // Toggle event enabled status
  const toggleEventStatus = useCallback(async (eventId: number, isEnabled: boolean): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('weekly_events')
        .update({ is_enabled: isEnabled })
        .eq('id', eventId);

      if (error) {
        throw error;
      }

      // Reload events after update
      await loadEvents();
      return true;
    } catch (err) {
      console.error('Error updating event status:', err);
      return false;
    }
  }, [loadEvents]);

  // Load events on mount
  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  return {
    events,
    loading,
    error,
    loadEvents,
    getEventsByStatus,
    deleteEvent,
    toggleEventStatus
  };
};
