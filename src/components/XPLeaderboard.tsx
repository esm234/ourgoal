import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Trophy,
  Medal,
  Award,
  Star,
  TrendingUp,
  Calendar,
  Target,
  Zap,
  RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { useAuth } from '@/contexts/AuthContext';

const XPLeaderboard: React.FC = () => {
  const { user } = useAuth();
  const {
    leaderboard,
    userRank,
    loading,
    calculateUserXP,
    getXPLevel,
    getDifficultyBadge,
    refreshLeaderboard
  } = useLeaderboard();

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Award className="w-6 h-6 text-amber-600" />;
      default: return <Star className="w-5 h-5 text-primary" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30';
      case 2: return 'from-gray-400/20 to-gray-500/20 border-gray-400/30';
      case 3: return 'from-amber-600/20 to-amber-700/20 border-amber-600/30';
      default: return 'from-primary/10 to-accent/10 border-primary/20';
    }
  };

  const handleCalculateXP = async () => {
    if (user) {
      await calculateUserXP();
    }
  };

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-card/90 to-card/60 border-0 rounded-3xl backdrop-blur-xl shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-3">
            <Trophy className="w-6 h-6 text-primary" />
            متصدرو نقاط الخبرة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">جاري تحميل المتصدرين...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-card/90 to-card/60 border-0 rounded-3xl backdrop-blur-xl shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold flex items-center gap-3">
            <Trophy className="w-6 h-6 text-primary" />
            متصدرو نقاط الخبرة
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshLeaderboard}
              className="bg-background/50 border-primary/20"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              تحديث
            </Button>
            {user && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCalculateXP}
                className="bg-primary/10 border-primary/20 text-primary"
              >
                <Zap className="w-4 h-4 mr-2" />
                اختبار
              </Button>
            )}
          </div>
        </div>
        <p className="text-muted-foreground">
          نظام النقاط يكافئ الاتساق والوتيرة المستدامة في الدراسة
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current User Stats */}
        {user && !userRank && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl border border-blue-500/20"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">ابدأ رحلتك في المتصدرين!</h3>
              <p className="text-muted-foreground mb-4">
                أكمل أيام الدراسة في خططك لتحصل على نقاط الخبرة وتظهر في المتصدرين
              </p>
              <Button
                onClick={handleCalculateXP}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
              >
                <Zap className="w-4 h-4 mr-2" />
                احسب نقاطي الآن
              </Button>
            </div>
          </motion.div>
        )}

        {user && userRank && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl border border-primary/20"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">#{userRank.rank}</span>
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{userRank.username}</h3>
                  <p className="text-sm text-muted-foreground">ترتيبك الحالي</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleCalculateXP}
                  size="sm"
                  className="bg-gradient-to-r from-primary to-accent text-black"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  حساب النقاط
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{userRank.total_xp}</div>
                <div className="text-xs text-muted-foreground">نقاط الخبرة</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">#{userRank.rank}</div>
                <div className="text-xs text-muted-foreground">الترتيب</div>
              </div>
            </div>

            {/* XP Level Progress */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span>المستوى {getXPLevel(userRank.total_xp).level}</span>
                <span>{getXPLevel(userRank.total_xp).currentXP}/{getXPLevel(userRank.total_xp).requiredXP} XP</span>
              </div>
              <Progress value={getXPLevel(userRank.total_xp).progress} className="h-2" />
            </div>
          </motion.div>
        )}

        {/* Top 5 Leaderboard */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            أفضل 5 متصدرين
          </h3>

          {leaderboard.length === 0 ? (
            <div className="text-center py-8">
              <Trophy className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">لا توجد بيانات متصدرين حتى الآن</p>
              <p className="text-sm text-muted-foreground mt-2">ابدأ بإكمال أيام الدراسة لتظهر في المتصدرين!</p>
            </div>
          ) : (
            leaderboard.map((leader, index) => {
              const xpLevel = getXPLevel(leader.total_xp);

              return (
                <motion.div
                  key={leader.user_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`p-3 sm:p-4 rounded-2xl border bg-gradient-to-r ${getRankColor(leader.rank!)} transition-all duration-300 hover:scale-105`}
                >
                  <div className="flex items-center justify-between gap-3">
                    {/* Left side - Rank and User Info */}
                    <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                      {/* Rank Icon and Number */}
                      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                        {getRankIcon(leader.rank!)}
                        <span className="text-lg sm:text-2xl font-bold text-foreground">#{leader.rank}</span>
                      </div>

                      {/* User Info */}
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-foreground text-sm sm:text-lg truncate" title={leader.username}>
                          {leader.username}
                        </h4>
                        <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                          <Star className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">المستوى {getXPLevel(leader.total_xp).level}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right side - XP and Badge */}
                    <div className="text-right flex-shrink-0">
                      <div className="text-lg sm:text-2xl font-bold text-primary mb-1">{leader.total_xp}</div>
                      {leader.rank !== 2 && (
                        <div className="text-xs text-muted-foreground mb-2 hidden sm:block">نقاط الخبرة</div>
                      )}
                      {leader.rank === 1 && (
                        <Badge className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-600 border-0 text-xs">
                          <span className="hidden sm:inline">👑 المتصدر</span>
                          <span className="sm:hidden">👑</span>
                        </Badge>
                      )}
                      {leader.rank !== 1 && leader.rank !== 2 && (
                        <Badge className="bg-gradient-to-r from-primary/20 to-accent/20 text-primary border-0 text-xs">
                          <span className="hidden sm:inline">⭐ المستوى {xpLevel.level}</span>
                          <span className="sm:hidden">⭐ {xpLevel.level}</span>
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Level Progress for top 3 */}
                  {leader.rank! <= 3 && (
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="truncate">المستوى {xpLevel.level}</span>
                        <span className="text-xs whitespace-nowrap ml-2">{xpLevel.currentXP}/{xpLevel.requiredXP} XP</span>
                      </div>
                      <Progress value={xpLevel.progress} className="h-1.5 sm:h-2" />
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </div>

        {/* XP Explanation */}
        <div className="p-4 bg-background/50 rounded-2xl border border-primary/10">
          <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
            <Star className="w-4 h-4 text-primary" />
            كيف يتم حساب نقاط الخبرة؟
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• <strong>نظام بسيط:</strong> كل يوم دراسة مكتمل = 100 نقطة خبرة</li>
            <li>• <strong>المستويات:</strong> كل 1000 نقطة = مستوى جديد</li>
            <li>• <strong>الترتيب:</strong> بناءً على إجمالي نقاط الخبرة</li>
            <li>• <strong>التحديث:</strong> تلقائي عند إكمال أيام جديدة</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default XPLeaderboard;
