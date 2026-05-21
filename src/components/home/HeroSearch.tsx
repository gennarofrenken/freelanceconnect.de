"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { CITIES } from "@/constants/skills";

type SearchType = "projects" | "freelancers";

const POPULAR = [
  "SAP S/4HANA",
  "React",
  "DevOps",
  "Data Engineer",
  "Cyber Security",
  "Salesforce",
];

export function HeroSearch() {
  const router = useRouter();
  const [type, setType] = useState<SearchType>("projects");
  const [q, setQ] = useState("");
  const [where, setWhere] = useState("");

  function submit(forced?: { q?: string }) {
    const params = new URLSearchParams();
    params.set("type", type);
    const term = forced?.q ?? q;
    if (term.trim()) params.set("q", term.trim());
    if (where.trim()) params.set("ort", where.trim());
    router.push(`/search?${params.toString()}`);
  }

  return (
    <section className="relative isolate overflow-hidden bg-hero-glow">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-dot-grid opacity-50 [mask-image:radial-gradient(60%_55%_at_50%_0%,black,transparent)]"
      />
      <div className="mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pb-24 sm:pt-20 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white/85 px-3 py-1 text-xs font-semibold tracking-tight text-brand-700 shadow-soft backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Die Projektbörse für IT-Freelancer in der DACH-Region
          </span>
          <h1 className="mt-6 text-balance text-[40px] font-extrabold leading-[1.02] tracking-[-0.025em] text-ink-900 sm:text-[56px] md:text-[64px]">
            Finden Sie passende
            <br className="hidden sm:block" />{" "}
            <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
              Projekte und Experten.
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-[15px] leading-relaxed text-ink-600 sm:text-[17px]">
            Direkt verbunden — ohne Mittelmann, ohne Vermittlungsgebühr,
            ohne Vertragsbindung.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="mx-auto mt-9 max-w-3xl"
        >
          <div
            role="tablist"
            aria-label="Was suchen Sie?"
            className="mb-3 flex justify-center"
          >
            <div className="inline-flex rounded-full bg-white/90 p-1 ring-1 ring-ink-200 backdrop-blur">
              <Tab active={type === "projects"} onClick={() => setType("projects")}>
                Ich suche Projekte
              </Tab>
              <Tab
                active={type === "freelancers"}
                onClick={() => setType("freelancers")}
              >
                Ich suche Freelancer
              </Tab>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 rounded-2xl bg-white p-2 shadow-elevated ring-1 ring-ink-200 transition-shadow focus-within:ring-2 focus-within:ring-brand-400 sm:grid-cols-[1.5fr_1fr_auto]">
            <label className="relative">
              <span className="sr-only">Skill, Rolle oder Projekttitel</span>
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
                aria-hidden
              />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={
                  type === "projects"
                    ? "Skill, Rolle oder Projekttitel"
                    : "Skill, Rolle oder Spezialisierung"
                }
                className="h-12 w-full rounded-xl bg-transparent pl-11 pr-3 text-[15px] text-ink-900 placeholder:text-ink-400 focus:outline-none"
              />
            </label>

            <label className="relative sm:border-l sm:border-ink-100">
              <span className="sr-only">Stadt, Region oder Remote</span>
              <MapPin
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
                aria-hidden
              />
              <input
                type="search"
                list="city-suggestions"
                value={where}
                onChange={(e) => setWhere(e.target.value)}
                placeholder="Stadt, Region oder Remote"
                className="h-12 w-full rounded-xl bg-transparent pl-11 pr-3 text-[15px] text-ink-900 placeholder:text-ink-400 focus:outline-none"
              />
              <datalist id="city-suggestions">
                <option value="Remote" />
                {CITIES.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </label>

            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 text-sm font-semibold text-white shadow-soft transition-all hover:bg-brand-700 hover:shadow-elevated"
            >
              <Search className="h-4 w-4" aria-hidden />
              Suchen
            </button>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-2 gap-y-2">
            <span className="text-xs font-medium text-ink-500">Beliebt:</span>
            {POPULAR.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => {
                  setQ(term);
                  submit({ q: term });
                }}
                className="rounded-full border border-ink-200 bg-white px-3 py-1 text-xs font-medium text-ink-700 transition-colors hover:border-brand-300 hover:text-brand-700"
              >
                {term}
              </button>
            ))}
          </div>

          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-ink-600 sm:text-sm">
            <li className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-success-600" aria-hidden />
              0 % Vermittlungsgebühr
            </li>
            <li className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-success-600" aria-hidden />
              DSGVO-konform, EU-Hosting
            </li>
            <li className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-success-600" aria-hidden />
              Verifizierte Profile
            </li>
          </ul>
        </form>
      </div>
    </section>
  );
}

function Tab({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`rounded-full px-5 py-1.5 text-sm font-semibold tracking-tight transition-colors ${
        active
          ? "bg-brand-600 text-white shadow-soft"
          : "text-ink-600 hover:text-brand-700"
      }`}
    >
      {children}
    </button>
  );
}
