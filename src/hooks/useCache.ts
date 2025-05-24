import { useState, useEffect, useCallback } from 'react';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds (default: 5 minutes)
  maxSize?: number; // Maximum cache size (default: 100 items)
}

class CacheManager {
  private cache = new Map<string, CacheItem<any>>();
  private maxSize: number;

  constructor(maxSize = 100) {
    this.maxSize = maxSize;
  }

  set<T>(key: string, data: T, ttl = 5 * 60 * 1000): void {
    // إزالة العناصر المنتهية الصلاحية
    this.cleanup();

    // إزالة أقدم العناصر إذا تجاوز الحد الأقصى
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + ttl
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // التحقق من انتهاء الصلاحية
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;
    
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  // إحصائيات التخزين المؤقت
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      keys: Array.from(this.cache.keys())
    };
  }
}

// إنشاء مدير تخزين مؤقت عام
const globalCache = new CacheManager(200);

// Hook للتخزين المؤقت
export const useCache = <T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
) => {
  const { ttl = 5 * 60 * 1000, maxSize = 100 } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async (forceRefresh = false) => {
    // التحقق من وجود البيانات في التخزين المؤقت
    if (!forceRefresh && globalCache.has(key)) {
      const cachedData = globalCache.get<T>(key);
      if (cachedData) {
        setData(cachedData);
        return cachedData;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      globalCache.set(key, result, ttl);
      setData(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [key, fetcher, ttl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refresh = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  const clearCache = useCallback(() => {
    globalCache.delete(key);
  }, [key]);

  return {
    data,
    loading,
    error,
    refresh,
    clearCache,
    isFromCache: globalCache.has(key)
  };
};

// Hook للتخزين المؤقت المحلي (localStorage)
export const useLocalCache = <T>(
  key: string,
  defaultValue: T,
  ttl = 24 * 60 * 60 * 1000 // 24 ساعة افتراضياً
) => {
  const [data, setData] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;

      const parsed = JSON.parse(item);
      
      // التحقق من انتهاء الصلاحية
      if (Date.now() > parsed.expiresAt) {
        localStorage.removeItem(key);
        return defaultValue;
      }

      return parsed.data;
    } catch {
      return defaultValue;
    }
  });

  const setValue = useCallback((value: T) => {
    try {
      const item = {
        data: value,
        expiresAt: Date.now() + ttl
      };
      localStorage.setItem(key, JSON.stringify(item));
      setData(value);
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }, [key, ttl]);

  const clearValue = useCallback(() => {
    localStorage.removeItem(key);
    setData(defaultValue);
  }, [key, defaultValue]);

  return [data, setValue, clearValue] as const;
};

// تنظيف التخزين المؤقت عند إغلاق التطبيق
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    globalCache.clear();
  });
}

export { globalCache };
export default useCache;
