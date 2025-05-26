-- =====================================================
-- INSERT LATEST FILES DATA
-- إضافة أحدث الملفات (5 ملفات جديدة)
-- =====================================================

BEGIN;

-- إدراج الملفات الجديدة
INSERT INTO public.files (title, description, category, file_url, file_size, downloads) VALUES

-- 1. الخطأ السياقي
(
    'الخطأ السياقي',
    'الملف غير محلل لغير المشتركين بدورة
أ/ايهاب عبدالعظيم‼️',
    'verbal',
    'https://drive.google.com/file/d/10QmflW9-yTK2oR9dxXrWWkPe-zmtojQT/view?usp=sharing',
    '1 MB',
    0
),

-- 2. قطع ال٩٥ العائدة
(
    'قطع ال٩٥ العائدة',
    'الملف غير محلل لغير المشتركين بدورة
أ/ايهاب عبدالعظيم‼️',
    'verbal',
    'https://drive.google.com/file/d/1KvmgatCuii4Xoklf1kkjQ1tQIXREYOZH/view?usp=sharing',
    '1 MB',
    0
),

-- 3. ملخص التأسيس الشامل لفظي أور جول
(
    'ملخص التأسيس الشامل لفظي أور جول',
    'الملف غير محلل لغير المشتركين بدورة
أ/ايهاب عبدالعظيم‼️',
    'verbal',
    'https://drive.google.com/file/d/19haE4VluUmRV9B8LNP2GFx5FeJIHHYIl/view?usp=sharing',
    '2.5 MB',
    0
),

-- 4. ملف القوانين
(
    'ملف القوانين',
    'ملف قوانين الكمي | المحوسب

- الملف مجمع كل قوانين الكمي الموجوده في البنوك⚡️',
    'quantitative',
    'https://drive.google.com/file/d/1wwtjnfI1UK4z_b82v1uh79PP9Y7fEDIZ/view?usp=sharing',
    '1 MB',
    0
),

-- 5. متشابهات الكمي
(
    'متشابهات الكمي',
    'ملف المتشابهات في ثوبة الجديد🫡

و اخيرا و بما أن الملف نال اعجابكم حدثناه للبنك ١٠٠ ، مش بس كدا !
لا و كمان غيرنا التصميم و عدلنا كتير عشان نسهل عليكم مذاكرتكم و تستمتعوا بشكل و جوده اقوى☝️🏻

ياريت متنسوناش في دعواتكم🤍',
    'quantitative',
    'https://drive.google.com/file/d/1uNNLtS2sMtHhNoAop4rOTC1cOQCrv_Up/view?usp=sharing',
    '11 MB',
    0
),

-- 6. مسائل السرعة
(
    'مسائل السرعة',
    'الملف غير محلل لغير المشتركين بدورة
أ/ايهاب عبدالعظيم‼️',
    'quantitative',
    'https://drive.google.com/file/d/1dauWYFbaVIIQG9QsPezVDEYG6B50dcZ3/view?usp=sharing',
    '1 MB',
    0
),

-- 7. المتتابعات
(
    'المتتابعات',
    'الملف غير محلل لغير المشتركين بدورة
أ/محمود المنصف‼️',
    'quantitative',
    'https://drive.google.com/file/d/1CQDNKGlxyCrC0GVh2ZscI4Jl4KEz8mBi/view?usp=sharing',
    '80 MB',
    0
),

-- 8. الاعمار
(
    'الاعمار',
    'الملف غير محلل لغير المشتركين بدورة
أ/محمود المنصف‼️',
    'verbal',
    'https://drive.google.com/file/d/1tx5Pb_1Bktj9qEiz-JTqz6iWRlA4Zrxt/view?usp=sharing',
    '2 MB',
    0
),

-- 9. مسائل صيغتها مشابهة
(
    'مسائل صيغتها مشابهة',
    'الملف غير محلل لغير المشتركين بدورة
أ/محمود المنصف‼️',
    'quantitative',
    'https://drive.google.com/file/d/16aLb8MUonvQlquEEqcmskYcb0mYS8yqT/view?usp=sharing',
    '55 MB',
    0
),

-- 10. ملف تقفيلات الكمي
(
    'ملف تقفيلات الكمي',
    'الملف غير محلل لغير المشتركين بدورة
أ/محمود المنصف‼️

ياريت متنسوناش في دعواتكم🤍',
    'quantitative',
    'https://drive.google.com/file/d/1xsGybcYrWiHwzEwV5F9wNQt8dG-u06Tt/view?usp=sharing',
    '18 MB',
    0
)

ON CONFLICT DO NOTHING;

-- التحقق من إدراج البيانات بنجاح
DO $$
DECLARE
    file_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO file_count FROM public.files
    WHERE title IN (
        'الخطأ السياقي',
        'قطع ال٩٥ العائدة',
        'ملخص التأسيس الشامل لفظي أور جول',
        'ملف القوانين',
        'متشابهات الكمي',
        'مسائل السرعة',
        'المتتابعات',
        'الاعمار',
        'مسائل صيغتها مشابهة',
        'ملف تقفيلات الكمي'
    );

    RAISE NOTICE 'تم إدراج % ملفات جديدة بنجاح', file_count;

    IF file_count >= 10 THEN
        RAISE NOTICE 'جميع الملفات الجديدة الـ 10 تم إدراجها بنجاح ✅';
    ELSE
        RAISE WARNING 'بعض الملفات لم يتم إدراجها - تحقق من وجود ملفات مكررة';
    END IF;
END $$;

-- عرض الملفات الجديدة المضافة للتأكيد
SELECT
    id,
    title,
    category,
    file_size,
    downloads,
    created_at
FROM public.files
WHERE title IN (
    'الخطأ السياقي',
    'قطع ال٩٥ العائدة',
    'ملخص التأسيس الشامل لفظي أور جول',
    'ملف القوانين',
    'متشابهات الكمي',
    'مسائل السرعة',
    'المتتابعات',
    'الاعمار',
    'مسائل صيغتها مشابهة',
    'ملف تقفيلات الكمي'
)
ORDER BY created_at DESC;

COMMIT;
