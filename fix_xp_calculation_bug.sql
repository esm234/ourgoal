-- Fix XP Calculation Bug
-- This script fixes the issue where users get 500 XP just for creating a study plan

-- 1. Drop the problematic calculate_user_xp function
-- ===================================================================
DROP FUNCTION IF EXISTS calculate_user_xp(UUID);

-- 2. Create corrected calculate_user_xp function (no automatic 500 XP for having a plan)
-- ===================================================================
CREATE OR REPLACE FUNCTION calculate_user_xp(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    total_xp INTEGER := 0;
    study_days_xp INTEGER := 0;
    tasks_xp INTEGER := 0;
    streak_xp INTEGER := 0;
    events_xp INTEGER := 0;
    completed_plans_xp INTEGER := 0;
    user_plan JSONB;
    completed_days_count INTEGER := 0;
    completed_tasks_count INTEGER := 0;
    current_streak INTEGER := 0;
    username_text TEXT;
BEGIN
    -- Get username
    SELECT username INTO username_text
    FROM public.profiles
    WHERE id = user_uuid;
    
    IF username_text IS NULL OR username_text = '' THEN
        username_text := 'مستخدم';
    END IF;

    -- 1. Calculate XP from current study plan (only completed days)
    SELECT study_plan INTO user_plan
    FROM public.profiles
    WHERE id = user_uuid;

    IF user_plan IS NOT NULL AND user_plan ? 'study_days' THEN
        -- Count only days that are actually marked as completed
        SELECT COUNT(*)::INTEGER INTO completed_days_count
        FROM jsonb_array_elements(user_plan->'study_days') AS day
        WHERE (day->>'completed')::boolean = true;

        -- Add final review day if it's completed
        IF user_plan ? 'final_review_day' AND (user_plan->'final_review_day'->>'completed')::boolean = true THEN
            completed_days_count := completed_days_count + 1;
        END IF;

        -- XP for completed study days (100 XP per day)
        study_days_xp := completed_days_count * 100;
    END IF;

    -- 2. Calculate XP from completed plans
    SELECT COALESCE(
        (
            SELECT SUM((plan->>'xp_earned')::INTEGER)
            FROM jsonb_array_elements(COALESCE(completed_plans, '[]'::jsonb)) AS plan
        ), 0
    ) INTO completed_plans_xp
    FROM public.profiles
    WHERE id = user_uuid;

    -- 3. Calculate XP from events
    SELECT COALESCE(SUM(xp_earned), 0) INTO events_xp
    FROM public.event_participations
    WHERE user_id = user_uuid;

    -- 4. Calculate XP from completed tasks (25 XP per task)
    SELECT COUNT(*) * 25 INTO tasks_xp
    FROM public.daily_tasks
    WHERE user_id = user_uuid AND completed = true;

    -- 5. Get current streak from user_stats
    SELECT COALESCE(us.current_streak, 0) INTO current_streak
    FROM public.user_stats us
    WHERE us.user_id = user_uuid;

    -- XP for streak (100 XP per day in streak)
    streak_xp := current_streak * 100;

    -- Calculate total XP (NO automatic plan XP)
    total_xp := study_days_xp + completed_plans_xp + events_xp + tasks_xp + streak_xp;

    -- Insert or update user XP
    INSERT INTO public.user_xp (
        user_id,
        username,
        total_xp,
        updated_at
    )
    VALUES (
        user_uuid,
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

-- 3. Update any other functions that give automatic XP for having a plan
-- ===================================================================

-- Drop and recreate calculate_single_user_xp if it exists
DROP FUNCTION IF EXISTS calculate_single_user_xp(UUID);

CREATE OR REPLACE FUNCTION calculate_single_user_xp(target_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    user_plan JSONB;
    completed_days_count INTEGER := 0;
    completed_tasks_count INTEGER := 0;
    user_streak INTEGER := 0;
    events_xp INTEGER := 0;
    completed_plans_xp INTEGER := 0;
    username_text TEXT;
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
    
    IF username_text IS NULL OR username_text = '' THEN
        username_text := 'مستخدم';
    END IF;

    -- Calculate XP from current study plan (only completed days)
    IF user_plan IS NOT NULL AND user_plan ? 'study_days' THEN
        -- Count only days that are actually marked as completed
        SELECT COUNT(*)::INTEGER INTO completed_days_count
        FROM jsonb_array_elements(user_plan->'study_days') AS day
        WHERE (day->>'completed')::boolean = true;

        -- Add final review day if it's completed
        IF user_plan ? 'final_review_day' AND (user_plan->'final_review_day'->>'completed')::boolean = true THEN
            completed_days_count := completed_days_count + 1;
        END IF;

        study_days_xp_amount := completed_days_count * 100; -- 100 XP per completed day
    END IF;

    -- Calculate XP from completed plans
    SELECT COALESCE(
        (
            SELECT SUM((plan->>'xp_earned')::INTEGER)
            FROM jsonb_array_elements(COALESCE(completed_plans, '[]'::jsonb)) AS plan
        ), 0
    ) INTO completed_plans_xp
    FROM public.profiles
    WHERE id = target_user_id;

    -- Calculate XP from events
    SELECT COALESCE(SUM(xp_earned), 0) INTO events_xp
    FROM public.event_participations
    WHERE user_id = target_user_id;
    
    -- Calculate XP from completed tasks
    SELECT COUNT(*) INTO completed_tasks_count
    FROM public.daily_tasks
    WHERE user_id = target_user_id AND completed = true;
    
    tasks_xp_amount := completed_tasks_count * 25; -- 25 XP per task
    
    -- Get current streak from user_stats
    SELECT COALESCE(us.current_streak, 0) INTO user_streak
    FROM public.user_stats us
    WHERE us.user_id = target_user_id;
    
    streak_xp_amount := user_streak * 100; -- 100 XP per streak day
    
    -- Calculate total XP (NO automatic plan XP)
    total_xp_amount := study_days_xp_amount + completed_plans_xp + events_xp + tasks_xp_amount + streak_xp_amount;
    
    -- Insert or update user XP
    INSERT INTO public.user_xp (
        user_id,
        username,
        total_xp,
        updated_at
    )
    VALUES (
        target_user_id,
        username_text,
        total_xp_amount,
        NOW()
    )
    ON CONFLICT (user_id)
    DO UPDATE SET
        username = username_text,
        total_xp = total_xp_amount,
        updated_at = NOW();
    
    RETURN total_xp_amount;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Recalculate XP for all users to fix existing incorrect XP
-- ===================================================================
DO $$
DECLARE
    user_record RECORD;
    new_xp INTEGER;
BEGIN
    FOR user_record IN 
        SELECT DISTINCT user_id 
        FROM public.user_xp
    LOOP
        -- Recalculate XP for each user
        new_xp := calculate_user_xp(user_record.user_id);
        
        RAISE NOTICE 'Recalculated XP for user: % - New XP: %', user_record.user_id, new_xp;
    END LOOP;
END $$;

-- 5. Success message
-- ===================================================================
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '🔧 XP Calculation Bug Fixed!';
    RAISE NOTICE '';
    RAISE NOTICE 'Changes made:';
    RAISE NOTICE '- Removed automatic 500 XP for having a study plan';
    RAISE NOTICE '- XP now only comes from actually completed days (100 XP each)';
    RAISE NOTICE '- XP from completed plans preserved';
    RAISE NOTICE '- XP from events preserved';
    RAISE NOTICE '- XP from tasks and streaks preserved';
    RAISE NOTICE '';
    RAISE NOTICE 'All users XP recalculated correctly! ✅';
END $$;
