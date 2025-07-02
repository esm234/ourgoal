import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Clock,
  Star,
  Play,
  CheckCircle,
  Target,
  Globe,
  Video,
  FileText,
  TestTube,
  Sparkles,
  Zap,
  ChevronRight,
  Lock,
  PlayCircle,
  FileDown,
  Trophy,
  BarChart3,
  Heart,
  Share2,
  Bookmark,
  ArrowRight,
  Calculator,
  Users,
  Timer,
  Brain,
  TrendingUp,
  ArrowLeft,
  FileCheck,
  FileX,
  TextQuote,
  MessageCircle,
  Headphones,
  AlertTriangle,
  Link,            // للتناظر اللفظي
  TextCursorInput,  // لإكمال الجمل
  AlertCircle,      // للخطأ السياقي
  BookOpen,         // لاستيعاب المقروء
  Asterisk,
  Replace 
} from 'lucide-react';
import {
  getCourseProgress,
  isEnrolledInCourse,
  enrollInCourse,
  getTotalProgressPercentage,
  getCompletedLessonsCount,
  isLessonCompleted,
  getNextUncompletedLesson,
  isLessonUnlocked
} from '@/utils/courseProgress';
import { LucideIcon } from 'lucide-react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { useAuth } from '@/contexts/AuthContext';
import { enrollUserInCourse, isUserEnrolled } from '@/services/courseEnrollment';
import { toast } from 'sonner';

interface CourseLesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'pdf' | 'test';
  isCompleted: boolean;
  isLocked: boolean;
  description?: string;
  youtubeUrl?: string;
  videoUrl?: string;
}

interface CourseSection {
  id: string;
  title: string;
  lessons: CourseLesson[];
  isCompleted?: boolean;
  curriculumFile?: {
    title: string;
    url: string;
    size: string;
  };
}

interface MockTest {
  id: string;
  title: string;
  description: string;
  type: 'verbal' | 'quantitative' | 'reading' | 'comprehensive';
  googleFormUrl: string;
  isActive: boolean;
  color: string;
  gradient: string;
  icon: any;
}

interface TestSection {
  id: string;
  title: string;
  description: string;
  icon: any;
  gradient: string;
  tests: {
    id: string;
    title: string;
    description: string;
    googleFormUrl: string;
    isActive: boolean;
  }[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  type: 'verbal' | 'analytical';
  duration: string;
  lessons: number;
  skills: string[];
  hasVideos: boolean;
  hasPdfs: boolean;
  hasTests: boolean;
  materials: {
    videos: number;
    pdfs: number;
    tests: number;
  };
  sections: CourseSection[];
  outcomes: string[];
  requirements: string[];
  gradient: string;
  bgGradient: string;
  borderColor: string;
  icon: LucideIcon;
  testSections: {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
    gradient: string;
    tests: {
      id: string;
      title: string;
      description: string;
      googleFormUrl: string;
      isActive: boolean;
    }[];
  }[];
  isEnrolled?: boolean;
  progress?: number;
}

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [enrolled, setEnrolled] = useState(false);
  const [courseProgress, setCourseProgress] = useState(0);
  const [completedLessons, setCompletedLessons] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Load progress from localStorage and enrollment count from database
  useEffect(() => {
    if (courseId) {
      // Local progress
      const isEnrolled = isEnrolledInCourse(courseId);
      const progress = getTotalProgressPercentage(courseId);
      const completed = getCompletedLessonsCount(courseId);

      setEnrolled(isEnrolled);
      setCourseProgress(progress);
      setCompletedLessons(completed);

      // Check if user is enrolled in database
      const checkDatabaseEnrollment = async () => {
        if (user && courseId) {
          const isEnrolledInDb = await isUserEnrolled(courseId, user.id);
          if (isEnrolledInDb) {
            setEnrolled(true);
          }
        }
      };

      if (user) {
        checkDatabaseEnrollment();
      }
    }
  }, [courseId, user]);

  // Function to refresh progress data
  const refreshProgress = () => {
    if (courseId) {
      const progress = getTotalProgressPercentage(courseId);
      const completed = getCompletedLessonsCount(courseId);
      setCourseProgress(progress);
      setCompletedLessons(completed);
    }
  };

