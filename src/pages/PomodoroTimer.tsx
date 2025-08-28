import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  Clock,
  BookOpen,
  Volume2,
  VolumeX,
  Settings,
  CheckCircle,
  Timer,
  Target,
  ArrowLeft,
  Music,
  Waves,
  Trees,
  AlertCircle,
  BarChart3,
  Trophy,
  Calendar,
  TrendingUp,
  Coffee,
  Brain,
  Zap,
  Award,
  SkipForward,
  Plus,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { generateQuranAudioSources, getFallbackQuranSources, QuranAudioSource } from '@/utils/quranAudio';
import { AddRecitationDialog } from '@/components/AddRecitationDialog';
import Layout from '@/components/Layout';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

// Types
interface Task {
  id: string;
  name: string;
  sessions: number;
  totalTime: number; // in minutes
  completedAt: Date;
  isCompleted: boolean;
}

interface PomodoroSession {
  id: string;
  taskId: string;
  type: 'work' | 'short-break' | 'long-break';
  duration: number;
  completedAt: Date;
}

interface Settings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  notificationsEnabled: boolean;
  soundVolume: number;
}

interface AudioSource {
  id: string;
  name: string;
  url: string;
  type: 'quran' | 'nature' | 'generated';
  category?: string;
}

type SessionType = 'work' | 'short-break' | 'long-break';

