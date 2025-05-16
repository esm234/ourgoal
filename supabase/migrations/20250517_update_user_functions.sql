
-- Create function to update user role
CREATE OR REPLACE FUNCTION public.update_user_role(user_id uuid, new_role text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER AS $$
DECLARE
  calling_user_id UUID;
  calling_user_role TEXT;
BEGIN
  -- Get the ID of the calling user
  calling_user_id := auth.uid();
  
  -- Get the role of the calling user
  SELECT role INTO calling_user_role FROM public.profiles WHERE id = calling_user_id;
  
  -- Check if the calling user is an admin
  IF calling_user_role <> 'admin' THEN
    RAISE EXCEPTION 'Only administrators can update user roles';
  END IF;
  
  -- Update the user's role
  UPDATE public.profiles
  SET role = new_role
  WHERE id = user_id;
  
  -- If no rows were affected, the user doesn't exist
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;
END;
$$;

-- Create function to delete user
CREATE OR REPLACE FUNCTION public.delete_user(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER AS $$
DECLARE
  calling_user_id UUID;
  calling_user_role TEXT;
BEGIN
  -- Get the ID of the calling user
  calling_user_id := auth.uid();
  
  -- Get the role of the calling user
  SELECT role INTO calling_user_role FROM public.profiles WHERE id = calling_user_id;
  
  -- Check if the calling user is an admin
  IF calling_user_role <> 'admin' THEN
    RAISE EXCEPTION 'Only administrators can delete users';
  END IF;
  
  -- Delete the user's profile
  DELETE FROM public.profiles
  WHERE id = target_user_id;
  
  -- If no rows were affected, the user doesn't exist
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;
END;
$$;

-- Create function to update leaderboard
CREATE OR REPLACE FUNCTION public.update_user_stats()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update the user's profile with the new test results
  UPDATE profiles
  SET 
    total_score = total_score + NEW.score,
    tests_taken = tests_taken + 1,
    highest_score = GREATEST(highest_score, NEW.score),
    average_score = ((total_score + NEW.score) / (tests_taken + 1))::DECIMAL(5,2),
    last_test_date = NEW.created_at
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$;

-- Create trigger for exam_results if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'update_user_stats_on_exam_result'
  ) THEN
    CREATE TRIGGER update_user_stats_on_exam_result
      AFTER INSERT ON public.exam_results
      FOR EACH ROW
      EXECUTE FUNCTION public.update_user_stats();
  END IF;
EXCEPTION
  WHEN undefined_table THEN
    -- Table doesn't exist yet, so skip creating the trigger
    RAISE NOTICE 'exam_results table does not exist yet';
END;
$$;
