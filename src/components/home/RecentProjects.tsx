import Link from "next/link";
import { ArrowRight, Database } from "lucide-react";
import { ProjectListItem } from "@/components/cards/ProjectListItem";
import { listAllProjectsHybrid } from "@/lib/db/listing-queries";

export async function RecentProjects() {
  const { combined, fromDb } = await listAllProjectsHybrid();
  const items = combined.slice(0, 8);

  return (
    <section className="bg-ink-50/60">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <header className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-balance text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
              Aktuelle Projekte
            </h2>
            <p className="mt-2 inline-flex items-center gap-2 text-ink-600">
              Eine Auswahl der neuesten Projekte verifizierter Auftraggeber.
              {fromDb.length > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-success-500/10 px-2 py-0.5 text-xs font-medium text-success-600">
                  <Database className="h-3 w-3" aria-hidden />
                  {fromDb.length} live
                </span>
              )}
            </p>
          </div>
          <Link
            href="/search?type=projects"
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            Alle Projekte
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </header>

        <div className="mt-8 overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-soft">
          <ul>
            {items.map((p) => (
              <li key={p.id}>
                <ProjectListItem project={p} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
