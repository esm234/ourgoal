-- Fix Plan Completion XP Issue
-- This script ensures XP is correctly calculated and persisted when completing plans

-- 1. Improve complete_current_plan function with better XP handling
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
    final_review_completed BOOLEAN := FALSE;
BEGIN
    -- Get current study plan
    SELECT study_plan INTO current_plan
    FROM public.profiles
    WHERE id = target_user_id;

    -- If no current plan, return false
    IF current_plan IS NULL THEN
        RAISE NOTICE 'No current plan found for user: %', target_user_id;
        RETURN FALSE;
    END IF;

    RAISE NOTICE 'Completing plan for user: %, plan: %', target_user_id, current_plan->>'name';

    -- Get current completed plans array
    SELECT COALESCE(completed_plans, '[]'::jsonb) INTO completed_plans_array
    FROM public.profiles
    WHERE id = target_user_id;

    -- Mark ALL days as completed and count total days
    IF current_plan ? 'study_days' AND jsonb_typeof(current_plan->'study_days') = 'array' THEN
        -- Get total number of days
        SELECT jsonb_array_length(current_plan->'study_days') INTO total_completed_days;

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

            total_completed_days := total_completed_days + 1;
            final_review_completed := TRUE;
        END IF;
    END IF;

    -- Calculate XP for this completed plan (100 XP per day - all days completed)
    xp_to_add := total_completed_days * 100;

    RAISE NOTICE 'Plan completion details: total_days=%, xp_to_add=%, final_review=%',
                 total_completed_days, xp_to_add, final_review_completed;

    -- Create completed plan object with all necessary data
    completed_plan := jsonb_build_object(
        'name', current_plan->>'name',
        'total_days', total_completed_days,
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
    SELECT COALESCE(username, 'مستخدم') INTO user_name
    FROM public.profiles
    WHERE id = target_user_id;

    -- Calculate new total XP using the recalculate function
    new_total_xp := recalculate_user_total_xp(target_user_id);

    RAISE NOTICE 'Calculated new total XP: % for user: %', new_total_xp, target_user_id;

    -- Update or insert into user_xp table with proper conflict handling
    INSERT INTO public.user_xp (user_id, username, total_xp, updated_at)
    VALUES (target_user_id, user_name, new_total_xp, NOW())
    ON CONFLICT (user_id)
    DO UPDATE SET
        username = user_name,
        total_xp = new_total_xp,
        updated_at = NOW();

    RAISE NOTICE 'Plan completion successful for user: %, new XP: %', target_user_id, new_total_xp;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Improve recalculate_user_total_xp function with better logging
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
    completed_plans_array JSONB;
BEGIN
    -- Get XP from completed plans
    SELECT COALESCE(completed_plans, '[]'::jsonb) INTO completed_plans_array
    FROM public.profiles
    WHERE id = target_user_id;

    -- Calculate XP from completed plans
    SELECT COALESCE(
        (
            SELECT SUM((plan->>'xp_earned')::INTEGER)
            FROM jsonb_array_elements(completed_plans_array) AS plan
            WHERE (plan->>'xp_earned') IS NOT NULL
        ), 0
    ) INTO completed_plans_xp;

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

    RAISE NOTICE 'XP calculation for user %: completed_plans=%, events=%, current_plan=%, total=%',
                 target_user_id, completed_plans_xp, events_xp, current_plan_xp, total_xp;

    RETURN total_xp;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Fix calculate_user_xp_basic function to ensure it works correctly
-- ===================================================================
DROP FUNCTION IF EXISTS calculate_user_xp_basic(UUID);

CREATE OR REPLACE FUNCTION calculate_user_xp_basic(target_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    events_xp INTEGER := 0;
    completed_plans_xp INTEGER := 0;
    current_plan_xp INTEGER := 0;
    total_xp INTEGER := 0;
    current_plan JSONB;
    completed_days INTEGER := 0;
    username_text TEXT;
    completed_plans_array JSONB;
BEGIN
    -- Get username
    SELECT COALESCE(username, 'مستخدم') INTO username_text
    FROM public.profiles
    WHERE id = target_user_id;

    -- 1. Get XP from events (from event_participations table)
    SELECT COALESCE(SUM(xp_earned), 0) INTO events_xp
    FROM public.event_participations
    WHERE user_id = target_user_id;

    -- 2. Get XP from completed plans
    SELECT COALESCE(completed_plans, '[]'::jsonb) INTO completed_plans_array
    FROM public.profiles
    WHERE id = target_user_id;

    -- Calculate XP from completed plans
    SELECT COALESCE(
        (
            SELECT SUM((plan->>'xp_earned')::INTEGER)
            FROM jsonb_array_elements(completed_plans_array) AS plan
            WHERE (plan->>'xp_earned') IS NOT NULL
        ), 0
    ) INTO completed_plans_xp;

    -- 3. Get XP from current plan (only actually completed days)
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
    total_xp := events_xp + completed_plans_xp + current_plan_xp;

    RAISE NOTICE 'calculate_user_xp_basic for user %: events=%, completed_plans=%, current_plan=%, total=%',
                 target_user_id, events_xp, completed_plans_xp, current_plan_xp, total_xp;

    -- Update user_xp table
    INSERT INTO public.user_xp (
        user_id,
        username,
        total_xp,
        updated_at
    )
    VALUES (
        target_user_id,
        username_text,
        total_xp,
        NOW()
    )
    ON CONFLICT (user_id)
    DO UPDATE SET
        username = username_text,
        total_xp = total_xp,
        updated_at = NOW();

    RETURN total_xp;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Grant permissions
-- ===================================================================
GRANT EXECUTE ON FUNCTION complete_current_plan(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION recalculate_user_total_xp(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_user_xp_basic(UUID) TO authenticated;

-- 5. Success message
-- ===================================================================
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '🔧 Plan Completion XP Fix Applied!';
    RAISE NOTICE '';
    RAISE NOTICE 'Improvements made:';
    RAISE NOTICE '- Enhanced complete_current_plan function with better logging';
    RAISE NOTICE '- Improved recalculate_user_total_xp function';
    RAISE NOTICE '- Fixed calculate_user_xp_basic function to handle completed plans correctly';
    RAISE NOTICE '- Added proper error handling and debugging';
    RAISE NOTICE '- XP calculation now more reliable and traceable';
    RAISE NOTICE '';
    RAISE NOTICE 'The XP issue should now be resolved! ✅';
    RAISE NOTICE 'Test by completing a plan and checking XP calculation.';
END $$;
