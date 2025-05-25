-- Weekly Events System Database Schema
-- Optimized for minimal Supabase storage and bandwidth usage
-- ===================================================================

BEGIN;

-- 1. Weekly Events Table
-- ===================================================================
CREATE TABLE IF NOT EXISTS public.weekly_events (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('verbal', 'quantitative', 'mixed')),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 120, -- 2 hours default
    xp_reward INTEGER NOT NULL DEFAULT 50,
    is_enabled BOOLEAN NOT NULL DEFAULT true,
    status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'finished')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Event Questions Table (Optimized Storage)
-- ===================================================================
CREATE TABLE IF NOT EXISTS public.event_questions (
    id BIGSERIAL PRIMARY KEY,
    event_id BIGINT NOT NULL REFERENCES public.weekly_events(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type TEXT NOT NULL DEFAULT 'text' CHECK (question_type IN ('text', 'image', 'reading_comprehension')),
    image_url TEXT, -- Only for image questions
    passage_text TEXT, -- Only for reading comprehension
    category TEXT NOT NULL CHECK (category IN ('verbal', 'quantitative')),
    subcategory TEXT, -- For 'استيعاب مقروء' etc.
    question_order INTEGER NOT NULL,
    -- Store options as JSON array for efficiency: ["option1", "option2", "option3", "option4"]
    options JSONB NOT NULL,
    correct_answer INTEGER NOT NULL, -- Index of correct option (0-3)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Event Participations Table (Minimal Storage)
-- ===================================================================
CREATE TABLE IF NOT EXISTS public.event_participations (
    id BIGSERIAL PRIMARY KEY,
    event_id BIGINT NOT NULL REFERENCES public.weekly_events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    -- Store answers as compact JSON: [0,1,2,1,3,0] (indices of selected options)
    answers JSONB NOT NULL,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    time_taken_minutes INTEGER NOT NULL,
    xp_earned INTEGER NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, user_id) -- Ensure one participation per user per event
);

-- 4. Create Indexes for Performance
-- ===================================================================
CREATE INDEX IF NOT EXISTS idx_weekly_events_status ON public.weekly_events(status);
CREATE INDEX IF NOT EXISTS idx_weekly_events_start_time ON public.weekly_events(start_time);
CREATE INDEX IF NOT EXISTS idx_weekly_events_category ON public.weekly_events(category);
CREATE INDEX IF NOT EXISTS idx_weekly_events_enabled ON public.weekly_events(is_enabled);

CREATE INDEX IF NOT EXISTS idx_event_questions_event_id ON public.event_questions(event_id);
CREATE INDEX IF NOT EXISTS idx_event_questions_order ON public.event_questions(event_id, question_order);
CREATE INDEX IF NOT EXISTS idx_event_questions_category ON public.event_questions(category);

CREATE INDEX IF NOT EXISTS idx_event_participations_event_id ON public.event_participations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_participations_user_id ON public.event_participations(user_id);
CREATE INDEX IF NOT EXISTS idx_event_participations_score ON public.event_participations(event_id, score DESC);
CREATE INDEX IF NOT EXISTS idx_event_participations_completed ON public.event_participations(completed_at DESC);

-- 5. Auto-update Functions
-- ===================================================================
CREATE OR REPLACE FUNCTION update_weekly_events_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_weekly_events_updated_at
    BEFORE UPDATE ON public.weekly_events
    FOR EACH ROW
    EXECUTE FUNCTION update_weekly_events_updated_at();

-- 6. Event Status Management Function
-- ===================================================================
CREATE OR REPLACE FUNCTION update_event_status()
RETURNS void AS $$
BEGIN
    -- Update events to 'active' if start time has passed and still upcoming
    UPDATE public.weekly_events
    SET status = 'active'
    WHERE status = 'upcoming'
    AND start_time <= NOW()
    AND is_enabled = true;

    -- Update events to 'finished' if duration has passed
    UPDATE public.weekly_events
    SET status = 'finished'
    WHERE status = 'active'
    AND (start_time + INTERVAL '1 minute' * duration_minutes) <= NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. XP Integration Function (Optimized)
-- ===================================================================
CREATE OR REPLACE FUNCTION add_event_xp_to_user(target_user_id UUID, xp_amount INTEGER)
RETURNS void AS $$
BEGIN
    -- Add event XP to existing user_xp table
    INSERT INTO public.user_xp (user_id, username, total_xp, updated_at)
    SELECT
        target_user_id,
        COALESCE(p.username, 'مستخدم'),
        xp_amount,
        NOW()
    FROM public.profiles p
    WHERE p.id = target_user_id
    ON CONFLICT (user_id)
    DO UPDATE SET
        total_xp = user_xp.total_xp + xp_amount,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Leaderboard Function (Efficient Query)
-- ===================================================================
CREATE OR REPLACE FUNCTION get_event_leaderboard(target_event_id BIGINT, limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    user_id UUID,
    username TEXT,
    score INTEGER,
    total_questions INTEGER,
    percentage NUMERIC,
    time_taken_minutes INTEGER,
    rank_position INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        ep.user_id,
        COALESCE(p.username, 'مستخدم') as username,
        ep.score,
        ep.total_questions,
        ROUND((ep.score::NUMERIC / ep.total_questions::NUMERIC) * 100, 1) as percentage,
        ep.time_taken_minutes,
        ROW_NUMBER() OVER (ORDER BY ep.score DESC, ep.time_taken_minutes ASC)::INTEGER as rank_position
    FROM public.event_participations ep
    LEFT JOIN public.profiles p ON ep.user_id = p.id
    WHERE ep.event_id = target_event_id
    ORDER BY ep.score DESC, ep.time_taken_minutes ASC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. User Activity History Function
-- ===================================================================
CREATE OR REPLACE FUNCTION get_user_event_history(target_user_id UUID)
RETURNS TABLE (
    event_id BIGINT,
    event_title TEXT,
    event_category TEXT,
    score INTEGER,
    total_questions INTEGER,
    percentage NUMERIC,
    xp_earned INTEGER,
    rank_position INTEGER,
    completed_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        we.id as event_id,
        we.title as event_title,
        we.category as event_category,
        ep.score,
        ep.total_questions,
        ROUND((ep.score::NUMERIC / ep.total_questions::NUMERIC) * 100, 1) as percentage,
        ep.xp_earned,
        (
            SELECT COUNT(*) + 1
            FROM public.event_participations ep2
            WHERE ep2.event_id = ep.event_id
            AND (ep2.score > ep.score OR (ep2.score = ep.score AND ep2.time_taken_minutes < ep.time_taken_minutes))
        )::INTEGER as rank_position,
        ep.completed_at
    FROM public.event_participations ep
    JOIN public.weekly_events we ON ep.event_id = we.id
    WHERE ep.user_id = target_user_id
    ORDER BY ep.completed_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. RLS Policies
-- ===================================================================
ALTER TABLE public.weekly_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_participations ENABLE ROW LEVEL SECURITY;

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
