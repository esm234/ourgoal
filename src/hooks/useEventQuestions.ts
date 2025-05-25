import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  EventQuestion,
  ReadingComprehensionGroup,
  QuestionsResponse
} from '@/types/weeklyEvents';

export const useEventQuestions = (eventId: number | null) => {
  const [questions, setQuestions] = useState<EventQuestion[]>([]);
  const [readingGroups, setReadingGroups] = useState<ReadingComprehensionGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load questions for an event
  const loadQuestions = useCallback(async () => {
    if (!eventId) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('event_questions')
        .select('*')
        .eq('event_id', eventId)
        .order('question_order', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      const questionsData = data || [];
      setQuestions(questionsData);

      // Group reading comprehension questions
      const readingCompQuestions = questionsData.filter(q => q.question_type === 'reading_comprehension');
      const groupedReading = groupReadingComprehensionQuestions(readingCompQuestions);
      setReadingGroups(groupedReading);

    } catch (err) {
      console.error('Error loading questions:', err);
      setError('حدث خطأ في تحميل الأسئلة');
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  // Group reading comprehension questions by passage
  const groupReadingComprehensionQuestions = (questions: EventQuestion[]): ReadingComprehensionGroup[] => {
    const groups: { [key: string]: EventQuestion[] } = {};

    questions.forEach(question => {
      const passageKey = question.passage_text || 'default';
      if (!groups[passageKey]) {
        groups[passageKey] = [];
      }
      groups[passageKey].push(question);
    });

    return Object.entries(groups).map(([passage_text, questions]) => ({
      passage_text,
      questions: questions.sort((a, b) => a.question_order - b.question_order)
    }));
  };

  // Get questions by type
  const getQuestionsByType = useCallback((type: 'text' | 'image' | 'reading_comprehension') => {
    return questions.filter(q => q.question_type === type);
  }, [questions]);

  // Get questions by category
  const getQuestionsByCategory = useCallback((category: 'verbal' | 'quantitative') => {
    return questions.filter(q => q.category === category);
  }, [questions]);

  // Load questions when eventId changes
  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  return {
    questions,
    readingGroups,
    loading,
    error,
    loadQuestions,
    getQuestionsByType,
    getQuestionsByCategory
  };
};

// Hook for test session management
export const useTestSession = (eventId: number | null, questions: EventQuestion[]) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<Date | null>(null);
  const [timeSpentPerQuestion, setTimeSpentPerQuestion] = useState<number[]>([]);

  // Initialize session
  const initializeSession = useCallback(() => {
    if (questions.length === 0) return;

    setCurrentQuestionIndex(0);
    setAnswers(new Array(questions.length).fill(null));
    setStartTime(new Date());
    setQuestionStartTime(new Date());
    setTimeSpentPerQuestion(new Array(questions.length).fill(0));
  }, [questions.length]);

  // Answer a question
  const answerQuestion = useCallback((questionIndex: number, answerIndex: number) => {
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[questionIndex] = answerIndex;
      return newAnswers;
    });

    // Record time spent on current question
    if (questionStartTime && questionIndex === currentQuestionIndex) {
      const timeSpent = Math.floor((new Date().getTime() - questionStartTime.getTime()) / 1000);
      setTimeSpentPerQuestion(prev => {
        const newTimes = [...prev];
        newTimes[questionIndex] = (newTimes[questionIndex] || 0) + timeSpent;
        return newTimes;
      });
    }
  }, [currentQuestionIndex, questionStartTime]);

  // Navigate to next question
  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setQuestionStartTime(new Date());
    }
  }, [currentQuestionIndex, questions.length]);

  // Navigate to previous question
  const previousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setQuestionStartTime(new Date());
    }
  }, [currentQuestionIndex]);

  // Jump to specific question
  const goToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
      setQuestionStartTime(new Date());
    }
  }, [questions.length]);

  // Calculate results
  const calculateResults = useCallback(() => {
    if (!startTime || questions.length === 0) return null;

    const totalTimeTaken = Math.floor((new Date().getTime() - startTime.getTime()) / 60000); // in minutes
    let correctAnswers = 0;

    answers.forEach((answer, index) => {
      if (answer !== null && answer === questions[index]?.correct_answer) {
        correctAnswers++;
      }
    });

    return {
      score: correctAnswers,
      totalQuestions: questions.length,
      timeTakenMinutes: Math.max(1, totalTimeTaken), // Minimum 1 minute
      answers: answers.map(a => a ?? -1), // Convert null to -1 for storage
      timeSpentPerQuestion
    };
  }, [answers, questions, startTime, timeSpentPerQuestion]);

  // Get answered questions count
  const getAnsweredCount = useCallback(() => {
    return answers.filter(answer => answer !== null).length;
  }, [answers]);

  // Check if all questions are answered
  const isComplete = useCallback(() => {
    return answers.every(answer => answer !== null);
  }, [answers]);

  // Get current question
  const getCurrentQuestion = useCallback(() => {
    return questions[currentQuestionIndex] || null;
  }, [questions, currentQuestionIndex]);

  // Reset session
  const resetSession = useCallback(() => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setStartTime(null);
    setQuestionStartTime(null);
    setTimeSpentPerQuestion([]);
  }, []);

  // Initialize when questions change
  useEffect(() => {
    if (questions.length > 0) {
      initializeSession();
    }
  }, [questions, initializeSession]);

  return {
    currentQuestionIndex,
    answers,
    startTime,
    timeSpentPerQuestion,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    goToQuestion,
    calculateResults,
    getAnsweredCount,
    isComplete,
    getCurrentQuestion,
    resetSession,
    initializeSession
  };
};

// Hook for question navigation and progress
export const useQuestionNavigation = (totalQuestions: number, answers: (number | null)[]) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Get progress percentage
  const getProgress = useCallback(() => {
    if (totalQuestions === 0) return 0;
    return Math.round((currentIndex + 1) / totalQuestions * 100);
  }, [currentIndex, totalQuestions]);

  // Get answered questions count
  const getAnsweredCount = useCallback(() => {
    return answers.filter(answer => answer !== null).length;
  }, [answers]);

  // Get unanswered questions
  const getUnansweredQuestions = useCallback(() => {
    return answers
      .map((answer, index) => ({ index, answered: answer !== null }))
      .filter(item => !item.answered)
      .map(item => item.index);
  }, [answers]);

  // Check if question is answered
  const isQuestionAnswered = useCallback((index: number) => {
    return answers[index] !== null;
  }, [answers]);

  // Navigate to next unanswered question
  const goToNextUnanswered = useCallback(() => {
    const unanswered = getUnansweredQuestions();
    if (unanswered.length > 0) {
      const nextUnanswered = unanswered.find(index => index > currentIndex) || unanswered[0];
      setCurrentIndex(nextUnanswered);
      return nextUnanswered;
    }
    return null;
  }, [currentIndex, getUnansweredQuestions]);

  return {
    currentIndex,
    setCurrentIndex,
    getProgress,
    getAnsweredCount,
    getUnansweredQuestions,
    isQuestionAnswered,
    goToNextUnanswered
  };
};
