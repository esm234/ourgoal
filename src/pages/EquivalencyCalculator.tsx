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

// Placeholder colleges data (replace with real data later)
const collegesMale = [
  { name: "طب القاهرة", minScore: 410.000 },
  { name: "طب أسنان القاهرة", minScore: 410.000 },
  { name: "طب الإسكندرية", minScore: 410.000 },
  { name: "طب أسنان الإسكندرية", minScore: 410.000 },
  { name: "طب عين شمس", minScore: 410.000 },
  { name: "طب أسنان عين شمس", minScore: 410.000 },
  { name: "طب سوهاج", minScore: 410.000 },
  { name: "طب الفيوم", minScore: 410.000 },
  { name: "طب أسيوط", minScore: 410.000 },
  { name: "طب طنطا", minScore: 410.000 },
  { name: "طب أسنان طنطا", minScore: 410.000 },
  { name: "طب المنصورة", minScore: 410.000 },
  { name: "طب أسنان المنصورة", minScore: 410.000 },
  { name: "طب الزقازيق", minScore: 410.000 },
  { name: "طب المنوفية بشبين الكوم", minScore: 410.000 },
  { name: "طب بنها", minScore: 410.000 },
  { name: "طب بني سويف", minScore: 410.000 },
  { name: "طب المنيا", minScore: 410.000 },
  { name: "طب أسنان السويس", minScore: 410.000 },
  { name: "طب فاقوس", minScore: 410.000 },
  { name: "طب أسنان المنوفية", minScore: 410.000 },
  { name: "طب دمياط", minScore: 410.000 },
  { name: "طب الأقصر", minScore: 410.000 },
  { name: "طب كفر الشيخ", minScore: 410.000 },
  { name: "طب حلوان", minScore: 410.000 },
  { name: "طب قناة السويس بالإسماعيلية", minScore: 410.000 },
  { name: "طب بور سعيد", minScore: 410.000 },
  { name: "طب السويس", minScore: 409.975882 },
  { name: "طب الوادي الجديد", minScore: 409.975882 },
  { name: "طب جنوب الوادي", minScore: 409.975882 },
  { name: "طب العريش", minScore: 409.951765 },
  { name: "طب أسوان", minScore: 409.927647 },
  { name: "طب أسنان الزقازيق", minScore: 409.927647 },
  { name: "طب أسنان قناة السويس بالإسماعيلية", minScore: 409.886111 },
  { name: "طب أسنان الفيوم", minScore: 409.884771 },
  { name: "طب أسنان كفر الشيخ", minScore: 409.879412 },
  { name: "طب أسنان بني سويف", minScore: 409.871875 },
  { name: "طب أسنان أسيوط", minScore: 409.863333 },
  { name: "طب أسنان المنيا", minScore: 409.833856 },
  { name: "طب أسنان جنوب الوادي", minScore: 409.807059 },
  { name: "علاج طبيعي القاهرة", minScore: 409.790980 },
  { name: "علاج طبيعي كفر الشيخ", minScore: 409.766863 },
  { name: "صيدلة القاهرة", minScore: 409.758824 },
  { name: "علاج طبيعي بورسعيد", minScore: 409.651215 },
  { name: "علاج طبيعي بنها", minScore: 409.631871 },
  { name: "علاج طبيعي السويس", minScore: 409.468072 },
  { name: "علاج طبيعي قناة السويس", minScore: 409.452328 },
  { name: "علاج طبيعي بني سويف", minScore: 409.359375 },
  { name: "صيدلة وتصنيع دوائي كفر الشيخ", minScore: 409.281830 },
  { name: "كلية الهندسة جامعة دمنهور", minScore: 409.276471 },
  { name: "حاسبات وذكاء اصطناعي القاهرة رياضة", minScore: 408.546242 },
  { name: "صيدلة المنصورة", minScore: 407.950000 },
  { name: "هندسة المنصورة", minScore: 407.950000 },
  { name: "صيدلة الزقازيق", minScore: 407.950000 },
  { name: "صيدلة المنوفية", minScore: 407.950000 },
  { name: "صيدلة عين شمس", minScore: 407.950000 },
  { name: "صيدلة طنطا", minScore: 407.950000 },
  { name: "صيدلة أسيوط", minScore: 407.950000 },
  { name: "صيدلة جنوب الوادي", minScore: 407.950000 },
  { name: "صيدلة المنيا", minScore: 407.950000 },
  { name: "صيدلة حلوان", minScore: 407.950000 },
  { name: "هندسة بترول وتعدين السويس", minScore: 407.950000 },
  { name: "صيدلة بني سويف", minScore: 407.950000 },
  { name: "صيدلة قناة السويس بالإسماعيلية", minScore: 407.950000 },
  { name: "هندسة القاهرة", minScore: 407.950000 },
  { name: "صيدلة الإسكندرية", minScore: 407.950000 },
  { name: "هندسة الإسكندرية", minScore: 407.950000 },
  { name: "صيدلة الفيوم", minScore: 407.950000 },
  { name: "صيدلة دمنهور", minScore: 407.950000 },
  { name: "علاج طبيعي جنوب الوادي", minScore: 407.950000 },
  { name: "صيدلة بور سعيد", minScore: 407.950000 },
  { name: "كلية مدينة السادات", minScore: 407.925882 },
  { name: "صيدلة سوهاج", minScore: 407.829412 },
  { name: "هندسة عين شمس", minScore: 407.805294 },
  { name: "هندسة إلكترونية المنوفية بمنوف", minScore: 407.777827 },
  { name: "هندسة بني سويف", minScore: 407.684706 },
  { name: "هندسة كفر الشيخ", minScore: 407.507843 },
  { name: "هندسة بنها بشبرا", minScore: 407.440850 },
  { name: "حاسبات وعلوم البيانات الإسكندرية رياضة", minScore: 407.225131 },
  { name: "هندسة طنطا", minScore: 406.882292 },
  { name: "هندسة الطاقة أسوان", minScore: 406.687843 },
  { name: "هندسة بنها", minScore: 405.900000 },
  { name: "هندسة دمياط", minScore: 405.900000 },
  { name: "هندسة حلوان بالمطرية", minScore: 405.900000 },
  { name: "هندسة حلوان", minScore: 405.900000 },
  { name: "هندسة المنوفية بشبين الكوم", minScore: 405.900000 },
  { name: "هندسة المنيا", minScore: 405.900000 },
  { name: "هندسة بورسعيد", minScore: 405.900000 },
  { name: "هندسة أسيوط", minScore: 405.900000 },
  { name: "حاسبات ومعلومات عين شمس رياضة", minScore: 405.900000 },
  { name: "حاسبات ومعلومات المنصورة رياضة", minScore: 405.900000 },
  { name: "طب بيطري عين شمس", minScore: 405.900000 },
  { name: "طب بيطري القاهرة", minScore: 405.900000 },
  { name: "هندسة الفيوم", minScore: 405.854444 },
  { name: "حاسبات وذكاء اصطناعي حلوان رياضة", minScore: 405.827647 },
  { name: "هندسة قناة السويس بالإسماعيلية", minScore: 405.803529 },
  { name: "هندسة السويس", minScore: 405.729167 },
  { name: "هندسة جنوب الوادي", minScore: 405.682271 },
  { name: "هندسة أسوان", minScore: 405.586471 },
  { name: "هندسة سوهاج", minScore: 404.262010 },
  { name: "تخطيط عمراني القاهرة", minScore: 403.850000 },
  { name: "علوم البترول والتعدين مطروح", minScore: 403.850000 },
  { name: "حاسبات ومعلومات الزقازيق رياضة", minScore: 403.850000 },
  { name: "حاسبات ومعلومات المنوفية بشبين الكوم رياضة", minScore: 403.850000 },
  { name: "طب بيطري المنيا", minScore: 403.850000 },
  { name: "حاسبات ومعلومات دمياط رياضة", minScore: 403.850000 },
  { name: "حاسبات ومعلومات دمنهور بالنوبارية رياضة", minScore: 403.850000 },
  { name: "الذكاء الاصطناعي كفر الشيخ رياضة", minScore: 403.850000 },
  { name: "حاسبات ومعلومات طنطا رياضة", minScore: 403.850000 },
  { name: "طب بيطري المنوفية", minScore: 403.168676 },
  { name: "المعهد التكنولوجي العالي بالسادس من أكتوبر", minScore: 401.800000 },
  { name: "ذكاء اصطناعي المنوفية شبين الكوم رياضة", minScore: 401.800000 },
  { name: "علوم البترول والتعدين مطروح - علوم", minScore: 401.800000 },
  { name: "حاسبات وذكاء اصطناعي بنها رياضة", minScore: 401.800000 },
  { name: "حاسبات ومعلومات كفر الشيخ رياضة", minScore: 401.800000 },
  { name: "طب بيطري الإسكندرية", minScore: 401.800000 },
  { name: "حاسبات ومعلومات الفيوم رياضة", minScore: 401.800000 },
  { name: "المعهد العالي للهندسة والتكنولوجيا الحديثة بالمرج", minScore: 401.488815 },
  { name: "السن كفر الشيخ", minScore: 401.380286 },
  { name: "معهد الإسكندرية العالي للتكنولوجيا بسموحة بمصروفات", minScore: 401.087190 },
  { name: "حاسبات ومعلومات المنيا رياضة", minScore: 401.079820 },
  { name: "حاسبات وذكاء اصطناعي السادات رياضة", minScore: 401.078145 },
  { name: "حاسبات ومعلومات السويس رياضة", minScore: 399.750000 },
  { name: "معهد عالي هندسة وتكنولوجيا المنيا الجديدة", minScore: 399.750000 },
  { name: "حاسبات ومعلومات قناة السويس بالإسماعيلية رياضة", minScore: 399.750000 },
  { name: "المعهد الكندي العالي للهندسة 6 أكتوبر", minScore: 399.750000 }
];
const collegesFemale = [
  { name: "طب بنات القاهرة", minScore: 398 },
  { name: "طب أسنان بنات القاهرة", minScore: 393 },
  { name: "صيدلة بنات الإسكندرية", minScore: 388 },
  { name: "هندسة بنات القاهرة", minScore: 378 },
  { name: "حاسبات ومعلومات بنات عين شمس", minScore: 368 },
];

