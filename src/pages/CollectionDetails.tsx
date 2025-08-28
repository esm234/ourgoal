import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, FileText, Download, Play, Clock, Users, Star, ExternalLink, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useCollectionDetails } from "@/hooks/useCollections";
import { incrementCollectionDownloads } from "@/data/localFiles";
import { trackFileDownload } from '@/utils/analytics';
import { useTimeTracking } from '@/hooks/useAnalytics';

const CollectionDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const collectionId = parseInt(id || '0');

  // Track time spent on this page
  useTimeTracking('collection_details_page');

  const { collection, exams, loading, error } = useCollectionDetails(collectionId);

  const handleDownload = async () => {
    if (!collection) return;

    try {
      // زيادة عداد التحميلات
      incrementCollectionDownloads(collection.id);

      // Track collection download
      trackFileDownload(collection.id.toString(), collection.title, collection.category);

      // فتح الملف
      window.open(collection.pdf_url, '_blank');

      // Show success message
      toast.success('تم فتح التجميعة');
    } catch (error) {
      console.error('Error opening collection:', error);
      toast.error('خطأ في فتح التجميعة');
    }
  };

  const handleWatchVideo = () => {
    if (!collection) return;

    if (collection.video_url) {
      window.open(collection.video_url, '_blank');
      toast.success('تم فتح فيديو الشرح');
    } else {
      toast.error('فيديو الشرح غير متوفر');
    }
  };

  const handleTakeExam = (examUrl: string) => {
    window.open(examUrl, '_blank');
    toast.success('تم فتح الاختبار');
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      'verbal': 'لفظي',
      'quantitative': 'كمي',
      'mixed': 'منوع'
    };
    return labels[category as keyof typeof labels] || category;
  };



  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      calendar: "gregory"
    }).format(date);
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen py-16 px-4 bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">جاري تحميل التجميعة...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !collection) {
    return (
      <Layout>
        <div className="min-h-screen py-16 px-4 bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center">
          <div className="text-center">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">التجميعة غير موجودة</h2>
            <p className="text-muted-foreground mb-6">{error || 'لم يتم العثور على التجميعة المطلوبة'}</p>
            <Button onClick={() => navigate('/files')} className="bg-primary hover:bg-primary/90">
              <ArrowRight className="w-4 h-4 mr-2" />
              العودة للملفات والتجميعات
            </Button>
          </div>
        </div>
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
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Button
              variant="ghost"
              onClick={() => navigate('/files')}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              العودة للملفات والتجميعات
            </Button>
          </motion.div>

          {/* Collection Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <Card className="bg-gradient-to-br from-card/90 to-card/60 border-0 rounded-3xl backdrop-blur-xl shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5"></div>
              
              <CardHeader className="relative z-10 p-8">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-2xl flex items-center justify-center shadow-lg">
                        <Star className="h-8 w-8 text-orange-500" />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-gradient-to-r from-primary/20 to-accent/20 text-primary border-primary/30">
                          {getCategoryLabel(collection.category)}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardTitle className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                      {collection.title}
                    </CardTitle>
                    
                    <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                      {collection.description}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-3 p-4 bg-background/30 rounded-xl border border-primary/10">
                        <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                          <Download className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                          <div className="text-lg font-bold text-foreground">{collection.downloads.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">تحميل</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-4 bg-background/30 rounded-xl border border-primary/10">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <div className="text-lg font-bold text-foreground">{collection.questions_count}</div>
                          <div className="text-sm text-muted-foreground">سؤال</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-4 bg-background/30 rounded-xl border border-primary/10">
                        <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                          <FileText className="h-5 w-5 text-purple-500" />
                        </div>
                        <div>
                          <div className="text-lg font-bold text-foreground">{collection.file_size}</div>
                          <div className="text-sm text-muted-foreground">حجم الملف</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-4 bg-background/30 rounded-xl border border-primary/10">
                        <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                          <Clock className="h-5 w-5 text-orange-500" />
                        </div>
                        <div>
                          <div className="text-lg font-bold text-foreground">{formatDate(collection.created_at)}</div>
                          <div className="text-sm text-muted-foreground">تاريخ النشر</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-4 min-w-[200px]">
                    <Button
                      onClick={handleDownload}
                      className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-black font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      <ExternalLink className="h-5 w-5 mr-2" />
                      تحميل PDF
                    </Button>
                    
                    {collection.video_url && (
                      <Button
                        onClick={handleWatchVideo}
                        variant="outline"
                        className="bg-background/50 hover:bg-background/80 border-red-500/20 hover:border-red-500/40 text-foreground hover:text-red-500 font-bold py-4 px-6 rounded-xl transition-all duration-300"
                      >
                        <Play className="h-5 w-5 mr-2" />
                        مشاهدة الشرح
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>
          </motion.div>

          {/* Exams Section */}
          {exams.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  الاختبارات المتاحة
                </h2>
                <p className="text-muted-foreground text-lg">
                  اختبارات تفاعلية لقياس مستواك في هذه التجميعة
                </p>
              </div>

              <div className="grid gap-6">
                {exams.map((exam, index) => (
                  <motion.div
                    key={exam.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                  >
                    <Card className="bg-gradient-to-br from-card/90 to-card/60 border-0 rounded-2xl backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      <CardContent className="relative z-10 p-6">
                        <div className="flex flex-col lg:flex-row gap-6 items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                                <BookOpen className="h-6 w-6 text-blue-500" />
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                                  {exam.title}
                                </h3>
                                <p className="text-muted-foreground">
                                  {exam.description}
                                </p>
                              </div>
                            </div>

                            {/* Exam Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                              <div className="flex items-center gap-2 p-3 bg-background/30 rounded-lg border border-primary/10">
                                <Clock className="h-4 w-4 text-orange-500" />
                                <div>
                                  <div className="text-sm font-bold text-foreground">{exam.estimated_time} دقيقة</div>
                                  <div className="text-xs text-muted-foreground">المدة المقدرة</div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 p-3 bg-background/30 rounded-lg border border-primary/10">
                                <BookOpen className="h-4 w-4 text-blue-500" />
                                <div>
                                  <div className="text-sm font-bold text-foreground">{exam.questions_count} سؤال</div>
                                  <div className="text-xs text-muted-foreground">عدد الأسئلة</div>
                                </div>
                              </div>

                              {exam.participants_count && (
                                <div className="flex items-center gap-2 p-3 bg-background/30 rounded-lg border border-primary/10">
                                  <Users className="h-4 w-4 text-green-500" />
                                  <div>
                                    <div className="text-sm font-bold text-foreground">{exam.participants_count}</div>
                                    <div className="text-xs text-muted-foreground">مشارك</div>
                                  </div>
                                </div>
                              )}
                            </div>


                          </div>

                          {/* Take Exam Button */}
                          <div className="flex flex-col gap-3 min-w-[160px]">
                            <Button
                              onClick={() => handleTakeExam(exam.google_form_url)}
                              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              بدء الاختبار
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* No Exams Message */}
          {exams.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center py-12"
            >
              <Card className="bg-gradient-to-br from-card/90 to-card/60 border-0 rounded-2xl backdrop-blur-xl shadow-lg">
                <CardContent className="p-12">
                  <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">لا توجد اختبارات متاحة</h3>
                  <p className="text-muted-foreground">
                    لم يتم إضافة اختبارات لهذه التجميعة بعد. يمكنك تحميل ملف PDF ومشاهدة فيديو الشرح.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default CollectionDetails;
