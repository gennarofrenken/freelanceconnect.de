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

  return (
    <AuthContext.Provider value={{ user, loginAs, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    // Fail-soft for SSR/preview – act like guest
    return {
      user: null,
      loginAs: () => undefined,
      logout: () => undefined,
    } satisfies AuthState;
  }
  return ctx;
}

export function maskCompany(company: string) {
  if (!company) return "";
  const first = company.split(/\s+/)[0];
  return `${first[0] ?? "•"}••• (für Mitglieder sichtbar)`;
}