const EquivalencyCalculator = () => {
  const [highSchool, setHighSchool] = useState<number | ''>('');
  const [qiyas, setQiyas] = useState<number | ''>('');
  const [result, setResult] = useState<number | null>(null);
  const [showColleges, setShowColleges] = useState(false);
  const [gender, setGender] = useState<'male' | 'female'>('male');

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (highSchool !== '' && qiyas !== '') {
      const score = calculateFinalEquivalencyScore(Number(highSchool), Number(qiyas));
      setResult(score);
      setShowColleges(false);
    }
  };

  const availableColleges = (gender === 'male' ? collegesMale : collegesFemale).filter(college => result !== null && result >= college.minScore);

  return (
    <Layout>
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-primary">معادلة المسارات</h1>
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
                {result === null && (
                  <form onSubmit={handleCalculate} className="space-y-6">
                    <div className="flex justify-center mb-4 gap-2">
                      <Button
                        type="button"
                        variant={gender === 'male' ? 'default' : 'outline'}
                        className={gender === 'male' ? 'bg-primary text-white' : ''}
                        onClick={() => setGender('male')}
                      >
                        البنين
                      </Button>
                      <Button
                        type="button"
                        variant={gender === 'female' ? 'default' : 'outline'}
                        className={gender === 'female' ? 'bg-primary text-white' : ''}
                        onClick={() => setGender('female')}
                      >
                        البنات
                      </Button>
                    </div>
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
                )}

                {result !== null && !showColleges && (
                  <div className="mt-8 p-4 bg-background rounded-lg border-2 border-primary text-center">
                    <div className="flex justify-center mb-4 gap-2">
                      <Button
                        type="button"
                        variant={gender === 'male' ? 'default' : 'outline'}
                        className={gender === 'male' ? 'bg-primary text-white' : ''}
                        onClick={() => setGender('male')}
                      >
                        البنين
                      </Button>
                      <Button
                        type="button"
                        variant={gender === 'female' ? 'default' : 'outline'}
                        className={gender === 'female' ? 'bg-primary text-white' : ''}
                        onClick={() => setGender('female')}
                      >
                        البنات
                      </Button>
                    </div>
                    <h3 className="text-lg font-bold mb-2">المجموع الاعتباري</h3>
                    <p className="text-4xl font-bold text-primary mb-1">{result} <span className="text-lg text-muted-foreground">/ 410</span></p>
                    <Button
                      className="mt-4 w-full"
                      onClick={() => setShowColleges(true)}
                    >
                      عرض الكليات المتاحة
                    </Button>
                  </div>
                )}

                {result !== null && showColleges && (
                  <div className="mt-8 p-4 bg-background rounded-lg border-2 border-primary text-center">
                    <div className="flex justify-center mb-4 gap-2">
                      <Button
                        type="button"
                        variant={gender === 'male' ? 'default' : 'outline'}
                        className={gender === 'male' ? 'bg-primary text-white' : ''}
                        onClick={() => setGender('male')}
                      >
                        البنين
                      </Button>
                      <Button
                        type="button"
                        variant={gender === 'female' ? 'default' : 'outline'}
                        className={gender === 'female' ? 'bg-primary text-white' : ''}
                        onClick={() => setGender('female')}
                      >
                        البنات
                      </Button>
                    </div>
                    <h3 className="text-lg font-bold mb-4">الكليات المتاحة</h3>
                    {availableColleges.length > 0 ? (
                      <ul className="text-right">
                        {availableColleges.map(college => (
                          <li key={college.name} className="mb-2 font-semibold text-primary/90 bg-primary/10 rounded px-3 py-2">
                            {college.name}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>لا توجد كليات متاحة لهذا المجموع</p>
                    )}
                    <Button
                      className="mt-4 w-full"
                      onClick={() => setShowColleges(false)}
                    >
                      العودة للنتيجة
                    </Button>
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
