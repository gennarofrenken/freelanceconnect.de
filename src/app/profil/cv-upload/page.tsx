import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { CvUploader } from "@/components/ai/CvUploader";

export const metadata: Metadata = {
  title: "Profil per CV-Upload",
  description:
    "Laden Sie Ihren Lebenslauf hoch — die KI extrahiert Skills, Erfahrung und Sprachen und befüllt Ihr Profil automatisch.",
};

export default function CvUploadPage() {
  return (
    <div className="bg-ink-50/40">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="text-center sm:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white px-3 py-1 text-xs font-semibold tracking-tight text-brand-700 shadow-soft">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            KI-gestützte Profilbefüllung
          </span>
          <h1 className="mt-4 text-balance text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
            Profil per CV-Upload
          </h1>
          <p className="mt-2 max-w-xl text-ink-600">
            Laden Sie Ihren Lebenslauf hoch — unsere KI erkennt Skills,
            Berufserfahrung, Sprachen und Standort und schlägt Ihnen ein
            vollständiges Profil vor. Sie prüfen, ergänzen und veröffentlichen.
          </p>
        </header>

        <div className="mt-10">
          <CvUploader />
        </div>

        <aside className="mt-10 rounded-2xl border border-brand-100 bg-brand-50/60 p-5 text-sm text-ink-700">
          <p className="font-semibold text-ink-900">
            Datenschutz auf einen Blick
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-relaxed text-ink-600">
            <li>Verarbeitung ausschließlich in der EU.</li>
            <li>
              Die hochgeladene Datei wird nach 30 Tagen automatisch gelöscht.
            </li>
            <li>
              Keine Weitergabe an Dritte. Profildaten erscheinen erst nach
              Ihrer Freigabe.
            </li>
            <li>
              Auswertung dient ausschließlich der Profilbefüllung — kein
              Marketing-Profiling.
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
