"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "freelanceconnect:cookie-consent:v1";

interface StoredConsent {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  decidedAt?: string;
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setVisible(true);
        return;
      }
      const parsed = JSON.parse(raw) as Partial<StoredConsent>;
      if (!parsed.decidedAt) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function persist(consent: StoredConsent) {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...consent, decidedAt: new Date().toISOString() }),
      );
    } catch {
      // Ignore quota / privacy mode errors
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie-Einstellungen"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-ink-200 bg-white/95 backdrop-blur"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:gap-6 sm:px-6 lg:px-8">
        <p className="flex-1 text-sm leading-relaxed text-ink-600">
          Wir verwenden technisch notwendige Cookies. Optionale Cookies setzen
          wir nur mit Ihrer Zustimmung — anpassbar in den{" "}
          <Link
            href="/cookies"
            className="font-medium text-brand-600 underline-offset-2 hover:underline"
          >
            Cookie-Einstellungen
          </Link>
          .
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() =>
              persist({ necessary: true, analytics: false, marketing: false })
            }
            className="inline-flex h-9 items-center justify-center rounded-lg px-4 text-sm font-medium text-ink-600 hover:text-brand-700"
          >
            Nur notwendige
          </button>
          <button
            type="button"
            onClick={() =>
              persist({ necessary: true, analytics: true, marketing: true })
            }
            className="inline-flex h-9 items-center justify-center rounded-lg bg-brand-600 px-4 text-sm font-medium text-white transition-colors hover:bg-brand-700"
          >
            Akzeptieren
          </button>
        </div>
      </div>
    </div>
  );
}
