import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Allgemeine Geschäftsbedingungen",
  description:
    "Allgemeine Geschäftsbedingungen (AGB) für die Nutzung der FreelanceConnect-Plattform.",
  robots: { index: true, follow: true },
};

export default function AGBPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <header className="border-b border-ink-200 pb-6">
        <p className="text-sm font-medium uppercase tracking-wider text-brand-700">
          Rechtliches
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
          Allgemeine Geschäftsbedingungen
        </h1>
        <p className="mt-3 text-sm text-ink-500">Stand: 21. Mai 2026</p>
      </header>

      <section className="mt-8 space-y-8 text-ink-700">
        <div>
          <h2 className="text-xl font-semibold text-ink-900">
            § 1 Geltungsbereich
          </h2>
          <p className="mt-2 leading-relaxed">
            Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für die Nutzung
            der Online-Plattform FreelanceConnect (nachfolgend „Plattform“)
            durch Unternehmen (nachfolgend „Auftraggeber“) und Selbständige
            (nachfolgend „Freelancer“). Mit der Registrierung erkennt der
            Nutzer diese AGB an.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-ink-900">
            § 2 Leistungsbeschreibung
          </h2>
          <p className="mt-2 leading-relaxed">
            FreelanceConnect stellt eine technische Infrastruktur bereit, über
            die Auftraggeber Projektausschreibungen veröffentlichen und
            Freelancer ihre Leistungen anbieten können. Die Plattform wird
            ausschließlich als Vermittlungsplattform tätig; Verträge über die zu
            erbringenden Leistungen kommen ausschließlich zwischen Auftraggeber
            und Freelancer zustande.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-ink-900">
            § 3 Registrierung und Nutzerkonto
          </h2>
          <p className="mt-2 leading-relaxed">
            Die Nutzung der Plattform setzt eine Registrierung voraus. Der
            Nutzer ist verpflichtet, wahrheitsgemäße und vollständige Angaben zu
            machen und Änderungen unverzüglich zu aktualisieren. Zugangsdaten
            sind vertraulich zu behandeln.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-ink-900">
            § 4 Pflichten der Nutzer
          </h2>
          <p className="mt-2 leading-relaxed">
            Nutzer verpflichten sich, geltendes Recht einzuhalten und keine
            Inhalte einzustellen, die Rechte Dritter verletzen oder gegen
            gesetzliche Verbote verstoßen. Wir behalten uns vor, Inhalte, die
            gegen diese Regeln verstoßen, zu entfernen und Nutzerkonten zu
            sperren.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-ink-900">
            § 5 Vergütung
          </h2>
          <p className="mt-2 leading-relaxed">
            Die Veröffentlichung von Projektausschreibungen und das Empfangen
            von Anfragen ist auf der Plattform vermittlungsgebührenfrei.
            FreelanceConnect erhebt zu keinem Zeitpunkt eine Provision auf das
            Honorar zwischen Freelancer und Auftraggeber.
          </p>
          <p className="mt-3 leading-relaxed">
            <strong>Connect Pro (Freelancer):</strong> Initiativ-Bewerbungen auf
            Projektausschreibungen setzen das kostenpflichtige
            Connect-Pro-Abonnement (19,00 € / Monat zzgl. USt.) voraus. Das
            Abonnement ist monatlich zum Monatsende kündbar.
          </p>
          <p className="mt-3 leading-relaxed">
            <strong>Recruiter-Lizenz (Unternehmen):</strong> Die Anzeige
            vollständiger Freelancer-Profile, der Profil-Download und die
            Direktkontaktaufnahme erfordern den Abschluss eines individuellen
            Recruiter-Lizenzvertrages einschließlich
            Auftragsverarbeitungsvertrag (AVV) nach Art. 28 DSGVO. Konditionen
            werden im Lizenzvertrag geregelt.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-ink-900">
            § 6 Haftungsbeschränkung
          </h2>
          <p className="mt-2 leading-relaxed">
            FreelanceConnect haftet unbeschränkt nur für Vorsatz und grobe
            Fahrlässigkeit. Bei leichter Fahrlässigkeit haftet die Plattform nur
            bei Verletzung wesentlicher Vertragspflichten und nur in Höhe des
            vorhersehbaren, vertragstypischen Schadens. Eine Haftung für Inhalte
            Dritter ist ausgeschlossen, soweit gesetzlich zulässig.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-ink-900">
            § 7 Kündigung
          </h2>
          <p className="mt-2 leading-relaxed">
            Beide Parteien können das Nutzungsverhältnis jederzeit ordentlich
            kündigen. Das Recht zur außerordentlichen Kündigung aus wichtigem
            Grund bleibt unberührt.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-ink-900">
            § 8 Schlussbestimmungen
          </h2>
          <p className="mt-2 leading-relaxed">
            Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts. Sollten
            einzelne Bestimmungen dieser AGB unwirksam sein, bleibt die
            Wirksamkeit der übrigen Bestimmungen unberührt.
          </p>
        </div>
      </section>

      <footer className="mt-12 border-t border-ink-200 pt-6 text-sm text-ink-500">
        <p>
          Hinweis: Die hier dargestellten AGB sind ein Muster und vor dem
          öffentlichen Betrieb durch rechtsverbindliche Vertragsdokumente zu
          ersetzen.
        </p>
        <p className="mt-2">
          Siehe auch:{" "}
          <Link
            href="/impressum"
            className="text-brand-700 underline-offset-2 hover:underline"
          >
            Impressum
          </Link>{" "}
          ·{" "}
          <Link
            href="/datenschutz"
            className="text-brand-700 underline-offset-2 hover:underline"
          >
            Datenschutzerklärung
          </Link>
        </p>
      </footer>
    </article>
  );
}
