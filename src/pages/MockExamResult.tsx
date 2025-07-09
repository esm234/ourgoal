import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LOCAL_KEY = 'mockExamAnswers';
const LOCAL_QUESTIONS_KEY = 'mockExamQuestions';

const MockExamResult: React.FC = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<number, number | string>>({});
  const [questions, setQuestions] = useState<any[]>([]);
  const [timeSpent, setTimeSpent] = useState<number>(0);

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved) setAnswers(JSON.parse(saved));
    const qs = localStorage.getItem(LOCAL_QUESTIONS_KEY);
    if (qs) setQuestions(JSON.parse(qs));
    const start = localStorage.getItem('mockExamStartTime');
    if (start) {
      setTimeSpent(Math.floor((Date.now() - Number(start)) / 1000));
    }
  }, []);

  // إحصائيات حسب نوع السؤال
  const statsByType = useMemo(() => {
    const types = [
      'التناظر اللفظي',
      'إكمال الجمل',
      'الخطأ السياقي',
      'استيعاب المقروء',
      'المفردة الشاذة',
    ];
    const stats: Record<
      string,
      { total: number; completed: number; incomplete: number }
    > = {};
    
    types.forEach((type) => {
      const typeQuestions = questions.filter((q) => q._type === type);
      const completed = typeQuestions.filter(
        (q) => answers[q.question_number] != null
      ).length;
      stats[type] = {
        total: typeQuestions.length,
        completed,
        incomplete: typeQuestions.length - completed,
      };
    });
    
    return stats;
  }, [questions, answers]);

  const total = questions.length;
  const completed = questions.filter((q) => answers[q.question_number] != null).length;
  const incomplete = total - completed;

  function formatTime(sec: number) {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 p-4" dir="rtl">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full transform transition-all hover:scale-[1.02] border border-gray-100">
        {/* العنوان */}
        <h1 className="text-3xl font-extrabold text-indigo-800 mb-8 text-center tracking-tight">
          نتيجة الاختبار التجريبي
        </h1>

        {/* إحصائيات عامة */}
        <div className="space-y-6 mb-10">
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl shadow-sm">
            <span className="text-lg text-gray-700 font-medium">عدد الأسئلة الكلي</span>
            <span className="text-xl font-bold text-indigo-600">{total}</span>
          </div>
          <div className="flex items-center justify-between bg-green-50 p-4 rounded-xl shadow-sm">
            <span className="text-lg text-gray-700 font-medium">الأسئلة المكتملة</span>
            <span className="text-xl font-bold text-green-600">{completed}</span>
          </div>
          <div className="flex items-center justify-between bg-red-50 p-4 rounded-xl shadow-sm">
            <span className="text-lg text-gray-700 font-medium">الأسئلة غير المكتملة</span>
            <span className="text-xl font-bold text-red-600">{incomplete}</span>
          </div>
          <div className="flex items-center justify-between bg-blue-50 p-4 rounded-xl shadow-sm">
            <span className="text-lg text-gray-700 font-medium">الوقت المستغرق</span>
            <span className="text-xl font-bold text-blue-600">{formatTime(timeSpent)}</span>
          </div>
        </div>

        {/* إحصائيات حسب نوع السؤال */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
            الأداء حسب نوع السؤال
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {Object.entries(statsByType).map(([type, { total, completed, incomplete }]) => (
              total > 0 && (
                <div
                  key={type}
                  className="bg-gray-50 p-4 rounded-xl shadow-sm flex flex-col gap-2"
                >
                  <div className="text-lg font-medium text-gray-800">{type}</div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>الإجمالي: <span className="font-bold">{total}</span></span>
                    <span>مكتمل: <span className="font-bold text-green-600">{completed}</span></span>
                    <span>غير مكتمل: <span className="font-bold text-red-600">{incomplete}</span></span>
                  </div>
                  {/* شريط التقدم */}
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div
                      className="bg-green-600 h-2.5 rounded-full"
                      style={{ width: `${(completed / total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>

        {/* الأزرار */}
        <div className="space-y-4">
          <button
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 shadow-md"
            onClick={() => navigate('/')}
          >
            العودة للرئيسية
          </button>
          <button
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl text-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 shadow-md"
            onClick={() => navigate('/mock-exam')}
          >
            بدء اختبار جديد
          </button>
        </div>
      </div>
    </div>
  );
};

export default MockExamResult;
