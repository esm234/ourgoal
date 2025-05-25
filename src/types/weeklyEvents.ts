// Weekly Events System Types
// Optimized for minimal data transfer and storage

export type EventCategory = 'verbal' | 'quantitative' | 'mixed';
export type EventStatus = 'upcoming' | 'active' | 'finished';
export type QuestionType = 'text' | 'image' | 'reading_comprehension';
export type QuestionCategory = 'verbal' | 'quantitative';

// Main Event Interface
export interface WeeklyEvent {
  id: number;
  title: string;
  description?: string;
  category: EventCategory;
  start_time: string; // ISO timestamp
  duration_minutes: number;
  xp_reward: number;
  is_enabled: boolean;
  status: EventStatus;
  created_at: string;
  updated_at: string;
}

// Event Question Interface (Optimized)
export interface EventQuestion {
  id: number;
  event_id: number;
  question_text: string;
  question_type: QuestionType;
  image_url?: string; // Only for image questions
  passage_text?: string; // Only for reading comprehension
  category: QuestionCategory;
  subcategory?: string; // e.g., 'استيعاب مقروء'
  question_order: number;
  options: string[]; // Array of option texts
  correct_answer: number; // Index of correct option (0-3)
  created_at: string;
}

// User Participation Interface (Minimal Storage)
export interface EventParticipation {
  id: number;
  event_id: number;
  user_id: string;
  answers: number[]; // Array of selected option indices
  score: number;
  total_questions: number;
  time_taken_minutes: number;
  xp_earned: number;
  completed_at: string;
}

// Leaderboard Entry Interface
export interface LeaderboardEntry {
  user_id: string;
  username: string;
  score: number;
  total_questions: number;
  percentage: number;
  time_taken_minutes: number;
  rank_position: number;
}

// User Activity History Interface
export interface UserEventHistory {
  event_id: number;
  event_title: string;
  event_category: EventCategory;
  score: number;
  total_questions: number;
  percentage: number;
  xp_earned: number;
  rank_position: number;
  completed_at: string;
}

// Test Taking Interfaces
export interface TestSession {
  event: WeeklyEvent;
  questions: EventQuestion[];
  startTime: Date;
  timeRemaining: number; // in seconds
  currentQuestionIndex: number;
  answers: (number | null)[]; // null for unanswered
}

export interface TestAnswer {
  questionId: number;
  selectedOption: number;
  timeSpent: number; // in seconds
}

export interface TestResult {
  participation: EventParticipation;
  questions: EventQuestion[];
  userAnswers: number[];
  correctAnswers: number[];
  leaderboardPosition: number;
}

// Admin Interfaces
export interface CreateEventRequest {
  title: string;
  description?: string;
  category: EventCategory;
  start_time: string;
  duration_minutes: number;
  xp_reward: number;
}

export interface CreateQuestionRequest {
  event_id: number;
  question_text: string;
  question_type: QuestionType;
  image_url?: string;
  passage_text?: string;
  category: QuestionCategory;
  subcategory?: string;
  question_order: number;
  options: string[];
  correct_answer: number;
}

export interface UpdateEventRequest {
  id: number;
  title?: string;
  description?: string;
  category?: EventCategory;
  start_time?: string;
  duration_minutes?: number;
  xp_reward?: number;
  is_enabled?: boolean;
}

// Reading Comprehension Group Interface
export interface ReadingComprehensionGroup {
  passage_text: string;
  questions: EventQuestion[];
}

// Event Statistics Interface (for admin dashboard)
export interface EventStatistics {
  event_id: number;
  total_participants: number;
  average_score: number;
  average_time_minutes: number;
  completion_rate: number;
  top_score: number;
  category_breakdown: {
    verbal_correct: number;
    quantitative_correct: number;
    total_verbal: number;
    total_quantitative: number;
  };
}

// API Response Interfaces
export interface EventsResponse {
  events: WeeklyEvent[];
  total: number;
  hasMore: boolean;
}

export interface QuestionsResponse {
  questions: EventQuestion[];
  readingGroups: ReadingComprehensionGroup[];
  total: number;
}

export interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  userPosition?: number;
  total: number;
}

export interface HistoryResponse {
  history: UserEventHistory[];
  total: number;
  totalXpEarned: number;
}

// Utility Types
export type EventFormData = Omit<CreateEventRequest, 'start_time'> & {
  start_date: string;
  start_time: string;
};

export type QuestionFormData = Omit<CreateQuestionRequest, 'event_id' | 'question_order'> & {
  options: { text: string; isCorrect: boolean }[];
};

// Constants
export const EVENT_CATEGORIES: { value: EventCategory; label: string; icon: string }[] = [
  { value: 'verbal', label: 'لفظي', icon: 'BookOpen' },
  { value: 'quantitative', label: 'كمي', icon: 'Calculator' },
  { value: 'mixed', label: 'منوع', icon: 'Target' }
];

export const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: 'text', label: 'سؤال نصي' },
  { value: 'image', label: 'سؤال بصورة' },
  { value: 'reading_comprehension', label: 'استيعاب مقروء' }
];

export const QUESTION_CATEGORIES: { value: QuestionCategory; label: string }[] = [
  { value: 'verbal', label: 'لفظي' },
  { value: 'quantitative', label: 'كمي' }
];

// Helper Functions
export const getEventStatusLabel = (status: EventStatus): string => {
  switch (status) {
    case 'upcoming': return 'قادم';
    case 'active': return 'نشط';
    case 'finished': return 'منتهي';
    default: return status;
  }
};

export const getCategoryLabel = (category: EventCategory): string => {
  const categoryMap = EVENT_CATEGORIES.find(c => c.value === category);
  return categoryMap?.label || category;
};

export const getQuestionTypeLabel = (type: QuestionType): string => {
  const typeMap = QUESTION_TYPES.find(t => t.value === type);
  return typeMap?.label || type;
};

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0) {
    return `${hours} ساعة${mins > 0 ? ` و ${mins} دقيقة` : ''}`;
  }
  return `${mins} دقيقة`;
};

export const formatTimeRemaining = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const calculatePercentage = (score: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((score / total) * 100);
};

export const isEventActive = (event: WeeklyEvent): boolean => {
  const now = new Date();
  const startTime = new Date(event.start_time);
  const endTime = new Date(startTime.getTime() + event.duration_minutes * 60000);

  return now >= startTime && now <= endTime && event.is_enabled;
};

export const isEventUpcoming = (event: WeeklyEvent): boolean => {
  const now = new Date();
  const startTime = new Date(event.start_time);

  return now < startTime && event.is_enabled;
};

export const isEventFinished = (event: WeeklyEvent): boolean => {
  const now = new Date();
  const startTime = new Date(event.start_time);
  const endTime = new Date(startTime.getTime() + event.duration_minutes * 60000);

  return now > endTime || !event.is_enabled;
};
