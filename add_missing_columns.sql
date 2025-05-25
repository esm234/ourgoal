-- Add missing columns to user_xp table
-- This script adds the required columns for XP breakdown

-- 1. Add missing columns to user_xp table
-- ===================================================================
DO $$
BEGIN
    -- Add username column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_xp' AND column_name = 'username') THEN
        ALTER TABLE public.user_xp ADD COLUMN username TEXT NOT NULL DEFAULT 'مستخدم';
        RAISE NOTICE 'Added username column';
    END IF;
    
    -- Add completed_days column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_xp' AND column_name = 'completed_days') THEN
        ALTER TABLE public.user_xp ADD COLUMN completed_days INTEGER DEFAULT 0;
        RAISE NOTICE 'Added completed_days column';
    END IF;
    
    -- Add study_days_xp column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_xp' AND column_name = 'study_days_xp') THEN
        ALTER TABLE public.user_xp ADD COLUMN study_days_xp INTEGER DEFAULT 0;
        RAISE NOTICE 'Added study_days_xp column';
    END IF;
    
    -- Add tasks_xp column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_xp' AND column_name = 'tasks_xp') THEN
        ALTER TABLE public.user_xp ADD COLUMN tasks_xp INTEGER DEFAULT 0;
        RAISE NOTICE 'Added tasks_xp column';
    END IF;
    
    -- Add streak_xp column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_xp' AND column_name = 'streak_xp') THEN
        ALTER TABLE public.user_xp ADD COLUMN streak_xp INTEGER DEFAULT 0;
        RAISE NOTICE 'Added streak_xp column';
    END IF;
    
    -- Add plan_xp column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_xp' AND column_name = 'plan_xp') THEN
        ALTER TABLE public.user_xp ADD COLUMN plan_xp INTEGER DEFAULT 0;
        RAISE NOTICE 'Added plan_xp column';
    END IF;
    
    -- Add last_calculated column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_xp' AND column_name = 'last_calculated') THEN
        ALTER TABLE public.user_xp ADD COLUMN last_calculated TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Added last_calculated column';
    END IF;
    
    RAISE NOTICE 'All required columns have been added to user_xp table';
END $$;

-- 2. Update existing records to have default values
-- ===================================================================
UPDATE public.user_xp 
SET 
    username = COALESCE(username, 'مستخدم'),
    completed_days = COALESCE(completed_days, 0),
    study_days_xp = COALESCE(study_days_xp, 0),
    tasks_xp = COALESCE(tasks_xp, 0),
    streak_xp = COALESCE(streak_xp, 0),
    plan_xp = COALESCE(plan_xp, 0),
    last_calculated = COALESCE(last_calculated, NOW())
WHERE 
    username IS NULL 
    OR completed_days IS NULL 
    OR study_days_xp IS NULL 
    OR tasks_xp IS NULL 
    OR streak_xp IS NULL 
    OR plan_xp IS NULL 
    OR last_calculated IS NULL;

-- 3. Create indexes for better performance
-- ===================================================================
CREATE INDEX IF NOT EXISTS idx_user_xp_total_xp ON public.user_xp(total_xp DESC);
CREATE INDEX IF NOT EXISTS idx_user_xp_user_id ON public.user_xp(user_id);
CREATE INDEX IF NOT EXISTS idx_user_xp_updated_at ON public.user_xp(updated_at DESC);

-- 4. Verify table structure
-- ===================================================================
DO $$
DECLARE
    column_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO column_count
    FROM information_schema.columns 
    WHERE table_name = 'user_xp' 
    AND column_name IN ('username', 'completed_days', 'study_days_xp', 'tasks_xp', 'streak_xp', 'plan_xp', 'last_calculated');
    
    RAISE NOTICE 'user_xp table now has % required columns', column_count;
    
    IF column_count = 7 THEN
        RAISE NOTICE 'All required columns are present in user_xp table';
    ELSE
        RAISE WARNING 'Some columns are still missing from user_xp table';
    END IF;
END $$;

COMMIT;
