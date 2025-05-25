import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { WeeklyEvent, EventCategory } from '@/types/weeklyEvents';

const AdminEditEvent: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [event, setEvent] = useState<WeeklyEvent | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'mixed' as EventCategory,
    start_time: '',
    duration_minutes: 60,
    xp_reward: 50,
    is_enabled: true
  });

  // Load event data
  useEffect(() => {
    const loadEvent = async () => {
      if (!eventId) {
        toast.error('معرف الفعالية غير صحيح');
        navigate('/admin/weekly-events');
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('weekly_events')
          .select('*')
          .eq('id', eventId)
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          toast.error('الفعالية غير موجودة');
          navigate('/admin/weekly-events');
          return;
        }

        setEvent(data);
        
        // Format datetime for input
        const startDate = new Date(data.start_time);
        const formattedDateTime = startDate.toISOString().slice(0, 16);
        
        setFormData({
          title: data.title,
          description: data.description || '',
          category: data.category,
          start_time: formattedDateTime,
          duration_minutes: data.duration_minutes,
          xp_reward: data.xp_reward,
          is_enabled: data.is_enabled
        });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('عنوان الفعالية مطلوب');
      return;
    }

    if (!formData.start_time) {
      toast.error('تاريخ ووقت البداية مطلوب');
      return;
    }

    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('weekly_events')
        .update({
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          category: formData.category,
          start_time: new Date(formData.start_time).toISOString(),
          duration_minutes: formData.duration_minutes,
          xp_reward: formData.xp_reward,
          is_enabled: formData.is_enabled,
          updated_at: new Date().toISOString()
        })
        .eq('id', eventId);

      if (error) {
        throw error;
      }

      toast.success('تم تحديث الفعالية بنجاح');
      navigate('/admin/weekly-events');
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('حدث خطأ في تحديث الفعالية');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">جاري تحميل بيانات الفعالية...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              onClick={() => navigate('/admin/weekly-events')}
              variant="outline"
              size="icon"
              className="rounded-full"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">تعديل الفعالية</h1>
              <p className="text-muted-foreground">تعديل بيانات الفعالية الأسبوعية</p>
            </div>
          </div>

          {/* Edit Form */}
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>بيانات الفعالية</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">عنوان الفعالية *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="أدخل عنوان الفعالية"
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">وصف الفعالية</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="أدخل وصف الفعالية (اختياري)"
                    rows={3}
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label>فئة الفعالية *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: EventCategory) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="verbal">لفظي</SelectItem>
                      <SelectItem value="quantitative">كمي</SelectItem>
                      <SelectItem value="mixed">منوع</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Start Time */}
                <div className="space-y-2">
                  <Label htmlFor="start_time">تاريخ ووقت البداية *</Label>
                  <Input
                    id="start_time"
                    type="datetime-local"
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    required
                  />
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <Label htmlFor="duration">مدة الفعالية (بالدقائق) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="15"
                    max="180"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                    required
                  />
                </div>

                {/* XP Reward */}
                <div className="space-y-2">
                  <Label htmlFor="xp_reward">نقاط الخبرة *</Label>
                  <Input
                    id="xp_reward"
                    type="number"
                    min="10"
                    max="200"
                    value={formData.xp_reward}
                    onChange={(e) => setFormData({ ...formData, xp_reward: parseInt(e.target.value) })}
                    required
                  />
                </div>

                {/* Enabled Status */}
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Switch
                    id="is_enabled"
                    checked={formData.is_enabled}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_enabled: checked })}
                  />
                  <Label htmlFor="is_enabled">فعالية مفعلة</Label>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="bg-gradient-to-r from-primary to-accent text-black font-bold"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        جاري الحفظ...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        حفظ التغييرات
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/admin/weekly-events')}
                    disabled={saving}
                  >
                    إلغاء
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default AdminEditEvent;
