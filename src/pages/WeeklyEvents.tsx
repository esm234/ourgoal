import React, { useState } from 'react';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calendar,
  Clock,
  Trophy,
  Users,
  Star,
  Play,
  CheckCircle,
  Timer,
  Target,
  BookOpen,
  Calculator,
  Zap,
  Settings
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useWeeklyEvents, useEventTimer } from '@/hooks/useWeeklyEvents';
import {
  WeeklyEvent,
  getEventStatusLabel,
  getCategoryLabel,
  formatDuration,
  formatTimeRemaining,
  isEventActive,
  isEventUpcoming,
  isEventFinished
} from '@/types/weeklyEvents';

const WeeklyEvents: React.FC = () => {
  const { user, isLoggedIn, role } = useAuth();
  const navigate = useNavigate();
  const { events, loading, getEventsByStatus } = useWeeklyEvents();
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'active' | 'finished'>('active');

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  const upcomingEvents = getEventsByStatus('upcoming');
  const activeEvents = getEventsByStatus('active');
  const finishedEvents = getEventsByStatus('finished');

  // Check if user is admin
  const isAdmin = role === 'admin';

  const weeklyEventsStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "الفعاليات الأسبوعية - اور جول",
    "description": "شارك في الفعاليات التعليمية الأسبوعية واختبر مهاراتك في اختبار القدرات مع طلاب آخرين",
    "url": "https://ourgoal.pages.dev/weekly-events",
    "mainEntity": {
      "@type": "Event",
      "name": "فعاليات اختبار القدرات الأسبوعية",
      "description": "مسابقات تعليمية أسبوعية في اختبار القدرات",
      "organizer": {
        "@type": "Organization",
        "name": "اور جول - Our Goal"
      }
    }
  };

  if (loading) {
    return (
      <Layout>
        <SEO
          title="الفعاليات الأسبوعية | اور جول - Our Goal"
          description="شارك في الفعاليات التعليمية الأسبوعية واختبر مهاراتك في اختبار القدرات مع طلاب آخرين. اكسب نقاط الخبرة وتنافس في المتصدرين."
          keywords="فعاليات أسبوعية, مسابقات تعليمية, اختبار القدرات, تنافس, نقاط خبرة, متصدرين, اور جول"
          url="/weekly-events"
          structuredData={weeklyEventsStructuredData}
        />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">جاري تحميل الفعاليات...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO
        title="الفعاليات الأسبوعية | اور جول - Our Goal"
        description="شارك في الفعاليات التعليمية الأسبوعية واختبر مهاراتك في اختبار القدرات مع طلاب آخرين. اكسب نقاط الخبرة وتنافس في المتصدرين."
        keywords="فعاليات أسبوعية, مسابقات تعليمية, اختبار القدرات, تنافس, نقاط خبرة, متصدرين, اور جول"
        url="/weekly-events"
        structuredData={weeklyEventsStructuredData}
      />

      <section className="py-20 px-4 min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1"></div>
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary/10 to-accent/10 px-6 py-3 rounded-full">
                <Trophy className="w-6 h-6 text-primary" />
                <span className="font-bold text-primary">الفعاليات الأسبوعية</span>
              </div>
              <div className="flex-1 flex justify-end">
                {isAdmin && (
                  <Button
                    onClick={() => navigate('/admin/weekly-events')}
                    variant="outline"
                    className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 hover:bg-primary/20"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    إدارة الفعاليات
                  </Button>
                )}
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              تحدى نفسك وتنافس مع الآخرين
            </h1>

            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              شارك في الفعاليات التعليمية الأسبوعية واختبر مهاراتك في اختبار القدرات.
              اكسب نقاط الخبرة وتنافس للوصول إلى المتصدرين!
            </p>
          </motion.div>

          {/* Events Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as any)} dir="rtl" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="grid grid-cols-3 w-full max-w-2xl bg-transparent p-2">
                  <TabsTrigger
                    value="active"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white font-bold py-3 px-4 rounded-xl transition-all duration-300"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    نشطة ({activeEvents.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="upcoming"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white font-bold py-3 px-4 rounded-xl transition-all duration-300"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    قادمة ({upcomingEvents.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="finished"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-500 data-[state=active]:to-gray-600 data-[state=active]:text-white font-bold py-3 px-4 rounded-xl transition-all duration-300"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    منتهية ({finishedEvents.length})
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Active Events */}
              <TabsContent value="active" className="mt-0">
                <EventsList
                  events={activeEvents}
                  type="active"
                  emptyMessage="لا توجد فعاليات نشطة حالياً"
                  emptyDescription="تابع الصفحة للحصول على آخر التحديثات حول الفعاليات القادمة"
                />
              </TabsContent>

              {/* Upcoming Events */}
              <TabsContent value="upcoming" className="mt-0">
                <EventsList
                  events={upcomingEvents}
                  type="upcoming"
                  emptyMessage="لا توجد فعاليات قادمة"
                  emptyDescription="سيتم الإعلان عن الفعاليات الجديدة قريباً"
                />
              </TabsContent>

              {/* Finished Events */}
              <TabsContent value="finished" className="mt-0">
                <EventsList
                  events={finishedEvents}
                  type="finished"
                  emptyMessage="لا توجد فعاليات منتهية"
                  emptyDescription="ستظهر هنا الفعاليات التي انتهت"
                />
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

// Events List Component
interface EventsListProps {
  events: WeeklyEvent[];
  type: 'active' | 'upcoming' | 'finished';
  emptyMessage: string;
  emptyDescription: string;
}

const EventsList: React.FC<EventsListProps> = ({ events, type, emptyMessage, emptyDescription }) => {
  if (events.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center">
          <Calendar className="w-12 h-12 text-primary/50" />
        </div>
        <h3 className="text-2xl font-bold mb-2">{emptyMessage}</h3>
        <p className="text-muted-foreground">{emptyDescription}</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event, index) => (
        <EventCard key={event.id} event={event} type={type} index={index} />
      ))}
    </div>
  );
};

