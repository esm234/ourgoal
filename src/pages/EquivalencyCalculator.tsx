import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calculator } from "lucide-react";

// Define the form schema with validation
const formSchema = z.object({
  highSchoolPercentage: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z
      .number({
        required_error: "هذا الحقل مطلوب",
        invalid_type_error: "يجب إدخال رقم",
      })
      .min(0, { message: "يجب أن تكون النسبة أكبر من أو تساوي 0" })
      .max(100, { message: "يجب أن تكون النسبة أقل من أو تساوي 100" })
  ),
  qiyasScore: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z
      .number({
        required_error: "هذا الحقل مطلوب",
        invalid_type_error: "يجب إدخال رقم",
      })
      .min(0, { message: "يجب أن تكون الدرجة أكبر من أو تساوي 0" })
      .max(100, { message: "يجب أن تكون الدرجة أقل من أو تساوي 100" })
  ),
});

type FormValues = z.infer<typeof formSchema>;

function calculateFinalEquivalencyScore(highSchoolPercentage: number, qiyasScore: number): number {
  const weightedAverage = (highSchoolPercentage * 0.5) + (qiyasScore * 0.5);
  const finalScore = weightedAverage * 4.1;
  return Math.round(finalScore * 100) / 100; // rounded to 2 decimal places
}

const EquivalencyCalculator = () => {
  const [highSchool, setHighSchool] = useState(0);
  const [qiyas, setQiyas] = useState(0);
  const [result, setResult] = useState<number | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const score = calculateFinalEquivalencyScore(highSchool, qiyas);
    setResult(score);
  };

  return (
    <Layout>
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">حاسبة المعادلة المصرية</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              احسب معدلك التقديري للمعادلة المصرية بناء على نسبة الثانوية العامة ودرجة اختبار القدرات
            </p>
          </div>

          <div className="flex justify-center">
            <Card className="w-full max-w-md border-2 border-border bg-secondary">
              <CardHeader>
                <CardTitle>حساب النسبة المكافئة النهائية</CardTitle>
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
                      onChange={e => setHighSchool(Number(e.target.value))}
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
                      onChange={e => setQiyas(Number(e.target.value))}
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
