-- Simple XP Leaderboard Fix
-- This script fixes the XP calculation for the single plan system

-- 1. Create or update user_xp table structure
-- ===================================================================
CREATE TABLE IF NOT EXISTS public.user_xp (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT NOT NULL DEFAULT 'مستخدم',
    completed_days INTEGER DEFAULT 0,
    total_xp INTEGER DEFAULT 0,
    study_days_xp INTEGER DEFAULT 0,
    tasks_xp INTEGER DEFAULT 0,
    streak_xp INTEGER DEFAULT 0,
    plan_xp INTEGER DEFAULT 0,
    last_calculated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- 2. Enable RLS and set policies
-- ===================================================================
ALTER TABLE public.user_xp ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view all XP data" ON public.user_xp;
CREATE POLICY "Users can view all XP data" ON public.user_xp
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own XP" ON public.user_xp;
CREATE POLICY "Users can update own XP" ON public.user_xp
    FOR ALL USING (auth.uid() = user_id);

-- 3. Create simple function to calculate XP for a single user
-- ===================================================================
CREATE OR REPLACE FUNCTION calculate_single_user_xp(target_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    user_plan JSONB;
    completed_days_count INTEGER := 0;
    completed_tasks_count INTEGER := 0;
    user_streak INTEGER := 0;
    username_text TEXT;
    plan_xp_amount INTEGER := 0;
    study_days_xp_amount INTEGER := 0;
    tasks_xp_amount INTEGER := 0;
    streak_xp_amount INTEGER := 0;
    total_xp_amount INTEGER := 0;
BEGIN
    -- Get user profile data
    SELECT study_plan, username 
    INTO user_plan, username_text
    FROM public.profiles
    WHERE id = target_user_id;
    
    -- Set default username if null
    IF username_text IS NULL OR username_text = '' THEN
        username_text := 'مستخدم';
    END IF;
    
    -- Calculate XP from study plan
    IF user_plan IS NOT NULL THEN
        plan_xp_amount := 500; -- 500 XP for having a plan
        
        -- Get completed days count
        SELECT COALESCE(
            array_length(
                ARRAY(SELECT jsonb_array_elements_text(user_plan->'completed_days')::INTEGER),
                1
            ), 0
        ) INTO completed_days_count;
        
        study_days_xp_amount := completed_days_count * 50; -- 50 XP per completed day
    END IF;
    
    -- Calculate XP from completed tasks
    SELECT COUNT(*)
    INTO completed_tasks_count
    FROM public.daily_tasks
    WHERE user_id = target_user_id AND completed = true;
    
    tasks_xp_amount := completed_tasks_count * 25; -- 25 XP per task
    
    -- Get current streak from user_stats
    SELECT COALESCE(us.current_streak, 0)
    INTO user_streak
    FROM public.user_stats us
    WHERE us.user_id = target_user_id;
    
    streak_xp_amount := user_streak * 100; -- 100 XP per streak day
    
    -- Calculate total XP
    total_xp_amount := plan_xp_amount + study_days_xp_amount + tasks_xp_amount + streak_xp_amount;
    
    -- Insert or update user XP
    INSERT INTO public.user_xp (
        user_id,
        username,
        completed_days,
        total_xp,
        study_days_xp,
        tasks_xp,
        streak_xp,
        plan_xp,
        last_calculated,
        updated_at
    )
    VALUES (
        target_user_id,
        username_text,
        completed_days_count,
        total_xp_amount,
        study_days_xp_amount,
        tasks_xp_amount,
        streak_xp_amount,
        plan_xp_amount,
        NOW(),
        NOW()
    )
    ON CONFLICT (user_id)
    DO UPDATE SET
        username = EXCLUDED.username,
        completed_days = EXCLUDED.completed_days,
        total_xp = EXCLUDED.total_xp,
        study_days_xp = EXCLUDED.study_days_xp,
        tasks_xp = EXCLUDED.tasks_xp,
        streak_xp = EXCLUDED.streak_xp,
        plan_xp = EXCLUDED.plan_xp,
        last_calculated = EXCLUDED.last_calculated,
        updated_at = EXCLUDED.updated_at;
    
    RETURN total_xp_amount;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create function to refresh all users XP
-- ===================================================================
CREATE OR REPLACE FUNCTION refresh_all_users_xp()
RETURNS INTEGER AS $$
DECLARE
    user_record RECORD;
    updated_count INTEGER := 0;
BEGIN
    FOR user_record IN 
        SELECT id FROM public.profiles
    LOOP
        PERFORM calculate_single_user_xp(user_record.id);
        updated_count := updated_count + 1;
    END LOOP;
    
    RETURN updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Grant permissions
-- ===================================================================
GRANT EXECUTE ON FUNCTION calculate_single_user_xp(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION refresh_all_users_xp() TO authenticated;

-- 6. Create indexes for performance
-- ===================================================================
CREATE INDEX IF NOT EXISTS idx_user_xp_total_xp ON public.user_xp(total_xp DESC);
CREATE INDEX IF NOT EXISTS idx_user_xp_user_id ON public.user_xp(user_id);

-- 7. Initialize XP data for all existing users
-- ===================================================================
SELECT refresh_all_users_xp();

COMMIT;
