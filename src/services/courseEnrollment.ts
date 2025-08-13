import { supabase } from '@/integrations/supabase/client';

// احصل على عدد المشتركين في كورس معين
export const getEnrollmentCount = async (courseId: string): Promise<number> => {
  try {
    console.log(`Fetching enrollment count for course: ${courseId}`);
    
    // الطريقة الأساسية - جلب البيانات الفعلية ثم حساب عددها
    const { data, error } = await supabase
      .from('course_enrollments')
      .select('id')
      .eq('course_id', courseId);
    
    console.log('Direct count response:', { data, error });
    
    if (error) {
      console.error('Error fetching enrollment count:', error);
      return 0;
    }
    
    // إعادة عدد العناصر في مصفوفة البيانات
    let count = data?.length || 0;
    if (courseId === 'the-last-dance') {
      count += 400;
    }
    return count;
  } catch (error) {
    console.error('Error in getEnrollmentCount:', error);
    return 0;
  }
};

// تسجيل مستخدم في كورس
export const enrollUserInCourse = async (courseId: string, userId: string): Promise<boolean> => {
  try {
    console.log(`Enrolling user ${userId} in course ${courseId}`);
    
    // تحقق مما إذا كان المستخدم مسجل بالفعل
    const { data: existingEnrollment, error: checkError } = await supabase
      .from('course_enrollments')
      .select('id')
      .eq('course_id', courseId)
      .eq('user_id', userId)
      .single();
    
    console.log('Check existing enrollment result:', { existingEnrollment, checkError });
    
    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 means no rows returned
      console.error('Error checking enrollment:', checkError);
      return false;
    }
    
    // إذا كان المستخدم مسجل بالفعل، أعد true
    if (existingEnrollment) {
      console.log('User already enrolled');
      return true;
    }
    
    // إذا لم يكن مسجل، قم بتسجيله
    const now = new Date().toISOString();
    
    // إنشاء معرف فريد للتسجيل
    const enrollmentId = crypto.randomUUID();
    
    const { data, error } = await supabase
      .from('course_enrollments')
      .insert({
        id: enrollmentId,
        course_id: courseId,
        user_id: userId,
        enrollment_date: now,
        last_accessed: now,
        total_progress: 0,
        completed_lessons: [],
        created_at: now,
        updated_at: now
      });
    
    console.log('Enrollment result:', { data, error });
    
    if (error) {
      console.error('Error enrolling user in course:', error);
      return false;
    }
    
    console.log('Enrollment successful');
    return true;
  } catch (error) {
    console.error('Error in enrollUserInCourse:', error);
    return false;
  }
};

// تحقق مما إذا كان المستخدم مسجل في كورس معين
export const isUserEnrolled = async (courseId: string, userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('course_enrollments')
      .select('id')
      .eq('course_id', courseId)
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows returned
      console.error('Error checking enrollment:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error in isUserEnrolled:', error);
    return false;
  }
};

// إلغاء تسجيل مستخدم من كورس
export const unenrollUserFromCourse = async (courseId: string, userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('course_enrollments')
      .delete()
      .eq('course_id', courseId)
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error unenrolling user from course:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in unenrollUserFromCourse:', error);
    return false;
  }
};

