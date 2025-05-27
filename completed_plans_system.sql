-- Completed Plans System Migration
-- This migration adds completed_plans system to preserve XP when plans are deleted

-- 1. Add completed_plans and xp columns to profiles table
-- ===================================================================
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS completed_plans JSONB DEFAULT '[]'::jsonb;

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0;

-- 2. Create indexes for better performance
-- ===================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_completed_plans
ON public.profiles USING gin(completed_plans);

CREATE INDEX IF NOT EXISTS idx_profiles_xp
ON public.profiles(xp DESC);

-- 3. Add validation function for completed plans structure
-- ===================================================================
CREATE OR REPLACE FUNCTION validate_completed_plans(plans JSONB)
RETURNS BOOLEAN AS $$
BEGIN
    -- Allow null or empty array
    IF plans IS NULL OR plans = '[]'::jsonb THEN
        RETURN TRUE;
    END IF;

    -- Must be an array
    IF jsonb_typeof(plans) != 'array' THEN
        RETURN FALSE;
    END IF;

    -- Each plan must have required fields
    -- We'll validate the structure in the application layer for flexibility
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- 4. Add constraint to ensure valid completed plans structure
-- ===================================================================
DO $$
BEGIN
    -- Check if constraint already exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'valid_completed_plans_structure'
        AND table_name = 'profiles'
    ) THEN
        ALTER TABLE public.profiles
        ADD CONSTRAINT valid_completed_plans_structure
        CHECK (validate_completed_plans(completed_plans));

        RAISE NOTICE 'Added constraint: valid_completed_plans_structure';
    ELSE
        RAISE NOTICE 'Constraint valid_completed_plans_structure already exists, skipping...';
    END IF;
END $$;

