import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AssistentEditor } from "./AssistentEditor";

export const metadata: Metadata = {
  title: "Admin · KI-Assistent",
  description: "Antwortregeln für den KI-Assistenten verwalten",
  robots: { index: false, follow: false },
};

export default function AdminAssistentPage() {
  return (
    <div className="bg-ink-50/40">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:py-14">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-brand-700"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Zurück zur Admin-Übersicht
        </Link>

        <header className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
            KI-Assistent
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
            Antwortregeln verwalten
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-600">
            Der Assistent gleicht Nutzereingaben mit Ihren Schlagwörtern ab und
            spielt die passende Antwort aus. Mehrere Treffer werden nach
            Übereinstimmungsdichte sortiert — gewinnt die Regel mit der
            stärksten Keyword-Überdeckung.
          </p>
        </header>

        <AssistentEditor />
      </div>
    </div>
  );
}
