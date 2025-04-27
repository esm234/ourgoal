import React, { useState } from "react";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Trash, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const optionSchema = z.object({
  text: z.string().min(1, "نص الخيار مطلوب"),
  is_correct: z.boolean().default(false),
});

const formSchema = z.object({
  mode: z.enum(["text", "image"]),
  text: z.string().optional(),
  type: z.enum(["verbal", "quantitative", "mixed"]),
  explanation: z.string().optional(),
  image_url: z.string().url("رابط الصورة غير صالح").optional().or(z.literal("").optional()),
  options: z
    .array(optionSchema)
    .min(2, "يجب إضافة خيارين على الأقل")
    .max(6, "يمكنك إضافة 6 خيارات كحد أقصى")
    .refine((options) => options.some((option) => option.is_correct), {
      message: "يجب تحديد إجابة صحيحة واحدة على الأقل",
    }),
}).superRefine((data, ctx) => {
  if (data.mode === "text" && (!data.text || !data.text.trim())) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "نص السؤال مطلوب",
      path: ["text"],
    });
  }
  if (data.mode === "image" && (!data.image_url || !data.image_url.trim())) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "رابط الصورة مطلوب",
      path: ["image_url"],
    });
  }
});

type FormData = z.infer<typeof formSchema>;

interface QuestionFormProps {
  onSubmit: (data: FormData) => void;
  defaultValues?: FormData;
  isEdit?: boolean;
}

const QuestionForm = ({
  onSubmit,
  defaultValues,
  isEdit = false,
}: QuestionFormProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(defaultValues?.image_url || null);
  const [isUploading, setIsUploading] = useState(false);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      mode: "text",
      text: "",
      type: "mixed",
      explanation: "",
      image_url: "",
      options: [
        { text: "", is_correct: false },
        { text: "", is_correct: false },
        { text: "", is_correct: false },
        { text: "", is_correct: false },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options",
  });

  // Make sure only one option can be marked as correct
  const handleCorrectChange = (index: number, value: boolean) => {
    if (value) {
      // If this option is being marked as correct, unmark all others
      const options = [...form.getValues("options")];
      options.forEach((option, i) => {
        if (i !== index) {
          form.setValue(`options.${i}.is_correct`, false);
        }
      });
    }
  };

  // Toggle between text and image mode
  const mode = form.watch("mode");

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `question-images/${fileName}`;

      // Upload file to Supabase storage
      const { error: uploadError, data } = await supabase.storage
        .from('questions')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('questions')
        .getPublicUrl(filePath);

      // Update form and preview
      form.setValue('image_url', publicUrl);
      setImagePreview(publicUrl);
    } catch (error) {
      console.error('Error uploading file:', error);
      // You might want to show an error toast here
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex gap-4 mb-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="text"
              checked={mode === "text"}
              onChange={() => form.setValue("mode", "text")}
            />
            سؤال نصي
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="image"
              checked={mode === "image"}
              onChange={() => form.setValue("mode", "image")}
            />
            سؤال صورة
          </label>
        </div>
        {mode === "text" && (
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem className="text-right">
                <FormLabel>نص السؤال</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="أدخل نص السؤال هنا"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {mode === "image" && (
          <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
              <FormItem className="text-right">
                <FormLabel>صورة السؤال</FormLabel>
                <FormControl>
                  <div>
                    <Input
                      type="url"
                      placeholder="أدخل رابط الصورة أو قم برفع صورة"
                      value={field.value || ""}
                      onChange={e => {
                        field.onChange(e.target.value);
                        setImagePreview(e.target.value);
                      }}
                    />
                    <Input
                      type="file"
                      accept="image/*"
                      className="mt-2"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // Show local preview immediately
                          const localUrl = URL.createObjectURL(file);
                          setImagePreview(localUrl);
                          // Upload to Supabase
                          handleFileUpload(file);
                        }
                      }}
                      disabled={isUploading}
                    />
                    {isUploading && (
                      <p className="text-sm text-muted-foreground mt-2">جاري رفع الصورة...</p>
                    )}
                    {imagePreview && (
                      <img src={imagePreview} alt="معاينة الصورة" className="mt-2 max-h-40 rounded border" />
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="text-right">
              <FormLabel>نوع السؤال</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع السؤال" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="verbal">لفظي</SelectItem>
                  <SelectItem value="quantitative">كمي</SelectItem>
                  <SelectItem value="mixed">مختلط</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel>الخيارات</FormLabel>
            {fields.length < 6 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ text: "", is_correct: false })}
              >
                <Plus className="h-4 w-4 mr-1" />
                إضافة خيار
              </Button>
            )}
          </div>

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex items-start space-x-2 space-x-reverse"
            >
              <FormField
                control={form.control}
                name={`options.${index}.text`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder={`الخيار ${index + 1}`} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`options.${index}.is_correct`}
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(value) => {
                          field.onChange(value);
                          handleCorrectChange(index, value as boolean);
                        }}
                      />
                    </FormControl>
                    <div className="text-xs">صحيح</div>
                  </FormItem>
                )}
              />

              {fields.length > 2 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <FormMessage>{form.formState.errors.options?.message}</FormMessage>
        </div>

        <FormField
          control={form.control}
          name="explanation"
          render={({ field }) => (
            <FormItem className="text-right">
              <FormLabel>شرح الإجابة (اختياري)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="أدخل شرحاً للإجابة الصحيحة (اختياري)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {isEdit ? "تحديث السؤال" : "إضافة السؤال"}
        </Button>
      </form>
    </Form>
  );
};

export default QuestionForm;
