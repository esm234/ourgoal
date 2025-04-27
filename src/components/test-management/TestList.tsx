
import React from "react";
import { Test } from "@/types/testManagement";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash, PenLine, Check, X, Plus, List } from "lucide-react";
import { Link } from "react-router-dom";

interface TestListProps {
  tests: Test[];
  loading: boolean;
  onDelete: (id: string) => void;
  onTogglePublish: (id: string, currentStatus: boolean) => void;
}

const TestList = ({ tests, loading, onDelete, onTogglePublish }: TestListProps) => {
  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (tests.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground mb-4">لا توجد اختبارات بعد</p>
        <Link to="/test-management">
          <Button>إنشاء اختبار جديد</Button>
        </Link>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-right">العنوان</TableHead>
          <TableHead className="text-right">المدة</TableHead>
          <TableHead className="text-right">الحالة</TableHead>
          <TableHead className="text-right">الإجراءات</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tests.map((test) => (
          <TableRow key={test.id}>
            <TableCell className="font-medium">{test.title}</TableCell>
            <TableCell>{test.duration} دقيقة</TableCell>
            <TableCell>
              <Badge variant={test.published ? "default" : "outline"}>
                {test.published ? "منشور" : "مسودة"}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/test-management/${test.id}/questions`}>
                    <List className="h-4 w-4 mr-1" />
                    الأسئلة
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/test-management/${test.id}/edit`}>
                    <PenLine className="h-4 w-4 mr-1" />
                    تعديل
                  </Link>
                </Button>
                <Button 
                  variant={test.published ? "destructive" : "default"} 
                  size="sm"
                  onClick={() => onTogglePublish(test.id, test.published)}
                >
                  {test.published ? (
                    <X className="h-4 w-4 mr-1" />
                  ) : (
                    <Check className="h-4 w-4 mr-1" />
                  )}
                  {test.published ? "إلغاء النشر" : "نشر"}
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => onDelete(test.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TestList;
