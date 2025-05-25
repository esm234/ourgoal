import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Clock, Trophy, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
// import { useWeeklyEvents, useEventTimer } from '@/hooks/useWeeklyEvents';
import { WeeklyEvent, EventQuestion, getCategoryLabel } from '@/types/weeklyEvents';

const EventTest: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

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

        // Load event details
        const { data: eventData, error: eventError } = await supabase
          .from('weekly_events')
          .select('*')
          .eq('id', eventId)
          .eq('is_enabled', true)
          .single();

        if (eventError || !eventData) {
          toast.error('الفعالية غير موجودة أو غير مفعلة');
          navigate('/weekly-events');
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

    if (percentage >= 90) return baseXP;
    if (percentage >= 80) return Math.floor(baseXP * 0.9);
    if (percentage >= 70) return Math.floor(baseXP * 0.8);
    if (percentage >= 60) return Math.floor(baseXP * 0.7);
    if (percentage >= 50) return Math.floor(baseXP * 0.6);
    return Math.floor(baseXP * 0.5);
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

      toast.success('تم إرسال الإجابات بنجاح!');
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

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate('/weekly-events')}
                variant="outline"
                size="icon"
                className="rounded-full"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{event.title}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">{getCategoryLabel(event.category)}</Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Trophy className="w-4 h-4" />
                    <span>{event.xp_reward} XP</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Timer */}
            <div className="text-center">
              <div className="flex items-center gap-2 text-lg font-bold text-primary">
                <Clock className="w-5 h-5" />
                <span>{Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</span>
              </div>
              <p className="text-sm text-muted-foreground">الوقت المتبقي</p>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">
                السؤال {currentQuestionIndex + 1} من {questions.length}
              </span>
              <span className="text-sm text-muted-foreground">
                تم الإجابة على {answeredQuestions} من {questions.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">
                {currentQuestion.question_text}
              </CardTitle>
              {currentQuestion.image_url && (
                <div className="mt-4">
                  <img
                    src={currentQuestion.image_url}
                    alt="صورة السؤال"
                    className="max-w-full h-auto rounded-lg"
                  />
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full p-4 text-right rounded-lg border-2 transition-all duration-200 ${
                      answers[currentQuestionIndex] === index
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50 hover:bg-primary/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        answers[currentQuestionIndex] === index
                          ? 'border-primary bg-primary text-white'
                          : 'border-border'
                      }`}>
                        {answers[currentQuestionIndex] === index && (
                          <CheckCircle className="w-4 h-4" />
                        )}
                      </div>
                      <span className="flex-1">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              variant="outline"
            >
              السؤال السابق
            </Button>

            <div className="flex gap-2">
              {currentQuestionIndex === questions.length - 1 ? (
                <Button
                  onClick={handleSubmitTest}
                  disabled={submitting || answeredQuestions < questions.length}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white font-bold"
                >
                  {submitting ? 'جاري الإرسال...' : 'إنهاء الاختبار'}
                </Button>
              ) : (
                <Button
                  onClick={handleNextQuestion}
                  disabled={currentQuestionIndex === questions.length - 1}
                  className="bg-gradient-to-r from-primary to-accent text-black font-bold"
                >
                  السؤال التالي
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default EventTest;
