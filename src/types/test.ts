export type TestResult = {
  id: string;
  score: number;
  totalQuestions: number;
  type: 'verbal' | 'quantitative' | 'mixed';
  questionsData: {
    questionId: string;
    userAnswer: string;
    isCorrect: boolean;
    timeTaken: number;
  }[];
  timestamp?: number;
}; 
