"use client";

import { X } from "lucide-react";
import { CONTRACT_TYPES } from "@/constants/industries";
import type { ContractType, SearchFilters, WorkMode } from "@/types";

const WORK_MODE_LABEL: Record<WorkMode, string> = {
  remote: "Remote",
  hybrid: "Hybrid",
  onsite: "Vor-Ort",
};

const CONTRACT_LABEL: Record<string, string> = Object.fromEntries(
  CONTRACT_TYPES.map((c) => [c.value, c.label]),
);

interface Pill {
  key: string;
  label: string;
  onRemove: () => void;
}

interface Props {
  filters: SearchFilters;
  onChange: (next: SearchFilters) => void;
  onResetAll: () => void;
}

export function ActiveFilterPills({ filters, onChange, onResetAll }: Props) {
  const pills: Pill[] = [];

  if (filters.query) {
    pills.push({
      key: "query",
      label: `„${filters.query}"`,
      onRemove: () => onChange({ ...filters, query: "" }),
    });
  }

  for (const m of filters.workMode) {
    pills.push({
      key: `workMode-${m}`,
      label: WORK_MODE_LABEL[m],
      onRemove: () =>
        onChange({
          ...filters,
          workMode: filters.workMode.filter((v) => v !== m),
        }),
    });
  }

  for (const ct of filters.contractTypes) {
    pills.push({
      key: `contract-${ct}`,
      label: CONTRACT_LABEL[ct] ?? ct,
      onRemove: () =>
        onChange({
          ...filters,
          contractTypes: filters.contractTypes.filter(
            (v) => v !== (ct as ContractType),
          ),
        }),
    });
  }

  for (const ind of filters.industries) {
    pills.push({
      key: `industry-${ind}`,
      label: ind,
      onRemove: () =>
        onChange({
          ...filters,
          industries: filters.industries.filter((v) => v !== ind),
        }),
    });
  }

  for (const sk of filters.skills) {
    pills.push({
      key: `skill-${sk}`,
      label: sk,
      onRemove: () =>
        onChange({
          ...filters,
          skills: filters.skills.filter((v) => v !== sk),
        }),
    });
  }

  if (filters.country) {
    pills.push({
      key: "country",
      label: filters.country,
      onRemove: () =>
        onChange({ ...filters, country: undefined, region: undefined }),
    });
  }

  if (filters.region) {
    pills.push({
      key: "region",
      label: filters.region,
      onRemove: () => onChange({ ...filters, region: undefined }),
    });
  }

  if (filters.location) {
    pills.push({
      key: "location",
      label: filters.location,
      onRemove: () => onChange({ ...filters, location: undefined }),
    });
  }

  if (filters.postalCode) {
    pills.push({
      key: "postalCode",
      label: `PLZ ${filters.postalCode}`,
      onRemove: () => onChange({ ...filters, postalCode: undefined }),
    });
  }

  if (filters.budgetMin !== undefined || filters.budgetMax !== undefined) {
    const min = filters.budgetMin ?? "?";
    const max = filters.budgetMax ?? "?";
    pills.push({
      key: "budget",
      label: `${min} – ${max} €`,
      onRemove: () =>
        onChange({
          ...filters,
          budgetMin: undefined,
          budgetMax: undefined,
        }),
    });
  }

  if (filters.excludeNoRate) {
    pills.push({
      key: "excludeNoRate",
      label: "Mit Stundensatz",
      onRemove: () => onChange({ ...filters, excludeNoRate: false }),
    });
  }

  if (pills.length === 0) return null;

  return (
    <div
      className="flex flex-wrap items-center gap-2"
      aria-label="Aktive Filter"
    >
      {pills.map((p) => (
        <button
          key={p.key}
          type="button"
          onClick={p.onRemove}
          className="group inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 py-1 pl-3 pr-2 text-xs font-medium text-brand-700 transition-colors hover:border-brand-300 hover:bg-brand-100"
        >
          <span className="max-w-[14rem] truncate">{p.label}</span>
          <X
            className="h-3.5 w-3.5 text-brand-600 transition-transform group-hover:scale-110"
            aria-hidden
          />
          <span className="sr-only">Filter entfernen</span>
        </button>
      ))}
      <button
        type="button"
        onClick={onResetAll}
        className="ml-1 text-xs font-medium text-ink-500 underline-offset-2 hover:text-brand-700 hover:underline"
      >
        Alle zurücksetzen
      </button>
    </div>
  );
}