// Event Card Component
interface EventCardProps {
  event: WeeklyEvent;
  type: 'active' | 'upcoming' | 'finished';
  index: number;
}

const EventCard: React.FC<EventCardProps> = ({ event, type, index }) => {
  const navigate = useNavigate();
  const { timeRemaining, isActive } = useEventTimer(event);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'verbal': return BookOpen;
      case 'quantitative': return Calculator;
      case 'mixed': return Target;
      default: return Target;
    }
  };

  const CategoryIcon = getCategoryIcon(event.category);

  const getStatusColor = () => {
    switch (type) {
      case 'active': return 'bg-green-500';
      case 'upcoming': return 'bg-blue-500';
      case 'finished': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const handleEventClick = () => {
    if (type === 'active' && isActive) {
      navigate(`/weekly-events/${event.id}/test`);
    } else if (type === 'finished') {
      navigate(`/weekly-events/${event.id}/results`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Card className="bg-gradient-to-br from-card/90 to-card/60 border-0 rounded-3xl backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl">
                <CategoryIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <Badge className={`${getStatusColor()} text-white`}>
                  {getEventStatusLabel(event.status)}
                </Badge>
              </div>
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="w-4 h-4" />
                <span>{event.xp_reward} XP</span>
              </div>
            </div>
          </div>

          <CardTitle className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
            {event.title}
          </CardTitle>

          {event.description && (
            <p className="text-muted-foreground text-sm leading-relaxed">
              {event.description}
            </p>
          )}
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-4">
            {/* Event Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                <span>{getCategoryLabel(event.category)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-primary" />
                <span>{formatDuration(event.duration_minutes)}</span>
              </div>
            </div>

            {/* Time Information */}
            <div className="p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl">
              <div className="flex items-center gap-2 text-sm mb-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="font-medium">
                  {format(new Date(event.start_time), 'EEEE، dd MMMM yyyy', { locale: ar })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-primary" />
                <span>
                  {format(new Date(event.start_time), 'HH:mm', { locale: ar })}
                </span>
                {type === 'active' && timeRemaining > 0 && (
                  <span className="mr-auto text-green-600 font-bold">
                    متبقي: {formatTimeRemaining(timeRemaining)}
                  </span>
                )}
              </div>
            </div>

            {/* Action Button */}
            <Button
              onClick={handleEventClick}
              disabled={type === 'upcoming' || (type === 'active' && !isActive)}
              className={`w-full py-3 rounded-xl font-bold transition-all duration-300 ${
                type === 'active' && isActive
                  ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
                  : type === 'finished'
                  ? 'bg-gradient-to-r from-primary to-accent text-black hover:shadow-lg'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              {type === 'active' && isActive ? (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  ابدأ الاختبار
                </>
              ) : type === 'finished' ? (
                <>
                  <Trophy className="w-5 h-5 mr-2" />
                  عرض النتائج
                </>
              ) : (
                <>
                  <Clock className="w-5 h-5 mr-2" />
                  لم يبدأ بعد
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WeeklyEvents;
