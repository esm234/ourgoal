
export interface Test {
  id: string;
  title: string;
  description: string | null;
  duration: number;
  created_at: string;
  user_id: string;
  published: boolean;
}

export interface Question {
  id: string;
  test_id: string;
  text: string;
  type: 'verbal' | 'quantitative' | 'mixed';
  explanation: string | null;
  question_order: number;
  created_at: string;
  options: Option[];
}

export interface Option {
  id: string;
  question_id: string;
  text: string;
  is_correct: boolean;
  option_order: number;
}

export interface CreateTestForm {
  title: string;
  description: string;
  duration: number;
}

export interface CreateQuestionForm {
  text: string;
  type: 'verbal' | 'quantitative' | 'mixed';
  explanation?: string;
  options: {
    text: string;
    is_correct: boolean;
  }[];
}
