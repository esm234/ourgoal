import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PaginationOptions {
  pageSize?: number;
  initialPage?: number;
}

interface PaginationResult<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  refresh: () => void;
}

export const usePagination = <T>(
  tableName: string,
  selectFields: string,
  options: PaginationOptions = {}
): PaginationResult<T> => {
  const { pageSize = 20, initialPage = 0 } = options;

  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<any>({});
  const [orderBy, setOrderBy] = useState<{ column: string; ascending: boolean }>({
    column: 'created_at',
    ascending: false
  });

  const totalPages = Math.ceil(totalCount / pageSize);
  const hasNextPage = currentPage < totalPages - 1;
  const hasPrevPage = currentPage > 0;

  const fetchData = async (page: number = currentPage) => {
    setLoading(true);
    setError(null);

    try {
      // Get total count first
      const { count, error: countError } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });

      if (countError) throw countError;
      setTotalCount(count || 0);

      // Get paginated data
      const from = page * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from(tableName)
        .select(selectFields)
        .range(from, to)
        .order(orderBy.column, { ascending: orderBy.ascending });

      // Apply filters if any
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          query = query.eq(key, value);
        }
      });

      const { data: result, error: dataError } = await query;

      if (dataError) throw dataError;
      setData(result || []);
    } catch (err: any) {
      setError(err.message);
      console.error(`Error fetching ${tableName}:`, err);
    } finally {
      setLoading(false);
    }
  };

  const nextPage = () => {
    if (hasNextPage) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      fetchData(newPage);
    }
  };

  const prevPage = () => {
    if (hasPrevPage) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      fetchData(newPage);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
      fetchData(page);
    }
  };

  const refresh = () => {
    fetchData(currentPage);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    currentPage,
    totalPages,
    totalCount,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
    goToPage,
    refresh
  };
};

// Hook مخصص للملفات مع تحسينات
export const useOptimizedFiles = (category?: string, searchTerm?: string) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 20;

  const fetchFiles = async (page: number = 0) => {
    setLoading(true);
    setError(null);

    try {
      // Build query with optimized fields only
      let query = supabase
        .from('files')
        .select(`
          id,
          title,
          description,
          category,
          file_size,
          downloads,
          created_at
        `, { count: 'exact' })
        .range(page * pageSize, (page + 1) * pageSize - 1)
        .order('created_at', { ascending: false });

      // Apply category filter
      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      // Apply search filter
      if (searchTerm && searchTerm.trim()) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      const { data: result, error: dataError, count } = await query;

      if (dataError) {
        // If table doesn't exist, return empty data
        if (dataError.message.includes('relation "public.files" does not exist')) {
          console.log('Files table does not exist yet. Please run the SQL schema.');
          setData([]);
          setTotalCount(0);
          return;
        }
        throw dataError;
      }

      setData(result || []);
      setTotalCount(count || 0);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching files:', err);
      // Return empty data on error
      setData([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const nextPage = () => {
    const newPage = currentPage + 1;
    setCurrentPage(newPage);
    fetchFiles(newPage);
  };

  const prevPage = () => {
    const newPage = currentPage - 1;
    setCurrentPage(newPage);
    fetchFiles(newPage);
  };

  const refresh = () => {
    setCurrentPage(0);
    fetchFiles(0);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(0);
      fetchFiles(0);
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [category, searchTerm]);

  return {
    data,
    loading,
    error,
    currentPage,
    totalPages: Math.ceil(totalCount / pageSize),
    totalCount,
    hasNextPage: (currentPage + 1) * pageSize < totalCount,
    hasPrevPage: currentPage > 0,
    nextPage,
    prevPage,
    refresh
  };
};

// Hook للمستخدمين مع تحسينات
export const useOptimizedUsers = (searchTerm?: string) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 50; // عدد أكبر للمستخدمين

  const fetchUsers = async (page: number = 0) => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('profiles')
        .select(`
          id,
          username,
          role,
          created_at
        `, { count: 'exact' })
        .range(page * pageSize, (page + 1) * pageSize - 1)
        .order('created_at', { ascending: false });

      if (searchTerm && searchTerm.trim()) {
        query = query.ilike('username', `%${searchTerm}%`);
      }

      const { data: result, error: dataError, count } = await query;

      if (dataError) throw dataError;

      // Format data with placeholder emails
      const formattedUsers = (result || []).map(user => ({
        id: user.id,
        email: `user-${user.id.substring(0, 8)}@example.com`,
        username: user.username,
        role: user.role,
        created_at: user.created_at,
      }));

      setData(formattedUsers);
      setTotalCount(count || 0);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const nextPage = () => {
    const newPage = currentPage + 1;
    setCurrentPage(newPage);
    fetchUsers(newPage);
  };

  const prevPage = () => {
    const newPage = currentPage - 1;
    setCurrentPage(newPage);
    fetchUsers(newPage);
  };

  const refresh = () => {
    setCurrentPage(0);
    fetchUsers(0);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(0);
      fetchUsers(0);
    }, 500); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return {
    data,
    loading,
    error,
    currentPage,
    totalPages: Math.ceil(totalCount / pageSize),
    totalCount,
    hasNextPage: (currentPage + 1) * pageSize < totalCount,
    hasPrevPage: currentPage > 0,
    nextPage,
    prevPage,
    refresh
  };
};
