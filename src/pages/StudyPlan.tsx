import React from 'react';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import StudyPlanGenerator from '@/components/StudyPlanGenerator';

const StudyPlan: React.FC = () => {
  const studyPlanStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "مولد خطة الدراسة الذكي - اور جول",
    "description": "أنشئ خطة دراسية مخصصة ومنظمة لاختبار القدرات بناءً على تاريخ اختبارك وعدد مرات المراجعة",
    "url": "https://ourgoal.site/study-plan",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "SAR"
    },
    "featureList": [
      "توزيع ذكي للاختبارات",
      "خطة مخصصة حسب الوقت المتاح",
      "تصدير الخطة بصيغة PDF",
      "تتبع التقدم اليومي",
      "مراجعات متعددة"
    ]
  };

  return (
    <Layout>
      <SEO
        title="مولد خطة الدراسة الذكي | اور جول - Our Goal"
        description="أنشئ خطة دراسية مخصصة ومنظمة لاختبار القدرات بناءً على تاريخ اختبارك وعدد مرات المراجعة المطلوبة. توزيع ذكي للاختبارات مع إمكانية التصدير والتتبع."
        keywords="خطة دراسية, مولد خطة دراسة, اختبار القدرات, تنظيم الدراسة, جدولة الاختبارات, مراجعة القدرات, تخطيط الدراسة, اور جول"
        url="/study-plan"
        type="website"
        structuredData={studyPlanStructuredData}
      />
      <section className="min-h-screen py-16 px-4 bg-gradient-to-br from-background via-secondary/30 to-background relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.03] [mask-image:radial-gradient(ellipse_at_center,white_20%,transparent_75%)]"></div>

        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-r from-accent/15 to-primary/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10">
          <StudyPlanGenerator />
        </div>
      </section>
    </Layout>
  );
};

export default StudyPlan;
