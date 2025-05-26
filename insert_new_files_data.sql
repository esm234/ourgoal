-- =====================================================
-- INSERT NEW FILES DATA
-- إضافة الملفات الجديدة لجدول files
-- =====================================================

BEGIN;

-- إدراج الملفات الجديدة
INSERT INTO public.files (title, description, category, file_url, file_size, downloads) VALUES

-- 1. ملف بصمجة آمون
(
    'بصمجة آمون ( بصمج بشياكة )',
    'بنقدملكم ملف بصمجة آمون ( بصمج ب شياكة سابقا ) 🚶❤️

وربنا يوفقكم يا شباب وبنبهه مينفعش تبصمج من غير ما تكون فاهم',
    'verbal',
    'https://drive.google.com/file/d/1nigAlfxIBRQk2JxjXaHHfk4Cnky3SqhQ/view?usp=sharing',
    '3.6 MB',
    0
),

-- 2. ملف ملخص القطع
(
    'ملخص القطع',
    'و اخيرااااااا خلصنا ملف من أجمد الملفات العملناها او أجمدهم فعلا⚡️⚡️

الملف اللي هيحل معاك مشكلة الأستيعاب بشكل كامل⚡️🫣

جمعنا فيه القطع الصعبه و تم تلخيصها و شرحها بشكل مفصل مع شويه جمل و صور للبصمجه يعني هتجيب الأستيعاب في شوال🫵🏻

الملف محلل فقط للمشتركين بدورة مستر إيهاب عبد العظيم🫡',
    'verbal',
    'https://drive.google.com/file/d/1jcwCdudm0CBaCHCtmcKf64MCBb_HQB-E/view?usp=sharing',
    '900 KB',
    0
),

-- 3. ملف العلاقات
(
    'ملف العلاقات',
    'الملف غير محلل لغير المشتركين بدورة
أ/ايهاب عبدالعظيم‼️',
    'verbal',
    'https://drive.google.com/file/d/14O_uIGONJUJIY09S_G0dsIqC2JrNTXwP/view?usp=sharing',
    '2.0 MB',
    0
),



ON CONFLICT DO NOTHING;

-- التحقق من إدراج البيانات بنجاح
DO $$
DECLARE
    file_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO file_count FROM public.files
    WHERE title IN (
        'بصمجة آمون ( بصمج بشياكة )',
        'ملخص القطع',
        'ملف العلاقات'
    );

    RAISE NOTICE 'تم إدراج % ملفات جديدة بنجاح', file_count;

    IF file_count >= 3 THEN
        RAISE NOTICE 'جميع الملفات الـ 3 تم إدراجها بنجاح ✅';
    ELSE
        RAISE WARNING 'بعض الملفات لم يتم إدراجها - تحقق من وجود ملفات مكررة';
    END IF;
END $$;

-- عرض الملفات المضافة للتأكيد
SELECT
    id,
    title,
    category,
    file_size,
    downloads,
    created_at
FROM public.files
WHERE title IN (
    'بصمجة آمون ( بصمج بشياكة )',
    'ملخص القطع',
    'ملف العلاقات'
)
ORDER BY created_at DESC;

COMMIT;
