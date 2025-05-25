import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calendar,
  Clock,
  Trophy,
  Users,
  Plus,
  Edit,
  Trash2,
  Eye,
  Settings,
  BarChart3,
  Target,
  BookOpen,
  Calculator,
  Play,
  Pause,
  CheckCircle,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAdminWeeklyEvents } from '@/hooks/useWeeklyEvents';
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

const AdminWeeklyEvents: React.FC = () => {
  const navigate = useNavigate();
  const { events, loading, getEventsByStatus, deleteEvent, toggleEventStatus } = useAdminWeeklyEvents();
  const [selectedTab, setSelectedTab] = useState<'all' | 'upcoming' | 'active' | 'finished'>('all');

  const allEvents = events;
  const upcomingEvents = getEventsByStatus('upcoming');
  const activeEvents = getEventsByStatus('active');
  const finishedEvents = getEventsByStatus('finished');

  const getTabEvents = () => {
    switch (selectedTab) {
      case 'upcoming': return upcomingEvents;
      case 'active': return activeEvents;
      case 'finished': return finishedEvents;
      default: return allEvents;
    }
  };

  const handleCreateEvent = () => {
    navigate('/admin/weekly-events/create');
  };

  const handleEditEvent = (eventId: number) => {
    navigate(`/admin/weekly-events/${eventId}/edit`);
  };

  const handleManageQuestions = (eventId: number) => {
    navigate(`/admin/weekly-events/${eventId}/questions`);
  };

  const handleViewResults = (eventId: number) => {
    navigate(`/admin/weekly-events/${eventId}/results`);
  };

  const handleDeleteEvent = async (eventId: number) => {
    if (confirm('هل أنت متأكد من حذف هذه الفعالية؟ سيتم حذف جميع الأسئلة والمشاركات المرتبطة بها.')) {
      try {
        const success = await deleteEvent(eventId);
        if (success) {
          toast.success('تم حذف الفعالية بنجاح');
        } else {
          toast.error('حدث خطأ في حذف الفعالية');
        }
      } catch (error) {
        toast.error('حدث خطأ في حذف الفعالية');
      }
    }
  };

  const handleToggleEventStatus = async (eventId: number, currentStatus: boolean) => {
    try {
      const success = await toggleEventStatus(eventId, !currentStatus);
      if (success) {
        toast.success(currentStatus ? 'تم إلغاء تفعيل الفعالية' : 'تم تفعيل الفعالية');
      } else {
        toast.error('حدث خطأ في تحديث حالة الفعالية');
      }
    } catch (error) {
      toast.error('حدث خطأ في تحديث حالة الفعالية');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري تحميل الفعاليات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate('/weekly-events')}
                variant="outline"
                size="icon"
                className="rounded-full"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold mb-2">إدارة الفعاليات الأسبوعية</h1>
                <p className="text-muted-foreground">إنشاء وإدارة الفعاليات التعليمية الأسبوعية</p>
              </div>
            </div>
            <Button
              onClick={handleCreateEvent}
              className="bg-gradient-to-r from-primary to-accent text-black font-bold px-6 py-3 rounded-xl"
            >
              <Plus className="w-5 h-5 mr-2" />
              إنشاء فعالية جديدة
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20">
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Calendar className="w-5 h-5 text-blue-500" />
                </div>
                <div className="text-2xl font-bold text-blue-500">{allEvents.length}</div>
                <div className="text-sm text-muted-foreground">إجمالي الفعاليات</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20">
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Play className="w-5 h-5 text-green-500" />
                </div>
                <div className="text-2xl font-bold text-green-500">{activeEvents.length}</div>
                <div className="text-sm text-muted-foreground">فعاليات نشطة</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20">
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Clock className="w-5 h-5 text-orange-500" />
                </div>
                <div className="text-2xl font-bold text-orange-500">{upcomingEvents.length}</div>
                <div className="text-sm text-muted-foreground">فعاليات قادمة</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20">
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="w-5 h-5 text-purple-500" />
                </div>
                <div className="text-2xl font-bold text-purple-500">{finishedEvents.length}</div>
                <div className="text-sm text-muted-foreground">فعاليات منتهية</div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Events Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as any)} dir="rtl" className="w-full">
            <div className="flex justify-center mb-6">
              <TabsList className="grid grid-cols-4 w-full max-w-3xl bg-transparent p-2">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-black font-bold py-2 px-4 rounded-lg"
                >
                  الكل ({allEvents.length})
                </TabsTrigger>
                <TabsTrigger
                  value="active"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white font-bold py-2 px-4 rounded-lg"
                >
                  نشطة ({activeEvents.length})
                </TabsTrigger>
                <TabsTrigger
                  value="upcoming"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white font-bold py-2 px-4 rounded-lg"
                >
                  قادمة ({upcomingEvents.length})
                </TabsTrigger>
                <TabsTrigger
                  value="finished"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-500 data-[state=active]:to-gray-600 data-[state=active]:text-white font-bold py-2 px-4 rounded-lg"
                >
                  منتهية ({finishedEvents.length})
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Events List */}
            <div className="space-y-4">
              {getTabEvents().length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center">
                    <Calendar className="w-10 h-10 text-primary/50" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">لا توجد فعاليات</h3>
                  <p className="text-muted-foreground mb-4">ابدأ بإنشاء فعالية جديدة</p>
                  <Button
                    onClick={handleCreateEvent}
                    className="bg-gradient-to-r from-primary to-accent text-black font-bold"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    إنشاء فعالية
                  </Button>
                </div>
              ) : (
                getTabEvents().map((event, index) => (
                  <AdminEventCard
                    key={event.id}
                    event={event}
                    index={index}
                    onEdit={handleEditEvent}
                    onManageQuestions={handleManageQuestions}
                    onViewResults={handleViewResults}
                    onDelete={handleDeleteEvent}
                    onToggleStatus={handleToggleEventStatus}
                  />
                ))
              )}
            </div>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

