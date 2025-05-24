import { supabase } from "@/integrations/supabase/client";
import { globalCache } from "@/hooks/useCache";

// ضغط البيانات قبل الإرسال
const compressData = (data: any): string => {
  try {
    return JSON.stringify(data);
  } catch {
    return '';
  }
};

// إلغاء ضغط البيانات
const decompressData = (data: string): any => {
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

// خدمة محسّنة للاختبارات
export class OptimizedTestService {
  private static CACHE_TTL = 10 * 60 * 1000; // 10 دقائق

  // جلب الاختبارات مع التخزين المؤقت
  static async getTests(category?: string) {
    const cacheKey = `tests_${category || 'all'}`;

    // التحقق من التخزين المؤقت
    if (globalCache.has(cacheKey)) {
      return globalCache.get(cacheKey);
    }

    try {
      let query = supabase
        .from('tests')
        .select(`
          id,
          title,
          description,
          category,
          duration,
          published,
          created_at,
          user_id,
          questionCount:questions(count)
        `)
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query.limit(50); // تحديد عدد النتائج

      if (error) throw error;

      // حفظ في التخزين المؤقت
      globalCache.set(cacheKey, data, this.CACHE_TTL);

      return data;
    } catch (error) {
      console.error('Error fetching tests:', error);
      throw error;
    }
  }

  // جلب أسئلة الاختبار مع التحسين
  static async getTestQuestions(testId: string) {
    const cacheKey = `test_questions_${testId}`;

    if (globalCache.has(cacheKey)) {
      return globalCache.get(cacheKey);
    }

    try {
      const { data, error } = await supabase
        .from('questions')
        .select(`
          id,
          text,
          options,
          correct_answer,
          explanation,
          image_url,
          passage
        `)
        .eq('test_id', testId)
        .order('order_index', { ascending: true });

      if (error) throw error;

      // ضغط البيانات الكبيرة
      const compressedData = data?.map(question => ({
        ...question,
        options: question.options ? compressData(question.options) : null,
        explanation: question.explanation || null
      }));

      globalCache.set(cacheKey, compressedData, this.CACHE_TTL);

      return compressedData;
    } catch (error) {
      console.error('Error fetching test questions:', error);
      throw error;
    }
  }

  // حفظ نتيجة الاختبار مع التحسين
  static async saveTestResult(result: any) {
    try {
      // ضغط تفاصيل الأسئلة
      const compressedResult = {
        ...result,
        details: result.details ? compressData(result.details) : null,
        questions: result.questions ? compressData(result.questions) : null
      };

      const { data, error } = await supabase
        .from('exam_results')
        .insert([compressedResult])
        .select()
        .single();

      if (error) throw error;

      // مسح التخزين المؤقت للنتائج
      this.clearResultsCache();

      return data;
    } catch (error) {
      console.error('Error saving test result:', error);
      throw error;
    }
  }

  // جلب النتائج مع التحسين
  static async getUserResults(userId: string, limit = 10) {
    const cacheKey = `user_results_${userId}_${limit}`;

    if (globalCache.has(cacheKey)) {
      return globalCache.get(cacheKey);
    }

    try {
      const { data, error } = await supabase
        .from('exam_results')
        .select(`
          id,
          score,
          total_questions,
          correct_answers,
          test_type,
          created_at
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      globalCache.set(cacheKey, data, this.CACHE_TTL);

      return data;
    } catch (error) {
      console.error('Error fetching user results:', error);
      throw error;
    }
  }

  // مسح التخزين المؤقت
  static clearCache() {
    globalCache.clear();
  }

  static clearResultsCache() {
    // مسح تخزين النتائج فقط
    const stats = globalCache.getStats();
    stats.keys.forEach(key => {
      if (key.includes('user_results') || key.includes('leaderboard')) {
        globalCache.delete(key);
      }
    });
  }
}

// خدمة محسّنة للملف الشخصي
export class OptimizedProfileService {
  private static CACHE_TTL = 15 * 60 * 1000; // 15 دقيقة

  static async getProfile(userId: string) {
    const cacheKey = `profile_${userId}`;

    if (globalCache.has(cacheKey)) {
      return globalCache.get(cacheKey);
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, created_at')
        .eq('id', userId)
        .single();

      if (error) throw error;

      globalCache.set(cacheKey, data, this.CACHE_TTL);

      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }

  static async updateProfile(userId: string, updates: any) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      // تحديث التخزين المؤقت
      const cacheKey = `profile_${userId}`;
      globalCache.set(cacheKey, data, this.CACHE_TTL);

      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }
}

// خدمة محسّنة للليدربورد
export class OptimizedLeaderboardService {
  private static CACHE_TTL = 5 * 60 * 1000; // 5 دقائق

  static async getLeaderboard(category?: string, limit = 20) {
    const cacheKey = `leaderboard_${category || 'all'}_${limit}`;

    if (globalCache.has(cacheKey)) {
      return globalCache.get(cacheKey);
    }

    try {
      let query = supabase
        .from('exam_results')
        .select(`
          score,
          user_id,
          test_id,
          created_at,
          profiles!inner(username)
        `)
        .order('score', { ascending: false })
        .limit(limit);

      if (category) {
        query = query.eq('test_id', category);
      }

      const { data, error } = await query;

      if (error) throw error;

      // تجميع النتائج حسب المستخدم (أفضل نتيجة)
      const userBestScores = new Map();
      data?.forEach(result => {
        const userId = result.user_id;
        if (!userBestScores.has(userId) || userBestScores.get(userId).score < result.score) {
          userBestScores.set(userId, result);
        }
      });

      const leaderboardData = Array.from(userBestScores.values())
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

      globalCache.set(cacheKey, leaderboardData, this.CACHE_TTL);

      return leaderboardData;
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw error;
    }
  }
}

// تنظيف دوري للبيانات القديمة
export const cleanupOldData = async () => {
  try {
    // حذف نتائج الاختبارات الأقدم من 6 أشهر
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    await supabase
      .from('exam_results')
      .delete()
      .lt('created_at', sixMonthsAgo.toISOString());

    console.log('Old data cleanup completed');
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
};

// تشغيل التنظيف عند تحميل الصفحة (مرة واحدة يومياً)
if (typeof window !== 'undefined') {
  const lastCleanup = localStorage.getItem('lastCleanup');
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;

  if (!lastCleanup || now - parseInt(lastCleanup) > oneDayMs) {
    cleanupOldData();
    localStorage.setItem('lastCleanup', now.toString());
  }
}
