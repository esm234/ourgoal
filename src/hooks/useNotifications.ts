import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { localNotificationService } from '../services/localNotifications';
import { 
  Notification, 
  LocalNotification, 
  NotificationFilter,
  NotificationStats,
  NotificationSort
} from '../types/notifications';

// فترة تحديث الإشعارات بالمللي ثانية (20 دقيقة)
const NOTIFICATION_REFRESH_INTERVAL = 20 * 60 * 1000;

/**
 * Hook للتعامل مع الإشعارات المحلية
 */
export const useNotifications = () => {
  const { user } = useAuth();
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  /**
   * جلب جميع الإشعارات المحلية
   */
  const fetchAllNotifications = useCallback(async () => {
    setLoading(true);
    
    try {
      // جلب الإشعارات المحلية
      const localNotifications = localNotificationService.getAll();
      
      // جلب إشعارات النظام
      const systemNotifications = localNotificationService.getSystemNotifications();
      
      // دمج الإشعارات
      const allNotifications = [...localNotifications, ...systemNotifications];
      
      // ترتيب الإشعارات حسب التاريخ (الأحدث أولاً)
      allNotifications.sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      
      setNotifications(allNotifications);
      
      // حساب الإحصائيات
      calculateStats(allNotifications);
      
      setLastFetched(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('حدث خطأ أثناء جلب الإشعارات'));
      console.error('Error fetching all notifications:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * حساب إحصائيات الإشعارات
   */
  const calculateStats = (notificationList: Notification[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayNotifications = notificationList.filter(n => 
      new Date(n.created_at) >= today
    );
    
    const unreadNotifications = notificationList.filter(n => !n.is_read);
    setUnreadCount(unreadNotifications.length);
    
    // إحصائيات حسب النوع
    const byType: Record<string, number> = {
      course_progress: 0,
      pomodoro: 0,
      local_files: 0,
      general_update: 0,
      system: 0,
      plan_completed: 0,
      xp_earned: 0,
      weekly_event: 0,
      event_joined: 0,
      event_completed: 0,
      course_enrolled: 0,
      course_completed: 0,
      achievement: 0
    };
    
    // إحصائيات حسب الأولوية
    const byPriority = {
      low: 0,
      normal: 0,
      high: 0
    };
    
    // حساب الإحصائيات
    notificationList.forEach(notification => {
      if (byType[notification.type] !== undefined) {
        byType[notification.type]++;
      }
      byPriority[notification.priority]++;
    });
    
    setStats({
      total: notificationList.length,
      unread: unreadNotifications.length,
      today: todayNotifications.length,
      byType,
      byPriority
    });
  };

  /**
   * تصفية الإشعارات
   */
  const filterNotifications = useCallback((filter?: NotificationFilter, sort?: NotificationSort) => {
    let filtered = [...notifications];
    
    // تطبيق التصفية
    if (filter) {
      if (filter.type) {
        filtered = filtered.filter(n => n.type === filter.type);
      }
      
      if (filter.status) {
        filtered = filtered.filter(n => n.status === filter.status);
      }
      
      if (filter.priority) {
        filtered = filtered.filter(n => n.priority === filter.priority);
      }
      
      if (filter.isRead !== undefined) {
        filtered = filtered.filter(n => n.is_read === filter.isRead);
      }
      
      if (filter.startDate) {
        const startDate = new Date(filter.startDate).getTime();
        filtered = filtered.filter(n => 
          new Date(n.created_at).getTime() >= startDate
        );
      }
      
      if (filter.endDate) {
        const endDate = new Date(filter.endDate).getTime();
        filtered = filtered.filter(n => 
          new Date(n.created_at).getTime() <= endDate
        );
      }
    }
    
    // تطبيق الترتيب
    if (sort) {
      filtered.sort((a, b) => {
        if (sort.field === 'created_at') {
          return sort.direction === 'asc'
            ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        
        if (sort.field === 'priority') {
          const priorityOrder = { low: 1, normal: 2, high: 3 };
          return sort.direction === 'asc'
            ? priorityOrder[a.priority] - priorityOrder[b.priority]
            : priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        
        if (sort.field === 'type') {
          return sort.direction === 'asc'
            ? a.type.localeCompare(b.type)
            : b.type.localeCompare(a.type);
        }
        
        return 0;
      });
  }

    return filtered;
  }, [notifications]);

  /**
   * تعليم إشعار كمقروء
   */
  const markAsRead = useCallback(async (notification: Notification) => {
    if (notification.is_read) return;
    
    try {
      // تعليم الإشعار المحلي كمقروء
      localNotificationService.markAsRead(notification.id);
      
      // تحديث حالة الإشعارات
      setNotifications(prev => 
        prev.map(n => 
          n.id === notification.id 
            ? { ...n, is_read: true, status: 'read', read_at: new Date().toISOString() } 
            : n
        )
      );
      
      // تحديث الإحصائيات
      if (stats) {
        setStats({
          ...stats,
          unread: stats.unread - 1
        });
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  }, [stats]);

  /**
   * تعليم جميع الإشعارات كمقروءة
   */
  const markAllAsRead = useCallback(async () => {
    try {
      // تعليم الإشعارات المحلية كمقروءة
      localNotificationService.markAllAsRead();
      
      // تحديث حالة الإشعارات
      setNotifications(prev => 
        prev.map(n => ({
          ...n,
          is_read: true,
          status: 'read',
          read_at: new Date().toISOString()
        }))
      );
      
      // تحديث الإحصائيات
      if (stats) {
        setStats({
          ...stats,
          unread: 0
        });
        setUnreadCount(0);
      }
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  }, [stats]);

  /**
   * حذف إشعار
   */
  const deleteNotification = useCallback(async (notification: Notification) => {
    try {
      // حذف الإشعار المحلي
      localNotificationService.deleteNotification(notification.id);
      
      // تحديث حالة الإشعارات
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
      
      // تحديث الإحصائيات
      if (stats) {
        setStats({
          ...stats,
          total: stats.total - 1,
          unread: notification.is_read ? stats.unread : stats.unread - 1
        });
        
        if (!notification.is_read) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  }, [stats]);

  /**
   * إضافة إشعار نظام
   */
  const addSystemNotification = useCallback((data: {
    title: string;
    message: string;
    priority?: 'low' | 'normal' | 'high';
    link?: string;
    metadata?: Record<string, any>;
  }) => {
    const newNotification = localNotificationService.addSystemNotification(data);
    refreshNotifications();
    return newNotification;
  }, []);

  /**
   * إضافة إشعار تحديث النظام
   */
  const addSystemUpdateNotification = useCallback((data: {
    version: string;
    features: string[];
    isRequired?: boolean;
  }) => {
    const newNotification = localNotificationService.addSystemUpdateNotification(data);
    refreshNotifications();
    return newNotification;
  }, []);

  /**
   * إضافة إشعار صيانة النظام
   */
  const addMaintenanceNotification = useCallback((data: {
    startTime: string;
    endTime: string;
    reason: string;
  }) => {
    const newNotification = localNotificationService.addMaintenanceNotification(data);
    refreshNotifications();
    return newNotification;
  }, []);

  /**
   * إضافة إشعار خطأ في النظام
   */
  const addSystemErrorNotification = useCallback((data: {
    errorCode: string;
    errorMessage: string;
    affectedFeature?: string;
  }) => {
    const newNotification = localNotificationService.addSystemErrorNotification(data);
    refreshNotifications();
    return newNotification;
  }, []);

  /**
   * إضافة إشعار ميزة جديدة
   */
  const addNewFeatureNotification = useCallback((data: {
    featureName: string;
    description: string;
    link?: string;
  }) => {
    const newNotification = localNotificationService.addNewFeatureNotification(data);
    refreshNotifications();
    return newNotification;
  }, []);

  /**
   * حذف الإشعارات القديمة
   */
  const clearOldNotifications = useCallback(async (olderThanDays: number = 30) => {
    try {
      const now = new Date();
      const cutoffDate = new Date(now.setDate(now.getDate() - olderThanDays));
      
      const oldNotifications = notifications.filter(n => 
        new Date(n.created_at) < cutoffDate
      );
      
      for (const notification of oldNotifications) {
        await localNotificationService.deleteNotification(notification.id);
      }
      
      // تحديث القائمة المحلية
      setNotifications(prev => 
        prev.filter(n => new Date(n.created_at) >= cutoffDate)
      );
      
      // تحديث الإحصائيات
      refreshNotifications();
      
      return oldNotifications.length;
    } catch (error) {
      console.error('Error clearing old notifications:', error);
      return 0;
    }
  }, [notifications]);

  /**
   * تحديث الإشعارات
   */
  const refreshNotifications = useCallback(() => {
    fetchAllNotifications();
  }, [fetchAllNotifications]);

  // تحميل الإشعارات عند تهيئة المكون
  useEffect(() => {
    fetchAllNotifications();
    
    // تحديث الإشعارات كل فترة
    const intervalId = setInterval(() => {
      fetchAllNotifications();
    }, NOTIFICATION_REFRESH_INTERVAL);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [fetchAllNotifications]);

  // عرض تفاصيل الإشعار
  const viewNotificationDetails = async (notification: Notification) => {
    // تعليم الإشعار كمقروء إذا لم يكن مقروءًا بالفعل
    if (!notification.is_read) {
      await markAsRead(notification);
    }
    
    // التنقل إلى الصفحة المناسبة حسب نوع الإشعار
    if (notification.link) {
      navigate(notification.link);
    }
    
    return notification;
  };

  // إضافة إشعار جديد
  const addNotification = async (notification: Omit<Notification, 'id' | 'created_at' | 'is_read' | 'is_archived'>) => {
    try {
      const newNotification = await localNotificationService.addNotification(notification);
      
      // تحديث القائمة المحلية
      setNotifications(prev => [newNotification, ...prev]);
      
      // تحديث الإحصائيات
      if (stats) {
        const newStats = { ...stats };
        newStats.total++;
        newStats.unread++;
        
        // تحديث الإحصائيات حسب النوع والأولوية
        if (!newStats.byType[notification.type]) {
          newStats.byType[notification.type] = 0;
        }
        newStats.byType[notification.type]++;
        
        if (notification.priority) {
          newStats.byPriority[notification.priority]++;
    } else {
          newStats.byPriority.normal++;
        }
        
        setStats(newStats);
      }
      
      return newNotification;
    } catch (error) {
      console.error('Error adding notification:', error);
      throw error;
    }
  };

  return {
    notifications,
    stats,
    loading,
    error,
    unreadCount,
    lastFetched,
    filterNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications,
    clearOldNotifications,
    viewNotificationDetails,
    addNotification,
    // إشعارات النظام الجديدة
    addSystemNotification,
    addSystemUpdateNotification,
    addMaintenanceNotification,
    addSystemErrorNotification,
    addNewFeatureNotification
  };
};