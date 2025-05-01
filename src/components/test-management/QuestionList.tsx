import React from "react";
import { Question } from "@/types/testManagement";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash, PenLine, BookText, Calculator, BookOpen, Image } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface QuestionListProps {
  questions: Question[];
  loading: boolean;
  onDelete: (id: string) => void;
  onEdit: (question: Question) => void;
}

const QuestionList = ({ questions, loading, onDelete, onEdit }: QuestionListProps) => {
  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground mb-4">لا توجد أسئلة بعد</p>
      </div>
    );
  }

  const getQuestionTypeText = (type: string, subtype?: string) => {
    switch (type) {
      case "verbal":
        if (subtype === "reading_comprehension") {
          return "لفظي - استيعاب المقروء";
        }
        return "لفظي";
      case "quantitative":
        return "كمي";
      case "mixed":
        return "مختلط";
      default:
        return type;
    }
  };

  const getQuestionTypeIcon = (type: string, subtype?: string) => {
    switch (type) {
      case "verbal":
        if (subtype === "reading_comprehension") {
          return <BookText className="h-4 w-4 text-primary" />;
        }
        return <BookOpen className="h-4 w-4 text-primary" />;
      case "quantitative":
        return <Calculator className="h-4 w-4 text-primary" />;
      default:
        return <BookOpen className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <Card
          key={question.id}
          className={`border-l-4 ${
            question.type === 'verbal'
              ? question.subtype === 'reading_comprehension'
                ? 'border-l-blue-600'
                : 'border-l-primary'
              : question.type === 'quantitative'
                ? 'border-l-amber-600'
                : 'border-l-primary'
          }`}
        >
          <Collapsible>
            <CollapsibleTrigger className="w-full">
              <CardHeader className="pb-2 text-right">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`flex items-center gap-1 ${
                        question.type === 'verbal'
                          ? question.subtype === 'reading_comprehension'
                            ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                            : 'bg-primary/10 text-primary border-primary/20'
                          : question.type === 'quantitative'
                            ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                            : 'bg-primary/10 text-primary border-primary/20'
                      }`}
                    >
                      {getQuestionTypeIcon(question.type, question.subtype)}
                      <span>{getQuestionTypeText(question.type, question.subtype)}</span>
                    </Badge>

                    {question.image_url && (
                      <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
                        <Image className="h-3 w-3 mr-1" />
                        <span>صورة</span>
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg">
                    السؤال {question.question_order} من {questions.length}
                  </CardTitle>
                </div>
                <CardDescription className="line-clamp-2 text-right mt-2">
                  {question.text}
                </CardDescription>
              </CardHeader>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="space-y-4 text-right">
                  {/* Reading Passage */}
                  {question.type === 'verbal' && question.subtype === 'reading_comprehension' && question.passage && (
                    <div className="mb-4">
                      <h3 className="font-medium text-right mb-2 flex items-center gap-2">
                        <BookText className="h-4 w-4 text-blue-500" />
                        نص القطعة:
                      </h3>
                      <div className="bg-blue-500/5 border border-blue-500/20 p-4 rounded-md">
                        <p className="text-sm whitespace-pre-line">{question.passage}</p>
                      </div>
                    </div>
                  )}

                  {/* Question Image */}
                  {question.image_url && (
                    <div className="mb-4">
                      <h3 className="font-medium text-right mb-2 flex items-center gap-2">
                        <Image className="h-4 w-4 text-purple-500" />
                        صورة السؤال:
                      </h3>
                      <div className="flex justify-center bg-muted/50 p-2 rounded-md">
                        <img
                          src={question.image_url}
                          alt="صورة السؤال"
                          className="max-h-60 rounded-md"
                        />
                      </div>
                    </div>
                  )}

                  <Separator className="my-4" />

                  {/* Options */}
                  <div>
                    <h3 className="font-medium text-right mb-2">الخيارات:</h3>
                    <div className="grid gap-2">
                      {question.options.map((option, index) => {
                        const optionLabels = question.type === "quantitative"
                          ? ["أ", "ب", "ج", "د", "هـ", "و"]
                          : ["1", "2", "3", "4", "5", "6"];

                        return (
                          <div
                            key={option.id}
                            className={`p-3 rounded-md flex items-start gap-3 ${
                              option.is_correct
                                ? "bg-primary/10 border border-primary/20"
                                : "bg-muted"
                            }`}
                          >
                            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-muted-foreground/20 flex-shrink-0 mt-0.5">
                              <span className="text-sm font-medium">{question.type === "quantitative" ? optionLabels[index] : (index + 1)}</span>
                            </div>
                            <div className="flex-1">
                              {option.is_correct && (
                                <Badge className="mb-2 bg-green-500">الإجابة الصحيحة</Badge>
                              )}
                              <p>{option.text}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Explanation */}
                  {question.explanation && (
                    <div>
                      <h3 className="font-medium text-right mb-2">شرح الإجابة:</h3>
                      <div className="bg-muted p-3 rounded-md">
                        <p className="text-muted-foreground">{question.explanation}</p>
                      </div>
                    </div>
                  )}

                  <Separator className="my-4" />

                  {/* Actions */}
                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(question);
                      }}
                    >
                      <PenLine className="h-4 w-4 mr-1" />
                      تعديل
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(question.id);
                      }}
                    >
                      <Trash className="h-4 w-4 mr-1" />
                      حذف
                    </Button>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      ))}
    </div>
  );
};

export default QuestionList;
