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
  Target,
  Plus,
  Trash2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import {
  WeeklyEvent,
  QuestionType,
  QuestionCategory,
  CreateQuestionRequest,
  QUESTION_TYPES,
  QUESTION_CATEGORIES
} from '@/types/weeklyEvents';

const AdminCreateQuestion: React.FC = () => {
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<WeeklyEvent | null>(null);
  const [loading, setLoading] = useState(false);
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
      }
    };

    loadEvent();
  }, [eventId, navigate]);

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

    // Check if correct answer is valid
    if (!formData.options[formData.correct_answer]?.trim()) {
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

    if (!eventId) return;

    setLoading(true);

    try {
      // Get next question order
      const { data: existingQuestions, error: countError } = await supabase
        .from('event_questions')
        .select('question_order')
        .eq('event_id', eventId)
        .order('question_order', { ascending: false })
        .limit(1);

      if (countError) {
        throw countError;
      }

      const nextOrder = existingQuestions.length > 0 ? existingQuestions[0].question_order + 1 : 1;

      // Filter out empty options
      const validOptions = formData.options.filter(option => option.trim());

      const questionData: CreateQuestionRequest = {
        event_id: parseInt(eventId),
        question_text: formData.question_text.trim(),
        question_type: formData.question_type,
        image_url: formData.question_type === 'image' ? formData.image_url.trim() : null,
        passage_text: formData.question_type === 'reading_comprehension' ? formData.passage_text.trim() : null,
        category: formData.category,
        subcategory: formData.subcategory.trim() || null,
        question_order: nextOrder,
        options: validOptions,
        correct_answer: formData.correct_answer
      };

      const { data, error } = await supabase
        .from('event_questions')
        .insert([questionData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast.success('تم إنشاء السؤال بنجاح');
      navigate(`/admin/weekly-events/${eventId}/questions`);
    } catch (error) {
      console.error('Error creating question:', error);
      toast.error('حدث خطأ في إنشاء السؤال');
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

    // Clear errors
    if (errors.options) {
      setErrors(prev => ({ ...prev, options: '' }));
    }
  };

  const addOption = () => {
    if (formData.options.length < 6) {
      setFormData(prev => ({ ...prev, options: [...prev.options, ''] }));
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

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري التحميل...</p>
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
              <h1 className="text-3xl font-bold">إضافة سؤال جديد</h1>
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
          <Card className="bg-gradient-to-br from-card/90 to-card/60 border-0 rounded-3xl backdrop-blur-xl shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <FileText className="w-6 h-6 text-primary" />
                تفاصيل السؤال
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Question Type and Category */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="question_type" className="text-base font-medium">
                      نوع السؤال *
                    </Label>
                    <Select
                      value={formData.question_type}
                      onValueChange={(value) => handleInputChange('question_type', value as QuestionType)}
                    >
                      <SelectTrigger className="text-lg p-4">
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

                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-base font-medium">
                      فئة السؤال *
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleInputChange('category', value as QuestionCategory)}
                    >
                      <SelectTrigger className="text-lg p-4">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {QUESTION_CATEGORIES.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            <div className="flex items-center gap-2">
                              {category.value === 'verbal' ? (
                                <BookOpen className="w-4 h-4" />
                              ) : (
                                <Calculator className="w-4 h-4" />
                              )}
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
                  <Label htmlFor="subcategory" className="text-base font-medium">
                    الفئة الفرعية (اختياري)
                  </Label>
                  <Input
                    id="subcategory"
                    value={formData.subcategory}
                    onChange={(e) => handleInputChange('subcategory', e.target.value)}
                    placeholder="مثال: استيعاب مقروء، تناظر لفظي، إلخ"
                    className="text-lg p-4"
                  />
                </div>

                {/* Reading Passage (for reading comprehension) */}
                {formData.question_type === 'reading_comprehension' && (
                  <div className="space-y-2">
                    <Label htmlFor="passage_text" className="text-base font-medium">
                      نص الاستيعاب المقروء *
                    </Label>
                    <Textarea
                      id="passage_text"
                      value={formData.passage_text}
                      onChange={(e) => handleInputChange('passage_text', e.target.value)}
                      placeholder="اكتب النص المراد قراءته وفهمه..."
                      className={`min-h-[150px] text-base ${errors.passage_text ? 'border-red-500' : ''}`}
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
                    <Label htmlFor="image_url" className="text-base font-medium">
                      رابط الصورة *
                    </Label>
                    <Input
                      id="image_url"
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => handleInputChange('image_url', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className={`text-lg p-4 ${errors.image_url ? 'border-red-500' : ''}`}
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
                  <Label htmlFor="question_text" className="text-base font-medium">
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
                    className={`min-h-[100px] text-base ${errors.question_text ? 'border-red-500' : ''}`}
                  />
                  {errors.question_text && (
                    <div className="flex items-center gap-2 text-red-500 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.question_text}
                    </div>
                  )}
                  {formData.question_type === 'image' && (
                    <div className="text-sm text-muted-foreground">
                      💡 للأسئلة المصورة، يمكن ترك هذا الحقل فارغاً إذا كانت الصورة تحتوي على السؤال كاملاً
                    </div>
                  )}
                </div>

                {/* Options */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium">
                      خيارات الإجابة *
                    </Label>
                    {formData.options.length < 6 && (
                      <Button
                        type="button"
                        onClick={addOption}
                        variant="outline"
                        size="sm"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        إضافة خيار
                      </Button>
                    )}
                  </div>

                  <RadioGroup
                    value={formData.correct_answer.toString()}
                    onValueChange={(value) => handleInputChange('correct_answer', parseInt(value))}
                  >
                    <div className="space-y-3">
                      {formData.options.map((option, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 border rounded-xl">
                          <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                          <Label htmlFor={`option-${index}`} className="font-medium">
                            {String.fromCharCode(65 + index)}.
                          </Label>
                          <Input
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            placeholder={`الخيار ${String.fromCharCode(65 + index)}`}
                            className="flex-1"
                          />
                          {formData.options.length > 2 && (
                            <Button
                              type="button"
                              onClick={() => removeOption(index)}
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </RadioGroup>

                  {errors.options && (
                    <div className="flex items-center gap-2 text-red-500 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.options}
                    </div>
                  )}

                  {errors.correct_answer && (
                    <div className="flex items-center gap-2 text-red-500 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.correct_answer}
                    </div>
                  )}

                  <div className="text-sm text-muted-foreground">
                    اختر الإجابة الصحيحة بالنقر على الدائرة بجانب الخيار المناسب
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(`/admin/weekly-events/${eventId}/questions`)}
                    className="flex-1"
                  >
                    إلغاء
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-primary to-accent text-black font-bold"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                        جاري الإنشاء...
                      </div>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        إنشاء السؤال
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

export default AdminCreateQuestion;
