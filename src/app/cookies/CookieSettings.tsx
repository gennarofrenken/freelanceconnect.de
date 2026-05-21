"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  DEFAULT_CONSENT,
  readConsent,
  writeConsent,
  type ConsentState,
} from "@/lib/consent";

const CATEGORIES: ReadonlyArray<{
  key: keyof ConsentState;
  title: string;
  required?: boolean;
  description: string;
}> = [
  {
    key: "necessary",
    title: "Technisch notwendig",
    required: true,
    description:
      "Erforderlich für Login, Sicherheits- und Komfortfunktionen. Diese Cookies können nicht deaktiviert werden.",
  },
  {
    key: "analytics",
    title: "Statistik &amp; Reichweite",
    description:
      "Anonyme Nutzungsmessung (Vercel Analytics) zur Verbesserung der Plattform — wird ausschließlich nach Ihrer Zustimmung geladen.",
  },
  {
    key: "marketing",
    title: "Marketing",
    description:
      "Werbe-Cookies (z. B. Re-Marketing). Aktuell nicht aktiv — Schalter dient der Vorab-Konfiguration.",
  },
];

export function CookieSettings() {
  const [state, setState] = useState<ConsentState>(DEFAULT_CONSENT);
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const existing = readConsent();
    if (existing) setState(existing);
  }, []);

  function update(key: keyof ConsentState, value: boolean) {
    if (key === "necessary") return;
    setState((s) => ({ ...s, [key]: value }));
    setSaved(false);
  }

  function persist(next: ConsentState) {
    const stored = writeConsent({
      analytics: next.analytics,
      marketing: next.marketing,
    });
    setState(stored);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function save() {
    persist(state);
  }

  function acceptAll() {
    persist({ necessary: true, analytics: true, marketing: true });
  }

  function rejectAll() {
    persist({ ...DEFAULT_CONSENT });
  }

  return (
    <section
      aria-busy={!mounted}
      className="mt-8 rounded-2xl border border-ink-200 bg-white p-6"
    >
      <ul className="divide-y divide-ink-100">
        {CATEGORIES.map((cat) => (
          <li
            key={cat.key}
            className="flex items-start justify-between gap-6 py-5 first:pt-0 last:pb-0"
          >
            <div>
              <h3
                className="text-sm font-semibold tracking-tight text-ink-900"
                dangerouslySetInnerHTML={{ __html: cat.title }}
              />
              <p
                className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-600"
                dangerouslySetInnerHTML={{ __html: cat.description }}
              />
            </div>
            <Toggle
              checked={Boolean(state[cat.key])}
              disabled={Boolean(cat.required)}
              onChange={(v) => update(cat.key, v)}
              label={cat.title}
            />
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-col items-stretch gap-3 border-t border-ink-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" size="md" onClick={rejectAll}>
            Alle ablehnen
          </Button>
          <Button variant="outline" size="md" onClick={save}>
            Auswahl speichern
          </Button>
          <Button variant="primary" size="md" onClick={acceptAll}>
            Alle akzeptieren
          </Button>
        </div>
        {saved && (
          <p
            className="inline-flex items-center gap-1.5 text-xs font-medium text-success-600"
            role="status"
          >
            <Check className="h-3.5 w-3.5" aria-hidden />
            Einstellungen gespeichert
          </p>
        )}
      </div>
    </section>
  );
}

function Toggle({
  checked,
  disabled,
  onChange,
  label,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
        checked ? "bg-brand-600" : "bg-ink-200"
      } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
    >
      <span
        aria-hidden
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-soft transition-transform ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
