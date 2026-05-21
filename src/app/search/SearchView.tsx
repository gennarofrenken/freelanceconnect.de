"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MOCK_PROJECTS, MOCK_FREELANCERS } from "@/constants/mock-data";
import {
  findIndustryGroupBySlug,
  findIndustryGroupByItem,
  INDUSTRY_GROUPS,
} from "@/constants/industries";
import type { SearchFilters, SearchResult } from "@/types";
import { BellRing, LayoutGrid, List, SearchX } from "lucide-react";
import Link from "next/link";
import { SearchFiltersPanel } from "@/components/search/SearchFilters";
import { ActiveFilterPills } from "@/components/search/ActiveFilterPills";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { ProjectListItem } from "@/components/cards/ProjectListItem";
import { FreelancerCard } from "@/components/cards/FreelancerCard";
import { FreelancerListItem } from "@/components/cards/FreelancerListItem";
import { cn } from "@/lib/utils";

type SortOrder = "relevance" | "newest" | "rate-asc" | "rate-desc";

const DEFAULT_FILTERS: SearchFilters = {
  query: "",
  type: "all",
  workMode: [],
  contractTypes: [],
  industries: [],
  skills: [],
  budgetMin: undefined,
  budgetMax: undefined,
  excludeNoRate: false,
  availability: undefined,
  country: undefined,
  region: undefined,
  location: undefined,
  postalCode: undefined,
  radius: 0,
  startMonth: undefined,
  startYear: undefined,
  durationMonthsMin: undefined,
  durationMonthsMax: undefined,
};

function matchesQuery(haystack: string, query: string) {
  if (!query) return true;
  return haystack.toLowerCase().includes(query.trim().toLowerCase());
}

