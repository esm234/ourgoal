import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Download, Upload, Trash2, Shield, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { safeCacheClear, forceRefreshWithDataPreservation, exportUserData, importUserData } from '@/utils/dataBackup';

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

  const handleExportData = () => {
    try {
      const data = exportUserData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ourgoal-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('تم تصدير بياناتك بنجاح! 📁');
    } catch (error) {
      toast.error('فشل في تصدير البيانات');
    }
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = e.target?.result as string;
            importUserData(data);
            toast.success('تم استيراد البيانات بنجاح! 🎉');
            setTimeout(() => window.location.reload(), 1000);
          } catch (error) {
            toast.error('فشل في استيراد البيانات. تأكد من صحة الملف.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
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

        {/* Data Backup */}
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-3">نسخ احتياطي للبيانات</h3>
          <div className="flex gap-2">
            <Button
              onClick={handleExportData}
              variant="outline"
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              تصدير البيانات
            </Button>
            <Button
              onClick={handleImportData}
              variant="outline"
              className="flex-1"
            >
              <Upload className="w-4 h-4 mr-2" />
              استيراد البيانات
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            احفظ نسخة احتياطية من بياناتك قبل تنظيف الذاكرة المؤقتة
          </p>
        </div>

        {/* Warning */}
        <div className="p-3 border border-orange-200 rounded-lg bg-orange-50/50 dark:bg-orange-950/20">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-orange-700 dark:text-orange-300">
              <strong>تنبيه:</strong> تجنب استخدام "Clear Application Cache" من Developer Tools 
              لأنه سيمسح جميع البيانات. استخدم الأدوات أعلاه للحفاظ على بياناتك.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CacheManager;
