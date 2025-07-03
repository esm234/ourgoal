import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import VideoPlayer from '@/components/VideoPlayer';
import PDFViewer from '@/components/PDFViewer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import {
  BookOpen,
  Clock,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Trophy,
  ArrowLeft,
  Share2,
  FileText,
  FileDown,
  Play,
  PartyPopper,
  Lock,
  Download,
  Share
} from 'lucide-react';
import {
  markLessonComplete,
  isLessonCompleted,
  getNextLesson,
  getPreviousLesson,
  isEnrolledInCourse,
  enrollInCourse,
  saveLessonProgressPercentage,
  getLessonProgressPercentage,
  getCompletedLessonsCount,
  getTotalProgressPercentage,
  isLessonUnlocked,
  convertDurationToSeconds
} from '@/utils/courseProgress';
import { trackVideoPlay, trackVideoComplete, trackVideoProgress } from '@/utils/analytics';
import { getCachedVideoUrl, saveVideoTime } from '@/utils/cacheUtils';
import { Skeleton } from '@/components/ui/skeleton';

interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'pdf' | 'test';
  isCompleted: boolean;
  description: string;
  mp4Url?: string;
  files?: {
    id: string;
    title: string;
    type: string;
    size: string;
    url: string;
  }[];
  tests?: {
    id: string;
    title: string;
    type: string;
    duration: string;
    questions: number;
    isCompleted: boolean;
    googleFormUrl?: string;
  }[];
  chapters?: Chapter[];
  videoUrl?: string;
}

interface Chapter {
  label: string;
  time: number;
}

