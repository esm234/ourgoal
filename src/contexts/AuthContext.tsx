import React, { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

interface AuthContextType {
  isLoggedIn: boolean;
  username: string | null;
  user: User | null;
  session: Session | null;
  role: string | null;
  login: (email: string, password: string) => Promise<{ error: any | null }>;
  signup: (email: string, password: string) => Promise<{ error: any | null }>;
  logout: () => Promise<{ error: any | null }>;
  resetPassword: (email: string) => Promise<{ error: any | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: any | null }>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to fetch role from profiles and verify admin status
  const fetchUserRole = async (userId: string | undefined | null) => {
    if (!userId) {
      setRole(null);
      return;
    }

    try {
      // First, get the role from the profiles table
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

      if (error) throw error;

      const clientRole = data?.role ?? null;

      // If the client claims to be an admin, verify it with the backend
      if (clientRole === 'admin') {
        // Use the secure RPC function to verify admin status
        const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin');

        if (adminError) {
          console.error("Error verifying admin status:", adminError);
          setRole('user'); // Downgrade to user on error
          return;
        }

        // Only set as admin if the backend confirms it
        setRole(isAdmin ? 'admin' : 'user');
      } else {
        // For non-admin roles, trust the database value
        setRole(clientRole);
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
      setRole(null);
    }
  };

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoggedIn(!!session);
        setUsername(session?.user?.email ?? null);
        fetchUserRole(session?.user?.id);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoggedIn(!!session);
      setUsername(session?.user?.email ?? null);
      fetchUserRole(session?.user?.id);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signup = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { error };
  };

  const logout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();

      // Reset auth state synchronously
      setIsLoggedIn(false);
      setUser(null);
      setSession(null);
      setUsername(null);
      setRole(null);

      return { error };
    } catch (error: any) {
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { error };
    } catch (error: any) {
      return { error };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      return { error };
    } catch (error: any) {
      return { error };
    }
  };

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      username,
      user,
      session,
      role,
      login,
      signup,
      logout,
      resetPassword,
      updatePassword,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
