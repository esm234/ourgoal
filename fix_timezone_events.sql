-- Fix timezone issues for weekly events
-- This script ensures proper timezone handling for Saudi Arabia (UTC+3)

-- Update the event status function to work with proper timezone
CREATE OR REPLACE FUNCTION update_event_status()
RETURNS void AS $$
BEGIN
    -- Update events to 'active' if start time has passed and still upcoming
    UPDATE public.weekly_events
    SET status = 'active'
    WHERE status = 'upcoming'
    AND start_time <= NOW()
    AND is_enabled = true;

    -- Update events to 'finished' if duration has passed
    UPDATE public.weekly_events
    SET status = 'finished'
    WHERE status = 'active'
    AND (start_time + INTERVAL '1 minute' * duration_minutes) <= NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to manually change event status (for admin use)
CREATE OR REPLACE FUNCTION change_event_status(
    event_id_param BIGINT,
    new_status_param TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
    -- Validate status
    IF new_status_param NOT IN ('upcoming', 'active', 'finished') THEN
        RAISE EXCEPTION 'Invalid status. Must be upcoming, active, or finished.';
    END IF;

    -- Update the event status
    UPDATE public.weekly_events
    SET 
        status = new_status_param,
        updated_at = NOW()
    WHERE id = event_id_param;

    -- Check if update was successful
    IF FOUND THEN
        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION change_event_status(BIGINT, TEXT) TO authenticated;

-- Create a view that shows events with Saudi time for display purposes
CREATE OR REPLACE VIEW weekly_events_saudi_time AS
SELECT 
    id,
    title,
    description,
    category,
    start_time,
    -- Convert UTC to Saudi time for display
    start_time AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Riyadh' as start_time_saudi,
    duration_minutes,
    xp_reward,
    is_enabled,
    status,
    created_at,
    updated_at,
    -- Calculate end time in Saudi timezone
    (start_time AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Riyadh') + INTERVAL '1 minute' * duration_minutes as end_time_saudi
FROM public.weekly_events;

-- Grant access to the view
GRANT SELECT ON weekly_events_saudi_time TO authenticated;

-- Create a function to get current Saudi time
CREATE OR REPLACE FUNCTION get_saudi_time()
RETURNS TIMESTAMP WITH TIME ZONE AS $$
BEGIN
    RETURN NOW() AT TIME ZONE 'Asia/Riyadh';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_saudi_time() TO authenticated;

-- Create a function to check if an event is currently active in Saudi time
CREATE OR REPLACE FUNCTION is_event_active_saudi(
    event_start_time TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
    saudi_now TIMESTAMP WITH TIME ZONE;
    event_start_saudi TIMESTAMP WITH TIME ZONE;
    event_end_saudi TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Get current time in Saudi timezone
    saudi_now := NOW() AT TIME ZONE 'Asia/Riyadh';
    
    -- Convert event times to Saudi timezone
    event_start_saudi := event_start_time AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Riyadh';
    event_end_saudi := event_start_saudi + INTERVAL '1 minute' * duration_minutes;
    
    -- Check if event is currently active
    RETURN saudi_now >= event_start_saudi AND saudi_now <= event_end_saudi;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION is_event_active_saudi(TIMESTAMP WITH TIME ZONE, INTEGER) TO authenticated;

-- Update existing events to ensure they have proper timezone info
-- This is a one-time fix for existing data
UPDATE public.weekly_events 
SET updated_at = NOW() 
WHERE updated_at IS NULL;

-- Add a comment to the table for documentation
COMMENT ON TABLE public.weekly_events IS 'Weekly events table. All timestamps are stored in UTC and should be converted to Asia/Riyadh timezone for display.';
COMMENT ON COLUMN public.weekly_events.start_time IS 'Event start time in UTC. Convert to Asia/Riyadh for display.';

-- Create an index on start_time for better performance
CREATE INDEX IF NOT EXISTS idx_weekly_events_start_time ON public.weekly_events(start_time);
CREATE INDEX IF NOT EXISTS idx_weekly_events_status ON public.weekly_events(status);
CREATE INDEX IF NOT EXISTS idx_weekly_events_enabled ON public.weekly_events(is_enabled);
