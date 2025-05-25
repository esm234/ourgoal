import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Edit, Save, X } from 'lucide-react';
import { format, addDays, differenceInDays } from 'date-fns';
import { ar } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { StudyPlan } from '@/hooks/useStudyPlans';
import { toast } from 'sonner';

interface EditStudyPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studyPlan: StudyPlan;
  onSave: (updatedPlan: StudyPlan) => Promise<boolean>;
}

const EditStudyPlanDialog: React.FC<EditStudyPlanDialogProps> = ({
  open,
  onOpenChange,
  studyPlan,
  onSave
}) => {
  const [planName, setPlanName] = useState(studyPlan.name);
  const [reviewRounds, setReviewRounds] = useState(Math.min(studyPlan.review_rounds, 5));
  const [testDate, setTestDate] = useState(new Date(studyPlan.test_date));
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Calculate current plan stats
  const originalTestDate = new Date(studyPlan.test_date);
  const today = new Date();
  const daysUntilTest = Math.max(1, differenceInDays(testDate, today));
  const completedDays = studyPlan.study_days?.filter(day => day.completed)?.length || 0;

  const handleSave = async () => {
    if (!planName.trim()) {
      toast.error('يرجى إدخال اسم الخطة');
      return;
    }

    if (reviewRounds < 1 || reviewRounds > 5) {
      toast.error('عدد جولات المراجعة يجب أن يكون بين 1 و 5');
      return;
    }

    if (testDate <= today) {
      toast.error('تاريخ الاختبار يجب أن يكون في المستقبل');
      return;
    }

    // Use same validation as StudyPlanGenerator
    if (daysUntilTest < reviewRounds + 1) {
      toast.error(`تحتاج على الأقل ${reviewRounds + 1} أيام للخطة المطلوبة`);
      return;
    }

    setIsSaving(true);

    try {
      // Create updated plan with recalculated schedule
      const updatedPlan = await recalculateStudyPlan();

      const success = await onSave(updatedPlan);

      if (success) {
        toast.success('تم تحديث الخطة بنجاح');
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error updating plan:', error);
      toast.error('حدث خطأ في تحديث الخطة');
    } finally {
      setIsSaving(false);
    }
  };

  // Constants for test counts (same as StudyPlanGenerator)
  const VERBAL_TESTS = 108;
  const QUANTITATIVE_TESTS = 102;

  // Distribution function (same as StudyPlanGenerator)
  const distributeTests = (totalTests: number, days: number): number[] => {
    const baseTestsPerDay = Math.floor(totalTests / days);
    const remainder = totalTests % days;

    const distribution: number[] = new Array(days).fill(baseTestsPerDay);

    // Distribute remainder across different days
    for (let i = 0; i < remainder; i++) {
      distribution[i]++;
    }

    return distribution;
  };

  const recalculateStudyPlan = async (): Promise<StudyPlan> => {
    // Get existing completed days to preserve progress
    const existingCompletedDays = studyPlan.study_days?.reduce((acc, day) => {
      if (day.completed) {
        acc.add(day.dayNumber);
      }
      return acc;
    }, new Set<number>()) || new Set<number>();

    // Use the same algorithm as StudyPlanGenerator
    const todayForCalc = new Date();
    todayForCalc.setHours(0, 0, 0, 0);

    const totalDays = Math.ceil((testDate.getTime() - todayForCalc.getTime()) / (1000 * 60 * 60 * 24));
    const studyDays = totalDays - 1; // Reserve last day for final review
    const daysPerRound = Math.floor(studyDays / reviewRounds);
    const extraDays = studyDays % reviewRounds;

    const studyDaysList = [];
    let currentDay = 1;

    // Generate study days for each round (same logic as StudyPlanGenerator)
    for (let round = 1; round <= reviewRounds; round++) {
      const roundDays = daysPerRound + (round <= extraDays ? 1 : 0);

      // Distribute verbal and quantitative tests
      const verbalDistribution = distributeTests(VERBAL_TESTS, roundDays);
      const quantitativeDistribution = distributeTests(QUANTITATIVE_TESTS, roundDays);

      // Track running totals for ranges (reset for each round)
      let verbalRunningTotal = 0;
      let quantitativeRunningTotal = 0;

      for (let dayInRound = 0; dayInRound < roundDays; dayInRound++) {
        const currentDate = new Date(todayForCalc);
        currentDate.setDate(todayForCalc.getDate() + currentDay - 1);

        const verbalCount = verbalDistribution[dayInRound];
        const quantitativeCount = quantitativeDistribution[dayInRound];

        // Calculate ranges
        const verbalStart = verbalRunningTotal + 1;
        const verbalEnd = verbalRunningTotal + verbalCount;
        const quantitativeStart = quantitativeRunningTotal + 1;
        const quantitativeEnd = quantitativeRunningTotal + quantitativeCount;

        studyDaysList.push({
          dayNumber: currentDay,
          date: currentDate,
          verbalTests: verbalCount,
          quantitativeTests: quantitativeCount,
          totalTests: verbalCount + quantitativeCount,
          verbalRange: { start: verbalStart, end: verbalEnd },
          quantitativeRange: { start: quantitativeStart, end: quantitativeEnd },
          isReviewDay: false,
          isFinalReview: false,
          roundNumber: round,
          completed: existingCompletedDays.has(currentDay)
        });

        // Update running totals
        verbalRunningTotal += verbalCount;
        quantitativeRunningTotal += quantitativeCount;
        currentDay++;
      }
    }

    // Add final review day (same as StudyPlanGenerator)
    const finalReviewDay = {
      dayNumber: totalDays,
      date: new Date(testDate),
      verbalTests: 0,
      quantitativeTests: 0,
      totalTests: 0,
      verbalRange: { start: 0, end: 0 },
      quantitativeRange: { start: 0, end: 0 },
      isReviewDay: true,
      isFinalReview: true,
      roundNumber: reviewRounds + 1,
      completed: existingCompletedDays.has(totalDays)
    };

    return {
      name: planName.trim(),
      total_days: totalDays,
      review_rounds: reviewRounds,
      test_date: testDate.toISOString(),
      study_days: studyDaysList,
      final_review_day: finalReviewDay,
      created_at: studyPlan.created_at
    };
  };

  const resetForm = () => {
    setPlanName(studyPlan.name);
    setReviewRounds(Math.min(studyPlan.review_rounds, 5));
    setTestDate(new Date(studyPlan.test_date));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            تعديل خطة الدراسة
          </DialogTitle>
          <DialogDescription>
            يمكنك تعديل اسم الخطة، عدد جولات المراجعة، وتاريخ الاختبار. سيتم إعادة حساب الجدول مع الحفاظ على تقدمك الحالي.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Plan Name */}
          <div className="space-y-2">
            <Label htmlFor="planName">اسم الخطة</Label>
            <Input
              id="planName"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              placeholder="أدخل اسم الخطة"
            />
          </div>

          {/* Review Rounds */}
          <div className="space-y-2">
            <Label htmlFor="reviewRounds">عدد جولات المراجعة</Label>
            <Input
              id="reviewRounds"
              type="number"
              min="1"
              max="5"
              value={reviewRounds}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 1;
                setReviewRounds(Math.min(Math.max(value, 1), 5));
              }}
            />
            <p className="text-sm text-muted-foreground">
              الحالي: {studyPlan.review_rounds} جولات • الحد الأقصى: 5 جولات
            </p>
            {studyPlan.review_rounds > 5 && (
              <p className="text-sm text-amber-600 bg-amber-50 p-2 rounded">
                ⚠️ خطتك الحالية تحتوي على {studyPlan.review_rounds} جولات. سيتم تقليلها إلى 5 جولات كحد أقصى.
              </p>
            )}
          </div>

          {/* Test Date */}
          <div className="space-y-2">
            <Label>تاريخ الاختبار</Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !testDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {testDate ? format(testDate, 'dd MMMM yyyy', { locale: ar }) : "اختر التاريخ"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={testDate}
                  onSelect={(date) => {
                    if (date) {
                      setTestDate(date);
                      setIsCalendarOpen(false);
                    }
                  }}
                  disabled={(date) => date <= today}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <p className="text-sm text-muted-foreground">
              التاريخ الحالي: {format(originalTestDate, 'dd MMMM yyyy', { locale: ar })}
            </p>
          </div>

          {/* Plan Summary */}
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <h4 className="font-medium">ملخص الخطة الجديدة:</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">الأيام المتبقية:</span>
                <span className="font-medium mr-2">{daysUntilTest} يوم</span>
              </div>
              <div>
                <span className="text-muted-foreground">الأيام المكتملة:</span>
                <span className="font-medium mr-2">{completedDays} يوم</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              💡 سيتم إعادة حساب الخطة باستخدام نفس خوارزمية مولد الخطة مع الحفاظ على تقدمك الحالي
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => {
              resetForm();
              onOpenChange(false);
            }}
            disabled={isSaving}
          >
            <X className="h-4 w-4 mr-2" />
            إلغاء
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gradient-to-r from-primary to-accent text-black"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditStudyPlanDialog;
