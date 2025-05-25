-- Fix user stats functions for single plan system
-- This script updates the database functions to work with the new profile-based study plan system

-- 1. Drop old functions if they exist
-- ===================================================================
DROP FUNCTION IF EXISTS update_user_stats(UUID);
DROP FUNCTION IF EXISTS calculate_user_xp(UUID);
DROP FUNCTION IF EXISTS refresh_all_user_xp();

-- 2. Create updated update_user_stats function
-- ===================================================================
CREATE OR REPLACE FUNCTION update_user_stats(user_uuid UUID)
RETURNS VOID AS $$
DECLARE
    plan_count INTEGER := 0;
    study_days_count INTEGER := 0;
    completed_tasks_count INTEGER := 0;
    current_streak_count INTEGER := 0;
    user_plan JSONB;
    completed_days_array INTEGER[];
BEGIN
    -- Get user's study plan from profile
    SELECT study_plan INTO user_plan
    FROM public.profiles
    WHERE id = user_uuid;

    -- Calculate total plans created (1 if plan exists, 0 if not)
    IF user_plan IS NOT NULL THEN
        plan_count := 1;

        -- Get completed days from the study plan
        completed_days_array := COALESCE(
            ARRAY(SELECT jsonb_array_elements_text(user_plan->'completed_days')::INTEGER),
            ARRAY[]::INTEGER[]
        );

        study_days_count := array_length(completed_days_array, 1);
        IF study_days_count IS NULL THEN
            study_days_count := 0;
        END IF;
    ELSE
        plan_count := 0;
        study_days_count := 0;
    END IF;

    -- Count completed tasks
    SELECT COUNT(*)
    INTO completed_tasks_count
    FROM public.daily_tasks
    WHERE user_id = user_uuid AND completed = true;

    -- Calculate current streak (simplified version)
    -- Count consecutive days with completed tasks
    WITH daily_completion AS (
        SELECT DISTINCT task_date
        FROM public.daily_tasks
        WHERE user_id = user_uuid AND completed = true
        ORDER BY task_date DESC
    ),
    streak_calc AS (
        SELECT task_date,
               ROW_NUMBER() OVER (ORDER BY task_date DESC) as rn,
               task_date::date - (ROW_NUMBER() OVER (ORDER BY task_date DESC) - 1) * INTERVAL '1 day' as streak_group
        FROM daily_completion
    )
    SELECT COUNT(*)
    INTO current_streak_count
    FROM streak_calc
    WHERE streak_group = (
        SELECT streak_group
        FROM streak_calc
        WHERE rn = 1
    );

    -- Insert or update user stats
    INSERT INTO public.user_stats (
        user_id,
        total_plans_created,
        total_study_days,
        completed_tasks,
        current_streak,
        updated_at
    )
    VALUES (
        user_uuid,
        plan_count,
        study_days_count,
        completed_tasks_count,
        current_streak_count,
        NOW()
    )
    ON CONFLICT (user_id)
    DO UPDATE SET
        total_plans_created = EXCLUDED.total_plans_created,
        total_study_days = EXCLUDED.total_study_days,
        completed_tasks = EXCLUDED.completed_tasks,
        current_streak = EXCLUDED.current_streak,
        updated_at = EXCLUDED.updated_at;

    RAISE NOTICE 'Updated stats for user %: plans=%, study_days=%, tasks=%, streak=%',
                 user_uuid, plan_count, study_days_count, completed_tasks_count, current_streak_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create updated calculate_user_xp function
-- ===================================================================
CREATE OR REPLACE FUNCTION calculate_user_xp(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    total_xp INTEGER := 0;
    study_days_xp INTEGER := 0;
    tasks_xp INTEGER := 0;
    streak_xp INTEGER := 0;
    plan_xp INTEGER := 0;
    user_plan JSONB;
    completed_days_count INTEGER := 0;
    completed_tasks_count INTEGER := 0;
    current_streak INTEGER := 0;
    has_plan BOOLEAN := false;
BEGIN
    -- Get user's study plan from profile
    SELECT study_plan INTO user_plan
    FROM public.profiles
    WHERE id = user_uuid;

    -- Calculate XP from study plan completion
    IF user_plan IS NOT NULL THEN
        has_plan := true;
        plan_xp := 500; -- XP for having a study plan

        -- Get completed days count
        SELECT array_length(
            COALESCE(
                ARRAY(SELECT jsonb_array_elements_text(user_plan->'completed_days')::INTEGER),
                ARRAY[]::INTEGER[]
            ), 1
        ) INTO completed_days_count;

        IF completed_days_count IS NULL THEN
            completed_days_count := 0;
        END IF;

        -- XP for completed study days (50 XP per day)
        study_days_xp := completed_days_count * 50;
    END IF;

    -- Calculate XP from completed tasks (25 XP per task)
    SELECT COUNT(*) * 25
    INTO tasks_xp
    FROM public.daily_tasks
    WHERE user_id = user_uuid AND completed = true;

    -- Get current streak from user_stats
    SELECT COALESCE(us.current_streak, 0)
    INTO current_streak
    FROM public.user_stats us
    WHERE us.user_id = user_uuid;

    -- XP for streak (100 XP per day in streak)
    streak_xp := current_streak * 100;

    -- Calculate total XP
    total_xp := plan_xp + study_days_xp + tasks_xp + streak_xp;

    -- Insert or update user XP
    INSERT INTO public.user_xp (
        user_id,
        total_xp,
        study_days_xp,
        tasks_xp,
        streak_xp,
        plan_xp,
        updated_at
    )
    VALUES (
        user_uuid,
        total_xp,
        study_days_xp,
        tasks_xp,
        streak_xp,
        plan_xp,
        NOW()
    )
    ON CONFLICT (user_id)
    DO UPDATE SET
        total_xp = EXCLUDED.total_xp,
        study_days_xp = EXCLUDED.study_days_xp,
        tasks_xp = EXCLUDED.tasks_xp,
        streak_xp = EXCLUDED.streak_xp,
        plan_xp = EXCLUDED.plan_xp,
        updated_at = EXCLUDED.updated_at;

    RAISE NOTICE 'Calculated XP for user %: total=%, study_days=%, tasks=%, streak=%, plan=%',
                 user_uuid, total_xp, study_days_xp, tasks_xp, streak_xp, plan_xp;

    RETURN total_xp;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create refresh_all_user_xp function
-- ===================================================================
CREATE OR REPLACE FUNCTION refresh_all_user_xp()
RETURNS INTEGER AS $$
DECLARE
    user_record RECORD;
    updated_count INTEGER := 0;
BEGIN
    -- Update stats and XP for all users who have profiles
    FOR user_record IN
        SELECT id FROM public.profiles
    LOOP
        -- Update user stats first
        PERFORM update_user_stats(user_record.id);

        -- Then calculate XP
        PERFORM calculate_user_xp(user_record.id);

        updated_count := updated_count + 1;
    END LOOP;

    RAISE NOTICE 'Refreshed XP for % users', updated_count;
    RETURN updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Grant permissions
-- ===================================================================
GRANT EXECUTE ON FUNCTION update_user_stats(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_user_xp(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION refresh_all_user_xp() TO authenticated;

-- 6. Test the functions (optional)
-- ===================================================================
-- Uncomment the following lines to test the functions
-- SELECT update_user_stats('your-user-id-here');
-- SELECT calculate_user_xp('your-user-id-here');

COMMIT;
