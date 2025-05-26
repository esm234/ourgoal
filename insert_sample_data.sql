-- =====================================================
-- INSERT SAMPLE DATA FOR TESTING
-- This script inserts sample data for all the missing tables
-- =====================================================

BEGIN;

-- ===================================================================
-- SAMPLE FILES DATA
-- ===================================================================
INSERT INTO public.files (title, description, category, file_url, file_size) VALUES
('ملف تدريب لفظي - المستوى الأول', 'مجموعة من التمارين اللفظية للمبتدئين تشمل معاني الكلمات والتناظر اللفظي', 'verbal', 'https://drive.google.com/file/d/1example1/view', '2.5 MB'),
('ملف تدريب كمي - الأساسيات', 'تمارين رياضية أساسية للقدرات تشمل الحساب والهندسة', 'quantitative', 'https://drive.google.com/file/d/1example2/view', '3.2 MB'),
('ملف منوع - تدريب شامل', 'مزيج من التمارين اللفظية والكمية للتدريب الشامل', 'mixed', 'https://drive.google.com/file/d/1example3/view', '4.1 MB'),
('ملف عام - نصائح وإرشادات', 'نصائح عامة لاختبار القدرات واستراتيجيات الحل', 'general', 'https://drive.google.com/file/d/1example4/view', '1.8 MB'),
('تدريبات لفظية متقدمة', 'تمارين لفظية للمستوى المتقدم تشمل الاستيعاب المقروء', 'verbal', 'https://drive.google.com/file/d/1example5/view', '3.1 MB'),
('تدريبات كمية متقدمة', 'تمارين رياضية للمستوى المتقدم تشمل المسائل المعقدة', 'quantitative', 'https://drive.google.com/file/d/1example6/view', '2.8 MB'),
('ملف التحضير النهائي', 'مراجعة شاملة قبل الاختبار الفعلي', 'mixed', 'https://drive.google.com/file/d/1example7/view', '5.2 MB'),
('ملف الأخطاء الشائعة', 'أهم الأخطاء التي يقع فيها الطلاب وكيفية تجنبها', 'general', 'https://drive.google.com/file/d/1example8/view', '1.5 MB')
ON CONFLICT DO NOTHING;

-- ===================================================================
-- SAMPLE EXAMS DATA (linked to files)
-- ===================================================================
INSERT INTO public.exams (file_id, title, google_form_url, duration, questions) VALUES
(1, 'اختبار لفظي - المستوى الأول', 'https://forms.google.com/verbal1', 60, 25),
(1, 'اختبار لفظي تطبيقي', 'https://forms.google.com/verbal1-practice', 45, 20),
(1, 'اختبار سريع - لفظي', 'https://forms.google.com/verbal1-quick', 30, 15),
(2, 'اختبار كمي - الأساسيات', 'https://forms.google.com/quant1', 90, 30),
(2, 'اختبار كمي سريع', 'https://forms.google.com/quant1-quick', 30, 15),
(2, 'اختبار كمي متوسط', 'https://forms.google.com/quant1-medium', 60, 20),
(3, 'اختبار شامل منوع', 'https://forms.google.com/mixed1', 120, 50),
(3, 'اختبار منوع سريع', 'https://forms.google.com/mixed1-quick', 60, 25),
(4, 'اختبار المعرفة العامة', 'https://forms.google.com/general1', 40, 20),
(5, 'اختبار لفظي متقدم', 'https://forms.google.com/verbal2', 75, 35),
(5, 'اختبار الاستيعاب المقروء', 'https://forms.google.com/verbal2-reading', 60, 25),
(6, 'اختبار كمي متقدم', 'https://forms.google.com/quant2', 100, 40),
(6, 'اختبار الهندسة المتقدم', 'https://forms.google.com/quant2-geometry', 80, 30),
(7, 'الاختبار النهائي الشامل', 'https://forms.google.com/final-comprehensive', 150, 60),
(8, 'اختبار الأخطاء الشائعة', 'https://forms.google.com/common-mistakes', 45, 20)
ON CONFLICT DO NOTHING;

