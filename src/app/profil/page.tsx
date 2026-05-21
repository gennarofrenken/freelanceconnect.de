import type { Metadata } from "next";
import Link from "next/link";
import {
  BadgeCheck,
  Briefcase,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  Pencil,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MOCK_FREELANCERS } from "@/constants/mock-data";
import {
  AVAILABILITY_LABEL,
  WORK_MODE_LABEL,
  formatRate,
} from "@/lib/utils";

export const metadata: Metadata = {
  title: "Mein Profil",
  description:
    "Verwalten Sie Ihr Freelancer-Profil: Skills, Referenzen, Tagessatz, Verfügbarkeit und Kontaktinformationen.",
  robots: { index: false, follow: false },
};

const REFERENCES = [
  {
    client: "Nordstern Banking GmbH",
    role: "Lead Frontend Engineer",
    period: "01/2025 – 12/2025",
    summary:
      "Konzeption und Umsetzung eines neuen Trading-Frontends auf React + GraphQL. Aufbau eines Design-Systems, Migration der Legacy-Komponenten.",
  },
  {
    client: "Procura Software GmbH",
    role: "Senior Full-Stack Developer",
    period: "06/2024 – 12/2024",
    summary:
      "Implementierung eines B2B-Self-Service-Portals (Next.js, Node.js, PostgreSQL). Fokus auf Audit-Log, Rollen-/Rechtekonzept und Performance.",
  },
  {
    client: "Helios Search Labs",
    role: "Frontend Consultant",
    period: "02/2024 – 05/2024",
    summary:
      "Beratung zur Frontend-Architektur eines RAG-basierten Suchprodukts. Aufbau einer Testing-Strategie mit Playwright und Vitest.",
  },
];

const CERTIFICATIONS = [
  "AWS Certified Developer – Associate (2025)",
  "ISTQB Certified Tester – Foundation Level (2023)",
  "Scrum Master (PSM I)",
];

export default function ProfilPage() {
  const me = MOCK_FREELANCERS[2];

  return (
    <div className="bg-ink-50/40">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <ProfileHeader me={me} />

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_22rem]">
          <div className="space-y-6">
            <Card title="Kurzprofil" action={<EditAction />}>
              <p className="text-sm leading-relaxed text-ink-700">{me.bio}</p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {me.skills.map((s) => (
                  <Badge key={s} tone="brand">
                    {s}
                  </Badge>
                ))}
              </div>
            </Card>

            <Card title="Referenzen" action={<EditAction />}>
              <ul className="divide-y divide-ink-100">
                {REFERENCES.map((ref) => (
                  <li key={ref.client} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold tracking-tight text-ink-900">
                          {ref.role}
                        </p>
                        <p className="text-xs text-ink-500">
                          {ref.client} · {ref.period}
                        </p>
                      </div>
                      <Briefcase
                        className="h-4 w-4 shrink-0 text-ink-400"
                        aria-hidden
                      />
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-ink-600">
                      {ref.summary}
                    </p>
                  </li>
                ))}
              </ul>
            </Card>

            <Card title="Zertifikate &amp; Weiterbildung" action={<EditAction />}>
              <ul className="grid gap-2 sm:grid-cols-2">
                {CERTIFICATIONS.map((cert) => (
                  <li
                    key={cert}
                    className="flex items-center gap-2 rounded-lg border border-ink-100 bg-ink-50/60 px-3 py-2.5 text-sm text-ink-700"
                  >
                    <BadgeCheck
                      className="h-4 w-4 shrink-0 text-brand-600"
                      aria-hidden
                    />
                    {cert}
                  </li>
                ))}
              </ul>
            </Card>

            <Card title="Konditionen" action={<EditAction />}>
              <dl className="grid gap-x-6 gap-y-4 text-sm sm:grid-cols-2">
                <ConditionRow
                  label="Tagessatz"
                  value={formatRate(
                    me.hourlyRateMin,
                    me.hourlyRateMax,
                    "hour",
                  )}
                />
                <ConditionRow
                  label="Verfügbarkeit"
                  value={AVAILABILITY_LABEL[me.availability]}
                />
                <ConditionRow
                  label="Arbeitsmodell"
                  value={WORK_MODE_LABEL[me.workMode]}
                />
                <ConditionRow
                  label="Standort"
                  value={me.location}
                />
                <ConditionRow
                  label="Sprachen"
                  value={me.languages.join(", ")}
                />
                <ConditionRow
                  label="Berufserfahrung"
                  value={`${me.yearsExperience} Jahre`}
                />
              </dl>
            </Card>

            <Card
              title="Rechtliches &amp; Compliance"
              subtitle="Pflichtangaben für eine seriöse Geschäftsbeziehung"
              action={<EditAction />}
            >
              <ul className="space-y-3 text-sm leading-relaxed text-ink-700">
                <li className="flex items-start gap-3">
                  <BadgeCheck
                    className="mt-0.5 h-4 w-4 shrink-0 text-brand-600"
                    aria-hidden
                  />
                  <span>
                    Selbstständige Tätigkeit angemeldet — Statusfeststellung
                    nach § 7a SGB IV liegt vor.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <BadgeCheck
                    className="mt-0.5 h-4 w-4 shrink-0 text-brand-600"
                    aria-hidden
                  />
                  <span>
                    Berufshaftpflichtversicherung über 1.000.000 € (Allianz,
                    Police-Nr. auf Anfrage).
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <BadgeCheck
                    className="mt-0.5 h-4 w-4 shrink-0 text-brand-600"
                    aria-hidden
                  />
                  <span>
                    Umsatzsteuerpflichtig — UStIdNr. wird im Vertragsprozess
                    geteilt.
                  </span>
                </li>
              </ul>
              <p className="mt-4 text-xs leading-relaxed text-ink-500">
                Hinweis: Diese Angaben sind vom Profilinhaber gepflegt und nicht
                rechtsverbindlich. FreelanceConnect ist Vermittler von Kontakten
                und nicht Vertragspartei nach dem Arbeitnehmerüberlassungsgesetz
                (AÜG).
              </p>
            </Card>
          </div>

          <aside className="space-y-6">
            <SidebarCard>
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-semibold text-white shadow-soft"
                >
                  {me.initials}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink-900">
                    Profilstatus
                  </p>
                  <p className="text-xs text-success-600">Öffentlich sichtbar</p>
                </div>
              </div>
              <ProgressMeter value={84} />
              <p className="mt-3 text-xs leading-relaxed text-ink-500">
                Ergänzen Sie 2 weitere Referenzen und ein Profilfoto für die
                volle Sichtbarkeit.
              </p>
              <Button
                href="/dashboard"
                variant="outline"
                size="md"
                className="mt-5 w-full"
              >
                Zum Dashboard
              </Button>
            </SidebarCard>

            <SidebarCard>
              <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-500">
                Kontakt
              </h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 text-ink-400" aria-hidden />
                  <a
                    href="mailto:kontakt@freelanceconnect.de"
                    className="text-brand-700 underline-offset-2 hover:underline"
                  >
                    sophie.berger@example.de
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Globe className="mt-0.5 h-4 w-4 text-ink-400" aria-hidden />
                  <a
                    href="#"
                    className="inline-flex items-center gap-1 text-brand-700 underline-offset-2 hover:underline"
                  >
                    sophie-berger.dev
                    <ExternalLink className="h-3 w-3" aria-hidden />
                  </a>
                </li>
                <li className="flex items-start gap-3 text-ink-600">
                  <MapPin className="mt-0.5 h-4 w-4 text-ink-400" aria-hidden />
                  {me.location} · {WORK_MODE_LABEL[me.workMode]}
                </li>
              </ul>
            </SidebarCard>

            <SidebarCard>
              <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-500">
                Bewertungen
              </h3>
              <div className="mt-3 flex items-baseline gap-2">
                <Star
                  className="h-5 w-5 shrink-0 fill-accent-500 text-accent-500"
                  aria-hidden
                />
                <span className="text-2xl font-semibold tracking-tight text-ink-900">
                  {me.rating.toFixed(1)}
                </span>
                <span className="text-xs text-ink-500">
                  ({me.reviewsCount} Bewertungen)
                </span>
              </div>
              <Link
                href={`/freelancers/${me.id}`}
                className="mt-4 inline-flex text-sm font-medium text-brand-600 hover:text-brand-700"
              >
                Öffentliches Profil ansehen
              </Link>
            </SidebarCard>
          </aside>
        </div>
      </div>
    </div>
  );
}

