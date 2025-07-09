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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4" dir="rtl">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full border border-blue-200 text-center transform transition-all duration-300 scale-95 hover:scale-100">
        <h1 className="text-4xl font-extrabold text-blue-800 mb-6 animate-fade-in-down">نتائج الاختبار التجريبي</h1>
        
        <div className="space-y-4 mb-8">
          <div className="flex justify-between items-center text-xl text-gray-700 border-b pb-2">
            <span>إجمالي الأسئلة:</span>
            <span className="font-bold text-blue-700 text-2xl">{total}</span>
          </div>
          <div className="flex justify-between items-center text-xl text-gray-700 border-b pb-2">
            <span>الأسئلة المكتملة:</span>
            <span className="font-bold text-green-600 text-2xl">{completed}</span>
          </div>
          <div className="flex justify-between items-center text-xl text-gray-700 border-b pb-2">
            <span>الأسئلة غير المكتملة:</span>
            <span className="font-bold text-red-600 text-2xl">{incomplete}</span>
          </div>
          <div className="flex justify-between items-center text-xl text-gray-700">
            <span>الوقت المستغرق:</span>
            <span className="font-bold text-purple-700 text-2xl">{formatTime(timeSpent)}</span>
          </div>
        </div>
        
        <div className="flex flex-col gap-4">
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            onClick={() => navigate(
              settings.examMode === 'sectioned' && settings.selectedQuestionType === 'rc'
                ? '/mock-exam/exam'
                : '/mock-exam/exam'
            )}
          >
            مراجعة الإجابات
          </button>
          <button
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            onClick={() => navigate(
              settings.examMode === 'sectioned' && settings.selectedQuestionType === 'rc'
                ? '/mock-exam'
                : '/mock-exam'
            )}
          >
            بدء اختبار جديد
          </button>
          <button
            className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            onClick={() => navigate('/')}
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    </div>
