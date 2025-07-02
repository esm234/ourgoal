// =====================================================
// NOTIFICATION TYPES - أنواع الإشعارات
// نظام إشعارات متكامل للموقع
// =====================================================

/**
 * أنواع الإشعارات المتاحة
 */
export type NotificationType = 
  | 'system'
  | 'course_progress'
  | 'pomodoro'
  | 'local_files'
  | 'general_update'
  | 'plan_completed'
  | 'xp_earned'
  | 'weekly_event'
  | 'achievement'
  | 'course_completed'
  | 'course_enrolled';

/**
 * أولويات الإشعارات
 */
export type NotificationPriority = 'low' | 'normal' | 'high';

/**
 * حالات الإشعارات
 */
export type NotificationStatus = 'read' | 'unread' | 'archived';

/**
 * فئات إشعارات النظام
 */
export type SystemNotificationCategory = 
  | 'update'
  | 'maintenance'
  | 'error'
  | 'new_feature'
  | 'security'
  | 'performance';

/**
 * البيانات الوصفية لإشعارات تحديث النظام
 */
export interface UpdateNotificationMetadata {
  category: 'update';
  features: string[];
  version: string;
  releaseNotes?: string;
}

/**
 * البيانات الوصفية لإشعارات صيانة النظام
 */
export interface MaintenanceNotificationMetadata {
  category: 'maintenance';
  startTime: string;
  endTime: string;
  reason: string;
  affectedServices?: string[];
}

/**
 * البيانات الوصفية لإشعارات أخطاء النظام
 */
export interface ErrorNotificationMetadata {
  category: 'error';
  errorCode: string;
  affectedFeature?: string;
  resolution?: string;
}

/**
 * البيانات الوصفية لإشعارات الميزات الجديدة
 */
export interface NewFeatureNotificationMetadata {
  category: 'new_feature';
  featureName: string;
  featureDescription: string;
  link?: string;
}

/**
 * البيانات الوصفية لإشعارات الأمان
 */
export interface SecurityNotificationMetadata {
  category: 'security';
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedComponents?: string[];
  recommendedAction?: string;
}

/**
 * البيانات الوصفية لإشعارات الأداء
 */
export interface PerformanceNotificationMetadata {
  category: 'performance';
  improvementPercentage?: number;
  affectedFeatures?: string[];
}

/**
 * البيانات الوصفية لإشعارات تقدم الكورس
 */
export interface CourseProgressMetadata {
  courseName: string;
  courseId: string;
  completedLessons: number;
  totalLessons: number;
  progressPercentage: number;
}

/**
 * البيانات الوصفية لإشعارات نقاط الخبرة
 */
export interface XPEarnedMetadata {
  xp_amount: number;
  source: string;
  total_xp?: number;
}

/**
 * البيانات الوصفية لإشعارات النظام
 */
export type SystemNotificationMetadata =
  | UpdateNotificationMetadata
  | MaintenanceNotificationMetadata
  | ErrorNotificationMetadata
  | NewFeatureNotificationMetadata
  | SecurityNotificationMetadata
  | PerformanceNotificationMetadata;

/**
 * البيانات الوصفية للإشعارات
 */
export type NotificationMetadata =
  | SystemNotificationMetadata
  | CourseProgressMetadata
  | XPEarnedMetadata
  | Record<string, any>;

/**
 * واجهة الإشعار
 */
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  created_at: string;
  is_read: boolean;
  is_archived: boolean;
  priority?: NotificationPriority;
  link?: string;
  metadata?: NotificationMetadata;
  user_id?: string;
}

/**
 * واجهة تصفية الإشعارات
 */
export interface NotificationFilter {
  type?: NotificationType;
  priority?: NotificationPriority;
  isRead?: boolean;
  status?: NotificationStatus;
  dateFrom?: string;
  dateTo?: string;
}

/**
 * واجهة ترتيب الإشعارات
 */
export interface NotificationSort {
  field: 'created_at' | 'priority' | 'type';
  direction: 'asc' | 'desc';
}

/**
 * واجهة إحصائيات الإشعارات
 */
export interface NotificationStats {
  total: number;
  unread: number;
  today: number;
  byType: Record<string, number>;
  byPriority: Record<NotificationPriority, number>;
}

// =====================================================
// واجهات الخدمات
// =====================================================

export interface NotificationService {
  // جلب الإشعارات
  getNotifications(): Promise<Notification[]>;
  
  // إضافة إشعار جديد
  addNotification(notification: Omit<Notification, 'id' | 'created_at'>): Promise<void>;
  
  // تحديث حالة الإشعار
  markAsRead(id: string): Promise<void>;
  markAllAsRead(): Promise<void>;
  
  // حذف الإشعارات
  deleteNotification(id: string): Promise<void>;
  clearOldNotifications(olderThanDays: number): Promise<void>;
  
  // الإحصائيات
  getStats(): Promise<NotificationStats>;
}

// =====================================================
// واجهات طلبات API
// =====================================================

export interface CreateNotificationRequest {
  type: NotificationType;
  title: string;
  message: string;
  priority?: NotificationPriority;
  expires_at?: string;
  metadata?: Record<string, any>;
  user_id?: string; // للإشعارات العامة
}

export interface NotificationResponse {
  data: Notification[];
  stats: NotificationStats;
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
};
}
