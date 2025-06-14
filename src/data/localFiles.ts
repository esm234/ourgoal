// Helper function لإنشاء تاريخ ثابت 26 مايو مع وقت محدد (ميلادي)
const getMay26WithTime = (hour: number, minute: number): string => {
  const may26 = new Date(2025, 4, 26); // May is month 4 (0-indexed)
  may26.setHours(hour, minute, 0, 0);
  return may26.toISOString();
};

// Helper function لإنشاء تاريخ ثابت 29 مايو مع وقت محدد (ميلادي)
const getMay29WithTime = (hour: number, minute: number): string => {
  const may29 = new Date(2025, 4, 29); // May is month 4 (0-indexed)
  may29.setHours(hour, minute, 0, 0);
  return may29.toISOString();
};



// بيانات الملفات المحلية - تحديث مستمر
export interface LocalFile {
  id: number;
  title: string;
  description: string;
  category: 'verbal' | 'quantitative' | 'mixed' | 'general';
  file_url: string;
  file_size: string;
  downloads: number;
  created_at: string;
  exams: LocalExam[];
}

export interface LocalExam {
  id: number;
  title: string;
  description: string;
  google_form_url: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimated_time: number; // بالدقائق
  questions_count: number;
  participants_count?: number; // عدد المشاركين في الاختبار
}

