import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  Briefcase,
  Building2,
  Car,
  Factory,
  FlaskConical,
  GraduationCap,
  HardHat,
  Landmark,
  Lightbulb,
  MoreHorizontal,
  MonitorSmartphone,
  Plane,
  Radio,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  INDUSTRY_GROUPS,
  projectCountForGroup,
  type IndustryGroup,
  type IndustryGroupSlug,
} from "@/constants/industries";
import { MOCK_PROJECTS } from "@/constants/mock-data";

const GROUP_ICONS: Record<IndustryGroupSlug, LucideIcon> = {
  "it-software": MonitorSmartphone,
  telekommunikation: Radio,
  finanzdienstleistungen: Banknote,
  versicherungen: ShieldCheck,
  automotive: Car,
  "industrie-engineering": Factory,
  "energie-versorgung": Zap,
  bauwesen: HardHat,
  "life-sciences": FlaskConical,
  logistik: Truck,
  handel: ShoppingBag,
  "medien-marketing": Sparkles,
  "beratung-services": Lightbulb,
  "bildung-forschung": GraduationCap,
  "oeffentlicher-sektor": Landmark,
  "reise-touristik": Plane,
  sonstige: MoreHorizontal,
};

const PREVIEW_ITEMS = 3;

function getMockMatches(group: IndustryGroup): number {
  const items = group.items as readonly string[];
  return MOCK_PROJECTS.filter((p) => items.includes(p.industry)).length;
}

export function CategoryTiles() {
  const mockTotal = MOCK_PROJECTS.length;

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <header className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-balance text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
              Projekte nach Branche
            </h2>
            <p className="mt-2 text-ink-600">
              Vom IT-Architekten bis zum SAP-FI-Berater im Versicherungsumfeld
              — Projekte aus allen relevanten Branchen der DACH-Region.
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

        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRY_GROUPS.map((group) => {
            const Icon = GROUP_ICONS[group.slug];
            const count = projectCountForGroup(
              group,
              getMockMatches(group),
              mockTotal,
            );
            const items = group.items as readonly string[];
            const preview = items.slice(0, PREVIEW_ITEMS);
            const remaining = items.length - preview.length;

            return (
              <li key={group.slug}>
                <article className="group flex h-full flex-col rounded-2xl border border-ink-200 bg-white p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-elevated">
                  <Link
                    href={`/search?type=projects&group=${group.slug}`}
                    className="flex items-start gap-4"
                  >
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="truncate text-[15px] font-semibold tracking-tight text-ink-900 group-hover:text-brand-700">
                          {group.label}
                        </h3>
                        <span className="shrink-0 text-xs font-medium tabular-nums text-ink-500">
                          {count.toLocaleString("de-DE")}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-1 text-xs text-ink-500">
                        {group.blurb}
                      </p>
                    </div>
                  </Link>

                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {preview.map((item) => (
                      <li key={item}>
                        <Link
                          href={`/search?type=projects&industry=${encodeURIComponent(item)}`}
                          className="inline-flex items-center rounded-full border border-ink-200 bg-white px-2.5 py-1 text-[11px] font-medium text-ink-700 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                        >
                          {item}
                        </Link>
                      </li>
                    ))}
                    {remaining > 0 && (
                      <li>
                        <Link
                          href={`/search?type=projects&group=${group.slug}`}
                          className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium text-ink-500 hover:text-brand-700"
                        >
                          +{remaining} weitere
                        </Link>
                      </li>
                    )}
                  </ul>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
