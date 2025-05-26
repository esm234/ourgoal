-- =====================================================
-- INSERT ADDITIONAL FILES DATA
-- إضافة الملفات الإضافية الجديدة (5 ملفات)
-- =====================================================

BEGIN;

-- إدراج الملفات الإضافية الجديدة
INSERT INTO public.files (title, description, category, file_url, file_size, downloads) VALUES

-- 1. ملف الاجابة الواحدة
(
    'ملف الاجابة الواحدة',
    'الملف غير محلل لغير المشتركين بدورة 
أ/ايهاب عبدالعظيم‼️',
    'verbal',
    'https://drive.google.com/file/d/19-puGK_IV2sm_OJMgVRl-4oAE1K7v-1O/view?usp=sharing',
    '1 MB',
    0
),

-- 2. بسبوسة المعاني
(
    'بسبوسة المعاني',
    'الملف اللي هيحل اغلب مشاكل في اللفظي ، مجمع كل الكلمات الصعبة في المحوسب بمعانيهم مع وجود ميزة البحث عشان لو في كلمة وقفت معاك و انت بتذاكر تقدر تطلعها في ثانيا🤩',
    'verbal',
    'https://drive.google.com/file/d/11kHLWOnxOMN4F3BKSLQViNWTbo91RmXe/view?usp=sharing',
    '415 KB',
    0
),

-- 3. المفردة المتشابهة
(
    'المفردة المتشابهة',
    'الملف غير محلل لغير المشتركين بدورة 
أ/ايهاب عبدالعظيم‼️',
    'verbal',
    'https://drive.google.com/file/d/1tQPy6FRP6bWMi3ea8bXyJHPc-rEq2stP/view?usp=sharing',
    '300 KB',
    0
),

-- 4. انسب عنوان للنص
(
    'انسب عنوان للنص',
    'الملف غير محلل لغير المشتركين بدورة 
أ/ايهاب عبدالعظيم‼️',
    'verbal',
    'https://drive.google.com/file/d/1dDapxaMmnlrCmaRgDAl3rCPBvsmA6r6N/view?usp=sharing',
    '1 MB',
    0
),

-- 5. التعداد
(
    'التعداد',
    'الملف غير محلل لغير المشتركين بدورة 
أ/ايهاب عبدالعظيم‼️',
    'verbal',
    'https://drive.google.com/file/d/1gqMasKJBcfcJRx9Gmto2_bj84-8o13QO/view?usp=sharing',
    '1 MB',
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
        'ملف الاجابة الواحدة',
        'بسبوسة المعاني',
        'المفردة المتشابهة',
        'انسب عنوان للنص',
        'التعداد'
    );
    
    RAISE NOTICE 'تم إدراج % ملفات إضافية جديدة بنجاح', file_count;
    
    IF file_count >= 5 THEN
        RAISE NOTICE 'جميع الملفات الإضافية الـ 5 تم إدراجها بنجاح ✅';
    ELSE
        RAISE WARNING 'بعض الملفات لم يتم إدراجها - تحقق من وجود ملفات مكررة';
    END IF;
END $$;

-- عرض الملفات الإضافية المضافة للتأكيد
SELECT 
    id,
    title,
    category,
    file_size,
    downloads,
    created_at
FROM public.files 
WHERE title IN (
    'ملف الاجابة الواحدة',
    'بسبوسة المعاني',
    'المفردة المتشابهة',
    'انسب عنوان للنص',
    'التعداد'
)
ORDER BY created_at DESC;

COMMIT;
