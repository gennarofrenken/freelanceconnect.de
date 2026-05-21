"use client";

import { useState } from "react";
import { Settings2, X } from "lucide-react";
import { useAuth, type UserRole } from "@/lib/auth";
import { cn } from "@/lib/utils";

const ROLES: { value: UserRole; label: string; note: string }[] = [
  { value: "guest", label: "Gast", note: "Nicht eingeloggt" },
  {
    value: "freelancer",
    label: "Freelancer",
    note: "Bewerben nur mit Premium",
  },
  {
    value: "recruiter",
    label: "Recruiter",
    note: "Kontakt nur mit Lizenz",
  },
];

export function DemoRoleSwitcher() {
  const { user, loginAs } = useAuth();
  const [open, setOpen] = useState(false);

  const currentRole: UserRole = user?.role ?? "guest";

  return (
    <div className="fixed left-3 bottom-3 z-50 sm:left-4 sm:bottom-4">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white/95 px-3 py-1.5 text-xs font-medium text-ink-700 shadow-soft backdrop-blur hover:border-brand-300 hover:text-brand-700"
          aria-label="Demo-Rolle wechseln"
        >
          <Settings2 className="h-3.5 w-3.5 text-brand-600" aria-hidden />
          Demo-Rolle: <span className="font-semibold text-brand-700">{ROLES.find((r) => r.value === currentRole)?.label}</span>
        </button>
      ) : (
        <div className="w-72 rounded-2xl border border-ink-200 bg-white p-4 shadow-elevated">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">
              Demo-Rolle wechseln
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-ink-500 hover:bg-ink-100"
              aria-label="Schließen"
            >
              <X className="h-3.5 w-3.5" aria-hidden />
            </button>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-ink-500">
            Nur für die Demo. Schalten Sie hier zwischen Gast, Freelancer und
            Recruiter um und sehen Sie die DSGVO-Gates in Aktion.
          </p>
          <ul className="mt-3 space-y-1.5">
            {ROLES.map((r) => {
              const active = currentRole === r.value;
              return (
                <li key={r.value}>
                  <button
                    type="button"
                    onClick={() => {
                      loginAs(r.value);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-start justify-between gap-3 rounded-lg border px-3 py-2 text-left transition-colors",
                      active
                        ? "border-brand-600 bg-brand-50"
                        : "border-ink-200 bg-white hover:border-brand-300",
                    )}
                  >
                    <div>
                      <p
                        className={cn(
                          "text-sm font-semibold tracking-tight",
                          active ? "text-brand-700" : "text-ink-900",
                        )}
                      >
                        {r.label}
                      </p>
                      <p className="text-[11px] text-ink-500">{r.note}</p>
                    </div>
                    {active && (
                      <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-700">
                        aktiv
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
