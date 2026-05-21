"use client";

import Link from "next/link";
import { Lock, MessageSquare, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth";

interface Props {
  /** "freelancer-contact" = Recruiter kontaktiert Freelancer (Lizenz nötig)
   *  "project-apply" = Freelancer bewirbt sich auf Projekt (Premium nötig) */
  scope: "freelancer-contact" | "project-apply";
  className?: string;
}

export function ContactGate({ scope, className }: Props) {
  const { user } = useAuth();

  if (!user) {
    return (
      <GateBox
        className={className}
        icon={Lock}
        title="Login erforderlich"
        body="Bitte registrieren Sie sich oder loggen Sie sich ein, um Kontakt aufzunehmen."
        primaryHref="/register"
        primaryLabel="Kostenlos registrieren"
        secondaryHref="/login"
        secondaryLabel="Login"
      />
    );
  }

  if (scope === "project-apply") {
    if (user.role !== "freelancer") {
      return (
        <GateBox
          className={className}
          icon={ShieldCheck}
          title="Nur für Freelancer-Konten"
          body="Bewerbungen sind ausschließlich mit einem Freelancer-Konto möglich."
        />
      );
    }
    if (!user.hasFreelancerPremium) {
      return (
        <GateBox
          className={className}
          icon={Lock}
          title="Premium erforderlich"
          body="Bewerbungen auf Projekte sind mit dem Premium-Abo verfügbar. Sie behalten die volle Kontrolle über Ihre Konditionen — wir behalten nichts ein."
          primaryHref="/preise"
          primaryLabel="Premium ansehen"
        />
      );
    }
    return (
      <button
        type="button"
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-brand-700"
      >
        <MessageSquare className="h-4 w-4" aria-hidden />
        Jetzt bewerben
      </button>
    );
  }

  // freelancer-contact
  if (user.role !== "recruiter") {
    return (
      <GateBox
        className={className}
        icon={ShieldCheck}
        title="Nur für Recruiter-Konten"
        body="Die Kontaktaufnahme zu Freelancer-Profilen ist Recruiter-Konten vorbehalten."
      />
    );
  }
  if (!user.hasRecruiterLicense) {
    return (
      <GateBox
        className={className}
        icon={Lock}
        title="Lizenz erforderlich"
        body="Aus DSGVO- und Compliance-Gründen können nur lizenzierte und vertraglich gebundene Recruiter Freelancer-Profile kontaktieren oder herunterladen."
        primaryHref="/recruiter/lizenz"
        primaryLabel="Lizenz beantragen"
      />
    );
  }
  return (
    <button
      type="button"
      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-brand-700"
    >
      <MessageSquare className="h-4 w-4" aria-hidden />
      Freelancer kontaktieren
    </button>
  );
}

function GateBox({
  className,
  icon: Icon,
  title,
  body,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: {
  className?: string;
  icon: typeof Lock;
  title: string;
  body: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-brand-100 bg-brand-50/60 p-5 ${className ?? ""}`}
    >
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-700 ring-1 ring-brand-100">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold tracking-tight text-ink-900">
            {title}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-ink-600">{body}</p>
          {(primaryHref || secondaryHref) && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {primaryHref && primaryLabel && (
                <Link
                  href={primaryHref}
                  className="inline-flex h-9 items-center justify-center rounded-lg bg-brand-600 px-4 text-xs font-semibold text-white transition-colors hover:bg-brand-700"
                >
                  {primaryLabel}
                </Link>
              )}
              {secondaryHref && secondaryLabel && (
                <Link
                  href={secondaryHref}
                  className="inline-flex h-9 items-center justify-center rounded-lg border border-ink-200 bg-white px-4 text-xs font-medium text-ink-700 hover:text-brand-700"
                >
                  {secondaryLabel}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
