import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Plus, PenLine, Clock, Users, BookOpen, Trophy, Star, ChevronRight, CheckCircle2 } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { testQuestions } from "@/data/testQuestions";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Test } from "@/types/testManagement";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Leaderboard from "@/components/Leaderboard";

interface TestType {
  id: string;
  title: string;
  description: string;
  numberOfQuestions: number;
  duration: number; // in minutes
  category?: 'sample' | 'user'; // Added category field
}

// Extended test type that includes numberOfQuestions
interface ExtendedTest extends Test {
  numberOfQuestions: number;
  questions: any[];
  category: 'sample' | 'user';
}

const mockTests: TestType[] = [
  {
    id: "test-1",
    title: "اختبار قياس تجريبي #1",
    description: "اختبار مختلط (لفظي وكمي) يحاكي اختبار القدرات العامة",
    numberOfQuestions: 50,
    duration: 75,
    category: 'sample',
  },
  {
    id: "test-2",
    title: "اختبار قياس تجريبي #2",
    description: "اختبار مختلط (لفظي وكمي) مع تركيز على الأسئلة اللفظية",
    numberOfQuestions: 50,
    duration: 75,
    category: 'sample',
  },
  {
    id: "test-3",
    title: "اختبار قياس تجريبي #3",
    description: "اختبار مختلط (لفظي وكمي) مع تركيز على الأسئلة الكمية",
    numberOfQuestions: 50,
    duration: 75,
    category: 'sample',
  },
  {
    id: "test-4",
    title: "اختبار قياس قصير #1",
    description: "اختبار سريع لتقييم مستواك الحالي",
    numberOfQuestions: 20,
    duration: 30,
    category: 'sample',
  },
  {
    id: "test-5",
    title: "اختبار قياس قصير #2",
    description: "اختبار سريع للتدرب على الأسئلة الأكثر صعوبة",
    numberOfQuestions: 20,
    duration: 30,
    category: 'sample',
  },
  {
    id: "test-6",
    title: "اختبار قياس كامل",
    description: "اختبار شامل يحاكي الاختبار الحقيقي بالكامل",
    numberOfQuestions: 100,
    duration: 150,
    category: 'sample',
  },
];

// Card variants for animation
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  })
};

