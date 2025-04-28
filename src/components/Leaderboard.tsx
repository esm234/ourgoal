import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Trophy, Medal } from "lucide-react";

interface LeaderboardEntry {
  id: string;
  user_name: string;
  score: number;
  total_questions: number;
  time_taken: number;
  created_at: string;
}

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from("leaderboard")
        .select("*")
        .order("score", { ascending: false })
        .limit(10);

      if (error) throw error;
      setLeaderboardData(data || []);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 1:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 2:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>جاري تحميل المتصدرين...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          المتصدرون
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">الترتيب</TableHead>
              <TableHead className="text-right">المستخدم</TableHead>
              <TableHead className="text-right">النتيجة</TableHead>
              <TableHead className="text-right">عدد الأسئلة</TableHead>
              <TableHead className="text-right">الوقت المستغرق</TableHead>
              <TableHead className="text-right">التاريخ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboardData.map((entry, index) => (
              <TableRow 
                key={entry.id}
                className={entry.user_id === user?.id ? "bg-primary/10" : ""}
              >
                <TableCell className="text-right">
                  <div className="flex items-center gap-2">
                    {getRankIcon(index)}
                    <span>{index + 1}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">{entry.user_name}</TableCell>
                <TableCell className="text-right">{entry.score}%</TableCell>
                <TableCell className="text-right">{entry.total_questions}</TableCell>
                <TableCell className="text-right">{entry.time_taken} دقيقة</TableCell>
                <TableCell className="text-right">{formatDate(entry.created_at)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Leaderboard; 
