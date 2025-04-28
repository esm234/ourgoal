
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

export interface DatabaseExamResult {
  id: string;
  user_id: string;
  test_id: string;
  score: number;
  correct_answers: number;
  total_questions: number;
  time_taken: number;
  created_at: string;
  questions_data?: Array<{
    id: string;
    text: string;
    type: 'verbal' | 'quantitative' | 'mixed';
    options: string[];
    correctAnswer: number;
    userAnswer: number;
    explanation?: string;
    image_url?: string;
  }>;
}
