"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea, Checkbox } from "@/components/ui/Input";
import { INDUSTRIES } from "@/constants/industries";
import { TOP_SKILLS, CITIES } from "@/constants/skills";

const WORK_MODES = [
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "onsite", label: "Vor-Ort" },
] as const;

const DURATIONS = [
  { value: "short", label: "Kurzfristig (< 3 Monate)" },
  { value: "medium", label: "Mittelfristig (3–6 Monate)" },
  { value: "long", label: "Langfristig (6+ Monate)" },
] as const;

const BUDGET_UNITS = [
  { value: "hour", label: "pro Stunde" },
  { value: "day", label: "pro Tag" },
  { value: "project", label: "Pauschal" },
] as const;

export function CreateProjectView() {
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const next: Record<string, string> = {};

    const title = String(form.get("title") ?? "").trim();
    const description = String(form.get("description") ?? "").trim();
    const industry = String(form.get("industry") ?? "");
    const location = String(form.get("location") ?? "").trim();
    const skills = String(form.get("skills") ?? "").trim();
    const budgetMin = Number(form.get("budgetMin"));
    const budgetMax = Number(form.get("budgetMax"));
    const startDate = String(form.get("startDate") ?? "");
    const contactName = String(form.get("contactName") ?? "").trim();
    const contactEmail = String(form.get("contactEmail") ?? "").trim();
    const terms = form.get("terms") === "on";

    if (title.length < 8)
      next.title = "Bitte geben Sie einen aussagekräftigen Projekttitel ein.";
    if (description.length < 80)
      next.description =
        "Bitte beschreiben Sie das Projekt in mindestens 80 Zeichen.";
    if (!industry) next.industry = "Bitte wählen Sie eine Branche.";
    if (location.length < 2) next.location = "Bitte geben Sie einen Standort an.";
    if (skills.length < 2)
      next.skills = "Bitte nennen Sie mindestens eine relevante Qualifikation.";
    if (!Number.isFinite(budgetMin) || budgetMin <= 0)
      next.budgetMin = "Bitte geben Sie einen gültigen Mindestbudget-Wert ein.";
    if (!Number.isFinite(budgetMax) || budgetMax < budgetMin)
      next.budgetMax = "Maximalbudget muss größer oder gleich dem Minimum sein.";
    if (!startDate) next.startDate = "Bitte geben Sie ein Startdatum an.";
    if (contactName.length < 2)
      next.contactName = "Bitte geben Sie eine:n Ansprechpartner:in an.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail))
      next.contactEmail = "Bitte geben Sie eine gültige E-Mail-Adresse ein.";
    if (!terms) next.terms = "Bitte stimmen Sie AGB und Datenschutz zu.";

    setErrors(next);
    if (Object.keys(next).length > 0) {
      const first = document.querySelector<HTMLElement>(
        `[data-field="${Object.keys(next)[0]}"]`,
      );
      first?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setPending(true);
    setTimeout(() => {
      setPending(false);
      setDone(true);
    }, 900);
  }

  if (done) return <CreateSuccess />;

  return (
    <div className="bg-ink-50/40">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:py-14">
        <header>
          <p className="text-sm font-medium uppercase tracking-wider text-brand-700">
            Projekt einstellen
          </p>
          <h1 className="mt-2 text-balance text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
            Beschreiben Sie Ihr Projekt — wir bringen Ihnen passende Freelancer.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-600">
            Die Einstellung ist kostenfrei. Sie erhalten in der Regel innerhalb
            von 48 Stunden erste qualifizierte Bewerbungen. Pflichtfelder sind
            mit <span className="text-brand-600">*</span> gekennzeichnet.
          </p>
        </header>

        <form onSubmit={onSubmit} noValidate className="mt-10 space-y-8">
          <FormSection
            title="Projektkern"
            description="Was soll umgesetzt werden und in welchem Kontext?"
          >
            <div data-field="title">
              <Field
                label="Projekttitel"
                htmlFor="title"
                required
                error={errors.title}
                hint="z. B. „Senior React Entwickler:in für FinTech-Plattform“"
              >
                <Input
                  id="title"
                  name="title"
                  invalid={Boolean(errors.title)}
                  required
                />
              </Field>
            </div>

            <div data-field="description" className="mt-5">
              <Field
                label="Projektbeschreibung"
                htmlFor="description"
                required
                error={errors.description}
                hint="Aufgaben, Setup, Erwartungen, Schnittstellen, ggf. Branche/Industrie."
              >
                <Textarea
                  id="description"
                  name="description"
                  rows={7}
                  invalid={Boolean(errors.description)}
                  required
                />
              </Field>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div data-field="industry">
                <Field
                  label="Branche"
                  htmlFor="industry"
                  required
                  error={errors.industry}
                >
                  <Select
                    id="industry"
                    name="industry"
                    defaultValue=""
                    invalid={Boolean(errors.industry)}
                    required
                  >
                    <option value="" disabled>
                      Branche wählen …
                    </option>
                    {INDUSTRIES.map((i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>

              <div data-field="location">
                <Field
                  label="Standort"
                  htmlFor="location"
                  required
                  error={errors.location}
                  hint="Stadt oder Region — bei Remote optional."
                >
                  <Input
                    id="location"
                    name="location"
                    list="cities-suggestions"
                    invalid={Boolean(errors.location)}
                    required
                  />
                  <datalist id="cities-suggestions">
                    {CITIES.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </Field>
              </div>
            </div>

            <div data-field="skills" className="mt-5">
              <Field
                label="Skills / Qualifikationen"
                htmlFor="skills"
                required
                error={errors.skills}
                hint="Kommagetrennt — z. B. React, TypeScript, AWS, ISO 27001"
              >
                <Input
                  id="skills"
                  name="skills"
                  placeholder="React, TypeScript, AWS"
                  invalid={Boolean(errors.skills)}
                  required
                />
              </Field>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {TOP_SKILLS.slice(0, 12).map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-ink-100 px-2.5 py-0.5 text-[11px] font-medium text-ink-700"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </FormSection>

          <FormSection
            title="Konditionen"
            description="Rahmen für Budget, Dauer und Arbeitsmodell."
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div data-field="budgetMin">
                <Field
                  label="Budget — Min."
                  htmlFor="budgetMin"
                  required
                  error={errors.budgetMin}
                >
                  <Input
                    id="budgetMin"
                    name="budgetMin"
                    type="number"
                    min={0}
                    placeholder="z. B. 80"
                    invalid={Boolean(errors.budgetMin)}
                    required
                  />
                </Field>
              </div>

              <div data-field="budgetMax">
                <Field
                  label="Budget — Max."
                  htmlFor="budgetMax"
                  required
                  error={errors.budgetMax}
                >
                  <Input
                    id="budgetMax"
                    name="budgetMax"
                    type="number"
                    min={0}
                    placeholder="z. B. 110"
                    invalid={Boolean(errors.budgetMax)}
                    required
                  />
                </Field>
              </div>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-3">
              <Field label="Einheit" htmlFor="budgetUnit" required>
                <Select id="budgetUnit" name="budgetUnit" defaultValue="hour">
                  {BUDGET_UNITS.map((u) => (
                    <option key={u.value} value={u.value}>
                      {u.label}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Arbeitsmodell" htmlFor="workMode" required>
                <Select id="workMode" name="workMode" defaultValue="remote">
                  {WORK_MODES.map((u) => (
                    <option key={u.value} value={u.value}>
                      {u.label}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Dauer" htmlFor="duration" required>
                <Select id="duration" name="duration" defaultValue="medium">
                  {DURATIONS.map((u) => (
                    <option key={u.value} value={u.value}>
                      {u.label}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>

            <div data-field="startDate" className="mt-5">
              <Field
                label="Gewünschter Projektstart"
                htmlFor="startDate"
                required
                error={errors.startDate}
              >
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  invalid={Boolean(errors.startDate)}
                  required
                />
              </Field>
            </div>
          </FormSection>

          <FormSection
            title="Ansprechpartner"
            description="Wer steht den Bewerbern zur Verfügung?"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div data-field="contactName">
                <Field
                  label="Name"
                  htmlFor="contactName"
                  required
                  error={errors.contactName}
                >
                  <Input
                    id="contactName"
                    name="contactName"
                    autoComplete="name"
                    invalid={Boolean(errors.contactName)}
                    required
                  />
                </Field>
              </div>
              <div data-field="contactEmail">
                <Field
                  label="Geschäftliche E-Mail"
                  htmlFor="contactEmail"
                  required
                  error={errors.contactEmail}
                >
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    autoComplete="email"
                    invalid={Boolean(errors.contactEmail)}
                    required
                  />
                </Field>
              </div>
            </div>
          </FormSection>

          <div data-field="terms" className="rounded-2xl border border-ink-200 bg-white p-6">
            <Checkbox
              name="terms"
              label={
                <>
                  Ich bestätige, dass ich befugt bin, das Projekt im Namen
                  meines Unternehmens einzustellen, und akzeptiere die{" "}
                  <Link
                    href="/agb"
                    className="font-medium text-brand-700 underline-offset-2 hover:underline"
                  >
                    AGB
                  </Link>{" "}
                  und die{" "}
                  <Link
                    href="/datenschutz"
                    className="font-medium text-brand-700 underline-offset-2 hover:underline"
                  >
                    Datenschutzhinweise
                  </Link>
                  .
                </>
              }
            />
            {errors.terms && (
              <p className="mt-2 text-xs text-warning-700" role="alert">
                {errors.terms}
              </p>
            )}
          </div>

          <div className="flex flex-col items-stretch justify-end gap-3 sm:flex-row sm:items-center">
            <Button href="/dashboard" variant="ghost" size="md">
              Abbrechen
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={pending}
            >
              {pending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Wird veröffentlicht …
                </>
              ) : (
                <>
                  Projekt veröffentlichen
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-ink-200 bg-white p-6 sm:p-8">
      <header className="border-b border-ink-100 pb-5">
        <h2 className="text-base font-semibold tracking-tight text-ink-900">
          {title}
        </h2>
        <p className="mt-1 text-sm text-ink-500">{description}</p>
      </header>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function CreateSuccess() {
  return (
    <div className="bg-ink-50/40">
      <div className="mx-auto max-w-xl px-4 py-20 sm:px-6">
        <div className="rounded-2xl border border-success-500/20 bg-white p-8 text-center shadow-soft">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success-500/10 text-success-600">
            <Check className="h-7 w-7" aria-hidden />
          </span>
          <h1 className="mt-5 text-2xl font-semibold tracking-tight text-ink-900">
            Projekt zur Veröffentlichung übermittelt
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-600">
            Wir prüfen Ihre Ausschreibung kurz auf Vollständigkeit und schalten
            sie i. d. R. innerhalb von 4 Stunden frei. Sobald Bewerbungen
            eingehen, finden Sie diese in Ihrem Dashboard.
          </p>
          <div className="mt-7 flex flex-col items-center gap-2">
            <Button href="/dashboard" variant="primary" size="md">
              Zum Dashboard
            </Button>
            <Button href="/search?type=freelancers" variant="ghost" size="md">
              Passende Freelancer ansehen
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
