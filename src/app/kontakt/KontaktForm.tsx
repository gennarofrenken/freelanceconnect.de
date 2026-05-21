"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Check, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Field,
  Input,
  Select,
  Textarea,
  Checkbox,
} from "@/components/ui/Input";

const TOPICS = [
  { value: "general", label: "Allgemeine Anfrage" },
  { value: "company", label: "Als Unternehmen kontaktieren" },
  { value: "freelancer", label: "Als Freelancer kontaktieren" },
  { value: "press", label: "Presse / Medien" },
  { value: "partnership", label: "Partnerschaft" },
];

export function KontaktForm() {
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const next: Record<string, string> = {};
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();
    const consent = form.get("consent") === "on";

    if (name.length < 2) next.name = "Bitte geben Sie Ihren Namen ein.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "Bitte geben Sie eine gültige E-Mail-Adresse ein.";
    if (message.length < 20)
      next.message = "Bitte beschreiben Sie Ihr Anliegen genauer.";
    if (!consent)
      next.consent = "Bitte stimmen Sie der Datenverarbeitung zu.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setPending(true);
    setTimeout(() => {
      setPending(false);
      setDone(true);
    }, 700);
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-success-500/20 bg-white p-8 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success-500/10 text-success-600">
          <Check className="h-6 w-6" aria-hidden />
        </span>
        <h2 className="mt-4 text-lg font-semibold tracking-tight text-ink-900">
          Nachricht gesendet
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-600">
          Vielen Dank — wir antworten in der Regel innerhalb eines Werktags
          unter der angegebenen E-Mail-Adresse.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="space-y-5 rounded-2xl border border-ink-200 bg-white p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" htmlFor="kontakt-name" required error={errors.name}>
          <Input
            id="kontakt-name"
            name="name"
            autoComplete="name"
            invalid={Boolean(errors.name)}
            required
          />
        </Field>
        <Field label="E-Mail" htmlFor="kontakt-email" required error={errors.email}>
          <Input
            id="kontakt-email"
            name="email"
            type="email"
            autoComplete="email"
            invalid={Boolean(errors.email)}
            required
          />
        </Field>
      </div>

      <Field label="Unternehmen (optional)" htmlFor="kontakt-company">
        <Input
          id="kontakt-company"
          name="company"
          autoComplete="organization"
        />
      </Field>

      <Field label="Anliegen" htmlFor="kontakt-topic" required>
        <Select id="kontakt-topic" name="topic" defaultValue="general">
          {TOPICS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </Select>
      </Field>

      <Field
        label="Ihre Nachricht"
        htmlFor="kontakt-message"
        required
        error={errors.message}
      >
        <Textarea
          id="kontakt-message"
          name="message"
          rows={6}
          placeholder="Worum geht es? Ein paar Sätze reichen."
          invalid={Boolean(errors.message)}
          required
        />
      </Field>

      <div>
        <Checkbox
          name="consent"
          label={
            <>
              Ich willige in die Verarbeitung meiner Daten zur Bearbeitung der
              Anfrage ein — gem.{" "}
              <Link
                href="/datenschutz"
                className="font-medium text-brand-700 underline-offset-2 hover:underline"
              >
                Datenschutzhinweisen
              </Link>
              .
            </>
          }
        />
        {errors.consent && (
          <p className="mt-1.5 text-xs text-warning-700" role="alert">
            {errors.consent}
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={pending}
        >
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Senden …
            </>
          ) : (
            <>
              <Send className="h-4 w-4" aria-hidden />
              Nachricht senden
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
