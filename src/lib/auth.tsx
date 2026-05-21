"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type UserRole = "guest" | "freelancer" | "recruiter";

export interface AuthUser {
  id: string;
  role: UserRole;
  fullName: string;
  email: string;
  /** Freelancer: aktives Premium-Abo erforderlich für Bewerbungen */
  hasFreelancerPremium?: boolean;
  /** Recruiter: AÜG-/Vermittlungslizenz nach Verifikation */
  hasRecruiterLicense?: boolean;
  /** Firma verifiziert (Handelsregister, USt-IdNr, etc.) */
  companyVerified?: boolean;
}

export interface AuthState {
  user: AuthUser | null;
  loginAs: (role: UserRole) => void;
  logout: () => void;
  setFlag: (
    key: "hasFreelancerPremium" | "hasRecruiterLicense",
    value: boolean,
  ) => void;
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

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw) as AuthUser);
    } catch {
      // ignore
    }
  }, []);

  const persist = useCallback((next: AuthUser | null) => {
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
      if (role === "guest") {
        persist(null);
        return;
      }
      persist(DEMO_USERS[role]);
    },
    [persist],
  );

  const logout = useCallback(() => persist(null), [persist]);

  const setFlag = useCallback(
    (
      key: "hasFreelancerPremium" | "hasRecruiterLicense",
      value: boolean,
    ) => {
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

  return (
    <AuthContext.Provider value={{ user, loginAs, logout, setFlag }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    return {
      user: null,
      loginAs: () => undefined,
      logout: () => undefined,
      setFlag: () => undefined,
    } satisfies AuthState;
  }
  return ctx;
}

export function maskCompany(company: string) {
  if (!company) return "";
  const first = company.split(/\s+/)[0];
  return `${first[0] ?? "•"}••• (für Mitglieder sichtbar)`;
}

/**
 * Freelancer-Identität nur für lizenzierte Recruiter im Klartext.
 * Alle anderen sehen Initialen-Abkürzung — DSGVO-konform.
 */
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
