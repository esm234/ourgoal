-- Remove All Old XP Functions and Replace with Correct Ones
-- This script removes all problematic XP functions and replaces them with correct ones

-- 1. Drop ALL existing XP-related functions
-- ===================================================================
DROP FUNCTION IF EXISTS calculate_user_xp_basic(UUID);
DROP FUNCTION IF EXISTS calculate_user_xp_simple(UUID);
DROP FUNCTION IF EXISTS calculate_user_xp(UUID);
DROP FUNCTION IF EXISTS calculate_single_user_xp(UUID);
DROP FUNCTION IF EXISTS update_user_stats(UUID);
DROP FUNCTION IF EXISTS refresh_all_user_xp();

-- 2. Create the ONLY correct XP calculation function
-- ===================================================================
CREATE OR REPLACE FUNCTION calculate_user_xp_correct(target_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    events_xp INTEGER := 0;
    completed_plans_xp INTEGER := 0;
    current_plan_xp INTEGER := 0;
    total_xp INTEGER := 0;
    current_plan JSONB;
    completed_days INTEGER := 0;
    username_text TEXT;
BEGIN
    -- Get username
    SELECT username INTO username_text
    FROM public.profiles
    WHERE id = target_user_id;
    
    IF username_text IS NULL OR username_text = '' THEN
        username_text := 'مستخدم';
    END IF;

    -- 1. Get XP from events (from event_participations table)
    SELECT COALESCE(SUM(xp_earned), 0) INTO events_xp
    FROM public.event_participations
    WHERE user_id = target_user_id;

    -- 2. Get XP from completed plans
    SELECT COALESCE(
        (
            SELECT SUM((plan->>'xp_earned')::INTEGER)
            FROM jsonb_array_elements(COALESCE(completed_plans, '[]'::jsonb)) AS plan
        ), 0
    ) INTO completed_plans_xp
    FROM public.profiles
    WHERE id = target_user_id;

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

    -- Calculate total XP (NO automatic plan XP)
    total_xp := events_xp + completed_plans_xp + current_plan_xp;

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

-- 3. Create alias functions for backward compatibility
-- ===================================================================
CREATE OR REPLACE FUNCTION calculate_user_xp_basic(target_user_id UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN calculate_user_xp_correct(target_user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION calculate_user_xp(user_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN calculate_user_xp_correct(user_uuid);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION calculate_single_user_xp(target_user_id UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN calculate_user_xp_correct(target_user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create update_user_stats function that doesn't give automatic XP
-- ===================================================================
CREATE OR REPLACE FUNCTION update_user_stats(user_uuid UUID)
RETURNS void AS $$
DECLARE
    current_plan JSONB;
    completed_days_count INTEGER := 0;
    total_days_count INTEGER := 0;
    completion_percentage DECIMAL := 0;
BEGIN
    -- Get user's study plan
    SELECT study_plan INTO current_plan
    FROM public.profiles
    WHERE id = user_uuid;

    -- Calculate completion stats
    IF current_plan IS NOT NULL AND current_plan ? 'study_days' THEN
        -- Count completed days
        SELECT COUNT(*)::INTEGER INTO completed_days_count
        FROM jsonb_array_elements(current_plan->'study_days') AS day
        WHERE (day->>'completed')::boolean = true;

        -- Count total days
        SELECT jsonb_array_length(current_plan->'study_days') INTO total_days_count;

        -- Add final review day to total if it exists
        IF current_plan ? 'final_review_day' THEN
            total_days_count := total_days_count + 1;
            
            -- Add to completed if final review is completed
            IF (current_plan->'final_review_day'->>'completed')::boolean = true THEN
                completed_days_count := completed_days_count + 1;
            END IF;
        END IF;

        -- Calculate percentage
        IF total_days_count > 0 THEN
            completion_percentage := (completed_days_count::DECIMAL / total_days_count::DECIMAL) * 100;
        END IF;
    END IF;

    -- Update or insert user stats (without automatic XP)
    INSERT INTO public.user_stats (
        user_id,
        completed_days,
        total_days,
        completion_percentage,
        updated_at
    )
    VALUES (
        user_uuid,
        completed_days_count,
        total_days_count,
        completion_percentage,
        NOW()
    )
    ON CONFLICT (user_id)
    DO UPDATE SET
        completed_days = completed_days_count,
        total_days = total_days_count,
        completion_percentage = completion_percentage,
        updated_at = NOW();

    -- Calculate XP correctly (no automatic 500 XP)
    PERFORM calculate_user_xp_correct(user_uuid);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create refresh_all_user_xp function
-- ===================================================================
CREATE OR REPLACE FUNCTION refresh_all_user_xp()
RETURNS void AS $$
DECLARE
    user_record RECORD;
    new_xp INTEGER;
BEGIN
    FOR user_record IN 
        SELECT DISTINCT id 
        FROM public.profiles
        WHERE study_plan IS NOT NULL OR id IN (SELECT user_id FROM public.event_participations)
    LOOP
        -- Recalculate XP for each user
        new_xp := calculate_user_xp_correct(user_record.id);
        
        RAISE NOTICE 'Recalculated XP for user: % - New XP: %', user_record.id, new_xp;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Grant permissions
-- ===================================================================
GRANT EXECUTE ON FUNCTION calculate_user_xp_correct(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_user_xp_basic(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_user_xp(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_single_user_xp(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION update_user_stats(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION refresh_all_user_xp() TO authenticated;

-- 7. Recalculate XP for all users to fix existing incorrect XP
-- ===================================================================
SELECT refresh_all_user_xp();

-- 8. Success message
-- ===================================================================
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '🔧 All XP Functions Fixed!';
    RAISE NOTICE '';
    RAISE NOTICE 'Changes made:';
    RAISE NOTICE '- Removed ALL old XP functions that gave automatic 500 XP';
    RAISE NOTICE '- Created new calculate_user_xp_correct function';
    RAISE NOTICE '- Created backward-compatible alias functions';
    RAISE NOTICE '- XP now only comes from:';
    RAISE NOTICE '  * Events: from event_participations table';
    RAISE NOTICE '  * Completed plans: from completed_plans array';
    RAISE NOTICE '  * Current plan: only actually completed days (100 XP each)';
    RAISE NOTICE '- NO automatic 500 XP for having a plan';
    RAISE NOTICE '';
    RAISE NOTICE 'All users XP recalculated correctly! ✅';
END $$;