export function SearchView() {
  const params = useSearchParams();
  const initialType = (params.get("type") as SearchFilters["type"]) ?? "all";
  const initialQuery = params.get("q") ?? "";
  const initialIndustry = params.get("industry") ?? undefined;
  const initialGroup = findIndustryGroupBySlug(params.get("group"));

  const initialIndustries = initialGroup
    ? [...initialGroup.items]
    : initialIndustry
      ? [initialIndustry]
      : [];

  const [filters, setFilters] = useState<SearchFilters>({
    ...DEFAULT_FILTERS,
    type: initialType,
    query: initialQuery,
    industries: initialIndustries,
  });
  const [sort, setSort] = useState<SortOrder>("newest");
  const [view, setView] = useState<"list" | "grid">("list");

  const resetFilters = () =>
    setFilters({ ...DEFAULT_FILTERS, type: filters.type });

  const activeFilterCount = countActiveFilters(filters);
  const showJobAlertHint = activeFilterCount >= 2;

  const results = useMemo<SearchResult[]>(() => {
    const includeProjects = filters.type === "all" || filters.type === "projects";
    const includeFreelancers =
      filters.type === "all" || filters.type === "freelancers";

    const projects: SearchResult[] = includeProjects
      ? MOCK_PROJECTS.filter((p) => {
          if (
            !matchesQuery(
              `${p.title} ${p.company} ${p.industry} ${p.skills.join(" ")} ${p.location} ${p.region ?? ""}`,
              filters.query,
            )
          )
            return false;
          if (filters.workMode.length && !filters.workMode.includes(p.workMode))
            return false;
          if (
            filters.contractTypes.length &&
            !filters.contractTypes.includes(p.contractType)
          )
            return false;
          if (
            filters.industries.length &&
            !filters.industries.includes(p.industry)
          )
            return false;
          if (
            filters.skills.length &&
            !filters.skills.some((s) => p.skills.includes(s))
          )
            return false;
          if (filters.excludeNoRate && (p.rateUndisclosed || p.budgetMin === undefined))
            return false;
          if (
            filters.budgetMin !== undefined &&
            p.budgetMax !== undefined &&
            p.budgetMax < filters.budgetMin
          )
            return false;
          if (
            filters.budgetMax !== undefined &&
            p.budgetMin !== undefined &&
            p.budgetMin > filters.budgetMax
          )
            return false;
          if (filters.country && p.country !== filters.country) return false;
          if (filters.region && p.region !== filters.region) return false;
          if (filters.location && p.location !== filters.location) return false;
          if (
            filters.postalCode &&
            p.postalCode &&
            !p.postalCode.startsWith(filters.postalCode.trim())
          )
            return false;
          if (filters.startYear) {
            const start = new Date(p.startDate);
            if (start.getFullYear() !== filters.startYear) return false;
            if (
              filters.startMonth &&
              start.getMonth() + 1 !== filters.startMonth
            )
              return false;
          } else if (filters.startMonth) {
            const start = new Date(p.startDate);
            if (start.getMonth() + 1 !== filters.startMonth) return false;
          }
          if (
            filters.durationMonthsMin !== undefined &&
            p.durationMonths !== undefined &&
            p.durationMonths < filters.durationMonthsMin
          )
            return false;
          if (
            filters.durationMonthsMax !== undefined &&
            p.durationMonths !== undefined &&
            p.durationMonths > filters.durationMonthsMax
          )
            return false;
          return true;
        }).map((p) => ({ kind: "project" as const, ...p }))
      : [];

    const freelancers: SearchResult[] = includeFreelancers
      ? MOCK_FREELANCERS.filter((f) => {
          if (
            !matchesQuery(
              `${f.fullName} ${f.title} ${f.industry} ${f.skills.join(" ")} ${f.location} ${f.region ?? ""}`,
              filters.query,
            )
          )
            return false;
          if (filters.workMode.length && !filters.workMode.includes(f.workMode))
            return false;
          if (
            filters.industries.length &&
            !filters.industries.includes(f.industry)
          )
            return false;
          if (
            filters.skills.length &&
            !filters.skills.some((s) => f.skills.includes(s))
          )
            return false;
          if (
            filters.budgetMin !== undefined &&
            f.hourlyRateMax < filters.budgetMin
          )
            return false;
          if (
            filters.budgetMax !== undefined &&
            f.hourlyRateMin > filters.budgetMax
          )
            return false;
          if (filters.country && f.country !== filters.country) return false;
          if (filters.region && f.region !== filters.region) return false;
          if (filters.location && f.location !== filters.location) return false;
          return true;
        }).map((f) => ({ kind: "freelancer" as const, ...f }))
      : [];

    const combined: SearchResult[] = [...projects, ...freelancers];

    return combined.sort((a, b) => {
      if (sort === "newest") {
        const aDate =
          a.kind === "project" ? new Date(a.publishedAt).getTime() : 0;
        const bDate =
          b.kind === "project" ? new Date(b.publishedAt).getTime() : 0;
        return bDate - aDate;
      }
      if (sort === "rate-asc") {
        const aRate =
          a.kind === "project"
            ? a.budgetMin ?? Number.POSITIVE_INFINITY
            : a.hourlyRateMin;
        const bRate =
          b.kind === "project"
            ? b.budgetMin ?? Number.POSITIVE_INFINITY
            : b.hourlyRateMin;
        return aRate - bRate;
      }
      if (sort === "rate-desc") {
        const aRate =
          a.kind === "project"
            ? a.budgetMax ?? Number.NEGATIVE_INFINITY
            : a.hourlyRateMax;
        const bRate =
          b.kind === "project"
            ? b.budgetMax ?? Number.NEGATIVE_INFINITY
            : b.hourlyRateMax;
        return bRate - aRate;
      }
      return 0;
    });
  }, [filters, sort]);

  const projectCount = results.filter((r) => r.kind === "project").length;
  const freelancerCount = results.filter((r) => r.kind === "freelancer").length;

  return (
    <div className="bg-ink-50/50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-balance text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
              {results.length.toLocaleString("de-DE")} Treffer
            </h1>
            <p className="mt-1 text-sm text-ink-500">
              {projectCount} Projekt{projectCount === 1 ? "" : "e"} ·{" "}
              {freelancerCount} Profil
              {freelancerCount === 1 ? "" : "e"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="inline-flex rounded-lg border border-ink-200 bg-white p-0.5">
              <button
                type="button"
                aria-label="Listenansicht"
                aria-pressed={view === "list"}
                onClick={() => setView("list")}
                className={cn(
                  "inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors",
                  view === "list"
                    ? "bg-brand-600 text-white"
                    : "text-ink-500 hover:text-brand-700",
                )}
              >
                <List className="h-4 w-4" aria-hidden />
              </button>
              <button
                type="button"
                aria-label="Kartenansicht"
                aria-pressed={view === "grid"}
                onClick={() => setView("grid")}
                className={cn(
                  "inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors",
                  view === "grid"
                    ? "bg-brand-600 text-white"
                    : "text-ink-500 hover:text-brand-700",
                )}
              >
                <LayoutGrid className="h-4 w-4" aria-hidden />
              </button>
            </div>
            <label className="inline-flex items-center gap-2 text-sm">
              <span className="text-ink-500">Sortieren</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOrder)}
                className="h-10 rounded-lg border border-ink-200 bg-white px-3 text-sm text-ink-800 focus:border-brand-300 focus:outline-none"
              >
                <option value="newest">Neueste</option>
                <option value="relevance">Relevanz</option>
                <option value="rate-asc">Stundensatz ↑</option>
                <option value="rate-desc">Stundensatz ↓</option>
              </select>
            </label>
          </div>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-[18rem_1fr]">
          <SearchFiltersPanel
            filters={filters}
            onChange={setFilters}
            onReset={resetFilters}
          />

          <section aria-label="Suchergebnisse" className="space-y-4">
            <ActiveFilterPills
              filters={filters}
              onChange={setFilters}
              onResetAll={resetFilters}
            />

            {showJobAlertHint && (
              <JobAlertHint filterSummary={filterSummary(filters)} />
            )}

            {results.length === 0 ? (
              <EmptyState
                filters={filters}
                onApplyIndustry={(industry) =>
                  setFilters({ ...filters, industries: [industry] })
                }
                onReset={resetFilters}
              />
            ) : view === "list" ? (
              <div className="overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-soft">
                <ul>
                  {results.map((r) => (
                    <li key={`${r.kind}-${r.id}`}>
                      {r.kind === "project" ? (
                        <ProjectListItem project={r} />
                      ) : (
                        <FreelancerListItem freelancer={r} />
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <ul className="grid gap-4 md:grid-cols-2">
                {results.map((r) => (
                  <li key={`${r.kind}-${r.id}`}>
                    {r.kind === "project" ? (
                      <ProjectCard project={r} />
                    ) : (
                      <FreelancerCard freelancer={r} />
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function countActiveFilters(f: SearchFilters): number {
  return (
    (f.query ? 1 : 0) +
    f.workMode.length +
    f.contractTypes.length +
    f.industries.length +
    f.skills.length +
    (f.country ? 1 : 0) +
    (f.region ? 1 : 0) +
    (f.location ? 1 : 0) +
    (f.postalCode ? 1 : 0) +
    (f.budgetMin !== undefined ? 1 : 0) +
    (f.budgetMax !== undefined ? 1 : 0) +
    (f.excludeNoRate ? 1 : 0)
  );
}

function filterSummary(f: SearchFilters): string {
  const parts: string[] = [];
  if (f.industries.length === 1) parts.push(f.industries[0]);
  else if (f.industries.length > 1) parts.push(`${f.industries.length} Branchen`);
  if (f.location) parts.push(f.location);
  else if (f.region) parts.push(f.region);
  if (f.workMode.length) parts.push(f.workMode.join(" / "));
  return parts.slice(0, 3).join(" · ");
}

function JobAlertHint({ filterSummary }: { filterSummary: string }) {
  return (
    <div className="flex flex-col items-start justify-between gap-3 rounded-xl border border-brand-100 bg-brand-50/60 px-4 py-3 sm:flex-row sm:items-center">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-brand-700 ring-1 ring-brand-100">
          <BellRing className="h-4 w-4" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium text-ink-900">
            Neue Projekte für diese Suche per E-Mail erhalten
          </p>
          {filterSummary && (
            <p className="mt-0.5 truncate text-xs text-ink-500">
              {filterSummary}
            </p>
          )}
        </div>
      </div>
      <Link
        href="/register?role=freelancer&intent=jobalert"
        className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-brand-700 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-800"
      >
        Job-Alert erstellen
      </Link>
    </div>
  );
}

function EmptyState({
  filters,
  onApplyIndustry,
  onReset,
}: {
  filters: SearchFilters;
  onApplyIndustry: (industry: string) => void;
  onReset: () => void;
}) {
  const relatedIndustries = getRelatedIndustries(filters);

  return (
    <div className="rounded-2xl border border-dashed border-ink-200 bg-white p-10 text-center">
      <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-ink-50 text-ink-500">
        <SearchX className="h-5 w-5" aria-hidden />
      </span>
      <h2 className="mt-4 text-lg font-semibold tracking-tight text-ink-900">
        Keine Treffer
        {filters.query && (
          <>
            {" "}
            für <span className="text-brand-700">„{filters.query}"</span>
          </>
        )}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink-500">
        Lockern Sie einzelne Filter oder probieren Sie eine verwandte Branche.
      </p>

      {relatedIndustries.length > 0 && (
        <div className="mx-auto mt-6 flex max-w-md flex-wrap justify-center gap-2">
          {relatedIndustries.map((ind) => (
            <button
              key={ind}
              type="button"
              onClick={() => onApplyIndustry(ind)}
              className="rounded-full border border-ink-200 bg-white px-3 py-1.5 text-xs font-medium text-ink-700 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
            >
              {ind}
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={onReset}
        className="mt-6 text-sm font-medium text-brand-700 underline-offset-2 hover:text-brand-800 hover:underline"
      >
        Alle Filter zurücksetzen
      </button>
    </div>
  );
}

function getRelatedIndustries(filters: SearchFilters): string[] {
  if (filters.industries.length === 0) {
    return INDUSTRY_GROUPS[0].items.slice(0, 4) as string[];
  }
  const seen = new Set(filters.industries);
  const related: string[] = [];
  for (const ind of filters.industries) {
    const group = findIndustryGroupByItem(ind);
    if (!group) continue;
    for (const sibling of group.items) {
      if (!seen.has(sibling) && related.length < 4) {
        related.push(sibling);
        seen.add(sibling);
      }
    }
  }
  return related;
}
