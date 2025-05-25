import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  BookOpen,
  Calculator,
  Image,
  FileText,
  Eye,
  Settings,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useEventQuestions } from '@/hooks/useEventQuestions';
import {
  WeeklyEvent,
  EventQuestion,
  QuestionType,
  QuestionCategory,
  QUESTION_TYPES,
  QUESTION_CATEGORIES
} from '@/types/weeklyEvents';

const AdminEventQuestions: React.FC = () => {
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<WeeklyEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'all' | 'text' | 'image' | 'reading_comprehension'>('all');

  const {
    questions,
    readingGroups,
    loading: questionsLoading,
    loadQuestions,
    getQuestionsByType,
    getQuestionsByCategory
  } = useEventQuestions(eventId ? parseInt(eventId) : null);

  // Load event details
  useEffect(() => {
    const loadEvent = async () => {
      if (!eventId) return;

      try {
        const { data, error } = await supabase
          .from('weekly_events')
          .select('*')
          .eq('id', eventId)
          .single();

        if (error) {
          throw error;
        }

        setEvent(data);
      } catch (error) {
        console.error('Error loading event:', error);
        toast.error('حدث خطأ في تحميل بيانات الفعالية');
        navigate('/admin/weekly-events');
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [eventId, navigate]);

  const getTabQuestions = () => {
    switch (selectedTab) {
      case 'text': return getQuestionsByType('text');
      case 'image': return getQuestionsByType('image');
      case 'reading_comprehension': return getQuestionsByType('reading_comprehension');
      default: return questions;
    }
  };

  const handleCreateQuestion = () => {
    navigate(`/admin/weekly-events/${eventId}/questions/create`);
  };

  const handleEditQuestion = (questionId: number) => {
    navigate(`/admin/weekly-events/${eventId}/questions/${questionId}/edit`);
  };

  const handleDeleteQuestion = async (questionId: number) => {
    if (confirm('هل أنت متأكد من حذف هذا السؤال؟')) {
      try {
        const { error } = await supabase
          .from('event_questions')
          .delete()
          .eq('id', questionId);

        if (error) {
          throw error;
        }

        toast.success('تم حذف السؤال بنجاح');
        loadQuestions();
      } catch (error) {
        console.error('Error deleting question:', error);
        toast.error('حدث خطأ في حذف السؤال');
      }
    }
  };

  const handlePreviewEvent = () => {
    navigate(`/weekly-events/${eventId}/preview`);
  };

  if (loading || questionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري تحميل الأسئلة...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">فعالية غير موجودة</h2>
          <p className="text-muted-foreground mb-4">لم يتم العثور على الفعالية المطلوبة</p>
          <Button onClick={() => navigate('/admin/weekly-events')}>
            العودة للفعاليات
          </Button>
        </div>
      </div>
    );
  }

  const textQuestions = getQuestionsByType('text');
  const imageQuestions = getQuestionsByType('image');
  const readingQuestions = getQuestionsByType('reading_comprehension');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <Button
              onClick={() => navigate('/admin/weekly-events')}
              variant="outline"
              size="icon"
              className="rounded-full"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">إدارة أسئلة الفعالية</h1>
              <p className="text-muted-foreground">{event.title}</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handlePreviewEvent}
                variant="outline"
                className="hidden md:flex"
              >
                <Eye className="w-4 h-4 mr-2" />
                معاينة
              </Button>
              <Button
                onClick={handleCreateQuestion}
                className="bg-gradient-to-r from-primary to-accent text-black font-bold"
              >
                <Plus className="w-4 h-4 mr-2" />
                إضافة سؤال
              </Button>
            </div>
          </div>

          {/* Event Info Card */}
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{questions.length}</div>
                  <div className="text-sm text-muted-foreground">إجمالي الأسئلة</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-500">{textQuestions.length}</div>
                  <div className="text-sm text-muted-foreground">أسئلة نصية</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-500">{imageQuestions.length}</div>
                  <div className="text-sm text-muted-foreground">أسئلة بصور</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-500">{readingQuestions.length}</div>
                  <div className="text-sm text-muted-foreground">استيعاب مقروء</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Questions Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as any)} dir="rtl" className="w-full">
            <div className="flex justify-center mb-6">
              <TabsList className="grid grid-cols-4 w-full max-w-3xl bg-transparent p-2">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-black font-bold py-2 px-4 rounded-lg"
                >
                  الكل ({questions.length})
                </TabsTrigger>
                <TabsTrigger
                  value="text"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white font-bold py-2 px-4 rounded-lg"
                >
                  نصية ({textQuestions.length})
                </TabsTrigger>
                <TabsTrigger
                  value="image"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white font-bold py-2 px-4 rounded-lg"
                >
                  بصور ({imageQuestions.length})
                </TabsTrigger>
                <TabsTrigger
                  value="reading_comprehension"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white font-bold py-2 px-4 rounded-lg"
                >
                  استيعاب ({readingQuestions.length})
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {getTabQuestions().length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center">
                    <FileText className="w-10 h-10 text-primary/50" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">لا توجد أسئلة</h3>
                  <p className="text-muted-foreground mb-4">ابدأ بإضافة أسئلة للفعالية</p>
                  <Button
                    onClick={handleCreateQuestion}
                    className="bg-gradient-to-r from-primary to-accent text-black font-bold"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    إضافة سؤال
                  </Button>
                </div>
              ) : (
                getTabQuestions().map((question, index) => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    index={index}
                    onEdit={handleEditQuestion}
                    onDelete={handleDeleteQuestion}
                  />
                ))
              )}
            </div>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

