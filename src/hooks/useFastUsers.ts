// =====================================================
// FAST USERS HOOK - Hook سريع للمستخدمين
// Hook بسيط لجلب وإدارة المستخدمين مع البحث والتصفح
// =====================================================

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  email: string;
  username: string | null;
  role: string | null;
  created_at: string;
}

interface UseFastUsersReturn {
  data: User[];
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

export const useFastUsers = (searchTerm: string = ''): UseFastUsersReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  
  const pageSize = 50;
  const totalPages = Math.ceil(totalCount / pageSize);
  const hasNextPage = currentPage < totalPages - 1;
  const hasPrevPage = currentPage > 0;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query
      let query = supabase
        .from('profiles')
        .select('id, email, username, role, created_at', { count: 'exact' })
        .order('created_at', { ascending: false });

      // Add search filter if provided
      if (searchTerm.trim()) {
        query = query.or(`email.ilike.%${searchTerm}%,username.ilike.%${searchTerm}%`);
      }

      // Add pagination
      const from = currentPage * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error: fetchError, count } = await query;

      if (fetchError) throw fetchError;

      setUsers(data || []);
      setTotalCount(count || 0);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message || 'خطأ في جلب المستخدمين');
      setUsers([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users when dependencies change
  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm]);

  // Reset to first page when search term changes
  useEffect(() => {
    if (searchTerm !== '') {
      setCurrentPage(0);
    }
  }, [searchTerm]);

  const nextPage = () => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (hasPrevPage) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const refresh = () => {
    fetchUsers();
  };

  return {
    data: users,
    loading,
    error,
    currentPage,
    totalPages,
    totalCount,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
    refresh
  };
};
