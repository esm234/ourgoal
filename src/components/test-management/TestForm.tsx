import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  title: z.string().min(3, "العنوان مطلوب ويجب أن يكون على الأقل 3 أحرف"),
  description: z.string().optional(),
  duration: z.coerce.number().min(1, "مدة الاختبار مطلوبة ويجب أن تكون دقيقة واحدة على الأقل"),
  category: z.enum(["sample", "user"], {
    required_error: "يرجى اختيار تصنيف الاختبار",
  }),
});

type FormData = z.infer<typeof formSchema>;

interface TestFormProps {
  onSubmit: (data: FormData) => void;
  defaultValues?: FormData;
  isEdit?: boolean;
}

const TestForm = ({ onSubmit, defaultValues, isEdit = false }: TestFormProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      title: "",
      description: "",
      duration: 60, // Default 60 minutes
      category: "user", // Default category is user
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="text-right">
              <FormLabel>عنوان الاختبار</FormLabel>
              <FormControl>
                <Input placeholder="أدخل عنوان الاختبار" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="text-right">
              <FormLabel>وصف الاختبار</FormLabel>
              <FormControl>
                <Textarea placeholder="أدخل وصف الاختبار" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem className="text-right">
              <FormLabel>مدة الاختبار (بالدقائق)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="60" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem className="text-right">
              <FormLabel>تصنيف الاختبار</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر تصنيف الاختبار" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="sample">اختبارات نموذجية</SelectItem>
                  <SelectItem value="user">اختبارات اسبوعية</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                يحدد هذا الخيار ما إذا كان الاختبار سيظهر في قسم الاختبارات النموذجية أو اختبارات اسبوعية
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {isEdit ? "تحديث الاختبار" : "إنشاء اختبار جديد"}
        </Button>
      </form>
    </Form>
  );
};

export default TestForm;
