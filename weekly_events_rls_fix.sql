-- Weekly Events RLS Policies Fix
-- Run this script to fix the RLS policies for admin access
-- ===================================================================

BEGIN;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view enabled events" ON public.weekly_events;
DROP POLICY IF EXISTS "Users can view questions for enabled events" ON public.event_questions;
DROP POLICY IF EXISTS "Users can view own participations" ON public.event_participations;
DROP POLICY IF EXISTS "Users can insert own participations" ON public.event_participations;

-- Weekly Events Policies
-- Allow all users to read enabled events
CREATE POLICY "Users can view enabled events" ON public.weekly_events
    FOR SELECT USING (is_enabled = true);

-- Allow admins to manage all events
CREATE POLICY "Admins can manage events" ON public.weekly_events
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Event Questions Policies
-- Allow all users to read questions for enabled events
CREATE POLICY "Users can view questions for enabled events" ON public.event_questions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.weekly_events we
            WHERE we.id = event_questions.event_id AND we.is_enabled = true
        )
    );

-- Allow admins to manage all questions
CREATE POLICY "Admins can manage questions" ON public.event_questions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Event Participations Policies
-- Users can only view their own participations
CREATE POLICY "Users can view own participations" ON public.event_participations
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own participations
CREATE POLICY "Users can insert own participations" ON public.event_participations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can view all participations
CREATE POLICY "Admins can view all participations" ON public.event_participations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

COMMIT;
