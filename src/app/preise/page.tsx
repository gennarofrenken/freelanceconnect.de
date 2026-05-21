import type { Metadata } from "next";
import Link from "next/link";
import { Check, Lock, Sparkles, X } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { UpgradeButton } from "@/components/billing/UpgradeButton";

export const metadata: Metadata = {
  title: "Preise",
  description:
    "Transparente Konditionen: Freelancer-Premium für Bewerbungen, vertragsbasierte Recruiter-Lizenz für Unternehmen.",
};

type Plan = {
  audience: "Freelancer" | "Unternehmen";
  title: string;
  price: string;
  cadence: string;
  description: string;
  features: { label: string; included: boolean }[];
  cta: { label: string; href: string };
  highlighted: boolean;
  badge?: string;
};

const PLANS: Plan[] = [
  {
    audience: "Freelancer",
    title: "Basis",
    price: "0 €",
    cadence: "dauerhaft kostenfrei",
    description:
      "Profil veröffentlichen und Anfragen von Recruitern empfangen — komplett kostenfrei.",
    features: [
      { label: "Vollständiges Profil mit Skills & Referenzen", included: true },
      { label: "Verifizierungssiegel bei Statusnachweis", included: true },
      { label: "Anfragen von Recruitern empfangen", included: true },
      { label: "Initiativ-Bewerbungen auf Projekte", included: false },
      { label: "Premium-Sichtbarkeit in Suchergebnissen", included: false },
    ],
    cta: { label: "Profil erstellen", href: "/register?role=freelancer" },
    highlighted: false,
  },
  {
    audience: "Freelancer",
    title: "Connect Pro",
    price: "19 €",
    cadence: "pro Monat · monatlich kündbar",
    description:
      "Aktiv auf Projekte bewerben und Top-Sichtbarkeit erhalten. 0 % Vermittlungsgebühr.",
    features: [
      { label: "Unbegrenzte Initiativ-Bewerbungen", included: true },
      { label: "Premium-Sichtbarkeit bei Recruitern", included: true },
      { label: "Direkter Kontakt zum Auftraggeber", included: true },
      { label: "Frühzugriff auf neue Projekte (24 h)", included: true },
      { label: "DSGVO-konforme Profil-Statistiken", included: true },
    ],
    cta: { label: "Connect Pro freischalten", href: "/register?role=freelancer&plan=pro" },
    highlighted: true,
    badge: "Empfohlen",
  },
  {
    audience: "Unternehmen",
    title: "Recruiter-Starter",
    price: "0 €",
    cadence: "Projekte einstellen",
    description:
      "Projekte ausschreiben und Bewerbungen erhalten — ohne Erfolgshonorar.",
    features: [
      { label: "Unbegrenzte Projektausschreibungen", included: true },
      { label: "Bewerbungen empfangen + verwalten", included: true },
      { label: "Anonymisierte Freelancer-Vorschau", included: true },
      { label: "Vollständige Profile + Kontaktdaten", included: false },
      { label: "Profil-Download (PDF / CV)", included: false },
    ],
    cta: { label: "Konto erstellen", href: "/register?role=company" },
    highlighted: false,
  },
  {
    audience: "Unternehmen",
    title: "Recruiter-Lizenz",
    price: "Auf Anfrage",
    cadence: "vertragsbasiert · B2B",
    description:
      "Vollzugriff auf Freelancer-Profile mit DSGVO-konformem Vertrag + AÜG-Hinweis.",
    features: [
      { label: "Vollständige Profile & Kontaktdaten", included: true },
      { label: "Profil-Download als PDF / CV", included: true },
      { label: "Direktkontakt zu Freelancern", included: true },
      { label: "Auftragsverarbeitungsvertrag (AVV)", included: true },
      { label: "Audit-Log über alle Zugriffe", included: true },
    ],
    cta: { label: "Lizenz beantragen", href: "/recruiter/lizenz" },
    highlighted: true,
    badge: "B2B-Vertrag",
  },
];

