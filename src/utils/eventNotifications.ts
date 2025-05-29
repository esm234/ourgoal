// إعدادات إشعارات الفعاليات الأسبوعية - نظام بسيط بدون استدعاء قاعدة البيانات
export const WEEKLY_EVENT_NOTIFICATION_CONFIG = {
  enabled: true, // تفعيل/إلغاء تفعيل نظام الإشعارات (غير هذا إلى false لإيقاف الإشعارات)

  // نوع الإشعار: 'active' للفعاليات النشطة، 'upcoming' للفعاليات القادمة، null لإيقاف
  currentEventType: 'active' as 'active' | 'active' | null,

  // رسالة الإشعار المخصصة
  message: 'يوجد فعالية أسبوعية متاحة الآن!',

  // إعدادات التصميم
  autoHide: false, // إخفاء تلقائي بعد فترة
  autoHideDelay: 7000, // 15 ثانية
  dismissible: true, // إمكانية إخفاء الإشعار
};

// معرف فريد للإشعار الحالي (يتغير عند تغيير الإعدادات)
export const getCurrentNotificationId = (): string => {
  return `weekly-event-${WEEKLY_EVENT_NOTIFICATION_CONFIG.currentEventType}`;
};

// فحص ما إذا كان يجب إظهار الإشعار
export const shouldShowNotification = (): boolean => {
  if (!WEEKLY_EVENT_NOTIFICATION_CONFIG.enabled || !WEEKLY_EVENT_NOTIFICATION_CONFIG.currentEventType) {
    return false;
  }

  const notificationId = getCurrentNotificationId();
  return !isNotificationDismissed(notificationId);
};

// فحص ما إذا كان الإشعار مخفي من قبل المستخدم
export const isNotificationDismissed = (notificationId: string): boolean => {
  const dismissedNotifications = localStorage.getItem('dismissed-weekly-event-notifications');
  if (!dismissedNotifications) return false;

  try {
    const dismissed = JSON.parse(dismissedNotifications);
    return dismissed.includes(notificationId);
  } catch {
    return false;
  }
};

// إخفاء الإشعار
export const dismissNotification = (notificationId: string): void => {
  const dismissedNotifications = localStorage.getItem('dismissed-weekly-event-notifications');
  let dismissed: string[] = [];

  try {
    dismissed = dismissedNotifications ? JSON.parse(dismissedNotifications) : [];
  } catch {
    dismissed = [];
  }

  if (!dismissed.includes(notificationId)) {
    dismissed.push(notificationId);
    localStorage.setItem('dismissed-weekly-event-notifications', JSON.stringify(dismissed));
  }
};

// إعادة إظهار جميع الإشعارات المخفية
export const resetDismissedNotifications = (): void => {
  localStorage.removeItem('dismissed-weekly-event-notifications');
};

// الحصول على لون حسب نوع الإشعار
export const getNotificationColor = (): string => {
  switch (WEEKLY_EVENT_NOTIFICATION_CONFIG.currentEventType) {
    case 'active':
      return 'from-green-500 to-green-600';
    case 'upcoming':
      return 'from-orange-500 to-red-500';
    default:
      return 'from-blue-500 to-purple-500';
  }
};

// الحصول على أيقونة حسب نوع الإشعار
export const getNotificationIcon = (): string => {
  switch (WEEKLY_EVENT_NOTIFICATION_CONFIG.currentEventType) {
    case 'active':
      return '🎯';
    case 'upcoming':
      return '⏰';
    default:
      return '📅';
  }
};

// الحصول على نص حالة الإشعار
export const getNotificationStatusText = (): string => {
  switch (WEEKLY_EVENT_NOTIFICATION_CONFIG.currentEventType) {
    case 'active':
      return 'نشطة الآن';
    case 'upcoming':
      return 'تبدأ قريباً';
    default:
      return 'متاحة';
  }
};
