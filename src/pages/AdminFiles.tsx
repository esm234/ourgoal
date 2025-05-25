import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Edit,
  Trash2,
  FileText,
  ExternalLink,
  Download,
  Calendar,
  Search
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useFastFiles } from '@/hooks/useFastFiles';
import { CustomPagination } from '@/components/ui/custom-pagination';

interface FileData {
  id: number;
  title: string;
  description: string;
  category: string;
  file_url: string;
  file_size: string;
  downloads: number;
  created_at: string;
}

const AdminFiles = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingFile, setEditingFile] = useState<FileData | null>(null);

  // استخدام الـ hook السريع للملفات
  const {
    data: files,
    loading,
    error,
    currentPage,
    totalPages,
    totalCount,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
    refresh
  } = useFastFiles(selectedCategory, searchTerm);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    file_url: '',
    file_size: ''
  });

  const categories = [
    { value: 'verbal', label: 'لفظي', color: 'bg-blue-500' },
    { value: 'quantitative', label: 'كمي', color: 'bg-green-500' },
    { value: 'mixed', label: 'منوع', color: 'bg-purple-500' },
    { value: 'general', label: 'عام', color: 'bg-gray-500' }
  ];

  // No need for useEffect or fetchFiles - handled by the hook

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.category || !formData.file_url) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      if (editingFile) {
        // Update existing file
        const { error } = await supabase
          .from('files')
          .update(formData)
          .eq('id', editingFile.id);

        if (error) throw error;
        toast.success('تم تحديث الملف بنجاح');
      } else {
        // Add new file
        const { error } = await supabase
          .from('files')
          .insert([formData]);

        if (error) throw error;
        toast.success('تم إضافة الملف بنجاح');
      }

      resetForm();
      refresh();
    } catch (error) {
      console.error('Error saving file:', error);
      toast.error('خطأ في حفظ الملف');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا الملف؟ سيتم حذف جميع الاختبارات المرتبطة به أيضاً.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('files')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('تم حذف الملف بنجاح');
      refresh();
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('خطأ في حذف الملف');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      file_url: '',
      file_size: ''
    });
    setShowAddForm(false);
    setEditingFile(null);
  };

  const startEdit = (file: FileData) => {
    setFormData({
      title: file.title,
      description: file.description,
      category: file.category,
      file_url: file.file_url,
      file_size: file.file_size
    });
    setEditingFile(file);
    setShowAddForm(true);
  };



  const getCategoryLabel = (category: string) => {
    return categories.find(cat => cat.value === category)?.label || category;
  };

  const getCategoryColor = (category: string) => {
    return categories.find(cat => cat.value === category)?.color || 'bg-gray-500';
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen py-16 px-4 bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">جاري تحميل الملفات...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="min-h-screen py-16 px-4 bg-gradient-to-br from-background via-secondary/30 to-background">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              إدارة الملفات التعليمية
            </h1>
            <p className="text-xl text-muted-foreground">
              إضافة وتعديل وحذف الملفات التعليمية
            </p>
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="flex flex-col sm:flex-row gap-4 flex-1">
                    {/* Search */}
                    <div className="relative flex-1">
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        placeholder="البحث في الملفات..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pr-12 bg-background/50 border-primary/20"
                      />
                    </div>

                    {/* Category Filter */}
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-full sm:w-48 bg-background/50 border-primary/20">
                        <SelectValue placeholder="اختر الفئة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع الفئات</SelectItem>
                        {categories.map(category => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Add Button */}
                  <Button
                    onClick={() => setShowAddForm(true)}
                    className="bg-gradient-to-r from-primary to-accent text-black font-bold"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    إضافة ملف جديد
                  </Button>
                </div>
              </CardContent>
            </Card>
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
                    {editingFile ? 'تعديل الملف' : 'إضافة ملف جديد'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Title */}
                      <div className="space-y-2">
                        <Label htmlFor="title">عنوان الملف *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          placeholder="مثال: ملف العلاقات"
                          className="bg-background/50 border-primary/20"
                          required
                        />
                      </div>

                      {/* Category */}
                      <div className="space-y-2">
                        <Label htmlFor="category">الفئة *</Label>
                        <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                          <SelectTrigger className="bg-background/50 border-primary/20">
                            <SelectValue placeholder="اختر الفئة" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(category => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* File URL */}
                      <div className="space-y-2">
                        <Label htmlFor="file_url">رابط الملف *</Label>
                        <Input
                          id="file_url"
                          value={formData.file_url}
                          onChange={(e) => setFormData({...formData, file_url: e.target.value})}
                          placeholder="https://drive.google.com/..."
                          className="bg-background/50 border-primary/20"
                          required
                        />
                      </div>

                      {/* File Size */}
                      <div className="space-y-2">
                        <Label htmlFor="file_size">حجم الملف</Label>
                        <Input
                          id="file_size"
                          value={formData.file_size}
                          onChange={(e) => setFormData({...formData, file_size: e.target.value})}
                          placeholder="مثال: 2.5 MB"
                          className="bg-background/50 border-primary/20"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="description">وصف الملف</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="وصف مختصر عن محتوى الملف..."
                        className="bg-background/50 border-primary/20 min-h-24"
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
                        {editingFile ? 'تحديث الملف' : 'إضافة الملف'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Files Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {files.length === 0 ? (
              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardContent className="p-12 text-center">
                  <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">لا توجد ملفات</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || selectedCategory !== 'all'
                      ? 'لم يتم العثور على ملفات تطابق البحث'
                      : 'لم يتم إضافة أي ملفات بعد'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {files.map((file, index) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card className="bg-card/80 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg h-full flex flex-col">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className={`w-12 h-12 ${getCategoryColor(file.category)} rounded-xl flex items-center justify-center`}>
                            <FileText className="w-6 h-6 text-white" />
                          </div>
                          <Badge className="bg-primary/20 text-primary border-primary/30">
                            {getCategoryLabel(file.category)}
                          </Badge>
                        </div>

                        <CardTitle className="text-xl font-bold text-foreground line-clamp-2">
                          {file.title}
                        </CardTitle>
                        {file.description && (
                          <p className="text-muted-foreground text-sm line-clamp-3">
                            {file.description}
                          </p>
                        )}
                      </CardHeader>

                      <CardContent className="pt-0 flex-1 flex flex-col">
                        {/* File Info */}
                        <div className="grid grid-cols-2 gap-4 mb-6 flex-1">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Download className="w-4 h-4" />
                            <span>{file.downloads} تحميل</span>
                          </div>
                          {file.file_size && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <FileText className="w-4 h-4" />
                              <span>{file.file_size}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-sm text-muted-foreground col-span-2">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(file.created_at).toLocaleDateString('ar-SA')}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button
                            onClick={() => navigate(`/admin/files/${file.id}/exams`)}
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-background/50 border-primary/20 hover:border-primary/40"
                          >
                            إدارة الاختبارات
                          </Button>
                          <Button
                            onClick={() => startEdit(file)}
                            variant="outline"
                            size="sm"
                            className="bg-background/50 border-primary/20 hover:border-primary/40"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleDelete(file.id)}
                            variant="outline"
                            size="sm"
                            className="bg-red-500/10 border-red-500/20 hover:border-red-500/40 text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => window.open(file.file_url, '_blank')}
                            variant="outline"
                            size="sm"
                            className="bg-background/50 border-primary/20 hover:border-primary/40"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <CustomPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalCount={totalCount}
                    pageSize={20}
                    hasNextPage={hasNextPage}
                    hasPrevPage={hasPrevPage}
                    onNextPage={nextPage}
                    onPrevPage={prevPage}
                    loading={loading}
                  />
                )}
              </>
            )}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default AdminFiles;