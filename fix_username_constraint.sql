-- Fix username constraint in user_xp table
-- This script removes the NOT NULL constraint from username column

-- 1. Remove NOT NULL constraint from username column
-- ===================================================================
DO $$
BEGIN
    -- Check if username column exists and has NOT NULL constraint
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'user_xp' 
        AND column_name = 'username' 
        AND is_nullable = 'NO'
    ) THEN
        -- Remove NOT NULL constraint
        ALTER TABLE public.user_xp ALTER COLUMN username DROP NOT NULL;
        RAISE NOTICE 'Removed NOT NULL constraint from username column';
    ELSE
        RAISE NOTICE 'Username column either does not exist or already allows NULL';
    END IF;
END $$;

-- 2. Update any existing NULL usernames to default value
-- ===================================================================
UPDATE public.user_xp 
SET username = 'مستخدم' 
WHERE username IS NULL;

-- 3. Create a simple function that works with current table structure
-- ===================================================================
CREATE OR REPLACE FUNCTION calculate_user_xp_basic(target_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    user_plan JSONB;
    completed_days_count INTEGER := 0;
    completed_tasks_count INTEGER := 0;
    user_streak INTEGER := 0;
    username_text TEXT := 'مستخدم';
    total_xp_amount INTEGER := 0;
BEGIN
    -- Get user profile data
    SELECT study_plan, COALESCE(username, 'مستخدم')
    INTO user_plan, username_text
    FROM public.profiles
    WHERE id = target_user_id;
    
    -- Calculate XP from study plan
    IF user_plan IS NOT NULL THEN
        total_xp_amount := 500; -- 500 XP for having a plan
        
        -- Get completed days count
        BEGIN
            SELECT COALESCE(
                array_length(
                    ARRAY(SELECT jsonb_array_elements_text(user_plan->'completed_days')::INTEGER),
                    1
                ), 0
            ) INTO completed_days_count;
        EXCEPTION 
            WHEN OTHERS THEN
                completed_days_count := 0;
        END;
        
        total_xp_amount := total_xp_amount + (completed_days_count * 50);
    END IF;
    
    -- Calculate XP from completed tasks
    SELECT COALESCE(COUNT(*), 0)
    INTO completed_tasks_count
    FROM public.daily_tasks
    WHERE user_id = target_user_id AND completed = true;
    
    total_xp_amount := total_xp_amount + (completed_tasks_count * 25);
    
    -- Get current streak from user_stats
    SELECT COALESCE(us.current_streak, 0)
    INTO user_streak
    FROM public.user_stats us
    WHERE us.user_id = target_user_id;
    
    total_xp_amount := total_xp_amount + (user_streak * 100);
    
    -- Insert or update user XP with minimal columns
    INSERT INTO public.user_xp (user_id, total_xp, updated_at)
    VALUES (target_user_id, total_xp_amount, NOW())
    ON CONFLICT (user_id)
    DO UPDATE SET
        total_xp = EXCLUDED.total_xp,
        updated_at = EXCLUDED.updated_at;
    
    -- Try to update username if column exists
    BEGIN
        UPDATE public.user_xp 
        SET username = username_text
        WHERE user_id = target_user_id;
    EXCEPTION 
        WHEN OTHERS THEN
            -- Ignore if update fails
            NULL;
    END;
    
    RETURN total_xp_amount;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create function to refresh all users
-- ===================================================================
CREATE OR REPLACE FUNCTION refresh_all_users_xp_basic()
RETURNS INTEGER AS $$
DECLARE
    user_record RECORD;
    updated_count INTEGER := 0;
BEGIN
    FOR user_record IN 
        SELECT id FROM public.profiles LIMIT 50 -- Limit to avoid timeout
    LOOP
        BEGIN
            PERFORM calculate_user_xp_basic(user_record.id);
            updated_count := updated_count + 1;
        EXCEPTION 
            WHEN OTHERS THEN
                -- Continue with next user if one fails
                CONTINUE;
        END;
    END LOOP;
    
    RETURN updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Grant permissions
-- ===================================================================
GRANT EXECUTE ON FUNCTION calculate_user_xp_basic(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION refresh_all_users_xp_basic() TO authenticated;

-- 6. Test the function with a small batch
-- ===================================================================
SELECT refresh_all_users_xp_basic();

COMMIT;
