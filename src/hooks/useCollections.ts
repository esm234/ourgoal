// =====================================================
// COLLECTIONS HOOK - Hook للتجميعات
// =====================================================

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  collections,
  searchCollections,
  getCollectionById,
  getCollectionsStats,
  Collection,
  LocalExam
} from '@/data/localFiles';

interface UseCollectionsOptions {
  category?: string;
  searchQuery?: string;
  pageSize?: number;
}

interface UseCollectionsReturn {
  collections: Collection[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  stats: {
    verbal: number;
    quantitative: number;
    total: number;
  };
  refetch: () => void;
}

export const useCollections = (options: UseCollectionsOptions = {}): UseCollectionsReturn => {
  const { category, searchQuery, pageSize = 12 } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  // تصفية التجميعات بناءً على الفئة والبحث
  const filteredCollections = useMemo(() => {
    let collectionsData = [...collections];

    // تصفية حسب الفئة
    if (category && category !== 'all') {
      collectionsData = collectionsData.filter(collection => collection.category === category);
    }

    // تصفية حسب البحث
    if (searchQuery && searchQuery.trim()) {
      collectionsData = searchCollections(searchQuery.trim(), category);
    }

    // ترتيب حسب تاريخ الإنشاء (الأحدث أولاً)
    collectionsData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return collectionsData;
  }, [category, searchQuery]);

  // تقسيم الصفحات
  const paginatedCollections = useMemo(() => {
    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredCollections.slice(startIndex, endIndex);
  }, [filteredCollections, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredCollections.length / pageSize);
  const stats = getCollectionsStats();

  // إعادة تعيين الأخطاء عند تغيير الفلاتر
  useEffect(() => {
    setError(null);
  }, [category, searchQuery]);

  // إعادة تعيين الصفحة عند تغيير الفلاتر
  useEffect(() => {
    setCurrentPage(0);
  }, [category, searchQuery]);

  const refetch = useCallback(() => {
    setError(null);
  }, []);

  return {
    collections: paginatedCollections,
    loading,
    error,
    totalCount: filteredCollections.length,
    totalPages,
    currentPage,
    setCurrentPage,
    stats: {
      verbal: stats.collectionCategoryCounts.verbal,
      quantitative: stats.collectionCategoryCounts.quantitative,
      total: stats.totalCollections
    },
    refetch
  };
};

// =====================================================
// HOOK للحصول على تجميعة واحدة مع اختباراتها
// =====================================================

interface UseCollectionDetailsReturn {
  collection: Collection | null;
  exams: LocalExam[];
  loading: boolean;
  error: string | null;
}

export const useCollectionDetails = (collectionId: number): UseCollectionDetailsReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const collection = useMemo(() => {
    return getCollectionById(collectionId) || null;
  }, [collectionId]);

  const exams = useMemo(() => {
    return collection?.exams || [];
  }, [collection]);

  useEffect(() => {
    setError(null);

    if (!collection) {
      setError('التجميعة غير موجودة');
    }
  }, [collectionId, collection]);

  return {
    collection,
    exams,
    loading,
    error
  };
};

// =====================================================
// HOOK لإحصائيات التجميعات
// =====================================================

interface UseCollectionsStatsReturn {
  stats: {
    verbal: number;
    quantitative: number;
    total: number;
  };
  loading: boolean;
}

export const useCollectionsStats = (): UseCollectionsStatsReturn => {
  const [loading, setLoading] = useState(false);
  const stats = getCollectionsStats();

  return {
    stats: {
      verbal: stats.collectionCategoryCounts.verbal,
      quantitative: stats.collectionCategoryCounts.quantitative,
      total: stats.totalCollections
    },
    loading
  };
};

// =====================================================
// HOOK للبحث في التجميعات
// =====================================================

interface UseCollectionSearchReturn {
  searchResults: Collection[];
  loading: boolean;
  search: (query: string) => void;
  clearSearch: () => void;
}

export const useCollectionSearch = (): UseCollectionSearchReturn => {
  const [searchResults, setSearchResults] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);

  // Debounced search function
  const debouncedSearch = useCallback((query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // البحث فوري للتجميعات المحلية
    const results = searchCollections(query);
    setSearchResults(results);
    setLoading(false);
  }, []);

  // Search with debouncing
  const search = useCallback((query: string) => {
    // Clear previous timeout
    const timeoutId = setTimeout(() => {
      debouncedSearch(query);
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [debouncedSearch]);

  const clearSearch = useCallback(() => {
    setSearchResults([]);
    setLoading(false);
  }, []);

  return {
    searchResults,
    loading,
    search,
    clearSearch
  };
};
