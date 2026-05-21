import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Bell, CheckCircle2, Database } from "lucide-react";
import { MOCK_PROJECTS, MOCK_FREELANCERS } from "@/constants/mock-data";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { Button } from "@/components/ui/Button";
import { getDashboardStats, getMyProjects } from "@/lib/db/queries";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Ihre persönliche Übersicht: Projekte, Anfragen, Profilstatistik und nächste Schritte.",
};

// Dashboard nutzt user-spezifische DB-Queries — bei jedem Request rendern.
export const dynamic = "force-dynamic";

const KPIS: ReadonlyArray<{ label: string; value: string }> = [
  { label: "Aktive Projekte", value: "3" },
  { label: "Profilaufrufe (7 T.)", value: "187" },
  { label: "Offene Anfragen", value: "5" },
  { label: "Profilstärke", value: "84 %" },
];

const ACTIVITY = [
  {
    title: "Neue Anfrage zu „SAP S/4HANA Berater – Migration & Rollout“",
    time: "vor 2 Stunden",
  },
  {
    title: "Ihr Profil wurde von 12 Recruitern aufgerufen",
    time: "heute",
  },
  {
    title: "Vertrag mit Helios Search Labs GmbH steht zur Unterschrift bereit",
    time: "vor 1 Tag",
  },
  {
    title: "Bewerbung auf „Senior React Developer (FinTech)“ wurde gesichtet",
    time: "vor 2 Tagen",
  },
];

export default async function DashboardPage() {
  const [stats, myProjects] = await Promise.all([
    getDashboardStats(),
    getMyProjects(),
  ]);
  const ownProjects = myProjects.length > 0 ? myProjects : MOCK_PROJECTS.slice(2, 5);
  const me = MOCK_FREELANCERS[0];
  const lastName = me.fullName.split(" ").slice(-1)[0];

  return (
    <div className="bg-ink-50/50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-ink-900">
              Willkommen zurück, {lastName}.
            </h1>
            <p className="mt-1 text-sm text-ink-500">
              Ihre Übersicht zu Projekten, Anfragen und Profilaktivität.
            </p>
          </div>
          <Button href="/projekte/erstellen" variant="primary" size="md">
            <ArrowUpRight className="h-4 w-4" aria-hidden />
            Projekt einstellen
          </Button>
        </header>

        <section className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {KPIS.map((kpi) => (
            <article
              key={kpi.label}
              className="rounded-2xl border border-ink-200 bg-white p-5"
            >
              <p className="text-2xl font-semibold tracking-tight text-ink-900">
                {kpi.value}
              </p>
              <p className="mt-1 text-xs text-ink-500">{kpi.label}</p>
            </article>
          ))}
        </section>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_22rem]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-ink-200 bg-white p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold tracking-tight text-ink-900">
                    {myProjects.length > 0
                      ? "Ihre Projekte"
                      : "Empfohlene Projekte"}
                  </h2>
                  <p className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-ink-500">
                    <Database className="h-3 w-3" aria-hidden />
                    {myProjects.length > 0
                      ? `Live aus Datenbank · ${myProjects.length} Einträge`
                      : stats.isAuthenticated
                        ? "Sie haben noch keine Projekte eingestellt — Vorschläge aus Demo-Daten"
                        : "Demo-Daten (nicht eingeloggt)"}
                  </p>
                </div>
                <Link
                  href={myProjects.length > 0 ? "/projekte/erstellen" : "/search?type=projects"}
                  className="text-sm font-medium text-brand-600 hover:text-brand-700"
                >
                  {myProjects.length > 0 ? "+ Neues Projekt" : "Alle anzeigen"}
                </Link>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {ownProjects.map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-ink-200 bg-white p-6">
              <h2 className="text-base font-semibold tracking-tight text-ink-900">
                Aktivität
              </h2>
              <ul className="mt-4 divide-y divide-ink-100">
                {ACTIVITY.map((a) => (
                  <li
                    key={a.title}
                    className="flex items-start gap-3 py-3 text-sm"
                  >
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                      <Bell className="h-3.5 w-3.5" aria-hidden />
                    </span>
                    <div>
                      <p className="font-medium text-ink-800">{a.title}</p>
                      <p className="text-xs text-ink-500">{a.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-ink-200 bg-white p-6">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-700"
                >
                  {me.initials}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink-900">
                    {me.fullName}
                  </p>
                  <p className="truncate text-xs text-ink-500">{me.title}</p>
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-ink-500">Profilstärke</span>
                  <span className="font-medium text-ink-800">84 %</span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
                  <div
                    className="h-full rounded-full bg-brand-500"
                    style={{ width: "84%" }}
                    aria-label="84 Prozent Profilstärke"
                  />
                </div>
                <p className="mt-3 text-xs leading-relaxed text-ink-500">
                  Ergänzen Sie 2 weitere Referenzen für die volle Sichtbarkeit.
                </p>
              </div>

              <Button
                href="/profil"
                variant="outline"
                size="md"
                className="mt-5 w-full"
              >
                Profil bearbeiten
              </Button>
            </section>

            <section className="rounded-2xl border border-ink-200 bg-white p-6">
              <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-500">
                Nächste Schritte
              </h2>
              <ul className="mt-3 space-y-2.5 text-sm">
                {[
                  "Lebenslauf als PDF hochladen",
                  "Verfügbarkeit für Q3 2026 setzen",
                  "Mindestens 3 Skill-Kategorien bestätigen",
                ].map((step) => (
                  <li key={step} className="flex items-start gap-2">
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 text-brand-500"
                      aria-hidden
                    />
                    <span className="text-ink-700">{step}</span>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
