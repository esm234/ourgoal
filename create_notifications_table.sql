-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view only their own notifications
CREATE POLICY notifications_select_policy ON notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Policy to allow users to update only their own notifications (for marking as read)
CREATE POLICY notifications_update_policy ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy for system to insert notifications - allow any authenticated user to insert their own notifications
CREATE POLICY notifications_insert_policy ON notifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_created_at_idx ON notifications(created_at);
CREATE INDEX IF NOT EXISTS notifications_is_read_idx ON notifications(is_read);

-- Function to mark notification as read
CREATE OR REPLACE FUNCTION mark_notification_read(notification_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE notifications
  SET is_read = TRUE, updated_at = now()
  WHERE id = notification_id AND user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark all notifications as read
CREATE OR REPLACE FUNCTION mark_all_notifications_read()
RETURNS VOID AS $$
BEGIN
  UPDATE notifications
  SET is_read = TRUE, updated_at = now()
  WHERE user_id = auth.uid() AND is_read = FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to delete a notification
CREATE OR REPLACE FUNCTION delete_notification(notification_id UUID)
RETURNS VOID AS $$
BEGIN
  DELETE FROM notifications
  WHERE id = notification_id AND user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to delete all read notifications
CREATE OR REPLACE FUNCTION delete_all_read_notifications()
RETURNS VOID AS $$
BEGIN
  DELETE FROM notifications
  WHERE user_id = auth.uid() AND is_read = TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create system notification for a specific user
CREATE OR REPLACE FUNCTION create_user_notification(
  p_user_id UUID,
  p_type VARCHAR(50),
  p_title TEXT,
  p_message TEXT,
  p_link TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO notifications (user_id, type, title, message, link, metadata)
  VALUES (p_user_id, p_type, p_title, p_message, p_link, p_metadata)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create notification for all users
CREATE OR REPLACE FUNCTION create_notification_for_all_users(
  p_type VARCHAR(50),
  p_title TEXT,
  p_message TEXT,
  p_link TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS INTEGER AS $$
DECLARE
  inserted_count INTEGER;
BEGIN
  INSERT INTO notifications (user_id, type, title, message, link, metadata)
  SELECT id, p_type, p_title, p_message, p_link, p_metadata
  FROM auth.users;
  
  GET DIAGNOSTICS inserted_count = ROW_COUNT;
  RETURN inserted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get unread notifications count
CREATE OR REPLACE FUNCTION get_unread_notifications_count()
RETURNS INTEGER AS $$
DECLARE
  count_result INTEGER;
BEGIN
  SELECT COUNT(*) INTO count_result
  FROM notifications
  WHERE user_id = auth.uid() AND is_read = FALSE;
  
  RETURN count_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_notification_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_notifications_timestamp
BEFORE UPDATE ON notifications
FOR EACH ROW
EXECUTE FUNCTION update_notification_timestamp();

-- Create a function to automatically create a notification when a user completes a plan
CREATE OR REPLACE FUNCTION notify_on_plan_completion()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM create_user_notification(
    NEW.user_id,
    'plan_completed',
    'تهانينا! تم إكمال خطة الدراسة',
    'لقد أكملت خطة الدراسة "' || (SELECT title FROM study_plans WHERE id = NEW.plan_id) || '" بنجاح.',
    '/plan-details/' || NEW.plan_id,
    jsonb_build_object('plan_id', NEW.plan_id)
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a function to automatically create a notification for weekly events
CREATE OR REPLACE FUNCTION notify_on_weekly_event_creation()
RETURNS TRIGGER AS $$
BEGIN
  -- Create notification for all users when a new weekly event is created
  PERFORM create_notification_for_all_users(
    'new_weekly_event',
    'فعالية أسبوعية جديدة',
    'تم إضافة فعالية جديدة: ' || NEW.title,
    '/weekly-events',
    jsonb_build_object('event_id', NEW.id)
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a function to automatically create a notification when user earns XP
CREATE OR REPLACE FUNCTION notify_on_xp_earned()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.xp > OLD.xp THEN
    PERFORM create_user_notification(
      NEW.user_id,
      'xp_earned',
      'مبروك! لقد حصلت على نقاط خبرة',
      'لقد حصلت على ' || (NEW.xp - OLD.xp) || ' نقطة خبرة جديدة.',
      '/profile',
      jsonb_build_object('xp_earned', (NEW.xp - OLD.xp))
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql; 