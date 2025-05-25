import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Calendar,
  Clock,
  Trophy,
  Target,
  BookOpen,
  Calculator,
  ArrowLeft,
  Save,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import {
  EventCategory,
  CreateEventRequest,
  EVENT_CATEGORIES
} from '@/types/weeklyEvents';

const AdminCreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'mixed' as EventCategory,
    start_date: '',
    start_time: '',
    duration_minutes: 120,
    xp_reward: 50,
    is_enabled: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'عنوان الفعالية مطلوب';
    }

    if (!formData.start_date) {
      newErrors.start_date = 'تاريخ البداية مطلوب';
    }

    if (!formData.start_time) {
      newErrors.start_time = 'وقت البداية مطلوب';
    }

    if (formData.duration_minutes < 30) {
      newErrors.duration_minutes = 'مدة الفعالية يجب أن تكون 30 دقيقة على الأقل';
    }

    if (formData.xp_reward < 1) {
      newErrors.xp_reward = 'نقاط الخبرة يجب أن تكون أكبر من صفر';
    }

    // Check if start time is in the future
    if (formData.start_date && formData.start_time) {
      const startDateTime = new Date(`${formData.start_date}T${formData.start_time}`);
      if (startDateTime <= new Date()) {
        newErrors.start_time = 'وقت البداية يجب أن يكون في المستقبل';
      }
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

    setLoading(true);

    try {
      // Combine date and time
      const startDateTime = new Date(`${formData.start_date}T${formData.start_time}`);

      const eventData: CreateEventRequest = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        category: formData.category,
        start_time: startDateTime.toISOString(),
        duration_minutes: formData.duration_minutes,
        xp_reward: formData.xp_reward
      };

      const { data, error } = await supabase
        .from('weekly_events')
        .insert([{
          ...eventData,
          is_enabled: formData.is_enabled
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast.success('تم إنشاء الفعالية بنجاح');
      navigate('/admin/weekly-events');
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('حدث خطأ في إنشاء الفعالية');
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
              onClick={() => navigate('/admin/weekly-events')}
              variant="outline"
              size="icon"
              className="rounded-full"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">إنشاء فعالية جديدة</h1>
              <p className="text-muted-foreground">إنشاء فعالية تعليمية أسبوعية جديدة</p>
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
                <Calendar className="w-6 h-6 text-primary" />
                تفاصيل الفعالية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-base font-medium">
                      عنوان الفعالية *
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="مثال: اختبار القدرات الأسبوعي"
                      className={`text-lg p-4 ${errors.title ? 'border-red-500' : ''}`}
                    />
                    {errors.title && (
                      <div className="flex items-center gap-2 text-red-500 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {errors.title}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-base font-medium">
                      فئة الفعالية *
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleInputChange('category', value as EventCategory)}
                    >
                      <SelectTrigger className="text-lg p-4">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {EVENT_CATEGORIES.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            <div className="flex items-center gap-2">
                              {category.value === 'verbal' && <BookOpen className="w-4 h-4" />}
                              {category.value === 'quantitative' && <Calculator className="w-4 h-4" />}
                              {category.value === 'mixed' && <Target className="w-4 h-4" />}
                              {category.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-base font-medium">
                    وصف الفعالية
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="وصف مختصر للفعالية (اختياري)"
                    className="min-h-[100px] text-base"
                  />
                </div>

                {/* Date and Time */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="start_date" className="text-base font-medium">
                      تاريخ البداية *
                    </Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => handleInputChange('start_date', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className={`text-lg p-4 ${errors.start_date ? 'border-red-500' : ''}`}
                    />
                    {errors.start_date && (
                      <div className="flex items-center gap-2 text-red-500 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {errors.start_date}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="start_time" className="text-base font-medium">
                      وقت البداية *
                    </Label>
                    <Input
                      id="start_time"
                      type="time"
                      value={formData.start_time}
                      onChange={(e) => handleInputChange('start_time', e.target.value)}
                      className={`text-lg p-4 ${errors.start_time ? 'border-red-500' : ''}`}
                    />
                    {errors.start_time && (
                      <div className="flex items-center gap-2 text-red-500 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {errors.start_time}
                      </div>
                    )}
                  </div>
                </div>

                {/* Duration and XP */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="duration" className="text-base font-medium">
                      مدة الفعالية (بالدقائق) *
                    </Label>
                    <Input
                      id="duration"
                      type="number"
                      min="30"
                      max="300"
                      value={formData.duration_minutes}
                      onChange={(e) => handleInputChange('duration_minutes', parseInt(e.target.value) || 0)}
                      className={`text-lg p-4 ${errors.duration_minutes ? 'border-red-500' : ''}`}
                    />
                    {errors.duration_minutes && (
                      <div className="flex items-center gap-2 text-red-500 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {errors.duration_minutes}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="xp_reward" className="text-base font-medium">
                      نقاط الخبرة *
                    </Label>
                    <Input
                      id="xp_reward"
                      type="number"
                      min="1"
                      max="200"
                      value={formData.xp_reward}
                      onChange={(e) => handleInputChange('xp_reward', parseInt(e.target.value) || 0)}
                      className={`text-lg p-4 ${errors.xp_reward ? 'border-red-500' : ''}`}
                    />
                    {errors.xp_reward && (
                      <div className="flex items-center gap-2 text-red-500 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {errors.xp_reward}
                      </div>
                    )}
                  </div>
                </div>

                {/* Enable/Disable */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl">
                  <div>
                    <Label htmlFor="is_enabled" className="text-base font-medium">
                      تفعيل الفعالية
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      يمكن للطلاب رؤية والمشاركة في الفعالية المفعلة فقط
                    </p>
                  </div>
                  <Switch
                    id="is_enabled"
                    checked={formData.is_enabled}
                    onCheckedChange={(checked) => handleInputChange('is_enabled', checked)}
                  />
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/admin/weekly-events')}
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
                        إنشاء الفعالية
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

export default AdminCreateEvent;
