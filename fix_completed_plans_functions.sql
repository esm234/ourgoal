-- Fix Completed Plans Functions
-- This script drops and recreates the functions with correct parameter names

-- 1. Drop existing constraints and functions if they exist
-- ===================================================================
-- Drop constraint first (if it exists)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'valid_completed_plans_structure'
        AND table_name = 'profiles'
    ) THEN
        ALTER TABLE public.profiles DROP CONSTRAINT valid_completed_plans_structure;
        RAISE NOTICE 'Dropped existing constraint: valid_completed_plans_structure';
    END IF;
END $$;

-- Drop functions
DROP FUNCTION IF EXISTS complete_current_plan(uuid);
DROP FUNCTION IF EXISTS calculate_completed_plans_xp(uuid);
DROP FUNCTION IF EXISTS recalculate_user_total_xp(uuid);
DROP FUNCTION IF EXISTS validate_completed_plans(jsonb);

-- 2. Add missing columns if they don't exist
-- ===================================================================
DO $$
BEGIN
    -- Add completed_plans column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'profiles'
        AND column_name = 'completed_plans'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.profiles
        ADD COLUMN completed_plans JSONB DEFAULT '[]'::jsonb;
        RAISE NOTICE 'Added completed_plans column';
    END IF;

    -- Add xp column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'profiles'
        AND column_name = 'xp'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.profiles
        ADD COLUMN xp INTEGER DEFAULT 0;
        RAISE NOTICE 'Added xp column';
    END IF;
END $$;

-- 3. Create indexes
-- ===================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_completed_plans
ON public.profiles USING gin(completed_plans);

CREATE INDEX IF NOT EXISTS idx_profiles_xp
ON public.profiles(xp DESC);

-- 4. Create validation function
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

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- 5. Create complete_current_plan function
-- ===================================================================
CREATE OR REPLACE FUNCTION complete_current_plan(target_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    current_plan JSONB;
    completed_plans_array JSONB;
    completed_plan JSONB;
    total_completed_days INTEGER := 0;
    xp_to_add INTEGER := 0;
    user_name TEXT;
    new_total_xp INTEGER;
BEGIN
    -- Get current study plan
    SELECT study_plan INTO current_plan
    FROM public.profiles
    WHERE id = target_user_id;

    -- If no current plan, return false
    IF current_plan IS NULL THEN
        RETURN FALSE;
    END IF;

    -- Get current completed plans array
    SELECT COALESCE(completed_plans, '[]'::jsonb) INTO completed_plans_array
    FROM public.profiles
    WHERE id = target_user_id;

    -- Mark ALL days as completed and count total days
    IF current_plan ? 'study_days' AND jsonb_typeof(current_plan->'study_days') = 'array' THEN
        -- Get total number of days (including final review day)
        SELECT jsonb_array_length(current_plan->'study_days') INTO total_completed_days;

        -- Add 1 for final review day if it exists
        IF current_plan ? 'final_review_day' THEN
            total_completed_days := total_completed_days + 1;
        END IF;

        -- Update the current plan to mark all study days as completed
        SELECT jsonb_set(
            current_plan,
            '{study_days}',
            (
                SELECT jsonb_agg(
                    jsonb_set(day, '{completed}', 'true'::jsonb)
                )
                FROM jsonb_array_elements(current_plan->'study_days') AS day
            )
        ) INTO current_plan;

        -- Mark final review day as completed if it exists
        IF current_plan ? 'final_review_day' THEN
            SELECT jsonb_set(
                current_plan,
                '{final_review_day,completed}',
                'true'::jsonb
            ) INTO current_plan;
        END IF;
    END IF;

    -- Calculate XP for this completed plan (100 XP per day - all days completed)
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
    WHERE id = target_user_id;

    -- Get username for user_xp table
    SELECT username INTO user_name
    FROM public.profiles
    WHERE id = target_user_id;

    -- Calculate new total XP using the recalculate function
    new_total_xp := recalculate_user_total_xp(target_user_id);

    -- Update or insert into user_xp table
    INSERT INTO public.user_xp (user_id, username, total_xp, updated_at)
    VALUES (target_user_id, COALESCE(user_name, 'مستخدم'), new_total_xp, NOW())
    ON CONFLICT (user_id)
    DO UPDATE SET
        username = COALESCE(user_name, 'مستخدم'),
        total_xp = new_total_xp,
        updated_at = NOW();

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- 6. Create calculate_completed_plans_xp function
-- ===================================================================
CREATE OR REPLACE FUNCTION calculate_completed_plans_xp(target_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    completed_plans_array JSONB;
    total_xp INTEGER := 0;
    plan_record JSONB;
BEGIN
    -- Get completed plans
    SELECT COALESCE(completed_plans, '[]'::jsonb) INTO completed_plans_array
    FROM public.profiles
    WHERE id = target_user_id;

    -- Sum XP from all completed plans
    FOR plan_record IN SELECT * FROM jsonb_array_elements(completed_plans_array)
    LOOP
        total_xp := total_xp + COALESCE((plan_record->>'xp_earned')::INTEGER, 0);
    END LOOP;

    RETURN total_xp;
END;
$$ LANGUAGE plpgsql;

-- 7. Create recalculate_user_total_xp function
-- ===================================================================
CREATE OR REPLACE FUNCTION recalculate_user_total_xp(target_user_id UUID)
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
    completed_plans_xp := calculate_completed_plans_xp(target_user_id);

    -- Get XP from events (from event_participations table)
    SELECT COALESCE(SUM(xp_earned), 0) INTO events_xp
    FROM public.event_participations
    WHERE event_participations.user_id = target_user_id;

    -- Get XP from current plan (if any) - only count actually completed days
    SELECT study_plan INTO current_plan
    FROM public.profiles
    WHERE id = target_user_id;

    IF current_plan IS NOT NULL AND current_plan ? 'study_days' THEN
        -- Count only days that are actually marked as completed
        SELECT COUNT(*)::INTEGER INTO completed_days
        FROM jsonb_array_elements(current_plan->'study_days') AS day
        WHERE (day->>'completed')::boolean = true;

        -- Add final review day if it's completed
        IF current_plan ? 'final_review_day' AND (current_plan->'final_review_day'->>'completed')::boolean = true THEN
            completed_days := completed_days + 1;
        END IF;

        current_plan_xp := completed_days * 100; -- 100 XP per actually completed day
    END IF;

    -- Calculate total XP
    total_xp := completed_plans_xp + events_xp + current_plan_xp;

    RETURN total_xp;
END;
$$ LANGUAGE plpgsql;

-- 8. Add constraint if it doesn't exist
-- ===================================================================
DO $$
BEGIN
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
        RAISE NOTICE 'Constraint already exists, skipping...';
    END IF;
END $$;

-- 9. Success message
-- ===================================================================
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=== Completed Plans System Fixed Successfully! ===';
    RAISE NOTICE 'Functions available:';
    RAISE NOTICE '- complete_current_plan(user_id) - Move current plan to completed';
    RAISE NOTICE '- calculate_completed_plans_xp(user_id) - Get XP from completed plans';
    RAISE NOTICE '- recalculate_user_total_xp(user_id) - Get total XP from all sources';
    RAISE NOTICE '';
    RAISE NOTICE 'Ready to use!';
END $$;
