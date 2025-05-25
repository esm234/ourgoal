-- ===================================================================
-- تحسين قاعدة البيانات وإضافة جداول الملفات والاختبارات
-- Database Optimization and Files/Exams Tables
-- ===================================================================

-- 1. إنشاء جدول الملفات (Files Table)
-- ===================================================================
CREATE TABLE IF NOT EXISTS public.files (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('verbal', 'quantitative', 'mixed', 'general')),
    file_url TEXT NOT NULL,
    file_size TEXT,
    downloads INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. إنشاء جدول الاختبارات (Exams Table)
-- ===================================================================
CREATE TABLE IF NOT EXISTS public.exams (
    id BIGSERIAL PRIMARY KEY,
    file_id BIGINT NOT NULL REFERENCES public.files(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    google_form_url TEXT NOT NULL,
    duration INTEGER, -- مدة الاختبار بالدقائق
    questions INTEGER, -- عدد الأسئلة
    attempts INTEGER DEFAULT 0, -- عدد المحاولات
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. إنشاء الفهارس للأداء (Performance Indexes)
-- ===================================================================

-- فهارس جدول الملفات
CREATE INDEX IF NOT EXISTS idx_files_category ON public.files(category);
CREATE INDEX IF NOT EXISTS idx_files_created_at ON public.files(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_files_downloads ON public.files(downloads DESC);
CREATE INDEX IF NOT EXISTS idx_files_title_search ON public.files USING gin(to_tsvector('arabic', title));
CREATE INDEX IF NOT EXISTS idx_files_description_search ON public.files USING gin(to_tsvector('arabic', description));

-- فهارس جدول الاختبارات
CREATE INDEX IF NOT EXISTS idx_exams_file_id ON public.exams(file_id);
CREATE INDEX IF NOT EXISTS idx_exams_created_at ON public.exams(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_exams_attempts ON public.exams(attempts DESC);

-- فهارس جدول المستخدمين (تحسين الموجود)
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_username_search ON public.profiles USING gin(to_tsvector('arabic', username));

-- 4. إنشاء دوال التحديث التلقائي (Auto-update Functions)
-- ===================================================================

-- دالة تحديث updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- تطبيق الدالة على الجداول
DROP TRIGGER IF EXISTS update_files_updated_at ON public.files;
CREATE TRIGGER update_files_updated_at
    BEFORE UPDATE ON public.files
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_exams_updated_at ON public.exams;
CREATE TRIGGER update_exams_updated_at
    BEFORE UPDATE ON public.exams
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 5. إنشاء سياسات الأمان (RLS Policies)
-- ===================================================================

-- تفعيل RLS على الجداول
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;

-- سياسات جدول الملفات
-- قراءة: الجميع يمكنهم القراءة
CREATE POLICY "Allow public read access on files" ON public.files
    FOR SELECT USING (true);

-- إدراج/تحديث/حذف: المشرفون فقط
CREATE POLICY "Allow admin insert on files" ON public.files
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Allow admin update on files" ON public.files
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Allow admin delete on files" ON public.files
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- سياسات جدول الاختبارات
-- قراءة: الجميع يمكنهم القراءة
CREATE POLICY "Allow public read access on exams" ON public.exams
    FOR SELECT USING (true);

-- إدراج/تحديث/حذف: المشرفون فقط
CREATE POLICY "Allow admin insert on exams" ON public.exams
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Allow admin update on exams" ON public.exams
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Allow admin delete on exams" ON public.exams
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 6. إدراج بيانات تجريبية (Sample Data)
-- ===================================================================

-- ملفات تجريبية
INSERT INTO public.files (title, description, category, file_url, file_size) VALUES
('ملف تدريب لفظي - المستوى الأول', 'مجموعة من التمارين اللفظية للمبتدئين', 'verbal', 'https://example.com/verbal1.pdf', '2.5 MB'),
('ملف تدريب كمي - الأساسيات', 'تمارين رياضية أساسية للقدرات', 'quantitative', 'https://example.com/quant1.pdf', '3.2 MB'),
('ملف منوع - تدريب شامل', 'مزيج من التمارين اللفظية والكمية', 'mixed', 'https://example.com/mixed1.pdf', '4.1 MB'),
('ملف عام - نصائح وإرشادات', 'نصائح عامة لاختبار القدرات', 'general', 'https://example.com/general1.pdf', '1.8 MB')
ON CONFLICT DO NOTHING;

-- اختبارات تجريبية
INSERT INTO public.exams (file_id, title, google_form_url, duration, questions) VALUES
(1, 'اختبار لفظي - الجزء الأول', 'https://forms.google.com/verbal1', 30, 20),
(1, 'اختبار لفظي - الجزء الثاني', 'https://forms.google.com/verbal2', 25, 15),
(2, 'اختبار كمي - الأساسيات', 'https://forms.google.com/quant1', 45, 30),
(3, 'اختبار شامل - منوع', 'https://forms.google.com/mixed1', 60, 40)
ON CONFLICT DO NOTHING;

-- 7. إنشاء دوال مساعدة للإحصائيات (Helper Functions)
-- ===================================================================

-- دالة للحصول على إحصائيات الملفات
CREATE OR REPLACE FUNCTION get_files_stats()
RETURNS TABLE (
    total_files BIGINT,
    total_downloads BIGINT,
    files_by_category JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_files,
        COALESCE(SUM(downloads), 0) as total_downloads,
        jsonb_object_agg(category, category_count) as files_by_category
    FROM (
        SELECT 
            category,
            COUNT(*) as category_count
        FROM public.files 
        GROUP BY category
    ) category_stats,
    (SELECT COUNT(*) FROM public.files) total;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- دالة لتحديث عداد التحميلات
CREATE OR REPLACE FUNCTION increment_download_count(file_id_param BIGINT)
RETURNS void AS $$
BEGIN
    UPDATE public.files 
    SET downloads = downloads + 1 
    WHERE id = file_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. تحسين الأداء (Performance Optimization)
-- ===================================================================

-- تحليل الجداول لتحسين الاستعلامات
ANALYZE public.files;
ANALYZE public.exams;
ANALYZE public.profiles;

-- إعدادات تحسين الذاكرة
-- هذه الإعدادات يجب تطبيقها من قبل مدير قاعدة البيانات
-- ALTER SYSTEM SET shared_buffers = '256MB';
-- ALTER SYSTEM SET effective_cache_size = '1GB';
-- ALTER SYSTEM SET maintenance_work_mem = '64MB';
-- ALTER SYSTEM SET checkpoint_completion_target = 0.9;
-- ALTER SYSTEM SET wal_buffers = '16MB';
-- ALTER SYSTEM SET default_statistics_target = 100;

-- ===================================================================
-- انتهاء ملف SQL
-- ===================================================================

-- للتحقق من نجاح التنفيذ، قم بتشغيل:
-- SELECT 'Files table created successfully' WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'files');
-- SELECT 'Exams table created successfully' WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'exams');
-- SELECT * FROM get_files_stats();