-- ===================================================================
-- SAMPLE TESTS DATA (local tests)
-- ===================================================================
-- Note: We'll use a placeholder UUID for user_id - replace with actual admin user ID
INSERT INTO public.tests (id, title, description, category, duration, published, user_id) VALUES
(gen_random_uuid(), 'اختبار تجريبي - القسم اللفظي', 'اختبار تجريبي يحتوي على أسئلة لفظية متنوعة', 'verbal', 60, true, '00000000-0000-0000-0000-000000000000'),
(gen_random_uuid(), 'اختبار تجريبي - القسم الكمي', 'اختبار تجريبي يحتوي على أسئلة كمية متنوعة', 'quantitative', 90, true, '00000000-0000-0000-0000-000000000000'),
(gen_random_uuid(), 'اختبار شامل تجريبي', 'اختبار شامل يغطي جميع أقسام القدرات', 'mixed', 120, true, '00000000-0000-0000-0000-000000000000')
ON CONFLICT DO NOTHING;

-- ===================================================================
-- SAMPLE COURSES DATA
-- ===================================================================
INSERT INTO public.courses (id, title, description, category, instructor_id, published, price) VALUES
(gen_random_uuid(), 'دورة القدرات اللفظية الشاملة', 'دورة متكاملة لتطوير مهارات القسم اللفظي في اختبار القدرات', 'verbal', '00000000-0000-0000-0000-000000000000', true, 299.00),
(gen_random_uuid(), 'دورة القدرات الكمية المتقدمة', 'دورة متخصصة في القسم الكمي مع حلول مفصلة', 'quantitative', '00000000-0000-0000-0000-000000000000', true, 349.00),
(gen_random_uuid(), 'دورة التحضير الشامل للقدرات', 'دورة شاملة تغطي جميع أقسام اختبار القدرات', 'mixed', '00000000-0000-0000-0000-000000000000', true, 499.00),
(gen_random_uuid(), 'دورة استراتيجيات الحل السريع', 'تعلم أسرع الطرق لحل أسئلة القدرات', 'general', '00000000-0000-0000-0000-000000000000', true, 199.00)
ON CONFLICT DO NOTHING;

-- ===================================================================
-- AUTO-UPDATE FUNCTIONS
-- ===================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for auto-updating timestamps
DROP TRIGGER IF EXISTS handle_updated_at ON public.files;
CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.files
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at ON public.exams;
CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.exams
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at ON public.tests;
CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.tests
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at ON public.courses;
CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.courses
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at ON public.daily_tasks;
CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.daily_tasks
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at ON public.user_stats;
CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.user_stats
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ===================================================================
-- HELPER FUNCTIONS
-- ===================================================================

-- Function to get files with exam count
CREATE OR REPLACE FUNCTION public.get_files_with_exam_count()
RETURNS TABLE (
    id BIGINT,
    title TEXT,
    description TEXT,
    category TEXT,
    file_url TEXT,
    file_size TEXT,
    downloads INTEGER,
    exam_count BIGINT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        f.id,
        f.title,
        f.description,
        f.category,
        f.file_url,
        f.file_size,
        f.downloads,
        COUNT(e.id) as exam_count,
        f.created_at,
        f.updated_at
    FROM public.files f
    LEFT JOIN public.exams e ON f.id = e.file_id
    GROUP BY f.id, f.title, f.description, f.category, f.file_url, f.file_size, f.downloads, f.created_at, f.updated_at
    ORDER BY f.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get test with question count
CREATE OR REPLACE FUNCTION public.get_tests_with_question_count()
RETURNS TABLE (
    id UUID,
    title TEXT,
    description TEXT,
    category TEXT,
    duration INTEGER,
    published BOOLEAN,
    question_count BIGINT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id,
        t.title,
        t.description,
        t.category,
        t.duration,
        t.published,
        COUNT(q.id) as question_count,
        t.created_at
    FROM public.tests t
    LEFT JOIN public.questions q ON t.id = q.test_id
    WHERE t.published = true
    GROUP BY t.id, t.title, t.description, t.category, t.duration, t.published, t.created_at
    ORDER BY t.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions to functions
GRANT EXECUTE ON FUNCTION public.get_files_with_exam_count() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.get_tests_with_question_count() TO authenticated, anon;

COMMIT;
