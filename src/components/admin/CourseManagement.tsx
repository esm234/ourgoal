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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  Pencil, 
  Trash, 
  Search, 
  Plus, 
  GraduationCap, 
  DollarSign,
  BookOpen,
  Tag
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  created_at: string;
  published: boolean;
  user_id: string;
  image_url?: string;
}

const CourseManagement = () => {
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  
  // New course form state
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    price: 0,
    published: false,
  });

  useEffect(() => {
    // Check if the courses table exists, if not, create it
    checkAndCreateCoursesTable();
  }, []);

  const checkAndCreateCoursesTable = async () => {
    try {
      // Try to query the courses table
      const { error } = await supabase
        .from('courses')
        .select('id')
        .limit(1);
      
      // If there's no error, the table exists, so fetch courses
      if (!error) {
        fetchCourses();
        return;
      }
      
      // If there's an error and it's because the table doesn't exist, create it
      if (error.message.includes("does not exist")) {
        toast({
          title: "إنشاء جدول الدورات",
          description: "جدول الدورات غير موجود. سيتم إنشاؤه الآن.",
        });
        
        // Create the courses table
        const { error: createError } = await supabase.rpc('create_courses_table');
        
        if (createError) {
          throw createError;
        }
        
        toast({
          title: "تم إنشاء جدول الدورات",
          description: "تم إنشاء جدول الدورات بنجاح.",
        });
        
        // Now fetch courses (which will be empty)
        fetchCourses();
      } else {
        // If it's another error, throw it
        throw error;
      }
    } catch (error: any) {
      console.error("Error checking/creating courses table:", error);
      toast({
        title: "خطأ في التحقق من جدول الدورات",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("courses")
        .select(`
          *,
          profiles:user_id (username)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setCourses(data || []);
    } catch (error: any) {
      console.error("Error fetching courses:", error);
      toast({
        title: "خطأ في جلب الدورات",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = async () => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      const { data, error } = await supabase
        .from("courses")
        .insert({
          title: newCourse.title,
          description: newCourse.description,
          price: newCourse.price,
          published: newCourse.published,
          user_id: userData.user.id,
        })
        .select();

      if (error) throw error;

      toast({
        title: "تم إضافة الدورة",
        description: "تم إضافة الدورة بنجاح",
      });

      // Add the new course to the local state
      if (data && data.length > 0) {
        setCourses([data[0], ...courses]);
      }

      // Reset the form
      setNewCourse({
        title: "",
        description: "",
        price: 0,
        published: false,
      });

      // Close the dialog
      setIsAddDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "خطأ في إضافة الدورة",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setIsEditDialogOpen(true);
  };

  const handleUpdateCourse = async () => {
    if (!editingCourse) return;

    try {
      const { error } = await supabase
        .from("courses")
        .update({
          title: editingCourse.title,
          description: editingCourse.description,
          price: editingCourse.price,
          published: editingCourse.published,
        })
        .eq("id", editingCourse.id);

      if (error) throw error;

      toast({
        title: "تم تحديث الدورة",
        description: "تم تحديث الدورة بنجاح",
      });

      // Update the course in the local state
      setCourses(
        courses.map((c) => (c.id === editingCourse.id ? editingCourse : c))
      );

      // Close the dialog
      setIsEditDialogOpen(false);
      setEditingCourse(null);
    } catch (error: any) {
      toast({
        title: "خطأ في تحديث الدورة",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteCourse = (course: Course) => {
    setCourseToDelete(course);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteCourse = async () => {
    if (!courseToDelete) return;

    try {
      const { error } = await supabase
        .from("courses")
        .delete()
        .eq("id", courseToDelete.id);

      if (error) throw error;

      toast({
        title: "تم حذف الدورة",
        description: "تم حذف الدورة بنجاح",
      });

      // Remove the course from the local state
      setCourses(courses.filter((c) => c.id !== courseToDelete.id));
    } catch (error: any) {
      toast({
        title: "خطأ في حذف الدورة",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setCourseToDelete(null);
    }
  };

  const toggleCoursePublished = async (course: Course) => {
    try {
      const { error } = await supabase
        .from("courses")
        .update({ published: !course.published })
        .eq("id", course.id);

      if (error) throw error;

      toast({
        title: course.published ? "تم إخفاء الدورة" : "تم نشر الدورة",
        description: course.published
          ? "لن تظهر الدورة للمستخدمين"
          : "أصبحت الدورة متاحة للمستخدمين",
      });

      // Update the course in the local state
      setCourses(
        courses.map((c) =>
          c.id === course.id ? { ...c, published: !course.published } : c
        )
      );
    } catch (error: any) {
      toast({
        title: "خطأ في تحديث حالة النشر",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Filter courses based on search term
  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <CardTitle className="text-2xl">إدارة الدورات</CardTitle>
            <CardDescription>عرض وإدارة جميع الدورات في النظام</CardDescription>
          </div>
          <div className="flex gap-2 items-center">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="البحث عن دورة..."
                className="pl-10 w-full md:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus size={16} />
                  <span>إضافة دورة</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>إضافة دورة جديدة</DialogTitle>
                  <DialogDescription>
                    أدخل معلومات الدورة الجديدة هنا. اضغط على حفظ عند الانتهاء.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">عنوان الدورة</Label>
                    <Input
                      id="title"
                      value={newCourse.title}
                      onChange={(e) =>
                        setNewCourse({ ...newCourse, title: e.target.value })
                      }
                      placeholder="أدخل عنوان الدورة"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">وصف الدورة</Label>
                    <Textarea
                      id="description"
                      value={newCourse.description}
                      onChange={(e) =>
                        setNewCourse({
                          ...newCourse,
                          description: e.target.value,
                        })
                      }
                      placeholder="أدخل وصف الدورة"
                      rows={4}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="price">سعر الدورة</Label>
                    <Input
                      id="price"
                      type="number"
                      value={newCourse.price}
                      onChange={(e) =>
                        setNewCourse({
                          ...newCourse,
                          price: parseFloat(e.target.value),
                        })
                      }
                      placeholder="أدخل سعر الدورة"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="published"
                      checked={newCourse.published}
                      onChange={(e) =>
                        setNewCourse({
                          ...newCourse,
                          published: e.target.checked,
                        })
                      }
                    />
                    <Label htmlFor="published">نشر الدورة</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    إلغاء
                  </Button>
                  <Button onClick={handleAddCourse}>حفظ</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
                  <TableHead className="text-right">عنوان الدورة</TableHead>
                  <TableHead className="text-right">السعر</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">تاريخ الإنشاء</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="bg-primary/10 text-primary p-2 rounded-full">
                            <GraduationCap size={16} />
                          </div>
                          {course.title}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          {course.price}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={course.published ? "default" : "secondary"}
                          className={
                            course.published
                              ? "bg-green-500/20 text-green-600 hover:bg-green-500/30"
                              : "bg-yellow-500/20 text-yellow-600 hover:bg-yellow-500/30"
                          }
                        >
                          {course.published ? "منشورة" : "غير منشورة"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(course.created_at).toLocaleDateString(
                          "ar-EG"
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditCourse(course)}
                            title="تعديل الدورة"
                            className="text-muted-foreground hover:text-primary"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleCoursePublished(course)}
                            title={
                              course.published
                                ? "إخفاء الدورة"
                                : "نشر الدورة"
                            }
                            className="text-muted-foreground hover:text-primary"
                          >
                            {course.published ? (
                              <Tag className="h-4 w-4" />
                            ) : (
                              <Tag className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCourse(course)}
                            title="حذف الدورة"
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
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-muted-foreground"
                    >
                      {searchTerm
                        ? "لا توجد دورات تطابق البحث"
                        : "لا توجد دورات بعد. أضف دورة جديدة."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* Edit Course Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>تعديل الدورة</DialogTitle>
            <DialogDescription>
              قم بتعديل معلومات الدورة هنا. اضغط على حفظ عند الانتهاء.
            </DialogDescription>
          </DialogHeader>
          {editingCourse && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">عنوان الدورة</Label>
                <Input
                  id="edit-title"
                  value={editingCourse.title}
                  onChange={(e) =>
                    setEditingCourse({
                      ...editingCourse,
                      title: e.target.value,
                    })
                  }
                  placeholder="أدخل عنوان الدورة"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">وصف الدورة</Label>
                <Textarea
                  id="edit-description"
                  value={editingCourse.description}
                  onChange={(e) =>
                    setEditingCourse({
                      ...editingCourse,
                      description: e.target.value,
                    })
                  }
                  placeholder="أدخل وصف الدورة"
                  rows={4}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-price">سعر الدورة</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={editingCourse.price}
                  onChange={(e) =>
                    setEditingCourse({
                      ...editingCourse,
                      price: parseFloat(e.target.value),
                    })
                  }
                  placeholder="أدخل سعر الدورة"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="edit-published"
                  checked={editingCourse.published}
                  onChange={(e) =>
                    setEditingCourse({
                      ...editingCourse,
                      published: e.target.checked,
                    })
                  }
                />
                <Label htmlFor="edit-published">نشر الدورة</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setEditingCourse(null);
              }}
            >
              إلغاء
            </Button>
            <Button onClick={handleUpdateCourse}>حفظ التغييرات</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Course Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف هذه الدورة؟</AlertDialogTitle>
            <AlertDialogDescription>
              هذا الإجراء لا يمكن التراجع عنه. سيؤدي إلى حذف الدورة نهائيًا من
              قاعدة البيانات.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteCourse}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default CourseManagement;
