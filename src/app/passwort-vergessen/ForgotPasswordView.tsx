"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Check, Loader2 } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";

export function ForgotPasswordView() {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string>();

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
      return;
    }
    setError(undefined);
    setPending(true);
    setTimeout(() => {
      setPending(false);
      setDone(true);
    }, 600);
  }

  return (
    <AuthShell
      title="Passwort zurücksetzen"
      subtitle="Geben Sie die mit Ihrem Konto verknüpfte E-Mail-Adresse ein. Wir schicken Ihnen einen Link zum Zurücksetzen."
      footer={
        <p>
          Doch wieder eingefallen?{" "}
          <Link
            href="/login"
            className="font-medium text-brand-700 underline-offset-2 hover:underline"
          >
            Zur Anmeldung
          </Link>
        </p>
      }
    >
      {done ? (
        <div
          role="status"
          className="rounded-2xl border border-success-500/20 bg-success-500/5 p-6 text-sm text-ink-700"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-success-500/10 text-success-600">
              <Check className="h-5 w-5" aria-hidden />
            </span>
            <p className="font-medium text-ink-900">E-Mail unterwegs</p>
          </div>
          <p className="mt-3 leading-relaxed text-ink-600">
            Sofern für{" "}
            <span className="font-medium text-ink-800">{email}</span>{" "}
            ein Konto existiert, haben wir einen Link zum Zurücksetzen
            versendet. Der Link ist 60 Minuten gültig.
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="space-y-5">
          <Field
            label="E-Mail-Adresse"
            htmlFor="forgot-email"
            required
            error={error}
          >
            <Input
              id="forgot-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              invalid={Boolean(error)}
              required
            />
          </Field>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={pending}
          >
            {pending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Wird gesendet …
              </>
            ) : (
              "Link senden"
            )}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
