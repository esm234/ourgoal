import React, { useState, useEffect, useRef } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Trash,
  Plus,
  Save,
  ArrowLeft,
  FileText,
  Image,
  Calculator,
  BookOpen,
  BookText,
  Sparkles
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const optionSchema = z.object({
  text: z.string().min(1, "نص الخيار مطلوب"),
  is_correct: z.boolean().default(false),
});

const formSchema = z.object({
  mode: z.enum(["text", "image"]),
  text: z.string().optional(),
  type: z.enum(["verbal", "quantitative", "mixed"]),
  subtype: z.enum(["general", "reading_comprehension"]).optional().default("general"),
  passage: z.string().optional(),
  explanation: z.string().optional(),
  image_url: z.string().optional(),
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
  if (data.mode === "image" && !data.image_url) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "يرجى رفع صورة للسؤال",
      path: ["image_url"],
    });
  }
  if (data.type === "verbal" && data.subtype === "reading_comprehension" && (!data.passage || !data.passage.trim())) {
    console.log("Validation error: Reading comprehension question missing passage");
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "نص القطعة مطلوب لأسئلة استيعاب المقروء",
      path: ["passage"],
    });
  }
});

type FormData = z.infer<typeof formSchema>;

interface QuestionFormProps {
  onSubmit: (data: FormData, action?: 'add_another' | 'return') => void;
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
  const [formKey, setFormKey] = useState(0); // Used to reset the form
  const textInputRef = useRef<HTMLTextAreaElement>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      mode: "text",
      text: "",
      type: "mixed",
      subtype: "general",
      passage: "",
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

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "options",
  });

  // Focus on the first field when the component mounts or after submission
  useEffect(() => {
    if (textInputRef.current && !isEdit) {
      setTimeout(() => {
        textInputRef.current?.focus();
      }, 100);
    }
  }, [formKey, isEdit]);

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

  // Handle form submission with action type
  const handleSubmit = (action?: 'add_another' | 'return') => {
    form.handleSubmit((data) => {
      console.log("Form data before submission:", data);

      // Check if this is a reading comprehension question
      if (data.type === "verbal" && data.subtype === "reading_comprehension") {
        console.log("Reading comprehension question detected. Passage:", data.passage);
      }

      onSubmit(data, action);

      // If adding another, reset the form
      if (action === 'add_another' && !isEdit) {
        form.reset({
          mode: "text",
          text: "",
          type: data.type, // Keep the same type
          subtype: data.subtype, // Keep the same subtype
          passage: data.type === "verbal" && data.subtype === "reading_comprehension" ? data.passage : "", // Keep passage for reading comprehension
          explanation: "",
          image_url: "",
          options: [
            { text: "", is_correct: false },
            { text: "", is_correct: false },
            { text: "", is_correct: false },
            { text: "", is_correct: false },
          ],
        });
        setImagePreview(null);
        setFormKey(prev => prev + 1); // Increment key to trigger re-render
      }
    })();
  };

  // Toggle between text and image mode
  const mode = form.watch("mode");
  const questionType = form.watch("type");
  const questionSubtype = form.watch("subtype");

  // Update option labels based on question type
  useEffect(() => {
    if (questionType === "quantitative") {
      // For quantitative questions, use Arabic letters
      const arabicLabels = ["أ", "ب", "ج", "د", "هـ", "و"];
      const currentOptions = form.getValues("options");

      // Update option labels while preserving is_correct values
      const updatedOptions = currentOptions.map((option, index) => ({
        text: option.text.startsWith(arabicLabels[index]) ? option.text : `${arabicLabels[index]}. ${option.text.replace(/^[أ-ي]\.\s*/, "")}`,
        is_correct: option.is_correct
      }));

      // Update all options at once
      form.setValue("options", updatedOptions);
    }
  }, [questionType, form]);

  return (
    <Form {...form}>
      <form key={formKey} className="space-y-8">
        {/* Question Type Selection */}
        <Card className="border border-primary/10 shadow-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="text-right">
                      <FormLabel className="text-base font-semibold">نوع السؤال</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          // Reset subtype when changing question type
                          if (value !== "verbal") {
                            form.setValue("subtype", "general");
                          }
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="اختر نوع السؤال" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="verbal" className="flex items-center gap-2">
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-4 w-4 text-primary" />
                              <span>لفظي</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="quantitative" className="flex items-center gap-2">
                            <div className="flex items-center gap-2">
                              <Calculator className="h-4 w-4 text-primary" />
                              <span>كمي</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="mixed" className="flex items-center gap-2">
                            <div className="flex items-center gap-2">
                              <Sparkles className="h-4 w-4 text-primary" />
                              <span>مختلط</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {questionType === "verbal" && (
                <div>
                  <FormField
                    control={form.control}
                    name="subtype"
                    render={({ field }) => (
                      <FormItem className="text-right">
                        <FormLabel className="text-base font-semibold">نوع السؤال اللفظي</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="اختر نوع السؤال اللفظي" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="general" className="flex items-center gap-2">
                              <div className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-primary" />
                                <span>عام</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="reading_comprehension" className="flex items-center gap-2">
                              <div className="flex items-center gap-2">
                                <BookText className="h-4 w-4 text-primary" />
                                <span>استيعاب المقروء</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            <div className="mt-6">
              <div className="flex gap-4 mb-4">
                <Button
                  type="button"
                  variant={mode === "text" ? "default" : "outline"}
                  className={cn(
                    "flex-1 h-12",
                    mode === "text" ? "bg-primary/90 hover:bg-primary" : ""
                  )}
                  onClick={() => form.setValue("mode", "text")}
                >
                  <FileText className="h-5 w-5 mr-2" />
                  سؤال نصي
                </Button>
                <Button
                  type="button"
                  variant={mode === "image" ? "default" : "outline"}
                  className={cn(
                    "flex-1 h-12",
                    mode === "image" ? "bg-primary/90 hover:bg-primary" : ""
                  )}
                  onClick={() => form.setValue("mode", "image")}
                >
                  <Image className="h-5 w-5 mr-2" />
                  سؤال صورة
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reading Passage (for verbal reading comprehension) */}
        {questionType === "verbal" && questionSubtype === "reading_comprehension" && (
          <Card className="border border-primary/10 shadow-sm">
            <CardContent className="p-6">
              <FormField
                control={form.control}
                name="passage"
                render={({ field }) => (
                  <FormItem className="text-right">
                    <FormLabel className="text-base font-semibold">نص القطعة</FormLabel>
                    <FormDescription>
                      أدخل نص القطعة التي سيتم ربط الأسئلة بها
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        placeholder="أدخل نص القطعة هنا..."
                        className="min-h-[200px] text-base leading-relaxed"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        )}

        {/* Question Content */}
        <Card className="border border-primary/10 shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">محتوى السؤال</h3>

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
                        className="min-h-[100px] text-base"
                        {...field}
                        ref={textInputRef}
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
                      <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-6 text-center">
                        {!imagePreview ? (
                          <div>
                            <Image className="h-12 w-12 mx-auto mb-4 text-muted-foreground/70" />
                            <p className="text-muted-foreground mb-4">اسحب الصورة هنا أو انقر للاختيار</p>
                            <Input
                              type="file"
                              accept="image/*"
                              className="mx-auto max-w-xs"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  try {
                                    setIsUploading(true);
                                    // Create a unique file name
                                    const fileExt = file.name.split('.').pop();
                                    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
                                    const filePath = `question-images/${fileName}`;

                                    // Upload file to Supabase storage
                                    const { error: uploadError } = await supabase.storage
                                      .from('questions')
                                      .upload(filePath, file);

                                    if (uploadError) throw uploadError;

                                    // Get the public URL
                                    const { data: { publicUrl } } = supabase.storage
                                      .from('questions')
                                      .getPublicUrl(filePath);

                                    // Update form and preview
                                    field.onChange(publicUrl);
                                    setImagePreview(publicUrl);
                                  } catch (error) {
                                    console.error('Error uploading file:', error);
                                    // You might want to show an error toast here
                                  } finally {
                                    setIsUploading(false);
                                  }
                                }
                              }}
                              disabled={isUploading}
                            />
                          </div>
                        ) : (
                          <div className="relative">
                            <img
                              src={imagePreview}
                              alt="معاينة الصورة"
                              className="max-h-60 mx-auto rounded border"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => {
                                field.onChange("");
                                setImagePreview(null);
                              }}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                            <p className="text-sm text-muted-foreground mt-4">
                              تم رفع الصورة بنجاح
                            </p>
                          </div>
                        )}
                        {isUploading && (
                          <p className="text-sm text-primary mt-4">جاري رفع الصورة...</p>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </CardContent>
        </Card>

        {/* Answer Options */}
        <Card className="border border-primary/10 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">خيارات الإجابة</h3>
              {fields.length < 6 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ text: "", is_correct: false })}
                >
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة خيار
                </Button>
              )}
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => {
                const optionLabels = questionType === "quantitative"
                  ? ["أ", "ب", "ج", "د", "هـ", "و"]
                  : ["الخيار 1", "الخيار 2", "الخيار 3", "الخيار 4", "الخيار 5", "الخيار 6"];

                return (
                  <div
                    key={field.id}
                    className={cn(
                      "flex items-center space-x-2 space-x-reverse p-3 rounded-md",
                      form.watch(`options.${index}.is_correct`)
                        ? "bg-primary/10 border border-primary/20"
                        : "bg-card border"
                    )}
                  >
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-muted">
                      <span className="font-semibold">{questionType === "quantitative" ? optionLabels[index] : (index + 1)}</span>
                    </div>

                    <FormField
                      control={form.control}
                      name={`options.${index}.text`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              placeholder={`${optionLabels[index]}`}
                              className="border-0 bg-transparent focus-visible:ring-0 text-base px-2"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`options.${index}.is_correct`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={(value) => {
                                  field.onChange(value);
                                  handleCorrectChange(index, value as boolean);
                                }}
                                className="h-5 w-5"
                              />
                              <span className="text-sm">الإجابة الصحيحة</span>
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {fields.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                );
              })}
              <FormMessage>{form.formState.errors.options?.message}</FormMessage>
            </div>
          </CardContent>
        </Card>

        {/* Explanation */}
        <Card className="border border-primary/10 shadow-sm">
          <CardContent className="p-6">
            <FormField
              control={form.control}
              name="explanation"
              render={({ field }) => (
                <FormItem className="text-right">
                  <FormLabel className="text-base font-semibold">شرح الإجابة (اختياري)</FormLabel>
                  <FormDescription>
                    أضف شرحاً للإجابة الصحيحة ليظهر للطلاب بعد الإجابة
                  </FormDescription>
                  <FormControl>
                    <Textarea
                      placeholder="أدخل شرحاً للإجابة الصحيحة (اختياري)"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <Button
            type="button"
            className="flex-1 h-12 bg-primary/90 hover:bg-primary"
            onClick={() => handleSubmit('add_another')}
          >
            <Save className="h-5 w-5 ml-2" />
            {isEdit ? "تحديث وإضافة سؤال آخر" : "حفظ وإضافة سؤال آخر"}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="flex-1 h-12"
            onClick={() => handleSubmit('return')}
          >
            <ArrowLeft className="h-5 w-5 ml-2" />
            {isEdit ? "تحديث والعودة للقائمة" : "حفظ والعودة للقائمة"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default QuestionForm;
