"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Flame,
  Lock,
  MapPin,
  Sparkles,
} from "lucide-react";
import type { Project } from "@/types";
import { Badge } from "@/components/ui/Badge";
import {
  CONTRACT_TYPE_LABEL,
  WORK_MODE_LABEL,
  formatRate,
  relativeTime,
} from "@/lib/utils";
import { useAuth, maskCompany } from "@/lib/auth";

export function ProjectListItem({ project }: { project: Project }) {
  const { user } = useAuth();
  const showCompany = !!user;
  const companyLabel = showCompany ? project.company : maskCompany(project.company);

  return (
    <Link
      href={`/projects/${project.id}`}
      className="group relative grid grid-cols-1 gap-4 border-b border-ink-100 bg-white px-4 py-5 transition-colors hover:bg-brand-50/40 sm:grid-cols-[1fr_auto] sm:px-6 sm:py-6"
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2 text-xs text-ink-500">
          <span
            className={`inline-flex items-center gap-1 font-medium ${showCompany ? "text-ink-700" : "text-ink-500"}`}
            title={showCompany ? undefined : "Auftraggeber sichtbar nach Login"}
          >
            {!showCompany && <Lock className="h-3 w-3" aria-hidden />}
            {companyLabel}
          </span>
          <span aria-hidden>·</span>
          <span>{relativeTime(project.publishedAt)}</span>
          {project.isTopProject && (
            <Badge tone="accent">
              <Sparkles className="h-3 w-3" aria-hidden />
              Top
            </Badge>
          )}
          {project.isUrgent && !project.isTopProject && (
            <Badge tone="warning">
              <Flame className="h-3 w-3" aria-hidden />
              Dringend
            </Badge>
          )}
          <Badge tone="outline">{CONTRACT_TYPE_LABEL[project.contractType]}</Badge>
        </div>

        <h3 className="mt-1.5 text-[17px] font-semibold leading-snug tracking-tight text-ink-900 group-hover:text-brand-700">
          {project.title}
        </h3>

        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-600">
          {project.description}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-ink-500">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" aria-hidden />
            {project.location} · {project.region ?? project.country}
          </span>
          <span aria-hidden>·</span>
          <span>{WORK_MODE_LABEL[project.workMode]}</span>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden />
            Start {new Date(project.startDate).toLocaleDateString("de-DE")}
          </span>
          {project.durationMonths !== undefined && (
            <>
              <span aria-hidden>·</span>
              <span>{project.durationMonths} Monate</span>
            </>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.skills.slice(0, 5).map((s) => (
            <Badge key={s} tone="brand">
              {s}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-end justify-between gap-3 sm:min-w-32 sm:text-right">
        <p className="text-[15px] font-bold tracking-tight text-ink-900">
          {project.rateUndisclosed
            ? "Auf Anfrage"
            : formatRate(project.budgetMin, project.budgetMax, project.budgetUnit)}
        </p>
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 group-hover:text-brand-700">
          Details
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </span>
      </div>
    </Link>
  );
}
