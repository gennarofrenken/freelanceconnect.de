import type { Metadata } from "next";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Seite nicht gefunden",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="bg-ink-50/40">
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-700">
          <Compass className="h-7 w-7" aria-hidden />
        </span>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
          Fehler 404
        </p>
        <h1 className="mt-2 text-balance text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
          Seite nicht gefunden
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-ink-600">
          Die angeforderte Seite existiert nicht oder wurde verschoben. Über die
          Suche finden Sie sicher das passende Projekt oder Profil.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button href="/" variant="primary" size="md">
            Zur Startseite
          </Button>
          <Button href="/search" variant="outline" size="md">
            Zur Suche
          </Button>
        </div>
      </div>
    </div>
  );
}
