import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface FastFilesHook {
  data: any[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: () => void;
  prevPage: () => void;
  refresh: () => void;
}

// Hook محسن وسريع للملفات
export const useFastFiles = (category?: string, searchTerm?: string): FastFilesHook => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false); // بدء بدون loading
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 20;

  const fetchFiles = async (page: number = 0) => {
    // إظهار loading فقط للصفحة الأولى
    if (page === 0) {
      setLoading(true);
    }
    setError(null);

    try {
      // استعلام محسن وسريع - حقول محددة فقط
      let query = supabase
        .from('files')
        .select('id, title, description, category, file_size, downloads, created_at', { count: 'exact' })
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
        // If table doesn't exist, return empty data quickly
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

  // تحسين useEffect - تقليل debounce time
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(0);
      fetchFiles(0);
    }, 150); // تقليل وقت الانتظار إلى 150ms

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

// Hook محسن للمستخدمين
export const useFastUsers = (searchTerm?: string) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 50;

  const fetchUsers = async (page: number = 0) => {
    if (page === 0) {
      setLoading(true);
    }
    setError(null);

    try {
      // استعلام محسن - حقول محددة فقط
      let query = supabase
        .from('profiles')
        .select('id, username, role, created_at', { count: 'exact' })
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
    }, 200); // تقليل وقت الانتظار

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
