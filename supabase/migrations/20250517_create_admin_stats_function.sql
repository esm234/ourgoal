
-- Create the admin dashboard stats function if it doesn't exist
CREATE OR REPLACE FUNCTION public.get_admin_dashboard_stats(thirty_days_ago timestamp with time zone)
RETURNS TABLE(total_users bigint, recent_users bigint, total_tests bigint, recent_tests bigint, total_tests_taken bigint)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH user_counts AS (
    SELECT 
      COUNT(*) AS total_users,
      COUNT(*) FILTER (WHERE created_at >= thirty_days_ago) AS recent_users
    FROM profiles
  ),
  test_counts AS (
    SELECT 
      COUNT(*) AS total_tests,
      COUNT(*) FILTER (WHERE created_at >= thirty_days_ago) AS recent_tests
    FROM tests
  ),
  result_counts AS (
    SELECT 
      COUNT(*) AS total_tests_taken
    FROM exam_results
  )
  SELECT 
    user_counts.total_users,
    user_counts.recent_users,
    test_counts.total_tests,
    test_counts.recent_tests,
    result_counts.total_tests_taken
  FROM 
    user_counts, test_counts, result_counts;
END;
$$;

-- Create function to get test leaderboard
CREATE OR REPLACE FUNCTION public.get_test_leaderboard(test_id_param text, limit_param integer DEFAULT 5)
RETURNS TABLE(username text, user_id uuid, max_score double precision)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH highest_scores AS (
    SELECT 
      exam_results.user_id,
      MAX(score) as max_score,
      ROW_NUMBER() OVER (ORDER BY MAX(score) DESC) as rank
    FROM 
      exam_results
    WHERE 
      test_id = test_id_param
    GROUP BY 
      exam_results.user_id
    ORDER BY 
      max_score DESC
    LIMIT 
      limit_param
  )
  SELECT 
    profiles.username,
    highest_scores.user_id,
    highest_scores.max_score
  FROM 
    highest_scores
  LEFT JOIN 
    profiles ON highest_scores.user_id = profiles.id
  ORDER BY 
    highest_scores.max_score DESC;
END;
$$;

-- Create function to get top scores for a test
CREATE OR REPLACE FUNCTION public.get_top_scores_for_test(test_id_param text, limit_param integer)
RETURNS TABLE(username text, score integer, user_id uuid)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH max_scores AS (
    SELECT 
      er.user_id,
      MAX(er.score) as max_score
    FROM exam_results er
    WHERE er.test_id = test_id_param
    GROUP BY er.user_id
  )
  SELECT 
    p.username,
    ms.max_score as score,
    ms.user_id
  FROM max_scores ms
  LEFT JOIN profiles p ON ms.user_id = p.id
  ORDER BY ms.max_score DESC
  LIMIT limit_param;
END;
$$;
