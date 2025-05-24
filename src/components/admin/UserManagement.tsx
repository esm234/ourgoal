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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash, Search, UserCog, Shield, User as UserIcon, ShieldAlert, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface User {
  id: string;
  email: string;
  username: string | null;
  role: string | null;
  created_at: string;
}

const UserManagement = () => {
  const { toast } = useToast();
  const { isAdmin, isVerifying, error: adminCheckError } = useAdminCheck();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Only fetch users if we're confirmed as an admin
    if (isAdmin && !isVerifying) {
      fetchUsers();
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

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Get all profiles with user data
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          username,
          role,
          created_at
        `)
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Get user emails from auth.users (this requires RLS policies to be set up properly)
      const userIds = profilesData.map(profile => profile.id);
      const { data: authData, error: authError } = await supabase.auth.admin.listUsers();

      let emailMap: Record<string, string> = {};

      if (!authError && authData?.users) {
        // Create a map of user IDs to emails
        authData.users.forEach(user => {
          if (userIds.includes(user.id)) {
            emailMap[user.id] = user.email || `user-${user.id.substring(0, 8)}@example.com`;
          }
        });
      }

      // Format the data to match our User interface
      const formattedUsers = profilesData.map(user => ({
        id: user.id,
        email: emailMap[user.id] || `user-${user.id.substring(0, 8)}@example.com`,
        username: user.username,
        role: user.role,
        created_at: user.created_at,
      }));

      setUsers(formattedUsers);
    } catch (error: any) {
      // If auth.admin fails (which it will in frontend), fall back to profiles only
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select(`
            id,
            username,
            role,
            created_at
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Format with placeholder emails
        const formattedUsers = data.map(user => ({
          id: user.id,
          email: `user-${user.id.substring(0, 8)}@example.com`,
          username: user.username,
          role: user.role,
          created_at: user.created_at,
        }));

        setUsers(formattedUsers);
      } catch (fallbackError: any) {
        toast({
          title: "خطأ في جلب المستخدمين",
          description: fallbackError.message,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setNewRole(user.role || "user");
    setIsEditDialogOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmEditUser = async () => {
    if (!editingUser) return;

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', editingUser.id);

      if (error) throw error;

      toast({
        title: "تم تحديث المستخدم",
        description: `تم تغيير دور المستخدم إلى ${newRole === 'admin' ? 'مشرف' : 'مستخدم عادي'}`,
      });

      // Update the user in the local state
      setUsers(users.map(user =>
        user.id === editingUser.id ? { ...user, role: newRole } : user
      ));
    } catch (error: any) {
      toast({
        title: "خطأ في تحديث المستخدم",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
      setIsEditDialogOpen(false);
      setEditingUser(null);
    }
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    try {
      // Delete the user profile (this is safer than trying to delete auth user from frontend)
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userToDelete.id);

      if (error) throw error;

      toast({
        title: "تم حذف المستخدم",
        description: "تم حذف ملف المستخدم بنجاح",
      });

      // Remove the user from the local state
      setUsers(users.filter(user => user.id !== userToDelete.id));
    } catch (error: any) {
      toast({
        title: "خطأ في حذف المستخدم",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getRoleBadge = (role: string | null) => {
    if (role === "admin") {
      return <Badge className="bg-primary text-white">مشرف</Badge>;
    } else {
      return <Badge variant="outline">مستخدم</Badge>;
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
            <CardTitle className="text-2xl">إدارة المستخدمين</CardTitle>
            <CardDescription>
              عرض وإدارة جميع المستخدمين في النظام
              {!loading && (
                <span className="text-primary font-medium">
                  {" "}• {filteredUsers.length} من أصل {users.length} مستخدم
                </span>
              )}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchUsers}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              تحديث
            </Button>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="البحث عن مستخدم..."
                className="pl-10 w-full md:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
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
                  <TableHead className="text-right">المستخدم</TableHead>
                  <TableHead className="text-right">البريد الإلكتروني</TableHead>
                  <TableHead className="text-right">الدور</TableHead>
                  <TableHead className="text-right">تاريخ التسجيل</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="bg-primary/10 text-primary p-2 rounded-full">
                            <UserIcon size={16} />
                          </div>
                          {user.username || "لم يتم تعيين اسم"}
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{new Date(user.created_at).toLocaleDateString('ar-EG')}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditUser(user)}
                            className="text-muted-foreground hover:text-primary"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(user)}
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
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      لا يوجد مستخدمين مطابقين لبحثك
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Edit User Dialog */}
        <AlertDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>تعديل دور المستخدم</AlertDialogTitle>
              <AlertDialogDescription>
                تغيير دور المستخدم {editingUser?.username || editingUser?.email}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4">
              <label className="block text-sm font-medium mb-2">الدور</label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الدور" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">
                    <div className="flex items-center gap-2">
                      <UserIcon size={16} />
                      <span>مستخدم عادي</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <Shield size={16} />
                      <span>مشرف</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isUpdating}>إلغاء</AlertDialogCancel>
              <AlertDialogAction onClick={confirmEditUser} disabled={isUpdating}>
                {isUpdating ? (
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    جاري الحفظ...
                  </div>
                ) : (
                  "حفظ التغييرات"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete User Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>حذف المستخدم</AlertDialogTitle>
              <AlertDialogDescription>
                هل أنت متأكد من رغبتك في حذف المستخدم {userToDelete?.username || userToDelete?.email}؟
                <br />
                هذا الإجراء لا يمكن التراجع عنه.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>إلغاء</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteUser}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? (
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    جاري الحذف...
                  </div>
                ) : (
                  "حذف"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

export default UserManagement;
