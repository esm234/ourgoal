import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  ClipboardList, 
  User, 
  BookOpen, 
  Calendar, 
  Clock,
  BarChart3,
  Eye
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ExamResult {
  id: string;
  user_id: string;
  test_id: string;
  score: number;
  total_questions: number;
  time_taken: number;
  created_at: string;
  user?: {
    username: string;
    email: string;
  };
  test?: {
    title: string;
  };
}

const ExamResultsManagement = () => {
  const { toast } = useToast();
  const [results, setResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date-desc");
  const [selectedResult, setSelectedResult] = useState<ExamResult | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("exam_results")
        .select(`
          *,
          user:user_id (
            username,
            auth_users:id (
              email
            )
          ),
          test:test_id (
            title
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Format the data to match our ExamResult interface
      const formattedResults = data.map(result => ({
        ...result,
        user: {
          username: result.user?.username || "مستخدم غير معروف",
          email: result.user?.auth_users?.email || "بريد إلكتروني غير معروف"
        },
        test: {
          title: result.test?.title || "اختبار غير معروف"
        }
      }));

      setResults(formattedResults);
    } catch (error: any) {
      toast({
        title: "خطأ في جلب نتائج الاختبارات",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (result: ExamResult) => {
    setSelectedResult(result);
    setIsDetailsDialogOpen(true);
  };

  // Filter results based on search term and filter type
  const filteredResults = results.filter(result => {
    const matchesSearch = 
      result.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.test?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === "all") return matchesSearch;
    if (filterType === "high-score") return matchesSearch && (result.score / result.total_questions) >= 0.7;
    if (filterType === "low-score") return matchesSearch && (result.score / result.total_questions) < 0.7;
    
    return matchesSearch;
  });

  // Sort results
  const sortedResults = [...filteredResults].sort((a, b) => {
    if (sortBy === "date-desc") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    if (sortBy === "date-asc") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    if (sortBy === "score-desc") return (b.score / b.total_questions) - (a.score / a.total_questions);
    if (sortBy === "score-asc") return (a.score / a.total_questions) - (b.score / b.total_questions);
    return 0;
  });

  // Format time taken in minutes and seconds
  const formatTimeTaken = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <CardTitle className="text-2xl">إدارة نتائج الاختبارات</CardTitle>
            <CardDescription>عرض وتحليل نتائج الاختبارات للمستخدمين</CardDescription>
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="البحث عن نتيجة..."
                className="pl-10 w-full md:w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="تصفية النتائج" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع النتائج</SelectItem>
                  <SelectItem value="high-score">درجات عالية</SelectItem>
                  <SelectItem value="low-score">درجات منخفضة</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="ترتيب حسب" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">الأحدث أولاً</SelectItem>
                  <SelectItem value="date-asc">الأقدم أولاً</SelectItem>
                  <SelectItem value="score-desc">الدرجة (تنازلي)</SelectItem>
                  <SelectItem value="score-asc">الدرجة (تصاعدي)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">المستخدم</TableHead>
                  <TableHead className="text-right">الاختبار</TableHead>
                  <TableHead className="text-right">الدرجة</TableHead>
                  <TableHead className="text-right">الوقت المستغرق</TableHead>
                  <TableHead className="text-right">تاريخ الإجراء</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedResults.length > 0 ? (
                  sortedResults.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="bg-primary/10 text-primary p-2 rounded-full">
                            <User size={16} />
                          </div>
                          <div>
                            <div>{result.user?.username}</div>
                            <div className="text-xs text-muted-foreground">{result.user?.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          {result.test?.title}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            result.score / result.total_questions >= 0.7
                              ? "bg-green-500/20 text-green-600 hover:bg-green-500/30"
                              : "bg-red-500/20 text-red-600 hover:bg-red-500/30"
                          }
                        >
                          {result.score} / {result.total_questions} ({Math.round((result.score / result.total_questions) * 100)}%)
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {formatTimeTaken(result.time_taken)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {new Date(result.created_at).toLocaleDateString("ar-EG")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(result)}
                          title="عرض التفاصيل"
                          className="text-muted-foreground hover:text-primary"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-muted-foreground"
                    >
                      {searchTerm || filterType !== "all"
                        ? "لا توجد نتائج تطابق البحث"
                        : "لا توجد نتائج اختبارات بعد."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* Result Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>تفاصيل نتيجة الاختبار</DialogTitle>
            <DialogDescription>
              عرض تفاصيل نتيجة الاختبار للمستخدم
            </DialogDescription>
          </DialogHeader>
          {selectedResult && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">المستخدم</h3>
                  <p className="font-medium">{selectedResult.user?.username}</p>
                  <p className="text-sm text-muted-foreground">{selectedResult.user?.email}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">الاختبار</h3>
                  <p className="font-medium">{selectedResult.test?.title}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-secondary/50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">الدرجة</h3>
                  <p className="text-xl font-bold">
                    {selectedResult.score} / {selectedResult.total_questions}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {Math.round((selectedResult.score / selectedResult.total_questions) * 100)}%
                  </p>
                </div>
                
                <div className="bg-secondary/50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">الوقت المستغرق</h3>
                  <p className="text-xl font-bold">
                    {formatTimeTaken(selectedResult.time_taken)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    دقائق:ثواني
                  </p>
                </div>
                
                <div className="bg-secondary/50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">تاريخ الإجراء</h3>
                  <p className="text-xl font-bold">
                    {new Date(selectedResult.created_at).toLocaleDateString("ar-EG")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedResult.created_at).toLocaleTimeString("ar-EG")}
                  </p>
                </div>
              </div>
              
              <div className="bg-secondary/50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">تحليل الأداء</h3>
                <p className="text-sm">
                  {selectedResult.score / selectedResult.total_questions >= 0.7
                    ? "أداء ممتاز! حصل المستخدم على درجة عالية في هذا الاختبار."
                    : "أداء متوسط. يمكن للمستخدم تحسين درجته في المحاولات القادمة."}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ExamResultsManagement;
