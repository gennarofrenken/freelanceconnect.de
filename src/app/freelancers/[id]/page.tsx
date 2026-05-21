import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  Clock4,
  Globe,
  Languages,
  MapPin,
  ShieldCheck,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ContactDialog } from "@/components/details/ContactDialog";
import { ProjectCard } from "@/components/cards/ProjectCard";
import {
  getFreelancerById,
  getFreelancerProjects,
} from "@/lib/mock-queries";
import {
  AVAILABILITY_LABEL,
  WORK_MODE_LABEL,
  formatRate,
} from "@/lib/utils";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const f = getFreelancerById(id);
  if (!f) return { title: "Profil nicht gefunden" };
  return {
    title: `${f.fullName} — ${f.title}`,
    description: f.bio.slice(0, 160),
  };
}

const SAMPLE_EXPERIENCE = [
  {
    role: "Senior Berater / Lead",
    client: "Großkunde aus Finanz- oder Industrie-Umfeld",
    period: "2024 – heute",
    bullets: [
      "Verantwortung für Architektur und Roadmap eines strategischen Produkts.",
      "Coaching und enge Zusammenarbeit mit Inhouse-Team.",
      "Direkte Stakeholder-Kommunikation auf Management-Ebene.",
    ],
  },
  {
    role: "Senior Consultant",
    client: "Mittelständische Konzerne, DACH",
    period: "2019 – 2024",
    bullets: [
      "Mehrere End-to-End-Implementierungen in regulierten Branchen.",
      "Verantwortung für Auswahl und Einführung neuer Technologien.",
      "Risiko- und Compliance-konforme Umsetzung.",
    ],
  },
];

