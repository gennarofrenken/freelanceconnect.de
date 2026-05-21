import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CalendarClock,
  CheckCircle2,
  FileSearch,
  Handshake,
  ShieldCheck,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";

export function TwoWayBenefits() {
  return (
    <section className="bg-ink-50">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-brand-700">
            Eine Plattform, zwei klare Vorteile
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
            Schnellere Besetzung. Direkter Kundenkontakt.
          </h2>
          <p className="mt-3 text-pretty text-ink-600">
            Unternehmen finden in wenigen Tagen passende Experten. Freelancer
            arbeiten direkt mit Auftraggebern — ohne Mittelmann, ohne versteckte
            Gebühren.
          </p>
        </header>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <BenefitCard
            tone="brand"
            icon={Building2}
            label="Für Unternehmen"
            title="Passenden Freelancer in wenigen Tagen besetzen"
            ctaLabel="Projekt einstellen"
            ctaHref="/projekte/erstellen"
            items={[
              {
                icon: FileSearch,
                title: "Qualifizierte Profile",
                description:
                  "Jedes Freelancer-Profil ist vollständig, geprüft und nach Skills, Branche und Verfügbarkeit gefiltert.",
              },
              {
                icon: CalendarClock,
                title: "Bedarfsgerecht & schnell",
                description:
                  "Schalten Sie Projekte selbst — und erhalten Sie meist innerhalb von 48 Stunden geeignete Vorschläge.",
              },
              {
                icon: ShieldCheck,
                title: "Compliance-ready",
                description:
                  "Saubere Vertragsgestaltung, AÜG-Hinweise und DSGVO-konforme Datenhaltung.",
              },
            ]}
          />

          <BenefitCard
            tone="accent"
            icon={Users}
            label="Für Freelancer"
            title="Direkter Kundenkontakt, faire Konditionen"
            ctaLabel="Profil anlegen"
            ctaHref="/register?role=freelancer"
            items={[
              {
                icon: Handshake,
                title: "0 % Vermittlungsgebühr",
                description:
                  "Verhandeln Sie Ihre Konditionen direkt mit dem Auftraggeber — wir verdienen nicht an Ihrem Honorar.",
              },
              {
                icon: UserPlus,
                title: "Sichtbares Profil",
                description:
                  "Ein professionelles Profil mit Skills, Referenzen und Bewertungen sorgt für hochwertige Anfragen.",
              },
              {
                icon: Wallet,
                title: "Transparente Stundensätze",
                description:
                  "Ehrliche Bandbreiten statt Lockangebote — Sie behalten die Hoheit über Ihre Preisgestaltung.",
              },
            ]}
          />
        </div>
      </div>
    </section>
  );
}

interface BenefitItem {
  icon: typeof CheckCircle2;
  title: string;
  description: string;
}

type BenefitTone = "brand" | "accent";

const TONE_STYLES: Record<
  BenefitTone,
  {
    border: string;
    glow: string;
    chip: string;
    iconTile: string;
    cta: string;
  }
> = {
  brand: {
    border: "border-brand-100",
    glow: "bg-brand-200",
    chip: "bg-brand-50 text-brand-700",
    iconTile: "bg-brand-50 text-brand-700",
    cta: "bg-brand-700 text-white hover:bg-brand-800",
  },
  accent: {
    border: "border-accent-200",
    glow: "bg-accent-200",
    chip: "bg-accent-50 text-accent-700",
    iconTile: "bg-accent-50 text-accent-700",
    cta: "bg-accent-500 text-ink-900 hover:bg-accent-600",
  },
};

function BenefitCard({
  tone,
  icon: Icon,
  label,
  title,
  ctaLabel,
  ctaHref,
  items,
}: {
  tone: BenefitTone;
  icon: typeof CheckCircle2;
  label: string;
  title: string;
  ctaLabel: string;
  ctaHref: string;
  items: BenefitItem[];
}) {
  const styles = TONE_STYLES[tone];

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border bg-white p-8 shadow-soft transition-shadow hover:shadow-elevated ${styles.border}`}
    >
      <div
        aria-hidden
        className={`absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-50 blur-3xl ${styles.glow}`}
      />
      <div className="relative">
        <div
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${styles.chip}`}
        >
          <Icon className="h-3.5 w-3.5" aria-hidden />
          {label}
        </div>
        <h3 className="mt-4 text-2xl font-semibold text-ink-900">{title}</h3>

        <ul className="mt-6 space-y-5">
          {items.map((item) => {
            const ItemIcon = item.icon;
            return (
              <li key={item.title} className="flex gap-3">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${styles.iconTile}`}
                >
                  <ItemIcon className="h-4 w-4" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink-900">
                    {item.title}
                  </p>
                  <p className="mt-1 text-sm text-ink-600">{item.description}</p>
                </div>
              </li>
            );
          })}
        </ul>

        <Link
          href={ctaHref}
          className={`mt-8 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium shadow-soft transition-all hover:shadow-elevated ${styles.cta}`}
        >
          {ctaLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </Link>
      </div>
    </article>
  );
}
