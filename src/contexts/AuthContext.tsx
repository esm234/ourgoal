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
  signInWithGoogle: () => Promise<{ error: any | null }>;
  logout: () => Promise<void>;
  loading: boolean;
  needsProfileSetup: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsProfileSetup, setNeedsProfileSetup] = useState(false);

  // Helper to fetch user profile
  const fetchUserProfile = async (userId: string | undefined | null) => {
    if (!userId) {
      setUsername(null);
      setRole(null);
      setNeedsProfileSetup(false);
      return;
    }
    const { data, error } = await supabase
      .from("profiles")
      .select("username, role")
      .eq("id", userId)
      .single();
    
    if (error) {
      console.error("Error fetching user profile:", error);
      return;
    }

    setUsername(data?.username ?? null);
    setRole(data?.role ?? null);
    setNeedsProfileSetup(!data?.username);
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchUserProfile(user.id);
    }
  };

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoggedIn(!!session);
        fetchUserProfile(session?.user?.id);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoggedIn(!!session);
      fetchUserProfile(session?.user?.id);
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

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    return { error };
  };

  const logout = async () => {
    await supabase.auth.signOut();
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
      signInWithGoogle,
      logout,
      loading,
      needsProfileSetup,
      refreshProfile
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
