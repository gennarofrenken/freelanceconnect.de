import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MOCK_PROJECTS } from "@/constants/mock-data";
import { ProjectCard } from "@/components/cards/ProjectCard";

export function TopProjects() {
  const featured = MOCK_PROJECTS.slice(0, 4);

  return (
    <section className="bg-ink-50/60">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-balance text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
              Aktuelle Top-Projekte
            </h2>
            <p className="mt-2 text-ink-600">
              Eine Auswahl ausgewählter Projekte von verifizierten Auftraggebern.
            </p>
          </div>
          <Link
            href="/search?type=projects"
            className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            Alle anzeigen
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