function ProfileHeader({ me }: { me: typeof MOCK_FREELANCERS[number] }) {
  return (
    <header className="overflow-hidden rounded-2xl border border-ink-200 bg-white">
      <div
        aria-hidden
        className="h-24 bg-brand-gradient sm:h-32"
      />
      <div className="-mt-12 px-6 pb-6 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <span
              aria-hidden
              className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-br from-brand-500 to-brand-700 text-2xl font-semibold text-white shadow-elevated"
            >
              {me.initials}
            </span>
            <div className="pb-2">
              <h1 className="flex items-center gap-2 text-xl font-semibold tracking-tight text-ink-900 sm:text-2xl">
                {me.fullName}
                {me.isVerified && (
                  <BadgeCheck
                    className="h-5 w-5 text-brand-600"
                    aria-label="Verifiziertes Profil"
                  />
                )}
              </h1>
              <p className="mt-1 text-sm text-ink-600">{me.title}</p>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-500">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" aria-hidden />
                  {me.location}
                </span>
                <span>{WORK_MODE_LABEL[me.workMode]}</span>
                <span>{AVAILABILITY_LABEL[me.availability]}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pb-1">
            <Button href={`/freelancers/${me.id}`} variant="outline" size="md">
              Öffentliche Vorschau
            </Button>
            <Button variant="primary" size="md">
              <Pencil className="h-4 w-4" aria-hidden />
              Profil bearbeiten
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

function Card({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-ink-200 bg-white p-6">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-ink-900">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-0.5 text-xs text-ink-500">{subtitle}</p>
          )}
        </div>
        {action}
      </header>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function SidebarCard({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-ink-200 bg-white p-6">
      {children}
    </section>
  );
}

function EditAction() {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-ink-500 transition-colors hover:bg-ink-100 hover:text-brand-700"
    >
      <Pencil className="h-3.5 w-3.5" aria-hidden />
      Bearbeiten
    </button>
  );
}

function ConditionRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-ink-500">{label}</dt>
      <dd className="mt-0.5 font-medium text-ink-900">{value}</dd>
    </div>
  );
}

function ProgressMeter({ value }: { value: number }) {
  return (
    <div className="mt-5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-ink-500">Profilstärke</span>
        <span className="font-medium text-ink-800">{value}%</span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
        <div
          className="h-full rounded-full bg-brand-500"
          style={{ width: `${value}%` }}
          aria-label={`${value} Prozent Profilstärke`}
        />
      </div>
    </div>
  );
}
