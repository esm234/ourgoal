-- Create triggers for notifications

-- Trigger for plan completion notifications
DROP TRIGGER IF EXISTS plan_completion_notification_trigger ON completed_plans;
CREATE TRIGGER plan_completion_notification_trigger
AFTER INSERT ON completed_plans
FOR EACH ROW
EXECUTE FUNCTION notify_on_plan_completion();

-- Trigger for weekly event notifications
DROP TRIGGER IF EXISTS weekly_event_notification_trigger ON weekly_events;
CREATE TRIGGER weekly_event_notification_trigger
AFTER INSERT ON weekly_events
FOR EACH ROW
EXECUTE FUNCTION notify_on_weekly_event_creation();

-- Trigger for XP earned notifications
DROP TRIGGER IF EXISTS xp_earned_notification_trigger ON user_stats;
CREATE TRIGGER xp_earned_notification_trigger
AFTER UPDATE ON user_stats
FOR EACH ROW
WHEN (NEW.xp > OLD.xp)
EXECUTE FUNCTION notify_on_xp_earned();

-- Function to create a notification when a user joins an event
CREATE OR REPLACE FUNCTION notify_on_event_join()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM create_user_notification(
    NEW.user_id,
    'event_joined',
    'تم الانضمام إلى الفعالية',
    'لقد انضممت إلى الفعالية: ' || (SELECT title FROM weekly_events WHERE id = NEW.event_id),
    '/weekly-events/' || NEW.event_id || '/test',
    jsonb_build_object('event_id', NEW.event_id)
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for event join notifications
DROP TRIGGER IF EXISTS event_join_notification_trigger ON event_participants;
CREATE TRIGGER event_join_notification_trigger
AFTER INSERT ON event_participants
FOR EACH ROW
EXECUTE FUNCTION notify_on_event_join();

-- Function to create a notification when a user completes an event test
CREATE OR REPLACE FUNCTION notify_on_event_completion()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM create_user_notification(
    NEW.user_id,
    'event_completed',
    'تم إكمال اختبار الفعالية',
    'لقد أكملت اختبار الفعالية: ' || (SELECT title FROM weekly_events WHERE id = NEW.event_id),
    '/weekly-events/' || NEW.event_id || '/results',
    jsonb_build_object(
      'event_id', NEW.event_id,
      'score', NEW.score,
      'max_score', NEW.max_score
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for event completion notifications
DROP TRIGGER IF EXISTS event_completion_notification_trigger ON event_results;
CREATE TRIGGER event_completion_notification_trigger
AFTER INSERT ON event_results
FOR EACH ROW
EXECUTE FUNCTION notify_on_event_completion();

-- Function to create a notification when a user enrolls in a course
CREATE OR REPLACE FUNCTION notify_on_course_enrollment()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM create_user_notification(
    NEW.user_id,
    'course_enrolled',
    'تم التسجيل في الدورة',
    'لقد سجلت في الدورة: ' || (SELECT title FROM courses WHERE id = NEW.course_id),
    '/courses/' || NEW.course_id,
    jsonb_build_object('course_id', NEW.course_id)
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for course enrollment notifications
DROP TRIGGER IF EXISTS course_enrollment_notification_trigger ON course_enrollments;
CREATE TRIGGER course_enrollment_notification_trigger
AFTER INSERT ON course_enrollments
FOR EACH ROW
EXECUTE FUNCTION notify_on_course_enrollment();

-- Function to create a notification when a user completes a course
CREATE OR REPLACE FUNCTION notify_on_course_completion()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if all lessons are completed
  IF (
    SELECT COUNT(*) = (SELECT COUNT(*) FROM course_lessons WHERE course_id = NEW.course_id)
    FROM course_lesson_completions 
    WHERE user_id = NEW.user_id AND lesson_id IN (SELECT id FROM course_lessons WHERE course_id = NEW.course_id)
  ) THEN
    PERFORM create_user_notification(
      NEW.user_id,
      'course_completed',
      'تهانينا! تم إكمال الدورة',
      'لقد أكملت جميع دروس الدورة: ' || (SELECT title FROM courses WHERE id = NEW.course_id),
      '/courses/' || NEW.course_id,
      jsonb_build_object('course_id', NEW.course_id)
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for course completion notifications
DROP TRIGGER IF EXISTS course_lesson_completion_notification_trigger ON course_lesson_completions;
CREATE TRIGGER course_lesson_completion_notification_trigger
AFTER INSERT ON course_lesson_completions
FOR EACH ROW
EXECUTE FUNCTION notify_on_course_completion(); 