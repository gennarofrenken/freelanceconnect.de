import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description:
    "Datenschutzerklärung der FreelanceConnect-Plattform nach Art. 13 DSGVO.",
  robots: { index: true, follow: true },
};

export default function DatenschutzPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <header className="border-b border-ink-200 pb-6">
        <p className="text-sm font-medium uppercase tracking-wider text-brand-700">
          Rechtliches
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
          Datenschutzerklärung
        </h1>
        <p className="mt-3 text-sm text-ink-500">
          Stand: 21. Mai 2026 · Informationen nach Art. 13 / 14 DSGVO
        </p>
      </header>

      <section className="mt-8 space-y-8 text-ink-700">
        <div>
          <h2 className="text-xl font-semibold text-ink-900">
            1. Verantwortlicher
          </h2>
          <p className="mt-2 leading-relaxed">
            Verantwortlich für die Datenverarbeitung auf dieser Website ist:
          </p>
          <p className="mt-2 leading-relaxed">
            FreelanceConnect GmbH
            <br />
            Musterallee 1, 10115 Berlin
            <br />
            E-Mail:{" "}
            <a
              href="mailto:datenschutz@freelanceconnect.de"
              className="text-brand-700 underline-offset-2 hover:underline"
            >
              datenschutz@freelanceconnect.de
            </a>
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-ink-900">
            2. Allgemeine Hinweise
          </h2>
          <p className="mt-2 leading-relaxed">
            Wir nehmen den Schutz Ihrer personenbezogenen Daten sehr ernst und
            behandeln sie vertraulich und entsprechend der gesetzlichen
            Datenschutzvorschriften (DSGVO, BDSG) sowie dieser
            Datenschutzerklärung. Die Nutzung unserer Website ist in der Regel
            ohne Angabe personenbezogener Daten möglich. Soweit auf unseren
            Seiten personenbezogene Daten erhoben werden, erfolgt dies, soweit
            möglich, stets auf freiwilliger Basis.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-ink-900">
            3. Hosting und Bereitstellung
          </h2>
          <p className="mt-2 leading-relaxed">
            Unsere Website wird bei einem Hosting-Dienstleister mit Servern in
            der Europäischen Union betrieben. Beim Aufruf werden technisch
            erforderliche Logdaten verarbeitet (anonymisierte IP-Adresse,
            Datum/Uhrzeit, abgerufene Ressource, User-Agent). Rechtsgrundlage
            ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einer
            sicheren und stabilen Bereitstellung). Die Logs werden nach
            spätestens 14 Tagen gelöscht oder anonymisiert.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-ink-900">
            4. Cookies und lokale Speicherung
          </h2>
          <p className="mt-2 leading-relaxed">
            Wir verwenden technisch notwendige Cookies und Local-Storage-Einträge
            (z. B. zur Speicherung Ihrer Cookie-Entscheidung). Rechtsgrundlage
            ist § 25 Abs. 2 Nr. 2 TDDDG sowie Art. 6 Abs. 1 lit. f DSGVO.
            Optionale Cookies, z. B. zur statistischen Reichweitenmessung,
            setzen wir ausschließlich nach Ihrer Einwilligung gemäß § 25 Abs. 1
            TDDDG und Art. 6 Abs. 1 lit. a DSGVO. Die Einwilligung kann
            jederzeit widerrufen werden.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-ink-900">
            5. Registrierung und Nutzerkonto
          </h2>
          <p className="mt-2 leading-relaxed">
            Bei der Registrierung erheben wir die für die Vertragserfüllung
            notwendigen Daten (z. B. Name, E-Mail, gewählte Rolle als
            Unternehmen oder Freelancer:in, Profildaten). Rechtsgrundlage ist
            Art. 6 Abs. 1 lit. b DSGVO (Vertrag) sowie ggf. Art. 6 Abs. 1 lit.
            f DSGVO (Plattformsicherheit). Wir verarbeiten diese Daten nur,
            soweit es zur Erbringung der Plattformleistungen erforderlich ist.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-ink-900">
            6. Profildaten und Projektausschreibungen
          </h2>
          <p className="mt-2 leading-relaxed">
            Daten, die Sie freiwillig in Ihrem Profil oder einer
            Projektausschreibung veröffentlichen, sind im Rahmen der von Ihnen
            gewählten Sichtbarkeitseinstellungen für andere Nutzer:innen der
            Plattform einsehbar. Sie können Ihre Profildaten jederzeit ändern,
            sichtbar/unsichtbar schalten oder löschen.
          </p>
          <p className="mt-3 leading-relaxed">
            <strong>Standardmäßige Sichtbarkeit:</strong> Nicht-eingeloggte
            Besucher sehen keine Klartextdaten von Auftraggebern. Bei
            Freelancer-Profilen werden nur Initialen, Region (nicht der genaue
            Ort), Skills und Bewertung angezeigt. Voller Name, exakter Standort,
            Profil-Download als CV/PDF und die Möglichkeit zur Kontaktaufnahme
            sind ausschließlich für Recruiter mit verifizierter
            Recruiter-Lizenz (siehe Ziffer 6a) freigeschaltet.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-ink-900">
            6a. Recruiter-Lizenz, Auftragsverarbeitung und Audit-Log
          </h2>
          <p className="mt-2 leading-relaxed">
            Unternehmen, die Freelancer-Profile im Klartext einsehen,
            herunterladen oder direkt kontaktieren möchten, schließen mit der
            FreelanceConnect GmbH einen separaten Recruiter-Lizenzvertrag
            inklusive Auftragsverarbeitungsvertrag (AVV) nach Art. 28 DSGVO ab.
            Voraussetzung ist die Verifikation der Geschäftsadresse, des
            Handelsregistereintrags und der USt-IdNr.
          </p>
          <p className="mt-3 leading-relaxed">
            Jeder Zugriff auf personenbezogene Freelancer-Daten durch einen
            lizenzierten Recruiter wird in einem revisionssicheren Audit-Log
            mit Zeitstempel, Nutzerkennung des Recruiters, betrachtetem Profil
            und Zugriffsart (Anzeige, Download, Kontakt) protokolliert.
            Freelancer haben das Recht, die zu ihrer Person erfassten
            Zugriffsprotokolle jederzeit einzusehen (Auskunftsrecht nach
            Art. 15 DSGVO).
          </p>
          <p className="mt-3 leading-relaxed">
            <strong>Bewerbungen durch Freelancer:</strong> Initiativ-Bewerbungen
            auf Projektausschreibungen erfordern ein aktives
            Connect-Pro-Abonnement. Auch hier wird die Übermittlung der
            Bewerbungsdaten an den Auftraggeber dokumentiert und kann durch den
            betroffenen Freelancer eingesehen werden.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-ink-900">
            7. Kontaktaufnahme
          </h2>
          <p className="mt-2 leading-relaxed">
            Wenn Sie uns per E-Mail oder über ein Kontaktformular kontaktieren,
            verarbeiten wir Ihre Angaben zur Bearbeitung Ihrer Anfrage und für
            den Fall, dass Anschlussfragen entstehen. Rechtsgrundlage ist Art. 6
            Abs. 1 lit. b oder lit. f DSGVO. Die Daten werden gelöscht, sobald
            sie zur Zweckerreichung nicht mehr erforderlich sind und keine
            gesetzlichen Aufbewahrungspflichten entgegenstehen.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-ink-900">
            8. Empfänger und Auftragsverarbeitung
          </h2>
          <p className="mt-2 leading-relaxed">
            Eine Übermittlung Ihrer personenbezogenen Daten an Dritte erfolgt
            nur, soweit dies zur Vertragserfüllung erforderlich ist, eine
            gesetzliche Pflicht besteht oder Sie eingewilligt haben. Mit
            Dienstleistern (z. B. Hosting, E-Mail-Versand) schließen wir, soweit
            erforderlich, Auftragsverarbeitungsverträge nach Art. 28 DSGVO.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-ink-900">
            9. Drittlandübermittlungen
          </h2>
          <p className="mt-2 leading-relaxed">
            Eine Übermittlung in Drittländer erfolgt nur, wenn ein angemessenes
            Datenschutzniveau besteht (z. B. Angemessenheitsbeschluss der
            EU-Kommission) oder geeignete Garantien (z. B.
            EU-Standardvertragsklauseln) vorliegen.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-ink-900">
            10. Ihre Rechte
          </h2>
          <p className="mt-2 leading-relaxed">
            Sie haben das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung
            (Art. 16 DSGVO), Löschung (Art. 17 DSGVO), Einschränkung der
            Verarbeitung (Art. 18 DSGVO), Datenübertragbarkeit (Art. 20 DSGVO)
            sowie Widerspruch gegen die Verarbeitung (Art. 21 DSGVO). Eine
            erteilte Einwilligung können Sie jederzeit mit Wirkung für die
            Zukunft widerrufen.
          </p>
          <p className="mt-2 leading-relaxed">
            Außerdem steht Ihnen ein Beschwerderecht bei einer
            Datenschutz-Aufsichtsbehörde zu (Art. 77 DSGVO).
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-ink-900">
            11. Speicherdauer
          </h2>
          <p className="mt-2 leading-relaxed">
            Personenbezogene Daten werden nur so lange gespeichert, wie es für
            die Zwecke, für die sie erhoben wurden, erforderlich ist oder
            gesetzliche Aufbewahrungspflichten dies vorsehen.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-ink-900">
            12. Änderungen dieser Datenschutzerklärung
          </h2>
          <p className="mt-2 leading-relaxed">
            Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit
            sie stets den aktuellen rechtlichen Anforderungen entspricht oder um
            Änderungen unserer Leistungen umzusetzen.
          </p>
        </div>
      </section>

      <footer className="mt-12 border-t border-ink-200 pt-6 text-sm text-ink-500">
        <p>
          Sie haben Fragen zum Datenschutz? Kontaktieren Sie uns unter{" "}
          <a
            href="mailto:datenschutz@freelanceconnect.de"
            className="text-brand-700 underline-offset-2 hover:underline"
          >
            datenschutz@freelanceconnect.de
          </a>
          .
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