const CourseLesson = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [previousLesson, setPreviousLesson] = useState<string | null>(null);
  const [nextLesson, setNextLesson] = useState<string | null>(null);
  const [seekTime, setSeekTime] = useState<number | null>(null);
  const [player, setPlayer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  // Get lesson data for The Last Dance course
  const getLessonData = (lessonId: string): Lesson | null => {
    // This is a mock implementation - in a real app, you would fetch this from your data source
    const lessons: Record<string, Lesson> = {
      'verbal-1-1': {
        id: 'verbal-1-1',
        title: 'شرح التناظر الجزء الاول',
        type: 'video',
        duration: '54:00',
        videoUrl: 'https://youtu.be/_MbT4wZK7Hk?feature=shared',
        description: 'شرح مفصل لأساسيات التناظر اللفظي واستراتيجيات الحل',
        files: [
          {
            id: 'file-1',
            title: 'شرح التناظر اللفظي',
            type: 'PDF',
            size: '5.62 MB',
            url: 'https://drive.google.com/uc?export=download&id=1cS7JhvzVvrqRRl74VM5W_UpesaYnZdFm'
          }
        ],
        tests: [
          {
            id: 'verbal-test-1',
            title: 'الاختبار الأول',
            type: 'اختبار تدريبي',
            duration: '20 دقيقة',
            questions: 50,
            isCompleted: false,
            googleFormUrl: 'https://forms.gle/KbkiMZkcpgHNgTdj8'
          },
          {
            id: 'verbal-test-2',
            title: 'الاختبار الثاني',
            type: 'اختبار تدريبي',
            duration: '20 دقيقة',
            questions: 50,
            isCompleted: false,
            googleFormUrl: 'https://forms.gle/JQT99sa7ebUPwhBb7'
          },
          {
            id: 'verbal-test-3',
            title: 'الاختبار الثالث',
            type: 'اختبار تدريبي',
            duration: '20 دقيقة',
            questions: 50,
            isCompleted: false,
            googleFormUrl: 'https://forms.gle/LoQGjvVhiPxh96kQ6'
          }
        ],
        chapters: [
          { label: 'مقدمة عن التناظر اللفظي', time: 0 },
          { label: 'علاقة الترادف', time: 745 },
          { label: 'علاقة التضاد', time: 998 },
          { label: 'علاقة جزء من', time: 1338 },
          { label: 'علاقة التدرج', time: 1851 },
          { label: 'علاقات الكائنات الحية', time: 2242 },
          { label: 'علاقات البلاد', time: 2723 },
          { label: 'علاقة الفئة', time: 2847 }
        ],
        isCompleted: false
      },
      'verbal-2-1': {
        id: 'verbal-2-1',
        title: 'شرح التناظر الجزء الثاني',
        type: 'video',
        duration: '39:00',
        videoUrl: 'https://youtu.be/7nI8OhMkKvs?feature=shared',
        description: 'شرح متقدم لاستراتيجيات التناظر اللفظي وحل الأسئلة الصعبة',
        files: [
          {
            id: 'file-2',
            title: 'شرح التناظر اللفظي - الجزء الثاني',
            type: 'PDF',
            size: '3.1 MB',
            url: 'https://drive.google.com/uc?export=download&id=1cS7JhvzVvrqRRl74VM5W_UpesaYnZdFm'
          }
        ],
        tests: [
          {
            id: 'verbal-test-4',
            title: 'الاختبار الرابع',
            type: 'اختبار تدريبي',
            duration: '20 دقيقة',
            questions: 50,
            isCompleted: false,
            googleFormUrl: 'https://forms.gle/TesHNsUkRGZaBHVb7'
          },
          {
            id: 'verbal-test-5',
            title: 'الاختبار الخامس',
            type: 'اختبار تدريبي',
            duration: '20 دقيقة',
            questions: 50,
            isCompleted: false,
            googleFormUrl: 'https://forms.gle/ZpB7PDfm2G1dSra96'
          },
          {
            id: 'verbal-test-6',
            title: 'الاختبار السادس',
            type: 'اختبار تدريبي',
            duration: '20 دقيقة',
            questions: 50,
            isCompleted: false,
            googleFormUrl: 'https://forms.gle/LkmHApTeKLhAvGTa9'
          }
        ],
        chapters: [
          { label: 'مراجعة على الجزء الأول', time: 0 },
          { label: 'علاقة المكان', time: 120 },
          { label: 'علاقة الوظيفة', time: 480 },
          { label: 'علاقة الإحاطة', time: 780 },
          { label: 'علاقة التغطية', time: 1020 },
          { label: 'علاقة المصدر', time: 1380 },
          { label: 'علاقة الآلية', time: 1680 },
          { label: 'أمثلة شاملة', time: 2040 }
        ],
        isCompleted: false
      },
      'completion-1-1': {
        id: 'completion-1-1',
        title: 'شرح الإكمال الجزء الاول',
        type: 'video',
        duration: '25:00',
        videoUrl: 'https://youtu.be/_0XvlcaooUE?feature=shared',
        description: 'شرح شامل لإكمال الجمل وأساليب الحل السريع',
        files: [
          {
            id: 'file-3',
            title: 'شرح إكمال الجمل',
            type: 'PDF',
            size: '259 KB',
            url: 'https://drive.google.com/uc?export=download&id=1UBAQLf1LiQpeiE00MDv_OooSRQ41JX8B'
          }
        ],
        tests: [
          {
            id: 'completion-test-1',
            title: 'اختبار إكمال الجمل - ١',
            type: 'اختبار تدريبي',
            duration: '15 دقيقة',
            questions: 50,
            isCompleted: false,
            googleFormUrl: 'https://forms.gle/dYtVafgsdmg4eBGRA'
          },
          {
            id: 'completion-test-2',
            title: 'اختبار إكمال الجمل - ٢',
            type: 'اختبار تدريبي',
            duration: '15 دقيقة',
            questions: 50,
            isCompleted: false,
            googleFormUrl: 'https://forms.gle/uhS3HbGSsmT5J3yi7'
          },
          {
            id: 'completion-test-3',
            title: 'اختبار إكمال الجمل - ٣',
            type: 'اختبار تدريبي',
            duration: '15 دقيقة',
            questions: 50,
            isCompleted: false,
            googleFormUrl: 'https://forms.gle/GJU7gjYvetcLSfB89'
          }
        ],
        chapters: [
          { label: 'مقدمة عن إكمال الجمل', time: 0 },
          { label: 'استراتيجيات الحل', time: 180 },
          { label: 'أنواع الفراغات', time: 420 },
          { label: 'الكلمات المفتاحية', time: 720 },
          { label: 'تحليل السياق', time: 960 },
          { label: 'أمثلة تطبيقية', time: 1200 }
        ],
        isCompleted: false
      },
      'contextual-error-1': {
        id: 'contextual-error-1',
        title: 'شرح الخطأ السياقي',
        type: 'video',
        duration: '19:26',
        videoUrl: 'https://youtu.be/uVN7NeA_aqA?feature=shared',
        description: 'شرح مفصل لمهارات تحديد الأخطاء السياقية في النصوص واستراتيجيات الحل',
        files: [
          {
            id: 'file-4',
            title: 'شرح الخطأ السياقي',
            type: 'PDF',
            size: '233 KB',
            url: 'https://drive.google.com/uc?export=download&id=1IK2nR3cKqps1cEv27_4r_FoHpUbmP4hs'
          }
        ],
        tests: [
          {
            id: 'contextual-error-test-1',
            title: 'اختبار الخطأ السياقي - ١',
            type: 'اختبار تدريبي',
            duration: '20 دقيقة',
            questions: 50,
            isCompleted: false,
            googleFormUrl: 'https://forms.gle/MzKKk99xXXYEXgAc8'
          },
          {
            id: 'contextual-error-test-2',
            title: 'اختبار الخطأ السياقي - ٢',
            type: 'اختبار تدريبي',
            duration: '20 دقيقة',
            questions: 50,
            isCompleted: false,
            googleFormUrl: 'https://forms.gle/wpfktd2omsYRTuoZ9'
          },
          {
            id: 'contextual-error-test-3',
            title: 'اختبار الخطأ السياقي - ٣',
            type: 'اختبار تدريبي',
            duration: '20 دقيقة',
            questions: 50,
            isCompleted: false,
            googleFormUrl: 'https://forms.gle/xSHSRh2NaKTzZ5mM9'
          }
        ],
        chapters: [
          { label: 'تعريف القسم و استراتيجيات الحل', time: 0 },
          { label: 'التركيز على المعنى العام للجمله', time: 196 },
          { label: 'الانتباه للارقام اذا ذكر تعداد', time: 317 },
          { label: 'التضاد العام في معنى الجمله', time: 376 },
          { label: 'التشبيه', time: 497 },
          { label: 'السبب و النتيجه', time: 554 },
          { label: 'الايجابي و السلبي', time: 669 },
          { label: 'الترابط اللفظي', time: 798 },
          { label: 'التوافق و التعارض الشرطي', time: 901 }
        ],
        isCompleted: false
      },
      'reading-comprehension-1': {
        id: 'reading-comprehension-1',
        title: 'شرح استيعاب المقروء الجزء الأول',
        type: 'video',
        duration: '57:58',
        videoUrl: 'https://youtu.be/O1YeDSpq0MY?feature=shared',
        description: 'شرح مفصل لأساسيات استيعاب المقروء واستراتيجيات الفهم والتحليل',
        files: [
          {
            id: 'file-6',
            title: 'شرح استيعاب المقروء',
            type: 'PDF',
            size: '4.2 MB',
            url: 'https://drive.google.com/uc?export=download&id=1RRqYjbdPDYA77n2XHExYQ8Zn46_bL5jq'
          }
        ],
        tests: [
          {
            id: 'reading-comprehension-test-1',
            title: 'اختبار استيعاب المقروء - ١',
            type: 'اختبار تدريبي',
            duration: '25 دقيقة',
            questions: 50,
            isCompleted: false,
            googleFormUrl: 'https://docs.google.com/forms/d/1iOSHzVdG09-0gnmlU9AikXao2snCPBM0wxyVOAHEwoQ/edit'
          }
        ],
        chapters: [
          { label: 'تعريف القسم و انواع النصوص', time: 0 },
          { label: 'اسألة الفهم', time: 328 },
          { label: 'اسألة الاستنتاج', time: 548 },
          { label: 'الكلمات التي يمكن حذفها دون تغيير المعنى', time: 1125 },
          { label: 'الضمائر في الاستيعاب', time: 1839 },
          { label: 'اسماء الاشاره', time: 2198 },
          { label: 'الاسماء الموصوله', time: 2306 },
          { label: 'مقدمه في القرون و العقود', time: 2360 },
          { label: 'كيفية حساب القرون و العقود', time: 2564 },
          { label: 'الفئات في السنوات', time: 3003 },
          { label: 'سؤال عاش اغلب عمره في', time: 3073 }
        ],
        isCompleted: false
      },
      'reading-comprehension-2': {
        id: 'reading-comprehension-2',
        title: 'شرح استيعاب المقروء الجزء الثاني',
        type: 'video',
        duration: '47:46',
        videoUrl: 'https://youtu.be/osnIenBsHZg?feature=shared',
        description: 'تطبيقات عملية على أسئلة استيعاب المقروء وتقنيات الحل السريع',
        files: [
          {
            id: 'file-7',
            title: 'شرح استيعاب المقروء',
            type: 'PDF',
            size: '4.2 MB',
            url: '/pdfs/the-last-dance/reading-comprehension.pdf'
          }
        ],
        tests: [
          {
            id: 'reading-comprehension-test-2',
            title: 'اختبار استيعاب المقروء - ٢',
            type: 'اختبار تدريبي',
            duration: '25 دقيقة',
            questions: 50,
            isCompleted: false,
            googleFormUrl: 'https://docs.google.com/forms/d/1rFL73jVGcy9v7bD1wKLC-fPKhgfB34kJTazRv5yBC_s/edit'
          }
        ],
        chapters: [
          { label: 'انسب عنوان للنص', time: 0 },
          { label: 'الفكره العامه للنص', time: 349 },
          { label: 'موقف الكاتب من النص', time: 656 },
          { label: 'اسلوب النص', time: 1086 },
          { label: 'الاتجاه الفكري في النص', time: 1387 },
          { label: 'السيره الذاتيه و الترجمه', time: 1573 },
          { label: 'الاساليب ( الخبري و الانشائي )', time: 1654 },
          { label: 'معاني الكلمات حسب السياق', time: 2224 },
          { label: 'اسألة التعداد', time: 2496 },
          { label: 'العلم المرتبط بالنص', time: 2664 }
        ],
        isCompleted: false
      },
      'reading-comprehension-3': {
        id: 'reading-comprehension-3',
        title: 'شرح استيعاب المقروء الجزء الثالث',
        type: 'video',
        duration: '53:29',
        videoUrl: 'https://youtu.be/yBoDRWs6hWM?feature=shared',
        description: 'استراتيجيات متقدمة في استيعاب المقروء وحل الأسئلة المعقدة',
        files: [
          {
            id: 'file-8',
            title: 'شرح استيعاب المقروء',
            type: 'PDF',
            size: '4.2 MB',
            url: '/pdfs/the-last-dance/reading-comprehension.pdf'
          }
        ],
        tests: [
          {
            id: 'reading-comprehension-test-3',
            title: 'اختبار استيعاب المقروء - ٣',
            type: 'اختبار تدريبي',
            duration: '25 دقيقة',
            questions: 50,
            isCompleted: false,
            googleFormUrl: 'https://docs.google.com/forms/d/1-A6PHfnyQSgQN9zn6eVeOgs1UFO1JMjNvpH_m_KIdto/viewform?edit_requested=true'
          }
        ],
        chapters: [
          { label: 'علاقات السبب و النتيجة و التعليل', time: 0 },
          { label: 'علاقة الشرط', time: 799 },
          { label: 'علاقات التفصيل و الاجمال', time: 1116 },
          { label: 'علاقة التفسير', time: 1532 },
          { label: 'علاقة التوضيح', time: 1746 },
          { label: 'علاقة التأكيد', time: 2125 },
          { label: 'علاقات التضاد و المقابله و التعارض', time: 2372 },
          { label: 'علاقة التمثيل', time: 2536 },
          { label: 'علاقة التقرير', time: 2678 },
          { label: 'علاقة الاستدراك', time: 2801 },
          { label: 'علاقات الطردية و العكسية', time: 2991 }
        ],
        isCompleted: false
      },
      'odd-word-1': {
        id: 'odd-word-1',
        title: 'شرح المفردة الشاذة',
        type: 'video',
        duration: '50:00',
        videoUrl: 'https://youtu.be/fIH0PldXRFQ?feature=shared',
        description: 'شرح مفصل لاستراتيجيات تحديد المفردة الشاذة وحل أسئلتها بسرعة ودقة',
        files: [
          {
            id: 'file-5',
            title: 'شرح المفردة الشاذة',
            type: 'PDF',
            size: '544 KB',
            url: 'https://drive.google.com/uc?export=download&id=14MHVBspSxboge8YguhXrtY-6kPtJBKt0'
          }
        ],
        tests: [
          {
            id: 'odd-word-test-1',
            title: 'اختبار المفردة - ١',
            type: 'اختبار تدريبي',
            duration: '15 دقيقة',
            questions: 50,
            isCompleted: false,
            googleFormUrl: 'https://forms.gle/SMg6hXtWW2SfguMu9'
          },
          {
            id: 'odd-word-test-2',
            title: 'اختبار المفردة - ٢',
            type: 'اختبار تدريبي',
            duration: '15 دقيقة',
            questions: 50,
            isCompleted: false,
            googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLScSmtmIShgiHPQfqgnoQ129pGmQsKZvJAwJcHkqfEWgr7nwNQ/formResponse'
          },
          {
            id: 'odd-word-test-3',
            title: 'اختبار المفردة - ٣',
            type: 'اختبار تدريبي',
            duration: '15 دقيقة',
            questions: 50,
            isCompleted: false,
            googleFormUrl: 'https://forms.gle/u4hcJ7YJSpHKit6j7'
          }
        ],
        chapters: [
          { label: 'مقدمة عن المفردة الشاذة', time: 0 },
          { label: 'أنواع المفردات الشاذة', time: 300 },
          { label: 'استراتيجيات التحديد', time: 780 },
          { label: 'المفردات الشاذة دلالياً', time: 1200 },
          { label: 'المفردات الشاذة ظيفياً', time: 1680 },
          { label: 'المفردات الشاذة شكلياً', time: 2100 },
          { label: 'أمثلة تطبيقية', time: 2520 }
        ],
        isCompleted: false
      }
    };

    return lessonId in lessons ? lessons[lessonId] : null;
  };

  const lesson = getLessonData(lessonId || 'verbal-1-1');
  const courseName = 'The Last Dance';

  useEffect(() => {
    if (courseId && lessonId) {
      // التحقق من التسجيل في الدورة - تم إزالة الفحص لجعل جميع الدروس متاحة للمشاهدة
      // بدون الحاجة للتسجيل في الدورة

      // تحميل تقدم الدرس
      const savedProgress = getLessonProgressPercentage(courseId, lessonId);
      setProgress(savedProgress);
      setIsCompleted(savedProgress >= 100);

      // تحديد الدروس السابقة والتالية
      setPreviousLesson(getPreviousLesson(courseId, lessonId));
      setNextLesson(getNextLesson(courseId, lessonId));

      // استرجاع وقت التوقف السابق
      const savedTime = localStorage.getItem(`course_${courseId}_lesson_${lessonId}_time`);
      if (savedTime) {
        setSeekTime(parseFloat(savedTime));
      }

      setIsLoading(false);
    }
  }, [courseId, lessonId, navigate]);

  // Set up progress tracking interval
  useEffect(() => {
    if (player && courseId && lessonId) {
      // Clear any existing interval
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }

      // Set up new interval to track progress every 5 seconds
      progressInterval.current = setInterval(() => {
        try {
          if (player && typeof player.getCurrentTime === 'function') {
            const currentTime = player.getCurrentTime();
            if (currentTime > 0) {
              // Track video progress
              trackVideoProgress(lessonId, currentTime, courseId);

              // Update local progress state
              const lesson = getLessonData(lessonId);
              if (lesson) {
                const durationInSeconds = convertDurationToSeconds(lesson.duration);
                const progressPercent = Math.min(Math.round((currentTime / durationInSeconds) * 100), 100);
                setProgress(progressPercent);

                // Check if video is completed
                if (progressPercent >= 100 && !isCompleted) {
                  setIsCompleted(true);
                  trackVideoComplete(lessonId, courseId);
                  toast.success('أحسنت! لقد أكملت هذا الدرس');
                }
              }
            }
          }
        } catch (error) {
          console.error('Error tracking video progress:', error);
        }
      }, 5000);
    }

    // Cleanup interval on unmount
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [player, courseId, lessonId, isCompleted]);

  const handleMarkComplete = async () => {
    if (courseId && lessonId) {
      markLessonComplete(courseId, lessonId);
      saveLessonProgressPercentage(courseId, lessonId, 100);
      setIsCompleted(true);
      setProgress(100);

      // التحقق مما إذا كان هذا هو الدرس الأخير
      const nextLessonId = getNextLesson(courseId, lessonId);

      // إذا كان لا يوجد درس تالي، فهذا هو الدرس الأخير
      if (!nextLessonId) {
        // التحقق من إكمال جميع الدروس السابقة
        const totalProgress = getTotalProgressPercentage(courseId);

        if (totalProgress === 100) {
          // إضافة إشعار محلي عند إكمال الدورة
          import('@/services/localNotifications').then(module => {
            const { localNotificationService } = module;
            localNotificationService.addCourseCompletedNotification({
              courseId: courseId,
              courseTitle: courseName
            });
          });
          
          // إظهار تهنئة عند إكمال الدورة بالكامل
          toast.success(
            <div className="flex flex-col items-center">
              <PartyPopper className="w-8 h-8 text-yellow-500 mb-2" />
              <div className="text-lg font-bold">تهانينا!</div>
              <div>لقد أكملت دورة {courseName} بنجاح</div>
            </div>,
            {
              duration: 5000,
              position: 'top-center',
              className: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
            }
          );

          // الانتقال إلى صفحة تفاصيل الدورة بعد ثانيتين
          setTimeout(() => {
            navigate(`/courses/${courseId}`);
          }, 2000);
        } else {
          toast.success('تم إكمال الدرس بنجاح!');
        }
      } else {
        toast.success('تم إكمال الدرس بنجاح!');
      }
    }
  };

  const handleNextLesson = () => {
    if (nextLesson && courseId) {
      // تم إزالة التحقق من فتح الدرس لأن جميع الدروس مفتوحة الآن
        navigate(`/courses/${courseId}/lesson/${nextLesson}`);
    }
  };

  const handlePreviousLesson = () => {
    if (courseId && lessonId) {
      const prevLessonId = getPreviousLesson(courseId, lessonId);
      if (prevLessonId) {
        navigate(`/courses/${courseId}/lesson/${prevLessonId}`);
      } else {
        navigate(`/courses/${courseId}`);
      }
    }
  };

  const handleStartTest = (formId: string) => {
    navigate(`/courses/${courseId}/lesson/${lessonId}/test/${formId}`);
  };

  const handleChapterClick = (time: number) => {
    if (player) {
      try {
        player.currentTime = time;
        player.play();
      } catch (e) {
        console.error('Error seeking to time:', e);
      }
    }
  };

  const renderLessonContent = () => {
    if (!lesson) return null;

    // تحديد مصدر الفيديو (mp4 أو يوتيوب)
    let mp4Source = undefined;
    let youtubeSource = undefined;

    if (lesson.type === 'video') {
      if (lesson.mp4Url && lesson.mp4Url.endsWith('.mp4')) {
        mp4Source = getCachedVideoUrl(lesson.mp4Url, courseId, lessonId);
      }

      if (lesson.videoUrl && lesson.videoUrl.includes('youtu')) {
        youtubeSource = lesson.videoUrl;
      }
    }

    return (
      <div className="space-y-8">
        {/* Video Player */}
        {lesson.type === 'video' && (
          <VideoPlayer
            key={lesson.id}
            mp4Url={mp4Source}
            youtubeUrl={youtubeSource}
            title={lesson.title}
            duration={lesson.duration}
            lessonId={lessonId || ''}
            seekTime={seekTime}
            onPlayerReady={setPlayer}
            chapters={lesson.chapters}
          />
        )}
      </div>
    );
  };

  // إضافة تخزين مؤقت للفيديو
  const getCachedVideoUrl = (url: string, courseId: string, lessonId: string): string => {
    // إضافة معلمة التخزين المؤقت للتأكد من تحديث الرابط عند تغيير الفيديو
    const cacheParam = `?cache=${courseId}_${lessonId}`;
    return `${url}${cacheParam}`;
  };

  // Render loading state
  if (isLoading || !lesson) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-[400px] w-full mb-6" />
            <div className="flex justify-between mb-6">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-2" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO
        title={`${lesson.title} - ${courseName} - Our Goal`}
        description={lesson.description}
      />

      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <div className="container mx-auto px-2 sm:px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/courses')}
                className="text-muted-foreground hover:text-primary"
              >
                الدورات
              </Button>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/courses/${courseId}`)}
                className="text-muted-foreground hover:text-primary"
              >
                {courseName}
              </Button>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{lesson.title}</span>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-4 md:gap-0 md:flex-row md:items-center">
              {/* العنوان والوصف */}
              <div className="flex-1 flex flex-col md:items-start items-center text-center md:text-right">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{lesson.title}</h1>
                <p className="text-muted-foreground mb-2 md:mb-0">{lesson.description}</p>
              </div>
              {/* أزرار الاشتراك والعودة */}
              <div className="flex flex-col md:flex-row gap-2 md:gap-3 w-full md:w-auto mt-4 md:mt-0">
                {lesson.type === 'video' && lesson.videoUrl && lesson.videoUrl.includes('youtu') && (
                  <Button
                    variant="outline"
                    onClick={() => window.open('https://www.youtube.com/@our_goal_pro?sub_confirmation=1', '_blank')}
                    className="bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700 flex items-center gap-2 w-full md:w-auto"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    اشترك في القناة
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => navigate(`/courses/${courseId}`)}
                  className="flex items-center gap-2 w-full md:w-auto"
                >
                  <ArrowLeft className="w-4 h-4" />
                  العودة للدورة
                </Button>
              </div>
            </div>
          </motion.div>

          <div className="grid sm:grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="bg-card/50 backdrop-blur-sm border-border/50 rounded-2xl overflow-hidden w-full max-w-full">
                  <CardContent className="p-0 w-full max-w-full">
                    <div className="mx-auto px-2 sm:px-6 lg:px-8 py-8 w-full max-w-full">
                      {renderLessonContent()}
                    </div>
                  </CardContent>
                </Card>

                {/* Lesson Info */}
                <Card className="mt-6 bg-card/50 backdrop-blur-sm border-border/50 rounded-2xl w-full max-w-full">
                  <CardHeader>
                    <div className="flex items-center justify-between flex-wrap gap-2 w-full">
                      <CardTitle className="flex items-center gap-3">
                        <BookOpen className="w-6 h-6 text-primary" />
                        الملفات والاختبارات
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {lesson.type === 'video' ? 'فيديو' : lesson.type === 'pdf' ? 'ملف PDF' : 'اختبار'}
                        </Badge>
                        <Badge variant="outline">
                          <Clock className="w-3 h-3 mr-1" />
                          {lesson.duration}
                        </Badge>
                        {/* YouTube Subscribe Button */}
                        {lesson.type === 'video' && lesson.videoUrl && lesson.videoUrl.includes('youtu') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open('https://www.youtube.com/@our_goal_pro?sub_confirmation=1', '_blank')}
                            className="bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700"
                          >
                            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                            </svg>
                            اشترك في القناة
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const shareData = {
                              title: lesson.title,
                              text: `شاهد درس ${lesson.title} على Our Goal`,
                              url: window.location.href
                            };

                            if (navigator.share) {
                              navigator.share(shareData)
                                .then(() => toast.success('تمت المشاركة بنجاح'))
                                .catch(() => toast.error('حدث خطأ أثناء المشاركة'));
                            } else {
                              navigator.clipboard.writeText(window.location.href)
                                .then(() => toast.success('تم نسخ رابط الدرس'))
                                .catch(() => toast.error('حدث خطأ أثناء نسخ الرابط'));
                            }
                          }}
                          className="text-muted-foreground hover:text-primary"
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Files Section */}
                      {lesson.files && lesson.files.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold mb-3">ملفات الدرس</h3>
                          <div className="grid gap-3">
                            {lesson.files.map((file) => (
                              <div key={file.id} className="flex items-center justify-between p-3 bg-background/50 rounded-xl">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-blue-600" />
                                  </div>
                                  <div>
                                    <div className="font-medium">{file.title}</div>
                                    <div className="text-sm text-muted-foreground">{file.type} - {file.size}</div>
                                  </div>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => window.open(file.url, '_blank')}>
                                  <FileDown className="w-4 h-4 mr-2" />
                                  تحميل
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Tests Section */}
                      {lesson.tests && lesson.tests.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold mb-3">اختبارات الدرس</h3>
                          <div className="grid gap-3">
                            {lesson.tests.map((test) => (
                              <div key={test.id} className="flex items-center justify-between p-3 bg-background/50 rounded-xl">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                                    <Trophy className="w-5 h-5 text-orange-600" />
                                  </div>
                                  <div>
                                    <div className="font-medium">{test.title}</div>
                                    <div className="text-sm text-muted-foreground">{test.questions} أسئلة - {test.duration}</div>
                                  </div>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => window.open(test.googleFormUrl, '_blank')}
                                >
                                  <Play className="w-4 h-4 mr-2" />
                                  ابدأ الاختبار
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="sticky top-8 space-y-6"
              >
                {/* Progress Card */}
                <Card className="bg-card/50 backdrop-blur-sm border-border/50 rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-lg">تقدمك في الدرس</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>التقدم</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>

                    {!isCompleted ? (
                      <Button
                        onClick={handleMarkComplete}
                        className="w-full bg-green-500 hover:bg-green-600"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        تم إكمال الدرس
                      </Button>
                    ) : (
                      <div className="flex items-center justify-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">تم إكمال الدرس</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Navigation Buttons */}
                <div className="flex flex-wrap justify-between items-center gap-2 mt-6 w-full">
                  <Button
                    variant="outline"
                    onClick={handlePreviousLesson}
                    disabled={!previousLesson}
                    className="flex-1 min-w-0 bg-background/50 hover:bg-background/80 border-primary/20 hover:border-primary/40 text-foreground hover:text-primary font-medium py-3 rounded-xl transition-all duration-300"
                  >
                    <ChevronRight className="w-4 h-4 ml-2" />
                    الدرس السابق
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleNextLesson}
                    disabled={!nextLesson}
                    className="flex-1 min-w-0 bg-background/50 hover:bg-background/80 border-primary/20 hover:border-primary/40 text-foreground hover:text-primary font-medium py-3 rounded-xl transition-all duration-300"
                  >
                    الدرس التالي
                    <ChevronLeft className="w-4 h-4 mr-2" />
                  </Button>
                </div>

                {/* Actions */}
                <Card className="bg-card/50 backdrop-blur-sm border-border/50 rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-lg">إجراءات</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          try {
                            const shareData = {
                              title: lesson.title,
                              text: `شاهد درس ${lesson.title} على Our Goal`,
                              url: window.location.href
                            };

                            if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                              await navigator.share(shareData);
                              toast.success('تمت المشاركة بنجاح');
                            } else {
                              await navigator.clipboard.writeText(window.location.href);
                              toast.success('تم نسخ رابط الدرس');
                            }
                          } catch (error) {
                            console.error('Share error:', error);
                            toast.error('حدث خطأ أثناء المشاركة');
                          }
                        }}
                        className="w-full justify-start"
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        مشاركة الدرس
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CourseLesson;
