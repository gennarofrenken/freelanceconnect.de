"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error(error);
    }
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 py-16 text-center">
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-warning-50 text-warning-700 ring-1 ring-warning-100">
        <AlertTriangle className="h-6 w-6" aria-hidden />
      </span>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
        Etwas ist schiefgelaufen
      </h1>
      <p className="mt-3 max-w-md text-sm text-ink-500">
        Wir konnten die Seite nicht laden. Bitte versuchen Sie es erneut — wenn
        das Problem bestehen bleibt, kontaktieren Sie unseren Support.
      </p>
      {error.digest && (
        <p className="mt-2 font-mono text-[11px] text-ink-400">
          Referenz: {error.digest}
        </p>
      )}
      <div className="mt-8 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-700 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-800"
        >
          <RefreshCw className="h-4 w-4" aria-hidden />
          Erneut versuchen
        </button>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-ink-200 bg-white px-5 py-2.5 text-sm font-medium text-ink-800 transition-colors hover:border-brand-300 hover:text-brand-700"
        >
          <Home className="h-4 w-4" aria-hidden />
          Zur Startseite
        </Link>
      </div>
    </div>
  );
}
