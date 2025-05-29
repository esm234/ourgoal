import { WeeklyEvent, isEventActive as isWeeklyEventActive, isEventUpcoming } from '@/types/weeklyEvents';

// إعدادات إشعارات الفعاليات الأسبوعية - يمكن تعديلها بسهولة
export const WEEKLY_EVENT_NOTIFICATION_CONFIG = {
  enabled: true, // تفعيل/إلغاء تفعيل نظام الإشعارات (غير هذا إلى false لإيقاف الإشعارات)
  showForActiveEvents: true, // إظهار إشعار للفعاليات النشطة
  showForUpcomingEvents: true, // إظهار إشعار للفعاليات القادمة (خلال ساعة)
  upcomingThresholdMinutes: 60, // إظهار الإشعار قبل بدء الفعالية بـ 60 دقيقة
  autoHide: false, // إخفاء تلقائي بعد فترة
  autoHideDelay: 15000, // 15 ثانية
};

// فحص ما إذا كانت الفعالية قادمة قريباً (خلال الوقت المحدد)
export const isEventUpcomingSoon = (event: WeeklyEvent): boolean => {
  if (!isEventUpcoming(event)) return false;

  const now = new Date();
  const startTime = new Date(event.start_time);
  const timeDiffMinutes = (startTime.getTime() - now.getTime()) / (1000 * 60);

  return timeDiffMinutes <= WEEKLY_EVENT_NOTIFICATION_CONFIG.upcomingThresholdMinutes;
};

// الحصول على الفعالية التي يجب إظهار إشعار لها
export const getEventForNotification = (events: WeeklyEvent[]): WeeklyEvent | null => {
  if (!WEEKLY_EVENT_NOTIFICATION_CONFIG.enabled || !events.length) {
    return null;
  }

  // البحث عن فعالية نشطة أولاً
  if (WEEKLY_EVENT_NOTIFICATION_CONFIG.showForActiveEvents) {
    const activeEvent = events.find(event => isWeeklyEventActive(event));
    if (activeEvent) return activeEvent;
  }

  // البحث عن فعالية قادمة قريباً
  if (WEEKLY_EVENT_NOTIFICATION_CONFIG.showForUpcomingEvents) {
    const upcomingEvent = events.find(event => isEventUpcomingSoon(event));
    if (upcomingEvent) return upcomingEvent;
  }

  return null;
};

// فحص ما إذا كان الإشعار مخفي من قبل المستخدم
export const isEventDismissed = (eventId: number): boolean => {
  const dismissedEvents = localStorage.getItem('dismissed-weekly-event-notifications');
  if (!dismissedEvents) return false;

  try {
    const dismissed = JSON.parse(dismissedEvents);
    return dismissed.includes(eventId);
  } catch {
    return false;
  }
};

// إخفاء الإشعار
export const dismissEvent = (eventId: number): void => {
  const dismissedEvents = localStorage.getItem('dismissed-weekly-event-notifications');
  let dismissed: number[] = [];

  try {
    dismissed = dismissedEvents ? JSON.parse(dismissedEvents) : [];
  } catch {
    dismissed = [];
  }

  if (!dismissed.includes(eventId)) {
    dismissed.push(eventId);
    localStorage.setItem('dismissed-weekly-event-notifications', JSON.stringify(dismissed));
  }
};

// إعادة إظهار جميع الإشعارات المخفية
export const resetDismissedEvents = (): void => {
  localStorage.removeItem('dismissed-weekly-event-notifications');
};

// الحصول على لون حسب حالة الفعالية
export const getEventStatusColor = (event: WeeklyEvent): string => {
  if (isWeeklyEventActive(event)) {
    return 'from-green-500 to-green-600';
  } else if (isEventUpcomingSoon(event)) {
    return 'from-orange-500 to-red-500';
  } else {
    return 'from-blue-500 to-purple-500';
  }
};

// الحصول على أيقونة حسب فئة الفعالية
export const getEventCategoryIcon = (category: WeeklyEvent['category']): string => {
  switch (category) {
    case 'verbal':
      return '📝';
    case 'quantitative':
      return '🔢';
    case 'mixed':
      return '🎯';
    default:
      return '📅';
  }
};

// الحصول على نص حالة الفعالية
export const getEventStatusText = (event: WeeklyEvent): string => {
  if (isWeeklyEventActive(event)) {
    return 'نشطة الآن';
  } else if (isEventUpcomingSoon(event)) {
    return 'تبدأ قريباً';
  } else {
    return 'قادمة';
  }
};

// الحصول على وقت بداية الفعالية بتنسيق مقروء
export const getEventTimeText = (event: WeeklyEvent): string => {
  const startTime = new Date(event.start_time);
  const now = new Date();

  if (isWeeklyEventActive(event)) {
    const endTime = new Date(startTime.getTime() + event.duration_minutes * 60000);
    const remainingMinutes = Math.ceil((endTime.getTime() - now.getTime()) / (1000 * 60));
    return `متبقي ${remainingMinutes} دقيقة`;
  } else if (isEventUpcomingSoon(event)) {
    const minutesUntilStart = Math.ceil((startTime.getTime() - now.getTime()) / (1000 * 60));
    return `تبدأ خلال ${minutesUntilStart} دقيقة`;
  } else {
    return startTime.toLocaleString('ar-EG', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
};
