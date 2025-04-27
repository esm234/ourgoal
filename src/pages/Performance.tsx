import React, { type FC, useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, ArrowRight } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { TestResult } from "@/types/testResults";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Performance: FC = () => {
  const { isLoggedIn, user } = useAuth();
  const { toast } = useToast();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      if (isLoggedIn && user) {
        const { data, error } = await supabase
          .from("exam_results")
          .select("*")
          .eq("user_id", user.id);

        if (error) throw error;

        const transformedResults: TestResult[] = data.map((result: any) => ({
          id: result.id,
          testName: result.test_name,
          score: result.score,
          totalQuestions: result.total_questions,
          date: new Date(result.created_at).toLocaleDateString(),
          duration: result.duration || "N/A",
        }));

        setTestResults(transformedResults);
      } else {
        // Fallback to localStorage for non-logged-in users
        const storedResults = localStorage.getItem("testResults");
        if (storedResults) {
          setTestResults(JSON.parse(storedResults));
        }
      }
    } catch (error) {
      console.error("Error fetching results:", error);
      toast({
        title: "Error",
        description: "Failed to fetch test results. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex justify-center">
            {testResults.length === 0 ? (
              <Card className="w-full max-w-2xl border-2 border-border bg-secondary">
                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                  <BarChart className="w-16 h-16 mb-4 text-muted-foreground" />
                  <h2 className="text-2xl font-semibold mb-2">No Test Results Yet</h2>
                  <p className="text-muted-foreground mb-6">
                    Take your first test to see your performance analytics here.
                  </p>
                  <Button asChild>
                    <Link to="/tests">
                      Start a Test <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="w-full max-w-4xl">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Your Test Results</h2>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">View Details</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Detailed Performance Analysis</DialogTitle>
                        </DialogHeader>
                        <div className="mt-4">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Test Name</TableHead>
                                <TableHead>Score</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {testResults.map((result) => (
                                <TableRow key={result.id}>
                                  <TableCell>{result.testName}</TableCell>
                                  <TableCell>
                                    {result.score}/{result.totalQuestions}
                                  </TableCell>
                                  <TableCell>
                                    <Badge className={
                                      result.score / result.totalQuestions >= 0.7
                                        ? "bg-green-500"
                                        : result.score / result.totalQuestions >= 0.5
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                    }>
                                      {result.score / result.totalQuestions >= 0.7
                                        ? "Excellent"
                                        : result.score / result.totalQuestions >= 0.5
                                        ? "Pass"
                                        : "Needs Improvement"}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>{result.date}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Test Name</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {testResults.slice(0, 5).map((result) => (
                        <TableRow key={result.id}>
                          <TableCell>{result.testName}</TableCell>
                          <TableCell>
                            {result.score}/{result.totalQuestions}
                          </TableCell>
                          <TableCell>
                            <Badge className={
                              result.score / result.totalQuestions >= 0.7
                                ? "bg-green-500"
                                : result.score / result.totalQuestions >= 0.5
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }>
                              {result.score / result.totalQuestions >= 0.7
                                ? "Excellent"
                                : result.score / result.totalQuestions >= 0.5
                                ? "Pass"
                                : "Needs Improvement"}
                            </Badge>
                          </TableCell>
                          <TableCell>{result.date}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Performance;
