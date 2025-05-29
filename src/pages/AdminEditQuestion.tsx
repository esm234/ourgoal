import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  ArrowLeft,
  Save,
  AlertCircle,
  FileText,
  Image,
  BookOpen,
  Calculator,
  Plus,
  Trash2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import {
  WeeklyEvent,
  EventQuestion,
  QuestionType,
  QuestionCategory,
  QUESTION_TYPES,
  QUESTION_CATEGORIES
} from '@/types/weeklyEvents';

const AdminEditQuestion: React.FC = () => {
  const navigate = useNavigate();
  const { eventId, questionId } = useParams<{ eventId: string; questionId: string }>();
  const [event, setEvent] = useState<WeeklyEvent | null>(null);
  const [question, setQuestion] = useState<EventQuestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState({
    question_text: '',
    question_type: 'text' as QuestionType,
    image_url: '',
    passage_text: '',
    category: 'verbal' as QuestionCategory,
    subcategory: '',
    options: ['', '', '', ''],
    correct_answer: 0
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load event and question data
  useEffect(() => {
    const loadData = async () => {
      if (!eventId || !questionId) return;

      try {
        setInitialLoading(true);

        // Load event
        const { data: eventData, error: eventError } = await supabase
          .from('weekly_events')
          .select('*')
          .eq('id', parseInt(eventId))
          .single();

        if (eventError) {
          throw eventError;
        }

        setEvent(eventData as WeeklyEvent);

        // Load question
        const { data: questionData, error: questionError } = await supabase
          .from('event_questions')
          .select('*')
          .eq('id', parseInt(questionId))
          .single();

        if (questionError) {
          throw questionError;
        }

        setQuestion(questionData as EventQuestion);

        // Populate form with existing data
        const options = Array.isArray(questionData.options) ? questionData.options.map(opt => String(opt)) : [];
        // Ensure we have at least 4 options for the form
        const paddedOptions = [...options];
        while (paddedOptions.length < 4) {
          paddedOptions.push('');
        }

        setFormData({
          question_text: questionData.question_text || '',
          question_type: questionData.question_type as QuestionType,
          image_url: questionData.image_url || '',
          passage_text: questionData.passage_text || '',
          category: questionData.category as QuestionCategory,
          subcategory: questionData.subcategory || '',
          options: paddedOptions,
          correct_answer: questionData.correct_answer
        });

      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('حدث خطأ في تحميل بيانات السؤال');
        navigate(`/admin/weekly-events/${eventId}/questions`);
      } finally {
        setInitialLoading(false);
      }
    };

    loadData();
  }, [eventId, questionId, navigate]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Question text is only required for non-image questions
    if (formData.question_type !== 'image' && !formData.question_text.trim()) {
      newErrors.question_text = 'نص السؤال مطلوب';
    }

    if (formData.question_type === 'image' && !formData.image_url.trim()) {
      newErrors.image_url = 'رابط الصورة مطلوب للأسئلة المصورة';
    }

    if (formData.question_type === 'reading_comprehension' && !formData.passage_text.trim()) {
      newErrors.passage_text = 'نص الاستيعاب مطلوب لأسئلة الاستيعاب المقروء';
    }

    // Validate options
    const filledOptions = formData.options.filter(option => option.trim());
    if (filledOptions.length < 2) {
      newErrors.options = 'يجب إدخال خيارين على الأقل';
    }

    // Validate correct answer
    if (formData.correct_answer >= filledOptions.length) {
      newErrors.correct_answer = 'يجب اختيار إجابة صحيحة من الخيارات المتاحة';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('يرجى تصحيح الأخطاء في النموذج');
      return;
    }

    try {
      setLoading(true);

      // Filter out empty options
      const validOptions = formData.options.filter(option => option.trim());

      const updateData = {
        question_text: formData.question_text.trim(),
        question_type: formData.question_type,
        image_url: formData.question_type === 'image' ? formData.image_url.trim() : null,
        passage_text: formData.question_type === 'reading_comprehension' ? formData.passage_text.trim() : null,
        category: formData.category,
        subcategory: formData.subcategory.trim() || null,
        options: validOptions,
        correct_answer: formData.correct_answer
      };

      const { error } = await supabase
        .from('event_questions')
        .update(updateData)
        .eq('id', parseInt(questionId!));

      if (error) {
        throw error;
      }

      toast.success('تم تحديث السؤال بنجاح');
      navigate(`/admin/weekly-events/${eventId}/questions`);
    } catch (error) {
      console.error('Error updating question:', error);
      toast.error('حدث خطأ في تحديث السؤال');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({ ...prev, options: newOptions }));

    // Clear options error when user starts typing
    if (errors.options) {
      setErrors(prev => ({ ...prev, options: '' }));
    }
  };

  const addOption = () => {
    if (formData.options.length < 6) {
      setFormData(prev => ({
        ...prev,
        options: [...prev.options, '']
      }));
    }
  };

  const removeOption = (index: number) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        options: newOptions,
        correct_answer: prev.correct_answer >= newOptions.length ? 0 : prev.correct_answer
      }));
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">جاري تحميل بيانات السؤال...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event || !question) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">السؤال غير موجود</h1>
            <Button onClick={() => navigate(`/admin/weekly-events/${eventId}/questions`)}>
              العودة لإدارة الأسئلة
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <Button
              onClick={() => navigate(`/admin/weekly-events/${eventId}/questions`)}
              variant="outline"
              size="icon"
              className="rounded-full"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">تعديل السؤال</h1>
              <p className="text-muted-foreground">{event.title}</p>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-card via-card/95 to-primary/5 border-primary/20 shadow-2xl">
            <CardHeader className="pb-6 bg-gradient-to-r from-primary/10 to-accent/10 border-b border-primary/20">
              <CardTitle className="text-xl flex items-center gap-2 text-foreground">
                <FileText className="w-5 h-5 text-primary" />
                تفاصيل السؤال
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Question Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-base font-medium text-foreground">نوع السؤال</Label>
                    <Select
                      value={formData.question_type}
                      onValueChange={(value: QuestionType) => handleInputChange('question_type', value)}
                    >
                      <SelectTrigger className="text-lg p-4 bg-background/50 border-primary/30 hover:border-primary/50 focus:border-primary">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {QUESTION_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              {type.value === 'text' && <FileText className="w-4 h-4" />}
                              {type.value === 'image' && <Image className="w-4 h-4" />}
                              {type.value === 'reading_comprehension' && <BookOpen className="w-4 h-4" />}
                              {type.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <Label className="text-base font-medium text-foreground">التصنيف</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value: QuestionCategory) => handleInputChange('category', value)}
                    >
                      <SelectTrigger className="text-lg p-4 bg-background/50 border-primary/30 hover:border-primary/50 focus:border-primary">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {QUESTION_CATEGORIES.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            <div className="flex items-center gap-2">
                              {category.value === 'verbal' ? <BookOpen className="w-4 h-4" /> : <Calculator className="w-4 h-4" />}
                              {category.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Subcategory */}
                <div className="space-y-2">
                  <Label htmlFor="subcategory" className="text-base font-medium text-foreground">
                    التصنيف الفرعي (اختياري)
                  </Label>
                  <Input
                    id="subcategory"
                    value={formData.subcategory}
                    onChange={(e) => handleInputChange('subcategory', e.target.value)}
                    placeholder="مثال: استيعاب مقروء، تناظر لفظي، إكمال الجمل..."
                    className="text-lg p-4 bg-background/50 border-primary/30 hover:border-primary/50 focus:border-primary"
                  />
                </div>

                {/* Reading Passage (for reading comprehension) */}
                {formData.question_type === 'reading_comprehension' && (
                  <div className="space-y-2">
                    <Label htmlFor="passage_text" className="text-base font-medium text-foreground">
                      نص الاستيعاب المقروء *
                    </Label>
                    <Textarea
                      id="passage_text"
                      value={formData.passage_text}
                      onChange={(e) => handleInputChange('passage_text', e.target.value)}
                      placeholder="اكتب النص المراد قراءته وفهمه..."
                      className={`min-h-[150px] text-base bg-background/50 border-primary/30 hover:border-primary/50 focus:border-primary ${errors.passage_text ? 'border-red-500' : ''}`}
                    />
                    {errors.passage_text && (
                      <div className="flex items-center gap-2 text-red-500 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {errors.passage_text}
                      </div>
                    )}
                  </div>
                )}

                {/* Image URL (for image questions) */}
                {formData.question_type === 'image' && (
                  <div className="space-y-2">
                    <Label htmlFor="image_url" className="text-base font-medium text-foreground">
                      رابط الصورة *
                    </Label>
                    <Input
                      id="image_url"
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => handleInputChange('image_url', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className={`text-lg p-4 bg-background/50 border-primary/30 hover:border-primary/50 focus:border-primary ${errors.image_url ? 'border-red-500' : ''}`}
                    />
                    {errors.image_url && (
                      <div className="flex items-center gap-2 text-red-500 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {errors.image_url}
                      </div>
                    )}
                  </div>
                )}

                {/* Question Text */}
                <div className="space-y-2">
                  <Label htmlFor="question_text" className="text-base font-medium text-foreground">
                    نص السؤال {formData.question_type !== 'image' ? '*' : '(اختياري للأسئلة المصورة)'}
                  </Label>
                  <Textarea
                    id="question_text"
                    value={formData.question_text}
                    onChange={(e) => handleInputChange('question_text', e.target.value)}
                    placeholder={
                      formData.question_type === 'image'
                        ? "نص إضافي للسؤال (اختياري)..."
                        : "اكتب نص السؤال هنا..."
                    }
                    className={`min-h-[100px] text-base bg-background/50 border-primary/30 hover:border-primary/50 focus:border-primary ${errors.question_text ? 'border-red-500' : ''}`}
                  />
                  {errors.question_text && (
                    <div className="flex items-center gap-2 text-red-500 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.question_text}
                    </div>
                  )}
                </div>

                {/* Options */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium text-foreground">الخيارات *</Label>
                    {formData.options.length < 6 && (
                      <Button
                        type="button"
                        onClick={addOption}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 border-primary/30 hover:border-primary hover:bg-primary/10"
                      >
                        <Plus className="w-4 h-4" />
                        إضافة خيار
                      </Button>
                    )}
                  </div>

                  {errors.options && (
                    <div className="flex items-center gap-2 text-red-500 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.options}
                    </div>
                  )}

                  <RadioGroup
                    value={formData.correct_answer.toString()}
                    onValueChange={(value) => handleInputChange('correct_answer', parseInt(value))}
                  >
                    <div className="space-y-3">
                      {formData.options.map((option, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 border border-primary/20 rounded-xl bg-background/30 hover:bg-background/50 transition-colors">
                          <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                          <Label htmlFor={`option-${index}`} className="font-medium text-foreground">
                            {String.fromCharCode(65 + index)}.
                          </Label>
                          <Input
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            placeholder={`الخيار ${String.fromCharCode(65 + index)}`}
                            className="flex-1 bg-background/50 border-primary/30 hover:border-primary/50 focus:border-primary"
                          />
                          {formData.options.length > 2 && (
                            <Button
                              type="button"
                              onClick={() => removeOption(index)}
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </RadioGroup>

                  {errors.correct_answer && (
                    <div className="flex items-center gap-2 text-red-500 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.correct_answer}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-6 border-t border-primary/20">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(`/admin/weekly-events/${eventId}/questions`)}
                    className="flex-1 border-primary/30 hover:border-primary hover:bg-primary/10"
                  >
                    إلغاء
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-black font-bold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                        جاري التحديث...
                      </div>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        حفظ التغييرات
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminEditQuestion;
