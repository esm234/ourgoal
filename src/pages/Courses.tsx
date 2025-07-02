import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Clock,
  Play,
  CheckCircle,
  Video,
  FileText,
  TestTube,
  Sparkles,
  Target,
  Brain,
  BarChart3,
  ArrowRight,
  Users
} from 'lucide-react';
import {
  getTotalProgressPercentage,
  isEnrolledInCourse,
  getNextUncompletedLesson
} from '@/utils/courseProgress';
import { getEnrollmentCount } from '@/services/courseEnrollment';

interface Course {
  id: string;
  title: string;
  description: string;
  type: 'verbal' | 'quantitative' | 'comprehensive';
  duration: string;
  lessons: number;
  skills: string[];
  progress?: number;
  isEnrolled?: boolean;
  enrollmentCount?: number;
  color: string;
  icon: any;
  gradient: string;
  bgGradient: string;
  borderColor: string;
  hasVideos: boolean;
  hasPdfs: boolean;
  hasTests: boolean;
  materials: {
    videos: number;
    pdfs: number;
    tests: number;
  };
}

// Courses data will be defined inside component

const Courses: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();
  const [courseProgress, setCourseProgress] = useState(0);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentCounts, setEnrollmentCounts] = useState<{[key: string]: number}>({});

  // Load progress from localStorage and enrollment counts from database
  useEffect(() => {
    const progress = getTotalProgressPercentage('the-last-dance');
    const enrolled = isEnrolledInCourse('the-last-dance');

    setCourseProgress(progress);
    setIsEnrolled(enrolled);

    // Fetch enrollment counts for all courses
    const fetchEnrollmentCounts = async () => {
      try {
        const courseIds = ['the-last-dance', 'after-qudurat'];
        const counts: {[key: string]: number} = {};

        for (const id of courseIds) {
          console.log(`Fetching enrollment count in Courses page for course: ${id}`);
          const count = await getEnrollmentCount(id);
          console.log(`Courses page: Enrollment count for ${id}:`, count);
          counts[id] = count;
        }

        console.log('Courses page: All enrollment counts:', counts);
        setEnrollmentCounts(counts);
      } catch (err) {
        console.error("Error fetching enrollment counts:", err);
      }
    };

    fetchEnrollmentCounts();

    // Set up interval to refresh enrollment counts every 10 seconds
    const intervalId = setInterval(fetchEnrollmentCounts, 10000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Course data with dynamic progress
  const courses: Course[] = [
    {
      id: 'the-last-dance',
      title: 'The Last Dance',
      description: 'دورة التأسيس اللفظي الشاملة - رحلتك الأخيرة نحو إتقان القدرات اللفظية',
      type: 'verbal',
      duration: '6 ساعات',
      lessons: 8,
      skills: ['التناظر اللفظي', 'الخطأ السياقي', 'إكمال الجمل', 'استيعاب المقروء', 'المفردة الشاذة'],
      hasVideos: true,
      hasPdfs: true,
      hasTests: true,
      progress: courseProgress,
      isEnrolled: isEnrolled,
      enrollmentCount: enrollmentCounts['the-last-dance'] || 0,
      color: 'gradient',
      icon: Sparkles,
      gradient: 'from-purple-600 via-pink-600 to-red-600',
      bgGradient: 'from-purple-600/10 via-pink-600/10 to-red-600/10',
      borderColor: 'border-purple-500/30',
      materials: {
        videos: 8,
        pdfs: 5,
        tests: 18
      }
    },
    {
      id: 'after-qudurat',
      title: 'ما بعد القدرات',
      description: 'دورة شاملة لتوجيهك نحو المسار المناسب بعد اجتياز اختبار القدرات العامة',
      type: 'comprehensive',
      duration: 'قريباً',
      lessons: 0,
      skills: ['التخطيط المهني', 'اختيار التخصص', 'التحضير للجامعة', 'بناء المستقبل'],
      hasVideos: true,
      hasPdfs: false,
      hasTests: false,
      progress: 0,
      isEnrolled: false,
      enrollmentCount: enrollmentCounts['after-qudurat'] || 0,
      color: 'gradient',
      icon: Target,
      gradient: 'from-indigo-600 via-purple-600 to-pink-600',
      bgGradient: 'from-indigo-600/10 via-purple-600/10 to-pink-600/10',
      borderColor: 'border-indigo-500/30',
      materials: {
        videos: 0,
        pdfs: 0,
        tests: 0
      }
    }
  ];

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

    return features;
  };

  const categories = [
    { id: 'all', name: 'جميع الدورات', icon: Sparkles }
  ];

  const filteredCourses = selectedCategory === 'all'
    ? courses
    : courses.filter(course => course.type === selectedCategory);

  return (
    <Layout>
      <SEO
        title="الدورات التدريبية - Our Goal"
        description="دورات شاملة للقدرات اللفظية والكمية مجانية ومتطورة"
      />

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl rounded-full"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <div className="relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-primary to-accent rounded-3xl flex items-center justify-center shadow-2xl"
                >
                  <Sparkles className="w-12 h-12 text-white" />
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-6"
                >
                دورات Our goal
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
                >
                  <span className="text-primary font-semibold">100% مجاني • بدون رسوم • محتوى حصري</span>
                </motion.p>
              </div>
            </div>
          </motion.div>

          {/* Categories Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg scale-105'
                    : 'bg-card/50 text-muted-foreground hover:bg-card hover:text-foreground hover:scale-105'
                } backdrop-blur-sm border border-border/50`}
              >
                <category.icon className="w-5 h-5" />
                <span>{category.name}</span>
              </motion.button>
            ))}
          </motion.div>

          {/* Courses Grid */}
          <motion.div
            layout
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="group"
              >
                <Card className={`h-full bg-gradient-to-br ${course.bgGradient} border-0 ${course.borderColor} rounded-3xl backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden relative`}>
                  {/* Animated Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${course.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                  {/* Floating Elements */}
                  <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                    <course.icon className="w-16 h-16 text-current" />
                  </div>

                  <CardHeader className="relative z-10 pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${course.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <course.icon className="w-7 h-7 text-white" />
                      </div>
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 px-3 py-1">
                        مجاني 100%
                      </Badge>
                    </div>

                    <CardTitle className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300 flex items-center gap-2">
                      {course.title}
                      {course.id === 'after-qudurat' && (
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                          قريباً
                        </Badge>
                      )}
                    </CardTitle>

                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {course.description}
                    </p>
                  </CardHeader>

                  <CardContent className="relative z-10 space-y-6">
                    {/* Progress for enrolled courses */}
                    {course.isEnrolled && course.progress !== undefined && (
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">التقدم</span>
                          <span className="font-medium text-primary">{course.progress}%</span>
                        </div>
                        <div className={`h-2 rounded-full overflow-hidden ${course.color === 'blue' ? 'bg-blue-500/10' : course.color === 'green' ? 'bg-green-500/10' : 'bg-purple-500/10'}`}>
                          <motion.div
                            className={`h-full rounded-full ${
                              course.color === 'blue'
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                                : course.color === 'green'
                                ? 'bg-gradient-to-r from-green-500 to-green-600'
                                : 'bg-gradient-to-r from-purple-500 to-purple-600'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${course.progress}%` }}
                            transition={{ duration: 1.5, delay: index * 0.2 }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-background/50 rounded-xl">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Clock className="w-4 h-4 text-primary" />
                          <span className="text-xs text-muted-foreground">المدة</span>
                        </div>
                        <div className="font-bold text-foreground">{course.duration}</div>
                      </div>
                      <div className="text-center p-3 bg-background/50 rounded-xl">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Video className="w-4 h-4 text-primary" />
                          <span className="text-xs text-muted-foreground">الدروس</span>
                        </div>
                        <div className="font-bold text-foreground">{course.lessons}</div>
                      </div>
                    </div>

                    {/* Enrollment Count */}
                    <div className="text-center p-3 bg-background/50 rounded-xl">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="text-xs text-muted-foreground">المشتركين</span>
                      </div>
                      <div className="font-bold text-foreground">{course.enrollmentCount || 0}</div>
                    </div>

                    {/* Materials */}
                    <div className={`grid gap-2 ${
                      [course.hasVideos, course.hasPdfs, course.hasTests].filter(Boolean).length === 3 ? 'grid-cols-3' :
                      [course.hasVideos, course.hasPdfs, course.hasTests].filter(Boolean).length === 2 ? 'grid-cols-2' :
                      'grid-cols-1'
                    }`}>
                      {course.hasVideos && (
                        <div className="text-center p-2 bg-background/30 rounded-lg">
                          <Video className="w-4 h-4 mx-auto mb-1 text-blue-500" />
                          <div className="text-xs font-medium text-foreground">{course.materials.videos}</div>
                          <div className="text-xs text-muted-foreground">فيديو</div>
                        </div>
                      )}
                      {course.hasPdfs && (
                        <div className="text-center p-2 bg-background/30 rounded-lg">
                          <FileText className="w-4 h-4 mx-auto mb-1 text-green-500" />
                          <div className="text-xs font-medium text-foreground">{course.materials.pdfs}</div>
                          <div className="text-xs text-muted-foreground">ملف PDF</div>
                        </div>
                      )}
                      {course.hasTests && (
                        <div className="text-center p-2 bg-background/30 rounded-lg">
                          <TestTube className="w-4 h-4 mx-auto mb-1 text-orange-500" />
                          <div className="text-xs font-medium text-foreground">{course.materials.tests}</div>
                          <div className="text-xs text-muted-foreground">اختبار</div>
                        </div>
                      )}
                    </div>

                    {/* Features */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-foreground">ما ستتعلمه:</h4>
                      <div className="space-y-1">
                        {getDynamicFeatures(course).slice(0, 2).map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                        {getDynamicFeatures(course).length > 2 && (
                          <div className="text-xs text-primary">
                            +{getDynamicFeatures(course).length - 2} ميزة أخرى
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    {course.id === 'after-qudurat' ? (
                      <Button
                        className={`w-full bg-gradient-to-r ${course.gradient} hover:shadow-lg hover:scale-105 transition-all duration-300 text-white border-0 rounded-xl py-6 font-semibold cursor-default opacity-75`}
                        disabled
                      >
                        <span>قريباً</span>
                        <Sparkles className="w-4 h-4 mr-2" />
                      </Button>
                    ) : course.isEnrolled ? (
                      <div className="space-y-4">
                        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground">التقدم</span>
                            <span className="font-medium text-primary">{course.progress}%</span>
                          </div>
                          <div className="h-2 rounded-full overflow-hidden bg-primary/10">
                            <motion.div
                              className={`h-full rounded-full bg-gradient-to-r ${course.gradient}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${course.progress}%` }}
                              transition={{ duration: 1.5, delay: index * 0.2 }}
                            />
                          </div>

                          {/* إضافة شارة إكمال الدورة عند وصول التقدم إلى 100% */}
                          {course.progress === 100 && (
                            <div className="mt-3 flex justify-center">
                              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 px-3 py-1.5">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                تم إكمال الدورة
                              </Badge>
                            </div>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {course.progress < 100 && (
                            <Button
                              onClick={() => {
                                const nextLessonId = getNextUncompletedLesson(course.id);
                                navigate(`/courses/${course.id}/lesson/${nextLessonId}`);
                              }}
                              className={`bg-gradient-to-r ${course.gradient} hover:shadow-lg hover:scale-105 transition-all duration-300 text-white border-0`}
                            >
                              <Play className="w-4 h-4 ml-2" />
                              متابعة التعلم
                            </Button>
                          )}
                          <Button
                            onClick={() => navigate(`/courses/${course.id}`)}
                            variant="outline"
                            className={`border-primary/30 hover:bg-primary/10 transition-all duration-300 ${course.progress === 100 ? 'col-span-2' : ''}`}
                          >
                            عرض التفاصيل
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        onClick={() => navigate(`/courses/${course.id}`)}
                        className={`w-full bg-gradient-to-r ${course.gradient} hover:shadow-lg hover:scale-105 transition-all duration-300 text-white border-0 rounded-xl py-6 font-semibold`}
                      >
                        <span>عرض التفاصيل</span>
                        <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="mt-16"
          >
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/30 rounded-3xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5"></div>
              <CardContent className="relative z-10 p-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-primary to-accent rounded-3xl flex items-center justify-center shadow-2xl"
                >
                  <Brain className="w-10 h-10 text-white" />
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.4 }}
                  className="text-3xl font-bold text-foreground mb-4"
                >
                  ابدأ رحلتك التعليمية اليوم
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.6 }}
                  className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto"
                >
                  انضم إلى آلاف الطلاب الذين حققوا أهدافهم في اختبار القدرات مع دوراتنا المجانية المتخصصة
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.8 }}
                  className="flex flex-wrap gap-4 justify-center"
                >
                  <Button size="lg" className="px-8 py-4 bg-gradient-to-r from-primary to-accent hover:shadow-xl transition-all duration-300">
                    <Target className="w-5 h-5 mr-2" />
                    ابدأ التعلم الآن
                  </Button>
                  <Button variant="outline" size="lg" className="px-8 py-4 border-primary/30 hover:bg-primary/10 transition-all duration-300">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    اختبر مستواك
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Courses;
