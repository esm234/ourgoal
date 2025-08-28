import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookText, Calculator, FileText, Download, Eye, Search, Filter, ExternalLink, Play, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useLocalFiles } from "@/hooks/useLocalFiles";
import { useCollections } from "@/hooks/useCollections";
import { CustomPagination } from "@/components/ui/custom-pagination";
import { LocalFile, incrementDownloads, Collection, incrementCollectionDownloads } from "@/data/localFiles";
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
    loading: filesLoading,
    totalCount: filesTotalCount,
    totalPages: filesTotalPages,
    currentPage: filesCurrentPage,
    setCurrentPage: setFilesCurrentPage
  } = useLocalFiles({
    category: activeTab === 'all' ? undefined : activeTab,
    searchQuery: debouncedSearchTerm,
    pageSize: 6
  });

  // استخدام الـ hook للتجميعات
  const {
    collections,
    loading: collectionsLoading,
    totalCount: collectionsTotalCount,
    totalPages: collectionsTotalPages,
    currentPage: collectionsCurrentPage,
    setCurrentPage: setCollectionsCurrentPage
  } = useCollections({
    category: activeTab === 'all' ? undefined : activeTab,
    searchQuery: debouncedSearchTerm,
    pageSize: 6
  });

  const loading = filesLoading || collectionsLoading;

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

  const handleCollectionDownload = async (collection: Collection) => {
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

  const handleWatchVideo = (collection: Collection) => {
    if (collection.video_url) {
      window.open(collection.video_url, '_blank');
      toast.success('تم فتح فيديو الشرح');
    } else {
      toast.error('فيديو الشرح غير متوفر');
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

  const CollectionCard = ({ collection }: { collection: Collection }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group h-full"
    >
      <Card className="relative bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border-0 rounded-3xl backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden h-full flex flex-col">
        {/* Background Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Floating Elements */}
        <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-full blur-xl opacity-30 group-hover:opacity-70 transition-opacity duration-500"></div>

        <CardHeader className="relative z-10 pb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Star className="h-8 w-8 text-orange-500 group-hover:text-yellow-500 transition-colors duration-300" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-xs font-bold text-white">★</span>
                </div>
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl font-bold text-foreground group-hover:text-orange-500 transition-colors duration-300 mb-2 leading-tight">
                  {collection.title}
                </CardTitle>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 text-orange-500 border-orange-500/30 text-xs font-medium">
                    تجميعة {getCategoryLabel(collection.category)}
                  </Badge>
                  {collection.file_size && (
                    <Badge variant="outline" className="text-xs bg-background/50 text-muted-foreground border-muted-foreground/20">
                      {collection.file_size}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative z-10 pt-0 flex-1 flex flex-col">
          <p className="text-muted-foreground text-sm mb-6 leading-relaxed line-clamp-3 flex-1">
            {collection.description}
          </p>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="flex items-center gap-2 p-3 bg-background/30 rounded-xl border border-orange-500/10">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Download className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <div className="text-sm font-bold text-foreground">{collection.downloads.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">تحميل</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-background/30 rounded-xl border border-orange-500/10">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <FileText className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <div className="text-sm font-bold text-foreground">{collection.questions_count}</div>
                <div className="text-xs text-muted-foreground">سؤال</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-background/30 rounded-xl border border-orange-500/10">
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Eye className="h-4 w-4 text-purple-500" />
              </div>
              <div>
                <div className="text-sm font-bold text-foreground">{formatDate(collection.created_at)}</div>
                <div className="text-xs text-muted-foreground">تاريخ النشر</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Button
              className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => navigate(`/collections/${collection.id}`)}
            >
              <Eye className="h-4 w-4 mr-2" />
              عرض الاختبارات
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="bg-background/50 hover:bg-background/80 border-orange-500/20 hover:border-orange-500/40 text-foreground hover:text-orange-500 font-medium py-2 rounded-xl transition-all duration-300"
                onClick={() => handleCollectionDownload(collection)}
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                PDF
              </Button>
              {collection.video_url && (
                <Button
                  variant="outline"
                  className="bg-background/50 hover:bg-background/80 border-red-500/20 hover:border-red-500/40 text-foreground hover:text-red-500 font-medium py-2 rounded-xl transition-all duration-300"
                  onClick={() => handleWatchVideo(collection)}
                >
                  <Play className="h-4 w-4 mr-1" />
                  فيديو
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

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
              ملفات وتجميعات تعليمية
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              مجموعة شاملة من الملفات والتجميعات التعليمية لمساعدتك في التحضير لاختبار القدرات
            </p>
          </motion.div>

          {/* Season 2025 Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 border border-primary/30 backdrop-blur-sm">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:radial-gradient(ellipse_at_center,white_20%,transparent_75%)]"></div>
              
              {/* Floating Elements */}
              <div className="absolute top-4 right-4 w-24 h-24 bg-gradient-to-r from-primary/30 to-accent/30 rounded-full blur-2xl opacity-60"></div>
              <div className="absolute bottom-4 left-4 w-20 h-20 bg-gradient-to-r from-accent/30 to-primary/30 rounded-full blur-xl opacity-50"></div>
              
              <div className="relative z-10 p-8 text-center">
                <div className="inline-block mb-4">
                  <Badge className="px-4 py-2 text-sm bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold border-0">
                    🎯 سيزون 2025
                  </Badge>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                  نحن نعمل على ملفات جديدة بمحتوى محدث
                </h2>
                <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
                  نعمل حالياً على تطوير وتحديث المحتوى التعليمي ليكون أكثر حداثة وفعالية. 
                  ستجد قريباً ملفات جديدة ومحسنة لمساعدتك في التحضير الأمثل لاختبار القدرات.
                </p>
                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <span>قريباً - محتوى محدث</span>
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                </div>
              </div>
            </div>
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
                <TabsList className="grid grid-cols-3 w-full max-w-xl bg-transparent p-2">
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
                    {/* Collections Section */}
                    {collections.length > 0 && (
                      <div className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center">
                            <Star className="h-5 w-5 text-white" />
                          </div>
                          <h2 className="text-2xl font-bold text-foreground">التجميعات المميزة</h2>
                          <Badge className="bg-gradient-to-r from-green-500/20 to-blue-500/20 text-black border-green-500/30 font-medium">
                            أسئلة مجمعة من المختبرين
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 auto-rows-fr">
                          {collections.map((collection) => (
                            <CollectionCard key={`collection-${collection.id}`} collection={collection} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Files Section */}
                    {files.length > 0 && (
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-white" />
                          </div>
                          <h2 className="text-2xl font-bold text-foreground">الملفات التعليمية</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 auto-rows-fr">
                          {files.map((file) => (
                            <FileCard key={`file-${file.id}`} file={file} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* No Content Message */}
                    {files.length === 0 && collections.length === 0 && (
                      <div className="col-span-full text-center py-12">
                        <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-foreground mb-2">لا توجد ملفات أو تجميعات لفظية</h3>
                        <p className="text-muted-foreground">لم يتم إضافة أي محتوى لفظي بعد</p>
                      </div>
                    )}

                    {/* Pagination for Files */}
                    {filesTotalPages > 1 && (
                      <div className="mt-8">
                        <CustomPagination
                          currentPage={filesCurrentPage}
                          totalPages={filesTotalPages}
                          totalCount={filesTotalCount}
                          pageSize={6}
                          hasNextPage={filesCurrentPage < filesTotalPages - 1}
                          hasPrevPage={filesCurrentPage > 0}
                          onNextPage={() => setFilesCurrentPage(filesCurrentPage + 1)}
                          onPrevPage={() => setFilesCurrentPage(filesCurrentPage - 1)}
                          loading={loading}
                        />
                      </div>
                    )}

                    {/* Pagination for Collections */}
                    {collectionsTotalPages > 1 && (
                      <div className="mt-8">
                        <CustomPagination
                          currentPage={collectionsCurrentPage}
                          totalPages={collectionsTotalPages}
                          totalCount={collectionsTotalCount}
                          pageSize={6}
                          hasNextPage={collectionsCurrentPage < collectionsTotalPages - 1}
                          hasPrevPage={collectionsCurrentPage > 0}
                          onNextPage={() => setCollectionsCurrentPage(collectionsCurrentPage + 1)}
                          onPrevPage={() => setCollectionsCurrentPage(collectionsCurrentPage - 1)}
                          loading={loading}
                        />
                      </div>
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
                    {/* Collections Section */}
                    {collections.length > 0 && (
                      <div className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center">
                            <Star className="h-5 w-5 text-white" />
                          </div>
                          <h2 className="text-2xl font-bold text-foreground">التجميعات المميزة</h2>
                          <Badge className="bg-gradient-to-r from-green-500/20 to-blue-500/20 text-black border-green-500/30 font-medium">
                            أسئلة مجمعة من المختبرين
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 auto-rows-fr">
                          {collections.map((collection) => (
                            <CollectionCard key={`collection-${collection.id}`} collection={collection} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Files Section */}
                    {files.length > 0 && (
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-white" />
                          </div>
                          <h2 className="text-2xl font-bold text-foreground">الملفات التعليمية</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 auto-rows-fr">
                          {files.map((file) => (
                            <FileCard key={`file-${file.id}`} file={file} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* No Content Message */}
                    {files.length === 0 && collections.length === 0 && (
                      <div className="col-span-full text-center py-12">
                        <Calculator className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-foreground mb-2">لا توجد ملفات أو تجميعات كمية</h3>
                        <p className="text-muted-foreground">لم يتم إضافة أي محتوى كمي بعد</p>
                      </div>
                    )}

                    {/* Pagination for Files */}
                    {filesTotalPages > 1 && (
                      <div className="mt-8">
                        <CustomPagination
                          currentPage={filesCurrentPage}
                          totalPages={filesTotalPages}
                          totalCount={filesTotalCount}
                          pageSize={6}
                          hasNextPage={filesCurrentPage < filesTotalPages - 1}
                          hasPrevPage={filesCurrentPage > 0}
                          onNextPage={() => setFilesCurrentPage(filesCurrentPage + 1)}
                          onPrevPage={() => setFilesCurrentPage(filesCurrentPage - 1)}
                          loading={loading}
                        />
                      </div>
                    )}

                    {/* Pagination for Collections */}
                    {collectionsTotalPages > 1 && (
                      <div className="mt-8">
                        <CustomPagination
                          currentPage={collectionsCurrentPage}
                          totalPages={collectionsTotalPages}
                          totalCount={collectionsTotalCount}
                          pageSize={6}
                          hasNextPage={collectionsCurrentPage < collectionsTotalPages - 1}
                          hasPrevPage={collectionsCurrentPage > 0}
                          onNextPage={() => setCollectionsCurrentPage(collectionsCurrentPage + 1)}
                          onPrevPage={() => setCollectionsCurrentPage(collectionsCurrentPage - 1)}
                          loading={loading}
                        />
                      </div>
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
                    {/* Files Section Only - No Collections for Mixed */}
                    {files.length > 0 ? (
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-white" />
                          </div>
                          <h2 className="text-2xl font-bold text-foreground">الملفات المنوعة</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 auto-rows-fr">
                          {files.map((file) => (
                            <FileCard key={`file-${file.id}`} file={file} />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="col-span-full text-center py-12">
                        <Filter className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-foreground mb-2">لا توجد ملفات منوعة</h3>
                        <p className="text-muted-foreground">لم يتم إضافة أي ملفات منوعة بعد</p>
                      </div>
                    )}

                    {/* Pagination for Files */}
                    {filesTotalPages > 1 && (
                      <div className="mt-8">
                        <CustomPagination
                          currentPage={filesCurrentPage}
                          totalPages={filesTotalPages}
                          totalCount={filesTotalCount}
                          pageSize={6}
                          hasNextPage={filesCurrentPage < filesTotalPages - 1}
                          hasPrevPage={filesCurrentPage > 0}
                          onNextPage={() => setFilesCurrentPage(filesCurrentPage + 1)}
                          onPrevPage={() => setFilesCurrentPage(filesCurrentPage - 1)}
                          loading={loading}
                        />
                      </div>
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