const QiyasTests = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoggedIn, role } = useAuth();
  const [userTests, setUserTests] = useState<ExtendedTest[]>([]);
  const [sampleTests, setSampleTests] = useState<ExtendedTest[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("sample-tests");

  useEffect(() => {
    if (isLoggedIn) {
      fetchTests();
    } else {
      // If not logged in, still fetch published tests
      fetchTests();
    }
  }, [isLoggedIn]);

  const fetchTests = async () => {
    setLoading(true);
    try {
      // Only select the necessary fields and limit questions to just the count
      const { data, error } = await supabase
        .from("tests")
        .select(`
          id, 
          title, 
          description, 
          duration,
          category,
          published,
          questions:questions(id)
        `)
        .eq("published", true);

      if (error) throw error;

      // Map tests to include question count and ensure they have proper category
      const testsWithDetails = data.map(test => ({
        ...test,
        numberOfQuestions: test.questions?.length || 0,
        category: test.category || 'user' // Ensure category exists, default to 'user'
      })) as ExtendedTest[];

      // Filter tests by category
      const sampleTestsData = testsWithDetails.filter(test => test.category === 'sample');
      const userTestsData = testsWithDetails.filter(test => test.category !== 'sample');
      
      setUserTests(userTestsData);
      setSampleTests(sampleTestsData);
    } catch (error: any) {
      console.error("Error fetching tests:", error);
      toast({
        title: "خطأ في جلب الاختبارات",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = (testId: string) => {
    // Check if it's one of our static mock tests
    const testData = testQuestions.find(test => test.testId === testId);
    
    if (testData) {
      navigate(`/qiyas-tests/${testId}`);
    } else {
      // Otherwise, try to find it in our database tests
      const dbTest = [...sampleTests, ...userTests].find(test => test.id === testId);
      
      if (dbTest) {
        navigate(`/qiyas-tests/${testId}`);
      } else {
        toast({
          title: "قريباً",
          description: "سيتم إطلاق هذا الاختبار التجريبي قريباً",
        });
      }
    }
  };

  const handleEditTest = (testId: string) => {
    // We now allow editing all tests if admin
    navigate(`/test-management/${testId}/edit`);
  };

  // Get difficulty badge color
  const getDifficultyColor = (testId: string) => {
    if (testId === "test-6") return "bg-red-500/20 text-red-500 border-red-600/20";
    if (testId.includes("5")) return "bg-orange-500/20 text-orange-500 border-orange-600/20";
    if (testId.includes("4")) return "bg-yellow-500/20 text-yellow-500 border-yellow-600/20";
    return "bg-green-500/20 text-green-500 border-green-600/20";
  };

  // Get test card gradient based on id
  const getCardGradient = (testId: string) => {
    if (testId === "test-6") return "from-blue-950/40 to-indigo-900/40";
    if (testId.includes("5")) return "from-indigo-950/40 to-purple-900/40";
    if (testId.includes("4")) return "from-purple-950/40 to-fuchsia-900/40";
    if (testId.includes("3")) return "from-emerald-950/40 to-teal-900/40";
    if (testId.includes("2")) return "from-sky-950/40 to-blue-900/40";
    return "from-violet-950/40 to-indigo-900/40";
  };

  const TestCard = ({ test, index, isUserTest = false }: { test: TestType | ExtendedTest, index: number, isUserTest?: boolean }) => {
    // Add a state for the leaderboard dialog
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    
    return (
      <motion.div
        custom={index} 
        initial="hidden" 
        animate="visible" 
        variants={cardVariants}
        className="h-full"
      >
        <Card className={`overflow-hidden border border-white/10 bg-gradient-to-br ${getCardGradient(test.id)} hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 h-full group relative`}>
          <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:radial-gradient(ellipse_at_center,white_20%,transparent_75%)]"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/60 to-primary/20"></div>
          
          <CardContent className="p-6 relative">
            <div className="flex justify-between items-start mb-3">
              <Badge variant="outline" className={`${getDifficultyColor(test.id)} px-2 py-1 text-xs`}>
                {test.numberOfQuestions >= 50 
                  ? "اختبار كامل" 
                  : test.numberOfQuestions >= 30 
                    ? "اختبار متوسط" 
                    : "اختبار قصير"}
              </Badge>
              
              <div className="flex items-center gap-2">
                {/* Add Leaderboard button */}
                <Dialog open={showLeaderboard} onOpenChange={setShowLeaderboard}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-amber-400 hover:text-amber-300 hover:bg-amber-950/30"
                    >
                      <Trophy className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-800/95 border-gray-700 text-white">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-amber-400" />
                        المتصدرون في {test.title}
                      </DialogTitle>
                      <DialogDescription className="text-gray-400">
                        أفضل 5 طلاب في هذا الاختبار
                      </DialogDescription>
                    </DialogHeader>
                    <Leaderboard testId={test.id} />
                  </DialogContent>
                </Dialog>
                
                {isLoggedIn && role === "admin" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditTest(test.id)}
                    className="text-muted-foreground hover:text-primary"
                  >
                    <PenLine className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            
            <h3 className="text-xl font-bold mb-2 text-white group-hover:text-primary transition-colors duration-300">{test.title}</h3>
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{test.description}</p>
            
            <div className="flex flex-wrap gap-4 mb-5">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                  <BookOpen className="h-3.5 w-3.5 text-primary" />
                </div>
                <span>{test.numberOfQuestions} سؤال</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                </div>
                <span>{test.duration} دقيقة</span>
              </div>
            </div>
            
            <Button
              className="w-full bg-primary/90 hover:bg-primary group-hover:translate-y-0 translate-y-0 transition-all duration-300 overflow-hidden relative"
              onClick={() => handleStartTest(test.id)}
            >
              <span className="relative z-10 flex items-center gap-2">
                ابدأ الاختبار
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <Layout>
      <section className="py-16 px-4 min-h-screen relative">
        <div className="absolute inset-0 bg-grid-white/[0.03] [mask-image:radial-gradient(ellipse_at_center,white_20%,transparent_75%)]"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block mb-3">
              <Badge variant="outline" className="px-3 py-1 text-sm bg-primary/10 text-primary border-primary/20">
                تحضير للاختبار
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-5 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">اختبارات قياس التجريبية</h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              تدرب على اختبارات تحاكي اختبار القدرات العامة بقسميه اللفظي والكمي
            </p>
          </div>

          {isLoggedIn && role === "admin" && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-10 text-center"
            >
              <Link to="/test-management">
                <Button className="bg-primary/90 hover:bg-primary px-6 py-6 h-auto group relative overflow-hidden">
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary to-primary-foreground/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative z-10 flex items-center gap-2">
                    <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                    إنشاء اختبارات خاصة بك
                  </span>
                </Button>
              </Link>
            </motion.div>
          )}

          <Tabs 
            defaultValue="sample-tests"
            value={activeTab} 
            onValueChange={setActiveTab}
            className="max-w-3xl mx-auto mb-12"
          >
            <TabsList className="grid grid-cols-2 w-[400px] mx-auto bg-background/30 p-1 backdrop-blur-sm">
              <TabsTrigger 
                value="sample-tests" 
                className="data-[state=active]:bg-primary/90 data-[state=active]:text-white"
              >
                اختبارات نموذجية
              </TabsTrigger>
              <TabsTrigger 
                value="user-tests"
                className="data-[state=active]:bg-primary/90 data-[state=active]:text-white"
              >
                اختبارات اسبوعية
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sample-tests" className="mt-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                  // Skeleton loader for sample tests
                  [1, 2, 3].map((i) => (
                    <Card key={i} className="overflow-hidden border border-white/10 bg-gradient-to-br from-gray-950/40 to-gray-900/40">
                      <CardContent className="p-6">
                        <Skeleton className="h-6 w-32 mb-3" />
                        <Skeleton className="h-8 w-full mb-2" />
                        <Skeleton className="h-4 w-4/5 mb-6" />
                        <div className="flex gap-4 mb-6">
                          <Skeleton className="h-8 w-24" />
                          <Skeleton className="h-8 w-24" />
                        </div>
                        <Skeleton className="h-10 w-full" />
                      </CardContent>
                    </Card>
                  ))
                ) : sampleTests.length > 0 ? (
                  // Database sample tests
                  sampleTests.map((test, index) => (
                    <TestCard key={test.id} test={test} index={index} />
                  ))
                ) : (
                  // Fallback to static sample tests if none in database
                  mockTests.map((test, index) => (
                    <TestCard key={test.id} test={test} index={index} />
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="user-tests" className="mt-8">
              {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="overflow-hidden border border-white/10 bg-gradient-to-br from-gray-950/40 to-gray-900/40">
                      <CardContent className="p-6">
                        <Skeleton className="h-6 w-32 mb-3" />
                        <Skeleton className="h-8 w-full mb-2" />
                        <Skeleton className="h-4 w-4/5 mb-6" />
                        <div className="flex gap-4 mb-6">
                          <Skeleton className="h-8 w-24" />
                          <Skeleton className="h-8 w-24" />
                        </div>
                        <Skeleton className="h-10 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : userTests.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {userTests.map((test, index) => (
                    <TestCard key={test.id} test={test} index={index} isUserTest={true} />
                  ))}
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-16 px-4 max-w-md mx-auto"
                >
                  <div className="bg-gray-900/50 border border-gray-800 p-8 rounded-xl">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Trophy className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">لا توجد اختبارات منشورة</h3>
                    <p className="text-gray-400 mb-6">لا توجد اختبارات منشورة من المستخدمين حتى الآن</p>
                    
                    {isLoggedIn && role === "admin" ? (
                      <Link to="/test-management">
                        <Button className="bg-primary hover:bg-primary/90 w-full">
                          <Plus className="mr-2" size={16} />
                          كن أول من ينشئ اختباراً
                        </Button>
                      </Link>
                    ) : isLoggedIn ? (
                      <p className="text-gray-500 text-sm">يمكن للمشرفين فقط إنشاء اختبارات جديدة</p>
                    ) : (
                      <Link to="/login">
                        <Button className="bg-primary hover:bg-primary/90 w-full">
                          تسجيل الدخول
                        </Button>
                      </Link>
                    )}
                  </div>
                </motion.div>
              )}
            </TabsContent>
          </Tabs>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-center mt-16"
          >
            <div className="bg-primary/10 rounded-2xl border border-primary/20 p-6 max-w-3xl mx-auto">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">استعد لاختبار القدرات العامة</h3>
              <p className="text-gray-400 mb-4">نوفر لك مجموعة متنوعة من الاختبارات التجريبية لتكون مستعداً بشكل كامل</p>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                <div className="flex items-center gap-2 text-gray-300">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>اختبارات متنوعة</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>تقييم فوري</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>محاكاة للاختبار الحقيقي</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default QiyasTests;
