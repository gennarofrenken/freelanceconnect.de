"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";

interface Props {
  label: string;
  className?: string;
}

/**
 * Startet einen Stripe-Checkout für Connect Pro.
 * - Eingeloggte Freelancer → POST /api/stripe/checkout → Stripe Redirect
 * - Sonst → /register?role=freelancer&plan=pro
 */
export function UpgradeButton({ label, className }: Props) {
  const router = useRouter();
  const { user, isSupabase } = useAuth();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onClick() {
    setError(null);

    if (!isSupabase) {
      router.push("/register?role=freelancer&plan=pro");
      return;
    }
    if (!user) {
      router.push("/register?role=freelancer&plan=pro");
      return;
    }
    if (user.role !== "freelancer") {
      setError("Connect Pro ist nur für Freelancer-Konten verfügbar.");
      return;
    }

    setPending(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error ?? "Checkout konnte nicht gestartet werden.");
        setPending(false);
        return;
      }
      window.location.href = data.url;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unbekannter Fehler";
      setError(message);
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col items-stretch gap-2">
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        className={
          className ??
          "inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-brand-700 disabled:opacity-50"
        }
      >
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Weiterleitung zu Stripe …
          </>
        ) : (
          <>
            {label}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </>
        )}
      </button>
      {error && (
        <p role="alert" className="text-xs text-warning-700">
          {error}
        </p>
      )}
    </div>
  );
}