// Admin Event Card Component
interface AdminEventCardProps {
  event: WeeklyEvent;
  index: number;
  onEdit: (eventId: number) => void;
  onManageQuestions: (eventId: number) => void;
  onViewResults: (eventId: number) => void;
  onDelete: (eventId: number) => void;
  onToggleStatus: (eventId: number, currentStatus: boolean) => void;
}

const AdminEventCard: React.FC<AdminEventCardProps> = ({
  event,
  index,
  onEdit,
  onManageQuestions,
  onViewResults,
  onDelete,
  onToggleStatus
}) => {
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
    switch (event.status) {
      case 'active': return 'bg-green-500';
      case 'upcoming': return 'bg-blue-500';
      case 'finished': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Card className="bg-gradient-to-br from-card/90 to-card/60 border-0 rounded-2xl backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl">
                <CategoryIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">{event.title}</h3>
                <div className="flex items-center gap-2">
                  <Badge className={`${getStatusColor()} text-white`}>
                    {getEventStatusLabel(event.status)}
                  </Badge>
                  <Badge variant="outline">
                    {getCategoryLabel(event.category)}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">نقاط الخبرة</div>
              <div className="text-lg font-bold text-primary">{event.xp_reward}</div>
            </div>
          </div>

          {event.description && (
            <p className="text-muted-foreground mb-4 leading-relaxed">
              {event.description}
            </p>
          )}

          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span>{format(new Date(event.start_time), 'dd/MM/yyyy', { locale: ar })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span>{format(new Date(event.start_time), 'HH:mm', { locale: ar })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-primary" />
              <span>{formatDuration(event.duration_minutes)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <span>{event.is_enabled ? 'مفعلة' : 'معطلة'}</span>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={() => onEdit(event.id)}
              variant="outline"
              size="sm"
              className="flex-1 min-w-[100px]"
            >
              <Edit className="w-4 h-4 mr-2" />
              تعديل
            </Button>
            <Button
              onClick={() => onManageQuestions(event.id)}
              variant="outline"
              size="sm"
              className="flex-1 min-w-[100px]"
            >
              <Settings className="w-4 h-4 mr-2" />
              الأسئلة
            </Button>
            <Button
              onClick={() => onViewResults(event.id)}
              variant="outline"
              size="sm"
              className="flex-1 min-w-[100px]"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              النتائج
            </Button>
            <Button
              onClick={() => onToggleStatus(event.id, event.is_enabled)}
              variant={event.is_enabled ? "secondary" : "default"}
              size="sm"
              className="flex-1 min-w-[100px]"
            >
              {event.is_enabled ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  إلغاء التفعيل
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  تفعيل
                </>
              )}
            </Button>
            <Button
              onClick={() => onDelete(event.id)}
              variant="destructive"
              size="sm"
              className="flex-1 min-w-[100px]"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              حذف
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AdminWeeklyEvents;
