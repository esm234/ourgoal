import { useState } from 'react';
import { 
  Bell, 
  Check, 
  Filter, 
  RefreshCw, 
  Trash2,
  X,
  Sparkles,
  Search,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import NotificationList from './NotificationList';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import { Separator } from '../ui/separator';
import { NotificationFilter, NotificationSort, NotificationType, NotificationPriority, NotificationStatus } from '../../types/notifications';
import { Input } from '../ui/input';
import { motion } from 'framer-motion';

/**
 * صفحة الإشعارات الكاملة
 */
export default function NotificationsPage() {
  const { 
    notifications, 
    stats, 
    loading, 
    filterNotifications, 
    markAllAsRead, 
    refreshNotifications,
    deleteNotification,
    clearOldNotifications
  } = useNotifications();

  const [activeTab, setActiveTab] = useState('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filter, setFilter] = useState<NotificationFilter>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sort, setSort] = useState<NotificationSort>({
    field: 'created_at',
    direction: 'desc'
  });

  // تطبيق التصفية حسب التبويب النشط
  const getFilteredNotifications = () => {
    let currentFilter: NotificationFilter = { ...filter };
    
    switch (activeTab) {
      case 'unread':
        currentFilter.isRead = false;
        break;
      case 'read':
        currentFilter.isRead = true;
        break;
      case 'priority':
        currentFilter.priority = 'high';
        break;
    }
    
    let filtered = filterNotifications(currentFilter, sort);
    
    // تطبيق البحث النصي
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(term) || 
        n.message.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  };

  // تغيير التبويب النشط
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // تطبيق التصفية
  const applyFilter = (newFilter: NotificationFilter) => {
    setFilter(newFilter);
    setFilterOpen(false);
  };

  // إعادة تعيين التصفية
  const resetFilter = () => {
    setFilter({});
  };

  // تغيير طريقة الترتيب
  const handleSortChange = (value: string) => {
    const [field, direction] = value.split(':') as [
      'created_at' | 'priority' | 'type',
      'asc' | 'desc'
    ];
    
    setSort({ field, direction });
  };

  const filteredNotifications = getFilteredNotifications();

  // الحصول على نسبة الإشعارات المقروءة
  const getReadPercentage = () => {
    if (!stats || stats.total === 0) return 0;
    return Math.round(((stats.total - stats.unread) / stats.total) * 100);
  };

  return (
    <div className="container px-2 sm:px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-900/20 mr-3">
              <Bell className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-500">
                الإشعارات
              </h1>
              <p className="text-gray-400 text-sm">
                {stats?.total || 0} إشعار • {stats?.unread || 0} غير مقروء
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Input
                placeholder="بحث في الإشعارات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-9 bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-amber-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="bg-gray-900 border-gray-700 text-white hover:bg-gray-800 flex-1 sm:flex-none">
                    <Filter className="h-4 w-4 mr-2 text-amber-500" />
                    تصفية
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-gray-900 border-gray-700 text-white">
                  <SheetHeader>
                    <SheetTitle className="text-white flex items-center">
                      <Filter className="h-4 w-4 mr-2 text-amber-500" />
                      تصفية الإشعارات
                    </SheetTitle>
                  </SheetHeader>
                  
                  <div className="py-4">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block text-gray-200">
                          نوع الإشعار
                        </label>
                        <Select 
                          value={filter.type || ''} 
                          onValueChange={(value) => {
                            if (value === '') {
                              const newFilter = { ...filter };
                              delete newFilter.type;
                              setFilter(newFilter);
                            } else {
                              setFilter(prev => ({ ...prev, type: value as NotificationType }));
                            }
                          }}
                        >
                          <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-200">
                            <SelectValue placeholder="جميع الأنواع" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                            <SelectItem value="">جميع الأنواع</SelectItem>
                            <SelectItem value="system">النظام</SelectItem>
                            <SelectItem value="course_progress">تقدم الكورس</SelectItem>
                            <SelectItem value="pomodoro">البومودورو</SelectItem>
                            <SelectItem value="local_files">الملفات المحلية</SelectItem>
                            <SelectItem value="general_update">تحديثات عامة</SelectItem>
                            <SelectItem value="plan_completed">خطط الدراسة</SelectItem>
                            <SelectItem value="xp_earned">نقاط الخبرة</SelectItem>
                            <SelectItem value="weekly_event">الفعاليات</SelectItem>
                            <SelectItem value="achievement">الإنجازات</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-1 block text-gray-200">
                          الأولوية
                        </label>
                        <Select 
                          value={filter.priority || ''} 
                          onValueChange={(value) => {
                            if (value === '') {
                              const newFilter = { ...filter };
                              delete newFilter.priority;
                              setFilter(newFilter);
                            } else {
                              setFilter(prev => ({ ...prev, priority: value as NotificationPriority }));
                            }
                          }}
                        >
                          <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-200">
                            <SelectValue placeholder="جميع الأولويات" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                            <SelectItem value="">جميع الأولويات</SelectItem>
                            <SelectItem value="low">منخفضة</SelectItem>
                            <SelectItem value="normal">عادية</SelectItem>
                            <SelectItem value="high">عالية</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-1 block text-gray-200">
                          الحالة
                        </label>
                        <Select 
                          value={filter.status || ''} 
                          onValueChange={(value) => {
                            if (value === '') {
                              const newFilter = { ...filter };
                              delete newFilter.status;
                              setFilter(newFilter);
                            } else {
                              setFilter(prev => ({ ...prev, status: value as NotificationStatus }));
                            }
                          }}
                        >
                          <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-200">
                            <SelectValue placeholder="جميع الحالات" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                            <SelectItem value="">جميع الحالات</SelectItem>
                            <SelectItem value="unread">غير مقروءة</SelectItem>
                            <SelectItem value="read">مقروءة</SelectItem>
                            <SelectItem value="archived">مؤرشفة</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex gap-2">
                      <Button 
                        className="flex-1 bg-amber-600 hover:bg-amber-700 text-white border-none" 
                        onClick={() => applyFilter(filter)}
                      >
                        تطبيق
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white" 
                        onClick={resetFilter}
                      >
                        إعادة تعيين
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              
              <Select value={`${sort.field}:${sort.direction}`} onValueChange={handleSortChange}>
                <SelectTrigger className="w-full sm:w-[180px] bg-gray-900 border-gray-700 text-white flex-1 sm:flex-none">
                  <SelectValue placeholder="ترتيب حسب" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700 text-white">
                  <SelectItem value="created_at:desc">الأحدث أولاً</SelectItem>
                  <SelectItem value="created_at:asc">الأقدم أولاً</SelectItem>
                  <SelectItem value="priority:desc">الأولوية: من الأعلى</SelectItem>
                  <SelectItem value="priority:asc">الأولوية: من الأدنى</SelectItem>
                  <SelectItem value="type:asc">النوع: تصاعدي</SelectItem>
                  <SelectItem value="type:desc">النوع: تنازلي</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => refreshNotifications()}
                className="text-white hover:bg-gray-800"
              >
                <RefreshCw className="h-4 w-4 text-amber-500" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* الإحصائيات والقائمة الرئيسية */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-4">
        {/* الإحصائيات - تظهر في الأعلى على الموبايل وعلى الجانب في الشاشات الأكبر */}
        <motion.div 
          className="order-2 md:order-1 space-y-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* ملخص الإحصائيات - يظهر كبطاقة أفقية على الموبايل */}
          <Card className="bg-gray-900 border-gray-700 text-white overflow-hidden">
            <CardHeader className="pb-2 border-b border-gray-800">
              <CardTitle className="text-lg flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-amber-500" />
                ملخص الإشعارات
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-300">الإشعارات المقروءة</span>
                    <span className="font-medium text-amber-400">{getReadPercentage()}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2.5">
                    <div 
                      className="bg-gradient-to-r from-amber-500 to-amber-700 h-2.5 rounded-full" 
                      style={{ width: `${getReadPercentage()}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 gap-4">
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <div className="text-gray-400 text-xs mb-1">الإجمالي</div>
                    <div className="text-xl font-semibold">{stats?.total || 0}</div>
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <div className="text-gray-400 text-xs mb-1">غير مقروءة</div>
                    <div className="text-xl font-semibold text-amber-400">{stats?.unread || 0}</div>
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <div className="text-gray-400 text-xs mb-1">اليوم</div>
                    <div className="text-xl font-semibold">{stats?.today || 0}</div>
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <div className="text-gray-400 text-xs mb-1">عالية الأولوية</div>
                    <div className="text-xl font-semibold text-red-400">{stats?.byPriority?.high || 0}</div>
                  </div>
                </div>
              
                <Separator className="my-4 bg-gray-700" />
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2 text-gray-300 flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-amber-500" />
                      حسب النوع
                    </h4>
                    <div className="space-y-1 text-xs">
                      {stats?.byType && Object.entries(stats.byType).map(([type, count]) => (
                        count > 0 ? (
                          <div key={type} className="flex justify-between">
                            <span>{getTypeLabel(type)}</span>
                            <span>{count}</span>
                          </div>
                        ) : null
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-amber-700 text-amber-400 hover:bg-amber-900/30 hover:text-amber-300"
                    onClick={markAllAsRead}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    تعليم الكل كمقروء
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                    onClick={() => clearOldNotifications(30)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    حذف القديمة
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* إحصائيات الأولوية - تختفي على الشاشات الصغيرة جداً */}
          <Card className="bg-gray-900 border-gray-700 text-white hidden sm:block">
            <CardHeader className="pb-2 border-b border-gray-800">
              <CardTitle className="text-lg flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
                حسب الأولوية
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                {stats?.byPriority && (
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">عالية</span>
                          <span className="text-sm">{stats.byPriority.high}</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-1.5">
                          <div 
                            className="bg-red-500 h-1.5 rounded-full" 
                            style={{ width: `${stats.total ? (stats.byPriority.high / stats.total) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">عادية</span>
                          <span className="text-sm">{stats.byPriority.normal}</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-1.5">
                          <div 
                            className="bg-blue-500 h-1.5 rounded-full" 
                            style={{ width: `${stats.total ? (stats.byPriority.normal / stats.total) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">منخفضة</span>
                          <span className="text-sm">{stats.byPriority.low}</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-1.5">
                          <div 
                            className="bg-gray-500 h-1.5 rounded-full" 
                            style={{ width: `${stats.total ? (stats.byPriority.low / stats.total) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* قائمة الإشعارات - تظهر أولاً على الموبايل وتأخذ مساحة أكبر */}
        <motion.div 
          className="order-1 md:order-2 md:col-span-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-gray-900 border-gray-700 overflow-hidden">
            <CardHeader className="pb-0 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-800">
              <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="bg-gray-800 border border-gray-700 w-full">
                  <TabsTrigger value="all" className="flex-1 data-[state=active]:bg-amber-600 data-[state=active]:text-white">الكل</TabsTrigger>
                  <TabsTrigger value="unread" className="flex-1 data-[state=active]:bg-amber-600 data-[state=active]:text-white">غير مقروءة</TabsTrigger>
                  <TabsTrigger value="read" className="flex-1 data-[state=active]:bg-amber-600 data-[state=active]:text-white">مقروءة</TabsTrigger>
                  <TabsTrigger value="priority" className="flex-1 data-[state=active]:bg-amber-600 data-[state=active]:text-white">عالية الأولوية</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="p-0">
              {searchTerm && (
                <div className="p-2 bg-amber-900/20 text-amber-300 text-sm flex items-center justify-between">
                  <div className="flex items-center">
                    <Search className="h-4 w-4 mr-2" />
                    نتائج البحث عن: "{searchTerm}"
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 text-xs hover:bg-amber-900/30"
                    onClick={() => setSearchTerm('')}
                  >
                    <X className="h-3 w-3 mr-1" />
                    مسح
                  </Button>
                </div>
              )}
              
              <NotificationList 
                notifications={filteredNotifications} 
                loading={loading}
                emptyMessage={
                  searchTerm 
                    ? 'لا توجد نتائج مطابقة للبحث'
                    : activeTab === 'unread'
                    ? 'لا توجد إشعارات غير مقروءة'
                    : activeTab === 'priority'
                    ? 'لا توجد إشعارات عالية الأولوية'
                    : 'لا توجد إشعارات'
                }
                showActions={true}
                className="max-h-[600px] overflow-y-auto"
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

// وظائف مساعدة
function getTypeLabel(type: string): string {
  switch (type) {
    case 'course_progress':
      return 'تقدم الكورس';
    case 'pomodoro':
      return 'البومودورو';
    case 'local_files':
      return 'الملفات المحلية';
    case 'general_update':
      return 'تحديثات عامة';
    case 'system':
      return 'النظام';
    case 'weekly_event':
      return 'الفعاليات';
    case 'achievement':
      return 'الإنجازات';
    case 'plan_completed':
      return 'خطة الدراسة';
    case 'xp_earned':
      return 'نقاط الخبرة';
    case 'course_enrolled':
      return 'التسجيل في الدورات';
    case 'course_completed':
      return 'إكمال الدورات';
    default:
      return type;
  }
}

function getPriorityLabel(priority: string): string {
  switch (priority) {
    case 'low':
      return 'منخفضة';
    case 'normal':
      return 'عادية';
    case 'high':
      return 'عالية';
    default:
      return priority;
  }
} 