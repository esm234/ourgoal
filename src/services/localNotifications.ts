// =====================================================
// LOCAL NOTIFICATIONS SERVICE - خدمة الإشعارات المحلية
// إدارة الإشعارات المحلية مع localStorage
// =====================================================

import { v4 as uuidv4 } from 'uuid';
import type { 
  NotificationType,
  NotificationPriority,
  NotificationStats,
  NotificationFilter,
  SystemNotificationMetadata,
  Notification
} from '../types/notifications';

// مفاتيح التخزين المحلي
const STORAGE_KEYS = {
  NOTIFICATIONS: 'ourgoal_local_notifications',
  SETTINGS: 'ourgoal_notification_settings',
  STATS: 'ourgoal_notification_stats',
  SYSTEM_NOTIFICATIONS: 'ourgoal_system_notifications'
};

// إعدادات افتراضية
const DEFAULT_SETTINGS = {
  enabled: true,
  types: {
    pomodoro: true,
    course_progress: true,
    local_files: true,
    general_update: true,
    weekly_event: true,
    achievement: true,
    reminder: true,
    plan_completed: true,
    xp_earned: true,
    event_joined: true,
    event_completed: true,
    course_enrolled: true,
    course_completed: true,
    system: true
  },
  sound: true,
  desktop: true,
  frequency: 'immediate' as const
};

// تعريف واجهة الإشعار المحلي
interface LocalNotification extends Notification {
  source: 'local';
  status: 'unread' | 'read' | 'archived';
  read_at?: string;
  expires_at?: string;
}

/**
 * خدمة إدارة الإشعارات المحلية
 */
class LocalNotificationService {
  private notifications: LocalNotification[] = [];
  private settings = DEFAULT_SETTINGS;

  constructor() {
    this.loadFromStorage();
    this.cleanupExpiredNotifications();
  }

  // =====================================================
  // تحميل وحفظ البيانات
  // =====================================================

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (stored) {
        this.notifications = JSON.parse(stored);
      }

