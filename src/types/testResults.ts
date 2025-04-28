export interface TestResult {
  testId: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  date: string;
  type: 'verbal' | 'quantitative' | 'mixed';
  questions: {
    id: string;
    text: string;
    type: 'verbal' | 'quantitative' | 'mixed';
    options: string[];
    correctAnswer: number;
    userAnswer: number;
    explanation?: string;
    image_url?: string;
  }[];
}
