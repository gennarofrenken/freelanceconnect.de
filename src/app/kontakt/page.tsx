import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { KontaktForm } from "./KontaktForm";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Sie haben Fragen zu FreelanceConnect, möchten Partner werden oder Presse-Kontakt aufnehmen? Wir antworten i. d. R. innerhalb eines Werktags.",
};

export default function KontaktPage() {
  return (
    <div className="bg-ink-50/40">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        <header className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
            Kontakt
          </p>
          <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
            Wir freuen uns von Ihnen zu hören
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-600">
            Schreiben Sie uns über das Formular oder direkt an die untenstehenden
            Kontaktwege. Wir antworten i. d. R. innerhalb eines Werktags.
          </p>
        </header>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_22rem]">
          <KontaktForm />

          <aside className="space-y-5">
            <div className="rounded-2xl border border-ink-200 bg-white p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-500">
                Geschäftsstelle
              </h2>
              <ul className="mt-4 space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <Mail
                    className="mt-0.5 h-4 w-4 shrink-0 text-ink-400"
                    aria-hidden
                  />
                  <a
                    href="mailto:kontakt@freelanceconnect.de"
                    className="text-brand-700 underline-offset-2 hover:underline"
                  >
                    kontakt@freelanceconnect.de
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Phone
                    className="mt-0.5 h-4 w-4 shrink-0 text-ink-400"
                    aria-hidden
                  />
                  <span className="text-ink-700">+49 (0)30 0000 0000</span>
                </li>
                <li className="flex items-start gap-3 text-ink-700">
                  <MapPin
                    className="mt-0.5 h-4 w-4 shrink-0 text-ink-400"
                    aria-hidden
                  />
                  <span>
                    FreelanceConnect GmbH
                    <br />
                    Musterallee 1
                    <br />
                    10115 Berlin
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-ink-200 bg-white p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-500">
                Fachliche Ansprechpartner
              </h2>
              <ul className="mt-4 space-y-3 text-sm text-ink-700">
                <li>
                  <span className="block text-xs uppercase tracking-wider text-ink-500">
                    Presse &amp; Medien
                  </span>
                  <a
                    href="mailto:presse@freelanceconnect.de"
                    className="text-brand-700 underline-offset-2 hover:underline"
                  >
                    presse@freelanceconnect.de
                  </a>
                </li>
                <li>
                  <span className="block text-xs uppercase tracking-wider text-ink-500">
                    Datenschutz
                  </span>
                  <a
                    href="mailto:datenschutz@freelanceconnect.de"
                    className="text-brand-700 underline-offset-2 hover:underline"
                  >
                    datenschutz@freelanceconnect.de
                  </a>
                </li>
                <li>
                  <span className="block text-xs uppercase tracking-wider text-ink-500">
                    Karriere
                  </span>
                  <a
                    href="mailto:karriere@freelanceconnect.de"
                    className="text-brand-700 underline-offset-2 hover:underline"
                  >
                    karriere@freelanceconnect.de
                  </a>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