      const storedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (storedSettings) {
        this.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(storedSettings) };
      }
    } catch (error) {
      console.error('Error loading notifications from storage:', error);
      this.notifications = [];
      this.settings = DEFAULT_SETTINGS;
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(this.notifications));
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings));
    } catch (error) {
      console.error('Error saving notifications to storage:', error);
    }
  }

  // =====================================================
  // إدارة الإشعارات
  // =====================================================

  getAll(): LocalNotification[] {
    this.cleanupExpiredNotifications();
    return [...this.notifications].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  getNotifications(filter?: NotificationFilter & { 
    startDate?: string;
    endDate?: string;
  }): LocalNotification[] {
    let filteredNotifications = [...this.notifications];
    
    if (filter) {
      if (filter.type) {
        filteredNotifications = filteredNotifications.filter(n => n.type === filter.type);
      }
      
      if (filter.status) {
        filteredNotifications = filteredNotifications.filter(n => n.status === filter.status);
      }
      
      if (filter.priority) {
        filteredNotifications = filteredNotifications.filter(n => n.priority === filter.priority);
  }

      if (filter.isRead !== undefined) {
        filteredNotifications = filteredNotifications.filter(n => n.is_read === filter.isRead);
      }
      
      if (filter.startDate) {
        const startDate = new Date(filter.startDate).getTime();
        filteredNotifications = filteredNotifications.filter(n => 
          new Date(n.created_at).getTime() >= startDate
        );
      }
      
      if (filter.endDate) {
        const endDate = new Date(filter.endDate).getTime();
        filteredNotifications = filteredNotifications.filter(n => 
          new Date(n.created_at).getTime() <= endDate
        );
      }
    }
    
    return filteredNotifications.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.is_read).length;
  }

  addNotification(notification: {
    type: NotificationType;
    title: string;
    message: string;
    priority?: NotificationPriority;
    metadata?: Record<string, any>;
    link?: string;
    persistent?: boolean;
  }): LocalNotification {
    const now = new Date().toISOString();

    const newNotification: LocalNotification = {
      id: uuidv4(),
      source: 'local',
      status: 'unread',
      is_read: false,
      is_archived: false,
      created_at: now,
      priority: notification.priority || 'normal',
      link: notification.link,
      ...notification
    };

    this.notifications.unshift(newNotification);
    
    // التأكد من عدم تجاوز الحد الأقصى للإشعارات
    if (this.notifications.length > 100) {
      this.notifications = this.notifications.slice(0, 100);
    }

    this.saveToStorage();
    this.showDesktopNotification(newNotification);
    return newNotification;
  }

  markAsRead(id: string): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification && notification.status === 'unread') {
      notification.status = 'read';
      notification.is_read = true;
      notification.read_at = new Date().toISOString();
      this.saveToStorage();
    }
  }

  markAllAsRead(): void {
    const now = new Date().toISOString();
    this.notifications.forEach(notification => {
      if (notification.status === 'unread') {
        notification.status = 'read';
        notification.is_read = true;
        notification.read_at = now;
      }
    });
    this.saveToStorage();
  }

  deleteNotification(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.saveToStorage();
  }

  clearAll(): void {
    this.notifications = [];
    this.saveToStorage();
  }

  // =====================================================
  // إشعارات البومودورو
  // =====================================================

  addPomodoroNotification(data: {
    sessionType: 'work' | 'short-break' | 'long-break';
    duration: number;
    sessionCount: number;
    totalSessions: number;
    taskName?: string;
  }): void {
    const titles = {
      'work': 'انتهت جلسة العمل! 🍅',
      'short-break': 'انتهت فترة الراحة القصيرة! ⏰',
      'long-break': 'انتهت فترة الراحة الطويلة! 🎯'
    };

    const messages = {
      'work': `أحسنت! أكملت جلسة عمل لمدة ${data.duration} دقيقة${data.taskName ? ` على مهمة: ${data.taskName}` : ''}`,
      'short-break': `وقت العودة للعمل! جلسة ${data.sessionCount} من ${data.totalSessions}`,
      'long-break': `استراحة رائعة! جاهز لجلسة عمل جديدة؟`
    };

    this.addNotification({
      type: 'pomodoro',
      title: titles[data.sessionType],
      message: messages[data.sessionType],
      priority: 'normal',
      metadata: data
    });
  }

  // =====================================================
  // إشعارات تقدم الدورات
  // =====================================================

  addCourseProgressNotification(data: {
    courseId: string;
    courseName: string;
    lessonId?: string;
    lessonName?: string;
    nextLessonName?: string;
    progressPercentage: number;
    completedLessons: number;
    totalLessons: number;
    isCompleted: boolean;
  }): void {
    let title: string;
    let message: string;
    let priority: NotificationPriority = 'normal';
    let link = `/courses/${data.courseId}`;

    if (data.isCompleted) {
      if (data.progressPercentage === 100) {
        title = '🎉 تهانينا! أكملت الدورة';
        message = `أكملت دورة "${data.courseName}" بنجاح!`;
        priority = 'high';
      } else {
        title = '✅ أكملت درساً جديداً';
        message = `أكملت "${data.lessonName}" في دورة "${data.courseName}"`;
        if (data.nextLessonName) {
          message += `\nالدرس التالي: ${data.nextLessonName}`;
        }
      }
    } else {
      title = '📊 تحديث تقدم الدورة';
      message = `أكملت ${data.completedLessons} من ${data.totalLessons} دروس (${data.progressPercentage}%) في دورة "${data.courseName}"`;
    }

    this.addNotification({
      type: 'course_progress',
      title,
      message,
      priority,
      link,
      metadata: data
    });
  }

  // =====================================================
  // إشعارات الإنجازات
  // =====================================================

  addAchievementNotification(data: {
    achievementId: string;
    title: string;
    description: string;
    type: 'streak' | 'milestone' | 'completion' | 'special';
    xpEarned?: number;
  }): void {
    const message = data.xpEarned 
      ? `${data.description}\nحصلت على ${data.xpEarned} نقطة خبرة!` 
      : data.description;

    this.addNotification({
      type: 'achievement',
      title: `🏆 ${data.title}`,
      message,
      priority: 'high',
      link: '/profile',
      metadata: data
    });
  }

  // =====================================================
  // إشعارات خطة الدراسة
  // =====================================================

  addPlanCompletedNotification(data: {
    planId: string;
    planTitle: string;
  }): void {
    this.addNotification({
      type: 'plan_completed',
      title: 'تهانينا! تم إكمال خطة الدراسة',
      message: `لقد أكملت خطة الدراسة "${data.planTitle}" بنجاح.`,
      priority: 'high',
      link: `/plan-details/${data.planId}`,
      metadata: { plan_id: data.planId }
    });
  }

  // =====================================================
  // إشعارات نقاط الخبرة
  // =====================================================

  addXpEarnedNotification(data: {
    xpEarned: number;
    reason?: string;
  }): void {
    let message = `لقد حصلت على ${data.xpEarned} نقطة خبرة جديدة.`;
    if (data.reason) {
      message += ` (${data.reason})`;
    }

    this.addNotification({
      type: 'xp_earned',
      title: 'مبروك! لقد حصلت على نقاط خبرة',
      message,
      priority: 'normal',
      link: '/profile',
      metadata: { xp_earned: data.xpEarned, reason: data.reason }
    });
  }

  // =====================================================
  // إشعارات الفعاليات
  // =====================================================

  addEventNotification(data: {
    eventId: string;
    eventTitle: string;
    type: 'new_event' | 'event_joined' | 'event_completed' | 'event_reminder';
    score?: number;
    maxScore?: number;
  }): void {
    let title: string;
    let message: string;
    let link: string;
    let priority: NotificationPriority = 'normal';

    switch (data.type) {
      case 'new_event':
        title = 'فعالية أسبوعية جديدة';
        message = `تم إضافة فعالية جديدة: ${data.eventTitle}`;
        link = '/weekly-events';
        break;
      case 'event_joined':
        title = 'تم الانضمام إلى الفعالية';
        message = `لقد انضممت إلى الفعالية: ${data.eventTitle}`;
        link = `/weekly-events/${data.eventId}/test`;
        break;
      case 'event_completed':
        title = 'تم إكمال اختبار الفعالية';
        message = `لقد أكملت اختبار الفعالية: ${data.eventTitle}`;
        if (data.score !== undefined && data.maxScore !== undefined) {
          message += `\nالنتيجة: ${data.score}/${data.maxScore}`;
        }
        link = `/weekly-events/${data.eventId}/results`;
        break;
      case 'event_reminder':
        title = 'تذكير بالفعالية';
        message = `لا تنسى المشاركة في فعالية "${data.eventTitle}" قبل انتهاء الوقت!`;
        link = '/weekly-events';
        priority = 'high';
        break;
    }

    this.addNotification({
      type: 'weekly_event',
      title,
      message,
      priority,
      link,
      metadata: { 
        event_id: data.eventId,
        score: data.score,
        max_score: data.maxScore
      }
    });
  }

  // =====================================================
  // إشعارات الدورات
  // =====================================================

  addCourseEnrollmentNotification(data: {
    courseId: string;
    courseTitle: string;
  }): void {
    this.addNotification({
      type: 'course_enrolled',
      title: 'تم التسجيل في الدورة',
      message: `لقد سجلت في الدورة: ${data.courseTitle}`,
      priority: 'normal',
      link: `/courses/${data.courseId}`,
      metadata: { course_id: data.courseId }
    });
  }

  addCourseCompletedNotification(data: {
    courseId: string;
    courseTitle: string;
  }): void {
    this.addNotification({
      type: 'course_completed',
      title: 'تهانينا! تم إكمال الدورة',
      message: `لقد أكملت جميع دروس الدورة: ${data.courseTitle}`,
      priority: 'high',
      link: `/courses/${data.courseId}`,
      metadata: { course_id: data.courseId }
    });
  }

  // =====================================================
  // إشعارات النظام
  // =====================================================

  /**
   * إضافة إشعار نظام
   * @param data بيانات إشعار النظام
   */
  addSystemNotification(data: {
    title: string;
    message: string;
    priority?: NotificationPriority;
    link?: string;
    metadata?: Record<string, any>;
  }): void {
    this.addNotification({
      type: 'system',
      title: data.title,
      message: data.message,
      priority: data.priority || 'normal',
      link: data.link,
      metadata: data.metadata
    });
  }

  /**
   * إضافة إشعار تحديث النظام
   * @param data بيانات تحديث النظام
   */
  addSystemUpdateNotification(data: {
    version: string;
    features: string[];
    isRequired?: boolean;
  }): void {
    const message = `تم تحديث النظام إلى الإصدار ${data.version}. ${
      data.features.length > 0 
        ? `\nالتحديثات الجديدة:\n- ${data.features.join('\n- ')}` 
        : ''
    }`;

    this.addNotification({
      type: 'system',
      title: 'تحديث جديد للنظام',
      message,
      priority: data.isRequired ? 'high' : 'normal',
      metadata: data
    });
  }

  /**
   * إضافة إشعار صيانة النظام
   * @param data بيانات صيانة النظام
   */
  addMaintenanceNotification(data: {
    startTime: string;
    endTime: string;
    reason: string;
  }): void {
    const startDate = new Date(data.startTime);
    const endDate = new Date(data.endTime);
    
    const formatDate = (date: Date) => {
      return date.toLocaleString('ar-SA', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const message = `سيتم إجراء صيانة للنظام من ${formatDate(startDate)} إلى ${formatDate(endDate)}.\n${data.reason}`;

    this.addNotification({
      type: 'system',
      title: 'صيانة مجدولة للنظام',
      message,
      priority: 'high',
      metadata: data
    });
  }

  /**
   * إضافة إشعار خطأ في النظام
   * @param data بيانات الخطأ
   */
  addSystemErrorNotification(data: {
    errorCode: string;
    errorMessage: string;
    affectedFeature?: string;
  }): void {
    let message = `حدث خطأ في النظام: ${data.errorMessage} (رمز الخطأ: ${data.errorCode})`;
    
    if (data.affectedFeature) {
      message += `\nالميزة المتأثرة: ${data.affectedFeature}`;
    }

    this.addNotification({
      type: 'system',
      title: 'خطأ في النظام',
      message,
      priority: 'high',
      metadata: data
    });
  }

  /**
   * إضافة إشعار ميزة جديدة
   * @param data بيانات الميزة الجديدة
   */
  addNewFeatureNotification(data: {
    featureName: string;
    description: string;
    link?: string;
  }): void {
    this.addNotification({
      type: 'system',
      title: `ميزة جديدة: ${data.featureName}`,
      message: data.description,
      priority: 'normal',
      link: data.link,
      metadata: data
    });
  }

  // =====================================================
  // إحصائيات الإشعارات
  // =====================================================

  getStats(): NotificationStats {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const allNotifications = this.getAll();
    const unreadNotifications = allNotifications.filter(n => !n.is_read);
    const todayNotifications = allNotifications.filter(n => 
      new Date(n.created_at) >= today
    );
    
    // إحصائيات حسب النوع
    const byType = {
      course_progress: 0,
      pomodoro: 0,
      local_files: 0,
      general_update: 0,
      system: 0,
      weekly_event: 0,
      achievement: 0,
      plan_completed: 0,
      xp_earned: 0,
      course_enrolled: 0,
      course_completed: 0
    };

    // إحصائيات حسب الأولوية
    const byPriority = {
      low: 0,
      normal: 0,
      high: 0
    };

    // حساب الإحصائيات
    allNotifications.forEach(notification => {
      if (byType[notification.type] !== undefined) {
      byType[notification.type]++;
      }
      byPriority[notification.priority]++;
    });

    return {
      total: allNotifications.length,
      unread: unreadNotifications.length,
      today: todayNotifications.length,
      byType,
      byPriority
    };
  }

  // =====================================================
  // إعدادات الإشعارات
  // =====================================================

  getSettings() {
    return this.settings;
  }

  updateSettings(newSettings: Partial<typeof this.settings>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.saveToStorage();
  }

  // =====================================================
  // وظائف مساعدة
  // =====================================================

  private cleanupExpiredNotifications(): void {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    this.notifications = this.notifications.filter(notification => 
      !notification.expires_at || new Date(notification.expires_at) > thirtyDaysAgo
    );
    
    this.saveToStorage();
  }

  private showDesktopNotification(notification: LocalNotification): void {
    if (!this.settings.desktop || !('Notification' in window)) return;

    if (window.Notification.permission === 'granted') {
      new window.Notification(notification.title, {
        body: notification.message,
        icon: '/new-favicon.jpg'
      });
    } else if (window.Notification.permission !== 'denied') {
      window.Notification.requestPermission();
    }
  }

  // =====================================================
  // تنظيف الإشعارات
  // =====================================================

  clearOldNotifications(olderThanDays: number = 30): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
    
    this.notifications = this.notifications.filter(notification => 
      new Date(notification.created_at) >= cutoffDate
    );
    
    this.saveToStorage();
  }

  clearReadNotifications(): void {
    this.notifications = this.notifications.filter(notification => !notification.is_read);
    this.saveToStorage();
  }

  // =====================================================
  // إشعارات النظام
  // =====================================================

  getSystemNotifications(): Notification[] {
    try {
      const storedNotifications = localStorage.getItem(STORAGE_KEYS.SYSTEM_NOTIFICATIONS);
      return storedNotifications ? JSON.parse(storedNotifications) : [];
    } catch (error) {
      console.error('Error getting system notifications from localStorage:', error);
      return [];
    }
  }
}

