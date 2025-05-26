import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowRight,
  Star,
  Zap,
  Trophy,
  BookOpen,
  Target,
  Calculator,
  Lock,
  X
} from "lucide-react";

// بيانات الأحداث المحلية - لا تستهلك بيانات من Supabase
const upcomingEvents = [
  {
    id: 1,
    title: "ايفينت اور جول",
    description: "لقاء سنوي مميز يجمع أعضاء مجتمع 'اور جول' في القاهرة للاحتفال بنهاية العام وتكوين صداقات جديدة. فرصة رائعة للتعارف وجهاً لوجه مع الأشخاص الذين تعرفت عليهم من خلال المجتمع الرقمي، وقضاء وقت ممتع مع الأصدقاء في أجواء احتفالية مليئة بالذكريات الجميلة. ⚠️ تم إغلاق التسجيل - اكتمل العدد المطلوب",
    date: "2025-8-06",
    time: "18:00",
    duration: "4 ساعات",
    type: "لقاء اجتماعي",
    location: "القاهرة",
    attendees: 200,
    maxAttendees: 200,
    status: "مكتمل",
    priority: "featured",
    icon: Users,
    color: "from-primary to-accent",
    bgColor: "from-primary/10 to-accent/10",
    borderColor: "border-primary/20",
    tags: ["لقاء", "احتفال", "صداقات", "نهاية العام", "الحجز مغلق"]
  }
];

