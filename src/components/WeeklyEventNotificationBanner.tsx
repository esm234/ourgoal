import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Clock, Play, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { WeeklyEvent, isEventActive as isWeeklyEventActive } from '@/types/weeklyEvents';
import {
  getEventForNotification,
  isEventDismissed,
  dismissEvent,
  getEventStatusColor,
  getEventCategoryIcon,
  getEventStatusText,
  getEventTimeText,
  WEEKLY_EVENT_NOTIFICATION_CONFIG
} from '@/utils/eventNotifications';

interface WeeklyEventNotificationBannerProps {
  events: WeeklyEvent[];
}

const WeeklyEventNotificationBanner: React.FC<WeeklyEventNotificationBannerProps> = ({ events }) => {
  const navigate = useNavigate();
  const [currentEvent, setCurrentEvent] = useState<WeeklyEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // تحديث الفعالية الحالية
  useEffect(() => {
    const event = getEventForNotification(events);

    if (event && !isEventDismissed(event.id)) {
      setCurrentEvent(event);
      setIsVisible(true);
      setIsDismissed(false);
    } else {
      setCurrentEvent(null);
      setIsVisible(false);
    }
  }, [events]);

  // إضافة padding للـ body عند وجود إشعار
  useEffect(() => {
    if (isVisible) {
      document.body.style.paddingTop = '80px';
    } else {
      document.body.style.paddingTop = '0px';
    }

    // تنظيف عند إلغاء المكون
    return () => {
      document.body.style.paddingTop = '0px';
    };
  }, [isVisible]);

  // إخفاء تلقائي إذا كان مفعل
  useEffect(() => {
    if (isVisible && WEEKLY_EVENT_NOTIFICATION_CONFIG.autoHide) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, WEEKLY_EVENT_NOTIFICATION_CONFIG.autoHideDelay);

      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const handleDismiss = () => {
    if (currentEvent) {
      dismissEvent(currentEvent.id);
      setIsDismissed(true);
      setIsVisible(false);
    }
  };

  const handleEventClick = () => {
    if (currentEvent) {
      // إخفاء الإشعار عند النقر
      dismissEvent(currentEvent.id);
      setIsDismissed(true);
      setIsVisible(false);

      if (isWeeklyEventActive(currentEvent)) {
        // إذا كانت الفعالية نشطة، اذهب مباشرة للاختبار
        navigate(`/weekly-events/${currentEvent.id}/test`);
      } else {
        // إذا كانت قادمة، اذهب لصفحة الفعاليات
        navigate('/weekly-events');
      }
    }
  };

  if (!isVisible || !currentEvent || isDismissed) {
    return null;
  }

  const isActive = isWeeklyEventActive(currentEvent);
  const statusColor = getEventStatusColor(currentEvent);
  const categoryIcon = getEventCategoryIcon(currentEvent.category);
  const statusText = getEventStatusText(currentEvent);
  const timeText = getEventTimeText(currentEvent);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -100 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-background/95 to-background/90 backdrop-blur-md border-b border-primary/20 shadow-lg"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* محتوى الإشعار */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {/* أيقونة الفعالية */}
              <div className={`w-12 h-12 bg-gradient-to-br ${statusColor} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                <span className="text-white text-xl">{categoryIcon}</span>
              </div>

              {/* تفاصيل الفعالية */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-foreground truncate">
                    {currentEvent.title}
                  </h3>
                  <Badge
                    className={`${
                      isActive
                        ? 'bg-green-500/20 text-green-700 border-green-500/30'
                        : 'bg-orange-500/20 text-orange-700 border-orange-500/30'
                    } text-xs px-2 py-1 border`}
                  >
                    {statusText}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{timeText}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Trophy className="w-4 h-4" />
                    <span>{currentEvent.xp_reward} نقطة خبرة</span>
                  </div>
                </div>
              </div>
            </div>

            {/* أزرار التحكم */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                onClick={handleEventClick}
                className={`bg-gradient-to-r ${statusColor} hover:opacity-90 text-white font-bold px-4 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl`}
                size="sm"
              >
                <div className="flex items-center gap-2">
                  {isActive ? (
                    <>
                      <Play className="w-4 h-4" />
                      <span className="hidden sm:inline">ابدأ الآن</span>
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4" />
                      <span className="hidden sm:inline">عرض التفاصيل</span>
                    </>
                  )}
                </div>
              </Button>

              <Button
                onClick={handleDismiss}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground p-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* شريط التقدم للفعاليات النشطة */}
        {isActive && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-1 bg-gradient-to-r from-green-400 to-green-600 origin-left"
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default WeeklyEventNotificationBanner;
