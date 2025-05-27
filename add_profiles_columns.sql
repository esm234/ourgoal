-- Add Missing Columns to Profiles Table
-- This script safely adds only the missing columns to profiles table

-- 1. Add xp column if it doesn't exist
-- ===================================================================
DO $$
BEGIN
    -- Check if xp column exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'xp'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.profiles 
        ADD COLUMN xp INTEGER DEFAULT 0;
        
        RAISE NOTICE 'Added xp column to profiles table';
        
        -- Create index for xp column
        CREATE INDEX IF NOT EXISTS idx_profiles_xp 
        ON public.profiles(xp DESC);
        
        RAISE NOTICE 'Created index on xp column';
    ELSE
        RAISE NOTICE 'xp column already exists, skipping...';
    END IF;
END $$;

-- 2. Verify completed_plans column exists (should be there from previous migration)
-- ===================================================================
DO $$
BEGIN
    -- Check if completed_plans column exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'completed_plans'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.profiles 
        ADD COLUMN completed_plans JSONB DEFAULT '[]'::jsonb;
        
        RAISE NOTICE 'Added completed_plans column to profiles table';
        
        -- Create index for completed_plans column
        CREATE INDEX IF NOT EXISTS idx_profiles_completed_plans 
        ON public.profiles USING gin(completed_plans);
        
        RAISE NOTICE 'Created index on completed_plans column';
    ELSE
        RAISE NOTICE 'completed_plans column already exists, skipping...';
    END IF;
END $$;

-- 3. Migration complete message
-- ===================================================================
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=== Profiles Table Columns Migration Complete ===';
    RAISE NOTICE 'All required columns are now available:';
    RAISE NOTICE '- completed_plans: for storing completed study plans';
    RAISE NOTICE '- xp: for storing user experience points';
    RAISE NOTICE '';
    RAISE NOTICE 'You can now use the completed plans system!';
END $$;
