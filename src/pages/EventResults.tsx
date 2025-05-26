import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Trophy, Target, Clock, Users, Star, Medal, CheckCircle, XCircle, BookOpen, Image, Brain, Calculator, Eye, EyeOff, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useEventLeaderboard } from '@/hooks/useWeeklyEvents';
import { WeeklyEvent, EventParticipation, EventQuestion, getCategoryLabel } from '@/types/weeklyEvents';

const EventResults: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState<WeeklyEvent | null>(null);
  const [participation, setParticipation] = useState<EventParticipation | null>(null);
  const [questions, setQuestions] = useState<EventQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDetailedReview, setShowDetailedReview] = useState(false);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const { leaderboard, userPosition, loading: leaderboardLoading } = useEventLeaderboard(
    eventId ? parseInt(eventId) : null
  );

  useEffect(() => {
    const loadResults = async () => {
      if (!eventId || !user) return;

      try {
        setLoading(true);

        // Load event details
        const { data: eventData, error: eventError } = await supabase
          .from('weekly_events')
          .select('*')
          .eq('id', eventId)
          .single();

        if (eventError || !eventData) {
          toast.error('الفعالية غير موجودة');
          navigate('/weekly-events');
          return;
        }

        setEvent(eventData);

        // Load user participation
        const { data: participationData, error: participationError } = await supabase
          .from('event_participations')
          .select('*')
          .eq('event_id', eventId)
          .eq('user_id', user.id)
          .single();

        if (participationError || !participationData) {
          toast.error('لم تشارك في هذه الفعالية');
          navigate('/weekly-events');
          return;
        }

        setParticipation(participationData);

        // Load questions for detailed review
        const { data: questionsData, error: questionsError } = await supabase
          .from('event_questions')
          .select('*')
          .eq('event_id', eventId)
          .order('question_order');

        if (questionsError) {
          console.error('Error loading questions:', questionsError);
        } else {
          setQuestions(questionsData || []);
        }
      } catch (error) {
        console.error('Error loading results:', error);
        toast.error('حدث خطأ في تحميل النتائج');
        navigate('/weekly-events');
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [eventId, user, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">جاري تحميل النتائج...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!event || !participation) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">خطأ في تحميل النتائج</h2>
            <Button onClick={() => navigate('/weekly-events')}>
              العودة للفعاليات
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const percentage = Math.round((participation.score / participation.total_questions) * 100);
  const getRankIcon = (position: number) => {
    switch (position) {
      case 1: return <Medal className="w-6 h-6 text-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Medal className="w-6 h-6 text-amber-600" />;
      default: return <Trophy className="w-6 h-6 text-primary" />;
    }
  };

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    if (percentage >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getPerformanceMessage = (percentage: number) => {
    if (percentage >= 90) return 'أداء ممتاز! 🎉';
    if (percentage >= 80) return 'أداء جيد جداً! 👏';
    if (percentage >= 70) return 'أداء جيد! 👍';
    if (percentage >= 60) return 'أداء مقبول 📚';
    return 'يحتاج تحسين 💪';
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              onClick={() => navigate('/weekly-events')}
              variant="outline"
              size="icon"
              className="rounded-full flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-3xl font-bold break-words">نتائج الفعالية</h1>
              <p className="text-sm sm:text-base text-muted-foreground break-words">{event.title}</p>
            </div>
          </div>

          {/* Results Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Score Card */}
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2 text-lg sm:text-xl">
                  <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  نتيجتك
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className={`text-4xl sm:text-6xl font-bold mb-2 ${getPerformanceColor(percentage)}`}>
                  {percentage}%
                </div>
                <div className="text-base sm:text-lg mb-2">
                  {participation.score} من {participation.total_questions}
                </div>
                <div className="text-primary font-medium text-sm sm:text-base">
                  {getPerformanceMessage(percentage)}
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  إحصائيات الأداء
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <span className="text-muted-foreground text-sm sm:text-base">الفئة:</span>
                  <Badge variant="outline" className="text-xs sm:text-sm w-fit">{getCategoryLabel(event.category)}</Badge>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <span className="text-muted-foreground text-sm sm:text-base">الوقت المستغرق:</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-sm sm:text-base">{participation.time_taken_minutes} دقيقة</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <span className="text-muted-foreground text-sm sm:text-base">نقاط الخبرة:</span>
                  <div className="flex items-center gap-1 text-primary font-bold">
                    <Star className="w-4 h-4" />
                    <span>{participation.xp_earned} XP</span>
                  </div>
                </div>
                {userPosition && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">ترتيبك:</span>
                    <div className="flex items-center gap-1">
                      {getRankIcon(userPosition)}
                      <span className="font-bold">#{userPosition}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-6 h-6 text-primary" />
                المتصدرون
              </CardTitle>
            </CardHeader>
            <CardContent>
              {leaderboardLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">جاري تحميل المتصدرين...</p>
                </div>
              ) : leaderboard.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">لا توجد نتائج متاحة</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {leaderboard.map((entry, index) => (
                    <motion.div
                      key={entry.user_id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 rounded-lg border ${
                        entry.user_id === user?.id
                          ? 'bg-primary/10 border-primary'
                          : 'bg-muted/50 border-border'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {getRankIcon(entry.rank_position)}
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm sm:text-base break-words">
                            {entry.user_id === user?.id ? 'أنت' : entry.username}
                          </div>
                          <div className="text-xs sm:text-sm text-muted-foreground">
                            {entry.score}/{entry.total_questions} ({Math.round((entry.score / entry.total_questions) * 100)}%)
                          </div>
                        </div>
                      </div>
                      <div className="text-left sm:text-right flex-shrink-0">
                        <div className="font-bold text-primary text-sm sm:text-base">#{entry.rank_position}</div>
                        <div className="text-xs sm:text-sm text-muted-foreground">{entry.xp_earned} XP</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Detailed Review Toggle */}
          {questions.length > 0 && participation && (
            <Card className="mt-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-6 h-6 text-primary" />
                    مراجعة تفصيلية للأسئلة
                  </CardTitle>
                  <Button
                    onClick={() => setShowDetailedReview(!showDetailedReview)}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    {showDetailedReview ? (
                      <>
                        <EyeOff className="w-4 h-4" />
                        إخفاء المراجعة
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4" />
                        عرض المراجعة
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>

              <AnimatePresence>
                {showDetailedReview && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardContent>
                      {/* Question Navigator */}
                      <div className="flex flex-wrap gap-3 mb-6 p-6 bg-gradient-to-r from-background to-muted/10 rounded-xl border border-border shadow-sm">
                        <h5 className="w-full text-sm font-semibold text-muted-foreground mb-2">انتقل إلى السؤال:</h5>
                        {questions.map((_, index) => {
                          const userAnswer = participation.answers[index];
                          const isCorrect = userAnswer === questions[index].correct_answer;
                          return (
                            <button
                              key={index}
                              onClick={() => setCurrentReviewIndex(index)}
                              className={`w-12 h-12 rounded-xl border-2 font-bold text-sm transition-all duration-200 shadow-sm hover:scale-105 ${
                                index === currentReviewIndex
                                  ? 'border-primary bg-primary text-primary-foreground shadow-lg scale-110'
                                  : isCorrect
                                  ? 'border-green-500 bg-green-500 text-white hover:bg-green-600'
                                  : 'border-red-500 bg-red-500 text-white hover:bg-red-600'
                              }`}
                            >
                              {index + 1}
                            </button>
                          );
                        })}
                      </div>

                      {/* Current Question Review */}
                      {questions[currentReviewIndex] && (
                        <motion.div
                          key={currentReviewIndex}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-6"
                        >
                          {/* Question Details */}
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* Passage (if reading comprehension) */}
                            {questions[currentReviewIndex].passage_text && questions[currentReviewIndex].passage_text.trim().length > 0 && (
                              <div className="lg:col-span-5">
                                <Card className="bg-gradient-to-br from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10 border-primary/20 dark:border-primary/30 shadow-lg">
                                  <CardHeader className="pb-3">
                                    <div className="flex items-center gap-2">
                                      <BookOpen className="w-5 h-5 text-primary" />
                                      <CardTitle className="text-lg text-primary dark:text-primary">النص المطلوب قراءته</CardTitle>
                                    </div>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="prose prose-sm max-w-none text-right leading-relaxed text-foreground bg-background/80 dark:bg-background/60 p-6 rounded-xl border border-border shadow-inner">
                                      {questions[currentReviewIndex].passage_text}
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            )}

                            {/* Question Card */}
                            <div className={questions[currentReviewIndex].passage_text && questions[currentReviewIndex].passage_text.trim().length > 0 ? 'lg:col-span-7' : 'lg:col-span-12'}>
                              <Card className="border-2 border-primary/10 dark:border-primary/20 bg-gradient-to-br from-background to-accent/5 dark:from-background dark:to-primary/5 shadow-lg">
                                <CardHeader>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      {questions[currentReviewIndex].question_type === 'reading_comprehension' && <BookOpen className="w-5 h-5 text-primary" />}
                                      {questions[currentReviewIndex].question_type === 'image' && <Image className="w-5 h-5 text-primary" />}
                                      {questions[currentReviewIndex].question_type === 'text' && questions[currentReviewIndex].category === 'verbal' && <Brain className="w-5 h-5 text-primary" />}
                                      {questions[currentReviewIndex].question_type === 'text' && questions[currentReviewIndex].category === 'quantitative' && <Calculator className="w-5 h-5 text-primary" />}
                                      <Badge variant="outline" className="text-xs">
                                        {questions[currentReviewIndex].category === 'verbal' ? 'لفظي' : 'كمي'}
                                      </Badge>
                                      <Badge variant="secondary" className="text-xs">
                                        السؤال {currentReviewIndex + 1}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {participation.answers[currentReviewIndex] === questions[currentReviewIndex].correct_answer ? (
                                        <Badge className="bg-green-100 text-green-800 border-green-300">
                                          <CheckCircle className="w-4 h-4 mr-1" />
                                          إجابة صحيحة
                                        </Badge>
                                      ) : (
                                        <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-300">
                                          <XCircle className="w-4 h-4 mr-1" />
                                          إجابة خاطئة
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                  <CardTitle className="text-xl leading-relaxed text-right mt-4">
                                    {questions[currentReviewIndex].question_text}
                                  </CardTitle>

                                  {/* Image for image-type questions */}
                                  {questions[currentReviewIndex].image_url && (
                                    <div className="mt-4">
                                      <div className="relative overflow-hidden rounded-xl border-2 border-gray-200 dark:border-gray-700">
                                        <img
                                          src={questions[currentReviewIndex].image_url}
                                          alt="صورة السؤال"
                                          className="w-full h-auto max-h-96 object-contain bg-white"
                                        />
                                      </div>
                                    </div>
                                  )}
                                </CardHeader>

                                <CardContent>
                                  <div className="space-y-4">
                                    <h4 className="font-semibold text-foreground mb-4 text-lg">الخيارات والإجابات:</h4>
                                    {questions[currentReviewIndex].options.map((option, optionIndex) => {
                                      const isUserAnswer = participation.answers[currentReviewIndex] === optionIndex;
                                      const isCorrectAnswer = questions[currentReviewIndex].correct_answer === optionIndex;

                                      return (
                                        <div
                                          key={optionIndex}
                                          className={`p-5 rounded-xl border-2 transition-all duration-300 shadow-sm ${
                                            isCorrectAnswer
                                              ? 'border-green-500 bg-gradient-to-r from-green-500/10 to-green-400/5 dark:from-green-500/20 dark:to-green-400/10'
                                              : isUserAnswer && !isCorrectAnswer
                                              ? 'border-red-500 bg-gradient-to-r from-red-500/10 to-red-400/5 dark:from-red-500/20 dark:to-red-400/10'
                                              : 'border-border bg-gradient-to-r from-background to-muted/20'
                                          }`}
                                        >
                                          <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm shadow-sm ${
                                              isCorrectAnswer
                                                ? 'border-green-500 bg-green-500 text-white'
                                                : isUserAnswer && !isCorrectAnswer
                                                ? 'border-red-500 bg-red-500 text-white'
                                                : 'border-muted-foreground/30 bg-background text-muted-foreground'
                                            }`}>
                                              {isCorrectAnswer ? (
                                                <CheckCircle className="w-6 h-6" />
                                              ) : isUserAnswer && !isCorrectAnswer ? (
                                                <XCircle className="w-6 h-6" />
                                              ) : (
                                                <span className="text-base font-bold">
                                                  {String.fromCharCode(65 + optionIndex)}
                                                </span>
                                              )}
                                            </div>
                                            <span className="flex-1 text-lg leading-relaxed text-foreground font-medium">{option}</span>
                                            <div className="flex flex-col gap-2">
                                              {isCorrectAnswer && !isUserAnswer && (
                                                <Badge className="bg-green-500 hover:bg-green-600 text-white border-green-600 text-sm px-3 py-1">
                                                  ✓ الإجابة الصحيحة
                                                </Badge>
                                              )}
                                              {isUserAnswer && (
                                                <Badge
                                                  variant={isCorrectAnswer ? "default" : "destructive"}
                                                  className={`text-sm px-3 py-1 ${
                                                    isCorrectAnswer
                                                      ? 'bg-green-500 hover:bg-green-600 text-white border-green-600'
                                                      : 'bg-red-500 hover:bg-red-600 text-white border-red-600'
                                                  }`}
                                                >
                                                  {isCorrectAnswer ? '✓ إجابتك صحيحة' : '✗ إجابتك'}
                                                </Badge>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          </div>

                          {/* Navigation */}
                          <div className="flex justify-between items-center pt-4">
                            <Button
                              onClick={() => setCurrentReviewIndex(Math.max(0, currentReviewIndex - 1))}
                              disabled={currentReviewIndex === 0}
                              variant="outline"
                            >
                              <ArrowLeft className="w-4 h-4 mr-2" />
                              السؤال السابق
                            </Button>

                            <div className="text-center">
                              <p className="text-sm text-muted-foreground">
                                السؤال {currentReviewIndex + 1} من {questions.length}
                              </p>
                            </div>

                            <Button
                              onClick={() => setCurrentReviewIndex(Math.min(questions.length - 1, currentReviewIndex + 1))}
                              disabled={currentReviewIndex === questions.length - 1}
                              variant="outline"
                            >
                              السؤال التالي
                              <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Button
              onClick={() => navigate('/weekly-events')}
              className="bg-gradient-to-r from-primary to-accent text-black font-bold px-6 sm:px-8 w-full sm:w-auto"
            >
              العودة للفعاليات
            </Button>
            {questions.length > 0 && (
              <Button
                onClick={() => navigate(`/weekly-events/${eventId}/test`)}
                variant="outline"
                className="px-6 sm:px-8 w-full sm:w-auto"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                إعادة المحاولة
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default EventResults;
