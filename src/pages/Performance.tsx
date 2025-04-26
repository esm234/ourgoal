
import React from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, ArrowRight } from "lucide-react";

const Performance = () => {
  return (
    <Layout>
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">لوحة الأداء</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              تتبع تقدمك وأدائك في اختبارات قياس التجريبية
            </p>
          </div>

          <div className="flex justify-center">
            <Card className="w-full max-w-2xl border-2 border-border bg-secondary">
              <CardContent className="p-10 text-center">
                <div className="mb-6">
                  <BarChart className="h-24 w-24 text-muted-foreground mx-auto" />
                </div>
                <h2 className="text-2xl font-bold mb-3">لا توجد بيانات بعد</h2>
                <p className="text-muted-foreground mb-8">
                  لم تقم بإجراء أي اختبار تجريبي حتى الآن. ابدأ اختباراً الآن لتتبع أدائك وتحسين مستواك.
                </p>
                <Link to="/qiyas-tests">
                  <Button className="bg-primary hover:bg-primary/90 text-white flex items-center mx-auto">
                    ابدأ الاختبارات الآن
                    <ArrowRight className="mr-2" size={16} />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Performance;
