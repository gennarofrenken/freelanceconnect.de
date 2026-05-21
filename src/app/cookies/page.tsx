import type { Metadata } from "next";
import Link from "next/link";
import { CookieSettings } from "./CookieSettings";

export const metadata: Metadata = {
  title: "Cookie-Einstellungen",
  description:
    "Verwalten Sie Ihre Cookie-Präferenzen für FreelanceConnect. Sie können Ihre Zustimmung jederzeit anpassen oder widerrufen.",
};

export default function CookiesPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <header className="border-b border-ink-200 pb-6">
        <p className="text-sm font-medium uppercase tracking-wider text-brand-700">
          Cookies
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
          Cookie-Einstellungen
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-600">
          Wir verwenden Cookies und vergleichbare Technologien nur dort, wo dies
          für den Betrieb der Plattform notwendig ist oder Sie ausdrücklich
          eingewilligt haben. Sie können Ihre Einwilligung jederzeit anpassen
          oder widerrufen.
        </p>
      </header>

      <CookieSettings />

      <section className="prose prose-slate mt-12 max-w-none text-ink-700">
        <h2 className="text-xl font-semibold text-ink-900">
          Welche Cookies setzen wir ein?
        </h2>
        <p>
          Eine vollständige Übersicht der einzelnen Cookies, deren Zweck,
          Speicherdauer und Empfänger finden Sie in unseren{" "}
          <Link
            href="/datenschutz"
            className="text-brand-700 underline-offset-2 hover:underline"
          >
            Datenschutzhinweisen
          </Link>
          .
        </p>

        <h2 className="mt-8 text-xl font-semibold text-ink-900">
          Welche Rechte habe ich?
        </h2>
        <p>
          Sie haben das Recht auf Auskunft, Berichtigung, Löschung,
          Einschränkung der Verarbeitung sowie Datenübertragbarkeit. Sie können
          eine erteilte Einwilligung jederzeit mit Wirkung für die Zukunft
          widerrufen — ohne Angabe von Gründen. Hierfür genügt eine Nachricht
          an{" "}
          <a
            href="mailto:datenschutz@freelanceconnect.de"
            className="text-brand-700 underline-offset-2 hover:underline"
          >
            datenschutz@freelanceconnect.de
          </a>
          .
        </p>
      </section>
    </article>
  );
}
