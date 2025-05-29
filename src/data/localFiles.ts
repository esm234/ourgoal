// =====================================================
// LOCAL FILES DATA - بيانات الملفات المحلية
// جميع ملفات المنصة مخزنة محلياً لتوفير استهلاك Supabase
// =====================================================

export interface FileData {
  id: number;
  title: string;
  description: string;
  category: 'verbal' | 'quantitative' | 'mixed' | 'general';
  file_url: string;
  file_size: string;
  downloads: number;
  created_at: string;
}

export interface ExamData {
  id: number;
  file_id: number;
  title: string;
  google_form_url: string;
  duration?: number;
  questions?: number;
  attempts: number;
  created_at: string;
}

// Helper function to get today's date with different times
const getTodayWithTime = (hour: number, minute: number = 0) => {
  const today = new Date();
  today.setHours(hour, minute, 0, 0);
  return today.toISOString();
};

// Fixed realistic download counts - no randomness to avoid decreasing numbers

// =====================================================
// FILES DATA - بيانات الملفات
// =====================================================
export const filesData: FileData[] = [
  // الملفات الأصلية
  {
    id: 1,
    title: 'بصمجة آمون ( بصمج بشياكة )',
    description: 'بنقدملكم ملف بصمجة آمون ( بصمج ب شياكة سابقا ) 🚶❤️\n\nوربنا يوفقكم يا شباب وبنبهه مينفعش تبصمج من غير ما تكون فاهم',
    category: 'verbal',
    file_url: 'https://drive.google.com/file/d/1nigAlfxIBRQk2JxjXaHHfk4Cnky3SqhQ/view?usp=sharing',
    file_size: '3.6 MB',
    downloads: 1567,
    created_at: getTodayWithTime(8, 0)
  },
  {
    id: 2,
    title: 'ملخص القطع',
    description: 'و اخيرااااااا خلصنا ملف من أجمد الملفات العملناها او أجمدهم فعلا⚡️⚡️\n\nالملف اللي هيحل معاك مشكلة الأستيعاب بشكل كامل⚡️🫣\n\nجمعنا فيه القطع الصعبه و تم تلخيصها و شرحها بشكل مفصل مع شويه جمل و صور للبصمجه يعني هتجيب الأستيعاب في شوال🫵🏻\n\nالملف محلل فقط للمشتركين بدورة مستر إيهاب عبد العظيم🫡',
    category: 'verbal',
    file_url: 'https://drive.google.com/file/d/1jcwCdudm0CBaCHCtmcKf64MCBb_HQB-E/view?usp=sharing',
    file_size: '900 KB',
    downloads: 2456,
    created_at: getTodayWithTime(8, 15)
  },
  {
    id: 3,
    title: 'ملف العلاقات',
    description: 'الملف غير محلل لغير المشتركين بدورة\nأ/ايهاب عبدالعظيم‼️',
    category: 'verbal',
    file_url: 'https://drive.google.com/file/d/14O_uIGONJUJIY09S_G0dsIqC2JrNTXwP/view?usp=sharing',
    file_size: '2.0 MB',
    downloads: 1234,
    created_at: getTodayWithTime(8, 30)
  },
  {
    id: 4,
    title: 'ملف الاجابة الواحدة',
    description: 'الملف غير محلل لغير المشتركين بدورة\nأ/ايهاب عبدالعظيم‼️',
    category: 'verbal',
    file_url: 'https://drive.google.com/file/d/19-puGK_IV2sm_OJMgVRl-4oAE1K7v-1O/view?usp=sharing',
    file_size: '1 MB',
    downloads: 987,
    created_at: getTodayWithTime(8, 45)
  },
  {
    id: 5,
    title: 'بسبوسة المعاني',
    description: 'الملف اللي هيحل اغلب مشاكل في اللفظي ، مجمع كل الكلمات الصعبة في المحوسب بمعانيهم مع وجود ميزة البحث عشان لو في كلمة وقفت معاك و انت بتذاكر تقدر تطلعها في ثانيا🤩',
    category: 'verbal',
    file_url: 'https://drive.google.com/file/d/11kHLWOnxOMN4F3BKSLQViNWTbo91RmXe/view?usp=sharing',
    file_size: '415 KB',
    downloads: 3789,
    created_at: getTodayWithTime(9, 0)
  },
  {
    id: 6,
    title: 'المفردة المتشابهة',
    description: 'الملف غير محلل لغير المشتركين بدورة\nأ/ايهاب عبدالعظيم‼️',
    category: 'verbal',
    file_url: 'https://drive.google.com/file/d/1tQPy6FRP6bWMi3ea8bXyJHPc-rEq2stP/view?usp=sharing',
    file_size: '300 KB',
    downloads: 823,
    created_at: getTodayWithTime(9, 15)
  },
  {
    id: 7,
    title: 'انسب عنوان للنص',
    description: 'الملف غير محلل لغير المشتركين بدورة\nأ/ايهاب عبدالعظيم‼️',
    category: 'verbal',
    file_url: 'https://drive.google.com/file/d/1dDapxaMmnlrCmaRgDAl3rCPBvsmA6r6N/view?usp=sharing',
    file_size: '1 MB',
    downloads: 1089,
    created_at: getTodayWithTime(9, 30)
  },
  {
    id: 8,
    title: 'التعداد',
    description: 'الملف غير محلل لغير المشتركين بدورة\nأ/ايهاب عبدالعظيم‼️',
    category: 'verbal',
    file_url: 'https://drive.google.com/file/d/1gqMasKJBcfcJRx9Gmto2_bj84-8o13QO/view?usp=sharing',
    file_size: '1 MB',
    downloads: 756,
    created_at: getTodayWithTime(9, 45)
  },
  {
    id: 9,
    title: 'الخطأ السياقي',
    description: 'الملف غير محلل لغير المشتركين بدورة\nأ/ايهاب عبدالعظيم‼️',
    category: 'verbal',
    file_url: 'https://drive.google.com/file/d/10QmflW9-yTK2oR9dxXrWWkPe-zmtojQT/view?usp=sharing',
    file_size: '1 MB',
    downloads: 542,
    created_at: getTodayWithTime(10, 0)
  },
  {
    id: 10,
    title: 'قطع ال٩٥ العائدة',
    description: 'الملف غير محلل لغير المشتركين بدورة\nأ/ايهاب عبدالعظيم‼️',
    category: 'verbal',
    file_url: 'https://drive.google.com/file/d/1KvmgatCuii4Xoklf1kkjQ1tQIXREYOZH/view?usp=sharing',
    file_size: '1 MB',
    downloads: 498,
    created_at: getTodayWithTime(10, 15)
  },
  {
    id: 11,
    title: 'ملخص التأسيس الشامل لفظي أور جول',
    description: 'الملف غير محلل لغير المشتركين بدورة\nأ/ايهاب عبدالعظيم‼️',
    category: 'verbal',
    file_url: 'https://drive.google.com/file/d/19haE4VluUmRV9B8LNP2GFx5FeJIHHYIl/view?usp=sharing',
    file_size: '2.5 MB',
    downloads: 2134,
    created_at: getTodayWithTime(10, 30)
  },
  {
    id: 12,
    title: 'الاعمار',
    description: 'الملف غير محلل لغير المشتركين بدورة\nأ/محمود المنصف‼️',
    category: 'verbal',
    file_url: 'https://drive.google.com/file/d/1tx5Pb_1Bktj9qEiz-JTqz6iWRlA4Zrxt/view?usp=sharing',
    file_size: '2 MB',
    downloads: 456,
    created_at: getTodayWithTime(10, 45)
  },
  // الملفات الكمية
  {
    id: 13,
    title: 'ملف القوانين',
    description: 'ملف قوانين الكمي | المحوسب\n\n- الملف مجمع كل قوانين الكمي الموجوده في البنوك⚡️',
    category: 'quantitative',
    file_url: 'https://drive.google.com/file/d/1wwtjnfI1UK4z_b82v1uh79PP9Y7fEDIZ/view?usp=sharing',
    file_size: '1 MB',
    downloads: 1823,
    created_at: getTodayWithTime(11, 0)
  },
  {
    id: 14,
    title: 'متشابهات الكمي',
    description: 'ملف المتشابهات في ثوبة الجديد🫡\n\nو اخيرا و بما أن الملف نال اعجابكم حدثناه للبنك ١٠٠ ، مش بس كدا !\nلا و كمان غيرنا التصميم و عدلنا كتير عشان نسهل عليكم مذاكرتكم و تستمتعوا بشكل و جوده اقوى☝️🏻\n\nياريت متنسوناش في دعواتكم🤍',
    category: 'quantitative',
    file_url: 'https://drive.google.com/file/d/1uNNLtS2sMtHhNoAop4rOTC1cOQCrv_Up/view?usp=sharing',
    file_size: '11 MB',
    downloads: 3245,
    created_at: getTodayWithTime(11, 15)
  },
  {
    id: 15,
    title: 'مسائل السرعة',
    description: 'الملف غير محلل لغير المشتركين بدورة\nأ/محمود المنصف‼️',
    category: 'quantitative',
    file_url: 'https://drive.google.com/file/d/1dauWYFbaVIIQG9QsPezVDEYG6B50dcZ3/view?usp=sharing',
    file_size: '1 MB',
    downloads: 387,
    created_at: getTodayWithTime(11, 30)
  },
  {
    id: 16,
    title: 'المتتابعات',
    description: 'الملف غير محلل لغير المشتركين بدورة\nأ/محمود المنصف‼️',
    category: 'quantitative',
    file_url: 'https://drive.google.com/file/d/1CQDNKGlxyCrC0GVh2ZscI4Jl4KEz8mBi/view?usp=sharing',
    file_size: '80 MB',
    downloads: 2367,
    created_at: getTodayWithTime(11, 45)
  },
  {
    id: 17,
    title: 'مسائل صيغتها مشابهة',
    description: 'الملف غير محلل لغير المشتركين بدورة\nأ/محمود المنصف‼️',
    category: 'quantitative',
    file_url: 'https://drive.google.com/file/d/16aLb8MUonvQlquEEqcmskYcb0mYS8yqT/view?usp=sharing',
    file_size: '55 MB',
    downloads: 1987,
    created_at: getTodayWithTime(12, 0)
  },
  {
    id: 18,
    title: 'ملف تقفيلات الكمي',
    description: 'الملف غير محلل لغير المشتركين بدورة\nأ/محمود المنصف‼️\n\nياريت متنسوناش في دعواتكم🤍',
    category: 'quantitative',
    file_url: 'https://drive.google.com/file/d/1xsGybcYrWiHwzEwV5F9wNQt8dG-u06Tt/view?usp=sharing',
    file_size: '18 MB',
    downloads: 342,
    created_at: getTodayWithTime(12, 15)
  }
];

