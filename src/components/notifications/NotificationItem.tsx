import { useState } from 'react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { 
  Bell, 
  BookOpen, 
  Clock, 
  File, 
  Info, 
  MoreVertical, 
  Timer, 
  Trash2, 
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  AlertTriangle,
  Sparkles,
  Award,
  Zap,
  Calendar,
  Bookmark,
  GraduationCap
} from 'lucide-react';
import { Notification, NotificationType } from '../../types/notifications';
import { useNotifications } from '../../hooks/useNotifications';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { cn } from '../../lib/utils';
import { Badge } from '../ui/badge';

interface NotificationItemProps {
  notification: Notification;
  onClick?: (notification: Notification) => void;
  showActions?: boolean;
  className?: string;
}

/**
 * مكون عنصر الإشعار
 */
export default function NotificationItem({
  notification,
  onClick,
  showActions = true,
  className,
}: NotificationItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { markAsRead, deleteNotification } = useNotifications();

  // تحديد أيقونة الإشعار حسب نوعه
  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'course_progress':
        return <BookOpen className="h-6 w-6 text-blue-400" />;
      case 'pomodoro':
        return <Timer className="h-6 w-6 text-red-400" />;
      case 'local_files':
        return <File className="h-6 w-6 text-green-400" />;
      case 'general_update':
        return <Info className="h-6 w-6 text-purple-400" />;
      case 'system':
        return <Bell className="h-6 w-6 text-amber-400" />;
      case 'plan_completed':
        return <Bookmark className="h-6 w-6 text-teal-400" />;
      case 'xp_earned':
        return <Zap className="h-6 w-6 text-yellow-400" />;
      case 'weekly_event':
        return <Calendar className="h-6 w-6 text-indigo-400" />;
      case 'achievement':
        return <Award className="h-6 w-6 text-rose-400" />;
      case 'course_completed':
        return <GraduationCap className="h-6 w-6 text-cyan-400" />;
      default:
        return <Bell className="h-6 w-6 text-gray-400" />;
    }
  };

  // تنسيق التاريخ
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd MMM yyyy, HH:mm', { locale: ar });
    } catch (error) {
      return dateString;
    }
  };

  // معالجة النقر على الإشعار
  const handleClick = () => {
    if (!notification.is_read) {
      markAsRead(notification);
    }
    
    if (onClick) {
      onClick(notification);
    }
  };

  // معالجة حذف الإشعار
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNotification(notification);
  };

  // معالجة تعليم الإشعار كمقروء
  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    markAsRead(notification);
  };

  // تحديد لون الخلفية حسب نوع الإشعار
  const getBackgroundGradient = (type: NotificationType, isRead: boolean) => {
    if (isRead) {
      return 'bg-gradient-to-r from-gray-900 to-gray-800';
    }

    switch (type) {
      case 'system':
        return 'bg-gradient-to-r from-amber-950 to-black';
      case 'course_progress':
        return 'bg-gradient-to-r from-blue-950 to-black';
      case 'pomodoro':
        return 'bg-gradient-to-r from-red-950 to-black';
      case 'plan_completed':
        return 'bg-gradient-to-r from-teal-950 to-black';
      case 'xp_earned':
        return 'bg-gradient-to-r from-yellow-950 to-black';
      case 'achievement':
        return 'bg-gradient-to-r from-rose-950 to-black';
      case 'course_completed':
        return 'bg-gradient-to-r from-cyan-950 to-black';
      case 'weekly_event':
        return 'bg-gradient-to-r from-indigo-950 to-black';
      default:
        return 'bg-gradient-to-r from-gray-900 to-black';
    }
  };

  // تحديد شارة الأولوية
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return (
          <Badge className="bg-red-600 hover:bg-red-700 text-white">
            عاجل
          </Badge>
        );
      case 'normal':
        return (
          <Badge className="bg-blue-600 hover:bg-blue-700 text-white">
            عادي
          </Badge>
        );
      case 'low':
        return (
          <Badge className="bg-gray-600 hover:bg-gray-700 text-white">
            منخفض
          </Badge>
        );
      default:
        return null;
    }
  };

  // عرض تفاصيل الإشعار حسب نوعه
  const renderNotificationDetails = () => {
    if (!notification.metadata) return null;

    switch (notification.type) {
      case 'system':
        if (notification.metadata.category === 'update') {
          return (
            <div className="mt-3 p-3 bg-gray-900 rounded-md border border-gray-700">
              <h5 className="text-sm font-semibold mb-2">تفاصيل التحديث</h5>
              {notification.metadata.features && Array.isArray(notification.metadata.features) && (
                <ul className="text-xs space-y-1 list-disc list-inside text-gray-300">
                  {notification.metadata.features.map((feature: string, index: number) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              )}
              {notification.metadata.version && (
                <div className="mt-2 text-xs text-gray-400">
                  الإصدار: {notification.metadata.version}
                </div>
              )}
            </div>
          );
        }
        if (notification.metadata.category === 'maintenance') {
          return (
            <div className="mt-3 p-3 bg-gray-900 rounded-md border border-gray-700">
              <h5 className="text-sm font-semibold mb-2">تفاصيل الصيانة</h5>
              <div className="text-xs text-gray-300">
                <p>وقت البدء: {formatDate(notification.metadata.startTime)}</p>
                <p>وقت الانتهاء: {formatDate(notification.metadata.endTime)}</p>
                <p className="mt-1">السبب: {notification.metadata.reason}</p>
              </div>
            </div>
          );
        }
        if (notification.metadata.category === 'error') {
          return (
            <div className="mt-3 p-3 bg-gray-900 rounded-md border border-red-900">
              <h5 className="text-sm font-semibold mb-2 text-red-400">تفاصيل الخطأ</h5>
              <div className="text-xs text-gray-300">
                <p>رمز الخطأ: {notification.metadata.errorCode}</p>
                {notification.metadata.affectedFeature && (
                  <p className="mt-1">الميزة المتأثرة: {notification.metadata.affectedFeature}</p>
                )}
              </div>
            </div>
          );
        }
        break;
      
      case 'course_progress':
        return (
          <div className="mt-3 p-3 bg-gray-900 rounded-md border border-blue-900">
            <h5 className="text-sm font-semibold mb-2">تفاصيل التقدم</h5>
            <div className="text-xs text-gray-300">
              <p>الدورة: {notification.metadata.courseName}</p>
              <p className="mt-1">الدروس المكتملة: {notification.metadata.completedLessons} من {notification.metadata.totalLessons}</p>
              <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${notification.metadata.progressPercentage}%` }}
                ></div>
              </div>
              <p className="mt-1 text-right text-blue-400">{notification.metadata.progressPercentage}%</p>
            </div>
          </div>
        );
      
      case 'xp_earned':
        return (
          <div className="mt-3 p-3 bg-gray-900 rounded-md border border-yellow-900">
            <h5 className="text-sm font-semibold mb-2 text-yellow-400">تفاصيل نقاط الخبرة</h5>
            <div className="text-xs text-gray-300">
              <p className="flex items-center">
                <Zap className="h-4 w-4 text-yellow-400 mr-1" />
                <span>نقاط الخبرة المكتسبة: {notification.metadata.xp_amount}</span>
              </p>
              {notification.metadata.source && (
                <p className="mt-1">المصدر: {notification.metadata.source}</p>
              )}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  // تحديد ما إذا كان هناك تفاصيل للعرض
  const hasDetails = () => {
    if (!notification.metadata) return false;
    
    if (notification.type === 'system') {
      return notification.metadata.category === 'update' || 
             notification.metadata.category === 'maintenance' ||
             notification.metadata.category === 'error';
    }
    
    if (notification.type === 'course_progress') return true;
    if (notification.type === 'xp_earned') return true;
    
    return false;
  };

  return (
    <div
      className={cn(
        "p-4 border-b border-gray-700 transition-colors flex flex-col gap-3 cursor-pointer",
        getBackgroundGradient(notification.type, notification.is_read),
        isHovered && "bg-gray-800",
        className
      )}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 rounded-full p-2 bg-black/30">
          {getIcon(notification.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div>
              <h4 className={cn(
                "text-sm font-medium line-clamp-1 text-white",
                !notification.is_read && "font-semibold"
              )}>
                {notification.title}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-400 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatDate(notification.created_at)}
                </span>
                
                {notification.priority && getPriorityBadge(notification.priority)}
              </div>
            </div>
            
            {showActions && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-gray-700"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">القائمة</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-gray-800 text-gray-100 border-gray-700">
                  {!notification.is_read && (
                    <DropdownMenuItem onClick={handleMarkAsRead} className="hover:bg-gray-700">
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      <span>تعليم كمقروء</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleDelete} className="hover:bg-gray-700">
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>حذف</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          
          <p className="text-sm text-gray-300 mt-2 line-clamp-2">
            {notification.message}
          </p>
          
          {hasDetails() && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 text-xs text-gray-300 hover:text-white hover:bg-gray-800 p-1 h-auto flex items-center"
              onClick={(e) => {
                e.stopPropagation();
                setShowDetails(!showDetails);
              }}
            >
              {showDetails ? (
                <>
                  <ChevronUp className="h-3 w-3 mr-1" />
                  إخفاء التفاصيل
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3 mr-1" />
                  عرض التفاصيل
                </>
              )}
            </Button>
          )}
        </div>
      </div>
      
      {showDetails && renderNotificationDetails()}
    </div>
  );
} 