export default async function FreelancerDetailPage({ params }: Params) {
  const { id } = await params;
  const freelancer = getFreelancerById(id);
  if (!freelancer) notFound();

  const relevantProjects = getFreelancerProjects(freelancer);

  return (
    <div className="bg-ink-50/40">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/search?type=freelancers"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-brand-700"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Zur Freelancer-Suche
        </Link>

        <header className="mt-6 overflow-hidden rounded-2xl border border-ink-200 bg-white">
          <div aria-hidden className="h-20 bg-brand-gradient sm:h-28" />
          <div className="-mt-10 px-6 pb-6 sm:px-8 sm:pb-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <span
                  aria-hidden
                  className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-br from-brand-500 to-brand-700 text-xl font-semibold text-white shadow-elevated"
                >
                  {freelancer.initials}
                </span>
                <div className="pb-1">
                  <h1 className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xl font-semibold tracking-tight text-ink-900 sm:text-2xl">
                    {freelancer.fullName}
                    {freelancer.isVerified && (
                      <BadgeCheck
                        className="h-5 w-5 text-brand-600"
                        aria-label="Verifiziert"
                      />
                    )}
                    {freelancer.isTopRated && (
                      <Badge tone="accent">Top-Rated</Badge>
                    )}
                  </h1>
                  <p className="mt-1 text-sm text-ink-600">{freelancer.title}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-500">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" aria-hidden />
                      {freelancer.location}
                    </span>
                    <span>{WORK_MODE_LABEL[freelancer.workMode]}</span>
                    <span className="inline-flex items-center gap-1">
                      <Star
                        className="h-3.5 w-3.5 fill-accent-500 text-accent-500"
                        aria-hidden
                      />
                      <span className="font-medium text-ink-800">
                        {freelancer.rating.toFixed(1)}
                      </span>
                      <span>({freelancer.reviewsCount})</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pb-1">
                <ContactDialog
                  mode="contact"
                  targetTitle={freelancer.fullName}
                  triggerLabel="Anfragen"
                  triggerVariant="primary"
                  triggerSize="md"
                />
              </div>
            </div>
          </div>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_22rem]">
          <div className="space-y-6">
            <Section title="Kurzprofil">
              <p className="text-[15px] leading-relaxed text-ink-700">
                {freelancer.bio}
              </p>
            </Section>

            <Section title="Skills">
              <div className="flex flex-wrap gap-1.5">
                {freelancer.skills.map((s) => (
                  <Badge key={s} tone="brand">
                    {s}
                  </Badge>
                ))}
              </div>
              <p className="mt-4 text-xs text-ink-500">
                Stand der Selbsteinschätzung. Im Rahmen einer Anfrage können
                konkrete Projekt-Referenzen angefordert werden.
              </p>
            </Section>

            <Section title="Berufserfahrung">
              <ol className="space-y-6">
                {SAMPLE_EXPERIENCE.map((entry, i) => (
                  <li key={i} className="relative pl-6">
                    <span
                      aria-hidden
                      className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-brand-500 bg-white"
                    />
                    {i < SAMPLE_EXPERIENCE.length - 1 && (
                      <span
                        aria-hidden
                        className="absolute left-[5px] top-4 h-full w-px bg-ink-200"
                      />
                    )}
                    <p className="text-sm font-semibold tracking-tight text-ink-900">
                      {entry.role}
                    </p>
                    <p className="mt-0.5 text-xs text-ink-500">
                      {entry.client} · {entry.period}
                    </p>
                    <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-ink-700">
                      {entry.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2">
                          <span
                            aria-hidden
                            className="mt-1.5 inline-block h-1 w-1 rounded-full bg-ink-400"
                          />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
            </Section>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-soft">
              <p className="text-xs font-medium uppercase tracking-wider text-ink-500">
                Konditionen
              </p>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-ink-900">
                {formatRate(
                  freelancer.hourlyRateMin,
                  freelancer.hourlyRateMax,
                  "hour",
                )}
              </p>

              <dl className="mt-5 space-y-3 text-sm">
                <DetailRow
                  icon={<Clock4 className="h-4 w-4" aria-hidden />}
                  label="Verfügbarkeit"
                  value={AVAILABILITY_LABEL[freelancer.availability]}
                />
                <DetailRow
                  icon={<MapPin className="h-4 w-4" aria-hidden />}
                  label="Arbeitsmodell"
                  value={`${freelancer.location} · ${WORK_MODE_LABEL[freelancer.workMode]}`}
                />
                <DetailRow
                  icon={<Languages className="h-4 w-4" aria-hidden />}
                  label="Sprachen"
                  value={freelancer.languages.join(", ")}
                />
                <DetailRow
                  icon={<Globe className="h-4 w-4" aria-hidden />}
                  label="Reaktionszeit"
                  value={`Antwort i. d. R. innerhalb ${freelancer.responseTimeHours} h`}
                />
              </dl>

              <div className="mt-6 flex flex-col gap-2">
                <ContactDialog
                  mode="contact"
                  targetTitle={freelancer.fullName}
                  triggerLabel="Projekt anfragen"
                  triggerVariant="primary"
                  triggerSize="lg"
                  triggerClassName="w-full"
                />
                <p className="text-center text-xs text-ink-500">
                  Direktkontakt · keine Vermittlungsgebühr
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-ink-200 bg-white p-6">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-500">
                <ShieldCheck className="h-4 w-4 text-brand-600" aria-hidden />
                Verifizierung
              </p>
              <ul className="mt-3 space-y-2 text-sm text-ink-700">
                <li className="flex items-start gap-2">
                  <BadgeCheck
                    className="mt-0.5 h-4 w-4 shrink-0 text-brand-600"
                    aria-hidden
                  />
                  Identität verifiziert
                </li>
                <li className="flex items-start gap-2">
                  <BadgeCheck
                    className="mt-0.5 h-4 w-4 shrink-0 text-brand-600"
                    aria-hidden
                  />
                  Selbstständigkeit nachgewiesen
                </li>
                <li className="flex items-start gap-2">
                  <BadgeCheck
                    className="mt-0.5 h-4 w-4 shrink-0 text-brand-600"
                    aria-hidden
                  />
                  Berufshaftpflicht vorhanden
                </li>
              </ul>
            </div>
          </aside>
        </div>

        {relevantProjects.length > 0 && (
          <section className="mt-12">
            <header className="flex items-end justify-between">
              <h2 className="text-lg font-semibold tracking-tight text-ink-900">
                Passende Projekte
              </h2>
              <Link
                href="/search?type=projects"
                className="text-sm font-medium text-brand-600 hover:text-brand-700"
              >
                Alle Projekte
              </Link>
            </header>
            <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {relevantProjects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-ink-200 bg-white p-6 sm:p-8">
      <h2 className="text-base font-semibold tracking-tight text-ink-900">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-ink-400">{icon}</span>
      <div>
        <dt className="text-xs uppercase tracking-wider text-ink-500">
          {label}
        </dt>
        <dd className="mt-0.5 text-sm font-medium text-ink-900">{value}</dd>
      </div>
    </div>
  );
}
