import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calculator } from "lucide-react";

function calculateFinalEquivalencyScore(highSchoolPercentage: number, qiyasScore: number): number {
  const average = (highSchoolPercentage + qiyasScore) / 2;
  const finalScore = average * 4.1;
  return Math.round(finalScore * 100) / 100; // rounded to 2 decimal places
}

const EquivalencyCalculator = () => {
  const [highSchool, setHighSchool] = useState<number | ''>('');
  const [qiyas, setQiyas] = useState<number | ''>('');
  const [result, setResult] = useState<number | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (highSchool !== '' && qiyas !== '') {
      const score = calculateFinalEquivalencyScore(Number(highSchool), Number(qiyas));
      setResult(score);
    }
  };

  return (
    <Layout>
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-primary">حاسبة المعادلة المصرية</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              احسب معدلك النهائي بناءً على نسبة الثانوية العامة ودرجة اختبار القدرات
            </p>
          </div>

          <div className="flex justify-center">
            <Card className="w-full max-w-md border-2 border-border bg-secondary">
              <CardHeader>
                <CardTitle className="text-center">حساب النسبة المكافئة النهائية</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleCalculate} className="space-y-6">
                  <div>
                    <label className="block mb-1 text-right">النسبة المئوية للثانوية العامة (من 100)</label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={highSchool}
                      onChange={e => setHighSchool(e.target.value === '' ? '' : Number(e.target.value))}
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-right">درجة قياس (من 100)</label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={qiyas}
                      onChange={e => setQiyas(e.target.value === '' ? '' : Number(e.target.value))}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 flex items-center justify-center"
                  >
                    <Calculator className="ml-2" size={18} />
                    احسب النتيجة النهائية
                  </Button>
                </form>

                {result !== null && (
                  <div className="mt-8 p-4 bg-background rounded-lg border-2 border-primary text-center">
                    <h3 className="text-lg font-bold mb-2">نتيجة المعادلة</h3>
                    <p className="text-3xl font-bold text-primary mb-1">{result}</p>
                    <p className="text-muted-foreground text-sm">من أصل 410 درجة</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default EquivalencyCalculator;
