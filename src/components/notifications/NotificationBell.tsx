import { useState, useEffect } from 'react';
import { Bell, BellRing } from 'lucide-react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '../ui/popover';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useNotifications } from '../../hooks/useNotifications';
import NotificationList from './NotificationList';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationBellProps {
  className?: string;
}

/**
 * مكون زر الإشعارات الذي يظهر في شريط التنقل
 */
export default function NotificationBell({ className }: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { 
    unreadCount, 
    notifications, 
    loading, 
    markAllAsRead,
    refreshNotifications
  } = useNotifications();

  const hasUnread = unreadCount > 0;

  // تحديث الإشعارات عند فتح القائمة
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      refreshNotifications();
    }
  };

  // تأثير الرنين للإشعارات الجديدة
  useEffect(() => {
    if (hasUnread) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [unreadCount, hasUnread]);

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "relative w-10 h-10 rounded-full bg-gray-900/50 hover:bg-gray-800", 
            className
          )}
          aria-label="الإشعارات"
        >
          <AnimatePresence>
            {isAnimating && hasUnread ? (
              <motion.div
                initial={{ scale: 1 }}
                animate={{ 
                  scale: [1, 1.2, 1, 1.2, 1],
                  rotate: [0, -10, 10, -10, 0]
                }}
                transition={{ 
                  duration: 1,
                  repeat: 1,
                  repeatType: "reverse"
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <BellRing className="h-5 w-5 text-amber-400" />
              </motion.div>
            ) : (
              <Bell className={cn(
                "h-5 w-5",
                hasUnread ? "text-amber-400" : "text-gray-400"
              )} />
            )}
          </AnimatePresence>
          
          {hasUnread && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-gradient-to-r from-amber-600 to-red-600 text-white border-none shadow-lg shadow-amber-900/50"
              aria-label={`${unreadCount} إشعارات غير مقروءة`}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 md:w-96 p-0 max-h-[80vh] overflow-hidden flex flex-col bg-gray-900 border-gray-700 shadow-xl rounded-xl"
        align="end"
        sideOffset={8}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gradient-to-r from-gray-900 to-gray-800">
          <h3 className="font-medium text-white flex items-center">
            <Bell className="h-4 w-4 mr-2 text-amber-400" />
            الإشعارات
            {hasUnread && (
              <Badge className="mr-2 bg-amber-600 text-white text-xs">
                {unreadCount}
              </Badge>
            )}
          </h3>
          {hasUnread && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => markAllAsRead()}
              className="text-xs text-gray-300 hover:text-white hover:bg-gray-800"
            >
              تعليم الكل كمقروء
            </Button>
          )}
        </div>
        
        <div className="overflow-y-auto max-h-[60vh] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          <NotificationList 
            notifications={notifications} 
            loading={loading} 
            emptyMessage="لا توجد إشعارات"
          />
        </div>
        
        <div className="p-2 border-t border-gray-700 text-center bg-gradient-to-r from-gray-900 to-gray-800">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs w-full text-gray-300 hover:text-white hover:bg-gray-800"
            onClick={() => refreshNotifications()}
          >
            تحديث الإشعارات
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
} 