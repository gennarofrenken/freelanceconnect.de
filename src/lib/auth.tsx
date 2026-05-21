"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getSupabaseBrowserClient } from "./supabase/client";
import { isSupabaseConfigured } from "./supabase/env";

export type UserRole = "guest" | "freelancer" | "recruiter";

export interface AuthUser {
  id: string;
  role: UserRole;
  fullName: string;
  email: string;
  hasFreelancerPremium?: boolean;
  hasRecruiterLicense?: boolean;
  companyVerified?: boolean;
}

export interface SignUpInput {
  email: string;
  password: string;
  role: Exclude<UserRole, "guest">;
  fullName: string;
  companyName?: string;
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  /** true wenn die App mit echter Supabase-Auth läuft (sonst Mock). */
  isSupabase: boolean;
  /** Demo-Role-Switcher (nur Mock-Mode). Im Supabase-Mode No-Op. */
  loginAs: (role: UserRole) => void;
  /** Echtes Logout — funktioniert in beiden Modi. */
  logout: () => Promise<void>;
  /** Demo-Flag-Switch (nur Mock). Im Supabase-Mode No-Op. */
  setFlag: (
    key: "hasFreelancerPremium" | "hasRecruiterLicense",
    value: boolean,
  ) => void;
  /** Echte Anmeldung — nur im Supabase-Mode. */
  signInWithPassword: (
    email: string,
    password: string,
  ) => Promise<{ error?: string }>;
  /** Echte Registrierung — nur im Supabase-Mode. */
  signUp: (
    input: SignUpInput,
  ) => Promise<{ error?: string; needsEmailConfirmation?: boolean }>;
}

const STORAGE_KEY = "freelanceconnect:auth:v1";

const DEMO_USERS: Record<Exclude<UserRole, "guest">, AuthUser> = {
  freelancer: {
    id: "demo-freelancer",
    role: "freelancer",
    fullName: "Demo Freelancer",
    email: "demo.freelancer@example.com",
    hasFreelancerPremium: false,
  },
  recruiter: {
    id: "demo-recruiter",
    role: "recruiter",
    fullName: "Demo Recruiter",
    email: "demo.recruiter@nordstern-banking.example",
    hasRecruiterLicense: false,
    companyVerified: true,
  },
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // ──────── Supabase-Mode ────────
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    let cancelled = false;

    async function loadProfile(uid: string) {
      const { data, error } = await supabase!
        .from("profiles")
        .select(
          "id, role, full_name, email, has_freelancer_premium, has_recruiter_license, company_verified",
        )
        .eq("id", uid)
        .maybeSingle();
      if (cancelled) return;
      if (error || !data) {
        setUser(null);
        return;
      }
      setUser({
        id: data.id as string,
        role: data.role as UserRole,
        fullName: (data.full_name as string) ?? "",
        email: (data.email as string) ?? "",
        hasFreelancerPremium: !!data.has_freelancer_premium,
        hasRecruiterLicense: !!data.has_recruiter_license,
        companyVerified: !!data.company_verified,
      });
    }

    supabase.auth.getSession().then((res: { data: { session: { user: { id: string } } | null } }) => {
      if (cancelled) return;
      const u = res.data.session?.user;
      if (u) void loadProfile(u.id);
      else setUser(null);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event: string, session: { user: { id: string } } | null) => {
        if (session?.user) void loadProfile(session.user.id);
        else setUser(null);
      },
    );

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  // ──────── Mock-Mode (kein Supabase konfiguriert) ────────
  useEffect(() => {
    if (isSupabaseConfigured) return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw) as AuthUser);
    } catch {
      // ignore
    }
    setLoading(false);
  }, []);

  const persistMock = useCallback((next: AuthUser | null) => {
    if (isSupabaseConfigured) return;
    setUser(next);
    try {
      if (next) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // ignore
    }
  }, []);

  const loginAs = useCallback(
    (role: UserRole) => {
      if (isSupabaseConfigured) return; // Echte Auth → kein Mock-Switch
      if (role === "guest") {
        persistMock(null);
        return;
      }
      persistMock(DEMO_USERS[role]);
    },
    [persistMock],
  );

  const logout = useCallback(async () => {
    if (isSupabaseConfigured) {
      const supabase = getSupabaseBrowserClient();
      await supabase?.auth.signOut();
      setUser(null);
      return;
    }
    persistMock(null);
  }, [persistMock]);

  const setFlag = useCallback(
    (
      key: "hasFreelancerPremium" | "hasRecruiterLicense",
      value: boolean,
    ) => {
      if (isSupabaseConfigured) return; // server-seitig verwaltet
      setUser((prev) => {
        if (!prev) return prev;
        const next = { ...prev, [key]: value };
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    },
    [],
  );

  const signInWithPassword = useCallback(
    async (email: string, password: string) => {
      if (!isSupabaseConfigured) {
        return { error: "Backend ist noch nicht konfiguriert (Supabase-ENV fehlt). Nutze den Demo-Rollen-Switcher unten links." };
      }
      const supabase = getSupabaseBrowserClient();
      if (!supabase) return { error: "Supabase-Client nicht verfügbar." };
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return error ? { error: error.message } : {};
    },
    [],
  );

  const signUp = useCallback(async (input: SignUpInput) => {
    if (!isSupabaseConfigured) {
      return { error: "Backend ist noch nicht konfiguriert (Supabase-ENV fehlt). Nutze den Demo-Rollen-Switcher unten links." };
    }
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return { error: "Supabase-Client nicht verfügbar." };
    const { data, error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          full_name: input.fullName,
          role: input.role,
          company_name: input.companyName ?? null,
        },
        emailRedirectTo: `${window.location.origin}/login?confirmed=1`,
      },
    });
    if (error) return { error: error.message };
    const needsEmailConfirmation = !data.session && !!data.user;
    return { needsEmailConfirmation };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isSupabase: isSupabaseConfigured,
        loginAs,
        logout,
        setFlag,
        signInWithPassword,
        signUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    return {
      user: null,
      loading: false,
      isSupabase: false,
      loginAs: () => undefined,
      logout: async () => undefined,
      setFlag: () => undefined,
      signInWithPassword: async () => ({ error: "AuthProvider fehlt." }),
      signUp: async () => ({ error: "AuthProvider fehlt.", needsEmailConfirmation: false }),
    } satisfies AuthState;
  }
  return ctx;
}

export function maskCompany(company: string) {
  if (!company) return "";
  const first = company.split(/\s+/)[0];
  return `${first[0] ?? "•"}••• (für Mitglieder sichtbar)`;
}

export function maskFreelancerName(fullName: string) {
  if (!fullName) return "";
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return `${parts[0][0]}.`;
  const first = parts[0][0];
  const last = parts[parts.length - 1][0];
  return `${first}. ${last}.`;
}

/* ─────────────────── Permission-Helpers ─────────────────── */

export function canViewProjectClient(user: AuthUser | null): boolean {
  return user !== null;
}

export function canApplyToProjects(user: AuthUser | null): boolean {
  return user?.role === "freelancer" && user.hasFreelancerPremium === true;
}

export function canContactFreelancer(user: AuthUser | null): boolean {
  return (
    user?.role === "recruiter" &&
    user.hasRecruiterLicense === true &&
    user.companyVerified === true
  );
}

export function canViewFreelancerIdentity(user: AuthUser | null): boolean {
  return canContactFreelancer(user);
}

export function canDownloadFreelancerProfile(user: AuthUser | null): boolean {
  return canContactFreelancer(user);
}
