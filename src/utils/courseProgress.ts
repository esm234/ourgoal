// Course Progress Management with localStorage

import { toast } from "sonner";

export interface CourseProgress {
  courseId: string;
  completedLessons: string[];
  currentLesson?: string;
  enrollmentDate: string;
  lastAccessed: string;
  totalProgress: number;
}

export interface LessonProgress {
  lessonId: string;
  courseId: string;
  isCompleted: boolean;
  completedAt?: string;
  watchTime?: number;
  totalDuration?: number;
  progress?: number;
}

const STORAGE_KEYS = {
  COURSE_PROGRESS: 'ourgoal_course_progress',
  LESSON_PROGRESS: 'ourgoal_lesson_progress',
  ENROLLMENT: 'ourgoal_enrollments'
};

// Course Progress Functions
export const getCourseProgress = (courseId: string): CourseProgress | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.COURSE_PROGRESS);
    if (!stored) return null;

    const allProgress: CourseProgress[] = JSON.parse(stored);
    return allProgress.find(p => p.courseId === courseId) || null;
  } catch (error) {
    console.error('Error getting course progress:', error);
    return null;
  }
};

export const saveCourseProgress = (progress: CourseProgress): void => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.COURSE_PROGRESS);
    let allProgress: CourseProgress[] = stored ? JSON.parse(stored) : [];

    const existingIndex = allProgress.findIndex(p => p.courseId === progress.courseId);

    if (existingIndex >= 0) {
      allProgress[existingIndex] = progress;
    } else {
      allProgress.push(progress);
    }

    localStorage.setItem(STORAGE_KEYS.COURSE_PROGRESS, JSON.stringify(allProgress));
  } catch (error) {
    console.error('Error saving course progress:', error);
  }
};

export const enrollInCourse = (courseId: string): void => {
  const key = `course_${courseId}_enrolled`;
  localStorage.setItem(key, 'true');

  // عند التسجيل، افتح جميع الدروس بدلاً من الدرس الأول فقط
  const lessonSequence: Record<string, string[]> = {
    'the-last-dance': [
      'verbal-1-1',
      'verbal-2-1',
      'completion-1-1',
      'contextual-error-1',
      'reading-comprehension-1',
      'reading-comprehension-2',
      'reading-comprehension-3',
      'odd-word-1'
    ]
  };

  const allLessons = lessonSequence[courseId] || [];
  if (allLessons.length > 0) {
    localStorage.setItem(`course_${courseId}_unlocked`, JSON.stringify(allLessons));
  }
};

export const isEnrolledInCourse = (courseId: string): boolean => {
  const key = `course_${courseId}_enrolled`;
  return localStorage.getItem(key) === 'true';
};

// Lesson Progress Functions
export const getLessonProgress = (courseId: string, lessonId: string): LessonProgress | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.LESSON_PROGRESS);
    if (!stored) return null;

    const allProgress: LessonProgress[] = JSON.parse(stored);
    return allProgress.find(p => p.courseId === courseId && p.lessonId === lessonId) || null;
  } catch (error) {
    console.error('Error getting lesson progress:', error);
    return null;
  }
};

export const saveLessonProgress = (progress: LessonProgress): void => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.LESSON_PROGRESS);
    let allProgress: LessonProgress[] = stored ? JSON.parse(stored) : [];

    const existingIndex = allProgress.findIndex(
      p => p.courseId === progress.courseId && p.lessonId === progress.lessonId
    );

    if (existingIndex >= 0) {
      allProgress[existingIndex] = progress;
    } else {
      allProgress.push(progress);
    }

    localStorage.setItem(STORAGE_KEYS.LESSON_PROGRESS, JSON.stringify(allProgress));

    // Update course progress
    updateCourseProgress(progress.courseId);
  } catch (error) {
    console.error('Error saving lesson progress:', error);
  }
};

export const markLessonComplete = (courseId: string, lessonId: string): void => {
  // تحديث نسبة التقدم إلى 100%
  saveLessonProgressPercentage(courseId, lessonId, 100);

  // فتح الدرس التالي
  const nextLessonId = getNextLesson(courseId, lessonId);
  if (nextLessonId) {
    unlockLesson(courseId, nextLessonId);
    toast.success("تم فتح الدرس التالي!");
  } else {
    toast.success("أحسنت! لقد أكملت جميع دروس هذه الدورة");
  }
};

