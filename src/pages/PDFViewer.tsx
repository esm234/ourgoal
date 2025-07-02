import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCw,
  FileText,
  Eye,
  Share2,
  Printer,
  Maximize,
  Minimize
} from 'lucide-react';

interface PDFFile {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  downloadUrl: string;
  size: string;
  pages: number;
  category: string;
  courseId?: string;
  lessonId?: string;
}

const PDFViewer = () => {
  const { fileId } = useParams();
  const navigate = useNavigate();
  
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mock PDF data
  const pdfFile: PDFFile = {
    id: fileId || '',
    title: 'ملخص القدرات اللفظية',
    description: 'ملف شامل يحتوي على جميع قواعد وأساسيات القدرات اللفظية مع أمثلة تطبيقية',
    fileUrl: '/pdfs/verbal-summary.pdf',
    downloadUrl: '/pdfs/verbal-summary.pdf',
    size: '2.5 MB',
    pages: 45,
    category: 'لفظي',
    courseId: 'course-1',
    lessonId: 'lesson-1'
  };

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfFile.downloadUrl;
    link.download = `${pdfFile.title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: pdfFile.title,
        text: pdfFile.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <SEO title={`تحميل ${pdfFile.title} - Our Goal`} />
        
        <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 flex items-center justify-center">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center"
            >
              <FileText className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-xl font-bold text-foreground mb-2">جاري تحميل الملف...</h2>
            <p className="text-muted-foreground">يرجى الانتظار</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO title={`${pdfFile.title} - Our Goal`} description={pdfFile.description} />
      
      <div className={`min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 rounded-2xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button
                      onClick={() => navigate(-1)}
                      variant="ghost"
                      size="sm"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      العودة
                    </Button>
                    <div>
                      <h1 className="text-lg font-bold text-foreground">{pdfFile.title}</h1>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{pdfFile.category}</Badge>
                        <span className="text-sm text-muted-foreground">{pdfFile.pages} صفحة</span>
                        <span className="text-sm text-muted-foreground">{pdfFile.size}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Toolbar */}
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={handleZoomOut}
                      variant="outline"
                      size="sm"
                      disabled={zoom <= 50}
                    >
                      <ZoomOut className="w-4 h-4" />
                    </Button>
                    <span className="text-sm font-medium min-w-[60px] text-center">{zoom}%</span>
                    <Button
                      onClick={handleZoomIn}
                      variant="outline"
                      size="sm"
                      disabled={zoom >= 200}
                    >
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={handleRotate}
                      variant="outline"
                      size="sm"
                    >
                      <RotateCw className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={handleFullscreen}
                      variant="outline"
                      size="sm"
                    >
                      {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                    </Button>
                    <Button
                      onClick={handlePrint}
                      variant="outline"
                      size="sm"
                    >
                      <Printer className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={handleShare}
                      variant="outline"
                      size="sm"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={handleDownload}
                      size="sm"
                      className="bg-gradient-to-r from-primary to-accent"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      تحميل
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* PDF Viewer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6"
          >
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 rounded-2xl overflow-hidden">
              <CardContent className="p-0">
                <div className="relative bg-gray-100 min-h-[600px] flex items-center justify-center">
                  {/* PDF Embed */}
                  <div 
                    className="w-full h-full"
                    style={{
                      transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                      transformOrigin: 'center center',
                      transition: 'transform 0.3s ease'
                    }}
                  >
                    <iframe
                      src={`${pdfFile.fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                      className="w-full h-[600px] border-0"
                      title={pdfFile.title}
                    />
                  </div>
                  
                  {/* Fallback for browsers that don't support PDF viewing */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-50 opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <div className="text-center p-8">
                      <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-bold text-gray-700 mb-2">عارض PDF</h3>
                      <p className="text-gray-600 mb-4">إذا لم يظهر الملف، يمكنك تحميله مباشرة</p>
                      <Button onClick={handleDownload} className="bg-gradient-to-r from-primary to-accent">
                        <Download className="w-4 h-4 mr-2" />
                        تحميل الملف
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* File Info */}
          {!isFullscreen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                      <Eye className="w-5 h-5 text-white" />
                    </div>
                    معلومات الملف
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">الوصف:</h4>
                      <p className="text-muted-foreground leading-relaxed">{pdfFile.description}</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">الفئة:</span>
                        <Badge variant="outline">{pdfFile.category}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">عدد الصفحات:</span>
                        <span className="font-medium">{pdfFile.pages} صفحة</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">حجم الملف:</span>
                        <span className="font-medium">{pdfFile.size}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PDFViewer;
