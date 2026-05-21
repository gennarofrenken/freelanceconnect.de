import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Impressum",
  description:
    "Impressum und Anbieterkennzeichnung der FreelanceConnect-Plattform gemäß § 5 TMG.",
  robots: { index: true, follow: true },
};

export default function ImpressumPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <header className="border-b border-ink-200 pb-6">
        <p className="text-sm font-medium uppercase tracking-wider text-brand-700">
          Rechtliches
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
          Impressum
        </h1>
        <p className="mt-3 text-sm text-ink-500">
          Angaben gemäß § 5 TMG sowie § 18 Abs. 2 MStV.
        </p>
      </header>

      <section className="prose prose-slate mt-8 max-w-none text-ink-700">
        <h2 className="text-xl font-semibold text-ink-900">
          Anbieter und verantwortliche Stelle
        </h2>
        <p>
          FreelanceConnect GmbH
          <br />
          Musterallee 1
          <br />
          10115 Berlin
          <br />
          Deutschland
        </p>

        <h2 className="mt-8 text-xl font-semibold text-ink-900">Vertretung</h2>
        <p>
          Vertretungsberechtigte Geschäftsführung:
          <br />
          [Vor- und Nachname Geschäftsführer:in]
        </p>

        <h2 className="mt-8 text-xl font-semibold text-ink-900">Registereintrag</h2>
        <p>
          Eintragung im Handelsregister.
          <br />
          Registergericht: Amtsgericht Berlin-Charlottenburg
          <br />
          Registernummer: HRB 000000
        </p>

        <h2 className="mt-8 text-xl font-semibold text-ink-900">Umsatzsteuer-ID</h2>
        <p>
          Umsatzsteuer-Identifikationsnummer gemäß § 27 a UStG:
          <br />
          DE000000000
        </p>

        <h2 className="mt-8 text-xl font-semibold text-ink-900">Kontakt</h2>
        <p>
          Telefon: +49 (0)30 0000 0000
          <br />
          E-Mail:{" "}
          <a
            href="mailto:kontakt@freelanceconnect.de"
            className="text-brand-700 underline-offset-2 hover:underline"
          >
            kontakt@freelanceconnect.de
          </a>
        </p>

        <h2 className="mt-8 text-xl font-semibold text-ink-900">
          Inhaltlich Verantwortlicher gemäß § 18 Abs. 2 MStV
        </h2>
        <p>
          [Vor- und Nachname]
          <br />
          Musterallee 1
          <br />
          10115 Berlin
        </p>

        <h2 className="mt-8 text-xl font-semibold text-ink-900">
          EU-Streitschlichtung
        </h2>
        <p>
          Die Europäische Kommission stellt eine Plattform zur
          Online-Streitbeilegung (OS) bereit:{" "}
          <a
            href="https://ec.europa.eu/consumers/odr/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-700 underline-offset-2 hover:underline"
          >
            https://ec.europa.eu/consumers/odr/
          </a>
          . Unsere E-Mail-Adresse finden Sie oben im Impressum.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-ink-900">
          Verbraucherstreitbeilegung
        </h2>
        <p>
          Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren
          vor einer Verbraucherschlichtungsstelle teilzunehmen.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-ink-900">Haftungshinweis</h2>
        <p>
          Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für
          die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir
          jedoch keine Gewähr übernehmen. Für die Inhalte externer Links sind
          ausschließlich deren Betreiber verantwortlich.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-ink-900">Urheberrecht</h2>
        <p>
          Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen
          Seiten unterliegen dem deutschen Urheberrecht. Vervielfältigung,
          Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der
          Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung der
          jeweiligen Autor:innen.
        </p>
      </section>

      <footer className="mt-12 border-t border-ink-200 pt-6 text-sm text-ink-500">
        <p>
          Hinweis: Dieses Impressum enthält Musterangaben und ist vor dem
          öffentlichen Betrieb durch rechtsverbindliche Angaben des Betreibers
          zu ersetzen.
        </p>
        <p className="mt-2">
          Siehe auch:{" "}
          <Link
            href="/datenschutz"
            className="text-brand-700 underline-offset-2 hover:underline"
          >
            Datenschutzerklärung
          </Link>{" "}
          ·{" "}
          <Link
            href="/agb"
            className="text-brand-700 underline-offset-2 hover:underline"
          >
            AGB
          </Link>
        </p>
      </footer>
    </article>
  );
}
