import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  Trophy,
  Download,
  Star,
  Sparkles,
  Award,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { generateCompletionCertificate as generateCanvasCertificate } from '@/utils/canvasCertificateGenerator';

interface CompletionCertificateProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  planName: string;
  completionDate: Date;
  totalDays: number;
}

const CompletionCertificate: React.FC<CompletionCertificateProps> = ({
  isOpen,
  onClose,
  userName,
  planName,
  completionDate,
  totalDays
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateCertificate = async () => {
    try {
      setIsGenerating(true);

      const certificateData = {
        userName,
        completionDate,
        planName,
        totalDays
      };

      // توليد الشهادة باستخدام Canvas
      await generateCanvasCertificate(certificateData);
      console.log('Arabic certificate generated successfully');

      toast.success('🎉 تم توليد شهادة الإتمام بنجاح!', {
        description: 'تم تحميل الشهادة تلقائياً',
        duration: 5000
      });

      // إغلاق النافذة بعد ثانيتين
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (error) {
      console.error('Error generating certificate:', error);
      toast.error('حدث خطأ في توليد الشهادة');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-2xl p-0 bg-transparent border-0 shadow-none">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="relative"
            >
              {/* خلفية متحركة */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-orange-500/20 to-red-500/20 rounded-3xl blur-xl" />

              {/* المحتوى الرئيسي */}
              <div className="relative bg-gradient-to-br from-white via-yellow-50 to-orange-50 rounded-3xl p-8 border-4 border-yellow-400/30 shadow-2xl">

                {/* الزخارف العلوية */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-3xl">
                  {/* نجوم متحركة */}
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        scale: [1, 1.5, 1],
                        rotate: [0, 180, 360],
                        opacity: [0.3, 0.8, 0.3]
                      }}
                      transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2
                      }}
                    >
                      <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                    </motion.div>
                  ))}
                </div>

                {/* المحتوى */}
                <div className="relative z-10 text-center space-y-6">

                  {/* أيقونة التهنئة */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
                    className="flex justify-center"
                  >
                    <div className="relative">
                      <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                        <Trophy className="w-12 h-12 text-white" />
                      </div>

                      {/* تأثير الوهج */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 0.2, 0.5]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity
                        }}
                      />
                    </div>
                  </motion.div>

                  {/* العنوان */}
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                  >
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-2">
                      🎉 مبروك! 🎉
                    </h1>
                    <h2 className="text-2xl font-bold text-gray-800">
                      لقد أتممت خطة الدراسة بنجاح!
                    </h2>
                  </motion.div>

                  {/* تفاصيل الإنجاز */}
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                    className="bg-white/70 rounded-2xl p-6 border border-yellow-200"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-2 text-lg">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="font-semibold text-gray-700">الخطة:</span>
                        <span className="text-gray-800">{planName}</span>
                      </div>

                      <div className="flex items-center justify-center gap-2 text-lg">
                        <Award className="w-5 h-5 text-blue-500" />
                        <span className="font-semibold text-gray-700">عدد الأيام المكتملة:</span>
                        <span className="text-gray-800">{totalDays} يوم</span>
                      </div>

                      <div className="flex items-center justify-center gap-2 text-lg">
                        <Sparkles className="w-5 h-5 text-purple-500" />
                        <span className="font-semibold text-gray-700">تاريخ الإتمام:</span>
                        <span className="text-gray-800">
                          {completionDate.toLocaleDateString('ar-SA', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  {/* رسالة التهنئة */}
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.6 }}
                    className="text-center"
                  >
                    <p className="text-lg text-gray-700 leading-relaxed">
                      أحسنت! لقد أظهرت التزاماً رائعاً ومثابرة في إتمام خطة الدراسة.
                      <br />
                      هذا الإنجاز يستحق الاحتفال! 🌟
                      <br />
                      <span className="text-sm text-gray-600 mt-2 block">
                        ستحصل على شهادة إتمام رسمية بتصميم احترافي باللغة العربية
                      </span>
                    </p>
                  </motion.div>

                  {/* أزرار العمل */}
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.1, duration: 0.6 }}
                    className="flex gap-4 justify-center pt-4"
                  >
                    <Button
                      onClick={handleGenerateCertificate}
                      disabled={isGenerating}
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105"
                    >
                      {isGenerating ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          جاري التوليد...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Download className="w-5 h-5" />
                          تحميل شهادة الإتمام
                        </div>
                      )}
                    </Button>

                    <Button
                      onClick={onClose}
                      variant="outline"
                      className="border-2 border-gray-300 hover:border-gray-400 px-6 py-3 rounded-xl"
                    >
                      إغلاق
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default CompletionCertificate;