const FAQ = [
  {
    q: "Warum kosten Bewerbungen für Freelancer Geld?",
    a: "Ein Premium-Modell sichert die Qualität: Wir erleben keine Spam-Bewerbungen und Recruiter erhalten relevante, ernsthafte Anfragen. Freelancer behalten 100 % ihres Honorars — wir nehmen 0 % Vermittlungsgebühr.",
  },
  {
    q: "Warum müssen Recruiter eine Lizenz haben?",
    a: "Freelancer-Profile enthalten personenbezogene Daten (Name, Lebenslauf, Kontakt). Aus DSGVO- und Compliance-Gründen geben wir diese Daten nur an Unternehmen mit unterzeichnetem Auftragsverarbeitungsvertrag (AVV) und verifizierter Geschäftsadresse weiter. Jeder Zugriff wird protokolliert.",
  },
  {
    q: "Welche Daten sind vor dem Login geschützt?",
    a: "Gäste sehen Projekttitel, Skills, Region, Budgetrahmen und Vertragsart — aber nicht den Firmennamen. Freelancer-Profile zeigen nur Initialen, Region, Skills, Rating; voller Name, exakter Standort und Profil-Download sind ausschließlich lizenzierten Recruitern vorbehalten.",
  },
  {
    q: "Wie lange läuft Connect Pro?",
    a: "Connect Pro ist monatlich kündbar. Keine Mindestlaufzeit, keine Vertragsbindung. Die Premium-Features sind sofort nach Aktivierung verfügbar.",
  },
  {
    q: "Wird Arbeitnehmerüberlassung (AÜG) angeboten?",
    a: "Nein. FreelanceConnect ist Plattform und nicht Personaldienstleister. Der Lizenzvertrag adressiert ausschließlich datenschutzrechtliche Compliance.",
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
            Klare Konditionen — DSGVO-konform aufgesetzt
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ink-600">
            Freelancer-Profile sind dauerhaft kostenfrei.{" "}
            <strong className="font-semibold text-ink-900">Bewerbungen</strong>{" "}
            schalten Sie mit <strong>Connect Pro</strong> frei.{" "}
            <strong>Recruiter</strong> erhalten Vollzugriff auf Profile
            ausschließlich nach Vertrag und Verifikation.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-500">
          Für Freelancer
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {PLANS.filter((p) => p.audience === "Freelancer").map((plan) => (
            <PriceCard key={plan.title} plan={plan} />
          ))}
        </div>

        <div className="mt-12 mb-3 text-xs font-semibold uppercase tracking-wider text-ink-500">
          Für Unternehmen
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {PLANS.filter((p) => p.audience === "Unternehmen").map((plan) => (
            <PriceCard key={plan.title} plan={plan} />
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-ink-500">
          Alle Preise zzgl. der gesetzlichen Mehrwertsteuer.
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

function PriceCard({ plan }: { plan: Plan }) {
  return (
    <article
      className={`flex flex-col rounded-2xl border bg-white p-6 ${
        plan.highlighted
          ? "border-brand-300 shadow-elevated ring-1 ring-brand-100"
          : "border-ink-200 shadow-soft"
      }`}
    >
      {plan.highlighted && plan.badge && (
        <Badge tone="accent" className="self-start">
          <Sparkles className="h-3 w-3" aria-hidden />
          {plan.badge}
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
          <li
            key={f.label}
            className={`flex items-start gap-2.5 ${
              f.included ? "text-ink-700" : "text-ink-400"
            }`}
          >
            {f.included ? (
              <Check
                className="mt-0.5 h-4 w-4 shrink-0 text-brand-600"
                aria-hidden
              />
            ) : (
              <X className="mt-0.5 h-4 w-4 shrink-0 text-ink-300" aria-hidden />
            )}
            <span className={f.included ? "" : "line-through decoration-ink-300"}>
              {f.label}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-6">
        {plan.title === "Connect Pro" ? (
          <UpgradeButton
            label={plan.cta.label}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-brand-700 disabled:opacity-50"
          />
        ) : (
          <Button
            href={plan.cta.href}
            variant={plan.highlighted ? "primary" : "outline"}
            size="md"
            className="w-full"
          >
            {plan.highlighted && plan.audience === "Unternehmen" && (
              <Lock className="h-4 w-4" aria-hidden />
            )}
            {plan.cta.label}
          </Button>
        )}
      </div>
    </article>
  );
}
