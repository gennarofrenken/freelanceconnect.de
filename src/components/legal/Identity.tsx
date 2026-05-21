"use client";

import { Lock } from "lucide-react";
import {
  canViewFreelancerIdentity,
  canViewProjectClient,
  maskCompany,
  maskFreelancerName,
  useAuth,
} from "@/lib/auth";

/**
 * Zeigt vollen Namen NUR für lizenzierte Recruiter, sonst Initial-Maske.
 * Auf der Server-Seite (vor Hydration) wird die Maske gerendert — DSGVO-konform
 * auch im initialen HTML.
 */
export function IdentityName({
  fullName,
  className,
}: {
  fullName: string;
  className?: string;
}) {
  const { user } = useAuth();
  const reveal = canViewFreelancerIdentity(user);
  return (
    <span className={className}>
      {!reveal && (
        <Lock
          className="mr-1 inline h-3.5 w-3.5 align-text-bottom text-ink-400"
          aria-hidden
        />
      )}
      {reveal ? fullName : maskFreelancerName(fullName)}
    </span>
  );
}

/**
 * Zeigt feinen Standort (Stadt + PLZ) nur für lizenzierte Recruiter,
 * sonst nur die Region.
 */
export function IdentityLocation({
  location,
  region,
  className,
}: {
  location: string;
  region?: string;
  className?: string;
}) {
  const { user } = useAuth();
  const reveal = canViewFreelancerIdentity(user);
  return (
    <span className={className}>
      {reveal ? location : region ?? "DACH-Region"}
    </span>
  );
}

/**
 * Firmenname auf Projektseiten. Gäste sehen die Maskierung,
 * eingeloggte Mitglieder (egal welche Rolle) sehen den Klartext.
 */
export function CompanyName({
  company,
  className,
}: {
  company: string;
  className?: string;
}) {
  const { user } = useAuth();
  const reveal = canViewProjectClient(user);
  return (
    <span className={className}>
      {!reveal && (
        <Lock
          className="mr-1 inline h-3.5 w-3.5 align-text-bottom text-ink-400"
          aria-hidden
        />
      )}
      {reveal ? company : maskCompany(company)}
    </span>
  );
}

/**
 * DSGVO-Hinweis-Banner für Profil-Detail-Seiten — sichtbar, wenn der aktuelle
 * Betrachter KEIN lizenzierter Recruiter ist.
 */
export function IdentityNotice() {
  const { user } = useAuth();
  if (canViewFreelancerIdentity(user)) return null;
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-brand-100 bg-brand-50/60 p-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-brand-700 ring-1 ring-brand-100">
        <Lock className="h-4 w-4" aria-hidden />
      </span>
      <div className="min-w-0 text-sm">
        <p className="font-semibold tracking-tight text-ink-900">
          Profildaten DSGVO-geschützt
        </p>
        <p className="mt-1 text-xs leading-relaxed text-ink-600">
          Vollständiger Name, exakter Standort und Profil-Download sind nur für
          verifizierte und lizenzierte Recruiter sichtbar. Jeder Zugriff wird
          protokolliert.{" "}
          <a
            href="/recruiter/lizenz"
            className="font-medium text-brand-700 underline-offset-2 hover:underline"
          >
            Lizenz beantragen
          </a>
        </p>
      </div>
    </div>
  );
}
