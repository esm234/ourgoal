import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Search,
  ExternalLink,
  Clock,
  Users,
  BookOpen,
  Calculator,
  FileText,
  Play,
  Target
} from "lucide-react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useLocalFileDetails } from "@/hooks/useLocalFiles";
import { incrementDownloads, convertToDirectDownload } from "@/data/localFiles";
import { trackFileDownload, trackEventParticipation } from '@/utils/analytics';
import { useTimeTracking } from '@/hooks/useAnalytics';

const LocalFileDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Track time spent on this page
  useTimeTracking('file_details');
  const fileId = parseInt(id || "0");

  const { file, exams, loading, error } = useLocalFileDetails(fileId);

  const handleDownload = async () => {
    if (!file) return;

    try {
      // Increment download counter
      incrementDownloads(file.id);

      // Track file download
      trackFileDownload(file.id.toString(), file.title, file.category);

      // Open file in new tab
      window.open(file.file_url, '_blank');
    } catch (error) {
      console.error('Error updating download count:', error);
      // Still open the file even if counter update fails
      window.open(file.file_url, '_blank');
    }
  };

  const handleExamClick = async (exam: any) => {
    try {
      // Track exam start
      trackEventParticipation(exam.id.toString(), exam.title, 'start');

      // Open Google Form in new tab
      window.open(exam.google_form_url, '_blank');
    } catch (error) {
      console.error('Error opening exam:', error);
      // Still open the exam even if there's an error
      window.open(exam.google_form_url, '_blank');
    }
  };

  const filteredExams = exams.filter(exam =>
    exam.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'verbal': return <BookOpen className="w-6 h-6" />;
      case 'quantitative': return <Calculator className="w-6 h-6" />;
      case 'mixed': return <Target className="w-6 h-6" />;
      default: return <FileText className="w-6 h-6" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'verbal': return 'from-blue-500 to-blue-600';
      case 'quantitative': return 'from-green-500 to-green-600';
      case 'mixed': return 'from-purple-500 to-purple-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  if (loading) {
    return (
      <Layout>
        <section className="min-h-screen py-16 px-4 bg-gradient-to-br from-background via-secondary/30 to-background relative overflow-hidden flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">جاري تحميل تفاصيل الملف...</p>
          </div>
        </section>
      </Layout>
    );
  }

  if (error || !file) {
    return (
      <Layout>
        <section className="min-h-screen py-16 px-4 bg-gradient-to-br from-background via-secondary/30 to-background relative overflow-hidden flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">لم يتم العثور على الملف</h2>
            <Button onClick={() => navigate('/files')} className="bg-gradient-to-r from-primary to-accent text-black">
              العودة للملفات
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="min-h-screen py-16 px-4 bg-gradient-to-br from-background via-secondary/30 to-background relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.03] [mask-image:radial-gradient(ellipse_at_center,white_20%,transparent_75%)]"></div>

        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-r from-accent/15 to-primary/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <Button
                onClick={() => navigate('/files')}
                variant="outline"
                className="bg-background/50 border-primary/20"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                العودة للملفات
              </Button>
            </div>

            {/* File Info Card */}
            <Card className="bg-gradient-to-br from-card/90 to-card/60 border-0 rounded-3xl backdrop-blur-xl shadow-xl mb-8">
              <CardHeader className="pb-6">
                <div className="flex items-start gap-6">
                  <div className={`w-20 h-20 bg-gradient-to-r ${getCategoryColor(file.category)} rounded-2xl flex items-center justify-center shadow-lg`}>
                    {getCategoryIcon(file.category)}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-3xl font-bold text-foreground mb-3">
                      {file.title}
                    </CardTitle>
                    <p className="text-lg text-muted-foreground mb-4">
                      {file.description}
                    </p>
                    <div className="flex items-center gap-4">
                      <Badge className="bg-primary/20 text-primary border-primary/30">
                        {exams.length} اختبار متاح
                      </Badge>
                      <Badge variant="outline" className="bg-background/50">
                        {file.category === 'verbal' ? 'لفظي' :
                         file.category === 'quantitative' ? 'كمي' :
                         file.category === 'mixed' ? 'منوع' : 'عام'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Search Bar */}
            <div className="relative mb-8">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="ابحث في الاختبارات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-12 bg-background/50 border-primary/20 rounded-xl h-12 text-lg"
              />
            </div>
          </motion.div>

          {/* Tests Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredExams.map((exam, index) => (
              <motion.div
                key={exam.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group"
              >
                <Card className="bg-gradient-to-br from-card/80 to-card/40 border border-primary/20 rounded-2xl backdrop-blur-sm hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer h-full"
                      onClick={() => handleExamClick(exam)}>
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Play className="h-6 w-6 text-primary" />
                      </div>
                      <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>

                    <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-4">
                      {exam.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      {exam.estimated_time && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{exam.estimated_time} دقيقة</span>
                        </div>
                      )}
                      {exam.questions_count && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <FileText className="w-4 h-4" />
                          <span>{exam.questions_count} سؤال</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>100+</span>
                      </div>
                    </div>

                    <Button
                      className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-black font-bold rounded-xl group-hover:scale-105 transition-transform"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExamClick(exam);
                      }}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      بدء الاختبار
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {filteredExams.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-foreground mb-2">لا توجد اختبارات</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'لم يتم العثور على اختبارات تطابق البحث' : 'لا توجد اختبارات متاحة في هذا الملف'}
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default LocalFileDetails;
