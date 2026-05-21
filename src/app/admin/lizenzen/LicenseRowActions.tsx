"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { setLicenseStatusAction } from "@/lib/actions/admin-licenses";
import type { LicenseStatus } from "@/lib/actions/admin-licenses";

export function LicenseRowActions({
  licenseId,
  status,
}: {
  licenseId: string;
  status: LicenseStatus;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function update(next: LicenseStatus) {
    setError(null);
    startTransition(async () => {
      const result = await setLicenseStatusAction(licenseId, next);
      if (!result.ok) setError(result.error ?? "Fehler");
    });
  }

  return (
    <div className="flex shrink-0 flex-col items-end gap-2">
      <div className="flex gap-2">
        {status !== "active" && (
          <button
            type="button"
            disabled={pending}
            onClick={() => update("active")}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-success-500 px-3 text-xs font-semibold text-white transition-colors hover:bg-success-600 disabled:opacity-50"
          >
            {pending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
            ) : (
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
            )}
            Freischalten
          </button>
        )}
        {status === "active" && (
          <button
            type="button"
            disabled={pending}
            onClick={() => update("revoked")}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-warning-100 bg-warning-50 px-3 text-xs font-semibold text-warning-700 transition-colors hover:border-warning-500 disabled:opacity-50"
          >
            {pending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
            ) : (
              <XCircle className="h-3.5 w-3.5" aria-hidden />
            )}
            Widerrufen
          </button>
        )}
      </div>
      {error && (
        <p className="text-xs text-warning-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
