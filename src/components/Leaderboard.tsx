import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Medal, TrendingUp, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface LeaderboardItem {
  username: string;
  score: number;
  rank: number;
}

interface LeaderboardProps {
  testId: string;
}

const Leaderboard = ({ testId }: LeaderboardProps) => {
  const [leaders, setLeaders] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);

        // First, check if any data exists in the exam_results table
        const { data: allResults, error: allResultsError } = await supabase
          .from("exam_results")
          .select("id, score, user_id, test_id")
          .limit(5);

        if (allResultsError) {
          console.error("Error querying all results:", allResultsError);
        } else if (!allResults || allResults.length === 0) {
          console.log("No test results found in database");
        }

        // Get top 5 users with their highest scores for this specific test
        // Using a raw SQL query to group by user_id and get the max score for each user
        const { data: testResults, error: testResultsError } = await supabase
          .from('exam_results')
          .select('user_id, score')
          .eq('test_id', testId)
          .order('score', { ascending: false });

        if (testResultsError) {
          console.error("Supabase query error for specific test:", testResultsError);
          throw testResultsError;
        }

        if (!testResults || testResults.length === 0) {
          console.log("No test results found for this test");
          setLeaders([]);
          return;
        }

        // Process the results to get only the highest score per user
        const userHighestScores: Record<string, number> = {};

        // First pass: collect highest score for each user
        testResults.forEach(result => {
          const userId = result.user_id;
          const score = result.score;

          // If this user doesn't have a score yet, or this score is higher than their previous best
          if (!userHighestScores[userId] || score > userHighestScores[userId]) {
            userHighestScores[userId] = score;
          }
        });

        // Convert to array and sort by score (highest first)
        const topUserScores = Object.entries(userHighestScores)
          .map(([userId, score]) => ({ user_id: userId, max_score: score }))
          .sort((a, b) => b.max_score - a.max_score)
          .slice(0, 5); // Take only top 5

        // Now create a map to store usernames by user_id
        const userProfiles: Record<string, string> = {};

        // For each result, get the profile details if needed
        for (const result of topUserScores) {
          // Only fetch if we haven't already
          if (!userProfiles[result.user_id]) {
            try {
              const { data: profileData, error: profileError } = await supabase
                .from("profiles")
                .select("username")
                .eq("id", result.user_id)
                .single();

              if (profileError) {
                console.warn("Error fetching profile data");
                userProfiles[result.user_id] = "مستخدم مجهول";
              } else if (profileData && profileData.username) {
                userProfiles[result.user_id] = profileData.username;
              } else {
                userProfiles[result.user_id] = "مستخدم مجهول";
              }
            } catch (err) {
              console.error("Error in profile fetch");
              userProfiles[result.user_id] = "مستخدم مجهول";
            }
          }
        }

        // Format data for display
        const leaderboardData = topUserScores.map((item, index) => {
          return {
            username: userProfiles[item.user_id] || "مستخدم مجهول",
            score: item.max_score || 0, // Using max_score from our processed data
            rank: index + 1
          };
        });

        setLeaders(leaderboardData);
      } catch (error) {
        console.error("Error fetching leaderboard");
        setLeaders([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    if (testId) {
      fetchLeaderboard();
    }
  }, [testId]);

  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "text-yellow-400";
      case 2:
        return "text-gray-400";
      case 3:
        return "text-amber-700";
      default:
        return "text-primary";
    }
  };

  const getRankEmoji = (rank: number) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return "";
    }
  };

  return (
    <Card className="bg-card/50 border-border/50 shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span>المتفوقون في هذا الاختبار</span>
          </CardTitle>
          <Badge variant="outline" className="bg-primary/10 text-primary">
            <Users className="h-3 w-3 mr-1" />
            أفضل 5
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <Skeleton className="h-6 w-12" />
              </div>
            ))}
          </div>
        ) : leaders.length > 0 ? (
          <div className="space-y-3">
            {leaders.map((leader) => (
              <div
                key={leader.rank}
                className="flex items-center justify-between p-2 rounded-lg bg-background/40 hover:bg-background/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${getMedalColor(leader.rank)} bg-background`}>
                    {leader.rank <= 3 ? (
                      <Medal className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-bold">{leader.rank}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{leader.username} {getRankEmoji(leader.rank)}</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-primary/5 text-primary font-bold">
                  {leader.score}%
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>لا توجد نتائج بعد</p>
            <p className="text-sm mt-1">كن أول من يكمل هذا الاختبار!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
