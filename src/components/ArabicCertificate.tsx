import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface CertificateProps {
  userName: string;
  completionDate: Date;
  planName: string;
  totalDays: number;
  onGenerate?: () => void;
}

const ArabicCertificate: React.FC<CertificateProps> = ({
  userName,
  completionDate,
  planName,
  totalDays,
  onGenerate
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  const generatePDF = async () => {
    if (!certificateRef.current) return;

    try {
      // Capture the certificate as canvas
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 1123,
        height: 794,
      });

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [1123, 794]
      });

      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, 1123, 794);

      // Generate filename
      const dateString = completionDate.toLocaleDateString('ar-SA').replace(/\//g, '-');
      const cleanUserName = userName.replace(/\s+/g, '_');
      const fileName = `شهادة_إتمام_${cleanUserName}_${dateString}.pdf`;

      // Download PDF
      pdf.save(fileName);

      if (onGenerate) onGenerate();
    } catch (error) {
      console.error('Error generating certificate:', error);
    }
  };

  const formattedDate = completionDate.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Certificate Design */}
      <div
        ref={certificateRef}
        className="relative bg-white"
        style={{ width: '1123px', height: '794px' }}
        dir="rtl"
      >
        {/* Golden Border */}
        <div className="absolute inset-4 border-8 border-yellow-500 rounded-lg">
          <div className="absolute inset-4 border-2 border-yellow-600 rounded-md">

            {/* Corner Decorations */}
            <div className="absolute top-0 left-0 w-12 h-12 bg-yellow-500 transform rotate-45 -translate-x-6 -translate-y-6"></div>
            <div className="absolute top-0 right-0 w-12 h-12 bg-yellow-500 transform rotate-45 translate-x-6 -translate-y-6"></div>
            <div className="absolute bottom-0 left-0 w-12 h-12 bg-yellow-500 transform rotate-45 -translate-x-6 translate-y-6"></div>
            <div className="absolute bottom-0 right-0 w-12 h-12 bg-yellow-500 transform rotate-45 translate-x-6 translate-y-6"></div>

            {/* Certificate Content */}
            <div className="flex flex-col items-center justify-center h-full px-16 py-12 text-center">

              {/* Main Title */}
              <h1 className="text-6xl font-bold text-gray-800 mb-6" style={{ fontFamily: 'Arial, sans-serif' }}>
                شهادة شكر وتقدير
              </h1>

              {/* Subtitle */}
              <p className="text-2xl text-gray-600 mb-8" style={{ fontFamily: 'Arial, sans-serif' }}>
                مقدمة من تيم اور جول لـ :
              </p>

              {/* Divider Line */}
              <div className="w-32 h-1 bg-yellow-500 mb-10"></div>

              {/* Student Name */}
              <h2 className="text-5xl font-bold text-yellow-600 mb-12" style={{ fontFamily: 'Arial, sans-serif' }}>
                {userName}
              </h2>

              {/* Certificate Body */}
              <div className="max-w-4xl mb-16">
                <p className="text-2xl leading-relaxed text-gray-800" style={{ fontFamily: 'Arial, sans-serif' }}>
                  لإنجازه خطة الدراسه كاملة بدون كسل , والالتزام بالمهام اليومية , والالتزام والتخطيط وهي اول خطوات النجاح
                </p>
              </div>

              {/* Footer Section */}
              <div className="flex justify-between items-end w-full mt-auto">

                {/* Date Section */}
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Arial, sans-serif' }}>
                    التاريخ :
                  </p>
                  <p className="text-lg text-gray-700" style={{ fontFamily: 'Arial, sans-serif' }}>
                    {formattedDate}
                  </p>
                </div>

                {/* Badge/Seal Section */}
                <div className="flex flex-col items-center">
                  {/* Logo Seal */}
                  <div className="relative mb-4">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center border-4 border-yellow-500 shadow-xl overflow-hidden">
                      <img
                        src="/photo_2025-05-24_16-53-22.jpg"
                        alt="Our Goal Logo"
                        className="w-16 h-16 object-cover rounded-full"
                        onError={(e) => {
                          // Fallback to the other logo if the first one fails
                          const target = e.target as HTMLImageElement;
                          target.src = "/5873012480861653667.jpg";
                        }}
                      />
                    </div>

                    {/* Ribbons */}
                    <div className="absolute -bottom-1 -left-4 w-0 h-0 border-l-6 border-r-6 border-t-12 border-l-transparent border-r-transparent border-t-yellow-500"></div>
                    <div className="absolute -bottom-1 -right-4 w-0 h-0 border-l-6 border-r-6 border-t-12 border-l-transparent border-r-transparent border-t-yellow-500"></div>
                  </div>

                  {/* Signature Line */}
                  <div className="w-32 h-0.5 bg-gray-800 mb-2"></div>

                  {/* Badge Text */}
                  <p className="text-sm text-gray-600" style={{ fontFamily: 'Arial, sans-serif' }}>
                    Team Our goal is success
                  </p>
                </div>
              </div>

              {/* Additional Details */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <p className="text-sm text-gray-500" style={{ fontFamily: 'Arial, sans-serif' }}>
                  تم إكمال خطة "{planName}" بنجاح في {totalDays} يوم
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={generatePDF}
        className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-bold rounded-lg shadow-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 transform hover:scale-105"
      >
        تحميل الشهادة PDF
      </button>
    </div>
  );
};

export default ArabicCertificate;
