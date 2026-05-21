"use client";

import Link from "next/link";
import { ArrowRight, Flame, Lock, MapPin, Sparkles } from "lucide-react";
import type { Project } from "@/types";
import { Badge } from "@/components/ui/Badge";
import {
  CONTRACT_TYPE_LABEL,
  WORK_MODE_LABEL,
  formatRate,
  relativeTime,
} from "@/lib/utils";
import { useAuth, maskCompany } from "@/lib/auth";

export function ProjectCard({ project }: { project: Project }) {
  const { user } = useAuth();
  const showCompany = !!user;
  const companyLabel = showCompany ? project.company : maskCompany(project.company);

  return (
    <Link
      href={`/projects/${project.id}`}
      className="group relative flex h-full flex-col rounded-2xl border border-ink-200 bg-white p-6 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-elevated"
    >
      {project.isTopProject && (
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl bg-gradient-to-r from-accent-400 to-accent-600"
        />
      )}
      <div className="flex items-center justify-between gap-3">
        <span
          className="inline-flex items-center gap-1 truncate text-xs font-medium tracking-tight text-ink-500"
          title={showCompany ? undefined : "Auftraggeber sichtbar nach Login"}
        >
          {!showCompany && <Lock className="h-3 w-3" aria-hidden />}
          {companyLabel}
        </span>
        {project.isTopProject ? (
          <Badge tone="accent">
            <Sparkles className="h-3 w-3" aria-hidden />
            Top-Projekt
          </Badge>
        ) : project.isUrgent ? (
          <Badge tone="warning">
            <Flame className="h-3 w-3" aria-hidden />
            Dringend
          </Badge>
        ) : null}
      </div>

      <h3 className="mt-3 text-[17px] font-semibold leading-snug tracking-tight text-ink-900 group-hover:text-brand-700">
        {project.title}
      </h3>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-500">
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" aria-hidden />
          {project.location}
        </span>
        <span>{WORK_MODE_LABEL[project.workMode]}</span>
        <span>{relativeTime(project.publishedAt)}</span>
      </div>

      <div className="mt-3">
        <Badge tone="outline">{CONTRACT_TYPE_LABEL[project.contractType]}</Badge>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.skills.slice(0, 4).map((s) => (
          <Badge key={s} tone="neutral">
            {s}
          </Badge>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between pt-6">
        <p className="text-sm font-semibold tracking-tight text-ink-900">
          {project.rateUndisclosed
            ? "Auf Anfrage"
            : formatRate(project.budgetMin, project.budgetMax, project.budgetUnit)}
        </p>
        <span className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 group-hover:text-brand-700">
          Ansehen
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </span>
      </div>
    </Link>
  );
}
