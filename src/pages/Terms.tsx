import React from "react";
import Layout from "@/components/Layout";
import { Helmet } from "react-helmet-async";

const Terms = () => {
  return (
    <Layout>
      <Helmet>
        <title>شروط الاستخدام - OurGool</title>
        <meta
          name="description"
          content="شروط استخدام منصة OurGool"
        />
      </Helmet>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto prose prose-lg rtl:text-right">
          <h1 className="text-3xl font-bold mb-6 text-center">شروط الاستخدام</h1>
          
          <div className="bg-card p-6 rounded-lg shadow-sm mb-8">
            <p className="text-muted-foreground mb-4">
              آخر تحديث: {new Date().toLocaleDateString('ar-SA')}
            </p>
            
            <p className="mb-4">
              مرحبًا بك في منصة OurGool. تحدد شروط الاستخدام هذه القواعد والأحكام الخاصة باستخدام موقعنا وخدماتنا. باستخدامك للمنصة، فإنك توافق على الالتزام بهذه الشروط.
            </p>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4">1. قبول الشروط</h2>
          <p className="mb-6">
            باستخدامك لمنصة OurGool، فإنك توافق على الالتزام بشروط الاستخدام هذه. إذا كنت لا توافق على أي جزء من هذه الشروط، فيرجى عدم استخدام منصتنا.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. التغييرات في الشروط</h2>
          <p className="mb-6">
            نحتفظ بالحق في تعديل شروط الاستخدام هذه في أي وقت. سيتم نشر النسخة المحدثة على هذه الصفحة. استمرارك في استخدام المنصة بعد نشر التغييرات يعني موافقتك على الشروط المعدلة.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. حسابات المستخدمين</h2>
          <p className="mb-4">
            عند إنشاء حساب على منصتنا، فإنك تتحمل مسؤولية:
          </p>
          <ul className="list-disc mr-6 mb-6 space-y-2">
            <li>الحفاظ على سرية كلمة المرور الخاصة بك.</li>
            <li>جميع الأنشطة التي تحدث تحت حسابك.</li>
            <li>تقديم معلومات دقيقة وحديثة.</li>
          </ul>
          <p className="mb-6">
            نحتفظ بالحق في تعليق أو إنهاء حسابك إذا كان هناك انتهاك لشروط الاستخدام هذه.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. حقوق الملكية الفكرية</h2>
          <p className="mb-6">
            تظل جميع حقوق الملكية الفكرية المتعلقة بالمنصة والمحتوى المقدم من قبلنا ملكًا لـ OurGool أو المرخصين لها. لا يجوز نسخ أو توزيع أو تعديل أو عرض أو أداء أو إعادة إنتاج أو نشر أو ترخيص أو إنشاء أعمال مشتقة من أو نقل أو بيع أي معلومات تم الحصول عليها من المنصة دون إذن كتابي مسبق منا.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">5. محتوى المستخدم</h2>
          <p className="mb-6">
            عند نشر محتوى على منصتنا، فإنك تمنحنا ترخيصًا عالميًا غير حصري وخالٍ من حقوق الملكية لاستخدام وتخزين ونسخ وتوزيع وعرض هذا المحتوى. نحتفظ بالحق في إزالة أي محتوى نعتبره مخالفًا لشروط الاستخدام هذه أو سياساتنا.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">6. السلوك المحظور</h2>
          <p className="mb-4">
            يُحظر عليك استخدام المنصة لأي من الأغراض التالية:
          </p>
          <ul className="list-disc mr-6 mb-6 space-y-2">
            <li>انتهاك أي قوانين أو لوائح محلية أو وطنية أو دولية.</li>
            <li>نشر أو إرسال أي محتوى غير قانوني أو ضار أو مسيء أو تشهيري أو فاحش أو تهديدي.</li>
            <li>انتحال شخصية أي فرد أو كيان.</li>
            <li>جمع أو تخزين البيانات الشخصية عن المستخدمين الآخرين.</li>
            <li>التدخل في أو تعطيل المنصة أو الخوادم أو الشبكات المتصلة بها.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">7. إخلاء المسؤولية</h2>
          <p className="mb-6">
            يتم توفير المنصة "كما هي" و"كما هي متاحة" دون أي ضمانات من أي نوع، صريحة أو ضمنية. لا نضمن أن المنصة ستكون خالية من الأخطاء أو متاحة بشكل مستمر.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">8. تحديد المسؤولية</h2>
          <p className="mb-6">
            لن تكون OurGool مسؤولة عن أي أضرار مباشرة أو غير مباشرة أو عرضية أو خاصة أو تبعية أو تأديبية ناتجة عن استخدامك للمنصة أو عدم القدرة على استخدامها.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">9. القانون الحاكم</h2>
          <p className="mb-6">
            تخضع شروط الاستخدام هذه وتفسر وفقًا لقوانين المملكة العربية السعودية، وتخضع أي نزاعات تنشأ عنها للاختصاص القضائي الحصري للمحاكم في المملكة العربية السعودية.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">10. الاتصال بنا</h2>
          <p className="mb-6">
            إذا كان لديك أي أسئلة أو استفسارات حول شروط الاستخدام هذه، يرجى التواصل معنا على البريد الإلكتروني: <a href="mailto:support@ourgool.site" className="text-primary hover:underline">support@ourgool.site</a>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Terms; 