export const saveLessonProgressPercentage = (courseId: string, lessonId: string, percentage: number): void => {
  const key = `course_${courseId}_progress`;
  const progress = JSON.parse(localStorage.getItem(key) || '{}');
  progress[lessonId] = percentage;
  localStorage.setItem(key, JSON.stringify(progress));
};

export const getLessonProgressPercentage = (courseId: string, lessonId: string): number => {
  const key = `course_${courseId}_progress`;
  const progress = JSON.parse(localStorage.getItem(key) || '{}');
  return progress[lessonId] || 0;
};

export const updateCourseProgress = (courseId: string): void => {
  try {
    const courseProgress = getCourseProgress(courseId);
    if (!courseProgress) return;

    // Get all lesson progress for this course
    const stored = localStorage.getItem(STORAGE_KEYS.LESSON_PROGRESS);
    if (!stored) return;

    const allLessonProgress: LessonProgress[] = JSON.parse(stored);
    const courseLessons = allLessonProgress.filter(p => p.courseId === courseId);
    const completedLessons = courseLessons.filter(p => p.isCompleted).map(p => p.lessonId);

    // احصل على جميع دروس الفيديو فقط
    const videoLessonIds = ['verbal-1-1', 'verbal-2-1', 'completion-1-1', 'contextual-error-1', 'odd-word-1']; // تم إضافة درس المفردة الشاذة
    const totalLessons = videoLessonIds.length;
    const completedVideoLessons = completedLessons.filter(id => videoLessonIds.includes(id));
    const totalProgress = totalLessons > 0 ? Math.round((completedVideoLessons.length / totalLessons) * 100) : 0;

    const updatedProgress: CourseProgress = {
      ...courseProgress,
      completedLessons,
      totalProgress,
      lastAccessed: new Date().toISOString()
    };

    saveCourseProgress(updatedProgress);
  } catch (error) {
    console.error('Error updating course progress:', error);
  }
};

// Utility Functions
/**
 * الحصول على عدد الدروس المكتملة في دورة معينة
 */
export const getCompletedLessonsCount = (courseId: string): number => {
  const key = `course_${courseId}_progress`;
  const progress = JSON.parse(localStorage.getItem(key) || '{}');
  let count = 0;

  for (const lessonId in progress) {
    if (progress[lessonId] >= 100) {
      count++;
    }
  }

  return count;
};

/**
 * الحصول على نسبة التقدم الإجمالية للدورة
 */
export const getTotalProgressPercentage = (courseId: string): number => {
  // تعريف هيكل الدورة
  const courseLessons: Record<string, string[]> = {
    'the-last-dance': [
      'verbal-1-1',
      'verbal-2-1',
      'completion-1-1',
      'contextual-error-1',
      'reading-comprehension-1',
      'reading-comprehension-2',
      'reading-comprehension-3',
      'odd-word-1'
    ]
  };

  const lessons = courseLessons[courseId] || [];
  if (lessons.length === 0) return 0;

  const key = `course_${courseId}_progress`;
  const progress = JSON.parse(localStorage.getItem(key) || '{}');

  let totalPercentage = 0;
  for (const lessonId of lessons) {
    totalPercentage += progress[lessonId] || 0;
  }

  return Math.round(totalPercentage / lessons.length);
};

export const isLessonCompleted = (courseId: string, lessonId: string): boolean => {
  return getLessonProgressPercentage(courseId, lessonId) >= 100;
};

export const getNextLesson = (courseId: string, currentLessonId: string): string | null => {
  // تعريف تسلسل الدروس
  const lessonSequence: Record<string, string[]> = {
    'the-last-dance': [
      'verbal-1-1',
      'verbal-2-1',
      'completion-1-1',
      'contextual-error-1',
      'reading-comprehension-1',
      'reading-comprehension-2',
      'reading-comprehension-3',
      'odd-word-1'
    ]
  };

  const sequence = lessonSequence[courseId] || [];
  const currentIndex = sequence.indexOf(currentLessonId);

  if (currentIndex === -1 || currentIndex === sequence.length - 1) {
    return null; // لا يوجد درس تالي
  }

  return sequence[currentIndex + 1];
};

