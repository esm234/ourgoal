-- Fix ambiguous column reference in calculate_user_xp_basic function
-- This fixes the "column reference 'total_xp' is ambiguous" error

-- 1. Drop existing function
-- ===================================================================
DROP FUNCTION IF EXISTS calculate_user_xp_basic(UUID);

-- 2. Create fixed function with proper column references
-- ===================================================================
CREATE FUNCTION calculate_user_xp_basic(target_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    events_xp INTEGER := 0;
    completed_plans_xp INTEGER := 0;
    current_plan_xp INTEGER := 0;
    calculated_total_xp INTEGER := 0;
    current_plan JSONB;
    completed_days INTEGER := 0;
    username_text TEXT;
    completed_plans_array JSONB;
BEGIN
    -- Get username
    SELECT COALESCE(username, 'مستخدم') INTO username_text
    FROM public.profiles
    WHERE id = target_user_id;

    -- 1. Get XP from events
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

    -- 3. Get XP from current plan
    SELECT study_plan INTO current_plan
    FROM public.profiles
    WHERE id = target_user_id;

    IF current_plan IS NOT NULL AND current_plan ? 'study_days' THEN
        -- Count completed days
        SELECT COUNT(*)::INTEGER INTO completed_days
        FROM jsonb_array_elements(current_plan->'study_days') AS day
        WHERE (day->>'completed')::boolean = true;

        -- Add final review day if completed
        IF current_plan ? 'final_review_day' AND (current_plan->'final_review_day'->>'completed')::boolean = true THEN
            completed_days := completed_days + 1;
        END IF;

        current_plan_xp := completed_days * 100;
    END IF;

    -- Calculate total (using different variable name to avoid ambiguity)
    calculated_total_xp := events_xp + completed_plans_xp + current_plan_xp;

    RAISE NOTICE 'calculate_user_xp_basic for user %: events=%, completed_plans=%, current_plan=%, total=%', 
                 target_user_id, events_xp, completed_plans_xp, current_plan_xp, calculated_total_xp;

    -- Update user_xp table with explicit column names
    INSERT INTO public.user_xp (user_id, username, total_xp, updated_at)
    VALUES (target_user_id, username_text, calculated_total_xp, NOW())
    ON CONFLICT (user_id)
    DO UPDATE SET
        username = EXCLUDED.username,
        total_xp = EXCLUDED.total_xp,
        updated_at = EXCLUDED.updated_at;

    RETURN calculated_total_xp;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Grant permissions
-- ===================================================================
GRANT EXECUTE ON FUNCTION calculate_user_xp_basic(UUID) TO authenticated;

-- 4. Success message
-- ===================================================================
DO $$
BEGIN
    RAISE NOTICE 'Fixed ambiguous column reference in calculate_user_xp_basic function!';
    RAISE NOTICE 'You can now save and complete study plans without errors.';
END $$;
