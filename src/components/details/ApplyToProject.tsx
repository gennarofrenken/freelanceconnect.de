"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Loader2,
  Lock,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import { applyToProjectAction } from "@/lib/actions/applications";
import { useAuth } from "@/lib/auth";

interface Props {
  projectId: string;
  projectTitle: string;
}

export function ApplyToProject({ projectId, projectTitle }: Props) {
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsPremium, setNeedsPremium] = useState(false);

  if (loading) {
    return (
      <div className="rounded-2xl border border-ink-200 bg-white p-5 text-sm text-ink-500">
        Lade Bewerbungsstatus…
      </div>
    );
  }

  if (!user) {
    return (
      <Gate
        icon={Lock}
        title="Login erforderlich"
        body="Bitte registrieren Sie sich als Freelancer oder loggen Sie sich ein, um sich zu bewerben."
        primaryHref="/register?role=freelancer"
        primaryLabel="Als Freelancer registrieren"
        secondaryHref="/login"
        secondaryLabel="Login"
      />
    );
  }

  if (user.role !== "freelancer") {
    return (
      <Gate
        icon={ShieldCheck}
        title="Nur für Freelancer-Konten"
        body="Bewerbungen sind ausschließlich mit einem Freelancer-Konto möglich. Mit Ihrem Recruiter-Konto können Sie eigene Projekte einstellen."
      />
    );
  }

  if (!user.hasFreelancerPremium) {
    return (
      <Gate
        icon={Lock}
        title="Connect Pro erforderlich"
        body="Bewerbungen auf Projekte sind mit dem Premium-Abo verfügbar. Sie behalten 100 % Ihres Honorars — wir nehmen keine Vermittlungsgebühr."
        primaryHref="/preise"
        primaryLabel="Connect Pro ansehen"
      />
    );
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-success-500/30 bg-success-500/5 p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-success-600 ring-1 ring-success-500/30">
            <CheckCircle2 className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <p className="text-sm font-semibold tracking-tight text-ink-900">
              Bewerbung übermittelt
            </p>
            <p className="mt-1 text-xs leading-relaxed text-ink-600">
              Der Auftraggeber wird benachrichtigt. Sie sehen den Status in
              Ihrem Dashboard.
            </p>
            <Link
              href="/dashboard"
              className="mt-3 inline-flex h-9 items-center justify-center rounded-lg bg-brand-600 px-4 text-xs font-semibold text-white hover:bg-brand-700"
            >
              Zum Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setNeedsPremium(false);
    const form = new FormData(e.currentTarget);
    const coverLetter = String(form.get("coverLetter") ?? "").trim();
    const rateStr = String(form.get("rate") ?? "").trim();
    const rate = rateStr ? Number(rateStr) : undefined;

    setPending(true);
    const result = await applyToProjectAction({
      projectId,
      coverLetter,
      proposedRate: rate,
    });
    setPending(false);

    if (!result.ok) {
      setError(result.error);
      setNeedsPremium(!!result.needsPremium);
      return;
    }
    setDone(true);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-brand-700"
      >
        <MessageSquare className="h-4 w-4" aria-hidden />
        Jetzt bewerben
      </button>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-3 rounded-2xl border border-ink-200 bg-white p-4"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
        Bewerbung auf „{projectTitle}"
      </p>
      <label className="block text-xs font-medium text-ink-700">
        Anschreiben
        <textarea
          name="coverLetter"
          required
          rows={5}
          minLength={40}
          placeholder="Kurz: Warum passen Sie? Welche Referenzen? Wann verfügbar?"
          className="mt-1 w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-200"
        />
      </label>
      <label className="block text-xs font-medium text-ink-700">
        Ihr Wunsch-Stundensatz (€) – optional
        <input
          name="rate"
          type="number"
          inputMode="numeric"
          min={0}
          placeholder="z. B. 105"
          className="mt-1 h-10 w-full rounded-lg border border-ink-200 bg-white px-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-200"
        />
      </label>
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-warning-100 bg-warning-50 px-3 py-2 text-xs text-warning-700"
        >
          {error}
          {needsPremium && (
            <Link
              href="/preise"
              className="ml-1 font-semibold underline-offset-2 hover:underline"
            >
              Premium ansehen →
            </Link>
          )}
        </div>
      )}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="inline-flex h-10 items-center justify-center rounded-lg border border-ink-200 bg-white px-4 text-xs font-medium text-ink-700 hover:border-brand-300 hover:text-brand-700"
        >
          Abbrechen
        </button>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
        >
          {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          {pending ? "Sende…" : "Bewerbung abschicken"}
        </button>
      </div>
    </form>
  );
}

function Gate({
  icon: Icon,
  title,
  body,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: {
  icon: typeof Lock;
  title: string;
  body: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <div className="rounded-2xl border border-brand-100 bg-brand-50/60 p-5">
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
                  className="inline-flex h-9 items-center justify-center rounded-lg bg-brand-600 px-4 text-xs font-semibold text-white hover:bg-brand-700"
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
