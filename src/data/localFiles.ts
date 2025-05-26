// Helper function لإنشاء تاريخ ثابت 26 مايو مع وقت محدد (ميلادي)
const getMay26WithTime = (hour: number, minute: number): string => {
  const may26 = new Date(2025, 4, 26); // May is month 4 (0-indexed)
  may26.setHours(hour, minute, 0, 0);
  return may26.toISOString();
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
    file_url: "https://drive.google.com/uc?export=download&id=1jcwCdudm0CBaCHCtmcKf64MCBb_HQB-E",
    file_size: "900 KB",
    downloads: 2456,
    created_at: getMay26WithTime(8, 15),
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
        google_form_url: "https://forms.gle/FxHNoWdAwe9q6D6B7",
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
        google_form_url: "https://forms.office.com/r/Q0MF7hrtSk",
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
        google_form_url: "https://forms.office.com/r/xPZFP1mD3s",
        difficulty: "medium",
        estimated_time: 50,
        questions_count: 70
      },
 {
        id: 403,
        title: " 8 اختبار الخيار الواحدة",
        description: "اختبار لأسئلة الخيار الواحدة",
        google_form_url: "https://forms.office.com/r/xrrz2DPDga",
        difficulty: "medium",
        estimated_time: 50,
        questions_count: 70
      },
       {
        id: 403,
        title: " 9 اختبار الخيار الواحدة",
        description: "اختبار لأسئلة الخيار الواحدة",
        google_form_url: "https://forms.office.com/r/PDTDL2Zk1n",
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
    id: 19,
    title: "زتونة التناظر",
    description: "دايمًا بتلاقي صعوبه و انت بتذاكر التناظر ف العلاقات اللي شبه بعض و غالبًا بتغلط عشان افتكرت العلاقه حاجه تانيه ، فـ علمنالكم زتونة التناظر اللي هتديك خلاصة العلاقات متقسمه كل قسم لوحده و معاه الأختبار الإلكتروني بتاعه عشان تختبر مستواك في كل علاقة\n\nمع بداية كل قسم في نصيحة او موضوع التيم حب يتكلم فيه و ينصحكم من خبراته ، لو قرأتوا النصائح دي و طبقتوها فهي قادرة تغير من حياتك ١٨٠ درجة🤍\n\nالملف للمشتركين مع أ/ايهاب فقط !",
    category: "verbal",
    file_url: "https://drive.google.com/uc?export=download&id=1qhkPqrt3EY-PiKbzZhVnE2kK-h3LUrVv",
    file_size: "3.2 MB",
    downloads: 1876,
    created_at: getMay26WithTime(12, 30),
    exams: [
      
      
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
     
    ]
  },
  {
    id: 25,
    title: "ملف تقفيلات اللفظي",
    description: "الملف غير محلل لغير المشتركين بدورة\nأ/ايهاب عبدالعظيم‼️",
    category: "verbal",
    file_url: "https://drive.google.com/uc?export=download&id=1kP4jby0jvbJfEPHkLH9j7o3gESjoSo1T",
    file_size: "3.5 MB",
    downloads: 1456,
    created_at: getMay26WithTime(14, 0),
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
