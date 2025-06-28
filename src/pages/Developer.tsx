import React from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import { FaGithub, FaTwitter, FaLinkedin, FaEnvelope } from "react-icons/fa";

const Developer = () => {
  return (
    <Layout>
      <SEO
        title="المطور - Eslam"
        description="صفحة المطور الخاصة بموقع OurGoal - معلومات عن المطور وحساباته الشخصية"
      />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-card rounded-lg shadow-lg overflow-hidden">
          <div className="bg-primary h-48 relative">
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
              <div className="rounded-full border-4 border-background w-32 h-32 overflow-hidden bg-muted">
                <img
                  src="/photo_2025-05-24_16-53-22.jpg"
                  alt="Eslam"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          
          <div className="pt-20 pb-10 px-6 text-center">
            <h1 className="text-3xl font-bold mb-2">إسلام</h1>
            <h2 className="text-xl text-muted-foreground mb-6">مطور موقع OurGoal</h2>
            
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              مرحباً بك في صفحتي الشخصية! أنا مطور ويب متخصص في بناء تطبيقات الويب التفاعلية باستخدام
              React وTypeScript. قمت بتطوير موقع OurGoal لمساعدة الطلاب على تنظيم دراستهم وتحقيق أهدافهم الأكاديمية.
            </p>
            
            <div className="flex justify-center gap-4 mb-10">
              <Button variant="outline" size="lg" className="flex items-center gap-2">
                <FaGithub />
                GitHub
              </Button>
              <Button variant="outline" size="lg" className="flex items-center gap-2">
                <FaTwitter />
                Twitter
              </Button>
              <Button variant="outline" size="lg" className="flex items-center gap-2">
                <FaLinkedin />
                LinkedIn
              </Button>
              <Button variant="outline" size="lg" className="flex items-center gap-2">
                <FaEnvelope />
                Email
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <div className="bg-muted/20 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">المهارات</h3>
                <div className="flex flex-wrap gap-2">
                  {["React", "TypeScript", "Node.js", "Supabase", "Tailwind CSS", "Next.js", "Firebase", "UI/UX Design"].map((skill) => (
                    <span key={skill} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="bg-muted/20 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">المشاريع</h3>
                <ul className="space-y-2 text-right">
                  <li className="flex justify-between items-center">
                    <Button variant="link" className="p-0">زيارة</Button>
                    <span>OurGoal - منصة تعليمية</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <Button variant="link" className="p-0">زيارة</Button>
                    <span>مشروع شخصي آخر</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <Button variant="link" className="p-0">زيارة</Button>
                    <span>تطبيق ويب تفاعلي</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-12 bg-muted/20 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">تواصل معي</h3>
              <p className="mb-4">
                إذا كنت مهتماً بالتعاون أو لديك أي استفسارات، يمكنك التواصل معي عبر البريد الإلكتروني
                أو من خلال حساباتي على مواقع التواصل الاجتماعي.
              </p>
              <Button className="bg-primary hover:bg-primary/90">
                أرسل رسالة
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Developer; 