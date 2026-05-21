"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import { Check, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea, Checkbox } from "@/components/ui/Input";

type Mode = "apply" | "contact";

interface ContactDialogProps {
  mode: Mode;
  targetTitle: string;
  triggerLabel: ReactNode;
  triggerVariant?: "primary" | "accent" | "outline";
  triggerSize?: "md" | "lg";
  triggerClassName?: string;
}

const COPY: Record<
  Mode,
  {
    dialogTitle: string;
    description: string;
    submitLabel: string;
    successTitle: string;
    successBody: (target: string) => string;
    messageLabel: string;
    messagePlaceholder: string;
    rateLabel: string;
  }
> = {
  apply: {
    dialogTitle: "Auf Projekt bewerben",
    description:
      "Schicken Sie ein kurzes Anschreiben mit Tagessatz und Verfügbarkeit. Der Auftraggeber erhält Ihre Unterlagen direkt — ohne Vermittler.",
    submitLabel: "Bewerbung absenden",
    successTitle: "Bewerbung versendet",
    successBody: (target) =>
      `Ihre Bewerbung auf „${target}“ wurde an den Auftraggeber übermittelt. Sie erhalten in Kürze eine Bestätigung per E-Mail.`,
    messageLabel: "Anschreiben",
    messagePlaceholder:
      "Kurze Vorstellung, relevante Referenzen, warum Sie für das Projekt passen …",
    rateLabel: "Ihr Tagessatz (netto)",
  },
  contact: {
    dialogTitle: "Anfrage an Freelancer",
    description:
      "Skizzieren Sie kurz Ihr Projekt: Inhalt, Zeitraum, Budgetrahmen. Der Freelancer erhält Ihre Anfrage direkt und antwortet i. d. R. innerhalb von 24 h.",
    submitLabel: "Anfrage senden",
    successTitle: "Anfrage übermittelt",
    successBody: (target) =>
      `Ihre Anfrage an ${target} wurde versendet. Sie erhalten die Antwort als E-Mail sowie in Ihrem Dashboard.`,
    messageLabel: "Ihre Anfrage",
    messagePlaceholder:
      "Worum geht es im Projekt, was wird benötigt, in welchem Zeitraum?",
    rateLabel: "Geplantes Tagesbudget (optional)",
  },
};

export function ContactDialog({
  mode,
  targetTitle,
  triggerLabel,
  triggerVariant = "primary",
  triggerSize = "md",
  triggerClassName,
}: ContactDialogProps) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const dialogRef = useRef<HTMLDivElement>(null);

  const copy = COPY[mode];

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

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
    if (message.length < 30)
      next.message =
        "Bitte beschreiben Sie Ihr Anliegen in mindestens 30 Zeichen.";
    if (!consent)
      next.consent =
        "Bitte bestätigen Sie die Weiterleitung Ihrer Daten an den Empfänger.";

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setPending(true);
    setTimeout(() => {
      setPending(false);
      setDone(true);
    }, 700);
  }

  function close() {
    setOpen(false);
    setTimeout(() => {
      setDone(false);
      setErrors({});
    }, 200);
  }

  return (
    <>
      <Button
        variant={triggerVariant}
        size={triggerSize}
        className={triggerClassName}
        onClick={() => setOpen(true)}
      >
        {triggerLabel}
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-dialog-title"
        >
          <div
            aria-hidden
            className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm"
            onClick={close}
          />
          <div
            ref={dialogRef}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-deep"
          >
            <header className="flex items-start justify-between gap-4 border-b border-ink-100 px-6 py-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-brand-700">
                  {mode === "apply" ? "Bewerbung" : "Anfrage"}
                </p>
                <h2
                  id="contact-dialog-title"
                  className="mt-1 text-lg font-semibold tracking-tight text-ink-900"
                >
                  {copy.dialogTitle}
                </h2>
                <p className="mt-1 text-sm text-ink-500">{targetTitle}</p>
              </div>
              <button
                type="button"
                onClick={close}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-500 hover:bg-ink-100 hover:text-ink-900"
                aria-label="Dialog schließen"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </header>

            <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
              {done ? (
                <div className="py-4 text-center">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success-500/10 text-success-600">
                    <Check className="h-6 w-6" aria-hidden />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-ink-900">
                    {copy.successTitle}
                  </h3>
                  <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-600">
                    {copy.successBody(targetTitle)}
                  </p>
                  <Button
                    variant="primary"
                    size="md"
                    className="mt-6"
                    onClick={close}
                  >
                    Schließen
                  </Button>
                </div>
              ) : (
                <>
                  <p className="text-sm leading-relaxed text-ink-600">
                    {copy.description}
                  </p>
                  <form onSubmit={onSubmit} noValidate className="mt-5 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field
                        label="Name"
                        htmlFor="contact-name"
                        required
                        error={errors.name}
                      >
                        <Input
                          id="contact-name"
                          name="name"
                          autoComplete="name"
                          invalid={Boolean(errors.name)}
                          required
                        />
                      </Field>
                      <Field
                        label="E-Mail"
                        htmlFor="contact-email"
                        required
                        error={errors.email}
                      >
                        <Input
                          id="contact-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          invalid={Boolean(errors.email)}
                          required
                        />
                      </Field>
                    </div>

                    <Field
                      label={copy.rateLabel}
                      htmlFor="contact-rate"
                      hint="Optional — hilft beim ersten Filter."
                    >
                      <Input
                        id="contact-rate"
                        name="rate"
                        type="number"
                        inputMode="decimal"
                        min={0}
                        placeholder="z. B. 950 €"
                      />
                    </Field>

                    <Field
                      label={copy.messageLabel}
                      htmlFor="contact-message"
                      required
                      error={errors.message}
                    >
                      <Textarea
                        id="contact-message"
                        name="message"
                        rows={5}
                        placeholder={copy.messagePlaceholder}
                        invalid={Boolean(errors.message)}
                        required
                      />
                    </Field>

                    <div>
                      <Checkbox
                        name="consent"
                        label={
                          <>
                            Ich willige ein, dass meine Angaben an den Empfänger
                            übermittelt werden — gem.{" "}
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
                        <p
                          className="mt-1.5 text-xs text-warning-700"
                          role="alert"
                        >
                          {errors.consent}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <Button
                        variant="ghost"
                        size="md"
                        onClick={(event) => {
                          event.preventDefault();
                          close();
                        }}
                      >
                        Abbrechen
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        disabled={pending}
                      >
                        {pending ? (
                          <>
                            <Loader2
                              className="h-4 w-4 animate-spin"
                              aria-hidden
                            />
                            Wird gesendet …
                          </>
                        ) : (
                          copy.submitLabel
                        )}
                      </Button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
