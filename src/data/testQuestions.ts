
interface Question {
  id: string;
  type: "verbal" | "quantitative";
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface TestQuestion {
  testId: string;
  questions: Question[];
}

export const testQuestions: TestQuestion[] = [
  {
    testId: "test-1",
    questions: [
      {
        id: "q1",
        type: "verbal",
        text: "أي من الكلمات التالية تعتبر مضاد كلمة 'شُح'؟",
        options: ["بُخل", "كَرَم", "إمساك", "تقتير"],
        correctAnswer: 1,
        explanation: "كَرَم هو المضاد المباشر لكلمة شُح التي تعني البخل"
      },
      {
        id: "q2",
        type: "quantitative",
        text: "إذا كان ناتج ضرب عددين هو 48، وكان أحدهما 6، فما هو العدد الآخر؟",
        options: ["6", "8", "12", "42"],
        correctAnswer: 1,
        explanation: "48 ÷ 6 = 8"
      },
      {
        id: "q3",
        type: "verbal",
        text: "ما هو الجمع الصحيح لكلمة 'قَلَم'؟",
        options: ["قَلَمون", "أقلام", "قَلَمات", "قلائم"],
        correctAnswer: 1,
        explanation: "الجمع الصحيح لكلمة قلم هو أقلام"
      },
      {
        id: "q4",
        type: "quantitative",
        text: "إذا كان عدد طلاب الفصل 30 طالباً، ونجح منهم 24 طالباً، فما هي النسبة المئوية للنجاح؟",
        options: ["70%", "75%", "80%", "85%"],
        correctAnswer: 2,
        explanation: "(24 ÷ 30) × 100 = 80%"
      },
      {
        id: "q5",
        type: "verbal",
        text: "ما معنى كلمة 'استقطب'؟",
        options: ["أبعد", "نفر", "جذب", "دفع"],
        correctAnswer: 2,
        explanation: "استقطب تعني جذب أو شد نحوه"
      }
    ]
  }
];