// =====================================================
// EXAMS DATA - بيانات الاختبارات
// =====================================================
export const examsData: ExamData[] = [
  // اختبارات الملفات اللفظية
  { id: 1, file_id: 1, title: 'اختبار بصمجة آمون', google_form_url: 'https://forms.google.com/basmaga-amun', duration: 45, questions: 20, attempts: 623, created_at: getTodayWithTime(8, 30) },
  { id: 2, file_id: 2, title: 'اختبار ملخص القطع', google_form_url: 'https://forms.google.com/summary-passages', duration: 60, questions: 25, attempts: 834, created_at: getTodayWithTime(8, 45) },
  { id: 3, file_id: 3, title: 'اختبار العلاقات', google_form_url: 'https://forms.google.com/relations', duration: 40, questions: 18, attempts: 456, created_at: getTodayWithTime(9, 0) },
  { id: 4, file_id: 4, title: 'اختبار الاجابة الواحدة', google_form_url: 'https://forms.google.com/single-answer', duration: 35, questions: 15, attempts: 367, created_at: getTodayWithTime(9, 15) },
  { id: 5, file_id: 5, title: 'اختبار بسبوسة المعاني', google_form_url: 'https://forms.google.com/meanings', duration: 50, questions: 30, attempts: 1045, created_at: getTodayWithTime(9, 30) },
  { id: 6, file_id: 6, title: 'اختبار المفردة المتشابهة', google_form_url: 'https://forms.google.com/similar-words', duration: 30, questions: 12, attempts: 298, created_at: getTodayWithTime(9, 45) },
  { id: 7, file_id: 7, title: 'اختبار انسب عنوان للنص', google_form_url: 'https://forms.google.com/best-title', duration: 45, questions: 20, attempts: 423, created_at: getTodayWithTime(10, 0) },
  { id: 8, file_id: 8, title: 'اختبار التعداد', google_form_url: 'https://forms.google.com/enumeration', duration: 40, questions: 16, attempts: 234, created_at: getTodayWithTime(10, 15) },
  { id: 9, file_id: 9, title: 'اختبار الخطأ السياقي', google_form_url: 'https://forms.google.com/contextual-error', duration: 35, questions: 14, attempts: 198, created_at: getTodayWithTime(10, 30) },
  { id: 10, file_id: 10, title: 'اختبار قطع ال٩٥ العائدة', google_form_url: 'https://forms.google.com/95-passages', duration: 55, questions: 22, attempts: 167, created_at: getTodayWithTime(10, 45) },
  { id: 11, file_id: 11, title: 'اختبار التأسيس الشامل', google_form_url: 'https://forms.google.com/comprehensive-foundation', duration: 70, questions: 35, attempts: 712, created_at: getTodayWithTime(11, 0) },
  { id: 12, file_id: 12, title: 'اختبار الاعمار', google_form_url: 'https://forms.google.com/ages', duration: 45, questions: 18, attempts: 134, created_at: getTodayWithTime(11, 15) },

  // اختبارات الملفات الكمية
  { id: 13, file_id: 13, title: 'اختبار القوانين الكمية', google_form_url: 'https://forms.google.com/quantitative-laws', duration: 60, questions: 25, attempts: 567, created_at: getTodayWithTime(11, 30) },
  { id: 14, file_id: 14, title: 'اختبار متشابهات الكمي', google_form_url: 'https://forms.google.com/quantitative-similarities', duration: 90, questions: 40, attempts: 923, created_at: getTodayWithTime(11, 45) },
  { id: 15, file_id: 15, title: 'اختبار مسائل السرعة', google_form_url: 'https://forms.google.com/speed-problems', duration: 50, questions: 20, attempts: 112, created_at: getTodayWithTime(12, 0) },
  { id: 16, file_id: 16, title: 'اختبار المتتابعات', google_form_url: 'https://forms.google.com/sequences', duration: 80, questions: 35, attempts: 645, created_at: getTodayWithTime(12, 15) },
  { id: 17, file_id: 17, title: 'اختبار المسائل المتشابهة', google_form_url: 'https://forms.google.com/similar-problems', duration: 75, questions: 30, attempts: 534, created_at: getTodayWithTime(12, 30) },
  { id: 18, file_id: 18, title: 'اختبار تقفيلات الكمي', google_form_url: 'https://forms.google.com/quantitative-closures', duration: 65, questions: 28, attempts: 89, created_at: getTodayWithTime(12, 45) }
];

// =====================================================
// HELPER FUNCTIONS - دوال مساعدة
// =====================================================

export const getFilesByCategory = (category: string): FileData[] => {
  return filesData.filter(file => file.category === category);
};

export const getFileById = (id: number): FileData | undefined => {
  return filesData.find(file => file.id === id);
};

export const getExamsByFileId = (fileId: number): ExamData[] => {
  return examsData.filter(exam => exam.file_id === fileId);
};

export const searchFiles = (query: string): FileData[] => {
  const searchTerm = query.toLowerCase();
  return filesData.filter(file =>
    file.title.toLowerCase().includes(searchTerm) ||
    file.description.toLowerCase().includes(searchTerm)
  );
};

export const getTotalFilesCount = (): number => {
  return filesData.length;
};

export const getFilesStats = () => {
  const verbal = getFilesByCategory('verbal').length;
  const quantitative = getFilesByCategory('quantitative').length;
  const mixed = getFilesByCategory('mixed').length;
  const general = getFilesByCategory('general').length;

  return { verbal, quantitative, mixed, general, total: filesData.length };
};
