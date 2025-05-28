-- Fix XP Calculation for New Study Plan Structure
-- This migration updates XP calculation to work with completed_days array instead of individual completed properties

-- 1. Create updated XP calculation function for new structure
-- ===================================================================
CREATE OR REPLACE FUNCTION calculate_user_xp_basic(target_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    events_xp INTEGER := 0;
    completed_plans_xp INTEGER := 0;
    current_plan_xp INTEGER := 0;
    total_xp INTEGER := 0;
    current_plan JSONB;
    completed_days_array JSONB;
    completed_days_count INTEGER := 0;
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

    -- Sum XP from all completed plans
    SELECT COALESCE(SUM((plan->>'xp_earned')::INTEGER), 0) INTO completed_plans_xp
    FROM jsonb_array_elements(completed_plans_array) AS plan;

    -- 3. Get XP from current plan using completed_days array
    SELECT study_plan INTO current_plan
    FROM public.profiles
    WHERE id = target_user_id;

    IF current_plan IS NOT NULL THEN
        -- Get completed_days array from the plan
        completed_days_array := current_plan->'completed_days';
        
        IF completed_days_array IS NOT NULL THEN
            -- Count the number of completed days
            completed_days_count := jsonb_array_length(completed_days_array);
            current_plan_xp := completed_days_count * 100; -- 100 XP per completed day
        END IF;
    END IF;

    -- Calculate total XP
    total_xp := events_xp + completed_plans_xp + current_plan_xp;

    RETURN total_xp;
END;
$$ LANGUAGE plpgsql;

-- 2. Create function to update user XP in user_xp table
-- ===================================================================
CREATE OR REPLACE FUNCTION update_user_xp_record(target_user_id UUID)
RETURNS VOID AS $$
DECLARE
    calculated_xp INTEGER;
    username_text TEXT;
BEGIN
    -- Calculate XP using the basic function
    calculated_xp := calculate_user_xp_basic(target_user_id);
    
    -- Get username
    SELECT COALESCE(username, 'مستخدم') INTO username_text
    FROM public.profiles
    WHERE id = target_user_id;

    -- Insert or update user XP record
    INSERT INTO public.user_xp (
        user_id,
        username,
        total_xp,
        last_calculated,
        updated_at
    )
    VALUES (
        target_user_id,
        username_text,
        calculated_xp,
        NOW(),
        NOW()
    )
    ON CONFLICT (user_id)
    DO UPDATE SET
        username = EXCLUDED.username,
        total_xp = EXCLUDED.total_xp,
        last_calculated = EXCLUDED.last_calculated,
        updated_at = EXCLUDED.updated_at;
END;
$$ LANGUAGE plpgsql;

-- 3. Create trigger function to auto-update XP when study plan changes
-- ===================================================================
CREATE OR REPLACE FUNCTION trigger_update_user_xp()
RETURNS TRIGGER AS $$
BEGIN
    -- Only update XP if study_plan column was modified
    IF OLD.study_plan IS DISTINCT FROM NEW.study_plan THEN
        PERFORM update_user_xp_record(NEW.id);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Create trigger on profiles table
-- ===================================================================
DROP TRIGGER IF EXISTS auto_update_xp_on_plan_change ON public.profiles;

CREATE TRIGGER auto_update_xp_on_plan_change
    AFTER UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_user_xp();

-- 5. Migration complete message
-- ===================================================================
DO $$
BEGIN
    RAISE NOTICE 'XP Calculation Fix migration completed successfully!';
    RAISE NOTICE 'Updated features:';
    RAISE NOTICE '- calculate_user_xp_basic() now works with completed_days array';
    RAISE NOTICE '- Auto-trigger updates XP when study plan changes';
    RAISE NOTICE '- XP calculation now correctly counts completed days from array';
    RAISE NOTICE '';
    RAISE NOTICE 'XP Sources:';
    RAISE NOTICE '- Events: Variable XP from event_participations table';
    RAISE NOTICE '- Completed Plans: XP preserved from completed plans';
    RAISE NOTICE '- Current Plan: 100 XP per day in completed_days array';
END $$;
