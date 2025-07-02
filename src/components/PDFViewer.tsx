import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface PDFViewerProps {
  pdfUrl?: string;
  title: string;
  description?: string;
  onComplete?: () => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ 
  pdfUrl, 
  title, 
  description,
  onComplete 
}) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const getGoogleDriveDownloadUrl = (url: string) => {
    // Convert Google Drive sharing link to direct download link
    const fileId = url.match(/[-\w]{25,}/);
    if (fileId) {
      return `https://drive.google.com/uc?export=download&id=${fileId[0]}`;
    }
    return url;
  };

  const handleDownloadPDF = () => {
    if (!pdfUrl) return;

    try {
      setIsDownloading(true);
      
      // Convert Google Drive link to direct download link
      const downloadUrl = getGoogleDriveDownloadUrl(pdfUrl);
      
      // Open in new tab
      window.open(downloadUrl, '_blank');
      
      // Show success message
      toast.success('تم فتح صفحة التحميل');
      
      // Mark as completed
      if (onComplete) {
        setTimeout(() => {
          onComplete();
        }, 1000);
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء تحميل الملف');
      console.error('Download error:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="relative rounded-2xl overflow-hidden">
      <Card className="h-full bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30">
        <CardHeader className="relative z-10 pb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
              ملف PDF
            </Badge>
          </div>
          
          <CardTitle className="text-2xl font-bold text-foreground mb-2">
            {title}
          </CardTitle>
          
          {description && (
            <p className="text-muted-foreground">
              {description}
            </p>
          )}
        </CardHeader>

        <CardContent className="relative z-10 space-y-6">
          {/* Download Button */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleDownloadPDF}
              variant="outline"
              disabled={isDownloading}
              className="w-full border-green-500 text-green-600 hover:bg-green-50 rounded-xl py-6 font-semibold text-lg transition-all duration-300"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  جاري التحميل...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  تحميل الملف
                </>
              )}
            </Button>
          </motion.div>

          {/* Additional Info */}
          <div className="text-center text-sm text-muted-foreground">
            <p>
              💡 <strong>نصيحة:</strong> سيتم فتح صفحة التحميل في نافذة جديدة
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PDFViewer;