const PomodoroTimer: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Timer states
  const [minutes, setMinutes] = useState<number>(25);
  const [seconds, setSeconds] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [sessionType, setSessionType] = useState<'work' | 'short-break' | 'long-break'>('work');
  const [sessionCount, setSessionCount] = useState<number>(0);
  const [currentTaskId, setCurrentTaskId] = useState<string>('');
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [isAddingTask, setIsAddingTask] = useState<boolean>(false);

  // Task management
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskInput, setTaskInput] = useState('');

  // Audio states
  const [selectedAudio, setSelectedAudio] = useState<string>('silence');
  const [audioVolume, setAudioVolume] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);
  const [audioError, setAudioError] = useState<string>('');
  const [audioLoading, setAudioLoading] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Custom recitations state
  const [customRecitations, setCustomRecitations] = useState<QuranAudioSource[]>([]);

  // Settings
  const [settings, setSettings] = useState<Settings>({
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsBeforeLongBreak: 4,
    autoStartBreaks: false,
    autoStartPomodoros: false,
    notificationsEnabled: true,
    soundVolume: 0.3
  });

  // Refs
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Audio sources - Using working sources and generated audio
  const audioSources: AudioSource[] = [
    {
      id: 'silence',
      name: 'صمت (بدون صوت)',
      url: '',
      type: 'generated'
    },
    {
      id: 'white-noise',
      name: 'ضوضاء بيضاء للتركيز',
      url: 'generated',
      type: 'generated'
    },
    {
      id: 'forest-sounds',
      name: 'أصوات الغابة الطبيعية',
      url: '/audio/nature/forest-sounds.mp3',
      type: 'nature'
    },
    {
      id: 'rain-coffee-fireplace',
      name: 'مطر وقهوة ونار الموقد ☕',
      url: '/audio/nature/صوت المطر والرعد وفرقعة الحطب مع كوب قهوة☕ للدراسة والتركيز والتفكير العميق I 4K.mp3',
      type: 'nature'
    },
    {
      id: 'thunderstorm-heavy-rain',
      name: 'عاصفة رعدية ومطر غزير ⛈️',
      url: '/audio/nature/Thunderstorm with Heavy rain sounds for Sleep Study and Relaxation The Hideout Ambience 3 Hours (2).mp3',
      type: 'nature'
    },
    {
      id: 'brown-noise',
      name: 'ضوضاء بنية للاسترخاء',
      url: 'generated',
      type: 'generated'
    },
    // القرآن الكريم - السور المختارة من YouTube
    ...generateQuranAudioSources(),
    // التلاوات المخصصة
    ...customRecitations
  ];

  // Load data from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('pomodoro-tasks');
    const savedSettings = localStorage.getItem('pomodoro-settings');
    const savedSessionCount = localStorage.getItem('pomodoro-session-count');

    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
          ...task,
          completedAt: new Date(task.completedAt)
        }));
        setTasks(parsedTasks);
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    }

    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }

    if (savedSessionCount) {
      setSessionCount(parseInt(savedSessionCount) || 0);
    }

    // Load custom recitations
    const savedCustomRecitations = localStorage.getItem('custom-recitations');
    if (savedCustomRecitations) {
      try {
        setCustomRecitations(JSON.parse(savedCustomRecitations));
      } catch (error) {
        console.error('Error loading custom recitations:', error);
      }
    }

    // Initialize timer with work duration
    setMinutes(settings.workDuration);
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('pomodoro-tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('pomodoro-settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('pomodoro-session-count', sessionCount.toString());
  }, [sessionCount]);

  useEffect(() => {
    localStorage.setItem('custom-recitations', JSON.stringify(customRecitations));
  }, [customRecitations]);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Generate audio functions
  const generateWhiteNoise = useCallback(() => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const bufferSize = audioContext.sampleRate * 2;
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.5; // Reduced volume
    }

    return buffer;
  }, []);

  const generateBrownNoise = useCallback(() => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const bufferSize = audioContext.sampleRate * 2;
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = buffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5 * 0.3; // Amplify and reduce volume
    }

    return buffer;
  }, []);

  const generateRainSound = useCallback(() => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const bufferSize = audioContext.sampleRate * 2;
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      // Create rain-like sound with filtered noise
      const noise = Math.random() * 2 - 1;
      const filtered = noise * 0.3 * Math.sin(i * 0.001) * Math.cos(i * 0.003);
      data[i] = filtered * 0.4; // Reduced volume
    }

    return buffer;
  }, []);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          handleSessionComplete();
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, minutes, seconds]);

  const handleSessionComplete = () => {
    setIsActive(false);

    // Play notification
    if (settings.notificationsEnabled) {
      showNotification();
    }

    // Update session count and determine next session type
    const newSessionCount = sessionCount + 1;
    setSessionCount(newSessionCount);

    if (sessionType === 'work') {
      // Work session completed
      if (currentTask) {
        updateTaskProgress();
      }

      // Determine break type
      if (newSessionCount % settings.sessionsBeforeLongBreak === 0) {
        setSessionType('long-break');
        setMinutes(settings.longBreakDuration);
        toast.success('🎉 وقت الراحة الطويلة!', {
          description: `استرح لمدة ${settings.longBreakDuration} دقيقة`
        });
      } else {
        setSessionType('short-break');
        setMinutes(settings.shortBreakDuration);
        toast.success('☕ وقت الراحة القصيرة!', {
          description: `استرح لمدة ${settings.shortBreakDuration} دقيقة`
        });
      }

      if (settings.autoStartBreaks) {
        setIsActive(true);
      }
    } else {
      // Break completed
      setSessionType('work');
      setMinutes(settings.workDuration);
      toast.success('💪 وقت العمل!', {
        description: `ابدأ جلسة عمل لمدة ${settings.workDuration} دقيقة`
      });

      if (settings.autoStartPomodoros) {
        setIsActive(true);
      }
    }

    setSeconds(0);
  };

  const showNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const title = sessionType === 'work' ? 'انتهت جلسة العمل!' : 'انتهت فترة الراحة!';
      const body = sessionType === 'work' ? 'وقت الراحة' : 'وقت العمل';

      new Notification(title, {
        body,
        icon: '/favicon.ico'
      });
    }
  };

  // Helper functions
  const getProgress = () => {
    const totalDuration = sessionType === 'work' ? settings.workDuration :
                         sessionType === 'short-break' ? settings.shortBreakDuration :
                         settings.longBreakDuration;
    const totalSeconds = totalDuration * 60;
    const currentSeconds = minutes * 60 + seconds;
    return ((totalSeconds - currentSeconds) / totalSeconds) * 100;
  };

  const getTotalTime = () => {
    return tasks.reduce((total, task) => total + task.totalTime, 0);
  };

  const getAverageSessionsPerTask = () => {
    const completedTasks = tasks.filter(t => t.isCompleted);
    if (completedTasks.length === 0) return 0;
    const totalSessions = completedTasks.reduce((total, task) => total + task.sessions, 0);
    return Math.round(totalSessions / completedTasks.length * 10) / 10;
  };

  const getDailyStats = () => {
    const last7Days = [];
    let cumulativeSessions = 0;
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('ar-EG', {
        month: 'short',
        day: 'numeric',
        calendar: 'gregory'
      });

      // حساب عدد الجلسات لهذا اليوم
      const sessionsForDay = tasks.reduce((total, task) => {
        const taskDate = new Date(task.completedAt);
        if (
          taskDate.getDate() === date.getDate() &&
          taskDate.getMonth() === date.getMonth() &&
          taskDate.getFullYear() === date.getFullYear()
        ) {
          return total + Math.floor(task.sessions);
        }
        return total;
      }, 0);

      cumulativeSessions += sessionsForDay;

      last7Days.push({
        date: dateStr,
        sessions: Math.floor(cumulativeSessions)
      });
    }
    return last7Days;
  };

  const formatDate = (date: Date) => {
    // Format as Gregorian calendar in Arabic
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      calendar: 'gregory'
    };

    try {
      // Try Arabic formatting first
      return date.toLocaleDateString('ar-EG', options);
    } catch (error) {
      // Fallback to English if Arabic fails
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) {
      return 'الآن';
    } else if (diffInMinutes < 60) {
      return `منذ ${diffInMinutes} دقيقة`;
    } else if (diffInHours < 24) {
      return `منذ ${diffInHours} ساعة`;
    } else if (diffInDays === 1) {
      return 'أمس';
    } else if (diffInDays < 7) {
      return `منذ ${diffInDays} أيام`;
    } else {
      return formatDate(date);
    }
  };

  const getDataSize = () => {
    const data = { tasks, settings, sessionCount };
    return Math.round(JSON.stringify(data).length / 1024 * 100) / 100;
  };

  // Task management functions
  const addTask = (name: string) => {
    if (!name.trim()) return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      name: name.trim(),
      isCompleted: false,
      sessions: 0,
      totalTime: 0,
      completedAt: new Date()
    };
    
    // إضافة المهمة الجديدة إلى القائمة
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    
    // حفظ المهام في localStorage مباشرة
    localStorage.setItem('pomodoro-tasks', JSON.stringify(updatedTasks));
    
    // تعيين المهمة الحالية إذا لم تكن هناك مهمة
    if (!currentTask) {
      setCurrentTaskId(newTask.id);
      setCurrentTask(newTask);
    }
    
    // مسح حقل الإدخال
    setTaskInput('');
    
    toast.success(`تم إضافة مهمة: ${newTask.name}`);
  };

  const selectExistingTask = (task: Task) => {
    setCurrentTask(task);
    setCurrentTaskId(task.id);
    toast.success(`تم اختيار المهمة: ${task.name}`);
  };

  const updateTaskProgress = () => {
    if (!currentTask) return;

    const updatedTask = {
      ...currentTask,
      sessions: currentTask.sessions + 1,
      totalTime: currentTask.totalTime + settings.workDuration,
      completedAt: new Date()
    };

    setTasks(prev => prev.map(task =>
      task.id === currentTask.id ? updatedTask : task
    ));
    setCurrentTask(updatedTask);
  };

  const completeTask = () => {
    if (!currentTask) return;

    const completedTask = {
      ...currentTask,
      isCompleted: true,
      completedAt: new Date()
    };

    // تحديث قائمة المهام
    const updatedTasks = tasks.map(task =>
      task.id === currentTask.id ? completedTask : task
    );
    setTasks(updatedTasks);

    // حفظ المهام في localStorage مباشرة
    localStorage.setItem('pomodoro-tasks', JSON.stringify(updatedTasks));

    // إعادة تعيين المتغيرات
    setCurrentTask(null);
    setCurrentTaskId('');
    setTaskInput('');
    setIsActive(false);

    toast.success(`🎉 تم إكمال المهمة: ${completedTask.name}!`, {
      description: `استغرقت ${completedTask.sessions} جلسة و ${completedTask.totalTime} دقيقة`
    });
  };

  // Audio functions
  const playGeneratedAudio = async (type: 'white-noise' | 'rain' | 'brown-noise') => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const audioContext = audioContextRef.current;

      // Resume context if suspended
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      // Stop previous audio
      if (audioSourceRef.current) {
        audioSourceRef.current.stop();
        audioSourceRef.current = null;
      }

      // Generate buffer based on type
      let buffer;
      switch (type) {
        case 'white-noise':
          buffer = generateWhiteNoise();
          break;
        case 'brown-noise':
          buffer = generateBrownNoise();
          break;
        case 'rain':
          buffer = generateRainSound();
          break;
        default:
          buffer = generateWhiteNoise();
      }

      // Create source and gain nodes
      const source = audioContext.createBufferSource();
      const gainNode = audioContext.createGain();

      source.buffer = buffer;
      source.loop = true;

      // Set volume with smooth transition
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        isMuted ? 0 : audioVolume,
        audioContext.currentTime + 0.1
      );

      // Connect nodes
      source.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Store references
      audioSourceRef.current = source;
      gainNodeRef.current = gainNode;

      // Start playing
      source.start();

      setAudioError('');
      toast.success(`تم تشغيل ${type === 'white-noise' ? 'الضوضاء البيضاء' : type === 'brown-noise' ? 'الضوضاء البنية' : 'صوت المطر'}`);
    } catch (error) {
      console.error('Generated audio error:', error);
      setAudioError('فشل في تشغيل الصوت المولد');
      toast.error('فشل في تشغيل الصوت');
    }
  };

  const stopGeneratedAudio = () => {
    if (audioSourceRef.current) {
      audioSourceRef.current.stop();
      audioSourceRef.current = null;
    }
  };

  const playQuranAudio = async (url: string, retryCount = 0, audioType: 'quran' | 'nature' = 'quran') => {
    const maxRetries = 2;

    try {
      console.log('Attempting to play audio:', url);

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      setAudioLoading(true);
      setAudioError('');

      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.volume = isMuted ? 0 : audioVolume;
        audioRef.current.loop = true;

        // Add error handling for audio loading
        audioRef.current.onerror = async () => {
          if (retryCount < maxRetries) {
            console.log(`Retrying audio load, attempt ${retryCount + 1}`);
            setTimeout(() => {
              playQuranAudio(url, retryCount + 1, audioType);
            }, 1000);
            return;
          }

          const errorMessage = audioType === 'quran' ? 'فشل في تحميل التلاوة - جرب تلاوة أخرى' : 'فشل في تحميل الصوت - جرب صوت آخر';
          setAudioError(errorMessage);
          setAudioLoading(false);
          toast.error(errorMessage);
        };

        audioRef.current.onloadstart = () => {
          if (retryCount === 0) {
            const loadingMessage = audioType === 'quran' ? 'جاري تحميل التلاوة...' : 'جاري تحميل الصوت...';
            toast.info(loadingMessage);
          }
        };

        audioRef.current.oncanplay = () => {
          if (retryCount === 0) {
            const successMessage = audioType === 'quran' ? 'تم تحميل التلاوة بنجاح' : 'تم تحميل الصوت بنجاح';
            toast.success(successMessage);
          }
        };

        audioRef.current.onloadeddata = () => {
          setAudioLoading(false);
        };

        await audioRef.current.play();
        setIsAudioPlaying(true);
        if (retryCount === 0) {
          const playMessage = audioType === 'quran' ? '🎵 تم تشغيل التلاوة المباركة' : '🎵 تم تشغيل الصوت';
          toast.success(playMessage);
        }
      }
    } catch (error) {
      console.error('Audio error:', error);

      if (retryCount < maxRetries) {
        console.log(`Retrying audio play, attempt ${retryCount + 1}`);
        setTimeout(() => {
          playQuranAudio(url, retryCount + 1, audioType);
        }, 1000);
        return;
      }

      const errorMessage = audioType === 'quran' ? 'فشل في تشغيل التلاوة - جرب تلاوة أخرى' : 'فشل في تشغيل الصوت - جرب صوت آخر';
      setAudioError(errorMessage);
      toast.error(errorMessage);
      setAudioLoading(false);
    }
  };

  // Timer functions
  const startTimer = () => {
    if (sessionType === 'work' && !currentTask) {
      toast.error('يرجى اختيار مهمة أولاً');
      return;
    }

    setIsActive(true);

    // Start audio if selected and not silence
    if (selectedAudio && selectedAudio !== 'silence') {
      const selectedSource = audioSources.find(a => a.id === selectedAudio);

      if (selectedAudio === 'white-noise') {
        playGeneratedAudio('white-noise');
      } else if (selectedAudio === 'rain-sound') {
        playGeneratedAudio('rain');
      } else if (selectedAudio === 'brown-noise') {
        playGeneratedAudio('brown-noise');
      } else if (selectedSource?.url && (selectedSource.type === 'quran' || selectedSource.type === 'nature')) {
        playQuranAudio(selectedSource.url, 0, selectedSource.type === 'quran' ? 'quran' : 'nature');
      }
    }

    toast.success(`بدء ${sessionType === 'work' ? 'جلسة العمل' : 'فترة الراحة'}!`);
  };

  const pauseTimer = () => {
    setIsActive(false);

    // Pause audio without resetting position
    stopGeneratedAudio();
    if (audioRef.current) {
      audioRef.current.pause();
      // Don't reset currentTime to keep position
    }

    toast.info('تم إيقاف المؤقت مؤقتاً');
  };

  const resetTimer = () => {
    setIsActive(false);
    const duration = sessionType === 'work' ? settings.workDuration :
                    sessionType === 'short-break' ? settings.shortBreakDuration :
                    settings.longBreakDuration;
    setMinutes(duration);
    setSeconds(0);

    // Stop all audio
    stopGeneratedAudio();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    toast.info('تم إعادة تعيين المؤقت');
  };

  // إضافة دالة لتخطي جلسة الراحة
  const skipBreak = () => {
    if (sessionType === 'short-break' || sessionType === 'long-break') {
      setIsActive(false);
      setMinutes(settings.workDuration);
      setSeconds(0);
      setSessionType('work');
      
      // بدء العمل تلقائياً إذا كان الإعداد مفعلاً
      if (settings.autoStartPomodoros && currentTask) {
        setTimeout(() => {
          setIsActive(true);
        }, 300); // تأخير قصير للتأكد من تحديث الواجهة أولاً
      }
      
      toast.success("تم تخطي الراحة", {
        description: settings.autoStartPomodoros && currentTask 
          ? "تم الانتقال إلى جلسة عمل جديدة وبدأت تلقائياً"
          : "تم الانتقال إلى جلسة عمل جديدة"
      });
    }
  };

  // Settings functions
  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Data management functions
  const exportData = () => {
    const data = {
      tasks,
      settings,
      sessionCount,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pomodoro-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('تم تصدير البيانات بنجاح!');
  };

  const clearAllData = () => {
    if (confirm('هل أنت متأكد من مسح جميع البيانات؟ لا يمكن التراجع عن هذا الإجراء.')) {
      setTasks([]);
      setSessionCount(0);
      setCurrentTask(null);
      setCurrentTaskId('');
      setIsActive(false);

      localStorage.removeItem('pomodoro-tasks');
      localStorage.removeItem('pomodoro-session-count');

      toast.success('تم مسح جميع البيانات');
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-4 sm:py-8 px-4 sm:px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              onClick={() => navigate('/profile')}
              variant="outline"
              size="icon"
              className="rounded-full flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">مؤقت البومودورو</h1>
              <p className="text-muted-foreground">تقنية إدارة الوقت للدراسة الفعالة</p>
            </div>
          </div>

          <Tabs defaultValue="timer" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="timer" className="flex items-center gap-2">
                <Timer className="w-4 h-4" />
                المؤقت
              </TabsTrigger>
              <TabsTrigger value="tasks" className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                المهام
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                الإحصائيات
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                الإعدادات
              </TabsTrigger>
            </TabsList>

            {/* Timer Tab */}
            <TabsContent value="timer" className="space-y-6">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Main Timer */}
                <div className="xl:col-span-2 space-y-6">
                  {/* Timer Card */}
                  <Card className="bg-gradient-to-br from-primary/10 to-accent/10">
                    <CardHeader className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        {sessionType === 'work' && <Brain className="w-6 h-6 text-primary" />}
                        {sessionType === 'short-break' && <Coffee className="w-6 h-6 text-green-500" />}
                        {sessionType === 'long-break' && <Zap className="w-6 h-6 text-blue-500" />}
                        <CardTitle className="text-xl">
                          {sessionType === 'work' && 'وقت العمل'}
                          {sessionType === 'short-break' && 'راحة قصيرة'}
                          {sessionType === 'long-break' && 'راحة طويلة'}
                        </CardTitle>
                      </div>

                      {currentTask && sessionType === 'work' && (
                        <Badge variant="outline" className="mx-auto w-fit">
                          <Target className="w-3 h-3 mr-1" />
                          {currentTask.name}
                        </Badge>
                      )}

                      <div className="text-sm text-muted-foreground mt-2">
                        الجلسة {sessionCount + 1} •
                        {sessionCount > 0 && ` ${Math.floor(sessionCount / settings.sessionsBeforeLongBreak)} دورة مكتملة`}
                      </div>
                    </CardHeader>

                    <CardContent className="text-center space-y-4 sm:space-y-6 p-4 sm:p-6">
                      {/* Timer Display */}
                      <div className="text-4xl sm:text-6xl lg:text-8xl font-bold text-primary font-mono leading-none">
                        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <Progress
                          value={getProgress()}
                          className="h-3"
                        />
                        <p className="text-sm text-muted-foreground">
                          {Math.round(getProgress())}% مكتمل
                        </p>
                      </div>

                      {/* Timer Controls */}
                      <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                        {/* Primary Action Button */}
                        <div className="flex justify-center">
                          {!isActive ? (
                            <Button
                              onClick={startTimer}
                              size="lg"
                              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 sm:px-8 w-full sm:w-auto"
                              disabled={sessionType === 'work' && !currentTask}
                            >
                              <Play className="w-5 h-5 mr-2" />
                              بدء
                            </Button>
                          ) : (
                            <Button
                              onClick={pauseTimer}
                              size="lg"
                              variant="outline"
                              className="px-6 sm:px-8 w-full sm:w-auto"
                            >
                              <Pause className="w-5 h-5 mr-2" />
                              إيقاف مؤقت
                            </Button>
                          )}
                        </div>

                        {/* Secondary Actions */}
                        <div className="flex gap-3 justify-center">
                          <Button
                            onClick={resetTimer}
                            size="lg"
                            variant="outline"
                            className="px-4 sm:px-6 flex-1 sm:flex-none"
                          >
                            <RotateCcw className="w-5 h-5 mr-2" />
                            <span className="hidden sm:inline">إعادة تعيين</span>
                            <span className="sm:hidden">إعادة</span>
                          </Button>
                          
                          {sessionType === 'work' && currentTask && (
                            <Button
                              onClick={completeTask}
                              size="lg"
                              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 sm:px-6 flex-1 sm:flex-none"
                            >
                              <CheckCircle className="w-5 h-5 mr-2" />
                              <span className="hidden sm:inline">إنهاء المهمة</span>
                              <span className="sm:hidden">إنهاء</span>
                            </Button>
                          )}
                          
                          {/* زر تخطي الراحة - يظهر فقط خلال جلسات الراحة */}
                          {(sessionType === 'short-break' || sessionType === 'long-break') && (
                            <Button
                              onClick={skipBreak}
                              size="lg"
                              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-4 sm:px-6 flex-1 sm:flex-none"
                            >
                              <SkipForward className="w-5 h-5 mr-2" />
                              <span className="hidden sm:inline">تخطي الراحة</span>
                              <span className="sm:hidden">تخطي</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Task Input */}
                  {sessionType === 'work' && !currentTask && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Target className="w-5 h-5 text-primary" />
                          ما المهمة التي تريد العمل عليها؟
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
                          <Input
                            placeholder="اكتب اسم المهمة..."
                            value={taskInput}
                            onChange={(e) => setTaskInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && taskInput.trim() && addTask(taskInput.trim())}
                            className="flex-1"
                          />
                          <Button
                            onClick={() => taskInput.trim() && addTask(taskInput.trim())}
                            disabled={!taskInput.trim()}
                            className="w-full sm:w-auto px-6"
                          >
                            بدء المهمة
                          </Button>
                        </div>

                        {/* Recent Tasks */}
                        {tasks.filter(t => !t.isCompleted).slice(0, 3).length > 0 && (
                          <div className="space-y-2">
                            <Label className="text-sm text-muted-foreground">المهام الحالية:</Label>
                            <div className="space-y-2">
                              {tasks.filter(t => !t.isCompleted).slice(0, 3).map((task) => (
                                <Button
                                  key={task.id}
                                  variant="outline"
                                  onClick={() => selectExistingTask(task)}
                                  className="w-full justify-start h-auto p-3 text-right"
                                >
                                  <div className="text-right w-full">
                                    <div className="font-medium text-sm sm:text-base truncate">{task.name}</div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                      {task.sessions} جلسة • {task.totalTime} دقيقة
                                    </div>
                                  </div>
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Session Progress */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-primary" />
                        تقدم الجلسات
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary">
                          {sessionCount}
                        </div>
                        <div className="text-sm text-muted-foreground">جلسة مكتملة</div>
                      </div>

                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-500">
                          {Math.floor(sessionCount / settings.sessionsBeforeLongBreak)}
                        </div>
                        <div className="text-sm text-muted-foreground">دورة كاملة</div>
                      </div>

                      {/* Progress to next long break */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>الراحة الطويلة القادمة</span>
                          <span>{sessionCount % settings.sessionsBeforeLongBreak}/{settings.sessionsBeforeLongBreak}</span>
                        </div>
                        <Progress
                          value={(sessionCount % settings.sessionsBeforeLongBreak) / settings.sessionsBeforeLongBreak * 100}
                          className="h-2"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Audio Controls */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Volume2 className="w-5 h-5 text-primary" />
                        الأصوات المصاحبة
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Add Custom Recitation */}
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Music className="w-4 h-4" />
                          <span className="text-sm font-medium">الأصوات المصاحبة</span>
                        </div>
                        <AddRecitationDialog
                          onRecitationAdded={(recitation) => {
                            const newAudioSource: QuranAudioSource = {
                              id: recitation.id,
                              name: recitation.name,
                              url: recitation.url,
                              type: 'quran',
                              surahName: recitation.surahName,
                              surahNumber: recitation.surahNumber,
                              reciter: recitation.reciter,
                              category: recitation.category
                            };

                            setCustomRecitations(prev => [...prev, newAudioSource]);

                            // Save to localStorage
                            const updatedCustom = [...customRecitations, newAudioSource];
                            localStorage.setItem('custom-recitations', JSON.stringify(updatedCustom));
                          }}
                          onClearAllRecitations={() => {
                            setCustomRecitations([]);
                            localStorage.removeItem('custom-recitations');
                            // Reset audio selection if it was a custom recitation
                            if (selectedAudio.startsWith('custom-')) {
                              setSelectedAudio('silence');
                              // Stop current audio
                              stopGeneratedAudio();
                              if (audioRef.current) {
                                audioRef.current.pause();
                                audioRef.current.currentTime = 0;
                              }
                            }
                          }}
                          hasCustomRecitations={customRecitations.length > 0}
                        />
                      </div>

                      {/* Audio Selection */}
                      <div className="space-y-3">
                        <div className="max-h-72 overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent hover:scrollbar-thumb-primary/40">
                          {/* Generated & Nature Sounds Section */}
                          <div className="space-y-2">
                            <div className="text-xs font-medium text-muted-foreground px-2 py-1 bg-muted/30 rounded-md">
                              🎵 أصوات مصاحبة
                            </div>
                            {audioSources.filter(audio => audio.type === 'generated' || audio.type === 'nature').map((audio) => (
                              <div
                                key={audio.id}
                                onClick={() => {
                                  // Stop current audio first
                                  stopGeneratedAudio();
                                  if (audioRef.current) {
                                    audioRef.current.pause();
                                    audioRef.current.currentTime = 0; // Reset when changing audio
                                  }

                                  // Set new selection
                                  setSelectedAudio(audio.id);

                                  // Play new audio if not silence
                                  if (audio.id !== 'silence') {
                                    if (audio.id === 'white-noise') {
                                      playGeneratedAudio('white-noise');
                                    } else if (audio.id === 'forest-sounds' || audio.id === 'rain-coffee-fireplace' || audio.id === 'thunderstorm-heavy-rain') {
                                      playQuranAudio(audio.url, 0, 'nature');
                                    } else if (audio.id === 'brown-noise') {
                                      playGeneratedAudio('brown-noise');
                                    }
                                  }
                                }}
                                className={`
                                  relative group cursor-pointer rounded-xl p-3 transition-all duration-300 border
                                  ${selectedAudio === audio.id
                                    ? 'bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30 shadow-lg shadow-primary/10'
                                    : 'bg-card/50 border-border/50 hover:bg-card hover:border-border hover:shadow-md'
                                  }
                                `}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`
                                    p-2 rounded-lg transition-colors duration-300
                                    ${selectedAudio === audio.id
                                      ? 'bg-primary/20 text-primary'
                                      : 'bg-muted/50 text-muted-foreground group-hover:bg-muted group-hover:text-foreground'
                                    }
                                  `}>
                                    {audio.id === 'silence' && <VolumeX className="w-4 h-4" />}
                                    {audio.id === 'forest-sounds' && <Trees className="w-4 h-4" />}
                                    {audio.id === 'rain-coffee-fireplace' && <Coffee className="w-4 h-4" />}
                                    {audio.id === 'thunderstorm-heavy-rain' && <Zap className="w-4 h-4" />}
                                    {audio.id !== 'silence' && audio.id !== 'forest-sounds' && audio.id !== 'rain-coffee-fireplace' && audio.id !== 'thunderstorm-heavy-rain' && <Music className="w-4 h-4" />}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className={`
                                      font-medium text-sm transition-colors duration-300
                                      ${selectedAudio === audio.id ? 'text-foreground' : 'text-foreground/80 group-hover:text-foreground'}
                                    `}>
                                      {audio.name}
                                    </div>
                                  </div>
                                  {selectedAudio === audio.id && audio.id !== 'silence' && (
                                    <div className="flex items-center gap-1">
                                      <div className="w-1 h-3 bg-green-500 rounded-full animate-pulse" />
                                      <div className="w-1 h-4 bg-green-500 rounded-full animate-pulse animation-delay-100" />
                                      <div className="w-1 h-2 bg-green-500 rounded-full animate-pulse animation-delay-200" />
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Quran Recitations Section */}
                          <div className="space-y-2">
                            <div className="text-xs font-medium text-muted-foreground px-2 py-1 bg-muted/30 rounded-md">
                              📖 تلاوات القرآن الكريم
                            </div>
                            {audioSources.filter(audio => audio.type === 'quran').map((audio) => (
                              <div
                                key={audio.id}
                                onClick={() => {
                                  // Stop current audio first
                                  stopGeneratedAudio();
                                  if (audioRef.current) {
                                    audioRef.current.pause();
                                    audioRef.current.currentTime = 0; // Reset when changing audio
                                  }

                                  // Set new selection
                                  setSelectedAudio(audio.id);

                                  // Play Quran audio
                                  if (audio.type === 'quran') {
                                    playQuranAudio(audio.url, 0, 'quran');
                                  }
                                }}
                                className={`
                                  relative group cursor-pointer rounded-xl p-3 transition-all duration-300 border
                                  ${selectedAudio === audio.id
                                    ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30 shadow-lg shadow-green-500/10'
                                    : 'bg-card/50 border-border/50 hover:bg-card hover:border-border hover:shadow-md'
                                  }
                                `}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`
                                    p-2 rounded-lg transition-colors duration-300
                                    ${selectedAudio === audio.id
                                      ? 'bg-green-500/20 text-green-600'
                                      : 'bg-muted/50 text-muted-foreground group-hover:bg-muted group-hover:text-foreground'
                                    }
                                  `}>
                                    <BookOpen className="w-4 h-4" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className={`
                                      font-medium text-sm transition-colors duration-300
                                      ${selectedAudio === audio.id ? 'text-foreground' : 'text-foreground/80 group-hover:text-foreground'}
                                    `}>
                                      {audio.name}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-0.5">
                                      تلاوة قرآنية مباركة
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {selectedAudio === audio.id && (
                                      <div className="flex items-center gap-1">
                                        {audioLoading ? (
                                          <div className="flex items-center gap-1">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce animation-delay-100" />
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce animation-delay-200" />
                                          </div>
                                        ) : (
                                          <div className="flex items-center gap-1">
                                            <div className="w-1 h-3 bg-green-500 rounded-full animate-pulse" />
                                            <div className="w-1 h-4 bg-green-500 rounded-full animate-pulse animation-delay-100" />
                                            <div className="w-1 h-2 bg-green-500 rounded-full animate-pulse animation-delay-200" />
                                          </div>
                                        )}
                                      </div>
                                    )}
                                    {audio.id.startsWith('custom-') && (
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (confirm('هل تريد حذف هذه التلاوة؟')) {
                                            setCustomRecitations(prev => prev.filter(r => r.id !== audio.id));
                                            if (selectedAudio === audio.id) {
                                              setSelectedAudio('silence');
                                            }
                                            toast.success('تم حذف التلاوة');
                                          }
                                        }}
                                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    )}
                                  </div>
                                  {selectedAudio === audio.id && (
                                    <div className="absolute top-2 right-2">
                                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Audio Error Display */}

                        {/* Audio Error Display */}
                        {audioError && (
                          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                            <div className="flex items-center gap-2 text-red-500">
                              <AlertCircle className="w-4 h-4" />
                              <span className="text-sm font-medium">{audioError}</span>
                            </div>
                          </div>
                        )}

                        {/* Audio Controls */}
                        {selectedAudio !== 'silence' && (
                          <div className="bg-gradient-to-r from-muted/30 to-muted/20 rounded-xl p-4 space-y-4 border border-border/50">
                            {/* Control Buttons */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <Label className="text-sm font-medium">التحكم في الصوت</Label>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    if (isAudioPlaying) {
                                      // Pause without resetting
                                      if (audioRef.current) {
                                        audioRef.current.pause();
                                      }
                                      stopGeneratedAudio();
                                      setIsAudioPlaying(false);
                                      toast.info('تم إيقاف الصوت مؤقتاً');
                                    } else {
                                      // Resume from current position
                                      if (audioRef.current) {
                                        audioRef.current.play();
                                      }
                                      setIsAudioPlaying(true);
                                      toast.info('تم استئناف الصوت');
                                    }
                                  }}
                                  className="h-8 w-8 p-0 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 hover:text-blue-400 transition-all duration-200"
                                >
                                  {isAudioPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                                </Button>

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    stopGeneratedAudio();
                                    if (audioRef.current) {
                                      audioRef.current.pause();
                                      audioRef.current.currentTime = 0;
                                    }
                                    setIsAudioPlaying(false);
                                    toast.info('تم إيقاف الصوت نهائياً');
                                  }}
                                  className="h-8 w-8 p-0 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-400 transition-all duration-200"
                                >
                                  <Square className="w-3.5 h-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const newMuted = !isMuted;
                                    setIsMuted(newMuted);

                                    // Update volume for current audio
                                    if (gainNodeRef.current) {
                                      gainNodeRef.current.gain.setValueAtTime(
                                        newMuted ? 0 : audioVolume,
                                        gainNodeRef.current.context.currentTime
                                      );
                                    }
                                    if (audioRef.current) {
                                      audioRef.current.volume = newMuted ? 0 : audioVolume;
                                    }
                                  }}
                                  className={`h-8 w-8 p-0 rounded-lg transition-all duration-200 ${
                                    isMuted
                                      ? 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 hover:text-orange-400'
                                      : 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 hover:text-blue-400'
                                  }`}
                                >
                                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                                </Button>
                              </div>
                            </div>

                            {/* Volume Slider */}
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <Label className="text-sm text-muted-foreground">مستوى الصوت</Label>
                                <div className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-md">
                                  {Math.round(audioVolume * 100)}%
                                </div>
                              </div>
                              <div className="relative">
                                <Slider
                                  value={[audioVolume]}
                                  onValueChange={(value) => {
                                    setAudioVolume(value[0]);
                                    // Update volume for current audio
                                    if (gainNodeRef.current) {
                                      gainNodeRef.current.gain.setValueAtTime(
                                        isMuted ? 0 : value[0],
                                        gainNodeRef.current.context.currentTime
                                      );
                                    }
                                    if (audioRef.current) {
                                      audioRef.current.volume = isMuted ? 0 : value[0];
                                    }
                                  }}
                                  max={1}
                                  min={0}
                                  step={0.1}
                                  className="w-full"
                                />
                                {/* Volume level indicators */}
                                <div className="flex justify-between mt-1 px-1">
                                  <div className="text-xs text-muted-foreground">🔇</div>
                                  <div className="text-xs text-muted-foreground">🔊</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                    </CardContent>
                  </Card>

                  {/* Quick Stats */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-primary" />
                        إحصائيات سريعة
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">المهام المكتملة</span>
                        <span className="font-medium">{tasks.filter(t => t.isCompleted).length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">المهام الجارية</span>
                        <span className="font-medium">{tasks.filter(t => !t.isCompleted).length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">إجمالي الوقت</span>
                        <span className="font-medium">{getTotalTime()} دقيقة</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Tasks Tab */}
            <TabsContent value="tasks" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Active Tasks */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      المهام الجارية ({tasks.filter(t => !t.isCompleted).length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {tasks.filter(t => !t.isCompleted).length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        لا توجد مهام جارية
                      </p>
                    ) : (
                      tasks.filter(t => !t.isCompleted).map((task) => (
                        <div key={task.id} className={`relative p-4 border rounded-xl space-y-3 transition-all duration-300 ${
                          currentTask?.id === task.id
                            ? 'bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30 shadow-lg shadow-primary/10'
                            : 'bg-card/50 border-border hover:bg-card hover:border-border/80 hover:shadow-md'
                        }`}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex-1 text-right ml-20">
                              <h3 className="font-medium text-foreground text-base">{task.name}</h3>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => selectExistingTask(task)}
                              disabled={currentTask?.id === task.id}
                              className={currentTask?.id === task.id
                                ? 'bg-primary/20 text-primary cursor-not-allowed'
                                : 'bg-primary hover:bg-primary/90'
                              }
                            >
                              {currentTask?.id === task.id ? 'جاري العمل' : 'اختيار'}
                            </Button>
                          </div>

                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                              <span className="text-foreground/80">{task.sessions} جلسة</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                              <span className="text-foreground/80">{task.totalTime} دقيقة</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                              <span className="text-foreground/80" title={formatDate(task.completedAt)}>
                                {formatRelativeTime(task.completedAt)}
                              </span>
                            </div>
                          </div>

                          {/* Active task indicator */}
                          {currentTask?.id === task.id && (
                            <div className="absolute top-2 left-2">
                              <div className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                                نشطة
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                {/* Completed Tasks */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      المهام المكتملة ({tasks.filter(t => t.isCompleted).length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                    {tasks.filter(t => t.isCompleted).length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        لم تكمل أي مهمة بعد
                      </p>
                    ) : (
                      tasks
                        .filter(t => t.isCompleted)
                        .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
                        .map((task) => (
                          <div key={task.id} className="relative p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl space-y-3 hover:from-green-500/15 hover:to-emerald-500/15 transition-all duration-300">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex-1 text-right ml-20">
                                <h3 className="font-medium text-foreground text-base">{task.name}</h3>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                <span className="text-foreground/80">{task.sessions} جلسة</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                                <span className="text-foreground/80">{task.totalTime} دقيقة</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                                <span className="text-foreground/80" title={formatDate(task.completedAt)}>
                                  {formatRelativeTime(task.completedAt)}
                                </span>
                              </div>
                            </div>

                            {/* Success badge */}
                            <div className="absolute top-2 left-2">
                              <div className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full font-medium">
                                مكتملة
                              </div>
                            </div>
                          </div>
                        ))
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Stats Tab */}
            <TabsContent value="stats" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Overview Cards */}
                <Card>
                  <CardContent className="p-6 text-center">
                    <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{tasks.filter(t => t.isCompleted).length}</div>
                    <div className="text-sm text-muted-foreground">مهام مكتملة</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <Timer className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{sessionCount}</div>
                    <div className="text-sm text-muted-foreground">جلسة مكتملة</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <Clock className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{getTotalTime()}</div>
                    <div className="text-sm text-muted-foreground">دقيقة إجمالية</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{getAverageSessionsPerTask()}</div>
                    <div className="text-sm text-muted-foreground">متوسط الجلسات</div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>الإنتاجية اليومية</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={getDailyStats()}
                          margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis tickFormatter={(value) => Math.floor(Number(value)).toString()} />
                          <Tooltip formatter={(value) => [Math.floor(Number(value)), 'جلسة']} />
                          <Line 
                            type="monotone" 
                            dataKey="sessions" 
                            stroke="#FFD700" 
                            strokeWidth={2}
                            dot={{ r: 4, fill: "#FFD700" }}
                            activeDot={{ r: 6, fill: "#FFD700" }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>أفضل المهام</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {tasks
                        .filter(t => t.isCompleted)
                        .sort((a, b) => b.totalTime - a.totalTime)
                        .slice(0, 5)
                        .map((task, index) => (
                          <div key={task.id} className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">
                              {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{task.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {task.sessions} جلسة • {task.totalTime} دقيقة
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Timer Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Timer className="w-5 h-5 text-primary" />
                      إعدادات المؤقت
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>مدة العمل (دقيقة)</Label>
                      <Input
                        type="number"
                        min="1"
                        max="60"
                        value={settings.workDuration}
                        onChange={(e) => updateSettings({ workDuration: parseInt(e.target.value) || 25 })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>مدة الراحة القصيرة (دقيقة)</Label>
                      <Input
                        type="number"
                        min="1"
                        max="30"
                        value={settings.shortBreakDuration}
                        onChange={(e) => updateSettings({ shortBreakDuration: parseInt(e.target.value) || 5 })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>مدة الراحة الطويلة (دقيقة)</Label>
                      <Input
                        type="number"
                        min="1"
                        max="60"
                        value={settings.longBreakDuration}
                        onChange={(e) => updateSettings({ longBreakDuration: parseInt(e.target.value) || 15 })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>عدد الجلسات قبل الراحة الطويلة</Label>
                      <Input
                        type="number"
                        min="2"
                        max="10"
                        value={settings.sessionsBeforeLongBreak}
                        onChange={(e) => updateSettings({ sessionsBeforeLongBreak: parseInt(e.target.value) || 4 })}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Automation Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-primary" />
                      إعدادات التشغيل التلقائي
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>بدء الراحة تلقائياً</Label>
                        <p className="text-sm text-muted-foreground">
                          بدء فترة الراحة تلقائياً بعد انتهاء العمل
                        </p>
                      </div>
                      <Switch
                        checked={settings.autoStartBreaks}
                        onCheckedChange={(checked) => updateSettings({ autoStartBreaks: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>بدء العمل تلقائياً</Label>
                        <p className="text-sm text-muted-foreground">
                          بدء جلسة العمل تلقائياً بعد انتهاء الراحة
                        </p>
                      </div>
                      <Switch
                        checked={settings.autoStartPomodoros}
                        onCheckedChange={(checked) => updateSettings({ autoStartPomodoros: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>التنبيهات</Label>
                        <p className="text-sm text-muted-foreground">
                          إظهار تنبيهات المتصفح عند انتهاء الجلسات
                        </p>
                      </div>
                      <Switch
                        checked={settings.notificationsEnabled}
                        onCheckedChange={(checked) => updateSettings({ notificationsEnabled: checked })}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Audio Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Volume2 className="w-5 h-5 text-primary" />
                      إعدادات الصوت
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>مستوى الصوت الافتراضي</Label>
                      <Slider
                        value={[settings.soundVolume]}
                        onValueChange={(value) => {
                          updateSettings({ soundVolume: value[0] });
                          setAudioVolume(value[0]);
                        }}
                        max={1}
                        min={0}
                        step={0.1}
                        className="w-full"
                      />
                      <div className="text-xs text-center text-muted-foreground">
                        {Math.round(settings.soundVolume * 100)}%
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>الأصوات المتاحة</Label>
                      <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                        {audioSources.map((audio) => (
                          <Button
                            key={audio.id}
                            variant={selectedAudio === audio.id ? "default" : "outline"}
                            onClick={() => setSelectedAudio(audio.id)}
                            className="justify-start h-auto p-3"
                            size="sm"
                          >
                            <div className="flex items-center gap-2">
                              {audio.type === 'quran' && <BookOpen className="w-4 h-4" />}
                              {audio.type === 'nature' && <Waves className="w-4 h-4" />}
                              {audio.type === 'generated' && audio.id === 'silence' && <VolumeX className="w-4 h-4" />}
                              {audio.type === 'generated' && audio.id !== 'silence' && <Music className="w-4 h-4" />}
                              <span className="text-sm">{audio.name}</span>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Data Management */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5 text-primary" />
                      إدارة البيانات
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>إحصائيات البيانات</Label>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div>المهام المحفوظة: {tasks.length}</div>
                        <div>الجلسات المكتملة: {sessionCount}</div>
                        <div>حجم البيانات: {getDataSize()} KB</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        onClick={exportData}
                        className="w-full"
                      >
                        تصدير البيانات
                      </Button>

                      <Button
                        variant="destructive"
                        onClick={clearAllData}
                        className="w-full"
                      >
                        مسح جميع البيانات
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Hidden audio element for Quran playback */}
      <audio
        ref={audioRef}
        preload="none"
        style={{ display: 'none' }}
      />


    </Layout>
  );
};

export default PomodoroTimer;