"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, Clock4, Lock, MapPin, Star } from "lucide-react";
import type { Freelancer } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { AVAILABILITY_LABEL, WORK_MODE_LABEL, formatRate } from "@/lib/utils";
import {
  canViewFreelancerIdentity,
  maskFreelancerName,
  useAuth,
} from "@/lib/auth";

export function FreelancerListItem({ freelancer }: { freelancer: Freelancer }) {
  const { user } = useAuth();
  const showIdentity = canViewFreelancerIdentity(user);
  const displayName = showIdentity
    ? freelancer.fullName
    : maskFreelancerName(freelancer.fullName);

  return (
    <Link
      href={`/freelancers/${freelancer.id}`}
      className="group relative grid grid-cols-1 gap-4 border-b border-ink-100 bg-white px-4 py-5 transition-colors hover:bg-brand-50/40 sm:grid-cols-[auto_1fr_auto] sm:items-start sm:px-6 sm:py-6"
    >
      <span
        aria-hidden
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-semibold text-white shadow-soft"
      >
        {freelancer.initials}
      </span>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2 text-xs text-ink-500">
          <span className="inline-flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-accent-500 text-accent-500" aria-hidden />
            <span className="font-semibold text-ink-800">
              {freelancer.rating.toFixed(1)}
            </span>
            <span>({freelancer.reviewsCount} Bewertungen)</span>
          </span>
          {freelancer.isTopRated && <Badge tone="accent">Top-Rated</Badge>}
          {freelancer.isVerified && (
            <span className="inline-flex items-center gap-1 text-brand-700">
              <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
              Verifiziert
            </span>
          )}
        </div>

        <h3
          className="mt-1.5 inline-flex items-center gap-1.5 text-[17px] font-semibold leading-snug tracking-tight text-ink-900 group-hover:text-brand-700"
          title={
            showIdentity
              ? undefined
              : "Vollständiger Name nur für lizenzierte Recruiter sichtbar"
          }
        >
          {!showIdentity && (
            <Lock className="h-3.5 w-3.5 text-ink-400" aria-hidden />
          )}
          {displayName}
        </h3>
        <p className="text-sm text-ink-600">{freelancer.title}</p>

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-600">
          {freelancer.bio}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-ink-500">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" aria-hidden />
            {showIdentity ? freelancer.location : freelancer.region ?? "DACH"}
          </span>
          <span aria-hidden>·</span>
          <span>{WORK_MODE_LABEL[freelancer.workMode]}</span>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1">
            <Clock4 className="h-3.5 w-3.5" aria-hidden />
            {AVAILABILITY_LABEL[freelancer.availability]}
          </span>
          <span aria-hidden>·</span>
          <span>{freelancer.yearsExperience} Jahre Erfahrung</span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {freelancer.skills.slice(0, 5).map((s) => (
            <Badge key={s} tone="brand">
              {s}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-end justify-between gap-3 sm:min-w-32 sm:text-right">
        <p className="text-[15px] font-bold tracking-tight text-ink-900">
          {formatRate(
            freelancer.hourlyRateMin,
            freelancer.hourlyRateMax,
            "hour",
          )}
        </p>
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 group-hover:text-brand-700">
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
