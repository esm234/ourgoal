import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Clock, Trophy, AlertCircle, CheckCircle, BookOpen, FileText, Image, Brain, Calculator, Timer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { WeeklyEvent, EventQuestion, getCategoryLabel } from '@/types/weeklyEvents';

const EventTest: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { updateUserXPFromProfile } = useLeaderboard();

  console.log('EventTest component loaded - eventId:', eventId, 'user:', user?.id);

  // Early return for debugging
  if (!eventId) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-2xl font-bold text-red-500">خطأ: معرف الفعالية مفقود</h1>
          <button onClick={() => navigate('/weekly-events')} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
            العودة للفعاليات
          </button>
        </div>
      </Layout>
    );
  }

  const [event, setEvent] = useState<WeeklyEvent | null>(null);
  const [questions, setQuestions] = useState<EventQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [testStartTime] = useState(new Date());
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [accessDenied, setAccessDenied] = useState<string | null>(null);

  // Simple timer calculation
  useEffect(() => {
    if (!event) return;

    const updateTimer = () => {
      const now = new Date();
      const eventStart = new Date(event.start_time);
      const eventEnd = new Date(eventStart.getTime() + event.duration_minutes * 60 * 1000);
      const remaining = Math.max(0, Math.floor((eventEnd.getTime() - now.getTime()) / 1000));
      setTimeRemaining(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [event]);

  // Load event and questions
  useEffect(() => {
    const loadEventData = async () => {
      if (!eventId || !user) return;

      try {
        setLoading(true);

        // Check if user has already taken this test
        const { data: existingParticipation, error: participationError } = await supabase
          .from('event_participations')
          .select('id')
          .eq('event_id', eventId)
          .eq('user_id', user.id)
          .single();

        if (existingParticipation) {
          setAccessDenied('لقد قمت بأداء هذا الاختبار من قبل. يمكنك مراجعة نتائجك من صفحة النتائج.');
          toast.error('لقد قمت بأداء هذا الاختبار من قبل');
          setLoading(false);
          return;
        }

        // Load event details
        const { data: eventData, error: eventError } = await supabase
          .from('weekly_events')
          .select('*')
          .eq('id', eventId)
          .single();

        if (eventError || !eventData) {
          setAccessDenied('الفعالية غير موجودة');
          toast.error('الفعالية غير موجودة');
          setLoading(false);
          return;
        }

        // Check if event is enabled
        if (!eventData.is_enabled) {
          setAccessDenied('هذه الفعالية غير مفعلة حالياً');
          toast.error('هذه الفعالية غير مفعلة حالياً');
          setLoading(false);
          return;
        }

        // Check event timing
        const now = new Date();
        const eventStart = new Date(eventData.start_time);
        const eventEnd = new Date(eventStart.getTime() + eventData.duration_minutes * 60 * 1000);

        if (now < eventStart) {
          setAccessDenied(`لم تبدأ الفعالية بعد. ستبدأ في ${eventStart.toLocaleString('ar-SA')}`);
          toast.error('لم تبدأ الفعالية بعد');
          setLoading(false);
          return;
        }

        if (now > eventEnd) {
          setAccessDenied('انتهت مدة هذه الفعالية ولا يمكن المشاركة فيها');
          toast.error('انتهت مدة هذه الفعالية');
          setLoading(false);
          return;
        }

        setEvent(eventData);

        // Load questions
        const { data: questionsData, error: questionsError } = await supabase
          .from('event_questions')
          .select('*')
          .eq('event_id', eventId)
          .order('question_order');

        if (questionsError) {
          console.error('Error loading questions:', questionsError);
          toast.error('حدث خطأ في تحميل الأسئلة - قد تكون الجداول غير موجودة');
          navigate('/weekly-events');
          return;
        }

        if (!questionsData || questionsData.length === 0) {
          toast.error('لا توجد أسئلة لهذه الفعالية');
          navigate('/weekly-events');
          return;
        }

        setQuestions(questionsData);
        setAnswers(new Array(questionsData.length).fill(-1));
      } catch (error) {
        console.error('Error loading event data:', error);
        toast.error('حدث خطأ في تحميل بيانات الفعالية');
        navigate('/weekly-events');
      } finally {
        setLoading(false);
      }
    };

    loadEventData();
  }, [eventId, user, navigate]);

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.correct_answer) {
        score++;
      }
    });
    return score;
  };

  const calculateXP = (score: number, totalQuestions: number) => {
    const percentage = (score / totalQuestions) * 100;
    const baseXP = event?.xp_reward || 50;

    // Calculate XP based on exact percentage
    // If you get 10% correct, you get 10% of the XP
    const earnedXP = Math.floor((percentage / 100) * baseXP);

    // Minimum XP is 0 (no automatic minimum)
    return Math.max(0, earnedXP);
  };

  const handleSubmitTest = async () => {
    // Check if all questions are answered
    const unansweredQuestions = answers.filter(answer => answer === -1).length;
    if (unansweredQuestions > 0) {
      toast.error(`يجب الإجابة على جميع الأسئلة (${unansweredQuestions} سؤال غير مجاب)`);
      return;
    }

    try {
      setSubmitting(true);

      const score = calculateScore();
      const totalQuestions = questions.length;
      const timeTaken = Math.floor((new Date().getTime() - testStartTime.getTime()) / (1000 * 60));
      const xpEarned = calculateXP(score, totalQuestions);

      // Debug logging for XP calculation
      console.log('🎯 Event Test XP Calculation:', {
        score,
        totalQuestions,
        percentage: (score / totalQuestions) * 100,
        baseXP: event?.xp_reward,
        calculatedXP: xpEarned,
        eventTitle: event?.title
      });

      // Submit participation directly
      const { error: submitError } = await supabase
        .from('event_participations')
        .insert({
          event_id: parseInt(eventId!),
          user_id: user.id,
          answers: answers,
          score: score,
          total_questions: totalQuestions,
          time_taken_minutes: timeTaken,
          xp_earned: xpEarned
        });

      if (submitError) {
        throw submitError;
      }

      // Note: XP is now calculated automatically from event_participations table
      // No need to manually add XP to user profile or user_xp table
      // The leaderboard system will read XP from event_participations directly

      // Update leaderboard with new XP
      try {
        console.log('🔄 Starting leaderboard update after event completion...');

        // Small delay to ensure database write is complete
        await new Promise(resolve => setTimeout(resolve, 1000));

        await updateUserXPFromProfile();

        // Trigger a global XP update event for other components
        window.dispatchEvent(new CustomEvent('xpUpdated', {
          detail: {
            userId: user.id,
            xpEarned: xpEarned,
            source: 'event_test'
          }
        }));

        console.log('✅ XP updated successfully after event test completion');
      } catch (leaderboardError) {
        console.error('❌ Error updating leaderboard:', leaderboardError);
        // Don't throw error here, participation was successful
      }

      toast.success(`🎉 تم إكمال الاختبار! حصلت على ${xpEarned} نقطة خبرة`);
      navigate(`/weekly-events/${eventId}/results`);
    } catch (error) {
      console.error('Error submitting test:', error);
      toast.error('حدث خطأ في إرسال الإجابات');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">جاري تحميل الاختبار...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Show access denied message
  if (accessDenied) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">غير مسموح بالدخول</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">{accessDenied}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => navigate('/weekly-events')}
                  className="bg-gradient-to-r from-primary to-accent text-black font-bold"
                >
                  العودة للفعاليات
                </Button>
                {accessDenied.includes('قمت بأداء هذا الاختبار') && (
                  <Button
                    onClick={() => navigate(`/weekly-events/${eventId}/results`)}
                    variant="outline"
                  >
                    مراجعة النتائج
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!event || !questions.length) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">خطأ في تحميل الاختبار</h2>
            <p className="text-muted-foreground mb-4">لا يمكن تحميل بيانات الاختبار</p>
            <Button onClick={() => navigate('/weekly-events')}>
              العودة للفعاليات
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredQuestions = answers.filter(answer => answer !== -1).length;

  // Debug logging for passage
  console.log('Current question debug:', {
    questionIndex: currentQuestionIndex,
    questionType: currentQuestion?.question_type,
    hasPassage: !!currentQuestion?.passage_text,
    passageLength: currentQuestion?.passage_text?.length || 0,
    passagePreview: currentQuestion?.passage_text?.substring(0, 50) + '...',
    fullQuestion: currentQuestion
  });

  // Also log all questions to see their structure
  console.log('All questions:', questions.map(q => ({
    id: q.id,
    question_type: q.question_type,
    has_passage: !!q.passage_text,
    passage_length: q.passage_text?.length || 0
  })));

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate('/weekly-events')}
                variant="outline"
                size="icon"
                className="rounded-full flex-shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-2xl font-bold break-words">{event.title}</h1>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">{getCategoryLabel(event.category)}</Badge>
                  <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                    <Trophy className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{event.xp_reward} XP</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Timer */}
            <div className="text-center sm:text-right flex-shrink-0">
              <div className="flex items-center justify-center sm:justify-end gap-2 text-base sm:text-lg font-bold text-primary">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>{Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">الوقت المتبقي</p>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
              <span className="text-sm font-medium">
                السؤال {currentQuestionIndex + 1} من {questions.length}
              </span>
              <span className="text-xs sm:text-sm text-muted-foreground">
                تم الإجابة على {answeredQuestions} من {questions.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question Section */}
          <div className="space-y-6 lg:grid lg:grid-cols-12 lg:gap-6 lg:space-y-0 mb-6">
            {/* Debug: Show passage condition result */}
            {console.log('Passage condition check:', {
              hasPassageText: !!currentQuestion.passage_text,
              passageLength: currentQuestion.passage_text?.length || 0,
              trimmedLength: currentQuestion.passage_text?.trim().length || 0,
              conditionResult: currentQuestion.passage_text && currentQuestion.passage_text.trim().length > 0
            })}

            {/* Passage Section (for reading comprehension) */}
            {currentQuestion.passage_text && currentQuestion.passage_text.trim().length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-5"
              >
                <Card className="h-full bg-gradient-to-br from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10 border-primary/20 dark:border-primary/30 shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      <CardTitle className="text-base sm:text-lg text-primary dark:text-primary">النص المطلوب قراءته</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none text-right leading-relaxed text-foreground bg-background/80 dark:bg-background/60 p-4 sm:p-6 rounded-xl border border-border shadow-inner text-sm sm:text-base">
                      {currentQuestion.passage_text}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Question Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={currentQuestion.passage_text && currentQuestion.passage_text.trim().length > 0 ? 'lg:col-span-7' : 'lg:col-span-12'}
            >
              <Card className="h-full bg-gradient-to-br from-background to-accent/5 dark:from-background dark:to-primary/5 shadow-lg border-2 border-primary/10 dark:border-primary/20">
                <CardHeader className="pb-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        {currentQuestion.question_type === 'reading_comprehension' && <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />}
                        {currentQuestion.question_type === 'image' && <Image className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />}
                        {currentQuestion.question_type === 'text' && currentQuestion.category === 'verbal' && <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />}
                        {currentQuestion.question_type === 'text' && currentQuestion.category === 'quantitative' && <Calculator className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />}
                        <Badge variant="outline" className="text-xs">
                          {currentQuestion.category === 'verbal' ? 'لفظي' : 'كمي'}
                        </Badge>
                        {currentQuestion.subcategory && (
                          <Badge variant="secondary" className="text-xs">
                            {currentQuestion.subcategory}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg sm:text-xl leading-relaxed text-right break-words">
                        {currentQuestion.question_text}
                      </CardTitle>
                    </div>
                  </div>

                  {/* Image for image-type questions */}
                  {currentQuestion.image_url && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-4"
                    >
                      <div className="relative overflow-hidden rounded-xl border-2 border-gray-200 dark:border-gray-700">
                        <img
                          src={currentQuestion.image_url}
                          alt="صورة السؤال"
                          className="w-full h-auto max-h-96 object-contain bg-white"
                        />
                      </div>
                    </motion.div>
                  )}
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground mb-4">اختر الإجابة الصحيحة:</h4>
                    <AnimatePresence mode="wait">
                      {currentQuestion.options.map((option, index) => (
                        <motion.button
                          key={`${currentQuestionIndex}-${index}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => handleAnswerSelect(index)}
                          className={`w-full p-3 sm:p-4 text-right rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] ${
                            answers[currentQuestionIndex] === index
                              ? 'border-primary bg-gradient-to-r from-primary/20 to-accent/10 text-primary shadow-lg scale-[1.02]'
                              : 'border-border hover:border-primary/50 hover:bg-primary/5 hover:shadow-md'
                          }`}
                        >
                          <div className="flex items-center gap-3 sm:gap-4">
                            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                              answers[currentQuestionIndex] === index
                                ? 'border-primary bg-primary text-primary-foreground shadow-lg'
                                : 'border-border bg-background'
                            }`}>
                              {answers[currentQuestionIndex] === index ? (
                                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                              ) : (
                                <span className="text-xs sm:text-sm font-bold text-muted-foreground">
                                  {String.fromCharCode(65 + index)}
                                </span>
                              )}
                            </div>
                            <span className="flex-1 text-base sm:text-lg leading-relaxed break-words">{option}</span>
                          </div>
                        </motion.button>
                      ))}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-2xl shadow-lg border"
          >
            <Button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              variant="outline"
              size="lg"
              className="px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold w-full sm:w-auto"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">السؤال السابق</span>
              <span className="sm:hidden">السابق</span>
            </Button>

            {/* Question Navigator */}
            <div className="hidden md:flex items-center gap-2 overflow-x-auto">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 font-bold text-xs sm:text-sm transition-all duration-200 flex-shrink-0 ${
                    index === currentQuestionIndex
                      ? 'border-primary bg-primary text-white shadow-lg'
                      : answers[index] !== -1
                      ? 'border-green-500 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      : 'border-gray-300 dark:border-gray-600 hover:border-primary/50'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <div className="flex gap-2 sm:gap-3">
              {currentQuestionIndex === questions.length - 1 ? (
                <Button
                  onClick={handleSubmitTest}
                  disabled={submitting || answeredQuestions < questions.length}
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-4 sm:px-8 py-2 sm:py-3 rounded-xl shadow-lg w-full sm:w-auto"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      <span className="hidden sm:inline">جاري الإرسال...</span>
                      <span className="sm:hidden">إرسال...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      <span className="hidden sm:inline">إنهاء الاختبار</span>
                      <span className="sm:hidden">إنهاء</span>
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleNextQuestion}
                  disabled={currentQuestionIndex === questions.length - 1}
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-black font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg w-full sm:w-auto"
                >
                  <span className="hidden sm:inline">السؤال التالي</span>
                  <span className="sm:hidden">التالي</span>
                  <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                </Button>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default EventTest;
