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
  const [lastRoleFetch, setLastRoleFetch] = useState<number>(0);
  const roleCacheTimeMs = 5 * 60 * 1000; // 5 دقائق بالمللي ثانية
  const roleLocalStorageKey = "cached_user_role";

  // دالة مساعدة لإدارة دور المستخدم مع التخزين المؤقت
  const fetchUserRole = async (userId: string | undefined | null) => {
    if (!userId) {
      setRole(null);
      return;
    }

    try {
      // التحقق من وجود دور مخزن محليًا أولاً
      const cachedRoleData = localStorage.getItem(roleLocalStorageKey);
      if (cachedRoleData) {
        try {
          const { role: cachedRole, userId: cachedUserId, timestamp } = JSON.parse(cachedRoleData);
          // التأكد من أن الدور المخزن هو للمستخدم الحالي وأنه لم ينته وقته
          if (cachedUserId === userId && Date.now() - timestamp < roleCacheTimeMs) {
            setRole(cachedRole);
            return;
          }
        } catch (e) {
          console.error("خطأ في قراءة الدور المخزن محليًا:", e);
          localStorage.removeItem(roleLocalStorageKey);
        }
      }

      // التحقق من صلاحية التخزين المؤقت في الذاكرة
      const now = Date.now();
      if (role !== null && now - lastRoleFetch < roleCacheTimeMs) {
        return;
      }

      // جلب الدور من قاعدة البيانات
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

      if (error) throw error;
      
      const userRole = data?.role || "user";
      setRole(userRole);
      setLastRoleFetch(now);
      
      // تخزين الدور محليًا
      localStorage.setItem(
        roleLocalStorageKey,
        JSON.stringify({
          role: userRole,
          userId,
          timestamp: now
        })
      );
    } catch (error) {
      console.error("خطأ في جلب دور المستخدم:", error);
      setRole(null);
    }
  };

  useEffect(() => {
    // Initial setup to ensure persistent sessions
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoggedIn(!!session);
      setUsername(session?.user?.email ?? null);
      
      if (session?.user?.id) {
        fetchUserRole(session.user.id);
      } else {
        setRole(null);
        // مسح التخزين المؤقت المحلي عند تسجيل الخروج
        localStorage.removeItem(roleLocalStorageKey);
      }
      
      // Debug auth state changes
      console.log("Auth state change:", event, !!session);
    });

    // Check for existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoggedIn(!!session);
      setUsername(session?.user?.email ?? null);
      
      if (session?.user?.id) {
        fetchUserRole(session.user.id);
      } else {
        setRole(null);
      }
      
      setLoading(false);
    });

    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signup = async (email: string, password: string) => {
    try {
      // Sign up the user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // Set data needed during signup
          data: {
            email, // Include email in user metadata
          }
        }
      });

      if (error) throw error;

      // Check if we received a user object
      if (data?.user) {
        // Create a profile entry if needed (will be handled by database triggers)
        console.log("User signed up successfully:", data.user.id);
      }

      return { error: null };
    } catch (error: any) {
      console.error("Signup error:", error);
      return { error };
    }
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
      // Use the production URL for password reset
      const productionUrl = "https://asrargroup.vercel.app";

      // Determine if we're in production or development
      const baseUrl = window.location.hostname === "localhost"
        ? window.location.origin
        : productionUrl;

      // Make sure the redirectTo URL is exactly correct
      // This will only send a token for verification without auto-login
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${baseUrl}/reset-password`,
      });

      console.log("Reset password requested for:", email, "with redirect to:", `${baseUrl}/reset-password`);
      return { error };
    } catch (error: any) {
      return { error };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      // Update the password using the token from the URL
      // This does not automatically log in the user
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
