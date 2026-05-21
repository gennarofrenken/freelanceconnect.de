import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MessageSquareText, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin",
  description: "Verwaltung der FreelanceConnect-Plattform",
  robots: { index: false, follow: false },
};

const SECTIONS = [
  {
    href: "/admin/assistent",
    icon: MessageSquareText,
    title: "KI-Assistent",
    description:
      "Antwortregeln für das Chat-Widget verwalten: Schlagwörter, Antworten, Links und Folgefragen.",
  },
];

export default function AdminPage() {
  return (
    <div className="bg-ink-50/40">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:py-16">
        <header className="flex items-start justify-between gap-4 border-b border-ink-200 pb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
              Admin
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
              Plattform-Verwaltung
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-600">
              Konfigurationsoberfläche für interne Inhalte. In der Mock-Phase
              werden alle Daten lokal im Browser (LocalStorage) abgelegt — ohne
              Server-Persistenz.
            </p>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-warning-50 px-3 py-1 text-xs font-medium text-warning-700 ring-1 ring-inset ring-warning-100">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
            Demo-Modus
          </span>
        </header>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {SECTIONS.map((s) => (
            <li key={s.href}>
              <Link
                href={s.href}
                className="group flex h-full flex-col rounded-2xl border border-ink-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-elevated"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                  <s.icon className="h-5 w-5" aria-hidden />
                </span>
                <h2 className="mt-4 text-base font-semibold tracking-tight text-ink-900 group-hover:text-brand-700">
                  {s.title}
                </h2>
                <p className="mt-1 flex-1 text-sm leading-relaxed text-ink-600">
                  {s.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-600 group-hover:text-brand-700">
                  Öffnen
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
