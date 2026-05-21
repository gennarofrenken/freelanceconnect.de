import type { Metadata } from "next";
import {
  Building2,
  CheckCircle2,
  FileCheck,
  Lock,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Recruiter-Lizenz beantragen",
  description:
    "Lizenzierte Kontaktaufnahme zu Freelancer-Profilen — DSGVO- und AÜG-konform. Voraussetzungen, Prüfung, Konditionen.",
};

const REQUIREMENTS = [
  {
    icon: Building2,
    title: "Registriertes Unternehmen",
    text: "Aktiver Eintrag im Handelsregister (HRB/HRA) bzw. äquivalent in AT/CH. USt-IdNr. erforderlich.",
  },
  {
    icon: FileCheck,
    title: "AÜG-Lizenz (sofern relevant)",
    text: "Bei klassischer Arbeitnehmerüberlassung: gültige Erlaubnis nach §§ 1 ff. AÜG.",
  },
  {
    icon: ShieldCheck,
    title: "AVV-Abschluss",
    text: "Auftragsverarbeitungsvertrag nach Art. 28 DSGVO wird vor Freischaltung digital unterzeichnet.",
  },
  {
    icon: Lock,
    title: "Verifizierte Identität",
    text: "Identitätsprüfung der zeichnungsberechtigten Person (Video-Ident).",
  },
];

const PROCESS = [
  {
    n: "01",
    title: "Antrag stellen",
    body: "Tragen Sie Firmendaten und gewünschte Nutzerzahl ein. Dauer: ca. 5 Minuten.",
  },
  {
    n: "02",
    title: "Verifizierung",
    body: "Wir prüfen Handelsregister, USt-IdNr. und ggf. AÜG-Lizenz. Bearbeitung: 1–3 Werktage.",
  },
  {
    n: "03",
    title: "Vertrag & AVV",
    body: "Nach erfolgreicher Prüfung erhalten Sie Lizenzvertrag und AVV zur digitalen Signatur.",
  },
  {
    n: "04",
    title: "Freischaltung",
    body: "Mit Vertragsabschluss erhalten alle benannten Recruiter:innen Zugriff auf Freelancer-Profile.",
  },
];

export default function RecruiterLizenzPage() {
  return (
    <div className="bg-ink-50/40">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <header className="text-center sm:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white px-3 py-1 text-xs font-semibold tracking-tight text-brand-700 shadow-soft">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
            Für Recruiter & Personaldienstleister
          </span>
          <h1 className="mt-5 text-balance text-4xl font-bold tracking-tight text-ink-900 sm:text-5xl">
            Recruiter-Lizenz beantragen
          </h1>
          <p className="mt-3 max-w-2xl text-pretty text-ink-600 sm:text-lg">
            Aus Datenschutz- und Compliance-Gründen können Freelancer-Profile
            ausschließlich von lizenzierten und vertraglich gebundenen
            Recruitern kontaktiert oder heruntergeladen werden — analog zu §§
            DSGVO und AÜG.
          </p>
        </header>

        <section className="mt-12 rounded-2xl border border-ink-200 bg-white p-6 shadow-soft sm:p-8">
          <h2 className="text-base font-bold tracking-tight text-ink-900">
            Voraussetzungen
          </h2>
          <p className="mt-1 text-sm text-ink-500">
            Diese Nachweise prüfen wir vor Freischaltung.
          </p>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {REQUIREMENTS.map((r) => {
              const Icon = r.icon;
              return (
                <li
                  key={r.title}
                  className="flex items-start gap-3 rounded-xl border border-ink-100 bg-ink-50/50 p-4"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-semibold tracking-tight text-ink-900">
                      {r.title}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-ink-600">
                      {r.text}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="mt-8 rounded-2xl border border-ink-200 bg-white p-6 shadow-soft sm:p-8">
          <h2 className="text-base font-bold tracking-tight text-ink-900">
            Ablauf
          </h2>
          <ol className="mt-5 grid gap-6 sm:grid-cols-2">
            {PROCESS.map((s) => (
              <li key={s.n}>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-600">
                  Schritt {s.n}
                </p>
                <h3 className="mt-1 text-[15px] font-bold tracking-tight text-ink-900">
                  {s.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-600">
                  {s.body}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-8 rounded-2xl border border-brand-100 bg-brand-50/60 p-6 sm:p-8">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-700 ring-1 ring-brand-100">
              <Sparkles className="h-5 w-5" aria-hidden />
            </span>
            <div className="flex-1">
              <h2 className="text-base font-bold tracking-tight text-ink-900">
                Was ist enthalten?
              </h2>
              <ul className="mt-3 space-y-2 text-sm">
                {[
                  "Unbegrenzte Profilaufrufe und -Downloads im gebuchten Umfang",
                  "Direkte Kontaktaufnahme zu Freelancer-Profilen über die Plattform",
                  "Multi-User-Konto mit Rollen- und Rechtemanagement",
                  "Optionale API-Anbindung an Ihr ATS (Persis, Workday, SAP SuccessFactors, etc.)",
                  "DSGVO-/AÜG-Compliance-Paket inkl. AVV, TOMs und Audit-Log",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-success-600"
                      aria-hidden
                    />
                    <span className="text-ink-700">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-ink-200 bg-white p-6 sm:flex-row sm:gap-6 sm:p-8">
          <div>
            <p className="text-base font-bold tracking-tight text-ink-900">
              Bereit, Ihre Lizenz zu beantragen?
            </p>
            <p className="text-sm text-ink-600">
              Wir melden uns innerhalb eines Werktags zur Verifikation.
            </p>
          </div>
          <div className="flex gap-2">
            <Button href="/preise" variant="outline" size="lg">
              Preise ansehen
            </Button>
            <Button href="/kontakt?topic=recruiter-lizenz" variant="primary" size="lg">
              Lizenz beantragen
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