-- 5. Create function to move current plan to completed plans
-- ===================================================================
CREATE OR REPLACE FUNCTION complete_current_plan(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    current_plan JSONB;
    completed_plans_array JSONB;
    completed_plan JSONB;
    total_completed_days INTEGER := 0;
    xp_to_add INTEGER := 0;
BEGIN
    -- Get current study plan
    SELECT study_plan INTO current_plan
    FROM public.profiles
    WHERE id = user_id;

    -- If no current plan, return false
    IF current_plan IS NULL THEN
        RETURN FALSE;
    END IF;

    -- Get current completed plans array
    SELECT COALESCE(completed_plans, '[]'::jsonb) INTO completed_plans_array
    FROM public.profiles
    WHERE id = user_id;

    -- Count completed days in current plan
    IF current_plan ? 'study_days' AND jsonb_typeof(current_plan->'study_days') = 'array' THEN
        SELECT COUNT(*)::INTEGER INTO total_completed_days
        FROM jsonb_array_elements(current_plan->'study_days') AS day
        WHERE (day->>'completed')::boolean = true;
    END IF;

    -- Calculate XP for this completed plan (100 XP per completed day)
    xp_to_add := total_completed_days * 100;

    -- Create completed plan object
    completed_plan := jsonb_build_object(
        'name', current_plan->>'name',
        'total_days', current_plan->>'total_days',
        'review_rounds', current_plan->>'review_rounds',
        'test_date', current_plan->>'test_date',
        'completed_days', total_completed_days,
        'xp_earned', xp_to_add,
        'completed_at', NOW()::text,
        'original_created_at', current_plan->>'created_at'
    );

    -- Add to completed plans array
    completed_plans_array := completed_plans_array || completed_plan;

    -- Update profile with completed plan and clear current plan
    UPDATE public.profiles
    SET
        completed_plans = completed_plans_array,
        study_plan = NULL,
        updated_at = NOW()
    WHERE id = user_id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- 6. Create function to calculate total XP from completed plans
-- ===================================================================
CREATE OR REPLACE FUNCTION calculate_completed_plans_xp(user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    completed_plans_array JSONB;
    total_xp INTEGER := 0;
    plan_record JSONB;
BEGIN
    -- Get completed plans
    SELECT COALESCE(completed_plans, '[]'::jsonb) INTO completed_plans_array
    FROM public.profiles
    WHERE id = user_id;

    -- Sum XP from all completed plans
    FOR plan_record IN SELECT * FROM jsonb_array_elements(completed_plans_array)
    LOOP
        total_xp := total_xp + COALESCE((plan_record->>'xp_earned')::INTEGER, 0);
    END LOOP;

    RETURN total_xp;
END;
$$ LANGUAGE plpgsql;

-- 7. Create function to recalculate user XP including completed plans
-- ===================================================================
CREATE OR REPLACE FUNCTION recalculate_user_total_xp(user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    completed_plans_xp INTEGER := 0;
    events_xp INTEGER := 0;
    current_plan_xp INTEGER := 0;
    total_xp INTEGER := 0;
    current_plan JSONB;
    completed_days INTEGER := 0;
BEGIN
    -- Get XP from completed plans
    completed_plans_xp := calculate_completed_plans_xp(user_id);

    -- Get XP from events (from event_participations table)
    SELECT COALESCE(SUM(xp_earned), 0) INTO events_xp
    FROM public.event_participations
    WHERE user_id = recalculate_user_total_xp.user_id;

    -- Get XP from current plan (if any)
    SELECT study_plan INTO current_plan
    FROM public.profiles
    WHERE id = user_id;

    IF current_plan IS NOT NULL AND current_plan ? 'study_days' THEN
        SELECT COUNT(*)::INTEGER INTO completed_days
        FROM jsonb_array_elements(current_plan->'study_days') AS day
        WHERE (day->>'completed')::boolean = true;

        current_plan_xp := completed_days * 100; -- 100 XP per completed day
    END IF;

    -- Calculate total XP
    total_xp := completed_plans_xp + events_xp + current_plan_xp;

    -- Note: We'll store XP in user_xp table instead of profiles for now
    -- This avoids dependency on xp column in profiles

    RETURN total_xp;
END;
$$ LANGUAGE plpgsql;

-- 8. Update RLS policies (if needed)
-- ===================================================================
-- The existing policies should cover the new completed_plans column

-- 8. Create trigger to auto-update XP when completed_plans changes (Optional)
-- ===================================================================
-- Note: We'll handle XP calculation manually in the application for now
-- to avoid dependency on xp column in profiles table

-- CREATE OR REPLACE FUNCTION trigger_recalculate_xp()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     -- Only recalculate if completed_plans changed
--     IF OLD.completed_plans IS DISTINCT FROM NEW.completed_plans THEN
--         PERFORM recalculate_user_total_xp(NEW.id);
--     END IF;
--
--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- -- Drop trigger if exists and create new one
-- DROP TRIGGER IF EXISTS auto_recalculate_xp ON public.profiles;
-- CREATE TRIGGER auto_recalculate_xp
--     AFTER UPDATE ON public.profiles
--     FOR EACH ROW
--     EXECUTE FUNCTION trigger_recalculate_xp();

-- 9. Migration complete message
-- ===================================================================
DO $$
BEGIN
    RAISE NOTICE 'Completed Plans System migration completed successfully!';
    RAISE NOTICE 'New features:';
    RAISE NOTICE '- completed_plans column added to profiles';
    RAISE NOTICE '- xp column added to profiles (optional)';
    RAISE NOTICE '- complete_current_plan() function to move plans to completed';
    RAISE NOTICE '- XP calculation functions for completed plans';
    RAISE NOTICE '- Application will handle XP calculation manually';
    RAISE NOTICE '';
    RAISE NOTICE 'Usage:';
    RAISE NOTICE '- Call complete_current_plan(user_id) to complete a plan';
    RAISE NOTICE '- Use calculate_completed_plans_xp(user_id) to get XP from completed plans';
    RAISE NOTICE '- Use recalculate_user_total_xp(user_id) to get total XP';
END $$;