const EventsSection = () => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    try {
      return date.toLocaleDateString('ar-EG', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        calendar: 'gregory'
      });
    } catch (error) {
      // Fallback to English if Arabic fails
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  const getTimeUntilEvent = (dateString: string, timeString: string) => {
    const eventDate = new Date(`${dateString}T${timeString}`);
    const now = new Date();
    const diffTime = eventDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "انتهى";
    if (diffDays === 0) return "اليوم";
    if (diffDays === 1) return "غداً";
    return `خلال ${diffDays} أيام`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "متاح": return "bg-green-500/20 text-green-700 border-green-500/30";
      case "مفتوح": return "bg-blue-500/20 text-blue-700 border-blue-500/30";
      case "ممتلئ": return "bg-orange-500/20 text-orange-700 border-orange-500/30";
      case "مكتمل": return "bg-red-500/20 text-red-700 border-red-500/30";
      default: return "bg-gray-500/20 text-gray-700 border-gray-500/30";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "featured": return <Star className="w-4 h-4" />;
      case "high": return <Zap className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  return (
    <section className="py-24 px-4 relative overflow-hidden bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-r from-accent/10 to-primary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-8 py-4 mb-8 rounded-full bg-gradient-to-r from-primary/15 to-accent/15 border border-primary/30 backdrop-blur-sm">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
              <Calendar className="w-4 h-4 text-black" />
            </div>
            <span className="text-primary font-bold text-lg">الأحداث القادمة</span>
            <Badge variant="secondary" className="bg-primary/20 text-primary border-0 text-xs">جديد</Badge>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="block text-foreground mb-2">فعاليات</span>
            <span className="block text-transparent bg-gradient-to-r from-primary via-accent to-primary bg-clip-text">
              مجتمعنا
            </span>
          </h2>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            انضم لفعالياتنا التعليمية المتنوعة، ورش تدريبية، جلسات مراجعة، واختبارات تجريبية لتحقيق أفضل النتائج
          </p>
        </div>

        {/* Featured Event */}
        <div className="max-w-2xl mx-auto mb-12">
          {upcomingEvents.map((event, index) => {
            const IconComponent = event.icon;
            const timeUntil = getTimeUntilEvent(event.date, event.time);
            const attendancePercentage = (event.attendees / event.maxAttendees) * 100;

            return (
              <Card
                key={event.id}
                className={`group relative p-8 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border ${event.borderColor} rounded-3xl hover:border-opacity-60 transition-all duration-500 hover:scale-105 hover:shadow-2xl overflow-hidden cursor-pointer`}
              >
                {/* Priority Badge */}
                {event.priority === "featured" && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full">
                    <Star className="w-3 h-3" />
                    مميز
                  </div>
                )}

                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${event.bgColor} opacity-50 group-hover:opacity-70 transition-opacity duration-500`}></div>

                <div className="relative z-10">
                  {/* Event Header */}
                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${event.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>

                    <div className="flex items-center justify-center gap-3 mb-4">
                      <Badge className={`${getStatusColor(event.status)} border text-xs font-medium px-3 py-1`}>
                        {event.status}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        {getPriorityIcon(event.priority)}
                        <span className="font-medium">{timeUntil}</span>
                      </div>
                    </div>
                  </div>

                  {/* Event Content */}
                  <div className="text-center mb-6">
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors duration-300">
                      {event.title}
                    </h3>

                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {event.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                      {event.tags.map((tag, tagIndex) => (
                        <Badge
                          key={tagIndex}
                          variant="secondary"
                          className={`border-0 text-xs px-3 py-1 ${
                            tag === "الحجز مغلق"
                              ? "bg-red-500/20 text-red-600"
                              : "bg-primary/10 text-primary"
                          }`}
                        >
                          {tag === "الحجز مغلق" && <Lock className="w-3 h-3 mr-1" />}
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-3 bg-primary/5 rounded-xl">
                      <Calendar className="w-5 h-5 text-primary mx-auto mb-2" />
                      <div className="text-sm font-bold text-foreground mb-1">التاريخ</div>
                      <div className="text-xs text-muted-foreground">{formatDate(event.date)}</div>
                    </div>

                    <div className="text-center p-3 bg-primary/5 rounded-xl">
                      <Clock className="w-5 h-5 text-primary mx-auto mb-2" />
                      <div className="text-sm font-bold text-foreground mb-1">الوقت</div>
                      <div className="text-xs text-muted-foreground">{event.time} - مدة {event.duration}</div>
                    </div>

                    <div className="text-center p-3 bg-primary/5 rounded-xl">
                      <MapPin className="w-5 h-5 text-primary mx-auto mb-2" />
                      <div className="text-sm font-bold text-foreground mb-1">المكان</div>
                      <div className="text-xs text-muted-foreground">{event.location}</div>
                    </div>
                  </div>

                  {/* Attendance Info */}
                  <div className="text-center mb-6">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                      event.status === "مكتمل"
                        ? "bg-red-500/10 border border-red-500/20"
                        : "bg-green-500/10 border border-green-500/20"
                    }`}>
                      <Users className={`w-4 h-4 ${
                        event.status === "مكتمل" ? "text-red-600" : "text-green-600"
                      }`} />
                      <span className={`text-sm font-bold ${
                        event.status === "مكتمل" ? "text-red-600" : "text-green-600"
                      }`}>
                        {event.attendees}/{event.maxAttendees} مشارك
                      </span>
                      {event.status === "مكتمل" && (
                        <Badge className="bg-red-500/20 text-red-600 border-red-500/30 text-xs">
                          مكتمل
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="text-center">
                    {event.status === "مكتمل" ? (
                      <Button
                        disabled
                        className="bg-gray-500/50 text-gray-400 font-bold px-8 py-3 rounded-xl cursor-not-allowed opacity-60"
                      >
                        <span className="flex items-center justify-center gap-2">
                          <Lock className="w-4 h-4" />
                          الحجز مغلق - اكتمل العدد
                          <X className="w-4 h-4" />
                        </span>
                      </Button>
                    ) : (
                      <Button
                        className={`bg-gradient-to-r ${event.color} hover:opacity-90 text-white font-bold px-8 py-3 rounded-xl transition-all duration-300 group-hover:scale-105 shadow-lg`}
                      >
                        <span className="flex items-center justify-center gap-2">
                          <Users className="w-4 h-4" />
                          انضم للفعالية
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </span>
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>


      </div>
    </section>
  );
};

export default EventsSection;
