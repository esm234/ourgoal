import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users,
  BookOpen,
  TrendingUp,
  Eye,
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
  Calendar,
  Mail,
  User
} from 'lucide-react';
import { getEnrollmentStats } from '@/utils/analytics';

interface EnrollmentData {
  courseId: string;
  courseName: string;
  userEmail: string;
  timestamp: string;
}

interface CourseStats {
  count: number;
  users: string[];
}

interface StatsData {
  total: number;
  courses: Record<string, CourseStats>;
}

const EnrollmentStats: React.FC = () => {
  const [stats, setStats] = useState<StatsData>({ total: 0, courses: {} });
  const [enrollmentHistory, setEnrollmentHistory] = useState<EnrollmentData[]>([]);
  const [loading, setLoading] = useState(true);

  // Course names mapping
  const courseNames: Record<string, string> = {
    'the-last-dance': 'The Last Dance - دورة التأسيس اللفظي',
    'after-qudurat': 'ما بعد القدرات',
    'quantitative-course': 'الدورة الكمية'
  };

  const loadStats = () => {
    setLoading(true);
    try {
      // Get stats from analytics utility
      const statsData = getEnrollmentStats();
      setStats(statsData);

      // Get detailed enrollment history from localStorage
      const enrollments = localStorage.getItem('clarity_enrollments');
      if (enrollments) {
        const data: EnrollmentData[] = JSON.parse(enrollments);
        setEnrollmentHistory(data.reverse()); // Show newest first
      }
    } catch (error) {
      console.error('Error loading enrollment stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportData = () => {
    const dataStr = JSON.stringify(enrollmentHistory, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `enrollment-stats-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">جاري تحميل الإحصائيات...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO 
        title="إحصائيات التسجيل في الكورسات - Our Goal"
        description="عرض إحصائيات المستخدمين المسجلين في الكورسات"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  إحصائيات التسجيل في الكورسات
                </h1>
                <p className="text-muted-foreground">
                  تتبع المستخدمين المسجلين في الكورسات باستخدام Microsoft Clarity
                </p>
              </div>
              <div className="flex gap-3">
                <Button onClick={loadStats} variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 ml-2" />
                  تحديث
                </Button>
                <Button onClick={exportData} variant="outline" size="sm">
                  <Download className="w-4 h-4 ml-2" />
                  تصدير البيانات
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Overview Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid md:grid-cols-3 gap-6 mb-8"
          >
            {/* Total Enrollments */}
            <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  إجمالي التسجيلات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 mb-2">{stats.total}</div>
                <p className="text-sm text-muted-foreground">تسجيل إجمالي</p>
              </CardContent>
            </Card>

            {/* Active Courses */}
            <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  الكورسات النشطة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {Object.keys(stats.courses).length}
                </div>
                <p className="text-sm text-muted-foreground">كورس نشط</p>
              </CardContent>
            </Card>

            {/* Unique Users */}
            <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  المستخدمون الفريدون
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {new Set(enrollmentHistory.map(e => e.userEmail)).size}
                </div>
                <p className="text-sm text-muted-foreground">مستخدم فريد</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Course Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <BarChart3 className="w-6 h-6 text-primary" />
                  إحصائيات الكورسات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(stats.courses).map(([courseId, courseStats]) => (
                    <div key={courseId} className="p-4 bg-muted/50 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-foreground">
                          {courseNames[courseId] || courseId}
                        </h3>
                        <Badge variant="secondary">
                          {courseStats.count} تسجيل
                        </Badge>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">عدد التسجيلات:</p>
                          <p className="text-2xl font-bold text-primary">{courseStats.count}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">المستخدمون الفريدون:</p>
                          <p className="text-2xl font-bold text-primary">{courseStats.users.length}</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm text-muted-foreground mb-2">المستخدمون:</p>
                        <div className="flex flex-wrap gap-2">
                          {courseStats.users.slice(0, 5).map((email, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {email === 'anonymous' ? 'مجهول' : email}
                            </Badge>
                          ))}
                          {courseStats.users.length > 5 && (
                            <Badge variant="outline" className="text-xs">
                              +{courseStats.users.length - 5} أكثر
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Enrollments */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-primary" />
                  التسجيلات الأخيرة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {enrollmentHistory.slice(0, 10).map((enrollment, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {courseNames[enrollment.courseId] || enrollment.courseId}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="w-3 h-3" />
                            <span>{enrollment.userEmail === 'anonymous' ? 'مجهول' : enrollment.userEmail}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(enrollment.timestamp)}
                      </div>
                    </motion.div>
                  ))}
                  {enrollmentHistory.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>لا توجد تسجيلات حتى الآن</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Microsoft Clarity Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-8"
          >
            <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Eye className="w-6 h-6 text-orange-500" />
                  <h3 className="text-lg font-semibold">معلومات التتبع</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  يتم تتبع التسجيلات باستخدام Microsoft Clarity وحفظها محلياً كنسخة احتياطية. 
                  للحصول على تحليلات أكثر تفصيلاً، يمكنك زيارة لوحة تحكم Microsoft Clarity.
                </p>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open('https://clarity.microsoft.com', '_blank')}
                  >
                    <Eye className="w-4 h-4 ml-2" />
                    فتح Microsoft Clarity
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      if (window.clarity) {
                        console.log('Microsoft Clarity is active');
                      } else {
                        console.log('Microsoft Clarity is not loaded');
                      }
                    }}
                  >
                    <PieChart className="w-4 h-4 ml-2" />
                    اختبار الاتصال
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default EnrollmentStats;
