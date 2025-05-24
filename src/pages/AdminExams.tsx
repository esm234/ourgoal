import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Edit,
  Trash2,
  FileText,
  ExternalLink,
  ArrowRight,
  Clock,
  HelpCircle,
  Users
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface FileData {
  id: number;
  title: string;
  description: string;
  category: string;
}

interface ExamData {
  id: number;
  file_id: number;
  title: string;
  google_form_url: string;
  duration: number;
  questions: number;
  attempts: number;
  created_at: string;
}

const AdminExams = () => {
  const { fileId } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState<FileData | null>(null);
  const [exams, setExams] = useState<ExamData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingExam, setEditingExam] = useState<ExamData | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    google_form_url: '',
    duration: '',
    questions: ''
  });

  useEffect(() => {
    if (fileId) {
      fetchFileAndExams();
    }
  }, [fileId]);

  const fetchFileAndExams = async () => {
    try {
      // Fetch file details
      const { data: fileData, error: fileError } = await supabase
        .from('files')
        .select('*')
        .eq('id', fileId)
        .single();

      if (fileError) throw fileError;
      setFile(fileData);

      // Fetch exams for this file
      const { data: examsData, error: examsError } = await supabase
        .from('exams')
        .select('*')
        .eq('file_id', fileId)
        .order('created_at', { ascending: false });

      if (examsError) throw examsError;
      setExams(examsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.google_form_url) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      const examData = {
        file_id: parseInt(fileId!),
        title: formData.title,
        google_form_url: formData.google_form_url,
        duration: formData.duration ? parseInt(formData.duration) : null,
        questions: formData.questions ? parseInt(formData.questions) : null
      };

      if (editingExam) {
        // Update existing exam
        const { error } = await supabase
          .from('exams')
          .update(examData)
          .eq('id', editingExam.id);

        if (error) throw error;
        toast.success('تم تحديث الاختبار بنجاح');
      } else {
        // Add new exam
        const { error } = await supabase
          .from('exams')
          .insert([examData]);

        if (error) throw error;
        toast.success('تم إضافة الاختبار بنجاح');
      }

      resetForm();
      fetchFileAndExams();
    } catch (error) {
      console.error('Error saving exam:', error);
      toast.error('خطأ في حفظ الاختبار');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا الاختبار؟')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('exams')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('تم حذف الاختبار بنجاح');
      fetchFileAndExams();
    } catch (error) {
      console.error('Error deleting exam:', error);
      toast.error('خطأ في حذف الاختبار');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      google_form_url: '',
      duration: '',
      questions: ''
    });
    setShowAddForm(false);
    setEditingExam(null);
  };

  const startEdit = (exam: ExamData) => {
    setFormData({
      title: exam.title,
      google_form_url: exam.google_form_url,
      duration: exam.duration?.toString() || '',
      questions: exam.questions?.toString() || ''
    });
    setEditingExam(exam);
    setShowAddForm(true);
  };

  const getCategoryLabel = (category: string) => {
    const categories = {
      'verbal': 'لفظي',
      'quantitative': 'كمي',
      'mixed': 'منوع',
      'general': 'عام'
    };
    return categories[category as keyof typeof categories] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'verbal': 'bg-blue-500',
      'quantitative': 'bg-green-500',
      'mixed': 'bg-purple-500',
      'general': 'bg-gray-500'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen py-16 px-4 bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">جاري تحميل الاختبارات...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!file) {
    return (
      <Layout>
        <div className="min-h-screen py-16 px-4 bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">الملف غير موجود</h3>
              <p className="text-muted-foreground mb-6">لم يتم العثور على الملف المطلوب</p>
              <Button onClick={() => navigate('/admin/files')} className="bg-gradient-to-r from-primary to-accent text-black">
                العودة للملفات
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="min-h-screen py-16 px-4 bg-gradient-to-br from-background via-secondary/30 to-background">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-muted-foreground mb-6">
              <Button
                variant="ghost"
                onClick={() => navigate('/admin/files')}
                className="p-0 h-auto font-normal hover:text-primary"
              >
                إدارة الملفات
              </Button>
              <ArrowRight className="w-4 h-4" />
              <span>إدارة الاختبارات</span>
            </div>

            {/* File Info */}
            <Card className="bg-card/80 backdrop-blur-sm border-primary/20 mb-8">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 ${getCategoryColor(file.category)} rounded-2xl flex items-center justify-center`}>
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-2xl font-bold text-foreground">{file.title}</h1>
                      <Badge className="bg-primary/20 text-primary border-primary/30">
                        {getCategoryLabel(file.category)}
                      </Badge>
                    </div>
                    {file.description && (
                      <p className="text-muted-foreground">{file.description}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                إدارة اختبارات الملف
              </h2>
              <p className="text-xl text-muted-foreground">
                إضافة وتعديل وحذف الاختبارات المرتبطة بهذا الملف
              </p>
            </div>
          </motion.div>

          {/* Add Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 text-center"
          >
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-primary to-accent text-black font-bold"
            >
              <Plus className="w-4 h-4 mr-2" />
              إضافة اختبار جديد
            </Button>
          </motion.div>

          {/* Add/Edit Form */}
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-8"
            >
              <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">
                    {editingExam ? 'تعديل الاختبار' : 'إضافة اختبار جديد'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Title */}
                      <div className="space-y-2">
                        <Label htmlFor="title">عنوان الاختبار *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          placeholder="مثال: اختبار العلاقات 1"
                          className="bg-background/50 border-primary/20"
                          required
                        />
                      </div>

                      {/* Duration */}
                      <div className="space-y-2">
                        <Label htmlFor="duration">المدة (بالدقائق)</Label>
                        <Input
                          id="duration"
                          type="number"
                          value={formData.duration}
                          onChange={(e) => setFormData({...formData, duration: e.target.value})}
                          placeholder="30"
                          className="bg-background/50 border-primary/20"
                        />
                      </div>

                      {/* Questions */}
                      <div className="space-y-2">
                        <Label htmlFor="questions">عدد الأسئلة</Label>
                        <Input
                          id="questions"
                          type="number"
                          value={formData.questions}
                          onChange={(e) => setFormData({...formData, questions: e.target.value})}
                          placeholder="20"
                          className="bg-background/50 border-primary/20"
                        />
                      </div>
                    </div>

                    {/* Google Form URL */}
                    <div className="space-y-2">
                      <Label htmlFor="google_form_url">رابط Google Form *</Label>
                      <Input
                        id="google_form_url"
                        value={formData.google_form_url}
                        onChange={(e) => setFormData({...formData, google_form_url: e.target.value})}
                        placeholder="https://forms.google.com/..."
                        className="bg-background/50 border-primary/20"
                        required
                      />
                    </div>

                    {/* Form Actions */}
                    <div className="flex gap-4 justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetForm}
                        className="bg-background/50 border-primary/20"
                      >
                        إلغاء
                      </Button>
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-primary to-accent text-black font-bold"
                      >
                        {editingExam ? 'تحديث الاختبار' : 'إضافة الاختبار'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Exams List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {exams.length === 0 ? (
              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardContent className="p-12 text-center">
                  <HelpCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">لا توجد اختبارات</h3>
                  <p className="text-muted-foreground mb-6">لم يتم إضافة أي اختبارات لهذا الملف بعد</p>
                  <Button
                    onClick={() => setShowAddForm(true)}
                    className="bg-gradient-to-r from-primary to-accent text-black font-bold"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    إضافة أول اختبار
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {exams.map((exam, index) => (
                  <motion.div
                    key={exam.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card className="bg-card/80 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-12 h-12 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
                              <HelpCircle className="w-6 h-6 text-primary" />
                            </div>

                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-foreground mb-2">{exam.title}</h3>

                              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                {exam.duration && (
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{exam.duration} دقيقة</span>
                                  </div>
                                )}
                                {exam.questions && (
                                  <div className="flex items-center gap-1">
                                    <HelpCircle className="w-4 h-4" />
                                    <span>{exam.questions} سؤال</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  <span>{exam.attempts} محاولة</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <Button
                              onClick={() => startEdit(exam)}
                              variant="outline"
                              size="sm"
                              className="bg-background/50 border-primary/20 hover:border-primary/40"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => handleDelete(exam.id)}
                              variant="outline"
                              size="sm"
                              className="bg-red-500/10 border-red-500/20 hover:border-red-500/40 text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => window.open(exam.google_form_url, '_blank')}
                              variant="outline"
                              size="sm"
                              className="bg-background/50 border-primary/20 hover:border-primary/40"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default AdminExams;
