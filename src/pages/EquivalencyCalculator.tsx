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
  { name: "طب أسنان القاهرة", minScore: 410.000000 },
  { name: "طب أسنان الإسكندرية", minScore: 410.000000 },
  { name: "طب القاهرة", minScore: 410.000000 },
  { name: "طب الإسكندرية", minScore: 410.000000 },
  { name: "صيدلة الإسكندرية", minScore: 410.000000 },
  { name: "طب عين شمس", minScore: 410.000000 },
  { name: "طب أسنان عين شمس", minScore: 410.000000 },
  { name: "طب سوهاج", minScore: 410.000000 },
  { name: "طب الفيوم", minScore: 410.000000 },
  { name: "طب أسنان جنوب الوادي", minScore: 410.000000 },
  { name: "طب أسيوط", minScore: 410.000000 },
  { name: "طب طنطا", minScore: 410.000000 },
  { name: "طب أسنان طنطا", minScore: 410.000000 },
  { name: "طب المنصورة", minScore: 410.000000 },
  { name: "طب أسنان المنصورة", minScore: 410.000000 },
  { name: "طب الزقازيق", minScore: 410.000000 },
  { name: "طب أسنان قناة السويس بالإسماعيلية", minScore: 410.000000 },
  { name: "طب قناة السويس بالإسماعيلية", minScore: 410.000000 },
  { name: "طب المنوفية بشبين الكوم", minScore: 410.000000 },
  { name: "طب بنها", minScore: 410.000000 },
  { name: "طب بني سويف", minScore: 410.000000 },
  { name: "طب المنيا", minScore: 410.000000 },
  { name: "طب أسنان المنيا", minScore: 410.000000 },
  { name: "إعلام المنوفية", minScore: 409.975882 },
  { name: "طب فاقوس", minScore: 409.975882 },
  { name: "طب دمياط", minScore: 409.975882 },
  { name: "طب جنوب الوادي", minScore: 409.975882 },
  { name: "طب كفر الشيخ", minScore: 409.975882 },
  { name: "طب أسنان المنوفية", minScore: 409.954444 },
  { name: "صيدلة المنيا", minScore: 409.951765 },
  { name: "طب حلوان", minScore: 409.951765 },
  { name: "طب أسنان كفر الشيخ", minScore: 409.951765 },
  { name: "طب بور سعيد", minScore: 409.948761 },
  { name: "طب السويس", minScore: 409.948750 },
  { name: "علاج طبيعي القاهرة", minScore: 409.930327 },
  { name: "طب العريش", minScore: 409.930327 },
  { name: "طب الأقصر", minScore: 409.927647 },
  { name: "طب أسوان", minScore: 409.927647 },
  { name: "طب الوادي الجديد", minScore: 409.908889 },
  { name: "طب أسنان الفيوم", minScore: 409.906209 },
  { name: "طب أسنان الزقازيق", minScore: 409.906209 },
  { name: "طب أسنان السويس", minScore: 409.906209 },
  { name: "طب أسنان أسيوط", minScore: 409.903529 },
  { name: "طب أسنان بني سويف", minScore: 409.903194 },
  { name: "علاج طبيعي قناة السويس", minScore: 409.900515 },
  { name: "علاج طبيعي بنها", minScore: 409.897500 },
  { name: "صيدلة دمنهور", minScore: 409.882092 },
  { name: "علاج طبيعي السويس", minScore: 409.882092 },
  { name: "صيدلة المنصورة", minScore: 409.879412 },
  { name: "صيدلة طنطا", minScore: 409.879412 },
  { name: "صيدلة القاهرة", minScore: 409.876397 },
  { name: "علاج طبيعي بني سويف", minScore: 409.836536 },
  { name: "علاج طبيعي كفر الشيخ", minScore: 409.829167 },
  { name: "علاج طبيعي بورسعيد", minScore: 409.807059 },
  { name: "صيدلة حلوان", minScore: 409.782941 },
  { name: "صيدلة عين شمس", minScore: 409.775000 },
  { name: "علاج طبيعي جنوب الوادي", minScore: 409.766555 },
  { name: "صيدلة و تصنيع دوائي كفر الشيخ", minScore: 409.752780 },
  { name: "صيدلة الزقازيق", minScore: 409.745135 },
  { name: "صيدلة قناة السويس بالإسماعيلية", minScore: 409.782941 },
  { name: "صيدلة المنوفية", minScore: 409.782941 },
  { name: "صيدلة بور سعيد", minScore: 409.758824 },
  { name: "صيدلة الفيوم", minScore: 409.728676 },
  { name: "صيدلة أسيوط", minScore: 409.721307 },
  { name: "صيدلة مدينة السادات", minScore: 409.673072 },
  { name: "صيدلة بني سويف", minScore: 409.658333 },
  { name: "صيدلة سوهاج", minScore: 409.571242 },
  { name: "صيدلة جنوب الوادي", minScore: 409.570572 },
  { name: "صيدلة ج الوادي الجديد", minScore: 409.541765 },
  { name: "كلية الهندسة جامعة دمنهور", minScore: 407.950000 },
  { name: "هندسة الطاقة أسوان", minScore: 407.950000 },
  { name: "هندسة جنوب الوادي", minScore: 407.950000 },
  { name: "هندسة المنيا", minScore: 407.950000 },
  { name: "هندسة بترول و تعدين السويس", minScore: 407.950000 },
  { name: "هندسة أسيوط", minScore: 407.950000 },
  { name: "هندسة الإسكندرية", minScore: 407.950000 },
  { name: "طب بيطري الإسكندرية", minScore: 407.950000 },
  { name: "هندسة عين شمس", minScore: 407.925882 },
  { name: "هندسة إلكترونية المنوفية بمنوف", minScore: 407.858889 },
  { name: "هندسة القاهرة", minScore: 407.836111 },
  { name: "طب بيطري القاهرة", minScore: 407.821875 },
  { name: "هندسة كفر الشيخ", minScore: 407.813333 },
  { name: "هندسة دمياط", minScore: 407.804959 },
  { name: "هندسة السويس", minScore: 407.796250 },
  { name: "هندسة الزقازيق", minScore: 407.705139 },
  { name: "حاسبات و ذكاء اصطناعي القاهرة رياضة", minScore: 407.684706 },
  { name: "هندسة المنصورة", minScore: 407.566127 },
  { name: "هندسة طنطا", minScore: 407.472672 },
  { name: "هندسة بني سويف", minScore: 407.454248 },
  { name: "هندسة المنوفية بشبين الكوم", minScore: 406.505621 },
  { name: "العلوم الصحية التطبيقية المنوفية", minScore: 405.900000 },
  { name: "هندسة بنها", minScore: 405.900000 },
  { name: "هندسة بنها بشبرا", minScore: 405.900000 },
  { name: "هندسة قناة السويس بالإسماعيلية", minScore: 405.900000 },
  { name: "هندسة حلوان", minScore: 405.900000 },
  { name: "هندسة الفيوم", minScore: 405.900000 },
  { name: "هندسة حلوان بالمطرية", minScore: 405.609918 },
  { name: "هندسة بور سعيد", minScore: 405.575752 },
  { name: "هندسة أسوان", minScore: 405.571397 },
  { name: "طب بيطري كفر الشيخ", minScore: 405.335580 },
  { name: "طب بيطري عين شمس", minScore: 404.924575 },
  { name: "هندسة سوهاج", minScore: 404.715221 },
  { name: "تخطيط عمراني القاهرة", minScore: 403.850000 },
  { name: "معهد العبور العالي للهندسة والتكنولوجيا بمصروفات", minScore: 403.850000 },
  { name: "حاسبات ومعلومات المنيا رياضة", minScore: 403.850000 },
  { name: "حاسبات و علوم البيانات الإسكندرية رياضة", minScore: 403.850000 },
  { name: "حاسبات ومعلومات دمياط رياضة", minScore: 403.850000 },
  { name: "السن كفر الشيخ", minScore: 403.850000 },
  { name: "طب بيطري المنصورة", minScore: 403.850000 },
  { name: "حاسبات و ذكاء اصطناعي حلوان رياضة", minScore: 403.850000 },
  { name: "حاسبات ومعلومات عين شمس رياضة", minScore: 403.850000 },
  { name: "فنون جميلة (عمارة) المنصورة", minScore: 403.850000 },
  { name: "حاسبات ومعلومات المنصورة رياضة", minScore: 403.850000 },
  { name: "طب بيطري المنوفية", minScore: 403.850000 },
  { name: "الذكاء الاصطناعي كفر الشيخ رياضة", minScore: 403.850000 },
  { name: "حاسبات ومعلومات الزقازيق رياضة", minScore: 403.850000 },
  { name: "حاسبات ومعلومات دمنهور بالنوبارية رياضة", minScore: 403.850000 },
  { name: "دار العلوم أسوان", minScore: 403.850000 },
  { name: "العلوم الصحية التطبيقية بني سويف", minScore: 403.850000 },
  { name: "طب بيطري دمنهور", minScore: 403.850000 },
  { name: "فنون جميلة (عمارة) حلوان", minScore: 403.850000 },
  { name: "حاسبات و ذكاء اصطناعي بنها رياضة", minScore: 403.850000 },
  { name: "فنون جميلة (عمارة) الإسكندرية", minScore: 403.850000 },
  { name: "حاسبات ومعلومات المنوفية بشبين الكوم رياضة", minScore: 403.850000 },
  { name: "طب بيطري الزقازيق", minScore: 403.850000 },
  { name: "حاسبات ومعلومات سوهاج رياضة", minScore: 403.801765 },
  { name: "حاسبات ومعلومات طنطا رياضة", minScore: 403.756209 },
  { name: "طب بيطري بنها", minScore: 403.602794 },
  { name: "حاسبات ومعلومات كفر الشيخ رياضة", minScore: 403.519722 },
  { name: "حاسبات وذكاء اصطناعي جنوب الوادي فرع الغردقة رياضة", minScore: 403.025980 },
  { name: "حاسبات وذكاء اصطناعي السادات رياضة", minScore: 401.992188 },
  { name: "ذكاء إصطناعي المنوفية شبين الكوم رياضة", minScore: 401.800000 },
  { name: "حاسبات و معلومات العريش رياضة", minScore: 401.800000 },
  { name: "حاسبات وذكاء اصطناعي مطروح رياضة", minScore: 401.800000 },
  { name: "السن عين شمس", minScore: 401.649265 },
  { name: "المعهد العالى للهندسة والتكنولوجيا بكنج مربوط", minScore: 401.633521 },
  { name: "حاسبات ومعلومات قناة السويس بالإسماعيلية رياضة", minScore: 401.293529 },
  { name: "حاسبات ومعلومات السويس رياضة", minScore: 400.942484 },
  { name: "إعلام القاهرة", minScore: 400.804812 },
  { name: "حاسبات ومعلومات الفيوم رياضة", minScore: 399.750000 },
  { name: "السن قناة السويس بالإسماعيلية", minScore: 399.750000 },
  { name: "إعلام عين شمس", minScore: 399.564667 },
  { name: "حاسبات ومعلومات بني سويف رياضة", minScore: 399.449869 },
  { name: "المعهد العالي للهندسة والتكنولوجيا بالزقازيق", minScore: 399.417377 },
  { name: "حاسبات ومعلومات أسيوط رياضة", minScore: 398.481144 },
  { name: "حاسبات ومعلومات الأقصر رياضة", minScore: 397.700000 },
  { name: "فنون جميلة (عمارة) أسيوط", minScore: 397.700000 },
  { name: "حاسبات ومعلومات قنا رياضة", minScore: 397.700000 },
  { name: "تمريض طنطا", minScore: 397.076626 },
  { name: "طب بيطري أسوان", minScore: 397.076626 },
  { name: "السن الفيوم", minScore: 395.650000 },
  { name: "علوم البترول والتعدين مطروح", minScore: 395.650000 },
  { name: "اقتصاد و علوم سياسية القاهرة", minScore: 395.650000 },
  { name: "علوم القاهرة", minScore: 395.429592 },
  { name: "علوم البترول والتعدين مطروح - علوم", minScore: 395.393750 },
  { name: "السن أسوان", minScore: 395.309338 },
  { name: "طب بيطري مدينة السادات", minScore: 394.326042 },
  { name: "طب بيطري المنيا", minScore: 393.600000 },
  { name: "معهد الصفوة العالي هندسة وتكنولوجيا بالقليوبية", minScore: 393.600000 },
  { name: "كلية تكنولوجيا الصناعة والطاقة بالقاهرة جامعة مصر الدولية التكنولوجية", minScore: 393.508889 },
  { name: "الدراسات الاقتصادية والعلوم السياسية الإسكندرية", minScore: 393.192010 },
  { name: "طب بيطري أسيوط", minScore: 391.525882 },
  { name: "المجمع التكنولوجي المتكامل بالسلام", minScore: 389.500000 },
  { name: "السن الأقصر", minScore: 389.500000 },
  { name: "فنون جميلة (عمارة) المنيا", minScore: 389.475882 },
  { name: "السن بني سويف", minScore: 389.397500 },
  { name: "معهد أكتوبر العالي للهندسة والتكنولوجيا م 6 اكتوبر بمصروفات", minScore: 389.140580 },
  { name: "معهد عالي كندي تكنولوجيا هندسة ت. خامس", minScore: 388.803603 },
  { name: "كلية تكنولوجيا العلوم الصحية 6 أكتوبر التكنولوجية", minScore: 388.799248 },
  { name: "فنون جميلة (فنون) حلوان", minScore: 387.450000 },
  { name: "إعلام بني سويف", minScore: 387.450000 },
  { name: "السن المنيا", minScore: 387.128766 },
  { name: "السن جنوب الوادي فرع الغردقة", minScore: 385.400000 },
  { name: "طب بيطري قناة السويس بالإسماعيلية", minScore: 385.400000 },
  { name: "سياسة واقتصاد السويس", minScore: 385.021822 },
  { name: "السن سوهاج", minScore: 384.759375 },
  { name: "طب بيطري بني سويف", minScore: 379.250000 },
  { name: "تمريض المنصورة", minScore: 379.250000 },
  { name: "سياسة واقتصاد بني سويف", minScore: 379.250000 },
  { name: "آداب انتساب موجه القاهرة", minScore: 379.250000 }
];
const collegesFemale = [
  { name: "طب بنات القاهرة", minScore: 398 },
  { name: "طب أسنان بنات القاهرة", minScore: 393 },
  { name: "صيدلة بنات الإسكندرية", minScore: 388 },
  { name: "هندسة بنات القاهرة", minScore: 378 },
  { name: "حاسبات ومعلومات بنات عين شمس", minScore: 368 },
  { name: "علوم بنات عين شمس", minScore: 379.250000 },
  { name: "طب بيطري العريش", minScore: 379.250000 }
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
                            {college.name} — {college.minScore}
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
