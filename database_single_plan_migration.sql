-- Migration: Single Study Plan per User
-- This migration adds study_plan column to profiles table and migrates existing data

-- 1. Add study_plan column to profiles table
-- ===================================================================
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS study_plan JSONB;

-- 2. Create index for better performance
-- ===================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_study_plan 
ON public.profiles USING gin(study_plan);

-- 3. Migrate existing study plans to profiles (if study_plans table exists)
-- ===================================================================
-- This will move the most recent study plan for each user to their profile

DO $$
BEGIN
    -- Check if study_plans table exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'study_plans') THEN
        -- Migrate the most recent study plan for each user
        UPDATE public.profiles 
        SET study_plan = (
            SELECT jsonb_build_object(
                'name', sp.name,
                'total_days', sp.total_days,
                'review_rounds', sp.review_rounds,
                'test_date', sp.test_date,
                'study_days', sp.study_days,
                'final_review_day', sp.final_review_day,
                'created_at', sp.created_at
            )
            FROM public.study_plans sp
            WHERE sp.user_id = profiles.id
            ORDER BY sp.created_at DESC
            LIMIT 1
        )
        WHERE EXISTS (
            SELECT 1 FROM public.study_plans sp 
            WHERE sp.user_id = profiles.id
        );
        
        RAISE NOTICE 'Migrated study plans to profiles table';
    ELSE
        RAISE NOTICE 'study_plans table does not exist, skipping migration';
    END IF;
END $$;

-- 4. Update RLS policies for profiles table
-- ===================================================================

-- Allow users to read their own profile including study_plan
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own profile including study_plan
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- 5. Create helper function to validate study plan structure
-- ===================================================================
CREATE OR REPLACE FUNCTION validate_study_plan(plan JSONB)
RETURNS BOOLEAN AS $$
BEGIN
    -- Check if plan has required fields
    IF plan IS NULL THEN
        RETURN TRUE; -- Allow NULL plans
    END IF;
    
    -- Validate required fields exist
    IF NOT (plan ? 'name' AND plan ? 'total_days' AND plan ? 'review_rounds' 
            AND plan ? 'test_date' AND plan ? 'study_days' AND plan ? 'final_review_day') THEN
        RETURN FALSE;
    END IF;
    
    -- Validate data types
    IF NOT (jsonb_typeof(plan->'name') = 'string' 
            AND jsonb_typeof(plan->'total_days') = 'number'
            AND jsonb_typeof(plan->'review_rounds') = 'number'
            AND jsonb_typeof(plan->'test_date') = 'string'
            AND jsonb_typeof(plan->'study_days') = 'array'
            AND jsonb_typeof(plan->'final_review_day') = 'object') THEN
        RETURN FALSE;
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- 6. Add constraint to ensure valid study plan structure
-- ===================================================================
ALTER TABLE public.profiles 
ADD CONSTRAINT valid_study_plan_structure 
CHECK (validate_study_plan(study_plan));

-- 7. Create function to get user's study plan
-- ===================================================================
CREATE OR REPLACE FUNCTION get_user_study_plan(user_uuid UUID)
RETURNS JSONB AS $$
BEGIN
    RETURN (
        SELECT study_plan 
        FROM public.profiles 
        WHERE id = user_uuid
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Create function to update user's study plan
-- ===================================================================
CREATE OR REPLACE FUNCTION update_user_study_plan(user_uuid UUID, new_plan JSONB)
RETURNS BOOLEAN AS $$
BEGIN
    -- Validate the plan structure
    IF NOT validate_study_plan(new_plan) THEN
        RAISE EXCEPTION 'Invalid study plan structure';
    END IF;
    
    -- Update the user's study plan
    UPDATE public.profiles 
    SET study_plan = new_plan,
        updated_at = NOW()
    WHERE id = user_uuid;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Grant necessary permissions
-- ===================================================================
GRANT EXECUTE ON FUNCTION get_user_study_plan(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION update_user_study_plan(UUID, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION validate_study_plan(JSONB) TO authenticated;

-- 10. Optional: Drop study_plans table after migration (uncomment if needed)
-- ===================================================================
-- WARNING: This will permanently delete the study_plans table and all its data
-- Only run this after confirming the migration was successful

-- DROP TABLE IF EXISTS public.study_plans CASCADE;

COMMIT;
