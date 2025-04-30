import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, CheckCircle, TrendingUp, ArrowUp, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface AdminStatsProps {
  stats: {
    totalUsers: number;
    totalTests: number;
    totalTestsTaken: number;
    recentUsers: number;
    recentTests: number;
  };
  loading: boolean;
}

const AdminStats = ({ stats, loading }: AdminStatsProps) => {
  // No top row cards needed as we're using the detailed section below

  return (
    <div>
      <Card className="border border-primary/20 shadow-md">
        <CardHeader className="pb-4 border-b border-border/40">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold">نظرة عامة على النظام</CardTitle>
              <CardDescription className="mt-1">إحصائيات ومعلومات عامة عن النظام</CardDescription>
            </div>
            <div className="p-3 rounded-full bg-primary/10">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-full bg-blue-500/20">
                    <Users className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="text-base font-medium">إحصائيات المستخدمين</h3>
                </div>
                {loading ? (
                  <Skeleton className="h-10 w-24 mb-3" />
                ) : (
                  <p className="text-3xl font-bold mb-3">{stats.totalUsers.toLocaleString('en-US')}</p>
                )}
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>مستخدمين جدد (30 يوم):</span>
                    <span className="font-medium text-green-500">+{stats.recentUsers.toString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>نسبة النمو:</span>
                    <span className="font-medium text-green-500">{stats.totalUsers > 0 ? ((stats.recentUsers / stats.totalUsers) * 100).toFixed(1) + "%" : "0%"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>متوسط الاختبارات لكل مستخدم:</span>
                    <span className="font-medium">{stats.totalUsers > 0 ? (stats.totalTestsTaken / stats.totalUsers).toFixed(1) : "0"}</span>
                  </div>
                </div>
              </div>

              <div className="bg-purple-500/10 border border-purple-500/20 p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-full bg-purple-500/20">
                    <BookOpen className="h-6 w-6 text-purple-500" />
                  </div>
                  <h3 className="text-base font-medium">إحصائيات الاختبارات</h3>
                </div>
                {loading ? (
                  <Skeleton className="h-10 w-24 mb-3" />
                ) : (
                  <p className="text-3xl font-bold mb-3">{stats.totalTests.toLocaleString('en-US')}</p>
                )}
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>اختبارات جديدة (30 يوم):</span>
                    <span className="font-medium text-green-500">+{stats.recentTests.toString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>نسبة النمو:</span>
                    <span className="font-medium text-green-500">{stats.totalTests > 0 ? ((stats.recentTests / stats.totalTests) * 100).toFixed(1) + "%" : "0%"}</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-full bg-green-500/20">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <h3 className="text-base font-medium">الاختبارات المكتملة</h3>
                </div>
                {loading ? (
                  <Skeleton className="h-10 w-24 mb-3" />
                ) : (
                  <p className="text-3xl font-bold mb-3">{stats.totalTestsTaken.toLocaleString('en-US')}</p>
                )}
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>نسبة الإكمال:</span>
                    <span className="font-medium text-green-500">
                      {stats.totalTests > 0 ? ((stats.totalTestsTaken / stats.totalTests) * 100).toFixed(0) + "%" : "0%"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>معدل النمو الشهري:</span>
                    <span className="font-medium">
                      {stats.totalUsers > 0 ? ((stats.recentUsers / stats.totalUsers) * 100).toFixed(0) + "%" : "0%"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-secondary/50 p-5 rounded-lg shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-base font-medium">ملاحظات</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                يمكنك إدارة المستخدمين والاختبارات من خلال التبويبات أعلاه.
                لإضافة اختبار جديد، انتقل إلى تبويب "الاختبارات" واضغط على زر "إضافة اختبار".
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStats;
