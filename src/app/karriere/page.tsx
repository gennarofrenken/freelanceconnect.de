import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Karriere",
  description:
    "Offene Stellen bei FreelanceConnect — Engineering, Product, Operations. Remote-first aus der DACH-Region.",
};

const OPENINGS = [
  {
    title: "Senior Full-Stack Engineer (TypeScript / Next.js)",
    team: "Engineering",
    location: "Berlin / Remote",
    type: "Festanstellung",
    summary:
      "Sie verantworten Kernbereiche unserer Plattform: vom Such-Stack bis zur Vertragsabwicklung. Erfahrung mit React, Next.js, Postgres und sauberem Domain-Modelling vorausgesetzt.",
  },
  {
    title: "Product Designer (B2B SaaS)",
    team: "Product",
    location: "Remote (DACH)",
    type: "Festanstellung",
    summary:
      "Sie übernehmen die End-to-End-Verantwortung für unsere Suche und Detailseiten — von Research bis Production. Erfahrung mit komplexen Datenflächen und Design Systems benötigt.",
  },
  {
    title: "Legal Counsel / Datenschutz (Teilzeit, m/w/d)",
    team: "Operations",
    location: "Berlin",
    type: "Festanstellung 50 %",
    summary:
      "Sie sind unsere zentrale Ansprechperson für AÜG-Abgrenzung, AGB-Pflege, DSGVO und Vertragsfragen mit Kunden und Freelancern.",
  },
];

const BENEFITS = [
  "30 Urlaubstage + zusätzliche Brückentage",
  "Voll remote-fähig — Büro in Berlin auf Wunsch",
  "Hochwertige Arbeitsausstattung inkl. Mobiliar",
  "Jährliches Lern-Budget i. H. v. 2.500 €",
  "Beteiligung am Unternehmenserfolg (VSOP)",
  "Betriebliche Altersvorsorge",
];

export default function KarrierePage() {
  return (
    <div>
      <section className="bg-hero-glow">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
            Karriere
          </p>
          <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
            Bauen Sie mit an einer fairen Plattform für die DACH-Tech-Szene
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ink-600">
            FreelanceConnect ist ein kleines, fokussiertes Team. Wir arbeiten
            remote-first, mit klarer Verantwortung und ohne Bullshit-Prozesse.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <header className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight text-ink-900">
            Offene Stellen
          </h2>
          <p className="text-sm text-ink-500">{OPENINGS.length} aktive Stellen</p>
        </header>

        <ul className="mt-8 space-y-3">
          {OPENINGS.map((job) => (
            <li
              key={job.title}
              className="group rounded-2xl border border-ink-200 bg-white p-6 transition-colors hover:border-brand-300"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="brand">{job.team}</Badge>
                    <Badge tone="neutral">{job.type}</Badge>
                  </div>
                  <h3 className="mt-2 text-base font-semibold tracking-tight text-ink-900 group-hover:text-brand-700">
                    {job.title}
                  </h3>
                  <div className="mt-1 inline-flex items-center gap-1.5 text-xs text-ink-500">
                    <MapPin className="h-3.5 w-3.5" aria-hidden />
                    {job.location}
                  </div>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-600">
                    {job.summary}
                  </p>
                </div>
                <Button href="/kontakt" variant="outline" size="md">
                  Jetzt bewerben
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-sm text-ink-500">
          Keine passende Stelle dabei? Wir freuen uns trotzdem über
          Initiativbewerbungen unter{" "}
          <Link
            href="mailto:karriere@freelanceconnect.de"
            className="text-brand-700 underline-offset-2 hover:underline"
          >
            karriere@freelanceconnect.de
          </Link>
          .
        </p>
      </section>

      <section className="bg-ink-50/40">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight text-ink-900">
            Was wir bieten
          </h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((b) => (
              <li
                key={b}
                className="rounded-xl border border-ink-200 bg-white px-5 py-4 text-sm text-ink-700"
              >
                {b}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
