-- Daily Completion Limits Migration
-- This migration adds daily completion tracking to enforce 2-day completion limit per day

-- 1. Add daily_completions column to profiles table
-- ===================================================================
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS daily_completions JSONB DEFAULT '[]'::jsonb;

-- 2. Create index for better performance
-- ===================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_daily_completions 
ON public.profiles USING gin(daily_completions);

-- 3. Add validation function for daily completions structure
-- ===================================================================
CREATE OR REPLACE FUNCTION validate_daily_completions(completions JSONB)
RETURNS BOOLEAN AS $$
BEGIN
    -- Allow null or empty array
    IF completions IS NULL OR completions = '[]'::jsonb THEN
        RETURN TRUE;
    END IF;

    -- Must be an array
    IF jsonb_typeof(completions) != 'array' THEN
        RETURN FALSE;
    END IF;

    -- Each record must have required fields: date, completed_days, count
    -- We'll validate the structure in the application layer for flexibility
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- 4. Add constraint to ensure valid daily completions structure
-- ===================================================================
ALTER TABLE public.profiles 
ADD CONSTRAINT valid_daily_completions_structure 
CHECK (validate_daily_completions(daily_completions));

-- 5. Create helper function to check daily completion limit
-- ===================================================================
CREATE OR REPLACE FUNCTION check_daily_completion_limit(
    target_user_id UUID,
    target_date DATE DEFAULT CURRENT_DATE
)
RETURNS INTEGER AS $$
DECLARE
    daily_records JSONB;
    today_record JSONB;
    completion_count INTEGER := 0;
BEGIN
    -- Get daily completions from profile
    SELECT COALESCE(daily_completions, '[]'::jsonb) INTO daily_records
    FROM public.profiles
    WHERE id = target_user_id;

    -- Find today's record
    SELECT record INTO today_record
    FROM jsonb_array_elements(daily_records) AS record
    WHERE record->>'date' = target_date::text;

    -- Get completion count for today
    IF today_record IS NOT NULL THEN
        completion_count := COALESCE((today_record->>'count')::INTEGER, 0);
    END IF;

    RETURN completion_count;
END;
$$ LANGUAGE plpgsql;

-- 6. Create function to get remaining completions for today
-- ===================================================================
CREATE OR REPLACE FUNCTION get_remaining_completions_today(target_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    daily_limit INTEGER := 2;
    used_today INTEGER;
BEGIN
    used_today := check_daily_completion_limit(target_user_id);
    RETURN GREATEST(0, daily_limit - used_today);
END;
$$ LANGUAGE plpgsql;

-- 7. Migration complete message
-- ===================================================================
DO $$
BEGIN
    RAISE NOTICE 'Daily Completion Limits migration completed successfully!';
    RAISE NOTICE 'New features:';
    RAISE NOTICE '- daily_completions column added to profiles';
    RAISE NOTICE '- Daily completion limit validation functions';
    RAISE NOTICE '- Users can now complete maximum 2 days per day';
    RAISE NOTICE '';
    RAISE NOTICE 'Usage:';
    RAISE NOTICE '- check_daily_completion_limit(user_id) to check current usage';
    RAISE NOTICE '- get_remaining_completions_today(user_id) to get remaining completions';
    RAISE NOTICE '- Application will enforce 2-day limit per day';
END $$;