// Question Card Component
interface QuestionCardProps {
  question: EventQuestion;
  index: number;
  onEdit: (questionId: number) => void;
  onDelete: (questionId: number) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  index,
  onEdit,
  onDelete
}) => {
  const getQuestionTypeIcon = (type: QuestionType) => {
    switch (type) {
      case 'text': return FileText;
      case 'image': return Image;
      case 'reading_comprehension': return BookOpen;
      default: return FileText;
    }
  };

  const getQuestionTypeColor = (type: QuestionType) => {
    switch (type) {
      case 'text': return 'bg-blue-500';
      case 'image': return 'bg-green-500';
      case 'reading_comprehension': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category: QuestionCategory) => {
    return category === 'verbal' ? BookOpen : Calculator;
  };

  const TypeIcon = getQuestionTypeIcon(question.question_type);
  const CategoryIcon = getCategoryIcon(question.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Card className="bg-gradient-to-br from-card/90 to-card/60 border-0 rounded-2xl backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg">
                <TypeIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={`${getQuestionTypeColor(question.question_type)} text-white`}>
                    {QUESTION_TYPES.find(t => t.value === question.question_type)?.label}
                  </Badge>
                  <Badge variant="outline">
                    <CategoryIcon className="w-3 h-3 mr-1" />
                    {QUESTION_CATEGORIES.find(c => c.value === question.category)?.label}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  السؤال رقم {question.question_order}
                  {question.subcategory && ` • ${question.subcategory}`}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">الإجابة الصحيحة</div>
              <div className="text-lg font-bold text-green-600">
                {String.fromCharCode(65 + question.correct_answer)}
              </div>
            </div>
          </div>

          {/* Question Text */}
          <div className="mb-4">
            <p className="text-foreground leading-relaxed line-clamp-3">
              {question.question_text}
            </p>
          </div>

          {/* Image URL if exists */}
          {question.image_url && (
            <div className="mb-4 p-3 bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-lg">
              <div className="flex items-center gap-2 text-green-600">
                <Image className="w-4 h-4" />
                <span className="text-sm font-medium">يحتوي على صورة</span>
              </div>
            </div>
          )}

          {/* Reading Passage if exists */}
          {question.passage_text && (
            <div className="mb-4 p-3 bg-gradient-to-r from-purple-500/10 to-purple-600/10 rounded-lg">
              <div className="flex items-center gap-2 text-purple-600 mb-2">
                <BookOpen className="w-4 h-4" />
                <span className="text-sm font-medium">نص الاستيعاب</span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {question.passage_text}
              </p>
            </div>
          )}

          {/* Options */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {question.options.map((option, optionIndex) => (
              <div
                key={optionIndex}
                className={`p-2 rounded-lg text-sm ${
                  optionIndex === question.correct_answer
                    ? 'bg-green-500/20 border border-green-500/30 text-green-700'
                    : 'bg-background/50 border border-primary/20'
                }`}
              >
                <span className="font-medium mr-2">
                  {String.fromCharCode(65 + optionIndex)}.
                </span>
                {option}
                {optionIndex === question.correct_answer && (
                  <CheckCircle className="w-4 h-4 inline mr-2 text-green-600" />
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={() => onEdit(question.id)}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <Edit className="w-4 h-4 mr-2" />
              تعديل
            </Button>
            <Button
              onClick={() => onDelete(question.id)}
              variant="destructive"
              size="sm"
              className="flex-1"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              حذف
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AdminEventQuestions;