export const getPreviousLesson = (courseId: string, currentLessonId: string): string | null => {
  // تعريف تسلسل الدروس
  const lessonSequence: Record<string, string[]> = {
    'the-last-dance': [
      'verbal-1-1',
      'verbal-2-1',
      'completion-1-1',
      'contextual-error-1',
      'reading-comprehension-1',
      'reading-comprehension-2',
      'reading-comprehension-3',
      'odd-word-1'
    ]
  };

  const sequence = lessonSequence[courseId] || [];
  const currentIndex = sequence.indexOf(currentLessonId);

  if (currentIndex <= 0) {
    return null; // لا يوجد درس سابق
  }

  return sequence[currentIndex - 1];
};

// Clear all progress (for testing/reset)
export const clearAllProgress = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.COURSE_PROGRESS);
    localStorage.removeItem(STORAGE_KEYS.LESSON_PROGRESS);
    localStorage.removeItem(STORAGE_KEYS.ENROLLMENT);
  } catch (error) {
    console.error('Error clearing progress:', error);
  }
};

// دالة للحصول على الدرس التالي غير المكتمل أو آخر درس في حالة اكتمال جميع الدروس
export const getNextUncompletedLesson = (courseId: string): string => {
  // تعريف تسلسل الدروس
  const lessonSequence: Record<string, string[]> = {
    'the-last-dance': [
      'verbal-1-1',
      'verbal-2-1',
      'completion-1-1',
      'contextual-error-1',
      'reading-comprehension-1',
      'reading-comprehension-2',
      'reading-comprehension-3',
      'odd-word-1'
    ]
  };

  const sequence = lessonSequence[courseId] || [];

  // البحث عن أول درس غير مكتمل
  for (const lessonId of sequence) {
    if (!isLessonCompleted(courseId, lessonId) && isLessonUnlocked(courseId, lessonId)) {
      return lessonId;
    }
  }

  // إذا كانت جميع الدروس مكتملة، ارجع الدرس الأول
  return sequence[0] || '';
};

// الحصول على معرف الدرس الأول في الدورة
export const getFirstLessonId = (courseId: string): string => {
  const firstLessons: Record<string, string> = {
    'the-last-dance': 'verbal-1-1'
  };
  return firstLessons[courseId] || '';
};

// تحقق ما إذا كان الدرس هو الأول في الدورة
export const isFirstLesson = (courseId: string, lessonId: string): boolean => {
  return getFirstLessonId(courseId) === lessonId;
};

// فتح درس معين
export const unlockLesson = (courseId: string, lessonId: string): void => {
  const unlockedLessons = JSON.parse(localStorage.getItem(`course_${courseId}_unlocked`) || '[]');
  if (!unlockedLessons.includes(lessonId)) {
    unlockedLessons.push(lessonId);
    localStorage.setItem(`course_${courseId}_unlocked`, JSON.stringify(unlockedLessons));
  }
};

// التحقق ما إذا كان الدرس مفتوحاً
export const isLessonUnlocked = (courseId: string, lessonId: string): boolean => {
  // جميع الدروس مفتوحة دائماً
  return true;
};

/**
 * تحويل مدة الفيديو من تنسيق "دقيقة:ثانية" إلى ثواني
 * @param duration المدة بتنسيق "دقيقة:ثانية" مثل "5:30"
 * @returns المدة بالثواني
 */
export const convertDurationToSeconds = (duration: string): number => {
  if (!duration) return 0;

  // تقسيم المدة إلى دقائق وثواني
  const parts = duration.split(':');

  if (parts.length === 2) {
    // تنسيق MM:SS
    const minutes = parseInt(parts[0], 10);
    const seconds = parseInt(parts[1], 10);
    return minutes * 60 + seconds;
  } else if (parts.length === 3) {
    // تنسيق HH:MM:SS
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const seconds = parseInt(parts[2], 10);
    return hours * 3600 + minutes * 60 + seconds;
  }

  return 0;
};
