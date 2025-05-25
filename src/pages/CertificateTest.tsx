import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ArabicCertificate from '@/components/ArabicCertificate';

const CertificateTest: React.FC = () => {
  const [showCertificate, setShowCertificate] = useState(false);

  const testData = {
    userName: 'أحمد محمد',
    completionDate: new Date(),
    planName: 'خطة الدراسة المكثفة',
    totalDays: 30
  };

  return (
    <Layout>
      <section className="min-h-screen py-16 px-4 bg-gradient-to-br from-background via-secondary/30 to-background">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-card/90 backdrop-blur-xl shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                اختبار شهادة الإتمام
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <p className="text-lg text-muted-foreground">
                  اضغط على الزر أدناه لمعاينة شهادة الإتمام
                </p>
                
                <Button
                  onClick={() => setShowCertificate(true)}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold px-8 py-3 rounded-xl"
                >
                  عرض الشهادة
                </Button>
              </div>

              {showCertificate && (
                <div className="mt-8">
                  <ArabicCertificate
                    userName={testData.userName}
                    completionDate={testData.completionDate}
                    planName={testData.planName}
                    totalDays={testData.totalDays}
                    onGenerate={() => {
                      console.log('Certificate generated successfully!');
                      setShowCertificate(false);
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default CertificateTest;
