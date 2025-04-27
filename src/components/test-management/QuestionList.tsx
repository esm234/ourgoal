
import React from "react";
import { Question } from "@/types/testManagement";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash, PenLine } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface QuestionListProps {
  questions: Question[];
  loading: boolean;
  onDelete: (id: string) => void;
}

const QuestionList = ({ questions, loading, onDelete }: QuestionListProps) => {
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

  const getQuestionTypeText = (type: string) => {
    switch (type) {
      case "verbal":
        return "لفظي";
      case "quantitative":
        return "كمي";
      case "mixed":
        return "مختلط";
      default:
        return type;
    }
  };

  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <Card key={question.id} className="border-l-4 border-l-primary">
          <Collapsible>
            <CollapsibleTrigger className="w-full">
              <CardHeader className="pb-2 text-right">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">
                    {getQuestionTypeText(question.type)}
                  </Badge>
                  <CardTitle className="text-lg">
                    السؤال {question.question_order}
                  </CardTitle>
                </div>
                <CardDescription className="line-clamp-2 text-right">
                  {question.text}
                </CardDescription>
              </CardHeader>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="space-y-4 text-right">
                  <div>
                    <h3 className="font-medium text-right mb-2">الخيارات:</h3>
                    <div className="grid gap-2">
                      {question.options.map((option) => (
                        <div 
                          key={option.id} 
                          className={`p-3 rounded-md ${
                            option.is_correct 
                              ? "bg-primary/10 border border-primary" 
                              : "bg-muted"
                          }`}
                        >
                          {option.is_correct && (
                            <Badge className="mb-2">الإجابة الصحيحة</Badge>
                          )}
                          <p>{option.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {question.explanation && (
                    <div>
                      <h3 className="font-medium text-right mb-2">شرح الإجابة:</h3>
                      <p className="text-muted-foreground">{question.explanation}</p>
                    </div>
                  )}

                  <div className="flex justify-end gap-2 pt-2">
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
