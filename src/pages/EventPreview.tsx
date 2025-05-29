import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useEventQuestions } from '@/hooks/useEventQuestions';
import {
  ArrowLeft,
  Clock,
  Users,
  Trophy,
  Eye,
  AlertTriangle
} from 'lucide-react';
import {
  WeeklyEvent,
  EventQuestion,
  QuestionCategory,
  EventCategory,
  QUESTION_CATEGORIES
} from '@/types/weeklyEvents';

const EventPreview: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, role } = useAuth();
  const [event, setEvent] = useState<WeeklyEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [previewAnswers, setPreviewAnswers] = useState<Record<number, any>>({});

  const {
    questions,
    loading: questionsLoading
  } = useEventQuestions(eventId ? parseInt(eventId) : null);

  // Check admin permission
  useEffect(() => {
    if (!user || role !== 'admin') {
      toast({
        title: "غير مصرح",
        description: "هذه الصفحة متاحة للمشرفين فقط",
        variant: "destructive",
      });
      navigate('/');
      return;
    }
  }, [user, role, navigate, toast]);

  // Load event data
  useEffect(() => {
    const loadEventData = async () => {
      if (!eventId) return;

      try {
        setLoading(true);

        const { data: eventData, error: eventError } = await supabase
          .from('weekly_events')
          .select('*')
          .eq('id', parseInt(eventId))
          .single();

        if (eventError || !eventData) {
          toast({
            title: "خطأ",
            description: "الفعالية غير موجودة",
            variant: "destructive",
          });
          navigate('/admin/weekly-events');
          return;
        }

        setEvent(eventData as WeeklyEvent);
      } catch (error) {
        console.error('Error loading event:', error);
        toast({
          title: "خطأ",
          description: "حدث خطأ في تحميل بيانات الفعالية",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadEventData();
  }, [eventId, navigate, toast]);

  const getQuestionCategoryLabel = (category: QuestionCategory): string => {
    return QUESTION_CATEGORIES[category] || category;
  };

  const getEventCategoryLabel = (category: EventCategory): string => {
    const categoryLabels = {
      'verbal': 'لفظي',
      'quantitative': 'كمي',
      'mixed': 'مختلط'
    };
    return categoryLabels[category] || category;
  };

  const handleAnswerChange = (questionId: number, answer: any) => {
    setPreviewAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const renderQuestion = (question: EventQuestion, index: number) => {
    const questionNumber = index + 1;
    const answer = previewAnswers[question.id];

    return (
      <Card key={question.id} className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg">
              السؤال {questionNumber}
              <Badge variant="outline" className="mr-2 text-xs">
                {getQuestionCategoryLabel(question.category)}
              </Badge>
            </CardTitle>
            <Badge variant="secondary" className="text-xs">
              معاينة
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Reading Comprehension Passage */}
          {question.question_type === 'reading_comprehension' && question.passage_text && (
            <div className="bg-muted/50 p-4 rounded-lg border-r-4 border-primary">
              <h4 className="font-semibold mb-2">النص:</h4>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {question.passage_text}
              </p>
            </div>
          )}

          {/* Question Image */}
          {question.question_type === 'image' && question.image_url && (
            <div className="flex justify-center">
              <img
                src={question.image_url}
                alt="سؤال"
                className="max-w-full h-auto rounded-lg border"
                style={{ maxHeight: '400px' }}
              />
            </div>
          )}

          {/* Question Text */}
          <div className="space-y-2">
            <p className="text-base font-medium leading-relaxed">
              {question.question_text}
            </p>
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {/* Check if question has valid options - if yes, show multiple choice, if no, show text area */}
            {question.options && Array.isArray(question.options) && question.options.length > 0 && question.options.some(option => option && option.trim()) ? (
              <RadioGroup
                value={answer?.toString() || ''}
                onValueChange={(value) => handleAnswerChange(question.id, parseInt(value))}
                disabled
              >
                <div className="space-y-3">
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center gap-3 p-3 border rounded-xl">
                      <RadioGroupItem
                        value={optionIndex.toString()}
                        id={`q${question.id}-option-${optionIndex}`}
                        disabled
                      />
                      <Label
                        htmlFor={`q${question.id}-option-${optionIndex}`}
                        className="font-medium cursor-pointer flex-1"
                      >
                        <span className="inline-block w-6 text-center font-bold">
                          {String.fromCharCode(65 + optionIndex)}.
                        </span>
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            ) : (
              <Textarea
                value={answer || ''}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                placeholder="اكتب إجابتك هنا... (معاينة فقط)"
                className="min-h-[100px] resize-none"
                disabled
              />
            )}
          </div>

          {/* Show correct answer for admin preview */}
          {question.options && Array.isArray(question.options) && question.options.length > 0 && question.options.some(option => option && option.trim()) && question.correct_answer >= 0 && question.correct_answer < question.options.length && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>الإجابة الصحيحة (للمعاينة فقط):</strong> {String.fromCharCode(65 + question.correct_answer)} - {question.options[question.correct_answer]}
              </p>
            </div>
          )}

          {/* Debug info for admin */}
          {(!question.options || !Array.isArray(question.options) || question.options.length === 0 || !question.options.some(option => option && option.trim())) && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                <strong>تحذير (للمعاينة فقط):</strong> هذا السؤال لا يحتوي على خيارات صحيحة. يرجى تعديل السؤال لإضافة الخيارات.
              </p>
              <p className="text-xs text-red-600 mt-1">
                البيانات الحالية: {JSON.stringify(question.options)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (loading || questionsLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4 max-w-4xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">جاري تحميل معاينة الاختبار...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!event) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4 max-w-4xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">الفعالية غير موجودة</h1>
            <Button onClick={() => navigate('/admin/weekly-events')}>
              العودة لإدارة الفعاليات
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate(`/admin/weekly-events/${eventId}/questions`)}
                variant="outline"
                size="icon"
                className="rounded-full flex-shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Eye className="w-5 h-5 text-primary" />
                  <h1 className="text-lg sm:text-2xl font-bold break-words">معاينة: {event.title}</h1>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="text-xs">{getEventCategoryLabel(event.category)}</Badge>
                  <Badge variant="secondary" className="text-xs">معاينة إدارية</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Notice */}
          <Card className="mb-6 border-amber-200 bg-amber-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-amber-800 mb-1">وضع المعاينة</h3>
                  <p className="text-sm text-amber-700">
                    هذه معاينة للاختبار كما سيراه الطلاب. الإجابات الصحيحة معروضة للمراجعة.
                    لا يمكن إرسال الإجابات في وضع المعاينة.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Event Info */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">المدة: {event.duration_minutes} دقيقة</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">عدد الأسئلة: {questions.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">نقاط الخبرة: {event.xp_reward}</span>
                </div>
              </div>
              {event.description && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Questions */}
          {questions.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">لا توجد أسئلة في هذه الفعالية بعد.</p>
                <Button
                  onClick={() => navigate(`/admin/weekly-events/${eventId}/questions/create`)}
                  className="mt-4"
                >
                  إضافة سؤال
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {questions.map((question, index) => renderQuestion(question, index))}
            </div>
          )}

          {/* Preview Actions */}
          {questions.length > 0 && (
            <Card className="mt-6">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => navigate(`/admin/weekly-events/${eventId}/questions`)}
                    variant="outline"
                  >
                    العودة لإدارة الأسئلة
                  </Button>
                  <Button
                    onClick={() => navigate(`/admin/weekly-events/${eventId}/questions/create`)}
                  >
                    إضافة سؤال جديد
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default EventPreview;
