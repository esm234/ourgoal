import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trophy, Target, Clock, Users, Star, Medal } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useEventLeaderboard } from '@/hooks/useWeeklyEvents';
import { WeeklyEvent, EventParticipation, getCategoryLabel } from '@/types/weeklyEvents';

const EventResults: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState<WeeklyEvent | null>(null);
  const [participation, setParticipation] = useState<EventParticipation | null>(null);
  const [loading, setLoading] = useState(true);
  const { leaderboard, userPosition, loading: leaderboardLoading } = useEventLeaderboard(
    eventId ? parseInt(eventId) : null
  );

  useEffect(() => {
    const loadResults = async () => {
      if (!eventId || !user) return;

      try {
        setLoading(true);

        // Load event details
        const { data: eventData, error: eventError } = await supabase
          .from('weekly_events')
          .select('*')
          .eq('id', eventId)
          .single();

        if (eventError || !eventData) {
          toast.error('الفعالية غير موجودة');
          navigate('/weekly-events');
          return;
        }

        setEvent(eventData);

        // Load user participation
        const { data: participationData, error: participationError } = await supabase
          .from('event_participations')
          .select('*')
          .eq('event_id', eventId)
          .eq('user_id', user.id)
          .single();

        if (participationError || !participationData) {
          toast.error('لم تشارك في هذه الفعالية');
          navigate('/weekly-events');
          return;
        }

        setParticipation(participationData);
      } catch (error) {
        console.error('Error loading results:', error);
        toast.error('حدث خطأ في تحميل النتائج');
        navigate('/weekly-events');
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [eventId, user, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">جاري تحميل النتائج...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!event || !participation) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">خطأ في تحميل النتائج</h2>
            <Button onClick={() => navigate('/weekly-events')}>
              العودة للفعاليات
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const percentage = Math.round((participation.score / participation.total_questions) * 100);
  const getRankIcon = (position: number) => {
    switch (position) {
      case 1: return <Medal className="w-6 h-6 text-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Medal className="w-6 h-6 text-amber-600" />;
      default: return <Trophy className="w-6 h-6 text-primary" />;
    }
  };

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    if (percentage >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getPerformanceMessage = (percentage: number) => {
    if (percentage >= 90) return 'أداء ممتاز! 🎉';
    if (percentage >= 80) return 'أداء جيد جداً! 👏';
    if (percentage >= 70) return 'أداء جيد! 👍';
    if (percentage >= 60) return 'أداء مقبول 📚';
    return 'يحتاج تحسين 💪';
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              onClick={() => navigate('/weekly-events')}
              variant="outline"
              size="icon"
              className="rounded-full"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">نتائج الفعالية</h1>
              <p className="text-muted-foreground">{event.title}</p>
            </div>
          </div>

          {/* Results Summary */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Score Card */}
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Trophy className="w-6 h-6 text-primary" />
                  نتيجتك
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className={`text-6xl font-bold mb-2 ${getPerformanceColor(percentage)}`}>
                  {percentage}%
                </div>
                <div className="text-lg mb-2">
                  {participation.score} من {participation.total_questions}
                </div>
                <div className="text-primary font-medium">
                  {getPerformanceMessage(percentage)}
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-6 h-6 text-primary" />
                  إحصائيات الأداء
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">الفئة:</span>
                  <Badge variant="outline">{getCategoryLabel(event.category)}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">الوقت المستغرق:</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{participation.time_taken_minutes} دقيقة</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">نقاط الخبرة:</span>
                  <div className="flex items-center gap-1 text-primary font-bold">
                    <Star className="w-4 h-4" />
                    <span>{participation.xp_earned} XP</span>
                  </div>
                </div>
                {userPosition && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">ترتيبك:</span>
                    <div className="flex items-center gap-1">
                      {getRankIcon(userPosition)}
                      <span className="font-bold">#{userPosition}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-6 h-6 text-primary" />
                المتصدرون
              </CardTitle>
            </CardHeader>
            <CardContent>
              {leaderboardLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">جاري تحميل المتصدرين...</p>
                </div>
              ) : leaderboard.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">لا توجد نتائج متاحة</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {leaderboard.map((entry, index) => (
                    <motion.div
                      key={entry.user_id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        entry.user_id === user?.id
                          ? 'bg-primary/10 border-primary'
                          : 'bg-muted/50 border-border'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {getRankIcon(entry.rank_position)}
                        <div>
                          <div className="font-medium">
                            {entry.user_id === user?.id ? 'أنت' : entry.username}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {entry.score}/{entry.total_questions} ({Math.round((entry.score / entry.total_questions) * 100)}%)
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary">#{entry.rank_position}</div>
                        <div className="text-sm text-muted-foreground">{entry.xp_earned} XP</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-center mt-8">
            <Button
              onClick={() => navigate('/weekly-events')}
              className="bg-gradient-to-r from-primary to-accent text-black font-bold px-8"
            >
              العودة للفعاليات
            </Button>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default EventResults;
