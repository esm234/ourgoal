import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Shield, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { safeCacheClear, forceRefreshWithDataPreservation } from '@/utils/dataBackup';

const CacheManager = () => {
  const [isClearing, setIsClearing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleSafeCacheClear = async () => {
    setIsClearing(true);
    try {
      await safeCacheClear();
      toast.success('تم تنظيف الذاكرة المؤقتة مع الحفاظ على بياناتك المهمة! 🎉');

      // Auto refresh after 2 seconds
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('Cache clear failed:', error);
      toast.error('فشل في تنظيف الذاكرة المؤقتة. جرب مرة أخرى.');
    } finally {
      setIsClearing(false);
    }
  };

  const handleForceRefresh = () => {
    setIsRefreshing(true);
    toast.info('جاري إعادة تحميل الصفحة مع الحفاظ على البيانات...');
    forceRefreshWithDataPreservation();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-500" />
          إدارة الذاكرة المؤقتة
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          أدوات لتنظيف الذاكرة المؤقتة مع الحفاظ على بياناتك المهمة
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Safe Cache Clear */}
        <div className="p-4 border rounded-lg bg-green-50/50 dark:bg-green-950/20">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                تنظيف آمن للذاكرة المؤقتة
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                ينظف الذاكرة المؤقتة مع الحفاظ على:
              </p>
              <div className="flex flex-wrap gap-1 mb-3">
                <Badge variant="secondary" className="text-xs">بيانات البومودورو</Badge>
                <Badge variant="secondary" className="text-xs">تقدم الخطة الدراسية</Badge>
                <Badge variant="secondary" className="text-xs">الإعدادات الشخصية</Badge>
                <Badge variant="secondary" className="text-xs">تفضيلات الصوت</Badge>
              </div>
            </div>
            <Button
              onClick={handleSafeCacheClear}
              disabled={isClearing}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isClearing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  جاري التنظيف...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  تنظيف آمن
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Force Refresh */}
        <div className="p-4 border rounded-lg bg-blue-50/50 dark:bg-blue-950/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">
                إعادة تحميل مع حفظ البيانات
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                يعيد تحميل الصفحة مع الحفاظ على جميع بياناتك
              </p>
            </div>
            <Button
              onClick={handleForceRefresh}
              disabled={isRefreshing}
              variant="outline"
              className="border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              {isRefreshing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  جاري التحميل...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  إعادة تحميل
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Warning */}
        <div className="p-3 border border-orange-200 rounded-lg bg-orange-50/50 dark:bg-orange-950/20">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-orange-700 dark:text-orange-300">
              <strong>تنبيه:</strong> تجنب استخدام "Clear Application Cache" من Developer Tools
              لأنه سيمسح جميع البيانات. استخدم الأدوات أعلاه للحفاظ على بياناتك المهمة مثل بيانات البومودورو والخطط الدراسية.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CacheManager;
