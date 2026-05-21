"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, Lock, MapPin, Star } from "lucide-react";
import type { Freelancer } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { AVAILABILITY_LABEL, WORK_MODE_LABEL, formatRate } from "@/lib/utils";
import {
  canViewFreelancerIdentity,
  maskFreelancerName,
  useAuth,
} from "@/lib/auth";

export function FreelancerCard({ freelancer }: { freelancer: Freelancer }) {
  const { user } = useAuth();
  const showIdentity = canViewFreelancerIdentity(user);
  const displayName = showIdentity
    ? freelancer.fullName
    : maskFreelancerName(freelancer.fullName);

  return (
    <Link
      href={`/freelancers/${freelancer.id}`}
      className="group flex h-full flex-col rounded-2xl border border-ink-200 bg-white p-6 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-elevated"
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-semibold text-white shadow-soft"
        >
          {freelancer.initials}
        </span>
        <div className="min-w-0 flex-1">
          <h3
            className="flex items-center gap-1 truncate text-[15px] font-semibold tracking-tight text-ink-900 group-hover:text-brand-700"
            title={
              showIdentity
                ? undefined
                : "Vollständiger Name nur für lizenzierte Recruiter sichtbar"
            }
          >
            {!showIdentity && (
              <Lock className="h-3 w-3 shrink-0 text-ink-400" aria-hidden />
            )}
            <span className="truncate">{displayName}</span>
            {freelancer.isVerified && (
              <BadgeCheck
                className="h-4 w-4 shrink-0 text-brand-600"
                aria-label="Verifiziert"
              />
            )}
          </h3>
          <p className="truncate text-xs text-ink-500">{freelancer.title}</p>
        </div>
        {freelancer.isTopRated && <Badge tone="accent">Top-Rated</Badge>}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-500">
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" aria-hidden />
          {showIdentity ? freelancer.location : freelancer.region ?? "DACH"}
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

      <p className="mt-3 text-sm leading-relaxed text-ink-500">
        {AVAILABILITY_LABEL[freelancer.availability]}
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {freelancer.skills.slice(0, 4).map((s) => (
          <Badge key={s} tone="neutral">
            {s}
          </Badge>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between pt-6">
        <p className="text-sm font-semibold tracking-tight text-ink-900">
          {formatRate(
            freelancer.hourlyRateMin,
            freelancer.hourlyRateMax,
            "hour",
          )}
        </p>
        <span className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 group-hover:text-brand-700">
          Profil
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </span>
      </div>
    </Link>
  );
}