export const localFiles: LocalFile[] = [
  // ملفات لفظية
  {
    id: 1,
    title: "بصمجة آمون ( بصمج بشياكة )",
    description: "بنقدملكم ملف بصمجة آمون ( بصمج ب شياكة سابقا ) 🚶❤️\n\nوربنا يوفقكم يا شباب وبنبهه مينفعش تبصمج من غير ما تكون فاهم",
    category: "verbal",
    file_url: "https://drive.google.com/uc?export=download&id=1nigAlfxIBRQk2JxjXaHHfk4Cnky3SqhQ",
    file_size: "3.6 MB",
    downloads: 1567,
    created_at: getMay26WithTime(8, 0),
    exams: [

    ]
  },
  {
    id: 2,
    title: "ملخص القطع",
    description: "و اخيرااااااا خلصنا ملف من أجمد الملفات العملناها او أجمدهم فعلا⚡️⚡️\n\nالملف اللي هيحل معاك مشكلة الأستيعاب بشكل كامل⚡️🫣\n\nجمعنا فيه القطع الصعبه و تم تلخيصها و شرحها بشكل مفصل مع شويه جمل و صور للبصمجه يعني هتجيب الأستيعاب في شوال🫵🏻\n\nالملف محلل فقط للمشتركين بدورة مستر إيهاب عبد العظيم🫡",
    category: "verbal",
    file_url: "https://t.me/Our_goal_is_success/843",
    file_size: "900 KB",
    downloads: 2456,
    created_at: getMay29WithTime(8, 15),
    exams: [

    ]
  },
  {
    id: 3,
    title: "ملف العلاقات",
    description: "الملف غير محلل لغير المشتركين بدورة\nأ/ايهاب عبدالعظيم‼️",
    category: "verbal",
    file_url: "https://drive.google.com/uc?export=download&id=14O_uIGONJUJIY09S_G0dsIqC2JrNTXwP",
    file_size: "2.0 MB",
    downloads: 1234,
    created_at: getMay26WithTime(8, 30),
    exams: [
      {
        id: 301,
        title: " 1 اختبار العلاقات" ,
        description: "اختبار لعلاقات استيعاب المقروء",
        google_form_url: "https://forms.gle/Ex23WbBbTDaJ6dPT6",
        difficulty: "medium",
        estimated_time: 40,
        questions_count: 60
      },
        {
        id: 302,
        title: " 2 اختبار العلاقات" ,
        description: "اختبار لعلاقات استيعاب المقروء",
        google_form_url: "https://forms.gle/CDeZnM1y5ojuLCAg8",
        difficulty: "medium",
        estimated_time: 40,
        questions_count: 60
      },
        {
        id: 303,
        title: " 3 اختبار العلاقات" ,
        description: "اختبار لعلاقات استيعاب المقروء",
        google_form_url: "https://forms.gle/YpU1sa48ASY65R428",
        difficulty: "medium",
        estimated_time: 40,
        questions_count: 60
      },
 {
        id: 304,
        title: " 4 اختبار العلاقات" ,
        description: "اختبار لعلاقات استيعاب المقروء",
        google_form_url: "https://forms.gle/FxHNoWdAwe9q6D6B7",
        difficulty: "medium",
        estimated_time: 40,
        questions_count: 60
      },
       {
        id: 305,
        title: " 5 اختبار العلاقات" ,
        description: "اختبار لعلاقات استيعاب المقروء",
        google_form_url: "https://forms.gle/uxYyNni2foRqzQY4A",
        difficulty: "medium",
        estimated_time: 40,
        questions_count: 60
      }


    ]
  },
  {
    id: 4,
    title: "ملف الاجابة الواحدة",
    description: "الملف غير محلل لغير المشتركين بدورة\nأ/ايهاب عبدالعظيم‼️",
    category: "verbal",
    file_url: "https://drive.google.com/uc?export=download&id=19-puGK_IV2sm_OJMgVRl-4oAE1K7v-1O",
    file_size: "1 MB",
    downloads: 987,
    created_at: getMay26WithTime(8, 45),
    exams: [
      {
        id: 401,
        title: " 1 اختبار الخيار الواحدة",
        description: "اختبار لأسئلة الخيار الواحدة",
        google_form_url: "https://forms.gle/Jnp97SsQEzaHaWS48",
        difficulty: "medium",
        estimated_time: 50,
        questions_count: 70
      },
      {
        id: 402,
        title: " 2 اختبار الخيار الواحدة",
        description: "اختبار لأسئلة الخيار الواحدة",
        google_form_url: "https://forms.gle/KYuW8JwYY9ft4gEH9",
        difficulty: "medium",
        estimated_time: 50,
        questions_count: 70
      },
      {
        id: 403,
        title: " 3 اختبار الخيار الواحدة",
        description: "اختبار لأسئلة الخيار الواحدة",
        google_form_url: "https://forms.gle/WHv74Cubma4hNJd97",
        difficulty: "medium",
        estimated_time: 50,
        questions_count: 70
      },
      {
        id: 404,
        title: " 4 اختبار الخيار الواحدة",
        description: "اختبار لأسئلة الخيار الواحدة",
        google_form_url: "https://forms.gle/2jUmLXUcu8wiJmvm6",
        difficulty: "medium",
        estimated_time: 50,
        questions_count: 70
      },
      {
        id: 405,
        title: " 5 اختبار الخيار الواحدة",
        description: "اختبار لأسئلة الخيار الواحدة",
        google_form_url: "https://forms.gle/Ddq2jcyQ897C6Kem6",
        difficulty: "medium",
        estimated_time: 50,
        questions_count: 70
      },
      {
        id: 406,
        title: " 6 اختبار الخيار الواحدة",
        description: "اختبار لأسئلة الخيار الواحدة",
        google_form_url: "https://forms.gle/YKo8Qaqg2fMKHCcLA",
        difficulty: "medium",
        estimated_time: 50,
        questions_count: 70
      },
      {
        id: 403,
        title: " 7 اختبار الخيار الواحدة",
        description: "اختبار لأسئلة الخيار الواحدة",
        google_form_url: "https://docs.google.com/forms/d/e/1FAIpQLScrIpIv-vJQKCr0umFvBAm8LDF14s-l4jORrhh6LtnT3cUMDQ/viewform",
        difficulty: "medium",
        estimated_time: 50,
        questions_count: 70
      },
 {
        id: 403,
        title: " 8 اختبار الخيار الواحدة",
        description: "اختبار لأسئلة الخيار الواحدة",
        google_form_url: "https://forms.gle/hu2mSKwnhYDEz4FP8",
        difficulty: "medium",
        estimated_time: 50,
        questions_count: 70
      },
       {
        id: 403,
        title: " 9 اختبار الخيار الواحدة",
        description: "اختبار لأسئلة الخيار الواحدة",
        google_form_url: "https://forms.gle/WqW8L2MYd1N4R2mC8",
        difficulty: "medium",
        estimated_time: 50,
        questions_count: 70
      }
    ]
  },
  {
    id: 5,
    title: "بسبوسة المعاني",
    description: "الملف اللي هيحل اغلب مشاكل في اللفظي ، مجمع كل الكلمات الصعبة في المحوسب بمعانيهم مع وجود ميزة البحث عشان لو في كلمة وقفت معاك و انت بتذاكر تقدر تطلعها في ثانيا🤩",
    category: "verbal",
    file_url: "https://drive.google.com/uc?export=download&id=11kHLWOnxOMN4F3BKSLQViNWTbo91RmXe",
    file_size: "415 KB",
    downloads: 3789,
    created_at: getMay26WithTime(9, 0),
    exams: [

    ]
  },
  {
    id: 6,
    title: "المفردة المتشابهة",
    description: "الملف غير محلل لغير المشتركين بدورة\nأ/ايهاب عبدالعظيم‼️",
    category: "verbal",
    file_url: "https://drive.google.com/uc?export=download&id=1tQPy6FRP6bWMi3ea8bXyJHPc-rEq2stP",
    file_size: "300 KB",
    downloads: 823,
    created_at: getMay26WithTime(9, 15),
    exams: [
      {
        id: 601,
        title: "المفردة المتشابهة - الجزء الأول",
        description: "اختبار الجزء الأول للمفردات المتشابهة",
        google_form_url: "https://forms.gle/mi9Z8xMo8EmPqxJW7",
        difficulty: "medium",
        estimated_time: 30,
        questions_count: 25
      },
      {
        id: 602,
        title: "المفردة المتشابهة - الجزء الثاني",
        description: "اختبار الجزء الثاني للمفردات المتشابهة",
        google_form_url: "https://forms.gle/dbkwu459XMy2Hpon7",
        difficulty: "medium",
        estimated_time: 30,
        questions_count: 25
      }
    ]
  },
  {
    id: 7,
    title: "انسب عنوان للنص",
    description: "الملف غير محلل لغير المشتركين بدورة\nأ/ايهاب عبدالعظيم‼️",
    category: "verbal",
    file_url: "https://drive.google.com/uc?export=download&id=1dDapxaMmnlrCmaRgDAl3rCPBvsmA6r6N",
    file_size: "1 MB",
    downloads: 1089,
    created_at: getMay26WithTime(9, 30),
    exams: [
      {
        id: 701,
        title: "انسب عنوان للنص - الجزء الأول",
        description: "اختبار الجزء الأول لاختيار العنوان الأنسب للنصوص",
        google_form_url: "https://forms.gle/Ag3bBPsySaQrrEEJA",
        difficulty: "medium",
        estimated_time: 25,
        questions_count: 20
      },
      {
        id: 702,
        title: "انسب عنوان للنص - الجزء الثاني",
        description: "اختبار الجزء الثاني لاختيار العنوان الأنسب للنصوص",
        google_form_url: "https://forms.gle/e5omF2uta35mwtCKA",
        difficulty: "medium",
        estimated_time: 25,
        questions_count: 20
      },
      {
        id: 703,
        title: "انسب عنوان للنص - الجزء الثالث",
        description: "اختبار الجزء الثالث لاختيار العنوان الأنسب للنصوص",
        google_form_url: "https://forms.gle/pJrbHs3LGLtYBCXu5",
        difficulty: "hard",
        estimated_time: 30,
        questions_count: 25
      }
    ]
  },
  {
    id: 8,
    title: "التعداد",
    description: "الملف غير محلل لغير المشتركين بدورة\nأ/ايهاب عبدالعظيم‼️",
    category: "verbal",
    file_url: "https://drive.google.com/uc?export=download&id=1gqMasKJBcfcJRx9Gmto2_bj84-8o13QO",
    file_size: "1 MB",
    downloads: 756,
    created_at: getMay26WithTime(9, 45),
    exams: [
      {
        id: 801,
        title: "التعداد - الجزء الأول",
        description: "اختبار الجزء الأول على أسئلة التعداد في النصوص",
        google_form_url: "https://forms.gle/NRhbcnFExNWTRQLG6",
        difficulty: "easy",
        estimated_time: 20,
        questions_count: 15
      },
      {
        id: 802,
        title: "التعداد - الجزء الثاني",
        description: "اختبار الجزء الثاني على أسئلة التعداد في النصوص",
        google_form_url: "https://forms.gle/rcAMGqMjjFGMsfPG7",
        difficulty: "medium",
        estimated_time: 25,
        questions_count: 18
      },
      {
        id: 803,
        title: "التعداد - الجزء الثالث",
        description: "اختبار الجزء الثالث على أسئلة التعداد في النصوص",
        google_form_url: "https://forms.gle/DhhBQZLNBaK1yARJ9",
        difficulty: "medium",
        estimated_time: 25,
        questions_count: 20
      }
    ]
  },
  {
    id: 9,
    title: "الخطأ السياقي",
    description: "الملف غير محلل لغير المشتركين بدورة\nأ/ايهاب عبدالعظيم‼️",
    category: "verbal",
    file_url: "https://drive.google.com/uc?export=download&id=10QmflW9-yTK2oR9dxXrWWkPe-zmtojQT",
    file_size: "1 MB",
    downloads: 542,
    created_at: getMay26WithTime(10, 0),
    exams: [

    ]
  },
  {
    id: 10,
    title: "قطع ال٩٥ العائدة",
    description: "الملف غير محلل لغير المشتركين بدورة\nأ/ايهاب عبدالعظيم‼️",
    category: "verbal",
    file_url: "https://drive.google.com/uc?export=download&id=1KvmgatCuii4Xoklf1kkjQ1tQIXREYOZH",
    file_size: "1 MB",
    downloads: 498,
    created_at: getMay26WithTime(10, 15),
    exams: [

    ]
  },
  {
    id: 11,
    title: "ملخص التأسيس الشامل لفظي أور جول",
    description: "الملف غير محلل لغير المشتركين بدورة\nأ/ايهاب عبدالعظيم‼️",
    category: "verbal",
    file_url: "https://drive.google.com/uc?export=download&id=19haE4VluUmRV9B8LNP2GFx5FeJIHHYIl",
    file_size: "2.5 MB",
    downloads: 2134,
    created_at: getMay26WithTime(10, 30),
    exams: [

    ]
  },
  {
    id: 12,
    title: "الاعمار",
    description: "الملف غير محلل لغير المشتركين بدورة\nأ/ايهاب عبدالعظيم‼️",
    category: "verbal",
    file_url: "https://drive.google.com/uc?export=download&id=1tx5Pb_1Bktj9qEiz-JTqz6iWRlA4Zrxt",
    file_size: "2 MB",
    downloads: 456,
    created_at: getMay26WithTime(10, 45),
    exams: [

    ]
  },

  // ملفات كمية
  {
    id: 13,
    title: "ملف القوانين",
    description: "ملف قوانين الكمي | المحوسب\n\n- الملف مجمع كل قوانين الكمي الموجوده في البنوك⚡️",
    category: "quantitative",
    file_url: "https://drive.google.com/uc?export=download&id=1wwtjnfI1UK4z_b82v1uh79PP9Y7fEDIZ",
    file_size: "1 MB",
    downloads: 1823,
    created_at: getMay26WithTime(11, 0),
    exams: [

    ]
  },
  {
    id: 14,
    title: "متشابهات الكمي",
    description: "ملف المتشابهات في ثوبة الجديد🫡\n\nو اخيرا و بما أن الملف نال اعجابكم حدثناه للبنك ١٠٠ ، مش بس كدا !\nلا و كمان غيرنا التصميم و عدلنا كتير عشان نسهل عليكم مذاكرتكم و تستمتعوا بشكل و جوده اقوى☝️🏻\n\nياريت متنسوناش في دعواتكم🤍",
    category: "quantitative",
    file_url: "https://drive.google.com/uc?export=download&id=1uNNLtS2sMtHhNoAop4rOTC1cOQCrv_Up",
    file_size: "11 MB",
    downloads: 3245,
    created_at: getMay26WithTime(11, 15),
    exams: [

    ]
  },
  {
    id: 15,
    title: "مسائل السرعة",
    description: "الملف غير محلل لغير المشتركين بدورة\nأ/محمود المنصف‼️",
    category: "quantitative",
    file_url: "https://drive.google.com/uc?export=download&id=1dauWYFbaVIIQG9QsPezVDEYG6B50dcZ3",
    file_size: "1 MB",
    downloads: 387,
    created_at: getMay26WithTime(11, 30),
    exams: [
      {
        id: 1501,
        title: "مسائل السرعة",
        description: "اختبار شامل على مسائل السرعة والمسافة والزمن",
        google_form_url: "https://forms.office.com/r/m8ZuabPCBp",
        difficulty: "medium",
        estimated_time: 45,
        questions_count: 30
      }
    ]
  },
  {
    id: 16,
    title: "المتتابعات",
    description: "الملف غير محلل لغير المشتركين بدورة\nأ/محمود المنصف‼️",
    category: "quantitative",
    file_url: "https://drive.google.com/uc?export=download&id=1CQDNKGlxyCrC0GVh2ZscI4Jl4KEz8mBi",
    file_size: "80 MB",
    downloads: 2367,
    created_at: getMay26WithTime(11, 45),
    exams: [


    ]
  },
  {
    id: 17,
    title: "مسائل صيغتها مشابهة",
    description: "الملف غير محلل لغير المشتركين بدورة\nأ/محمود المنصف‼️",
    category: "quantitative",
    file_url: "https://drive.google.com/uc?export=download&id=16aLb8MUonvQlquEEqcmskYcb0mYS8yqT",
    file_size: "55 MB",
    downloads: 1987,
    created_at: getMay26WithTime(12, 0),
    exams: [

    ]
  },
  {
    id: 18,
    title: "ملف تقفيلات الكمي",
    description: "الملف غير محلل لغير المشتركين بدورة\nأ/محمود المنصف‼️\n\nياريت متنسوناش في دعواتكم🤍",
    category: "quantitative",
    file_url: "https://drive.google.com/uc?export=download&id=1xsGybcYrWiHwzEwV5F9wNQt8dG-u06Tt",
    file_size: "18 MB",
    downloads: 342,
    created_at: getMay26WithTime(12, 15),
    exams: [
      {
        id: 1801,
        title: "تقفيلات الكمي - الجزء الأول",
        description: "اختبار الجزء الأول لتقفيلات الكمي",
        google_form_url: "https://forms.gle/gU9JwKbgMFP33m2x8",
        difficulty: "hard",
        estimated_time: 60,
        questions_count: 40
      },
      {
        id: 1802,
        title: "تقفيلات الكمي - الجزء الثاني",
        description: "اختبار الجزء الثاني لتقفيلات الكمي",
        google_form_url: "https://forms.gle/FZ99oo2m4h97bAAS9",
        difficulty: "hard",
        estimated_time: 60,
        questions_count: 40
      }
    ]
  },
  {
    id: 27,
    title: "ملف تقفيلات الكمي",
    description: "الملف غير محلل لغير المشتركين بدورة\nأ/محمود المنصف‼️",
    category: "quantitative",
    file_url: "https://drive.google.com/uc?export=download&id=1c4_OCOOo-kbmzgqtn3XqXtsCzVM6Gj_l",
    file_size: "4.2 MB",
    downloads: 1789,
    created_at: getMay26WithTime(14, 30),
    exams: [

    ]
  },
  {
    id: 28,
    title: "ملف الاحتمالات",
    description: "الملف غير محلل لغير المشتركين بدورة\nأ/محمود المنصف‼️",
    category: "quantitative",
    file_url: "https://drive.google.com/uc?export=download&id=1uPbaQvbQc2SqNNjEXWAQOeCfSUOntGCB",
    file_size: "2.3 MB",
    downloads: 1345,
    created_at: getMay26WithTime(14, 45),
    exams: [
      {
        id: 2801,
        title: "الاحتمالات",
        description: "اختبار شامل على أسئلة الاحتمالات",
        google_form_url: "https://forms.gle/KnCjYo9hpRRGangW9",
        difficulty: "hard",
        estimated_time: 40,
        questions_count: 30
      }
    ]
  },
  {
    id: 29,
    title: "ملف اسئلة التدريب",
    description: "الملف غير محلل لغير المشتركين بدورة\nأ/محمود المنصف‼️",
    category: "quantitative",
    file_url: "https://drive.google.com/uc?export=download&id=15UpIbrqQdx-tZoOLKYGPIaod0grolABG",
    file_size: "5.1 MB",
    downloads: 2134,
    created_at: getMay26WithTime(15, 0),
    exams: [
      {
        id: 2901,
        title: "التدريب",
        description: "اختبار تدريبي شامل على أسئلة متنوعة",
        google_form_url: "https://forms.gle/i716cF7GBZZNFGSu7",
        difficulty: "medium",
        estimated_time: 50,
        questions_count: 35
      }
    ]
  },
  {
    id: 30,
    title: "ملف مقارنات اجابتها (د)",
    description: "الملف غير محلل لغير المشتركين بدورة\nأ/محمود المنصف‼️",
    category: "quantitative",
    file_url: "https://drive.google.com/uc?export=download&id=1nFtyhovnzsjWUnFX69exzVXG9_91SDhw",
    file_size: "3.7 MB",
    downloads: 987,
    created_at: getMay26WithTime(15, 15),
    exams: [
      {
        id: 3001,
        title: "مقارنات إجابتها (د) - الجزء الأول",
        description: "اختبار الجزء الأول للمقارنات التي إجابتها (د)",
        google_form_url: "https://forms.office.com/r/YaumiPqWBH",
        difficulty: "medium",
        estimated_time: 35,
        questions_count: 25
      },
      {
        id: 3002,
        title: "مقارنات إجابتها (د) - الجزء الثاني",
        description: "اختبار الجزء الثاني للمقارنات التي إجابتها (د)",
        google_form_url: "https://forms.office.com/r/r9eYc3kuJG",
        difficulty: "medium",
        estimated_time: 35,
        questions_count: 25
      },
      {
        id: 3003,
        title: "مقارنات إجابتها (د) - الجزء الثالث",
        description: "اختبار الجزء الثالث للمقارنات التي إجابتها (د)",
        google_form_url: "https://forms.gle/PfbJgLbYMpEPG1gVA",
        difficulty: "medium",
        estimated_time: 35,
        questions_count: 25
      },
      {
        id: 3004,
        title: "مقارنات إجابتها (د) - الجزء الرابع",
        description: "اختبار الجزء الرابع للمقارنات التي إجابتها (د)",
        google_form_url: "https://forms.gle/GMFXTUMsZ8VPx1wVA",
        difficulty: "medium",
        estimated_time: 35,
        questions_count: 25
      },
      {
        id: 3005,
        title: "مقارنات إجابتها (د) - الجزء الخامس",
        description: "اختبار الجزء الخامس للمقارنات التي إجابتها (د)",
        google_form_url: "https://forms.gle/ZjaJTdtH4eAUzLcG7",
        difficulty: "medium",
        estimated_time: 35,
        questions_count: 25
      }
    ]
  },
  {
    id: 31,
    title: "صيغ اتغيرت كمي",
    description: "الملف غير محلل لغير المشتركين بدورة\nأ/محمود المنصف‼️",
    category: "quantitative",
    file_url: "https://drive.google.com/uc?export=download&id=19oebrEU5OlxDJwySPZaDNxnHJ_MD2b1r",
    file_size: "4.5 MB",
    downloads: 1567,
    created_at: getMay26WithTime(15, 30),
    exams: [

    ]
  },
  {
    id: 32,
    title: "ملف الرسوم البيانية",
    description: "الملف غير محلل لغير المشتركين بدورة\nأ/محمود المنصف‼️",
    category: "quantitative",
    file_url: "https://drive.google.com/uc?export=download&id=1vCK906TW_vWKRIbnTrTv90b9wvI5spym",
    file_size: "6.2 MB",
    downloads: 2345,
    created_at: getMay26WithTime(15, 45),
    exams: [

    ]
  },
  {
    id: 33,
    title: "مقولات اللفظي",
    description: "ملف مقولات اللفظي",
    category: "verbal",
    file_url: "https://drive.google.com/uc?export=download&id=1Yt-zxkyp3MvaiM74dM1N29a0FIiOpUk5",
    file_size: "1 MB",
    downloads: 0,
    created_at: new Date(2025, 5, 12, 16, 0, 0).toISOString(),
    exams: []
  },
  {
    id: 19,
    title: "زتونة التناظر",
    description: "دايمًا بتلاقي صعوبه و انت بتذاكر التناظر ف العلاقات اللي شبه بعض و غالبًا بتغلط عشان افتكرت العلاقه حاجه تانيه ، فـ علمنالكم زتونة التناظر اللي هتديك خلاصة العلاقات متقسمه كل قسم لوحده و معاه الأختبار الإلكتروني بتاعه عشان تختبر مستواك في كل علاقة\n\nمع بداية كل قسم في نصيحة او موضوع التيم حب يتكلم فيه و ينصحكم من خبراته ، لو قرأتوا النصائح دي و طبقتوها فهي قادرة تغير من حياتك ١٨٠ درجة🤍\n\nالملف للمشتركين مع أ/ايهاب فقط !",
    category: "verbal",
    file_url: "https://t.me/Our_goal_is_success/910",
    file_size: "3.2 MB",
    downloads: 1976,
    created_at: getMay29WithTime(12, 30),
    exams: [
      {
        id: 1901,
        title: "التضاد - الجزء الأول",
        description: "اختبار على علاقات التضاد في التناظر",
        google_form_url: "https://docs.google.com/forms/d/e/1FAIpQLSeYrtBH2l-EzqZTnfFhqSkE4oBWGro8BYpu-7oqSLjvqkdBCg/viewform",
        difficulty: "medium",
        estimated_time: 60,
        questions_count: 55,
        participants_count: 142
      },
      {
        id: 1902,
        title: "التضاد - الجزء الثاني",
        description: "اختبار على علاقات التضاد في التناظر",
        google_form_url: "https://docs.google.com/forms/d/e/1FAIpQLSd3VCnEKqJBJkVkuXFBfF2FvLtyl1u6DV4f0CHMVuZumzprrA/viewform",
        difficulty: "medium",
        estimated_time: 60,
        questions_count: 55,
        participants_count: 138
      },
      {
        id: 1903,
        title: "الترادف - الجزء الأول",
        description: "اختبار على علاقات الترادف في التناظر",
        google_form_url: "https://docs.google.com/forms/d/e/1FAIpQLSfLnoJPQXZqmx-K06AH8e22krwcUEVkmhhmEuL9pul7NECPOw/viewform",
        difficulty: "medium",
        estimated_time: 55,
        questions_count: 50,
        participants_count: 156
      },
      {
        id: 1904,
        title: "الترادف - الجزء الثاني",
        description: "اختبار على علاقات الترادف في التناظر",
        google_form_url: "https://docs.google.com/forms/d/e/1FAIpQLSdq9cuQVYKZGt46lV_UwbIsGI8rTNcgs6VZ_uF3jLL08_276w/viewform",
        difficulty: "medium",
        estimated_time: 55,
        questions_count: 50,
        participants_count: 134
      },
      {
        id: 1905,
        title: "الترادف - الجزء الثالث",
        description: "اختبار على علاقات الترادف في التناظر",
        google_form_url: "https://docs.google.com/forms/d/e/1FAIpQLSc7lRun1fBsQ8rVuv4cgbedGASm00JOE62lfdYA4XQ9P4S4Ig/viewform",
        difficulty: "medium",
        estimated_time: 55,
        questions_count: 50,
        participants_count: 129
      },
      {
        id: 1906,
        title: "ينتج عنه - الجزء الأول",
        description: "اختبار على علاقات ينتج عنه في التناظر",
        google_form_url: "https://docs.google.com/forms/d/e/1FAIpQLSdww6weQsypUhjE1Bvf41x4c2Ir-448mFlLepKRwaXNun7EHQ/viewform",
        difficulty: "medium",
        estimated_time: 65,
        questions_count: 60,
        participants_count: 167
      },
      {
        id: 1907,
        title: "ينتج عنه - الجزء الثاني",
        description: "اختبار على علاقات ينتج عنه في التناظر",
        google_form_url: "https://docs.google.com/forms/d/e/1FAIpQLSeT-tQmAyTBT9e2AEQdmyY-QwcJCYe65FVAPZuOKcqchZqpfw/viewform",
        difficulty: "medium",
        estimated_time: 65,
        questions_count: 60,
        participants_count: 145
      },
      {
        id: 1908,
        title: "ينتج عنه - الجزء الثالث",
        description: "اختبار على علاقات ينتج عنه في التناظر",
        google_form_url: "https://docs.google.com/forms/d/e/1FAIpQLSd7rwgdFevwUw0TWHN8OwRXJDMcIUsf8APvB8aQ8AhUCAazgQ/viewform",
        difficulty: "medium",
        estimated_time: 65,
        questions_count: 60,
        participants_count: 151
      },
      {
        id: 1909,
        title: "اختبار الفئة",
        description: "اختبار على علاقات الفئة في التناظر",
        google_form_url: "https://docs.google.com/forms/d/e/1FAIpQLSdG0JHpKkkn9ev8FsRdeviPsj0c-f1pDpktm_RS3ctPPk0w7w/viewform",
        difficulty: "medium",
        estimated_time: 70,
        questions_count: 65,
        participants_count: 173
      },
      {
        id: 1910,
        title: "الإحاطة والتغطية",
        description: "اختبار على علاقات الإحاطة والتغطية في التناظر",
        google_form_url: "https://docs.google.com/forms/d/e/1FAIpQLSd7kMhKPRNFZsLLqxttjojszEFz7QTFlV5PykhXuychCRCaaA/viewform",
        difficulty: "medium",
        estimated_time: 60,
        questions_count: 55,
        participants_count: 126
      },
      {
        id: 1911,
        title: "ضروري لـ",
        description: "اختبار على علاقات ضروري لـ في التناظر",
        google_form_url: "https://docs.google.com/forms/d/e/1FAIpQLSeR5DbNJgEHSWzhq3I7BtAKglP8EJH0prwMXvPsBUH_njsdfA/viewform",
        difficulty: "medium",
        estimated_time: 55,
        questions_count: 50,
        participants_count: 118
      },
      {
        id: 1912,
        title: "العلاقات الوظيفية",
        description: "اختبار على العلاقات الوظيفية في التناظر",
        google_form_url: "https://docs.google.com/forms/d/e/1FAIpQLSfBJwzMpnrFHOzTXvoTI5AGU4zQ40iLnwYsz4dyuEmxrCwNnQ/viewform",
        difficulty: "medium",
        estimated_time: 75,
        questions_count: 70,
        participants_count: 189
      },
      {
        id: 1913,
        title: "علاقات الوصف",
        description: "اختبار على علاقات الوصف في التناظر",
        google_form_url: "https://docs.google.com/forms/d/e/1FAIpQLSd84XFXjIMd8I6NXgJqAfjBk0k78C137_Fqni199wahMCg1_Q/viewform",
        difficulty: "medium",
        estimated_time: 65,
        questions_count: 60,
        participants_count: 163
      },
      {
        id: 1914,
        title: "جزء من",
        description: "اختبار على علاقات جزء من في التناظر",
        google_form_url: "https://docs.google.com/forms/d/e/1FAIpQLSdE7SIFAhP4d3Jn_nDpSWdc0uF7nPxd7blwZJZlWNz_1kiVBg/viewform",
        difficulty: "medium",
        estimated_time: 55,
        questions_count: 50,
        participants_count: 112
      },
      {
        id: 1915,
        title: "يحتاج إلى",
        description: "اختبار على علاقات يحتاج إلى في التناظر",
        google_form_url: "https://docs.google.com/forms/d/e/1FAIpQLSckzD4ATJwipyZ2Z4Y67c0YWAXcc8cWeBLZQhFlcEuekB1THg/viewform",
        difficulty: "medium",
        estimated_time: 60,
        questions_count: 55,
        participants_count: 147
      },
      {
        id: 1916,
        title: "من أنواع",
        description: "اختبار على علاقات من أنواع في التناظر",
        google_form_url: "https://docs.google.com/forms/d/e/1FAIpQLSd9pfDwDvk4-x46Lt1C-gmVZ8ezDAbuMDesBYs-UB9QBXPxPA/viewform",
        difficulty: "medium",
        estimated_time: 70,
        questions_count: 65,
        participants_count: 178
      },
      {
        id: 1917,
        title: "علاقات البلاد",
        description: "اختبار على علاقات البلاد في التناظر",
        google_form_url: "https://docs.google.com/forms/d/e/1FAIpQLSdly3fdUTraJEUUi2uxclcglwOwfLY8E-PKZmVtuj1AsMtBGw/viewform",
        difficulty: "medium",
        estimated_time: 55,
        questions_count: 50,
        participants_count: 124
      },
      {
        id: 1918,
        title: "علاقة بعده",
        description: "اختبار على علاقات علاقة بعده في التناظر",
        google_form_url: "https://docs.google.com/forms/d/e/1FAIpQLSehE-JXLYWS2My8nFABlbtTEPmkfaVZa6xJh_cDPl3J6ztguA/viewform",
        difficulty: "medium",
        estimated_time: 65,
        questions_count: 60,
        participants_count: 159
      },
      {
        id: 1919,
        title: "يوجد في",
        description: "اختبار على علاقات يوجد في في التناظر",
        google_form_url: "https://docs.google.com/forms/d/e/1FAIpQLSc5uAIyDD-fr4GundLBiF5663b4uCJmJQdDYPgm1zkRa4RCAw/viewform",
        difficulty: "medium",
        estimated_time: 75,
        questions_count: 70,
        participants_count: 195
      },
      {
        id: 1920,
        title: "منوع 1",
        description: "اختبار منوع على علاقات متنوعة في التناظر",
        google_form_url: "https://docs.google.com/forms/d/e/1FAIpQLSc47rMstcwJQAS-mu5DpT9ZNB5x5tHJFB4rmkdNRan8SrLd5g/viewform",
        difficulty: "medium",
        estimated_time: 80,
        questions_count: 70,
        participants_count: 201
      },
      {
        id: 1921,
        title: "علاقات أخرى - الجزء الأول",
        description: "اختبار على علاقات أخرى متنوعة في التناظر",
        google_form_url: "https://docs.google.com/forms/d/e/1FAIpQLSf4n3D5AAmhMfz3JWnGEhezqoOyRvh7WqHomaikyFWUOa9Ylw/viewform",
        difficulty: "medium",
        estimated_time: 60,
        questions_count: 55,
        participants_count: 133
      },
      {
        id: 1922,
        title: "علاقات أخرى - الجزء الثاني",
        description: "اختبار على علاقات أخرى متنوعة في التناظر",
        google_form_url: "https://docs.google.com/forms/d/e/1FAIpQLSeMOsFn2Mirjr3BNisWInmB8RFSx8iWsJYPqxsU5tOkvIBvFw/viewform",
        difficulty: "medium",
        estimated_time: 60,
        questions_count: 55,
        participants_count: 141
      },
      {
        id: 1923,
        title: "علاقات أخرى - الجزء الثالث",
        description: "اختبار على علاقات أخرى متنوعة في التناظر",
        google_form_url: "https://docs.google.com/forms/d/e/1FAIpQLSfAEKchBBwkhLvcTT2poqAOBrwJzno2bS3F9IYrYk3nOulUfQ/viewform",
        difficulty: "medium",
        estimated_time: 65,
        questions_count: 60,
        participants_count: 157
      },
      {
        id: 1924,
        title: "علاقات أخرى - الجزء الرابع",
        description: "اختبار على علاقات أخرى متنوعة في التناظر",
        google_form_url: "https://docs.google.com/forms/d/e/1FAIpQLSeTjdcqSsRNANG2mGbMysEGCdvB0mAqLbcQs1OOS9_apQWCEA/viewform",
        difficulty: "medium",
        estimated_time: 65,
        questions_count: 60,
        participants_count: 168
      }
    ]
  },
  {
    id: 20,
    title: "برشامة المعادلة",
    description: "الملف غير محلل لغير المشتركين بدورة\nأ/ايهاب عبدالعظيم‼️",
    category: "verbal",
    file_url: "https://drive.google.com/uc?export=download&id=1itVBqvnmKJlTZ82VZ85z5ZEwbTiFRUFS",
    file_size: "1.8 MB",
    downloads: 1234,
    created_at: getMay26WithTime(12, 45),
    exams: [

    ]
  },
  {
    id: 21,
    title: "فهرس القطع",
    description: "الملف غير محلل لغير المشتركين بدورة\nأ/ايهاب عبدالعظيم‼️",
    category: "verbal",
    file_url: "https://drive.google.com/uc?export=download&id=1nrrzHhKcKWzC--zjBoD8OmsrsOq0EOGI",
    file_size: "2.5 MB",
    downloads: 987,
    created_at: getMay26WithTime(13, 0),
    exams: [

    ]
  },
  {
    id: 22,
    title: "الرجوع للنص",
    description: "الملف غير محلل لغير المشتركين بدورة\nأ/ايهاب عبدالعظيم‼️",
    category: "verbal",
    file_url: "https://drive.google.com/uc?export=download&id=1ez0xhw497OVim1UxmsjMdvwksfIlVT6u",
    file_size: "1.5 MB",
    downloads: 743,
    created_at: getMay26WithTime(13, 15),
    exams: [

    ]
  },
  {
    id: 23,
    title: "ملف الضمائر",
    description: "الملف غير محلل لغير المشتركين بدورة\nأ/ايهاب عبدالعظيم‼️",
    category: "verbal",
    file_url: "https://drive.google.com/uc?export=download&id=12qQNBxl1nolsNgbTeDSTIUl7-7Eio4Ia",
    file_size: "1.2 MB",
    downloads: 892,
    created_at: getMay26WithTime(13, 30),
    exams: [
      {
        id: 2301,
        title: "الضمائر - الجزء الأول",
        description: "اختبار الجزء الأول على أسئلة الضمائر",
        google_form_url: "https://forms.gle/BCXP2sEBssxixmqSA",
        difficulty: "medium",
        estimated_time: 25,
        questions_count: 20
      },
      {
        id: 2302,
        title: "الضمائر - الجزء الثاني",
        description: "اختبار الجزء الثاني على أسئلة الضمائر",
        google_form_url: "https://forms.gle/sFpVHb5UxJxarKLq8",
        difficulty: "medium",
        estimated_time: 25,
        questions_count: 20
      }
    ]
  },
  {
    id: 24,
    title: "ملف الشخصيات",
    description: "الملف غير محلل لغير المشتركين بدورة\nأ/ايهاب عبدالعظيم‼️",
    category: "verbal",
    file_url: "https://drive.google.com/uc?export=download&id=1FDltUQ7H1Iivgu1bnyAT8-CSOQd5_Utz",
    file_size: "2.1 MB",
    downloads: 654,
    created_at: getMay26WithTime(13, 45),
    exams: [
      {
        id: 2401,
        title: "الشخصيات - الجزء الأول",
        description: "اختبار الجزء الأول على أسئلة الشخصيات",
        google_form_url: "https://forms.gle/3HsgGoUkZTqKhoKw5",
        difficulty: "medium",
        estimated_time: 30,
        questions_count: 25
      },
      {
        id: 2402,
        title: "الشخصيات - الجزء الثاني",
        description: "اختبار الجزء الثاني على أسئلة الشخصيات",
        google_form_url: "https://forms.gle/ncqLYwfwu1B3p2Cf6",
        difficulty: "medium",
        estimated_time: 30,
        questions_count: 25
      }
    ]
  },
  {
    id: 25,
    title: "ملف تقفيلات اللفظي",
    description: "الملف غير محلل لغير المشتركين بدورة\nأ/ايهاب عبدالعظيم‼️",
    category: "verbal",
    file_url: "https://drive.google.com/uc?export=download&id=1tWeGfAKPoVVHcI4e43Lffyav4gVREjjG&confirm=t",
    file_size: "3.5 MB",
    downloads: 1456,
    created_at: getMay29WithTime(14, 0),
    exams: [

    ]
  },
  {
    id: 26,
    title: "ملف مقارنات اجابتها (ج)",
    description: "الملف غير محلل لغير المشتركين بدورة\nأ/محمود المنصف‼️",
    category: "quantitative",
    file_url: "https://drive.google.com/uc?export=download&id=15Wca81bc-IGNygVZ6NNiql3_f7ytSB5f",
    file_size: "2.8 MB",
    downloads: 1123,
    created_at: getMay26WithTime(14, 15),
    exams: [
      {
        id: 2601,
        title: "مقارنات إجابتها (ج) - الجزء الأول",
        description: "اختبار الجزء الأول للمقارنات التي إجابتها (ج)",
        google_form_url: "https://forms.office.com/r/YaumiPqWBH",
        difficulty: "medium",
        estimated_time: 35,
        questions_count: 25
      },
      {
        id: 2602,
        title: "مقارنات إجابتها (ج) - الجزء الثاني",
        description: "اختبار الجزء الثاني للمقارنات التي إجابتها (ج)",
        google_form_url: "https://forms.office.com/r/r9eYc3kuJG",
        difficulty: "medium",
        estimated_time: 35,
        questions_count: 25
      },
      {
        id: 2603,
        title: "مقارنات إجابتها (ج) - الجزء الثالث",
        description: "اختبار الجزء الثالث للمقارنات التي إجابتها (ج)",
        google_form_url: "https://forms.gle/PfbJgLbYMpEPG1gVA",
        difficulty: "medium",
        estimated_time: 35,
        questions_count: 25
      },
      {
        id: 2604,
        title: "مقارنات إجابتها (ج) - الجزء الرابع",
        description: "اختبار الجزء الرابع للمقارنات التي إجابتها (ج)",
        google_form_url: "https://forms.gle/GMFXTUMsZ8VPx1wVA",
        difficulty: "medium",
        estimated_time: 35,
        questions_count: 25
      },
      {
        id: 2605,
        title: "مقارنات إجابتها (ج) - الجزء الخامس",
        description: "اختبار الجزء الخامس للمقارنات التي إجابتها (ج)",
        google_form_url: "https://forms.gle/ZjaJTdtH4eAUzLcG7",
        difficulty: "medium",
        estimated_time: 35,
        questions_count: 25
      }
    ]
  }
];

