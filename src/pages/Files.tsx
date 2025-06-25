import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookText, Calculator, FileText, Download, Eye, Search, Filter, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useLocalFiles } from "@/hooks/useLocalFiles";
import { CustomPagination } from "@/components/ui/custom-pagination";
import { LocalFile, incrementDownloads } from "@/data/localFiles";
import { useDebounce } from "@/hooks/useDebounce";
import { trackFileDownload } from '@/utils/analytics';
import { useTimeTracking } from '@/hooks/useAnalytics';

const Files = () => {
  const navigate = useNavigate();

  // Track time spent on this page
  useTimeTracking('files_page');
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("verbal");
  // Remove admin functionality since files are now local
  // const [isAdmin, setIsAdmin] = useState(false);

  // Debounce search term to avoid searching on every keystroke
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // استخدام الـ hook السريع للملفات
  const {
    files,
    loading,
    totalCount,
    totalPages,
    currentPage,
    setCurrentPage
  } = useLocalFiles({
    category: activeTab === 'all' ? undefined : activeTab,
    searchQuery: debouncedSearchTerm,
    pageSize: 12
  });

  // Remove admin check since files are now local and don't need admin management
  // useEffect(() => {
  //   checkAdminStatus();
  // }, [user]);

  // const checkAdminStatus = async () => {
  //   if (!user) {
  //     setIsAdmin(false);
  //     return;
  //   }

  //   try {
  //     const { data, error } = await supabase
  //       .from('profiles')
  //       .select('role')
  //       .eq('id', user.id)
  //       .single();

  //     if (error) throw error;
  //     setIsAdmin(data?.role === 'admin');
  //   } catch (error) {
  //     console.error('Error checking admin status:', error);
  //     setIsAdmin(false);
  //   }
  // };

  const handleDownload = async (file: LocalFile) => {
    try {
      // زيادة عداد التحميلات
      incrementDownloads(file.id);

      // Track file download
      trackFileDownload(file.id.toString(), file.title, file.category);

      // فتح الملف
      window.open(file.file_url, '_blank');

      // Show success message
      toast.success('تم فتح الملف');
    } catch (error) {
      console.error('Error opening file:', error);
      toast.error('خطأ في فتح الملف');
    }
  };



  const getCategoryLabel = (category: string) => {
    const labels = {
      'verbal': 'لفظي',
      'quantitative': 'كمي',
      'mixed': 'منوع',
      'general': 'ملفات'
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

  const FileCard = ({ file }: { file: LocalFile }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group h-full"
    >
      <Card className="relative bg-gradient-to-br from-card/90 to-card/60 border-0 rounded-3xl backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden h-full flex flex-col">
        {/* Background Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Floating Elements */}
        <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-r from-accent/10 to-primary/10 rounded-full blur-xl opacity-30 group-hover:opacity-70 transition-opacity duration-500"></div>

        <CardHeader className="relative z-10 pb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <FileText className="h-8 w-8 text-primary group-hover:text-accent transition-colors duration-300" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-xs font-bold text-white">✓</span>
                </div>
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 mb-2 leading-tight">
                  {file.title}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge className="bg-gradient-to-r from-primary/20 to-accent/20 text-primary border-primary/30 text-xs font-medium">
                    {getCategoryLabel(file.category)}
                  </Badge>
                  {file.file_size && (
                    <Badge variant="outline" className="text-xs bg-background/50 text-muted-foreground border-muted-foreground/20">
                      {file.file_size}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative z-10 pt-0 flex-1 flex flex-col">
          <p className="text-muted-foreground text-sm mb-6 leading-relaxed line-clamp-3 flex-1">
            {file.description}
          </p>

          {/* Stats Section */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2 p-3 bg-background/30 rounded-xl border border-primary/10">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Download className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <div className="text-sm font-bold text-foreground">{file.downloads.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">تحميل</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-background/30 rounded-xl border border-primary/10">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Eye className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <div className="text-sm font-bold text-foreground">{formatDate(file.created_at)}</div>
                <div className="text-xs text-muted-foreground">تاريخ النشر</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Button
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-black font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => navigate(`/local-file-details/${file.id}`)}
            >
              <Eye className="h-4 w-4 mr-2" />
              عرض الاختبارات
            </Button>
            <Button
              variant="outline"
              className="w-full bg-background/50 hover:bg-background/80 border-primary/20 hover:border-primary/40 text-foreground hover:text-primary font-medium py-3 rounded-xl transition-all duration-300"
              onClick={() => handleDownload(file)}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              تحميل الملف
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

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
      <section className="py-16 px-4 min-h-screen relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.03] [mask-image:radial-gradient(ellipse_at_center,white_20%,transparent_75%)]"></div>

        <div className="container mx-auto max-w-7xl relative z-10">
          {/* Modern Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-block mb-3">
              <Badge variant="outline" className="px-3 py-1 text-sm bg-primary/10 text-primary border-primary/20">
                المكتبة التعليمية
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-5 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              ملفات ومراجع تعليمية
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              مجموعة شاملة من الملفات والمراجع التعليمية لمساعدتك في التحضير لاختبار القدرات
            </p>
          </motion.div>

          {/* Search and Admin Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
              <div className="relative w-full md:w-96">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ابحث في الملفات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 bg-background/50 border-primary/20 rounded-xl"
                  dir="rtl"
                />
              </div>

              {/* Admin Button removed - Files are now local and don't need admin management */}
            </div>
          </motion.div>

          {/* Files Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} dir="rtl" className="w-full">
              {/* Modern Tab Navigation */}
              <div className="flex justify-center mb-8">
                <TabsList className="grid grid-cols-4 w-full max-w-2xl bg-transparent p-2">
                  <TabsTrigger
                    value="verbal"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground font-bold py-3 px-4 rounded-xl transition-all duration-300 data-[state=inactive]:text-muted-foreground hover:text-foreground"
                  >
                    <div className="flex items-center gap-2">
                      <BookText className="w-4 h-4" />
                      <span className="hidden sm:inline">لفظي</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="quantitative"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground font-bold py-3 px-4 rounded-xl transition-all duration-300 data-[state=inactive]:text-muted-foreground hover:text-foreground"
                  >
                    <div className="flex items-center gap-2">
                      <Calculator className="w-4 h-4" />
                      <span className="hidden sm:inline">كمي</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="mixed"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground font-bold py-3 px-4 rounded-xl transition-all duration-300 data-[state=inactive]:text-muted-foreground hover:text-foreground"
                  >
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      <span className="hidden sm:inline">منوع</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="general"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground font-bold py-3 px-4 rounded-xl transition-all duration-300 data-[state=inactive]:text-muted-foreground hover:text-foreground"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span className="hidden sm:inline">ملفات</span>
                    </div>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Tab Contents - All categories use the same optimized data */}
              <TabsContent value="verbal" className="mt-0">
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="bg-muted rounded-2xl h-64"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 auto-rows-fr">
                      {files.map((file) => (
                        <FileCard key={file.id} file={file} />
                      ))}
                      {files.length === 0 && (
                        <div className="col-span-full text-center py-12">
                          <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-xl font-bold text-foreground mb-2">لا توجد ملفات لفظية</h3>
                          <p className="text-muted-foreground">لم يتم إضافة أي ملفات لفظية بعد</p>
                        </div>
                      )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <CustomPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalCount={totalCount}
                        pageSize={12}
                        hasNextPage={currentPage < totalPages - 1}
                        hasPrevPage={currentPage > 0}
                        onNextPage={() => setCurrentPage(currentPage + 1)}
                        onPrevPage={() => setCurrentPage(currentPage - 1)}
                        loading={loading}
                      />
                    )}
                  </>
                )}
              </TabsContent>

              <TabsContent value="quantitative" className="mt-0">
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="bg-muted rounded-2xl h-64"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 auto-rows-fr">
                      {files.map((file) => (
                        <FileCard key={file.id} file={file} />
                      ))}
                      {files.length === 0 && (
                        <div className="col-span-full text-center py-12">
                          <Calculator className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-xl font-bold text-foreground mb-2">لا توجد ملفات كمية</h3>
                          <p className="text-muted-foreground">لم يتم إضافة أي ملفات كمية بعد</p>
                        </div>
                      )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <CustomPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalCount={totalCount}
                        pageSize={12}
                        hasNextPage={currentPage < totalPages - 1}
                        hasPrevPage={currentPage > 0}
                        onNextPage={() => setCurrentPage(currentPage + 1)}
                        onPrevPage={() => setCurrentPage(currentPage - 1)}
                        loading={loading}
                      />
                    )}
                  </>
                )}
              </TabsContent>

              <TabsContent value="mixed" className="mt-0">
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="bg-muted rounded-2xl h-64"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 auto-rows-fr">
                      {files.map((file) => (
                        <FileCard key={file.id} file={file} />
                      ))}
                      {files.length === 0 && (
                        <div className="col-span-full text-center py-12">
                          <Filter className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-xl font-bold text-foreground mb-2">لا توجد ملفات منوعة</h3>
                          <p className="text-muted-foreground">لم يتم إضافة أي ملفات منوعة بعد</p>
                        </div>
                      )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <CustomPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalCount={totalCount}
                        pageSize={12}
                        hasNextPage={currentPage < totalPages - 1}
                        hasPrevPage={currentPage > 0}
                        onNextPage={() => setCurrentPage(currentPage + 1)}
                        onPrevPage={() => setCurrentPage(currentPage - 1)}
                        loading={loading}
                      />
                    )}
                  </>
                )}
              </TabsContent>

              <TabsContent value="general" className="mt-0">
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="bg-muted rounded-2xl h-64"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 auto-rows-fr">
                      {files.map((file) => (
                        <FileCard key={file.id} file={file} />
                      ))}
                      {files.length === 0 && (
                        <div className="col-span-full text-center py-12">
                          <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-xl font-bold text-foreground mb-2">لا توجد ملفات عامة</h3>
                          <p className="text-muted-foreground">لم يتم إضافة أي ملفات عامة بعد</p>
                        </div>
                      )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <CustomPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalCount={totalCount}
                        pageSize={12}
                        hasNextPage={currentPage < totalPages - 1}
                        hasPrevPage={currentPage > 0}
                        onNextPage={() => setCurrentPage(currentPage + 1)}
                        onPrevPage={() => setCurrentPage(currentPage - 1)}
                        loading={loading}
                      />
                    )}
                  </>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Files;
