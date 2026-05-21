"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import {
  CONSENT_EVENT,
  CONSENT_KEY,
  readConsent,
  type ConsentState,
} from "@/lib/consent";

export function ConsentAnalytics() {
  const [consent, setConsent] = useState<ConsentState | null>(null);

  useEffect(() => {
    setConsent(readConsent());

    function onChange(e: Event) {
      const detail = (e as CustomEvent<ConsentState>).detail;
      if (detail) setConsent(detail);
      else setConsent(readConsent());
    }
    function onStorage(e: StorageEvent) {
      if (e.key === CONSENT_KEY) setConsent(readConsent());
    }

    window.addEventListener(CONSENT_EVENT, onChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(CONSENT_EVENT, onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  if (!consent?.analytics) return null;

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
