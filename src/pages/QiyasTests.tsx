
import React from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface TestType {
  id: string;
  title: string;
  description: string;
  numberOfQuestions: number;
  duration: number; // in minutes
}

const mockTests: TestType[] = [
  {
    id: "test-1",
    title: "اختبار قياس تجريبي #1",
    description: "اختبار مختلط (لفظي وكمي) يحاكي اختبار القدرات العامة",
    numberOfQuestions: 50,
    duration: 75,
  },
  {
    id: "test-2",
    title: "اختبار قياس تجريبي #2",
    description: "اختبار مختلط (لفظي وكمي) مع تركيز على الأسئلة اللفظية",
    numberOfQuestions: 50,
    duration: 75,
  },
  {
    id: "test-3",
    title: "اختبار قياس تجريبي #3",
    description: "اختبار مختلط (لفظي وكمي) مع تركيز على الأسئلة الكمية",
    numberOfQuestions: 50,
    duration: 75,
  },
  {
    id: "test-4",
    title: "اختبار قياس قصير #1",
    description: "اختبار سريع لتقييم مستواك الحالي",
    numberOfQuestions: 20,
    duration: 30,
  },
  {
    id: "test-5",
    title: "اختبار قياس قصير #2",
    description: "اختبار سريع للتدرب على الأسئلة الأكثر صعوبة",
    numberOfQuestions: 20,
    duration: 30,
  },
  {
    id: "test-6",
    title: "اختبار قياس كامل",
    description: "اختبار شامل يحاكي الاختبار الحقيقي بالكامل",
    numberOfQuestions: 100,
    duration: 150,
  },
];

const QiyasTests = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleStartTest = (testId: string) => {
    // In a real app, this would navigate to the test page
    // For now, show a toast indicating this feature is coming soon
    toast({
      title: "قريباً",
      description: "سيتم إطلاق الاختبارات التجريبية قريباً",
    });
  };

  return (
    <Layout>
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">اختبارات قياس التجريبية</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              تدرب على اختبارات تحاكي اختبار القدرات العامة بقسميه اللفظي والكمي
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockTests.map((test) => (
              <Card key={test.id} className="overflow-hidden border-2 border-border bg-secondary hover:border-primary transition-colors">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{test.title}</h3>
                  <p className="text-muted-foreground mb-4">{test.description}</p>
                  <div className="flex justify-between text-sm text-muted-foreground mb-6">
                    <span className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 ml-1 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {test.numberOfQuestions} سؤال
                    </span>
                    <span className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 ml-1 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {test.duration} دقيقة
                    </span>
                  </div>
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 flex items-center justify-center"
                    onClick={() => handleStartTest(test.id)}
                  >
                    ابدأ الاختبار
                    <ArrowRight className="mr-2" size={16} />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default QiyasTests;
