// =====================================================
// LOCAL FILES HOOK - Hook للملفات المحلية
// استبدال useFastFiles للعمل مع البيانات المحلية
// =====================================================

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  localFiles,
  searchFiles,
  getFileById,
  getFilesStats,
  LocalFile,
  LocalExam
} from '@/data/localFiles';

interface UseLocalFilesOptions {
  category?: string;
  searchQuery?: string;
  pageSize?: number;
}

interface UseLocalFilesReturn {
  files: LocalFile[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  stats: {
    verbal: number;
    quantitative: number;
    mixed: number;
    general: number;
    total: number;
  };
  refetch: () => void;
}

export const useLocalFiles = (options: UseLocalFilesOptions = {}): UseLocalFilesReturn => {
  const { category, searchQuery, pageSize = 12 } = options;

  const [loading, setLoading] = useState(false); // لا نحتاج تحميل للملفات المحلية
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  // تصفية الملفات بناءً على الفئة والبحث
  const filteredFiles = useMemo(() => {
    let files = [...localFiles];

    // تصفية حسب الفئة
    if (category && category !== 'all') {
      files = files.filter(file => file.category === category);
    }

    // تصفية حسب البحث
    if (searchQuery && searchQuery.trim()) {
      files = searchFiles(searchQuery.trim(), category);
    }

    // ترتيب حسب تاريخ الإنشاء (الأحدث أولاً)
    files.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return files;
  }, [category, searchQuery]);

  // تقسيم الصفحات
  const paginatedFiles = useMemo(() => {
    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredFiles.slice(startIndex, endIndex);
  }, [filteredFiles, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredFiles.length / pageSize);
  const stats = getFilesStats();

  // إعادة تعيين الأخطاء عند تغيير الفلاتر
  useEffect(() => {
    setError(null);
  }, [category, searchQuery]);

  // إعادة تعيين الصفحة عند تغيير الفلاتر
  useEffect(() => {
    setCurrentPage(0);
  }, [category, searchQuery]);

  const refetch = useCallback(() => {
    // للملفات المحلية، مفيش حاجة نعملها في refetch
    setError(null);
  }, []);

  return {
    files: paginatedFiles,
    loading,
    error,
    totalCount: filteredFiles.length,
    totalPages,
    currentPage,
    setCurrentPage,
    stats,
    refetch
  };
};

// =====================================================
// HOOK للحصول على ملف واحد مع اختباراته
// =====================================================

interface UseLocalFileDetailsReturn {
  file: LocalFile | null;
  exams: LocalExam[];
  loading: boolean;
  error: string | null;
}

export const useLocalFileDetails = (fileId: number): UseLocalFileDetailsReturn => {
  const [loading, setLoading] = useState(false); // لا نحتاج تحميل للملفات المحلية
  const [error, setError] = useState<string | null>(null);

  const file = useMemo(() => {
    return getFileById(fileId) || null;
  }, [fileId]);

  const exams = useMemo(() => {
    return file?.exams || [];
  }, [file]);

  useEffect(() => {
    setError(null);

    if (!file) {
      setError('الملف غير موجود');
    }
  }, [fileId, file]);

  return {
    file,
    exams,
    loading,
    error
  };
};

// =====================================================
// HOOK لإحصائيات الملفات
// =====================================================

interface UseFilesStatsReturn {
  stats: {
    verbal: number;
    quantitative: number;
    mixed: number;
    general: number;
    total: number;
  };
  loading: boolean;
}

export const useFilesStats = (): UseFilesStatsReturn => {
  const [loading, setLoading] = useState(false); // لا نحتاج تحميل للإحصائيات المحلية

  return {
    stats: getFilesStats(),
    loading
  };
};

// =====================================================
// HOOK للبحث في الملفات
// =====================================================

interface UseFileSearchReturn {
  searchResults: LocalFile[];
  loading: boolean;
  search: (query: string) => void;
  clearSearch: () => void;
}

export const useFileSearch = (): UseFileSearchReturn => {
  const [searchResults, setSearchResults] = useState<LocalFile[]>([]);
  const [loading, setLoading] = useState(false);

  // Debounced search function
  const debouncedSearch = useCallback((query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // البحث فوري للملفات المحلية
    const results = searchFiles(query);
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

// =====================================================
// دالة لمحاكاة تحديث عداد التحميلات
// =====================================================

export const incrementDownloadCount = (fileId: number): void => {
  // Note: Download counts are now handled by incrementDownloads from localFiles
  // This function is kept for compatibility
  console.log(`Download initiated for file ${fileId}`);
};

// =====================================================
// FIXED DOWNLOAD COUNTS - عدادات التحميل الثابتة
// العدادات الآن ثابتة ولا تتغير لضمان تجربة مستخدم أفضل
// =====================================================
