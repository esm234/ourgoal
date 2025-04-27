export type Question = {
  id: string;
  text: string;
  options: { [key: string]: string };
  userAnswer: string;
  correctAnswer: string;
  explanation?: string;
  timeTaken: number;
  isCorrect: boolean;
};

export type TestResult = {
  id: string;
  score: number;
  totalQuestions: number;
  type: 'verbal' | 'quantitative' | 'mixed';
  questions: {
    questionId: string;
    userAnswer: string;
    isCorrect: boolean;
    timeTaken: number;
  }[];
  timestamp?: number;
}; 
