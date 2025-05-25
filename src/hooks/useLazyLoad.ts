import { useState, useEffect, useRef, useCallback } from 'react';

interface UseLazyLoadOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export const useLazyLoad = (options: UseLazyLoadOptions = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    triggerOnce = true
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    
    if (entry.isIntersecting) {
      setIsVisible(true);
      setHasTriggered(true);
    } else if (!triggerOnce || !hasTriggered) {
      setIsVisible(false);
    }
  }, [triggerOnce, hasTriggered]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin
    });

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [handleIntersection, threshold, rootMargin]);

  return {
    elementRef,
    isVisible: triggerOnce ? hasTriggered : isVisible,
    hasTriggered
  };
};

// Hook للتحميل التدريجي للبيانات
export const useLazyData = <T>(
  fetchFunction: () => Promise<T>,
  dependencies: any[] = [],
  options: UseLazyLoadOptions = {}
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { elementRef, isVisible } = useLazyLoad(options);

  const fetchData = useCallback(async () => {
    if (!isVisible || loading) return;

    try {
      setLoading(true);
      setError(null);
      const result = await fetchFunction();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  }, [isVisible, loading, fetchFunction]);

  useEffect(() => {
    if (isVisible) {
      fetchData();
    }
  }, [isVisible, ...dependencies]);

  return {
    elementRef,
    data,
    loading,
    error,
    isVisible,
    refetch: fetchData
  };
};

// Hook للتحميل التدريجي للصور
export const useLazyImage = (src: string, options: UseLazyLoadOptions = {}) => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const { elementRef, isVisible } = useLazyLoad(options);

  useEffect(() => {
    if (!isVisible || !src) return;

    const img = new Image();
    
    img.onload = () => {
      setImageSrc(src);
      setImageLoaded(true);
      setImageError(false);
    };
    
    img.onerror = () => {
      setImageError(true);
      setImageLoaded(false);
    };
    
    img.src = src;
  }, [isVisible, src]);

  return {
    elementRef,
    imageSrc,
    imageLoaded,
    imageError,
    isVisible
  };
};

// Hook للتحكم في التحديث التلقائي
export const useAutoRefresh = (
  refreshFunction: () => void,
  interval: number = 5 * 60 * 1000, // 5 دقائق افتراضياً
  enabled: boolean = true
) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const intervalRef = useRef<NodeJS.Timeout>();

  const refresh = useCallback(async () => {
    if (isRefreshing) return;
    
    try {
      setIsRefreshing(true);
      await refreshFunction();
      setLastRefresh(Date.now());
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshFunction, isRefreshing]);

  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    intervalRef.current = setInterval(refresh, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refresh, interval, enabled]);

  return {
    refresh,
    isRefreshing,
    lastRefresh: new Date(lastRefresh)
  };
};

// Hook للتحكم في حجم الدفعة (Batch Size)
export const useBatchLoader = <T>(
  items: T[],
  batchSize: number = 10,
  loadDelay: number = 100
) => {
  const [loadedItems, setLoadedItems] = useState<T[]>([]);
  const [currentBatch, setCurrentBatch] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const loadNextBatch = useCallback(() => {
    if (isLoading || currentBatch * batchSize >= items.length) return;

    setIsLoading(true);
    
    setTimeout(() => {
      const startIndex = currentBatch * batchSize;
      const endIndex = Math.min(startIndex + batchSize, items.length);
      const newItems = items.slice(startIndex, endIndex);
      
      setLoadedItems(prev => [...prev, ...newItems]);
      setCurrentBatch(prev => prev + 1);
      setIsLoading(false);
    }, loadDelay);
  }, [items, batchSize, currentBatch, isLoading, loadDelay]);

  const reset = useCallback(() => {
    setLoadedItems([]);
    setCurrentBatch(0);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    reset();
  }, [items, reset]);

  useEffect(() => {
    if (loadedItems.length === 0 && items.length > 0) {
      loadNextBatch();
    }
  }, [items, loadedItems.length, loadNextBatch]);

  return {
    loadedItems,
    hasMore: currentBatch * batchSize < items.length,
    isLoading,
    loadNextBatch,
    reset,
    progress: Math.min((loadedItems.length / items.length) * 100, 100)
  };
};

// Hook للتحكم في التخزين المؤقت الذكي
export const useSmartCache = <T>(
  key: string,
  fetchFunction: () => Promise<T>,
  options: {
    ttl?: number; // Time to live in milliseconds
    maxSize?: number; // Maximum cache size
    compression?: boolean;
  } = {}
) => {
  const {
    ttl = 5 * 60 * 1000, // 5 دقائق
    maxSize = 50, // 50 عنصر
    compression = true
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCached, setIsCached] = useState(false);

  const getCacheKey = (suffix: string = '') => `smart_cache_${key}${suffix}`;

  const isExpired = (timestamp: number) => Date.now() - timestamp > ttl;

  const getFromCache = useCallback((): T | null => {
    try {
      const cached = localStorage.getItem(getCacheKey());
      if (!cached) return null;

      const { data: cachedData, timestamp } = JSON.parse(cached);
      
      if (isExpired(timestamp)) {
        localStorage.removeItem(getCacheKey());
        return null;
      }

      setIsCached(true);
      return compression ? JSON.parse(cachedData) : cachedData;
    } catch {
      return null;
    }
  }, [key, ttl, compression]);

  const setToCache = useCallback((data: T) => {
    try {
      // إدارة حجم التخزين المؤقت
      const cacheKeys = Object.keys(localStorage).filter(k => k.startsWith('smart_cache_'));
      if (cacheKeys.length >= maxSize) {
        // حذف أقدم العناصر
        const oldestKey = cacheKeys
          .map(k => ({ key: k, timestamp: JSON.parse(localStorage.getItem(k) || '{}').timestamp || 0 }))
          .sort((a, b) => a.timestamp - b.timestamp)[0]?.key;
        
        if (oldestKey) {
          localStorage.removeItem(oldestKey);
        }
      }

      const cacheEntry = {
        data: compression ? JSON.stringify(data) : data,
        timestamp: Date.now()
      };

      localStorage.setItem(getCacheKey(), JSON.stringify(cacheEntry));
    } catch (err) {
      console.warn('Failed to cache data:', err);
    }
  }, [key, maxSize, compression]);

  const fetchData = useCallback(async (forceRefresh = false) => {
    // التحقق من التخزين المؤقت أولاً
    if (!forceRefresh) {
      const cachedData = getFromCache();
      if (cachedData) {
        setData(cachedData);
        return cachedData;
      }
    }

    try {
      setLoading(true);
      setError(null);
      setIsCached(false);
      
      const result = await fetchFunction();
      setData(result);
      setToCache(result);
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'حدث خطأ في تحميل البيانات';
      setError(errorMessage);
      
      // محاولة استخدام البيانات المخزنة مؤقتاً حتى لو انتهت صلاحيتها
      const cachedData = getFromCache();
      if (cachedData) {
        setData(cachedData);
        setIsCached(true);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, getFromCache, setToCache]);

  const clearCache = useCallback(() => {
    localStorage.removeItem(getCacheKey());
    setIsCached(false);
  }, [key]);

  // تحميل البيانات عند التهيئة
  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    isCached,
    refetch: () => fetchData(true),
    clearCache
  };
};
