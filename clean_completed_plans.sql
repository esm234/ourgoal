-- Clean All Completed Plans
-- This script removes all completed plans and resets XP calculations

-- 1. Clear all completed plans from profiles
-- ===================================================================
UPDATE public.profiles 
SET completed_plans = '[]'::jsonb,
    updated_at = NOW()
WHERE completed_plans IS NOT NULL 
AND completed_plans != '[]'::jsonb;

-- 2. Recalculate XP for all users (without completed plans)
-- ===================================================================
DO $$
DECLARE
    user_record RECORD;
    new_total_xp INTEGER;
BEGIN
    -- Loop through all users who have XP records
    FOR user_record IN 
        SELECT DISTINCT user_id 
        FROM public.user_xp
    LOOP
        -- Recalculate XP for each user
        new_total_xp := recalculate_user_total_xp(user_record.user_id);
        
        -- Update user_xp table
        UPDATE public.user_xp
        SET total_xp = new_total_xp,
            updated_at = NOW()
        WHERE user_id = user_record.user_id;
        
        RAISE NOTICE 'Updated XP for user: % - New XP: %', user_record.user_id, new_total_xp;
    END LOOP;
END $$;

-- 3. Clean up any orphaned XP records (users with 0 XP)
-- ===================================================================
DELETE FROM public.user_xp 
WHERE total_xp = 0 OR total_xp IS NULL;

-- 4. Verification queries
-- ===================================================================
DO $$
DECLARE
    total_users_with_completed_plans INTEGER;
    total_users_with_xp INTEGER;
    total_xp_sum INTEGER;
BEGIN
    -- Count users with completed plans (should be 0)
    SELECT COUNT(*) INTO total_users_with_completed_plans
    FROM public.profiles
    WHERE completed_plans IS NOT NULL 
    AND completed_plans != '[]'::jsonb;
    
    -- Count users with XP
    SELECT COUNT(*) INTO total_users_with_xp
    FROM public.user_xp
    WHERE total_xp > 0;
    
    -- Sum of all XP
    SELECT COALESCE(SUM(total_xp), 0) INTO total_xp_sum
    FROM public.user_xp;
    
    RAISE NOTICE '';
    RAISE NOTICE '=== Cleanup Results ===';
    RAISE NOTICE 'Users with completed plans: %', total_users_with_completed_plans;
    RAISE NOTICE 'Users with XP > 0: %', total_users_with_xp;
    RAISE NOTICE 'Total XP in system: %', total_xp_sum;
    RAISE NOTICE '';
    
    IF total_users_with_completed_plans = 0 THEN
        RAISE NOTICE '✅ All completed plans cleared successfully!';
    ELSE
        RAISE NOTICE '⚠️  Some completed plans still exist!';
    END IF;
END $$;

-- 5. Optional: Reset all current study plans to have completed = false
-- ===================================================================
-- Uncomment the following section if you want to reset all current plans too

/*
DO $$
DECLARE
    user_record RECORD;
    current_plan JSONB;
    updated_plan JSONB;
BEGIN
    -- Loop through all users with current study plans
    FOR user_record IN 
        SELECT id, study_plan 
        FROM public.profiles 
        WHERE study_plan IS NOT NULL
    LOOP
        current_plan := user_record.study_plan;
        
        -- Reset all study days to completed = false
        IF current_plan ? 'study_days' AND jsonb_typeof(current_plan->'study_days') = 'array' THEN
            SELECT jsonb_set(
                current_plan,
                '{study_days}',
                (
                    SELECT jsonb_agg(
                        jsonb_set(day, '{completed}', 'false'::jsonb)
                    )
                    FROM jsonb_array_elements(current_plan->'study_days') AS day
                )
            ) INTO updated_plan;
            
            -- Reset final review day to completed = false
            IF updated_plan ? 'final_review_day' THEN
                SELECT jsonb_set(
                    updated_plan,
                    '{final_review_day,completed}',
                    'false'::jsonb
                ) INTO updated_plan;
            END IF;
            
            -- Update the profile
            UPDATE public.profiles
            SET study_plan = updated_plan,
                updated_at = NOW()
            WHERE id = user_record.id;
            
            RAISE NOTICE 'Reset current plan for user: %', user_record.id;
        END IF;
    END LOOP;
    
    RAISE NOTICE '✅ All current study plans reset to incomplete!';
END $$;
*/

-- 6. Final success message
-- ===================================================================
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '🧹 Completed Plans Cleanup Complete!';
    RAISE NOTICE '';
    RAISE NOTICE 'What was cleaned:';
    RAISE NOTICE '- All completed_plans arrays cleared';
    RAISE NOTICE '- XP recalculated for all users';
    RAISE NOTICE '- Orphaned XP records removed';
    RAISE NOTICE '';
    RAISE NOTICE 'XP now comes only from:';
    RAISE NOTICE '- Event participations';
    RAISE NOTICE '- Actually completed days in current plans';
    RAISE NOTICE '';
    RAISE NOTICE 'Ready for fresh start! 🚀';
END $$;
