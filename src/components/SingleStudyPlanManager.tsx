import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, Calendar, Clock, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { StudyPlan } from '@/hooks/useStudyPlans';
import { toast } from 'sonner';

interface SingleStudyPlanManagerProps {
  studyPlan: StudyPlan | null;
  onDelete: () => Promise<boolean>;
  onViewDetails: (plan: StudyPlan) => void;
}

const SingleStudyPlanManager: React.FC<SingleStudyPlanManagerProps> = ({
  studyPlan,
  onDelete,
  onViewDetails
}) => {
  const handleDelete = async () => {
    const success = await onDelete();
    if (success) {
      toast.success('تم حذف خطة الدراسة بنجاح');
    }
  };

  if (!studyPlan) {
    return (
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">لا توجد خطة دراسة محفوظة</CardTitle>
          <CardDescription>
            يمكنك إنشاء خطة دراسة جديدة من مولد خطط الدراسة
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">{studyPlan.name}</CardTitle>
            <CardDescription className="mt-2 space-y-1">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>تاريخ الاختبار: {format(new Date(studyPlan.test_date), 'dd MMMM yyyy', { locale: ar })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>مدة الدراسة: {studyPlan.total_days} يوم</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                <span>جولات المراجعة: {studyPlan.review_rounds}</span>
              </div>
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => onViewDetails(studyPlan)}
              variant="outline"
              size="sm"
            >
              عرض التفاصيل
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 ml-2" />
                  حذف
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>تأكيد حذف خطة الدراسة</AlertDialogTitle>
                  <AlertDialogDescription>
                    هل أنت متأكد من حذف خطة الدراسة "{studyPlan.name}"؟ 
                    هذا الإجراء لا يمكن التراجع عنه.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>إلغاء</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    حذف
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          تم الإنشاء: {format(new Date(studyPlan.created_at), 'dd MMMM yyyy - HH:mm', { locale: ar })}
        </div>
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <p className="text-sm">
            💡 <strong>ملاحظة:</strong> يمكنك حفظ خطة دراسة واحدة فقط في ملفك الشخصي. 
            لحفظ خطة جديدة، يجب حذف الخطة الحالية أولاً.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SingleStudyPlanManager;
