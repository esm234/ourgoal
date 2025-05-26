-- =====================================================
-- FIX DOWNLOAD ISSUE - CREATE MISSING XP FUNCTION
-- This script creates the calculate_user_xp_basic function that the app needs
-- =====================================================

BEGIN;

-- ===================================================================
-- CREATE calculate_user_xp_basic FUNCTION
-- ===================================================================
CREATE OR REPLACE FUNCTION public.calculate_user_xp_basic(target_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    user_plan JSONB;
    completed_days_count INTEGER := 0;
    username_text TEXT := 'مستخدم';
    total_xp_amount INTEGER := 0;
    plan_xp_amount INTEGER := 500;
    study_days_xp_amount INTEGER := 0;
BEGIN
    -- Get user profile data
    SELECT study_plan, COALESCE(username, 'مستخدم')
    INTO user_plan, username_text
    FROM public.profiles
    WHERE id = target_user_id;

    -- Calculate XP from study plan
    IF user_plan IS NOT NULL THEN
        -- Get completed days count from study plan
        IF user_plan ? 'completed_days' AND jsonb_typeof(user_plan->'completed_days') = 'array' THEN
            SELECT COALESCE(
                array_length(
                    ARRAY(SELECT jsonb_array_elements_text(user_plan->'completed_days')::INTEGER),
                    1
                ), 0
            ) INTO completed_days_count;
        END IF;
        
        study_days_xp_amount := completed_days_count * 100; -- 100 XP per completed day
        total_xp_amount := plan_xp_amount + study_days_xp_amount;
    ELSE
        total_xp_amount := 0; -- No plan = no XP
    END IF;

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
        0, -- tasks_xp
        0, -- streak_xp
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
        plan_xp = EXCLUDED.plan_xp,
        last_calculated = NOW(),
        updated_at = NOW();

    RETURN total_xp_amount;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===================================================================
-- GRANT PERMISSIONS
-- ===================================================================
GRANT EXECUTE ON FUNCTION public.calculate_user_xp_basic(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.calculate_user_xp_basic(UUID) TO anon;

COMMIT;
