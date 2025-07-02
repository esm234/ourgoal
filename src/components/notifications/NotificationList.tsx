import { Notification } from '../../types/notifications';
import NotificationItem from './NotificationItem';
import { Skeleton } from '../ui/skeleton';
import { motion } from 'framer-motion';

interface NotificationListProps {
  notifications: Notification[];
  loading?: boolean;
  emptyMessage?: string;
  onNotificationClick?: (notification: Notification) => void;
  showActions?: boolean;
  maxHeight?: string;
  className?: string;
}

/**
 * مكون قائمة الإشعارات
 */
export default function NotificationList({
  notifications,
  loading = false,
  emptyMessage = 'لا توجد إشعارات',
  onNotificationClick,
  showActions = true,
  maxHeight,
  className
}: NotificationListProps) {
  // عرض حالة التحميل
  if (loading) {
    return (
      <div className={`bg-gray-900 ${className}`}>
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="p-4 border-b border-gray-700">
            <div className="flex items-start gap-3">
              <Skeleton className="h-10 w-10 rounded-full bg-gray-800" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4 bg-gray-800" />
                <Skeleton className="h-3 w-full bg-gray-800" />
                <Skeleton className="h-3 w-1/2 bg-gray-800" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // عرض رسالة عندما لا توجد إشعارات
  if (notifications.length === 0) {
    return (
      <div className="p-8 text-center text-gray-400 bg-gray-900 flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-8 w-8 text-gray-600" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
            />
          </svg>
        </div>
        {emptyMessage}
      </div>
    );
  }

  // عرض قائمة الإشعارات
  return (
    <div 
      className={`bg-gray-900 ${className}`}
      style={{ maxHeight: maxHeight }}
    >
      {notifications.map((notification, index) => (
        <motion.div
          key={notification.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.3,
            delay: index * 0.05,
            ease: "easeOut"
          }}
        >
          <NotificationItem
            notification={notification}
            onClick={onNotificationClick}
            showActions={showActions}
          />
        </motion.div>
      ))}
    </div>
  );
} 