// إنشاء نسخة واحدة من الخدمة للاستخدام في جميع أنحاء التطبيق
export const localNotificationService = new LocalNotificationService();

// وظائف مساعدة للتصدير
export function addSystemNotification(
  title: string,
  message: string,
  priority: NotificationPriority = 'normal',
  metadata?: SystemNotificationMetadata
): Notification {
  return localNotificationService.addNotification({
    type: 'system',
    title,
    message,
    priority,
    metadata
  });
}

export function addSystemUpdateNotification(
  title: string,
  message: string,
  features: string[],
  version: string,
  priority: NotificationPriority = 'normal'
): Notification {
  return localNotificationService.addNotification({
    type: 'system',
    title,
    message,
    priority,
    metadata: {
      category: 'update',
      features,
      version
    }
  });
}

export function addMaintenanceNotification(
  title: string,
  message: string,
  startTime: Date | string,
  endTime: Date | string,
  reason: string,
  priority: NotificationPriority = 'high'
): Notification {
  return localNotificationService.addNotification({
    type: 'system',
    title,
    message,
    priority,
    metadata: {
      category: 'maintenance',
      startTime: typeof startTime === 'string' ? startTime : startTime.toISOString(),
      endTime: typeof endTime === 'string' ? endTime : endTime.toISOString(),
      reason
    }
  });
}

export function addSystemErrorNotification(
  title: string,
  message: string,
  errorCode: string,
  affectedFeature?: string,
  priority: NotificationPriority = 'high'
): Notification {
  return localNotificationService.addNotification({
    type: 'system',
    title,
    message,
    priority,
    metadata: {
      category: 'error',
      errorCode,
      affectedFeature
    }
  });
}

export function addNewFeatureNotification(
  title: string,
  message: string,
  featureName: string,
  featureDescription: string,
  link?: string,
  priority: NotificationPriority = 'normal'
): Notification {
  return localNotificationService.addNotification({
    type: 'system',
    title,
    message,
    priority,
    metadata: {
      category: 'new_feature',
      featureName,
      featureDescription,
      link
    }
  });
}
