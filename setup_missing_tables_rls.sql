-- =====================================================
-- RLS POLICIES AND PERMISSIONS FOR MISSING TABLES
-- This script sets up Row Level Security and permissions for the missing tables
-- =====================================================

BEGIN;

-- ===================================================================
-- ENABLE ROW LEVEL SECURITY
-- ===================================================================

ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- ===================================================================
-- FILES TABLE POLICIES
-- ===================================================================

-- Allow public read access on files
DROP POLICY IF EXISTS "Allow public read access on files" ON public.files;
CREATE POLICY "Allow public read access on files" ON public.files
    FOR SELECT USING (true);

-- Allow admin insert/update/delete on files
DROP POLICY IF EXISTS "Allow admin manage files" ON public.files;
CREATE POLICY "Allow admin manage files" ON public.files
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ===================================================================
-- EXAMS TABLE POLICIES
-- ===================================================================

-- Allow public read access on exams
DROP POLICY IF EXISTS "Allow public read access on exams" ON public.exams;
CREATE POLICY "Allow public read access on exams" ON public.exams
    FOR SELECT USING (true);

-- Allow admin management on exams
DROP POLICY IF EXISTS "Allow admin manage exams" ON public.exams;
CREATE POLICY "Allow admin manage exams" ON public.exams
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ===================================================================
-- TESTS TABLE POLICIES
-- ===================================================================

-- Users can view published tests
DROP POLICY IF EXISTS "Users can view published tests" ON public.tests;
CREATE POLICY "Users can view published tests" ON public.tests
    FOR SELECT USING (published = true);

-- Users can manage their own tests
DROP POLICY IF EXISTS "Users can manage own tests" ON public.tests;
CREATE POLICY "Users can manage own tests" ON public.tests
    FOR ALL USING (auth.uid() = user_id);

-- Admins can manage all tests
DROP POLICY IF EXISTS "Admins can manage all tests" ON public.tests;
CREATE POLICY "Admins can manage all tests" ON public.tests
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ===================================================================
-- QUESTIONS TABLE POLICIES
-- ===================================================================

-- Users can view questions for published tests
DROP POLICY IF EXISTS "Users can view questions for published tests" ON public.questions;
CREATE POLICY "Users can view questions for published tests" ON public.questions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.tests t
            WHERE t.id = questions.test_id AND t.published = true
        )
    );

-- Users can manage questions for their own tests
DROP POLICY IF EXISTS "Users can manage own test questions" ON public.questions;
CREATE POLICY "Users can manage own test questions" ON public.questions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.tests t
            WHERE t.id = questions.test_id AND t.user_id = auth.uid()
        )
    );

-- Admins can manage all questions
DROP POLICY IF EXISTS "Admins can manage all questions" ON public.questions;
CREATE POLICY "Admins can manage all questions" ON public.questions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ===================================================================
-- OPTIONS TABLE POLICIES
-- ===================================================================

-- Users can view options for published tests
DROP POLICY IF EXISTS "Users can view options for published tests" ON public.options;
CREATE POLICY "Users can view options for published tests" ON public.options
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.questions q
            JOIN public.tests t ON t.id = q.test_id
            WHERE q.id = options.question_id AND t.published = true
        )
    );

-- Users can manage options for their own test questions
DROP POLICY IF EXISTS "Users can manage own question options" ON public.options;
CREATE POLICY "Users can manage own question options" ON public.options
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.questions q
            JOIN public.tests t ON t.id = q.test_id
            WHERE q.id = options.question_id AND t.user_id = auth.uid()
        )
    );

-- Admins can manage all options
DROP POLICY IF EXISTS "Admins can manage all options" ON public.options;
CREATE POLICY "Admins can manage all options" ON public.options
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ===================================================================
-- EXAM_RESULTS TABLE POLICIES
-- ===================================================================

-- Users can view their own exam results
DROP POLICY IF EXISTS "Users can view own exam results" ON public.exam_results;
CREATE POLICY "Users can view own exam results" ON public.exam_results
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own exam results
DROP POLICY IF EXISTS "Users can insert own exam results" ON public.exam_results;
CREATE POLICY "Users can insert own exam results" ON public.exam_results
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can view all exam results
DROP POLICY IF EXISTS "Admins can view all exam results" ON public.exam_results;
CREATE POLICY "Admins can view all exam results" ON public.exam_results
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ===================================================================
-- COURSES TABLE POLICIES
-- ===================================================================

-- Users can view published courses
DROP POLICY IF EXISTS "Users can view published courses" ON public.courses;
CREATE POLICY "Users can view published courses" ON public.courses
    FOR SELECT USING (published = true);

-- Users can manage their own courses
DROP POLICY IF EXISTS "Users can manage own courses" ON public.courses;
CREATE POLICY "Users can manage own courses" ON public.courses
    FOR ALL USING (auth.uid() = instructor_id);

-- Admins can manage all courses
DROP POLICY IF EXISTS "Admins can manage all courses" ON public.courses;
CREATE POLICY "Admins can manage all courses" ON public.courses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ===================================================================
-- DAILY_TASKS TABLE POLICIES
-- ===================================================================

-- Users can manage their own daily tasks
DROP POLICY IF EXISTS "Users can manage own daily tasks" ON public.daily_tasks;
CREATE POLICY "Users can manage own daily tasks" ON public.daily_tasks
    FOR ALL USING (auth.uid() = user_id);

-- ===================================================================
-- USER_STATS TABLE POLICIES
-- ===================================================================

-- Users can view their own stats
DROP POLICY IF EXISTS "Users can view own stats" ON public.user_stats;
CREATE POLICY "Users can view own stats" ON public.user_stats
    FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own stats
DROP POLICY IF EXISTS "Users can update own stats" ON public.user_stats;
CREATE POLICY "Users can update own stats" ON public.user_stats
    FOR ALL USING (auth.uid() = user_id);

-- Allow public read for leaderboard (limited fields)
DROP POLICY IF EXISTS "Public leaderboard stats access" ON public.user_stats;
CREATE POLICY "Public leaderboard stats access" ON public.user_stats
    FOR SELECT USING (true);

-- ===================================================================
-- GRANT PERMISSIONS
-- ===================================================================

-- Grant permissions to authenticated users
GRANT SELECT ON public.files TO authenticated, anon;
GRANT SELECT ON public.exams TO authenticated, anon;
GRANT SELECT ON public.tests TO authenticated;
GRANT SELECT ON public.questions TO authenticated;
GRANT SELECT ON public.options TO authenticated;
GRANT SELECT, INSERT ON public.exam_results TO authenticated;
GRANT SELECT ON public.courses TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.daily_tasks TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.user_stats TO authenticated;

-- Grant sequence permissions
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant admin permissions
GRANT ALL ON public.files TO authenticated;
GRANT ALL ON public.exams TO authenticated;
GRANT ALL ON public.tests TO authenticated;
GRANT ALL ON public.questions TO authenticated;
GRANT ALL ON public.options TO authenticated;
GRANT ALL ON public.courses TO authenticated;

COMMIT;
