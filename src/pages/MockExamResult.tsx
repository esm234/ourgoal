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
    // الوقت المستغرق (إذا كنت تخزن الوقت المتبقي في localStorage)
    const start = localStorage.getItem('mockExamStartTime');
    if (start) {
      setTimeSpent(Math.floor((Date.now() - Number(start)) / 1000));
    }
  }, []);

  const total = questions.length;
  const completed = questions.filter(q => answers[q.question_number] != null).length;
  const incomplete = total - completed;

  function formatTime(sec: number) {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#eaf3fa]" dir="rtl">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-lg w-full border border-blue-200 text-center">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">نتيجة الاختبار التجريبي</h1>
        <div className="text-xl text-gray-800 mb-4">عدد الأسئلة الكلي: <span className="font-bold">{total}</span></div>
        <div className="text-lg text-green-700 mb-2">عدد الأسئلة المكتملة: <span className="font-bold">{completed}</span></div>
        <div className="text-lg text-red-600 mb-4">عدد الأسئلة غير المكتملة: <span className="font-bold">{incomplete}</span></div>
        <div className="text-md text-gray-600 mb-8">الوقت المستغرق: <span className="font-bold">{formatTime(timeSpent)}</span></div>
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg text-lg transition mb-2"
          onClick={() => navigate('/')}
        >
          العودة للرئيسية
        </button>
        <button
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg text-lg transition"
          onClick={() => navigate('/mock-exam')}
        >
          بدء اختبار جديد
        </button>
      </div>
    </div>
  );
};

export default MockExamResult; 
