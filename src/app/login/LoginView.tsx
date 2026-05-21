"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";
import { Field, Input, Checkbox } from "@/components/ui/Input";
import { useAuth } from "@/lib/auth";

export function LoginView() {
  const router = useRouter();
  const { signInWithPassword, isSupabase } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [emailError, setEmailError] = useState<string>();
  const [passwordError, setPasswordError] = useState<string>();
  const [formError, setFormError] = useState<string>();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEmailError(undefined);
    setPasswordError(undefined);
    setFormError(undefined);

    let ok = true;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
      ok = false;
    }
    if (password.length < 8) {
      setPasswordError("Das Passwort muss mindestens 8 Zeichen lang sein.");
      ok = false;
    }
    if (!ok) return;

    setPending(true);
    const { error } = await signInWithPassword(email, password);
    setPending(false);
    if (error) {
      setFormError(error);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <AuthShell
      title="Willkommen zurück"
      subtitle="Melden Sie sich an, um Ihre Projekte und Anfragen zu verwalten."
      footer={
        <p>
          Noch kein Konto?{" "}
          <Link
            href="/register"
            className="font-medium text-brand-700 underline-offset-2 hover:underline"
          >
            Jetzt kostenlos registrieren
          </Link>
        </p>
      }
    >
      {!isSupabase && (
        <div className="mb-5 rounded-lg border border-warning-100 bg-warning-50 px-3.5 py-2.5 text-xs text-warning-700">
          Demo-Modus: echtes Login benötigt Supabase-ENV. Nutzen Sie den
          Demo-Rollen-Switcher unten links zum Testen der DSGVO-Gates.
        </div>
      )}
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <Field label="E-Mail-Adresse" htmlFor="email" required error={emailError}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="vorname.nachname@firma.de"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            invalid={Boolean(emailError)}
            required
          />
        </Field>

        <Field
          label="Passwort"
          htmlFor="password"
          required
          error={passwordError}
        >
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="Mindestens 8 Zeichen"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            invalid={Boolean(passwordError)}
            required
          />
        </Field>

        <div className="flex items-center justify-between text-sm">
          <Checkbox label="Angemeldet bleiben" defaultChecked />
          <Link
            href="/passwort-vergessen"
            className="font-medium text-brand-700 underline-offset-2 hover:underline"
          >
            Passwort vergessen?
          </Link>
        </div>

        {formError && (
          <div
            className="rounded-lg border border-warning-100 bg-warning-50 px-3.5 py-2.5 text-sm text-warning-700"
            role="alert"
          >
            {formError}
          </div>
        )}

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
              Anmelden …
            </>
          ) : (
            <>
              Anmelden
              <ArrowRight className="h-4 w-4" aria-hidden />
            </>
          )}
        </Button>

        <p className="text-center text-xs text-ink-500">
          Mit der Anmeldung akzeptieren Sie unsere{" "}
          <Link
            href="/agb"
            className="text-brand-700 underline-offset-2 hover:underline"
          >
            AGB
          </Link>{" "}
          und{" "}
          <Link
            href="/datenschutz"
            className="text-brand-700 underline-offset-2 hover:underline"
          >
            Datenschutzhinweise
          </Link>
          .
        </p>
      </form>
    </AuthShell>
  );
}