  // Update progress when returning to page (e.g., after completing a lesson)
  useEffect(() => {
    const handleFocus = () => {
      refreshProgress();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshProgress();
      }
    };

    // Periodic refresh every 5 seconds when page is visible
    const interval = setInterval(() => {
      if (!document.hidden) {
        refreshProgress();
      }
    }, 5000);

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(interval);
    };
  }, [courseId]);

  // Generate dynamic features based on course content
  const getDynamicFeatures = (course: Course) => {
    const features = [];

    if (course.hasVideos) {
      features.push('فيديوهات تفاعلية عالية الجودة');
    }

    if (course.hasPdfs) {
      features.push('ملفات PDF شاملة للتحميل');
    }

    if (course.hasTests) {
      features.push('اختبارات متنوعة');
    }

    // Always include these
    features.push('محتوى مجاني 100%');
    features.push('وصول مدى الحياة');
    features.push('دعم فني مجاني');

    return features;
  };

  // Get course data by ID
  const getCourseById = (id: string): Course | null => {
    const courses = [
      {
        id: 'the-last-dance',
        title: 'The Last Dance',
        description: 'دورة التأسيس اللفظي الشاملة - رحلتك الأخيرة نحو إتقان القدرات اللفظية',
        longDescription: 'دورة تأسيسية متخصصة في القدرات اللفظية، مصممة لتكون رحلتك الأخيرة نحو الإتقان الكامل. تغطي جميع أنواع الأسئلة اللفظية بطريقة عملية ومبسطة مع استراتيجيات متقدمة للحل السريع والدقيق.',
        type: 'verbal' as const,
        duration: '6 ساعات',
        lessons: 8,
        skills: ['التناظر اللفظي', 'الخطأ السياقي', 'إكمال الجمل', 'استيعاب المقروء', 'المفردة الشاذة'],
        hasVideos: true,
        hasPdfs: true,
        hasTests: true,
        materials: {
          videos: 8,
          pdfs: 5,
          tests: 18
        },
        sections: [
          {
            id: 'verbal-lessons',
            title: 'شرح التناظر اللفظي',
            lessons: [
              {
                id: 'verbal-1-1',
                title: 'شرح التناظر الجزء الاول',
                type: 'video' as const,
                duration: '54:00',
                videoUrl: 'https://youtu.be/uVN7NeA_aqA?feature=shared',
                isCompleted: false,
                isLocked: false
              },
              {
                id: 'verbal-2-1',
                title: 'شرح التناظر الجزء الثاني',
                type: 'video' as const,
                duration: '39:00',
                videoUrl: 'https://youtu.be/AqssuWI56Jk?feature=shared',
                isCompleted: false,
                isLocked: false
              }
            ],
            isCompleted: false,
            curriculumFile: {
              title: 'شرح التناظر اللفظي',
              url: 'https://drive.google.com/uc?export=download&id=1cS7JhvzVvrqRRl74VM5W_UpesaYnZdFm',
              size: '5.62 MB'
            }
          },
          {
            id: 'completion-lessons',
            title: 'شرح إكمال الجمل',
            lessons: [
              {
                id: 'completion-1-1',
                title: 'شرح الإكمال الجزء الاول',
                type: 'video' as const,
                duration: '25:00',
                videoUrl: 'https://youtu.be/AqssuWI56Jk?feature=shared',
                isCompleted: false,
                isLocked: false
              }
            ],
            isCompleted: false,
            curriculumFile: {
              title: 'شرح إكمال الجمل',
              url: 'https://drive.google.com/uc?export=download&id=1UBAQLf1LiQpeiE00MDv_OooSRQ41JX8B',
              size: '259 KB'
            }
          },
          {
            id: 'contextual-error-lessons',
            title: 'شرح الخطأ السياقي',
            lessons: [
              {
                id: 'contextual-error-1',
                title: 'شرح الخطأ السياقي',
                type: 'video' as const,
                duration: '19:26',
                videoUrl: 'https://youtu.be/AqssuWI56Jk?feature=shared',
                description: 'شرح مفصل لمهارات تحديد الأخطاء السياقية في النصوص واستراتيجيات الحل',
                isCompleted: false,
                isLocked: false
              }
            ],
            isCompleted: false,
            curriculumFile: {
              title: 'شرح الخطأ السياقي',
              url: 'https://drive.google.com/uc?export=download&id=1IK2nR3cKqps1cEv27_4r_FoHpUbmP4hs',
              size: '233 KB'
            }
          },
          {
            id: 'reading-comprehension-lessons',
            title: 'شرح استيعاب المقروء',
            lessons: [
              {
                id: 'reading-comprehension-1',
                title: 'شرح استيعاب المقروء الجزء الأول',
                type: 'video' as const,
                duration: '57:58',
                videoUrl: 'https://youtu.be/O1YeDSpq0MY?feature=shared',
                isCompleted: false,
                isLocked: false
              },
              {
                id: 'reading-comprehension-2',
                title: 'شرح استيعاب المقروء الجزء الثاني',
                type: 'video' as const,
                duration: '47:46',
                videoUrl: 'https://youtu.be/osnIenBsHZg?feature=shared',
                isCompleted: false,
                isLocked: false
              },
              {
                id: 'reading-comprehension-3',
                title: 'شرح استيعاب المقروء الجزء الثالث',
                type: 'video' as const,
                duration: '53:29',
                videoUrl: 'https://youtu.be/yBoDRWs6hWM?feature=shared',
                isCompleted: false,
                isLocked: false
              }
            ],
            isCompleted: false,
            curriculumFile: {
              title: 'شرح استيعاب المقروء',
              url: '/pdfs/the-last-dance/reading-comprehension.pdf',
              size: '4.2 MB'
            }
          },
          {
            id: 'odd-word-lessons',
            title: 'شرح المفردة الشاذة',
            lessons: [
              {
                id: 'odd-word-1',
                title: 'شرح المفردة الشاذة',
                type: 'video' as const,
                duration: '50:00',
                videoUrl: 'https://youtu.be/AqssuWI56Jk?feature=shared',
                description: 'شرح مفصل لاستراتيجيات تحديد المفردة الشاذة وحل أسئلتها بسرعة ودقة',
                isCompleted: false,
                isLocked: false
              }
            ],
            isCompleted: false,
            curriculumFile: {
              title: 'شرح المفردة الشاذة',
              url: 'https://drive.google.com/uc?export=download&id=14MHVBspSxboge8YguhXrtY-6kPtJBKt0',
              size: '544 KB'
            }
          }
        ],
        outcomes: [
          'إتقان جميع أنواع الأسئلة اللفظية في اختبار القدرات',
          'تطوير مهارات التفكير التحليلي واللغوي',
          'حل الأسئلة المعقدة بثقة وسرعة',
          'اكتساب استراتيجيات عملية لتجاوز العقبات في الامتحان',
          'التمييز بين العلاقات اللفظية المختلفة بسهولة',
          'رفع مستواك في استيعاب المقروء وتحليل النصوص',
          'القدرة على تحديد الأخطاء السياقية والمفردة الشاذة بدقة',
          'الاستعداد الكامل لاجتياز اختبار القدرات بأعلى الدرجات'
        ],
        requirements: [
          'حماس للتعلم والتطور',
          'الاستعداد لتجربة طرق جديدة في الحل',
          'الالتزام بحضور الدروس والتدريب العملي'
        ],
        gradient: 'from-blue-500 to-cyan-500',
        bgGradient: 'from-blue-500/10 to-cyan-500/10',
        borderColor: 'border-blue-500/30',
        icon: Target,
        testSections: [
          {
            id: 'verbal-tests',
            title: 'اختبارات التناظر اللفظي',
            description: 'مجموعة من الاختبارات التدريبية في التناظر اللفظي',
            icon: Link,
            gradient: 'from-purple-500 to-pink-500',
            tests: [
              {
                id: 'test-1',
                title: 'الاختبار الأول',
                description: 'الترادف - التضاد - جزء من - الكل بالجزء - يحتاج الى',
                googleFormUrl: 'https://forms.gle/KbkiMZkcpgHNgTdj8',
                isActive: true
              },
              {
                id: 'test-2',
                title: 'الاختبار الثاني',
                description: 'الفئة - النتيجة - التدرج - الحيوانات - الأصوات',
                googleFormUrl: 'https://forms.gle/JQT99sa7ebUPwhBb7',
                isActive: true
              },
              {
                id: 'test-3',
                title: 'الاختبار الثالث',
                description: 'الدول - الصفة - الآلية - المصدر - الإقتران - الإحاطة - التغطية - عكس الحروف',
                googleFormUrl: 'https://forms.gle/LoQGjvVhiPxh96kQ6',
                isActive: true
              },
              {
                id: 'test-4',
                title: 'الاختبار الرابع',
                description: 'الشدة - بواسطة - ضروري لــ - يستخدم لــ',
                googleFormUrl: 'https://forms.gle/TesHNsUkRGZaBHVb7',
                isActive: true
              },
              {
                id: 'test-5',
                title: 'الاختبار الخامس',
                description: 'اختبار شامل في التناظر اللفظي',
                googleFormUrl: 'https://forms.gle/ZpB7PDfm2G1dSra96',
                isActive: true
              },
              {
                id: 'test-6',
                title: 'الاختبار السادس',
                description: 'اختبار شامل في التناظر اللفظي',
                googleFormUrl: 'https://forms.gle/LkmHApTeKLhAvGTa9',
                isActive: true
              }
            ]
          },
          {
            id: 'completion-tests',
            title: 'اختبارات إكمال الجمل',
            description: 'مجموعة من الاختبارات التدريبية في إكمال الجمل',
            icon: TextCursorInput,
            gradient: 'from-green-500 to-emerald-500',
            tests: [
           {
                id: 'completion-1',
                title: 'الاختبار الأول',
                description: 'اختبار إكمال الجمل - ١',
                googleFormUrl: 'https://forms.gle/dYtVafgsdmg4eBGRA',
                isActive: true
              },
              {
                id: 'completion-2',
                title: 'الاختبار الثاني',
                description: 'إختبار إكمال الجمل - ٢',
                googleFormUrl: 'https://forms.gle/uhS3HbGSsmT5J3yi7',
                isActive: true
              },
              {
                id: 'completion-3',
                title: 'الاختبار الثالث',
                description: 'إختبار إكمال الجمل - ٣',
                googleFormUrl: 'https://forms.gle/GJU7gjYvetcLSfB89',
                isActive: true
              }
            ]
          },
          {
            id: 'contextual-error-tests',
            title: 'اختبارات الخطأ السياقي',
            description: 'مجموعة من الاختبارات التدريبية في الخطأ السياقي',
            icon: FileX,
            gradient: 'from-rose-500 to-red-500',
            tests: [
              {
                id: 'contextual-error-test-1',
                title: 'اختبار الخطأ السياقي - ١',
                description: 'اختبار الخطأ السياقي الجزء الأول',
                googleFormUrl: 'https://forms.gle/MzKKk99xXXYEXgAc8',
                isActive: true
              },
              {
                id: 'contextual-error-test-2',
                title: 'اختبار الخطأ السياقي - ٢',
                description: 'اختبار الخطأ السياقي الجزء الثاني',
                googleFormUrl: 'https://forms.gle/wpfktd2omsYRTuoZ9',
                isActive: true
              },
              {
                id: 'contextual-error-test-3',
                title: 'اختبار الخطأ السياقي - ٣',
                description: 'اختبار الخطأ السياقي الجزء الثالث',
                googleFormUrl: 'https://forms.gle/xSHSRh2NaKTzZ5mM9',
                isActive: true
              }
            ]
          },
          {
            id: 'reading-comprehension-tests',
            title: 'اختبارات استيعاب المقروء',
            description: 'مجموعة من الاختبارات التدريبية في استيعاب المقروء',
            icon: BookOpen,
            gradient: 'from-blue-500 to-cyan-500',
            tests: [
              {
                id: 'reading-comprehension-test-1',
                title: 'اختبار استيعاب المقروء - ١',
                description: 'اختبار استيعاب المقروء الجزء الأول',
                googleFormUrl: 'https://docs.google.com/forms/d/1iOSHzVdG09-0gnmlU9AikXao2snCPBM0wxyVOAHEwoQ/edit',
                isActive: true
              },
              {
                id: 'reading-comprehension-test-2',
                title: 'اختبار استيعاب المقروء - ٢',
                description: 'اختبار استيعاب المقروء الجزء الثاني',
                googleFormUrl: 'https://docs.google.com/forms/d/1rFL73jVGcy9v7bD1wKLC-fPKhgfB34kJTazRv5yBC_s/edit',
                isActive: true
              },
              {
                id: 'reading-comprehension-test-3',
                title: 'اختبار استيعاب المقروء - ٣',
                description: 'اختبار استيعاب المقروء الجزء الثالث',
                googleFormUrl: 'https://docs.google.com/forms/d/1-A6PHfnyQSgQN9zn6eVeOgs1UFO1JMjNvpH_m_KIdto/viewform?edit_requested=true',
                isActive: true
              }
            ]
          },
          {
            id: 'odd-word-tests',
            title: 'اختبارات المفردة الشاذة',
            description: 'مجموعة من الاختبارات التدريبية في المفردة الشاذة',
            icon: Asterisk,
            gradient: 'from-yellow-500 to-orange-500',
            tests: [
              {
                id: 'odd-word-test-1',
                title: 'اختبار المفردة - ١',
                description: 'اختبار المفردة الشاذة الجزء الأول',
                googleFormUrl: 'https://forms.gle/SMg6hXtWW2SfguMu9',
                isActive: true
              },
              {
                id: 'odd-word-test-2',
                title: 'اختبار المفردة - ٢',
                description: 'اختبار المفردة الشاذة الجزء الثاني',
                googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLScSmtmIShgiHPQfqgnoQ129pGmQsKZvJAwJcHkqfEWgr7nwNQ/formResponse',
                isActive: true
              },
              {
                id: 'odd-word-test-3',
                title: 'اختبار المفردة - ٣',
                description: 'اختبار المفردة الشاذة الجزء الثالث',
                googleFormUrl: 'https://forms.gle/u4hcJ7YJSpHKit6j7',
                isActive: true
              }
            ]
          }
        ]
      }
    ];

    return courses.find(course => course.id === id) || null;
  };

  const course = getCourseById(courseId || 'the-last-dance');

  // If course not found, show error or redirect
  if (!course) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">الدورة غير موجودة</h1>
            <Button onClick={() => navigate('/courses')}>
              العودة للدورات
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const handleEnrollment = () => {
    if (!user) {
      // إذا لم يكن المستخدم مسجل دخول، أظهر رسالة وأعد توجيهه إلى صفحة تسجيل الدخول
      toast.error("يجب تسجيل الدخول أولاً للاشتراك في الدورة");
      navigate('/login', { state: { from: `/courses/${courseId}` } });
      return;
    }

    // إذا كان المستخدم مسجل دخول، قم بالاشتراك
    setIsLoading(true);

    // تسجيل محلي
    enrollInCourse(course.id);

    // تسجيل في قاعدة البيانات
    enrollUserInCourse(course.id, user.id)
      .then(success => {
        if (success) {
          // تحديث عدد المشتركين فوراً
          // Enrollment successful

          toast.success("تم الاشتراك في الدورة بنجاح!");
        } else {
          toast.error("حدث خطأ أثناء الاشتراك، يرجى المحاولة مرة أخرى");
        }
      })
      .catch(error => {
        console.error('Error enrolling in course:', error);
        toast.error("حدث خطأ أثناء الاشتراك، يرجى المحاولة مرة أخرى");
      })
      .finally(() => {
        setIsLoading(false);
        setEnrolled(true);
      });
  };

  const handleStartLearning = () => {
    if (courseId) {
      // استخدام الدالة الجديدة للحصول على الدرس التالي غير المكتمل
      const nextLessonId = getNextUncompletedLesson(courseId);

      // التنقل إلى الدرس التالي غير المكتمل
      navigate(`/courses/${courseId}/lesson/${nextLessonId}`);
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <PlayCircle className="w-4 h-4 text-blue-500" />;
      case 'pdf':
        return <FileDown className="w-4 h-4 text-green-500" />;
      case 'test':
        return <Trophy className="w-4 h-4 text-orange-500" />;
      default:
        return <PlayCircle className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'video':
        return 'فيديو';
      case 'pdf':
        return 'ملف PDF';
      case 'test':
        return 'اختبار';
      default:
        return 'محتوى';
    }
  };

  return (
    <Layout>
      <SEO
        title={`${course.title} - Our Goal`}
        description={course.description}
      />

      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8 md:mb-12"
          >
            <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
              {/* Course Info */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
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
                    <span className="text-sm text-muted-foreground">تفاصيل الدورة</span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${course.gradient} flex items-center justify-center shadow-lg`}>
                      <course.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-2 flex items-center gap-2">
                        {course.title}
                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 px-3 py-1 text-sm font-bold">
                          مجاني 100% 🎉
                        </Badge>
                      </h1>
                      <div className="text-sm text-gray-400 mb-4">{course.description}</div>
                    </div>
                  </div>

                  {/* Course Image with Enhanced Design */}
                  <div className="relative mb-8 overflow-hidden rounded-2xl shadow-xl">
                    <div className={`absolute inset-0 bg-gradient-to-r ${course.gradient} opacity-10 z-0`}></div>
                    <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${course.gradient}`}></div>
                    <div className="relative z-10">
                      <div className="aspect-video overflow-hidden">
                        <img
                          src="/photo_٢٠٢٥-٠٦-١٤_١٨-٣٣-٤٢.jpg"
                          alt="The Last Dance - دورة التأسيس اللفظي الشاملة"
                          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-16">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${course.gradient} flex items-center justify-center shadow-lg`}>
                              <course.icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="text-white font-bold text-lg">{course.title}</h3>
                            </div>
                          </div>
                          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 px-3 py-1">
                            مجاني 100% 🎉
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Course Stats - Moved to after the image */}
                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 mb-6">
                    <div className={`p-4 rounded-xl bg-gradient-to-br ${course.bgGradient} border ${course.borderColor}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${course.gradient} flex items-center justify-center shadow-lg`}>
                          <Clock className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">المدة</div>
                          <div className="font-bold">{course.duration}</div>
                        </div>
                      </div>
                    </div>
                    <div className={`p-4 rounded-xl bg-gradient-to-br ${course.bgGradient} border ${course.borderColor}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${course.gradient} flex items-center justify-center shadow-lg`}>
                          <Video className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">الدروس</div>
                          <div className="font-bold">{course.lessons} درس</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Enrollment Card */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="sticky top-8"
                >
                  <Card className={`bg-gradient-to-br ${course.bgGradient} border-0 ${course.borderColor} rounded-3xl backdrop-blur-xl shadow-xl`}>
                    <CardContent className="p-6 md:p-8">
                      {/* Free Badge */}
                      <div className="text-center mb-6">
                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 px-4 md:px-6 py-2 text-base md:text-lg font-bold">
                          مجاني 100% 🎉
                        </Badge>
                      </div>



                      {/* Materials Count */}
                      <div className={`grid gap-3 md:gap-4 mb-6 ${
                        [course.hasVideos, course.hasPdfs, course.hasTests].filter(Boolean).length === 3 ? 'grid-cols-3' :
                        [course.hasVideos, course.hasPdfs, course.hasTests].filter(Boolean).length === 2 ? 'grid-cols-2' :
                        'grid-cols-1'
                      }`}>
                        {course.hasVideos && (
                          <div className="text-center p-3 bg-background/50 rounded-xl">
                            <Video className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-2 text-blue-500" />
                            <div className="font-bold text-foreground">{course.materials.videos}</div>
                            <div className="text-xs md:text-sm text-muted-foreground">فيديو</div>
                          </div>
                        )}
                        {course.hasPdfs && (
                          <div className="text-center p-3 bg-background/50 rounded-xl">
                            <FileText className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-2 text-green-500" />
                            <div className="font-bold text-foreground">{course.materials.pdfs}</div>
                            <div className="text-xs md:text-sm text-muted-foreground">ملف PDF</div>
                          </div>
                        )}
                        {course.hasTests && (
                          <div className="text-center p-3 bg-background/50 rounded-xl">
                            <TestTube className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-2 text-orange-500" />
                            <div className="font-bold text-foreground">{course.materials.tests}</div>
                            <div className="text-xs md:text-sm text-muted-foreground">اختبار</div>
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      {enrolled ? (
                        <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">التقدم</span>
                            <span className="font-medium text-primary">{courseProgress}%</span>
                          </div>
                          <div className="h-2 rounded-full overflow-hidden bg-primary/10">
                            <motion.div
                              className={`h-full rounded-full bg-gradient-to-r ${course.gradient}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${courseProgress}%` }}
                              transition={{ duration: 1.5 }}
                            />
                          </div>
                          <div className="flex justify-between items-center mt-4">
                            <div className="text-sm text-muted-foreground">
                              <span className="font-medium text-primary">{completedLessons}</span> من {course.lessons} درس مكتمل
                            </div>
                            {courseProgress === 100 ? (
                              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 px-3 py-1.5">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                تم إكمال الدورة
                              </Badge>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleStartLearning}
                                className="text-primary hover:text-primary/80"
                              >
                                <Play className="w-4 h-4 ml-2" />
                                متابعة التعلم
                              </Button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <Button
                          onClick={handleEnrollment}
                          disabled={isLoading}
                          className={`w-full bg-gradient-to-r ${course.gradient} hover:shadow-lg hover:scale-105 transition-all duration-300 text-white border-0 rounded-xl py-6 font-semibold`}
                        >
                          {isLoading ? (
                            <>
                              <span>جاري التسجيل...</span>
                            </>
                          ) : (
                            <>
                              <span>اشترك الآن</span>
                              <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                            </>
                          )}
                        </Button>
                      )}

                      {/* Features List */}
                      <div className="mt-6 pt-6 border-t border-border/50">
                        <h4 className="font-semibold text-foreground mb-3">ما ستحصل عليه:</h4>
                        <div className="space-y-2">
                          {getDynamicFeatures(course).map((feature, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span className="text-muted-foreground">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Technical Support Button */}
                      <div className="mt-6 pt-6 border-t border-border/50">
                        <Button
                          onClick={() => window.open('https://t.me/Our_goal_support_bot', '_blank')}
                          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 hover:shadow-lg hover:scale-105 transition-all duration-300 text-white border-0 rounded-xl py-6 font-semibold"
                        >
                          <div className="flex items-center justify-center gap-2">
                            <Headphones className="w-5 h-5" />
                            <span>الدعم الفني للدورة</span>
                          </div>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Modern Tabs Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-12 md:mb-16"
          >
            {/* Custom Tab Navigation */}
            <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-8 md:mb-12">
              {[
                { id: 'overview', label: 'نظرة عامة', icon: Target, color: 'from-blue-500 to-cyan-500' },
                { id: 'curriculum', label: 'المنهج التفصيلي', icon: Video, color: 'from-purple-500 to-pink-500' },
                { id: 'files', label: 'الملفات', icon: FileDown, color: 'from-green-500 to-emerald-500' },
                ...(course.hasTests ? [{ id: 'mock-tests', label: 'الاختبارات', icon: TestTube, color: 'from-orange-500 to-red-500' }] : []),
                { id: 'features', label: 'الميزات والفوائد', icon: Sparkles, color: 'from-green-500 to-emerald-500' }
              ].map((tab, index) => (
                <motion.button
                  key={tab.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group relative px-6 md:px-8 py-3 md:py-4 rounded-2xl font-semibold transition-all duration-300 ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-lg scale-105`
                      : 'bg-card/50 text-muted-foreground hover:bg-card hover:text-foreground hover:scale-105'
                  } backdrop-blur-sm border border-border/50`}
                >
                  <div className="flex items-center gap-2 md:gap-3">
                    <tab.icon className="w-5 h-5" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                  </div>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="space-y-6 md:space-y-8">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-6 md:space-y-8"
                >
                  {/* Hero Cards Grid */}
                  <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
                    {/* Course Description Card */}
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="lg:col-span-2"
                    >
                      <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-3xl overflow-hidden relative">
                        <div className="absolute top-4 right-4 opacity-20">
                          <Target className="w-16 h-16 md:w-20 md:h-20 text-blue-500" />
                        </div>
                        <CardHeader className="relative z-10">
                          <CardTitle className="flex items-center gap-3 text-xl md:text-2xl">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                              <Target className="w-5 h-5 md:w-6 md:h-6 text-white" />
                            </div>
                            نظرة عامة عن الدورة
                          </CardTitle>
                          <p className="mt-2 text-muted-foreground text-sm md:text-base">
                            دورة تأسيسية متخصصة في القدرات اللفظية، مصممة لتكون رحلتك الأخيرة نحو الإتقان الكامل. تغطي جميع أنواع الأسئلة اللفظية بطريقة عملية ومبسطة مع استراتيجيات متقدمة للحل السريع والدقيق.
                          </p>
                        </CardHeader>
                        <CardContent className="relative z-10">
                          {/* Removed the long description paragraph from here as well */}
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Quick Stats Card */}
                    <motion.div
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-3xl overflow-hidden relative">
                        <div className="absolute top-4 right-4 opacity-20">
                          <BarChart3 className="w-16 h-16 md:w-20 md:h-20 text-purple-500" />
                        </div>
                        <CardHeader className="relative z-10">
                          <CardTitle className="flex items-center gap-3">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                              <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-white" />
                            </div>
                            إحصائيات سريعة
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                          <div className="grid grid-cols-2 gap-3 md:gap-4">
                            <div className="text-center p-3 md:p-4 bg-background/50 rounded-2xl">
                              <div className="text-2xl md:text-3xl font-bold text-purple-600 mb-1">{course.lessons}</div>
                              <div className="text-xs md:text-sm text-muted-foreground">درس</div>
                            </div>
                            <div className="text-center p-3 md:p-4 bg-background/50 rounded-2xl">
                              <div className="text-2xl md:text-3xl font-bold text-purple-600 mb-1">100%</div>
                              <div className="text-xs md:text-sm text-muted-foreground">مجاني</div>
                            </div>
                            <div className="text-center p-3 md:p-4 bg-background/50 rounded-2xl">
                              <div className="text-2xl md:text-3xl font-bold text-purple-600 mb-1">{course.materials.videos}</div>
                              <div className="text-xs md:text-sm text-muted-foreground">فيديو</div>
                            </div>
                            <div className="text-center p-3 md:p-4 bg-background/50 rounded-2xl">
                              <div className="text-2xl md:text-3xl font-bold text-purple-600 mb-1">{course.materials.pdfs}</div>
                              <div className="text-xs md:text-sm text-muted-foreground">ملف PDF</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>

                  {/* Learning Outcomes */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-3xl overflow-hidden relative">
                      <div className="absolute top-4 right-4 opacity-20">
                        <Trophy className="w-16 h-16 md:w-20 md:h-20 text-green-500" />
                      </div>
                      <CardHeader className="relative z-10">
                        <CardTitle className="flex items-center gap-3 text-xl md:text-2xl">
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                            <Trophy className="w-5 h-5 md:w-6 md:h-6 text-white" />
                          </div>
                          ما ستحققه من هذه الدورة
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="relative z-10">
                        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                          {course.outcomes.map((outcome, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                              className="flex items-start gap-3 md:gap-4 p-3 md:p-4 bg-background/50 rounded-2xl"
                            >
                              <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-white" />
                              </div>
                              <span className="text-sm md:text-base text-muted-foreground leading-relaxed">{outcome}</span>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Requirements */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                  >
                    <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-3xl overflow-hidden relative">
                      <div className="absolute top-4 right-4 opacity-20">
                        <Zap className="w-16 h-16 md:w-20 md:h-20 text-orange-500" />
                      </div>
                      <CardHeader className="relative z-10">
                        <CardTitle className="flex items-center gap-3 text-xl md:text-2xl">
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                            <Zap className="w-5 h-5 md:w-6 md:h-6 text-white" />
                          </div>
                          المتطلبات
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="relative z-10">
                        <div className="grid md:grid-cols-2 gap-3 md:gap-4">
                          {course.requirements.map((requirement, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.4, delay: 1.0 + index * 0.1 }}
                              className="flex items-center gap-2 md:gap-3 p-3 bg-background/50 rounded-xl"
                            >
                              <div className="w-2 h-2 md:w-3 md:h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex-shrink-0" />
                              <span className="text-sm md:text-base text-muted-foreground">{requirement}</span>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              )}

              {/* Curriculum Tab */}
              {activeTab === 'curriculum' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-3xl overflow-hidden relative">
                    <div className="absolute top-4 right-4 opacity-20">
                      <BookOpen className="w-16 h-16 md:w-20 md:h-20 text-purple-500" />
                    </div>
                    <CardHeader className="relative z-10">
                      <CardTitle className="flex items-center gap-3 text-xl md:text-2xl">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                          <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        </div>
                        المنهج التفصيلي للدورة
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="space-y-4 md:space-y-6">
                        {course.sections.map((section, index) => (
                          <motion.div
                            key={section.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="bg-background/50 rounded-2xl overflow-hidden"
                          >
                            <Accordion type="single" collapsible className="w-full">
                              <AccordionItem value={section.id} className="border-none">
                                <AccordionTrigger className="px-4 md:px-6 py-4 hover:no-underline focus:no-underline">
                                  <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                                      <span className="text-lg md:text-xl font-bold text-white">{index + 1}</span>
                                    </div>
                                    <div>
                                      <h3 className="text-base md:text-lg font-semibold mb-1">{section.title}</h3>
                                      <p className="text-sm text-muted-foreground">
                                        {section.lessons.length} دروس
                                      </p>
                                    </div>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-4 md:px-6 pb-4">
                                  <div className="space-y-4">
                                    {section.lessons.map((lesson) => (
                                      <div
                                        key={lesson.id}
                                        className="flex items-center justify-between p-4 bg-background/50 rounded-xl"
                                      >
                                        <div className="flex items-center gap-3">
                                          <div className={`w-8 h-8 rounded-lg ${isLessonCompleted(course.id, lesson.id) ? 'bg-green-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'} flex items-center justify-center`}>
                                            {isLessonCompleted(course.id, lesson.id) ? (
                                              <CheckCircle className="w-4 h-4 text-white" />
                                            ) : (
                                              <Play className="w-4 h-4 text-white" />
                                            )}
                                          </div>
                                          <div>
                                            <h4 className="font-medium">{lesson.title}</h4>
                                            <p className="text-sm text-muted-foreground">{lesson.duration}</p>
                                          </div>
                                        </div>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => {
                                            navigate(`/courses/${course.id}/lesson/${lesson.id}`);
                                          }}
                                          className="flex items-center gap-2"
                                        >
                                          <Play className="w-4 h-4" />
                                          مشاهدة الدرس
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Files Tab */}
              {activeTab === 'files' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-3xl overflow-hidden relative">
                    <div className="absolute top-4 right-4 opacity-20">
                      <FileDown className="w-16 h-16 md:w-20 md:h-20 text-green-500" />
                    </div>
                    <CardHeader className="relative z-10">
                      <CardTitle className="flex items-center gap-3 text-xl md:text-2xl">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                          <FileDown className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        </div>
                        ملفات الدورة
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="space-y-4">
                        {course.sections.map((section, index) => (
                          section.curriculumFile && (
                            <motion.div
                              key={section.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4, delay: index * 0.1 }}
                              className="flex items-center justify-between p-4 bg-background/50 rounded-xl"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                                  <FileDown className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                  <h4 className="font-medium">{section.curriculumFile.title}</h4>
                                  <p className="text-sm text-muted-foreground">{section.curriculumFile.size}</p>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(section.curriculumFile?.url, '_blank')}
                                className="flex items-center gap-2"
                              >
                                <FileDown className="w-4 h-4" />
                                تحميل
                              </Button>
                            </motion.div>
                          )
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Mock Tests Tab */}
              {activeTab === 'mock-tests' && course.hasTests && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-3xl overflow-hidden relative">
                    <div className="absolute top-4 right-4 opacity-20">
                      <TestTube className="w-16 h-16 md:w-20 md:h-20 text-orange-500" />
                    </div>
                    <CardHeader className="relative z-10">
                      <CardTitle className="flex items-center gap-3 text-xl md:text-2xl">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                          <TestTube className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        </div>
                        الاختبارات
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {course.testSections.map((section) => (
                          <Accordion type="single" collapsible key={section.id} className="w-full">
                            <AccordionItem value={section.id} className="border-none">
                              <AccordionTrigger
                                className="px-6 py-6 rounded-2xl mb-2 text-lg font-bold bg-background/70 flex items-center gap-4 transition-all duration-200 hover:no-underline focus:no-underline hover:bg-orange-100/60 hover:shadow-lg hover:scale-105"
                              >
                                <section.icon className="w-8 h-8 text-orange-500" />
                                <span>{section.title}</span>
                              </AccordionTrigger>
                              <AccordionContent className="px-4 pb-4">
                                <div className="space-y-3">
                                  {section.tests.map((test) => (
                                    <div key={test.id} className="flex items-center justify-between p-3 bg-background/50 rounded-xl">
                                      <div>
                                        <h4 className="font-medium">{test.title}</h4>
                                        <p className="text-sm text-muted-foreground">{test.description}</p>
                                      </div>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => window.open(test.googleFormUrl, '_blank')}
                                        disabled={!test.isActive}
                                        className="flex items-center gap-2"
                                      >
                                        <Play className="w-4 h-4" />
                                        ابدأ الاختبار
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Features Tab */}
              {activeTab === 'features' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-3xl overflow-hidden relative">
                    <div className="absolute top-4 right-4 opacity-20">
                      <Sparkles className="w-16 h-16 md:w-20 md:h-20 text-green-500" />
                    </div>
                    <CardHeader className="relative z-10">
                      <CardTitle className="flex items-center gap-3 text-xl md:text-2xl">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                          <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        </div>
                        الميزات والفوائد
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                        {getDynamicFeatures(course).map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="flex items-start gap-3 md:gap-4 p-4 bg-background/50 rounded-2xl"
                        >
                            <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                              <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-white" />
                          </div>
                            <span className="text-sm md:text-base text-muted-foreground leading-relaxed">{feature}</span>
                        </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default CourseDetails;