// دالة لتحويل رابط Google Drive من view إلى download
export const convertToDirectDownload = (driveUrl: string): string => {
  // Extract file ID from Google Drive URL
  const fileIdMatch = driveUrl.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
  if (fileIdMatch) {
    const fileId = fileIdMatch[1];
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }
  return driveUrl; // Return original if no match
};

// دالة للبحث في الملفات
export const searchFiles = (query: string, category?: string): LocalFile[] => {
  let filteredFiles = localFiles;

  // تصفية حسب الفئة
  if (category && category !== 'all') {
    filteredFiles = filteredFiles.filter(file => file.category === category);
  }

  // البحث في العنوان والوصف
  if (query.trim()) {
    const searchTerm = query.toLowerCase();
    filteredFiles = filteredFiles.filter(file =>
      file.title.toLowerCase().includes(searchTerm) ||
      file.description.toLowerCase().includes(searchTerm)
    );
  }

  return filteredFiles;
};

// دالة للحصول على ملف بالـ ID
export const getFileById = (id: number): LocalFile | undefined => {
  return localFiles.find(file => file.id === id);
};

// دالة للحصول على اختبار بالـ ID
export const getExamById = (fileId: number, examId: number): LocalExam | undefined => {
  const file = getFileById(fileId);
  return file?.exams.find(exam => exam.id === examId);
};

// دالة لزيادة عدد التحميلات
export const incrementDownloads = (fileId: number): void => {
  const file = localFiles.find(f => f.id === fileId);
  if (file) {
    file.downloads += 1;
  }
};

// إحصائيات سريعة
export const getFilesStats = () => {
  const totalFiles = localFiles.length;
  const totalDownloads = localFiles.reduce((sum, file) => sum + file.downloads, 0);
  const totalExams = localFiles.reduce((sum, file) => sum + file.exams.length, 0);

  const categoryCounts = {
    verbal: localFiles.filter(f => f.category === 'verbal').length,
    quantitative: localFiles.filter(f => f.category === 'quantitative').length,
    mixed: localFiles.filter(f => f.category === 'mixed').length,
    general: localFiles.filter(f => f.category === 'general').length,
  };

  return {
    totalFiles,
    totalDownloads,
    totalExams,
    categoryCounts
  };
};
