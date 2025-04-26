
export interface TestResult {
  testId: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  date: string;
  type: 'verbal' | 'quantitative' | 'mixed';
}
