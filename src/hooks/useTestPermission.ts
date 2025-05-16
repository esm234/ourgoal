import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

/**
 * A hook that checks if the current user has permission to edit a specific test
 */
export const useTestPermission = (testId: string | undefined) => {
  const { isLoggedIn, role, user } = useAuth();
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkPermission = async () => {
      setIsVerifying(true);
      setError(null);

      try {
        // If not logged in or no testId, user can't edit
        if (!isLoggedIn || !testId) {
          setCanEdit(false);
          return;
        }

        // If user is already known to be an admin from client-side, they can edit
        if (role === 'admin') {
          setCanEdit(true);
          setIsVerifying(false);
          return;
        }

        // Check if the user is the owner of the test
        const { data, error } = await supabase
          .from("tests")
          .select("user_id")
          .eq("id", testId)
          .single();
        
        if (error) {
          console.error('Error verifying test permission:', error);
          setError(error.message);
          setCanEdit(false);
          return;
        }

        // User can edit if they are the owner
        setCanEdit(data.user_id === user?.id);
      } catch (err: any) {
        console.error('Unexpected error during permission check:', err);
        setError(err.message || 'An unexpected error occurred');
        setCanEdit(false);
      } finally {
        setIsVerifying(false);
      }
    };

    checkPermission();
  }, [isLoggedIn, role, testId, user?.id]);

  return { canEdit, isVerifying, error };
};
