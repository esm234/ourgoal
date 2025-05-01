import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash, Search, Clock, Eye, EyeOff, Plus, FileText, ShieldAlert } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { Test } from "@/types/testManagement";

const AdminTestManagement = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAdmin, isVerifying, error: adminCheckError } = useAdminCheck();
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [testToDelete, setTestToDelete] = useState<Test | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    // Only fetch tests if we're confirmed as an admin
    if (isAdmin && !isVerifying) {
      fetchTests();
    }

    // Show error if admin check failed
    if (adminCheckError) {
      toast({
        title: "خطأ في التحقق من الصلاحيات",
        description: adminCheckError,
        variant: "destructive",
      });
    }
  }, [isAdmin, isVerifying, adminCheckError]);

  const fetchTests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("tests")
        .select(`
          *,
          profiles:user_id (username)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setTests(data || []);
    } catch (error: any) {
      toast({
        title: "خطأ في جلب الاختبارات",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditTest = (testId: string) => {
    navigate(`/test-management/${testId}/edit`);
  };

  const handleManageQuestions = (testId: string) => {
    navigate(`/test-management/${testId}/questions`);
  };

  const handleDeleteTest = (test: Test) => {
    setTestToDelete(test);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteTest = async () => {
    if (!testToDelete) return;

    try {
      // Delete the test (this will cascade delete questions and options)
      const { error } = await supabase
        .from("tests")
        .delete()
        .eq("id", testToDelete.id);

      if (error) throw error;

      toast({
        title: "تم حذف الاختبار",
        description: "تم حذف الاختبار بنجاح",
      });

      // Remove the test from the local state
      setTests(tests.filter(test => test.id !== testToDelete.id));
    } catch (error: any) {
      toast({
        title: "خطأ في حذف الاختبار",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setTestToDelete(null);
    }
  };

  const toggleTestPublished = async (test: Test) => {
    try {
      const { error } = await supabase
        .from("tests")
        .update({ published: !test.published })
        .eq("id", test.id);

      if (error) throw error;

      toast({
        title: test.published ? "تم إخفاء الاختبار" : "تم نشر الاختبار",
        description: test.published
          ? "لن يظهر الاختبار للمستخدمين"
          : "أصبح الاختبار متاحًا للمستخدمين",
      });

      // Update the test in the local state
      setTests(tests.map(t =>
        t.id === test.id ? { ...t, published: !test.published } : t
      ));
    } catch (error: any) {
      toast({
        title: "خطأ في تحديث حالة النشر",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredTests = tests.filter(test =>
    test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (test.description && test.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getCategoryBadge = (category?: string) => {
    if (category === "sample") {
      return <Badge className="bg-amber-600">نموذجي</Badge>;
    } else {
      return <Badge variant="outline">مخصص</Badge>;
    }
  };

  // If still verifying admin status, show loading
  if (isVerifying) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center py-8">
            <ShieldAlert className="h-12 w-12 text-primary animate-pulse mb-4" />
            <h2 className="text-xl font-bold mb-2">جاري التحقق من الصلاحيات...</h2>
            <p className="text-muted-foreground">يرجى الانتظار بينما نتحقق من صلاحياتك</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // If not admin, show access denied
  if (!isAdmin) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center py-8">
            <ShieldAlert className="h-12 w-12 text-destructive mb-4" />
            <h2 className="text-xl font-bold mb-2">غير مصرح</h2>
            <p className="text-muted-foreground">ليس لديك صلاحية الوصول إلى هذه الصفحة</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <CardTitle className="text-2xl">إدارة الاختبارات</CardTitle>
            <CardDescription>عرض وإدارة جميع الاختبارات في النظام</CardDescription>
          </div>
          <div className="flex gap-2 items-center">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="البحث عن اختبار..."
                className="pl-10 w-full md:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={() => navigate("/test-management")} className="flex items-center gap-2">
              <Plus size={16} />
              <span>إضافة اختبار</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">عنوان الاختبار</TableHead>
                  <TableHead className="text-right">النوع</TableHead>
                  <TableHead className="text-right">المدة</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">تاريخ الإنشاء</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTests.length > 0 ? (
                  filteredTests.map((test) => (
                    <TableRow key={test.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="bg-primary/10 text-primary p-2 rounded-full">
                            <FileText size={16} />
                          </div>
                          {test.title}
                        </div>
                      </TableCell>
                      <TableCell>{getCategoryBadge(test.category)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{test.duration} دقيقة</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {test.published ? (
                          <Badge className="bg-green-600">منشور</Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">مخفي</Badge>
                        )}
                      </TableCell>
                      <TableCell>{new Date(test.created_at).toLocaleDateString('en-US')}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditTest(test.id)}
                            title="تعديل الاختبار"
                            className="text-muted-foreground hover:text-primary"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleManageQuestions(test.id)}
                            title="إدارة الأسئلة"
                            className="text-muted-foreground hover:text-primary"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleTestPublished(test)}
                            title={test.published ? "إخفاء الاختبار" : "نشر الاختبار"}
                            className="text-muted-foreground hover:text-primary"
                          >
                            {test.published ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTest(test)}
                            title="حذف الاختبار"
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      لا يوجد اختبارات مطابقة لبحثك
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Delete Test Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>حذف الاختبار</AlertDialogTitle>
              <AlertDialogDescription>
                هل أنت متأكد من رغبتك في حذف الاختبار "{testToDelete?.title}"؟
                <br />
                سيتم حذف جميع الأسئلة والخيارات المرتبطة به. هذا الإجراء لا يمكن التراجع عنه.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>إلغاء</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteTest} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                حذف
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

export default AdminTestManagement;
