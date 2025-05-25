-- Fix XP Leaderboard for single plan system
-- This script ensures the user_xp table has the correct structure and data

-- 1. Ensure user_xp table exists with correct structure
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

-- 2. Add missing columns if they don't exist
-- ===================================================================
DO $$
BEGIN
    -- Add username column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_xp' AND column_name = 'username') THEN
        ALTER TABLE public.user_xp ADD COLUMN username TEXT NOT NULL DEFAULT 'مستخدم';
    END IF;

    -- Add completed_days column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_xp' AND column_name = 'completed_days') THEN
        ALTER TABLE public.user_xp ADD COLUMN completed_days INTEGER DEFAULT 0;
    END IF;

    -- Add XP breakdown columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_xp' AND column_name = 'study_days_xp') THEN
        ALTER TABLE public.user_xp ADD COLUMN study_days_xp INTEGER DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_xp' AND column_name = 'tasks_xp') THEN
        ALTER TABLE public.user_xp ADD COLUMN tasks_xp INTEGER DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_xp' AND column_name = 'streak_xp') THEN
        ALTER TABLE public.user_xp ADD COLUMN streak_xp INTEGER DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_xp' AND column_name = 'plan_xp') THEN
        ALTER TABLE public.user_xp ADD COLUMN plan_xp INTEGER DEFAULT 0;
    END IF;

    -- Add last_calculated column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_xp' AND column_name = 'last_calculated') THEN
        ALTER TABLE public.user_xp ADD COLUMN last_calculated TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- 3. Create indexes for better performance
-- ===================================================================
CREATE INDEX IF NOT EXISTS idx_user_xp_total_xp ON public.user_xp(total_xp DESC);
CREATE INDEX IF NOT EXISTS idx_user_xp_user_id ON public.user_xp(user_id);
CREATE INDEX IF NOT EXISTS idx_user_xp_updated_at ON public.user_xp(updated_at);

-- 4. Set up RLS policies
-- ===================================================================
ALTER TABLE public.user_xp ENABLE ROW LEVEL SECURITY;

-- Allow users to read all XP data (for leaderboard)
DROP POLICY IF EXISTS "Users can view all XP data" ON public.user_xp;
CREATE POLICY "Users can view all XP data" ON public.user_xp
    FOR SELECT USING (true);

-- Allow users to update their own XP data
DROP POLICY IF EXISTS "Users can update own XP" ON public.user_xp;
CREATE POLICY "Users can update own XP" ON public.user_xp
    FOR ALL USING (auth.uid() = user_id);

-- 5. Create function to populate XP data for all users
-- ===================================================================
CREATE OR REPLACE FUNCTION populate_all_user_xp()
RETURNS INTEGER AS $$
DECLARE
    user_record RECORD;
    updated_count INTEGER := 0;
    user_plan JSONB;
    completed_days_count INTEGER;
    completed_tasks_count INTEGER;
    current_streak INTEGER;
    username_val TEXT;
    plan_xp_val INTEGER;
    study_days_xp_val INTEGER;
    tasks_xp_val INTEGER;
    streak_xp_val INTEGER;
    total_xp_val INTEGER;
BEGIN
    -- Loop through all users with profiles
    FOR user_record IN
        SELECT id, username FROM public.profiles
    LOOP
        -- Get user's study plan
        SELECT study_plan INTO user_plan
        FROM public.profiles
        WHERE id = user_record.id;

        -- Calculate completed days
        IF user_plan IS NOT NULL THEN
            SELECT array_length(
                COALESCE(
                    ARRAY(SELECT jsonb_array_elements_text(user_plan->'completed_days')::INTEGER),
                    ARRAY[]::INTEGER[]
                ), 1
            ) INTO completed_days_count;

            IF completed_days_count IS NULL THEN
                completed_days_count := 0;
            END IF;

            plan_xp_val := 500; -- XP for having a plan
        ELSE
            completed_days_count := 0;
            plan_xp_val := 0;
        END IF;

        -- Calculate XP from completed tasks
        SELECT COUNT(*) INTO completed_tasks_count
        FROM public.daily_tasks
        WHERE user_id = user_record.id AND completed = true;

        -- Get current streak from user_stats
        SELECT COALESCE(us.current_streak, 0) INTO current_streak
        FROM public.user_stats us
        WHERE us.user_id = user_record.id;

        -- Calculate XP components
        study_days_xp_val := completed_days_count * 50;
        tasks_xp_val := completed_tasks_count * 25;
        streak_xp_val := current_streak * 100;
        total_xp_val := plan_xp_val + study_days_xp_val + tasks_xp_val + streak_xp_val;

        -- Get username
        username_val := COALESCE(user_record.username, 'مستخدم');

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
            user_record.id,
            username_val,
            completed_days_count,
            total_xp_val,
            study_days_xp_val,
            tasks_xp_val,
            streak_xp_val,
            plan_xp_val,
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

        updated_count := updated_count + 1;
    END LOOP;

    RAISE NOTICE 'Populated XP data for % users', updated_count;
    RETURN updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Grant permissions
-- ===================================================================
GRANT EXECUTE ON FUNCTION populate_all_user_xp() TO authenticated;

-- 7. Run the population function to initialize data
-- ===================================================================
SELECT populate_all_user_xp();

-- 8. Create a view for leaderboard with ranks
-- ===================================================================
CREATE OR REPLACE VIEW public.leaderboard_view AS
SELECT
    user_id,
    username,
    completed_days,
    total_xp,
    study_days_xp,
    tasks_xp,
    streak_xp,
    plan_xp,
    last_calculated,
    ROW_NUMBER() OVER (ORDER BY total_xp DESC, completed_days DESC, last_calculated ASC) as rank
FROM public.user_xp
WHERE total_xp > 0
ORDER BY total_xp DESC, completed_days DESC;

-- Grant access to the view
GRANT SELECT ON public.leaderboard_view TO authenticated;

COMMIT;
