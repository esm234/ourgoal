import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

/**
 * A hook that provides secure admin status verification
 * It checks both the client-side role and verifies it with the backend
 */
export const useAdminCheck = () => {
  const { role, isLoggedIn } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyAdminStatus = async () => {
      setIsVerifying(true);
      setError(null);

      try {
        // First check if the user is logged in and has admin role in the client
        if (!isLoggedIn || role !== 'admin') {
          setIsAdmin(false);
          return;
        }

        // Double-check with the backend using the secure RPC function
        const { data, error } = await supabase.rpc('is_admin');
        
        if (error) {
          console.error('Error verifying admin status:', error);
          setError(error.message);
          setIsAdmin(false);
          return;
        }

        setIsAdmin(!!data);
      } catch (err: any) {
        console.error('Unexpected error during admin verification:', err);
        setError(err.message || 'An unexpected error occurred');
        setIsAdmin(false);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyAdminStatus();
  }, [isLoggedIn, role]);

  return { isAdmin, isVerifying, error };
};
