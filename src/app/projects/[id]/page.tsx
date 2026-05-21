import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  CalendarClock,
  Clock,
  Flame,
  MapPin,
  ShieldAlert,
  Sparkles,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ContactDialog } from "@/components/details/ContactDialog";
import { FreelancerCard } from "@/components/cards/FreelancerCard";
import { ProjectCard } from "@/components/cards/ProjectCard";
import {
  getProjectById,
  getRelatedFreelancers,
  getRelatedProjects,
} from "@/lib/mock-queries";
import {
  DURATION_LABEL,
  WORK_MODE_LABEL,
  formatDate,
  formatRate,
  relativeTime,
} from "@/lib/utils";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const project = getProjectById(id);
  if (!project) return { title: "Projekt nicht gefunden" };
  return {
    title: project.title,
    description: project.description.slice(0, 160),
  };
}

export default async function ProjectDetailPage({ params }: Params) {
  const { id } = await params;
  const project = getProjectById(id);
  if (!project) notFound();

  const relatedProjects = getRelatedProjects(project);
  const relatedFreelancers = getRelatedFreelancers(project);

  const requirements = derivedRequirements(project.skills);

  return (
    <div className="bg-ink-50/40">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/search?type=projects"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-brand-700"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Zur Projektsuche
        </Link>

        <header className="mt-6 rounded-2xl border border-ink-200 bg-white p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            {project.isTopProject && (
              <Badge tone="accent">
                <Sparkles className="h-3 w-3" aria-hidden />
                Top-Projekt
              </Badge>
            )}
            {project.isUrgent && (
              <Badge tone="warning">
                <Flame className="h-3 w-3" aria-hidden />
                Dringend
              </Badge>
            )}
            <Badge tone="soft">{project.industry}</Badge>
          </div>

          <h1 className="mt-3 text-balance text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
            {project.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-600">
            <span className="inline-flex items-center gap-1.5 font-medium text-ink-800">
              <Building2 className="h-4 w-4 text-ink-400" aria-hidden />
              {project.company}
              {project.companyVerified && (
                <BadgeCheck
                  className="h-4 w-4 text-brand-600"
                  aria-label="Verifiziertes Unternehmen"
                />
              )}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-ink-400" aria-hidden />
              {project.location} · {WORK_MODE_LABEL[project.workMode]}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-4 w-4 text-ink-400" aria-hidden />
              {project.applicants} Bewerber
            </span>
            <span className="inline-flex items-center gap-1.5 text-ink-500">
              <Clock className="h-4 w-4 text-ink-400" aria-hidden />
              {relativeTime(project.publishedAt)} eingestellt
            </span>
          </div>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_22rem]">
          <div className="space-y-6">
            <Section title="Projektbeschreibung">
              <p className="text-[15px] leading-relaxed text-ink-700">
                {project.description}
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-700">
                Sie arbeiten in einem agilen Setup mit Product Owner und
                bestehendem Engineering-Team zusammen. Erwartet werden
                eigenverantwortliches Arbeiten, klare Kommunikation sowie
                Erfahrung mit produktnahen Entscheidungen.
              </p>
            </Section>

            <Section title="Anforderungen">
              <ul className="space-y-2.5 text-sm leading-relaxed text-ink-700">
                {requirements.map((req) => (
                  <li key={req} className="flex items-start gap-2.5">
                    <BadgeCheck
                      className="mt-0.5 h-4 w-4 shrink-0 text-brand-600"
                      aria-hidden
                    />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="Skills &amp; Technologien">
              <div className="flex flex-wrap gap-1.5">
                {project.skills.map((s) => (
                  <Badge key={s} tone="brand">
                    {s}
                  </Badge>
                ))}
              </div>
            </Section>

            <aside className="rounded-2xl border border-warning-100 bg-warning-50/70 p-5 text-sm leading-relaxed text-warning-700">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-warning-700">
                <ShieldAlert className="h-4 w-4" aria-hidden />
                Hinweis zur Zusammenarbeit
              </h3>
              <p className="mt-2 text-warning-700/90">
                Die Beauftragung erfolgt direkt zwischen Auftraggeber und
                Freelancer. FreelanceConnect ist nicht Vertragspartei und führt
                keine Arbeitnehmerüberlassung gem. AÜG durch. Prüfen Sie vor
                Vertragsschluss Status und Versicherungen Ihres Gegenübers.
              </p>
            </aside>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-soft">
              <p className="text-xs font-medium uppercase tracking-wider text-ink-500">
                Vergütung
              </p>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-ink-900">
                {formatRate(
                  project.budgetMin,
                  project.budgetMax,
                  project.budgetUnit,
                )}
              </p>

              <dl className="mt-5 space-y-3 text-sm">
                <DetailRow
                  icon={<CalendarClock className="h-4 w-4" aria-hidden />}
                  label="Projektstart"
                  value={formatDate(project.startDate)}
                />
                <DetailRow
                  icon={<Clock className="h-4 w-4" aria-hidden />}
                  label="Dauer"
                  value={DURATION_LABEL[project.duration]}
                />
                <DetailRow
                  icon={<MapPin className="h-4 w-4" aria-hidden />}
                  label="Arbeitsort"
                  value={`${project.location} · ${WORK_MODE_LABEL[project.workMode]}`}
                />
                <DetailRow
                  icon={<Users className="h-4 w-4" aria-hidden />}
                  label="Bewerber"
                  value={`${project.applicants} aktuelle Bewerbungen`}
                />
              </dl>

              <div className="mt-6 flex flex-col gap-2">
                <ContactDialog
                  mode="apply"
                  targetTitle={project.title}
                  triggerLabel="Auf Projekt bewerben"
                  triggerVariant="primary"
                  triggerSize="lg"
                  triggerClassName="w-full"
                />
                <p className="text-center text-xs text-ink-500">
                  Bewerbung kostenfrei · ohne Vermittlungsgebühr
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-ink-200 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                Auftraggeber
              </p>
              <div className="mt-3 flex items-center gap-3">
                <span
                  aria-hidden
                  className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-sm font-semibold text-brand-700"
                >
                  {project.company.slice(0, 2).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink-900">
                    {project.company}
                  </p>
                  <p className="text-xs text-ink-500">
                    {project.companyVerified
                      ? "Verifiziertes Unternehmen"
                      : "Profil im Aufbau"}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-ink-500">
                Identität wurde anhand des Handelsregistereintrags geprüft.
              </p>
            </div>
          </aside>
        </div>

        {relatedProjects.length > 0 && (
          <section className="mt-12">
            <header className="flex items-end justify-between">
              <h2 className="text-lg font-semibold tracking-tight text-ink-900">
                Ähnliche Projekte
              </h2>
              <Link
                href="/search?type=projects"
                className="text-sm font-medium text-brand-600 hover:text-brand-700"
              >
                Alle Projekte
              </Link>
            </header>
            <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {relatedProjects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </section>
        )}

        {relatedFreelancers.length > 0 && (
          <section className="mt-12">
            <header className="flex items-end justify-between">
              <h2 className="text-lg font-semibold tracking-tight text-ink-900">
                Passende Freelancer
              </h2>
              <Link
                href="/search?type=freelancers"
                className="text-sm font-medium text-brand-600 hover:text-brand-700"
              >
                Alle Profile
              </Link>
            </header>
            <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {relatedFreelancers.map((f) => (
                <FreelancerCard key={f.id} freelancer={f} />
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

function derivedRequirements(skills: string[]): string[] {
  const base = [
    "Selbstständige, strukturierte Arbeitsweise und Erfahrung in vergleichbaren Projekten.",
    "Verhandlungssichere Deutsch- sowie sehr gute Englischkenntnisse in Wort und Schrift.",
    "Bereitschaft zur engen Abstimmung mit Product Owner und bestehendem Team.",
  ];
  if (skills.length) {
    base.unshift(
      `Praxiserprobte Kenntnisse in ${skills.slice(0, 4).join(", ")} aus Produktiveinsätzen.`,
    );
  }
  return base;
}
