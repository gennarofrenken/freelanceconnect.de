import type { Metadata } from "next";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Preise",
  description:
    "Transparente Konditionen für Freelancer und Unternehmen — ohne Vermittlungsgebühren, ohne Erfolgshonorare.",
};

const FREELANCER_PLAN = {
  title: "Freelancer",
  price: "0 €",
  cadence: "kostenfrei",
  description:
    "Profil erstellen, Projekte finden und sich bewerben — dauerhaft kostenfrei.",
  features: [
    "Vollständiges Profil mit Skills & Referenzen",
    "Unbegrenzte Bewerbungen pro Monat",
    "Direkte Kontaktaufnahme durch Auftraggeber",
    "Verifizierungssiegel bei Statusnachweis",
    "Übersichtliches Dashboard mit Aktivität",
  ],
  cta: { label: "Kostenlos starten", href: "/register?role=freelancer" },
  highlighted: false,
};

const COMPANY_PLAN = {
  title: "Unternehmen — Starter",
  price: "0 €",
  cadence: "pro Projekt",
  description:
    "Projekte einstellen und qualifizierte Bewerbungen erhalten — ohne Erfolgshonorar.",
  features: [
    "Unbegrenzte Projektausschreibungen",
    "Direkter Kontakt zu Freelancern",
    "Such- und Filterfunktion über alle Profile",
    "Verifizierung Ihres Unternehmens",
    "DSGVO-konformer Kontaktaustausch",
  ],
  cta: { label: "Konto erstellen", href: "/register?role=company" },
  highlighted: true,
};

const ENTERPRISE_PLAN = {
  title: "Enterprise",
  price: "Auf Anfrage",
  cadence: "individuell",
  description:
    "Volumenkonditionen für Konzerne, Vendor-Management-Systeme und öffentliche Auftraggeber.",
  features: [
    "Dedizierter Account Manager",
    "SLA & Reaktionszeiten nach Vereinbarung",
    "Single Sign-On (SAML / OIDC)",
    "Anbindung an SAP Fieldglass / SAP Ariba",
    "Auftragsverarbeitungsvertrag inkl. EU-SCC",
  ],
  cta: { label: "Beratungstermin anfragen", href: "/kontakt" },
  highlighted: false,
};

const FAQ = [
  {
    q: "Fallen Vermittlungsgebühren an?",
    a: "Nein. FreelanceConnect verrechnet keine Vermittlungs- oder Erfolgshonorare. Die Zusammenarbeit erfolgt direkt zwischen Auftraggeber und Freelancer.",
  },
  {
    q: "Wie wird das Angebot finanziert?",
    a: "Über Premium-Pakete für Unternehmen (z. B. erweiterte Sichtbarkeit, Branding-Module) sowie Enterprise-Verträge mit Großkunden.",
  },
  {
    q: "Bin ich an einen Vertrag gebunden?",
    a: "Nein. Freelancer-Profile sind dauerhaft kostenfrei. Unternehmenskonten lassen sich jederzeit und ohne Frist deaktivieren.",
  },
  {
    q: "Wird Arbeitnehmerüberlassung (AÜG) angeboten?",
    a: "Nein. FreelanceConnect ist Plattform und nicht Personaldienstleister. Eine AÜG-Erlaubnis liegt nicht vor und ist nicht erforderlich.",
  },
];

export default function PreisePage() {
  return (
    <div>
      <section className="bg-hero-glow">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
            Preise
          </p>
          <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
            Faire Konditionen — ohne Vermittlungsgebühr
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ink-600">
            Freelancer nutzen FreelanceConnect dauerhaft kostenfrei.
            Unternehmen zahlen weder pro Projekteinstellung noch im Erfolgsfall.
            Erweiterte Premium-Features sind klar ausgepreist.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-4 lg:grid-cols-3">
          <PriceCard plan={FREELANCER_PLAN} />
          <PriceCard plan={COMPANY_PLAN} />
          <PriceCard plan={ENTERPRISE_PLAN} />
        </div>
        <p className="mt-8 text-center text-xs text-ink-500">
          Alle Preise verstehen sich zzgl. der gesetzlichen Mehrwertsteuer.
        </p>
      </section>

      <section className="bg-ink-50/40">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight text-ink-900">
            Häufige Fragen
          </h2>
          <dl className="mt-8 divide-y divide-ink-200">
            {FAQ.map((item) => (
              <div key={item.q} className="py-6 first:pt-0 last:pb-0">
                <dt className="text-base font-semibold tracking-tight text-ink-900">
                  {item.q}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-ink-600">
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-8 text-sm text-ink-600">
            Weitere Fragen?{" "}
            <Link
              href="/kontakt"
              className="font-medium text-brand-700 underline-offset-2 hover:underline"
            >
              Schreiben Sie uns
            </Link>{" "}
            — wir antworten i. d. R. innerhalb eines Werktags.
          </p>
        </div>
      </section>
    </div>
  );
}

function PriceCard({
  plan,
}: {
  plan: {
    title: string;
    price: string;
    cadence: string;
    description: string;
    features: string[];
    cta: { label: string; href: string };
    highlighted: boolean;
  };
}) {
  return (
    <article
      className={`flex flex-col rounded-2xl border bg-white p-6 ${
        plan.highlighted
          ? "border-brand-300 shadow-elevated ring-1 ring-brand-100"
          : "border-ink-200 shadow-soft"
      }`}
    >
      {plan.highlighted && (
        <Badge tone="accent" className="self-start">
          <Sparkles className="h-3 w-3" aria-hidden />
          Empfohlen
        </Badge>
      )}
      <h2 className="mt-3 text-lg font-semibold tracking-tight text-ink-900">
        {plan.title}
      </h2>
      <p className="mt-1 text-sm text-ink-500">{plan.description}</p>

      <div className="mt-5 flex items-baseline gap-2">
        <span className="text-3xl font-semibold tracking-tight text-ink-900">
          {plan.price}
        </span>
        <span className="text-sm text-ink-500">{plan.cadence}</span>
      </div>

      <ul className="mt-6 space-y-2.5 text-sm">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-ink-700">
            <Check
              className="mt-0.5 h-4 w-4 shrink-0 text-brand-600"
              aria-hidden
            />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-6">
        <Button
          href={plan.cta.href}
          variant={plan.highlighted ? "primary" : "outline"}
          size="md"
          className="w-full"
        >
          {plan.cta.label}
        </Button>
      </div>
    </article>
  );
}
