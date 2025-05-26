-- =====================================================
-- CREATE ALL MISSING TABLES FOR ARABIC LEARNING PLATFORM
-- This script creates all the missing tables referenced in the codebase
-- =====================================================

BEGIN;

-- ===================================================================
-- 1. FILES TABLE (الملفات)
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

-- ===================================================================
-- 2. EXAMS TABLE (الاختبارات)
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

-- ===================================================================
-- 3. TESTS TABLE (الاختبارات المحلية)
-- ===================================================================
CREATE TABLE IF NOT EXISTS public.tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('verbal', 'quantitative', 'mixed')),
    duration INTEGER NOT NULL DEFAULT 60, -- مدة الاختبار بالدقائق
    published BOOLEAN DEFAULT false,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ===================================================================
-- 4. QUESTIONS TABLE (الأسئلة)
-- ===================================================================
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_id UUID NOT NULL REFERENCES public.tests(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type TEXT NOT NULL DEFAULT 'multiple_choice' CHECK (question_type IN ('multiple_choice', 'true_false', 'text')),
    question_order INTEGER NOT NULL,
    points INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ===================================================================
-- 5. OPTIONS TABLE (خيارات الأسئلة)
-- ===================================================================
CREATE TABLE IF NOT EXISTS public.options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT false,
    option_order INTEGER NOT NULL
);

-- ===================================================================
-- 6. EXAM_RESULTS TABLE (نتائج الاختبارات)
-- ===================================================================
CREATE TABLE IF NOT EXISTS public.exam_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_id UUID NOT NULL REFERENCES public.tests(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    correct_answers INTEGER NOT NULL,
    time_taken INTEGER NOT NULL, -- بالثواني
    questions_data JSONB, -- بيانات الأسئلة والإجابات
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ===================================================================
-- 7. COURSES TABLE (الدورات)
-- ===================================================================
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('verbal', 'quantitative', 'mixed', 'general')),
    instructor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    published BOOLEAN DEFAULT false,
    price DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ===================================================================
-- 8. DAILY_TASKS TABLE (المهام اليومية)
-- ===================================================================
CREATE TABLE IF NOT EXISTS public.daily_tasks (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    task_title TEXT NOT NULL,
    task_description TEXT,
    completed BOOLEAN DEFAULT false,
    task_date DATE DEFAULT CURRENT_DATE,
    xp_reward INTEGER DEFAULT 25,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ===================================================================
-- 9. USER_STATS TABLE (إحصائيات المستخدمين)
-- ===================================================================
CREATE TABLE IF NOT EXISTS public.user_stats (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    total_study_days INTEGER DEFAULT 0,
    last_activity_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id)
);

-- ===================================================================
-- INDEXES FOR PERFORMANCE
-- ===================================================================

-- Files indexes
CREATE INDEX IF NOT EXISTS idx_files_category ON public.files(category);
CREATE INDEX IF NOT EXISTS idx_files_created_at ON public.files(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_files_downloads ON public.files(downloads DESC);
CREATE INDEX IF NOT EXISTS idx_files_title_search ON public.files USING gin(to_tsvector('arabic', title));
CREATE INDEX IF NOT EXISTS idx_files_description_search ON public.files USING gin(to_tsvector('arabic', description));

-- Exams indexes
CREATE INDEX IF NOT EXISTS idx_exams_file_id ON public.exams(file_id);
CREATE INDEX IF NOT EXISTS idx_exams_created_at ON public.exams(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_exams_attempts ON public.exams(attempts DESC);

-- Tests indexes
CREATE INDEX IF NOT EXISTS idx_tests_category ON public.tests(category);
CREATE INDEX IF NOT EXISTS idx_tests_published ON public.tests(published);
CREATE INDEX IF NOT EXISTS idx_tests_user_id ON public.tests(user_id);
CREATE INDEX IF NOT EXISTS idx_tests_created_at ON public.tests(created_at DESC);

-- Questions indexes
CREATE INDEX IF NOT EXISTS idx_questions_test_id ON public.questions(test_id);
CREATE INDEX IF NOT EXISTS idx_questions_order ON public.questions(test_id, question_order);

-- Options indexes
CREATE INDEX IF NOT EXISTS idx_options_question_id ON public.options(question_id);
CREATE INDEX IF NOT EXISTS idx_options_order ON public.options(question_id, option_order);

-- Exam results indexes
CREATE INDEX IF NOT EXISTS idx_exam_results_test_id ON public.exam_results(test_id);
CREATE INDEX IF NOT EXISTS idx_exam_results_user_id ON public.exam_results(user_id);
CREATE INDEX IF NOT EXISTS idx_exam_results_created_at ON public.exam_results(created_at DESC);

-- Courses indexes
CREATE INDEX IF NOT EXISTS idx_courses_category ON public.courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_published ON public.courses(published);
CREATE INDEX IF NOT EXISTS idx_courses_instructor_id ON public.courses(instructor_id);

-- Daily tasks indexes
CREATE INDEX IF NOT EXISTS idx_daily_tasks_user_id ON public.daily_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_tasks_date ON public.daily_tasks(task_date DESC);
CREATE INDEX IF NOT EXISTS idx_daily_tasks_completed ON public.daily_tasks(completed);

-- User stats indexes
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON public.user_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_user_stats_streak ON public.user_stats(current_streak DESC);
CREATE INDEX IF NOT EXISTS idx_user_stats_activity ON public.user_stats(last_activity_date DESC);

COMMIT;
