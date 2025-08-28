import React, { useState, useEffect } from 'react';
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import {
  Clock,
  CheckCircle,
  BookOpen,
  Heart,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  Calendar,
  Star,
  Play,
  Pause,
  Volume2,
  List,
  Target,
  Award,
  Sparkles
} from "lucide-react";

const HasebNafsak = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [prayerTodos, setPrayerTodos] = useState([
    { id: 1, text: "صلاة الفجر", completed: false, time: "05:30" },
    { id: 2, text: "صلاة الظهر", completed: false, time: "12:15" },
    { id: 3, text: "صلاة العصر", completed: false, time: "15:45" },
    { id: 4, text: "صلاة المغرب", completed: false, time: "18:20" },
    { id: 5, text: "صلاة العشاء", completed: false, time: "19:45" }
  ]);

  const [dailyAzkar, setDailyAzkar] = useState([
    { id: 1, text: "أذكار الصباح", completed: false },
    { id: 2, text: "أذكار المساء", completed: false },
    { id: 3, text: "الاستغفار (100 مرة)", completed: false },
    { id: 4, text: "الصلاة على النبي (100 مرة)", completed: false },
    { id: 5, text: "سبحان الله وبحمده (100 مرة)", completed: false }
  ]);

  const [dailyWird, setDailyWird] = useState({
    target: 5, // عدد الصفحات المستهدفة
    completed: 0,
    currentSurah: "البقرة",
    currentPage: 1
  });

  // تحديث الوقت كل ثانية
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // مواقيت الصلاة (يمكن ربطها بـ API لاحقاً)
  const prayerTimes = [
    { name: "الفجر", time: "05:30", icon: Sunrise, color: "from-blue-400 to-cyan-500" },
    { name: "الظهر", time: "12:15", icon: Sun, color: "from-yellow-400 to-orange-500" },
    { name: "العصر", time: "15:45", icon: Sun, color: "from-orange-400 to-red-500" },
    { name: "المغرب", time: "18:20", icon: Sunset, color: "from-red-400 to-pink-500" },
    { name: "العشاء", time: "19:45", icon: Moon, color: "from-purple-400 to-indigo-500" }
  ];

  const togglePrayerTodo = (id: number) => {
    setPrayerTodos(prev => 
      prev.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const toggleAzkar = (id: number) => {
    setDailyAzkar(prev => 
      prev.map(zikr => 
        zikr.id === id ? { ...zikr, completed: !zikr.completed } : zikr
      )
    );
  };

  const updateWirdProgress = () => {
    if (dailyWird.completed < dailyWird.target) {
      setDailyWird(prev => ({
        ...prev,
        completed: prev.completed + 1,
        currentPage: prev.currentPage + 1
      }));
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ar-SA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Layout>
      <SEO
        title="حاسب نفسك - صفحة المسلم اليومية"
        description="صفحة شاملة للمسلم تحتوي على الأذكار، مواقيت الصلاة، قائمة مهام الصلاة، والورد اليومي من القرآن الكريم"
        keywords="حاسب نفسك, أذكار, مواقيت الصلاة, ورد يومي, قرآن كريم, إسلامي"
        url="/haseb-nafsak"
        type="website"
      />

      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
        {/* Header Section */}
        <section className="relative py-16 px-4 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          <div className="container mx-auto relative z-10">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 px-6 py-3 mb-6 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 backdrop-blur-sm">
                <Heart className="w-5 h-5 text-green-500" />
                <span className="text-green-500 font-bold">حاسب نفسك</span>
                <Badge variant="secondary" className="bg-green-500/20 text-green-500 border-0">يومياً</Badge>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                <span className="block text-transparent bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 bg-clip-text">
                  صفحة المسلم اليومية
                </span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                تابع أذكارك، صلواتك، وورد القرآن اليومي في مكان واحد
              </p>

              {/* Current Time & Date */}
              <Card className="max-w-md mx-auto p-6 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border border-primary/20 rounded-2xl">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {formatTime(currentTime)}
                  </div>
                  <div className="text-muted-foreground">
                    {formatDate(currentTime)}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Main Content Grid */}
        <section className="px-4 pb-16">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Prayer Times Column */}
              <div className="space-y-6">
                <Card className="p-6 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border border-primary/20 rounded-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">مواقيت الصلاة</h2>
                  </div>

                  <div className="space-y-4">
                    {prayerTimes.map((prayer, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-card/50 to-card/20 border border-primary/10">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 bg-gradient-to-r ${prayer.color} rounded-lg flex items-center justify-center`}>
                            <prayer.icon className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-medium text-foreground">{prayer.name}</span>
                        </div>
                        <span className="text-lg font-bold text-primary">{prayer.time}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Prayer Todo List */}
                <Card className="p-6 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border border-primary/20 rounded-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">متابعة الصلوات</h2>
                  </div>

                  <div className="space-y-3">
                    {prayerTodos.map((todo) => (
                      <div key={todo.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/5 transition-colors">
                        <Checkbox
                          checked={todo.completed}
                          onCheckedChange={() => togglePrayerTodo(todo.id)}
                          className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                        />
                        <span className={`flex-1 ${todo.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                          {todo.text}
                        </span>
                        <span className="text-sm text-muted-foreground">{todo.time}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-primary/10">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground mb-2">
                        تم إنجاز {prayerTodos.filter(t => t.completed).length} من {prayerTodos.length}
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(prayerTodos.filter(t => t.completed).length / prayerTodos.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Azkar Column */}
              <div className="space-y-6">
                <Card className="p-6 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border border-primary/20 rounded-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center">
                      <Heart className="w-5 h-5 text-purple-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">الأذكار اليومية</h2>
                  </div>

                  <div className="space-y-3">
                    {dailyAzkar.map((zikr) => (
                      <div key={zikr.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/5 transition-colors">
                        <Checkbox
                          checked={zikr.completed}
                          onCheckedChange={() => toggleAzkar(zikr.id)}
                          className="data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                        />
                        <span className={`flex-1 ${zikr.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                          {zikr.text}
                        </span>
                        {zikr.completed && <CheckCircle className="w-4 h-4 text-green-500" />}
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-primary/10">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground mb-2">
                        تم إنجاز {dailyAzkar.filter(z => z.completed).length} من {dailyAzkar.length}
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(dailyAzkar.filter(z => z.completed).length / dailyAzkar.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Quick Actions */}
                <Card className="p-6 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border border-primary/20 rounded-2xl">
                  <h3 className="text-xl font-bold text-foreground mb-4">الانتقال السريع</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Link to="/quran-surahs">
                      <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
                        <BookOpen className="w-4 h-4 ml-2" />
                        سور القرآن
                      </Button>
                    </Link>
                    <Link to="/quran-readers">
                      <Button variant="outline" className="w-full border-green-500/30 hover:bg-green-500/10">
                        <Volume2 className="w-4 h-4 ml-2" />
                        القراء
                      </Button>
                    </Link>
                  </div>
                </Card>
              </div>

              {/* Daily Wird Column */}
              <div className="space-y-6">
                <Card className="p-6 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border border-primary/20 rounded-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-amber-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">الورد اليومي</h2>
                  </div>

                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-primary mb-2">
                      {dailyWird.completed}/{dailyWird.target}
                    </div>
                    <div className="text-muted-foreground mb-4">صفحات اليوم</div>
                    
                    <div className="w-full bg-secondary rounded-full h-3 mb-4">
                      <div 
                        className="bg-gradient-to-r from-amber-500 to-yellow-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(dailyWird.completed / dailyWird.target) * 100}%` }}
                      ></div>
                    </div>

                    <div className="text-sm text-muted-foreground mb-4">
                      السورة الحالية: <span className="font-bold text-foreground">{dailyWird.currentSurah}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mb-6">
                      الصفحة: <span className="font-bold text-foreground">{dailyWird.currentPage}</span>
                    </div>

                    <Button 
                      onClick={updateWirdProgress}
                      disabled={dailyWird.completed >= dailyWird.target}
                      className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white"
                    >
                      <Target className="w-4 h-4 ml-2" />
                      {dailyWird.completed >= dailyWird.target ? 'تم إنجاز الورد اليوم' : 'أنجزت صفحة'}
                    </Button>
                  </div>
                </Card>

                {/* Daily Stats */}
                <Card className="p-6 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border border-primary/20 rounded-2xl">
                  <h3 className="text-xl font-bold text-foreground mb-4">إحصائيات اليوم</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">الصلوات</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-green-500">
                          {prayerTodos.filter(t => t.completed).length}/5
                        </span>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">الأذكار</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-purple-500">
                          {dailyAzkar.filter(z => z.completed).length}/5
                        </span>
                        <Heart className="w-4 h-4 text-purple-500" />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">الورد</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-amber-500">
                          {dailyWird.completed}/{dailyWird.target}
                        </span>
                        <BookOpen className="w-4 h-4 text-amber-500" />
                      </div>
                    </div>
                  </div>

                  {/* Overall Progress */}
                  <div className="mt-6 pt-4 border-t border-primary/10">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground mb-2">التقدم الإجمالي</div>
                      <div className="text-2xl font-bold text-primary mb-2">
                        {Math.round(((prayerTodos.filter(t => t.completed).length + dailyAzkar.filter(z => z.completed).length + dailyWird.completed) / (prayerTodos.length + dailyAzkar.length + dailyWird.target)) * 100)}%
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${((prayerTodos.filter(t => t.completed).length + dailyAzkar.filter(z => z.completed).length + dailyWird.completed) / (prayerTodos.length + dailyAzkar.length + dailyWird.target)) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default HasebNafsak;
