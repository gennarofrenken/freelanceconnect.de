"use client";

import { ChangeEvent, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { INDUSTRY_GROUPS, CONTRACT_TYPES } from "@/constants/industries";
import {
  TOP_SKILLS,
  CITIES,
  COUNTRIES,
  REGIONS_BY_COUNTRY,
  PROJECT_MONTHS,
  MONTHS_DE,
} from "@/constants/skills";
import type { ContractType, Country, SearchFilters, WorkMode } from "@/types";
import { cn } from "@/lib/utils";

const WORK_MODES: { value: WorkMode; label: string }[] = [
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "onsite", label: "Vor-Ort" },
];

const CURRENT_YEAR = new Date().getFullYear();
const START_YEARS = [CURRENT_YEAR, CURRENT_YEAR + 1, CURRENT_YEAR + 2];

interface Props {
  filters: SearchFilters;
  onChange: (next: SearchFilters) => void;
  onReset: () => void;
}

export function SearchFiltersPanel({ filters, onChange, onReset }: Props) {
  function update<K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) {
    onChange({ ...filters, [key]: value });
  }

  function toggleArray<K extends "workMode" | "industries" | "skills" | "contractTypes">(
    key: K,
    value: string,
  ) {
    const current = filters[key] as string[];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    update(key, next as SearchFilters[K]);
  }

  const activeCount =
    filters.workMode.length +
    filters.contractTypes.length +
    filters.industries.length +
    filters.skills.length +
    (filters.country ? 1 : 0) +
    (filters.region ? 1 : 0) +
    (filters.location ? 1 : 0) +
    (filters.postalCode ? 1 : 0) +
    (filters.budgetMin !== undefined ? 1 : 0) +
    (filters.budgetMax !== undefined ? 1 : 0) +
    (filters.excludeNoRate ? 1 : 0) +
    (filters.startMonth ? 1 : 0) +
    (filters.startYear ? 1 : 0) +
    (filters.durationMonthsMin ? 1 : 0) +
    (filters.durationMonthsMax ? 1 : 0);

  const availableRegions = filters.country
    ? REGIONS_BY_COUNTRY[filters.country]
    : [];

  return (
    <aside className="lg:sticky lg:top-32 lg:max-h-[calc(100vh-9rem)] lg:overflow-y-auto">
      <div className="rounded-2xl border border-ink-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-tight text-ink-900">
            Filter
            {activeCount > 0 && (
              <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-50 px-1.5 text-xs font-medium text-brand-700">
                {activeCount}
              </span>
            )}
          </h2>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1 text-xs font-medium text-ink-500 hover:text-brand-700"
            >
              <X className="h-3.5 w-3.5" aria-hidden />
              Zurücksetzen
            </button>
          )}
        </div>

        <FilterGroup label="Suchbegriff" defaultOpen>
          <input
            type="search"
            value={filters.query}
            onChange={(e) => update("query", e.target.value)}
            placeholder="z. B. React, SAP, Berlin"
            className="h-10 w-full rounded-lg border border-ink-200 bg-white px-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-300 focus:outline-none"
          />
        </FilterGroup>

        <FilterGroup label="Ergebnistyp" defaultOpen>
          <div className="grid grid-cols-3 gap-1.5">
            {(["all", "projects", "freelancers"] as const).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => update("type", opt)}
                className={cn(
                  "rounded-lg border px-2 py-2 text-xs font-medium transition-colors",
                  filters.type === opt
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "border-ink-200 bg-white text-ink-700 hover:border-brand-300",
                )}
              >
                {opt === "all" ? "Alle" : opt === "projects" ? "Projekte" : "Freelancer"}
              </button>
            ))}
          </div>
        </FilterGroup>

        <FilterGroup label="Vertragstyp" defaultOpen>
          <div className="flex flex-wrap gap-1.5">
            {CONTRACT_TYPES.map((ct) => (
              <Chip
                key={ct.value}
                active={filters.contractTypes.includes(ct.value as ContractType)}
                onClick={() => toggleArray("contractTypes", ct.value)}
              >
                {ct.label}
              </Chip>
            ))}
          </div>
        </FilterGroup>

        <FilterGroup label="Arbeitsmodell" defaultOpen>
          <div className="flex flex-wrap gap-1.5">
            {WORK_MODES.map((m) => (
              <Chip
                key={m.value}
                active={filters.workMode.includes(m.value)}
                onClick={() => toggleArray("workMode", m.value)}
              >
                {m.label}
              </Chip>
            ))}
          </div>
        </FilterGroup>

        <FilterGroup label="Leistungsort">
          <div className="space-y-2.5">
            <select
              value={filters.country ?? ""}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                const c = (e.target.value || undefined) as Country | undefined;
                onChange({
                  ...filters,
                  country: c,
                  region: undefined,
                });
              }}
              className="h-10 w-full rounded-lg border border-ink-200 bg-white px-3 text-sm text-ink-900 focus:border-brand-300 focus:outline-none"
            >
              <option value="">Alle Länder</option>
              {COUNTRIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>

            <select
              value={filters.region ?? ""}
              onChange={(e) => update("region", e.target.value || undefined)}
              disabled={!filters.country}
              className="h-10 w-full rounded-lg border border-ink-200 bg-white px-3 text-sm text-ink-900 focus:border-brand-300 focus:outline-none disabled:cursor-not-allowed disabled:bg-ink-50 disabled:text-ink-400"
            >
              <option value="">
                {filters.country ? "Alle Bundesländer/Regionen" : "Erst Land wählen"}
              </option>
              {availableRegions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            <select
              value={filters.location ?? ""}
              onChange={(e) => update("location", e.target.value || undefined)}
              className="h-10 w-full rounded-lg border border-ink-200 bg-white px-3 text-sm text-ink-900 focus:border-brand-300 focus:outline-none"
            >
              <option value="">Alle Städte</option>
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <input
              type="text"
              inputMode="numeric"
              value={filters.postalCode ?? ""}
              onChange={(e) => update("postalCode", e.target.value || undefined)}
              placeholder="PLZ (z. B. 10115)"
              className="h-10 w-full rounded-lg border border-ink-200 bg-white px-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-300 focus:outline-none"
            />

            <div>
              <input
                type="range"
                min={0}
                max={200}
                step={10}
                value={filters.radius ?? 0}
                onChange={(e) => update("radius", Number(e.target.value))}
                className="w-full accent-brand-600"
                disabled={!filters.location && !filters.postalCode}
              />
              <p className="mt-1 text-xs text-ink-500">
                {filters.location || filters.postalCode
                  ? `Umkreis ${filters.radius ?? 0} km`
                  : "Stadt oder PLZ wählen, um Umkreis zu nutzen"}
              </p>
            </div>
          </div>
        </FilterGroup>

        <FilterGroup label="Stundensatz / Tagessatz">
          <div className="flex items-center gap-2">
            <NumberInput
              label="von"
              value={filters.budgetMin}
              onChange={(v) => update("budgetMin", v)}
            />
            <span className="text-ink-400">–</span>
            <NumberInput
              label="bis"
              value={filters.budgetMax}
              onChange={(v) => update("budgetMax", v)}
            />
            <span className="text-xs text-ink-500">€</span>
          </div>
          <label className="mt-3 flex cursor-pointer items-start gap-2 text-xs text-ink-700">
            <input
              type="checkbox"
              checked={filters.excludeNoRate}
              onChange={(e) => update("excludeNoRate", e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-300"
            />
            <span>
              Projekte ohne angegebenen Stundensatz{" "}
              <span className="text-ink-500">ausschließen</span>
            </span>
          </label>
        </FilterGroup>

        <FilterGroup label="Projektstart">
          <div className="grid grid-cols-2 gap-2">
            <select
              value={filters.startMonth ?? ""}
              onChange={(e) =>
                update(
                  "startMonth",
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
              className="h-10 w-full rounded-lg border border-ink-200 bg-white px-3 text-sm text-ink-900 focus:border-brand-300 focus:outline-none"
            >
              <option value="">Monat</option>
              {MONTHS_DE.map((m, i) => (
                <option key={m} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={filters.startYear ?? ""}
              onChange={(e) =>
                update(
                  "startYear",
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
              className="h-10 w-full rounded-lg border border-ink-200 bg-white px-3 text-sm text-ink-900 focus:border-brand-300 focus:outline-none"
            >
              <option value="">Jahr</option>
              {START_YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </FilterGroup>

        <FilterGroup label="Projektdauer (Monate)">
          <div className="flex flex-wrap gap-1.5">
            {PROJECT_MONTHS.map((d) => {
              const active = filters.durationMonthsMax === d.value;
              return (
                <Chip
                  key={d.value}
                  active={active}
                  onClick={() =>
                    update(
                      "durationMonthsMax",
                      active ? undefined : d.value,
                    )
                  }
                >
                  bis {d.label}
                </Chip>
              );
            })}
          </div>
        </FilterGroup>

        <FilterGroup label="Branche">
          <div className="max-h-64 space-y-3 overflow-y-auto pr-1">
            {INDUSTRY_GROUPS.map((group) => (
              <div key={group.label}>
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-400">
                  {group.label}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {group.items.map((i) => (
                    <Chip
                      key={i}
                      active={filters.industries.includes(i)}
                      onClick={() => toggleArray("industries", i)}
                    >
                      {i}
                    </Chip>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </FilterGroup>

        <FilterGroup label="Skills">
          <div className="flex max-h-52 flex-wrap gap-1.5 overflow-y-auto pr-1">
            {TOP_SKILLS.map((s) => (
              <Chip
                key={s}
                active={filters.skills.includes(s)}
                onClick={() => toggleArray("skills", s)}
              >
                {s}
              </Chip>
            ))}
          </div>
        </FilterGroup>
      </div>
    </aside>
  );
}

function FilterGroup({
  label,
  children,
  defaultOpen = false,
}: {
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mt-5 border-t border-ink-100 pt-4 first:mt-5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-500">
          {label}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-ink-400 transition-transform",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
        active
          ? "border-brand-600 bg-brand-600 text-white"
          : "border-ink-200 bg-white text-ink-700 hover:border-brand-300 hover:text-brand-700",
      )}
    >
      {children}
    </button>
  );
}

function NumberInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | undefined;
  onChange: (n: number | undefined) => void;
}) {
  return (
    <label className="flex-1">
      <span className="sr-only">{label}</span>
      <input
        type="number"
        inputMode="numeric"
        min={0}
        placeholder={label}
        value={value ?? ""}
        onChange={(e) =>
          onChange(e.target.value === "" ? undefined : Number(e.target.value))
        }
        className="h-10 w-full rounded-lg border border-ink-200 bg-white px-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-300 focus:outline-none"
      />
    </label>
  );
}
