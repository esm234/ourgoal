import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import {
  Search,
  HelpCircle,
  BookOpen,
  Calculator,
  Clock,
  Target,
  AlertCircle,
  CheckCircle,
  MessageCircle,
  Lightbulb,
  TrendingUp,
  Users,
  Settings,
  FileText
} from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  isPopular?: boolean;
}

const FAQ: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const faqData: FAQItem[] = [
    // دراسة وتحضير
    {
      id: '1',
      question: 'كيف أبدأ في التحضير لاختبار القدرات؟',
      answer: 'ابدأ بتحديد موعد الاختبار، ثم استخدم مولد خطة الدراسة في موقعنا لإنشاء جدول مخصص. ركز على فهم أنواع الأسئلة في الجزء اللفظي والكمي، وحل اختبارات تجريبية بانتظام.',
      category: 'study',
      tags: ['بداية', 'تحضير', 'خطة'],
      isPopular: true
    },
    {
      id: '2',
      question: 'كم من الوقت أحتاج للتحضير للاختبار؟',
      answer: 'يعتمد على مستواك الحالي، لكن ننصح بـ 2-3 أشهر للتحضير الجيد. يمكنك استخدام مولد الخطة لتحديد المدة المناسبة حسب تاريخ اختبارك.',
      category: 'study',
      tags: ['وقت', 'مدة', 'تحضير']
    },
    {
      id: '3',
      question: 'ما هو أفضل وقت لحل الاختبارات التجريبية؟',
      answer: 'ننصح بحل اختبار تجريبي كل أسبوع، ويفضل في نفس وقت الاختبار الفعلي (صباحاً). هذا يساعدك على التعود على ضغط الوقت وتحسين سرعتك.',
      category: 'study',
      tags: ['اختبارات', 'وقت', 'تجريبي']
    },

    // الجزء اللفظي
    {
      id: '4',
      question: 'كيف أحسن مهاراتي في الجزء اللفظي؟',
      answer: 'حل الكثير من الاختبارات وراجع على اخطائك بشكل مستمر وتاكد من حفظ العلاقات والتاسيس الجيد',
      category: 'verbal',
      tags: ['لفظي', 'قراءة', 'مرادفات'],
      isPopular: true
    },
    {
      id: '5',
      question: 'ما هي أفضل طريقة لحفظ المرادفات؟',
      answer: 'استخدم تقنية التكرار المتباعد، اربط الكلمات بقصص أو صور، استخدم البطاقات التعليمية، وطبق الكلمات في جمل من تأليفك.',
      category: 'verbal',
      tags: ['مرادفات', 'حفظ', 'ذاكرة']
    },

    // الجزء الكمي
    {
      id: '6',
      question: 'أواجه صعوبة في الجزء الكمي، ما الحل؟',
      answer: 'راجع الأساسيات أولاً، تدرب على حل المسائل بطرق مختلفة، وركز على فهم القوانين بدلاً من الحفظ.',
      category: 'quantitative',
      tags: ['كمي', 'رياضيات', 'صعوبة'],
      isPopular: true
    },
    {
      id: '7',
      question: 'كيف أدير الوقت في الجزء الكمي؟',
      answer: 'خصص دقيقة واحدة لكل سؤال، ابدأ بالأسئلة السهلة، لا تتردد في تخطي الأسئلة الصعبة والعودة إليها لاحقاً، واستخدم طرق الحل السريع.',
      category: 'quantitative',
      tags: ['وقت', 'إدارة', 'سرعة']
    },

    // يوم الاختبار
    {
  id: '8',
  question: 'ماذا أحضر معي يوم الاختبار؟',
  answer: 'الوثائق المطلوبة: الهوية الوطنية الأصلية (للسعوديين) أو جواز السفر مع الإقامة الأصلية (للمقيمين) - يجب التأكد من سريان المفعول ووضوح الصورة. الحضور قبل الموعد بـ30 دقيقة، وارتداء ملابس مريحة. ممنوع الدخول ب: الهواتف المحمولة، الآلات الحاسبة.',
  category: 'exam-day',
  tags: ['اختبار', 'أدوات', 'تحضير', 'وثائق', 'قوانين'],
  isPopular: true,
},
   {
      id: '9',
      question: 'كيف أتعامل مع التوتر يوم الاختبار؟',
      answer: 'نم جيداً الليلة السابقة، تناول إفطاراً صحياً، اصل مبكراً، تنفس بعمق، وتذكر أن التحضير الجيد هو أفضل علاج للتوتر.',
      category: 'exam-day',
      tags: ['توتر', 'نفسية', 'هدوء']
    },

    // تقنية ونصائح
    {
      id: '10',
      question: 'كيف أستخدم مولد خطة الدراسة؟',
      answer: 'اذهب لصفحة مولد الخطة، أدخل تاريخ اختبارك، اختر عدد جولات المراجعة ، واضغط إنشاء. ستحصل على جدول مفصل بالاختبارات اليومية.',
      category: 'platform',
      tags: ['موقع', 'خطة', 'استخدام']
    },
    {
      id: '11',
      question: 'هل يمكنني تعديل خطة الدراسة بعد إنشائها؟',
      answer: 'نعم! يمكنك تعديل اسم الخطة، عدد جولات المراجعة (حتى 5 جولات)، وتاريخ الاختبار من صفحة الملف الشخصي. سيتم إعادة حساب الجدول مع الحفاظ على تقدمك.',
      category: 'platform',
      tags: ['تعديل', 'خطة', 'مرونة']
    },

    // مشاكل شائعة
    {
      id: '12',
      question: 'لا أستطيع إنهاء الاختبار في الوقت المحدد',
      answer: 'تدرب على حل الأسئلة بسرعة، لا تقضي وقتاً طويلاً على سؤال واحد، استخدم تقنيات الحل السريع، وتدرب على اختبارات موقوتة.',
      category: 'problems',
      tags: ['وقت', 'سرعة', 'إنهاء'],
      isPopular: true
    },
    {
      id: '13',
      question: 'أنسى ما تعلمته بسرعة',
      answer: 'استخدم تقنية المراجعة المتباعدة، اربط المعلومات بأمثلة من واقعك، علّم شخصاً آخر ما تعلمته، وراجع بانتظام بدلاً من الحشو.',
      category: 'problems',
      tags: ['نسيان', 'ذاكرة', 'مراجعة']
    }
  ];

  const categories = [
    { id: 'all', name: 'جميع الأسئلة', icon: HelpCircle, color: 'from-blue-500 to-blue-600' },
    { id: 'study', name: 'الدراسة والتحضير', icon: BookOpen, color: 'from-green-500 to-green-600' },
    { id: 'verbal', name: 'الجزء اللفظي', icon: MessageCircle, color: 'from-purple-500 to-purple-600' },
    { id: 'quantitative', name: 'الجزء الكمي', icon: Calculator, color: 'from-orange-500 to-orange-600' },
    { id: 'exam-day', name: 'يوم الاختبار', icon: Target, color: 'from-red-500 to-red-600' },
    { id: 'platform', name: 'استخدام الموقع', icon: Settings, color: 'from-indigo-500 to-indigo-600' },
    { id: 'problems', name: 'مشاكل شائعة', icon: AlertCircle, color: 'from-yellow-500 to-yellow-600' }
  ];

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.tags.some(tag => tag.includes(searchQuery));
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const popularFAQs = faqData.filter(faq => faq.isPopular);

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "name": "الأسئلة الشائعة - اور جول",
    "description": "إجابات شاملة لأكثر الأسئلة والمشاكل شيوعاً التي تواجه الطلاب في التحضير لاختبار القدرات",
    "url": "https://ourgoal.pages.dev/faq",
    "mainEntity": faqData.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <Layout>
      <SEO
        title="الأسئلة الشائعة | اور جول - Our Goal"
        description="إجابات شاملة لأكثر الأسئلة والمشاكل شيوعاً التي تواجه الطلاب في التحضير لاختبار القدرات. نصائح ومساعدة في الدراسة والتحضير."
        keywords="أسئلة شائعة, اختبار القدرات, مساعدة, نصائح, تحضير, دراسة, مشاكل, حلول, اور جول"
        url="/faq"
        type="website"
        structuredData={faqStructuredData}
      />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            الأسئلة الشائعة
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            إجابات شاملة لأكثر الأسئلة والمشاكل شيوعاً التي تواجه الطلاب في التحضير لاختبار القدرات
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="ابحث في الأسئلة الشائعة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-12 py-3 text-lg rounded-xl border-2 border-primary/20 focus:border-primary/50"
            />
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card className="bg-gradient-to-br from-card/90 to-card/60 border-0 rounded-3xl backdrop-blur-xl shadow-xl sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  الأقسام
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const isActive = selectedCategory === category.id;
                  const categoryCount = category.id === 'all'
                    ? faqData.length
                    : faqData.filter(faq => faq.category === category.id).length;

                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full p-3 rounded-xl text-right transition-all duration-300 ${
                        isActive
                          ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                          : 'hover:bg-primary/10 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className={isActive ? 'bg-white/20 text-white' : ''}>
                          {categoryCount}
                        </Badge>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{category.name}</span>
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="all" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 rounded-xl">
                <TabsTrigger value="all" className="rounded-lg">
                  جميع الأسئلة ({filteredFAQs.length})
                </TabsTrigger>
                <TabsTrigger value="popular" className="rounded-lg">
                  الأكثر شيوعاً ({popularFAQs.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  {filteredFAQs.length === 0 ? (
                    <Card className="bg-gradient-to-br from-card/90 to-card/60 border-0 rounded-3xl backdrop-blur-xl shadow-xl">
                      <CardContent className="text-center py-12">
                        <Search className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-foreground mb-2">لا توجد نتائج</h3>
                        <p className="text-muted-foreground">جرب البحث بكلمات مختلفة أو اختر قسماً آخر</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <Accordion type="single" collapsible className="space-y-4">
                      {filteredFAQs.map((faq, index) => (
                        <motion.div
                          key={faq.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.05 }}
                        >
                          <AccordionItem
                            value={faq.id}
                            className="bg-gradient-to-br from-card/90 to-card/60 border-0 rounded-2xl backdrop-blur-xl shadow-lg overflow-hidden"
                          >
                            <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-primary/5 transition-colors">
                              <div className="flex items-center gap-3 text-right">
                                {faq.isPopular && (
                                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                                    شائع
                                  </Badge>
                                )}
                                <span className="font-medium text-lg">{faq.question}</span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-6">
                              <div className="space-y-4">
                                <p className="text-muted-foreground leading-relaxed text-lg">
                                  {faq.answer}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {faq.tags.map((tag) => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </motion.div>
                      ))}
                    </Accordion>
                  )}
                </motion.div>
              </TabsContent>

              <TabsContent value="popular">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20 rounded-2xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-yellow-700">
                        <TrendingUp className="w-5 h-5" />
                        الأسئلة الأكثر شيوعاً
                      </CardTitle>
                      <CardDescription>
                        هذه هي الأسئلة التي يسألها معظم الطلاب أثناء التحضير لاختبار القدرات
                      </CardDescription>
                    </CardHeader>
                  </Card>

                  <Accordion type="single" collapsible className="space-y-4">
                    {popularFAQs.map((faq, index) => (
                      <motion.div
                        key={faq.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        <AccordionItem
                          value={faq.id}
                          className="bg-gradient-to-br from-card/90 to-card/60 border-0 rounded-2xl backdrop-blur-xl shadow-lg overflow-hidden"
                        >
                          <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-primary/5 transition-colors">
                            <div className="flex items-center gap-3 text-right">
                              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                                #{index + 1}
                              </Badge>
                              <span className="font-medium text-lg">{faq.question}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-6 pb-6">
                            <div className="space-y-4">
                              <p className="text-muted-foreground leading-relaxed text-lg">
                                {faq.answer}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {faq.tags.map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </motion.div>
                    ))}
                  </Accordion>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16"
        >
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 rounded-3xl">
            <CardContent className="text-center py-12">
              <Users className="w-16 h-16 text-primary mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-foreground mb-4">لم تجد إجابة لسؤالك؟</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                انضم إلى مجتمعنا على تليجرام للحصول على مساعدة من الطلاب والخبراء
              </p>
              <a
                href="https://linktr.ee/Our_goal"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-black font-bold px-8 py-3 rounded-xl hover:scale-105 transition-transform duration-300"
              >
                <MessageCircle className="w-5 h-5" />
                انضم للمجتمع
              </a>
            </CardContent>
          </Card>
        </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default FAQ;
