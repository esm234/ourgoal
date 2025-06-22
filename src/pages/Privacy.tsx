import React from "react";
import Layout from "@/components/Layout";
import { Helmet } from "react-helmet-async";

const Privacy = () => {
  return (
    <Layout>
      <Helmet>
        <title>سياسة الخصوصية - OurGool</title>
        <meta
          name="description"
          content="سياسة الخصوصية وشروط استخدام منصة OurGool"
        />
      </Helmet>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto prose prose-lg rtl:text-right">
          <h1 className="text-3xl font-bold mb-6 text-center">سياسة الخصوصية</h1>
          
          <div className="bg-card p-6 rounded-lg shadow-sm mb-8">
            <p className="text-muted-foreground mb-4">
              آخر تحديث: {new Date().toLocaleDateString('ar-SA')}
            </p>
            
            <p className="mb-4">
              نحن في OurGool نقدر خصوصيتك ونلتزم بحماية بياناتك الشخصية. توضح سياسة الخصوصية هذه كيفية جمع واستخدام وحماية معلوماتك عند استخدام منصتنا.
            </p>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4">المعلومات التي نجمعها</h2>
          <p className="mb-4">
            نقوم بجمع المعلومات التالية:
          </p>
          <ul className="list-disc mr-6 mb-6 space-y-2">
            <li>المعلومات الشخصية: مثل الاسم والبريد الإلكتروني عند التسجيل في المنصة.</li>
            <li>معلومات الحساب: مثل اسم المستخدم وكلمة المرور المشفرة.</li>
            <li>معلومات الاستخدام: مثل تفاعلك مع المنصة، والمحتوى الذي تقوم بالوصول إليه.</li>
            <li>معلومات الجهاز: مثل نوع المتصفح، ونظام التشغيل، وعنوان IP.</li>
            <li>معلومات التسجيل الدخول: عند استخدام خدمات تسجيل الدخول من طرف ثالث مثل Google أو Facebook.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">كيف نستخدم معلوماتك</h2>
          <p className="mb-4">
            نستخدم المعلومات التي نجمعها للأغراض التالية:
          </p>
          <ul className="list-disc mr-6 mb-6 space-y-2">
            <li>توفير وتحسين خدماتنا.</li>
            <li>إنشاء وإدارة حسابك.</li>
            <li>التواصل معك بشأن تحديثات المنصة أو الإشعارات المهمة.</li>
            <li>تخصيص تجربتك على المنصة.</li>
            <li>تحليل استخدام المنصة وتحسين أدائها.</li>
            <li>حماية المنصة ومستخدميها من الاحتيال أو النشاط غير المصرح به.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">مشاركة المعلومات</h2>
          <p className="mb-4">
            لا نقوم ببيع أو تأجير معلوماتك الشخصية لأطراف ثالثة. قد نشارك معلوماتك في الحالات التالية:
          </p>
          <ul className="list-disc mr-6 mb-6 space-y-2">
            <li>مع مقدمي الخدمات الذين يساعدوننا في تشغيل المنصة (مثل Supabase لإدارة قواعد البيانات).</li>
            <li>عندما يكون ذلك مطلوبًا بموجب القانون أو للامتثال للإجراءات القانونية.</li>
            <li>لحماية حقوقنا أو ممتلكاتنا أو سلامة مستخدمينا.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">أمان البيانات</h2>
          <p className="mb-6">
            نتخذ تدابير أمنية معقولة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو الإفصاح عنها. نستخدم تقنيات التشفير لحماية البيانات الحساسة مثل كلمات المرور.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">ملفات تعريف الارتباط (Cookies)</h2>
          <p className="mb-6">
            نستخدم ملفات تعريف الارتباط وتقنيات مماثلة لتحسين تجربتك على منصتنا. يمكنك ضبط إعدادات المتصفح لرفض ملفات تعريف الارتباط، ولكن قد يؤثر ذلك على بعض وظائف المنصة.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">حقوقك</h2>
          <p className="mb-4">
            لديك الحقوق التالية فيما يتعلق بمعلوماتك الشخصية:
          </p>
          <ul className="list-disc mr-6 mb-6 space-y-2">
            <li>الوصول إلى معلوماتك الشخصية.</li>
            <li>تصحيح المعلومات غير الدقيقة.</li>
            <li>حذف معلوماتك (مع مراعاة بعض الاستثناءات القانونية).</li>
            <li>الاعتراض على معالجة معلوماتك.</li>
            <li>طلب تقييد معالجة معلوماتك.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">الأطفال</h2>
          <p className="mb-6">
            منصتنا غير موجهة للأطفال دون سن 13 عامًا. لا نجمع عن علم معلومات شخصية من الأطفال دون سن 13 عامًا. إذا كنت والدًا أو وصيًا وتعتقد أن طفلك قد قدم لنا معلومات شخصية، يرجى الاتصال بنا.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">التغييرات على سياسة الخصوصية</h2>
          <p className="mb-6">
            قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سنقوم بإخطارك بأي تغييرات مهمة من خلال إشعار على موقعنا أو عبر البريد الإلكتروني.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">اتصل بنا</h2>
          <p className="mb-6">
            إذا كان لديك أي أسئلة أو مخاوف بشأن سياسة الخصوصية هذه، يرجى التواصل معنا على البريد الإلكتروني: <a href="mailto:support@ourgool.site" className="text-primary hover:underline">support@ourgool.site</a>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Privacy; 