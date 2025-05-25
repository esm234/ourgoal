-- Simple XP calculation function that works with existing table structure
-- This function only uses columns that definitely exist in user_xp table

-- 1. Create simple XP calculation function
-- ===================================================================
CREATE OR REPLACE FUNCTION calculate_user_xp_simple(target_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    user_plan JSONB;
    completed_days_count INTEGER := 0;
    completed_tasks_count INTEGER := 0;
    user_streak INTEGER := 0;
    username_text TEXT;
    total_xp_amount INTEGER := 0;
BEGIN
    -- Get user profile data
    SELECT study_plan, username
    INTO user_plan, username_text
    FROM public.profiles
    WHERE id = target_user_id;

    -- Set default username if null
    IF username_text IS NULL OR username_text = '' THEN
        username_text := 'مستخدم';
    END IF;

    -- Calculate XP from study plan
    IF user_plan IS NOT NULL THEN
        total_xp_amount := total_xp_amount + 500; -- 500 XP for having a plan

        -- Get completed days count
        SELECT COALESCE(
            array_length(
                ARRAY(SELECT jsonb_array_elements_text(user_plan->'completed_days')::INTEGER),
                1
            ), 0
        ) INTO completed_days_count;

        total_xp_amount := total_xp_amount + (completed_days_count * 50); -- 50 XP per completed day
    END IF;

    -- Calculate XP from completed tasks
    SELECT COUNT(*)
    INTO completed_tasks_count
    FROM public.daily_tasks
    WHERE user_id = target_user_id AND completed = true;

    total_xp_amount := total_xp_amount + (completed_tasks_count * 25); -- 25 XP per task

    -- Get current streak from user_stats
    SELECT COALESCE(us.current_streak, 0)
    INTO user_streak
    FROM public.user_stats us
    WHERE us.user_id = target_user_id;

    total_xp_amount := total_xp_amount + (user_streak * 100); -- 100 XP per streak day

    -- Insert or update user XP (including username to satisfy NOT NULL constraint)
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
        username = EXCLUDED.username,
        total_xp = EXCLUDED.total_xp,
        updated_at = EXCLUDED.updated_at;

    -- Try to update additional columns if they exist
    BEGIN
        UPDATE public.user_xp
        SET
            username = username_text,
            completed_days = completed_days_count
        WHERE user_id = target_user_id;
    EXCEPTION
        WHEN undefined_column THEN
            -- Ignore if columns don't exist
            NULL;
    END;

    RETURN total_xp_amount;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create function to refresh all users XP
-- ===================================================================
CREATE OR REPLACE FUNCTION refresh_all_users_xp_simple()
RETURNS INTEGER AS $$
DECLARE
    user_record RECORD;
    updated_count INTEGER := 0;
BEGIN
    FOR user_record IN
        SELECT id FROM public.profiles
    LOOP
        PERFORM calculate_user_xp_simple(user_record.id);
        updated_count := updated_count + 1;
    END LOOP;

    RAISE NOTICE 'Updated XP for % users', updated_count;
    RETURN updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Grant permissions
-- ===================================================================
GRANT EXECUTE ON FUNCTION calculate_user_xp_simple(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION refresh_all_users_xp_simple() TO authenticated;

-- 4. Initialize XP data for all existing users
-- ===================================================================
SELECT refresh_all_users_xp_simple();

COMMIT;
