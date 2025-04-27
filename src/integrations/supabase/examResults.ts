import { supabase } from './supabaseClient';
import { TestResult, Question } from '@/types/test';

export type ExamResultDB = {
  id: string;
  user_id: string;
  test_id: string;
  score: number;
  total_questions: number;
  type: 'verbal' | 'quantitative' | 'mixed';
  questions_data: Question[];
  created_at: string;
};

export const saveExamResult = async (result: TestResult): Promise<ExamResultDB | null> => {
  try {
    const { data, error } = await supabase
      .from('exam_results')
      .insert({
        test_id: result.id,
        score: result.score,
        total_questions: result.totalQuestions,
        type: result.type,
        questions_data: result.questions
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving exam result:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error saving exam result:', error);
    return null;
  }
};

export const getExamResults = async (): Promise<TestResult[]> => {
  try {
    const { data, error } = await supabase
      .from('exam_results')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching exam results:', error);
      return [];
    }

    return data.map((result: ExamResultDB) => ({
      id: result.test_id,
      score: result.score,
      totalQuestions: result.total_questions,
      type: result.type,
      questions: result.questions_data,
      timestamp: new Date(result.created_at).getTime()
    }));
  } catch (error) {
    console.error('Error fetching exam results:', error);
    return [];
  }
}; 
