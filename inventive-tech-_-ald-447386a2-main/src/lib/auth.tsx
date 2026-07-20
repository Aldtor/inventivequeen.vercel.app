import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
}

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean;
  loading: boolean;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const user = session?.user ?? null;

  const refreshUserData = useCallback(async () => {
    if (!isSupabaseConfigured || !user) {
      setProfile(null);
      setIsAdmin(false);
      return;
    }

    const [{ data: profileData }, { data: adminData }] = await Promise.all([
      supabase.from("profiles").select("id,email,full_name,phone").eq("id", user.id).maybeSingle(),
      supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle(),
    ]);

    setProfile(profileData ?? null);
    setIsAdmin(Boolean(adminData));
  }, [user]);

  useEffect(() => {
    let mounted = true;

    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    refreshUserData();
  }, [refreshUserData]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user,
      profile,
      isAdmin,
      loading,
      refreshUserData,
    }),
    [session, user, profile, isAdmin, loading, refreshUserData]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return value;
}
