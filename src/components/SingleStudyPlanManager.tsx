import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, Calendar, Clock, RotateCcw, Edit, Eye, CheckCircle, Lock } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { StudyPlan } from '@/hooks/useStudyPlans';
import { useCompletedDays } from '@/hooks/useCompletedDays';
import { toast } from 'sonner';
import EditStudyPlanDialog from './EditStudyPlanDialog';

interface SingleStudyPlanManagerProps {
  studyPlan: StudyPlan | null;
  onDelete: () => Promise<boolean>;
  onUpdate: (updatedPlan: StudyPlan) => Promise<boolean>;
  onComplete?: () => Promise<boolean>;
  onViewDetails: (plan: StudyPlan) => void;
}

const SingleStudyPlanManager: React.FC<SingleStudyPlanManagerProps> = ({
  studyPlan,
  onDelete,
  onUpdate,
  onComplete,
  onViewDetails
}) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { areAllDaysCompleted, getRemainingCompletionsToday, DAILY_COMPLETION_LIMIT } = useCompletedDays();

  const handleDelete = async () => {
    const success = await onDelete();
    if (success) {
      toast.success('تم حذف خطة الدراسة بنجاح');
    }
  };

  const handleUpdate = async (updatedPlan: StudyPlan) => {
    const success = await onUpdate(updatedPlan);
    return success;
  };

  const handleComplete = async () => {
    if (onComplete) {
      const success = await onComplete();
      if (success) {
        toast.success('تم إكمال الخطة وحفظها في الخطط المكتملة!');
      }
    }
  };

  // Check if all days are completed
  const allDaysCompleted = studyPlan ? areAllDaysCompleted(studyPlan) : false;
  const remainingCompletions = getRemainingCompletionsToday();

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
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg md:text-xl">{studyPlan.name}</CardTitle>
            <CardDescription className="mt-2 space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span className="break-words">تاريخ الاختبار: {format(new Date(studyPlan.test_date), 'dd MMMM yyyy', { locale: ar })}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span>مدة الدراسة: {studyPlan.total_days} يوم</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <RotateCcw className="h-4 w-4 flex-shrink-0" />
                <span>جولات المراجعة: {studyPlan.review_rounds}</span>
              </div>
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 lg:flex-shrink-0">
            <Button
              onClick={() => onViewDetails(studyPlan)}
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
            >
              <Eye className="h-4 w-4 ml-2" />
              <span className="hidden sm:inline">عرض التفاصيل</span>
              <span className="sm:hidden">عرض</span>
            </Button>
            <Button
              onClick={() => setIsEditDialogOpen(true)}
              variant="outline"
              size="sm"
              className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 w-full sm:w-auto"
            >
              <Edit className="h-4 w-4 ml-2" />
              تعديل
            </Button>
            {onComplete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!allDaysCompleted}
                    className={`w-full sm:w-auto ${
                      allDaysCompleted
                        ? 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200'
                        : 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                    }`}
                    title={!allDaysCompleted ? 'يجب إكمال جميع أيام الخطة أولاً' : ''}
                  >
                    {allDaysCompleted ? (
                      <CheckCircle className="h-4 w-4 ml-2" />
                    ) : (
                      <Lock className="h-4 w-4 ml-2" />
                    )}
                    إكمال
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>إكمال خطة الدراسة</AlertDialogTitle>
                    <AlertDialogDescription>
                      هل تريد إكمال خطة الدراسة "{studyPlan.name}" وحفظها في الخطط المكتملة؟
                      <br /><br />
                      <strong>ملاحظة:</strong> سيتم تعليم جميع أيام الخطة كـ "مكتملة" للحصول على نقاط الخبرة الكاملة ({(studyPlan.study_days.length + 1) * 100} XP).
                      <br />
                      يمكنك بعدها إنشاء خطة جديدة والاحتفاظ بنقاط الخبرة المكتسبة.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                    <AlertDialogAction onClick={handleComplete} className="bg-green-600 text-white hover:bg-green-700">
                      إكمال الخطة
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="w-full sm:w-auto">
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

        {/* Daily Completion Limit Info */}
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            📅 <strong>الحد اليومي:</strong> يمكنك إكمال {DAILY_COMPLETION_LIMIT} أيام كحد أقصى في اليوم الواحد.
            {remainingCompletions > 0 ? (
              <span className="text-green-600"> متبقي اليوم: {remainingCompletions} أيام</span>
            ) : (
              <span className="text-orange-600"> وصلت للحد الأقصى اليوم!</span>
            )}
          </p>
        </div>

        {/* Plan Completion Status */}
        {!allDaysCompleted && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              🔒 <strong>إكمال الخطة:</strong> يجب إكمال جميع أيام الخطة قبل أن تتمكن من إكمالها ونقلها للخطط المكتملة.
            </p>
          </div>
        )}

        <div className="mt-4 p-4 bg-muted rounded-lg">
          <p className="text-sm">
            💡 <strong>ملاحظة:</strong> يمكنك حفظ خطة دراسة واحدة فقط في ملفك الشخصي.
            لحفظ خطة جديدة، يجب حذف الخطة الحالية أولاً.
          </p>
        </div>
      </CardContent>

      {/* Edit Dialog */}
      {studyPlan && (
        <EditStudyPlanDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          studyPlan={studyPlan}
          onSave={handleUpdate}
        />
      )}
    </Card>
  );
};

export default SingleStudyPlanManager;
