import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export interface Profile {
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
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const KNOWN_ADMIN_EMAILS = [
  "sk6945104@gmail.com",
  "inventivequeen@gmail.com",
  "hello@inventivequeen.com",
  "admin@inventivequeen.com",
];

export function checkIsAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const cleanEmail = email.trim().toLowerCase();
  const envAdmins = (
    (typeof process !== "undefined" && (process.env?.["VITE_ADMIN_EMAILS"] || process.env?.["ADMIN_EMAILS"])) ||
    (import.meta as any).env?.VITE_ADMIN_EMAILS ||
    ""
  )
    .split(",")
    .map((e: string) => e.trim().toLowerCase())
    .filter(Boolean);

  return KNOWN_ADMIN_EMAILS.includes(cleanEmail) || envAdmins.includes(cleanEmail);
}

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

    try {
      const [{ data: profileData }, { data: adminData }] = await Promise.all([
        supabase.from("profiles").select("id,email,full_name,phone").eq("id", user.id).maybeSingle(),
        supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle(),
      ]);

      setProfile(profileData ?? null);

      const userEmail = user.email?.toLowerCase();
      const isEmailVerified = Boolean(
        user.email_confirmed_at ||
        (user as any).confirmed_at ||
        user.app_metadata?.['provider'] === "google"
      );
      const isEmailAdmin = isEmailVerified && checkIsAdminEmail(userEmail);
      const isMetadataAdmin =
        user.app_metadata?.['role'] === "admin" ||
        user.user_metadata?.['role'] === "admin" ||
        user.user_metadata?.['is_admin'] === true;

      setIsAdmin(Boolean(adminData) || isEmailAdmin || isMetadataAdmin);
    } catch {
      // Fallback in case of network or RLS delay
      const userEmail = user.email?.toLowerCase();
      const isEmailVerified = Boolean(
        user.email_confirmed_at ||
        (user as any).confirmed_at ||
        user.app_metadata?.['provider'] === "google"
      );
      const isEmailAdmin = isEmailVerified && checkIsAdminEmail(userEmail);
      const isMetadataAdmin =
        user.app_metadata?.['role'] === "admin" ||
        user.user_metadata?.['role'] === "admin" ||
        user.user_metadata?.['is_admin'] === true;
      setIsAdmin(isEmailAdmin || isMetadataAdmin);
    }
  }, [user]);

  useEffect(() => {
    let mounted = true;

    if (!isSupabaseConfigured || typeof window === "undefined") {
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

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
    setIsAdmin(false);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user,
      profile,
      isAdmin,
      loading,
      refreshUserData,
      signOut,
    }),
    [session, user, profile, isAdmin, loading, refreshUserData, signOut]
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
