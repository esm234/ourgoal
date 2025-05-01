export interface Test {
  id: string;
  title: string;
  description: string | null;
  duration: number;
  created_at: string;
  user_id: string;
  published: boolean;
  category?: 'sample' | 'user';
}

export interface Question {
  id: string;
  test_id: string;
  text: string;
  type: 'verbal' | 'quantitative' | 'mixed';
  subtype?: 'general' | 'reading_comprehension';
  passage?: string | null;
  explanation: string | null;
  question_order: number;
  created_at: string;
  image_url?: string | null;
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
  category: 'sample' | 'user';
}

export interface CreateQuestionForm {
  mode: 'text' | 'image';
  text?: string;
  type: 'verbal' | 'quantitative' | 'mixed';
  subtype?: 'general' | 'reading_comprehension';
  passage?: string;
  explanation?: string;
  image_url?: string;
  options: {
    text: string;
    is_correct: boolean;
  }[];
}

// For the TakeTest component, which handles both database questions and static questions
export interface ExtendedQuestion {
  id: string;
  test_id: string;
  text: string;
  type: 'verbal' | 'quantitative' | 'mixed';
  subtype?: 'general' | 'reading_comprehension';
  passage?: string | null;
  explanation: string | null;
  question_order: number;
  created_at: string;
  options: (Option | { text: string })[] | string[]; // Can be Option[], simple objects, or string[]
  correctAnswer?: number; // Index of the correct answer
  imageUrl?: string; // URL for question image
  image_url?: string; // Database field for the image URL
}
