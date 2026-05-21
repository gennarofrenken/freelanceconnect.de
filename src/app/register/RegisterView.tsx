"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Briefcase,
  Building2,
  Check,
  Loader2,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Field, Input, Checkbox } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import {
  clearPrefill,
  readPrefill,
  type ExtractedProfile,
} from "@/lib/cv-parser";
import { useAuth } from "@/lib/auth";

type Role = "freelancer" | "company";

const ROLE_COPY: Record<Role, { title: string; subtitle: string; aside: string[] }> = {
  freelancer: {
    title: "Als Freelancer registrieren",
    subtitle:
      "Erstellen Sie Ihr Profil und erhalten Sie passgenaue Projektanfragen aus der DACH-Region.",
    aside: [
      "Kostenfreies Profil mit unbegrenzten Bewerbungen.",
      "Direkter Draht zu verifizierten Auftraggebern.",
      "Volle Kontrolle über Tagessatz, Verfügbarkeit und Sichtbarkeit.",
    ],
  },
  company: {
    title: "Als Unternehmen registrieren",
    subtitle:
      "Stellen Sie Projekte ein und finden Sie qualifizierte IT-Freelancer — ohne Vermittlungsgebühr.",
    aside: [
      "Projekteinstellung ohne Provision oder Erfolgshonorar.",
      "Zugriff auf geprüfte Profile mit Referenzen.",
      "DSGVO-konformer Kontaktaustausch innerhalb der EU.",
    ],
  },
};

export function RegisterView() {
  const params = useSearchParams();
  const initialRole: Role = params.get("role") === "company" ? "company" : "freelancer";
  const [role, setRole] = useState<Role>(initialRole);
  const copy = ROLE_COPY[role];

  return (
    <AuthShell
      title={copy.title}
      subtitle={copy.subtitle}
      asideTitle={
        role === "freelancer"
          ? "Mehr Projekte, weniger Vermittler"
          : "Schnell zur passenden Besetzung"
      }
      asidePoints={copy.aside}
      footer={
        <p>
          Bereits ein Konto?{" "}
          <Link
            href="/login"
            className="font-medium text-brand-700 underline-offset-2 hover:underline"
          >
            Jetzt anmelden
          </Link>
        </p>
      }
    >
      <RoleSwitch role={role} onChange={setRole} />
      {role === "freelancer" && <CvShortcut />}
      <RegisterForm role={role} />
    </AuthShell>
  );
}

function CvShortcut() {
  return (
    <Link
      href="/profil/cv-upload"
      className="group mb-6 flex items-start gap-3 rounded-2xl border border-brand-200 bg-brand-50/60 p-4 transition-colors hover:border-brand-300 hover:bg-brand-50"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white">
        <Sparkles className="h-5 w-5" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold tracking-tight text-ink-900">
          Schneller registrieren mit Lebenslauf
        </p>
        <p className="mt-0.5 text-xs leading-relaxed text-ink-600">
          Wir erkennen automatisch Name, Skills, Sprachen und Standort —
          Sie prüfen das Ergebnis und schließen in unter 60 Sekunden ab.
        </p>
      </div>
      <span className="hidden shrink-0 items-center gap-1 text-xs font-medium text-brand-700 sm:inline-flex">
        Lebenslauf hochladen
        <Upload className="h-3.5 w-3.5" aria-hidden />
      </span>
    </Link>
  );
}

function RoleSwitch({
  role,
  onChange,
}: {
  role: Role;
  onChange: (r: Role) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Kontotyp wählen"
      className="mb-6 grid grid-cols-2 gap-2 rounded-xl border border-ink-200 bg-white p-1"
    >
      <RoleOption
        active={role === "freelancer"}
        onClick={() => onChange("freelancer")}
        icon={<Briefcase className="h-4 w-4" aria-hidden />}
        label="Freelancer"
      />
      <RoleOption
        active={role === "company"}
        onClick={() => onChange("company")}
        icon={<Building2 className="h-4 w-4" aria-hidden />}
        label="Unternehmen"
      />
    </div>
  );
}

function RoleOption({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-lg text-sm font-medium tracking-tight transition-colors",
        active
          ? "bg-brand-600 text-white shadow-soft"
          : "text-ink-600 hover:bg-ink-100",
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function RegisterForm({ role }: { role: Role }) {
  const { signUp, isSupabase } = useAuth();
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [prefill, setPrefill] = useState<ExtractedProfile | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const p = readPrefill();
    if (!p) return;
    setPrefill(p);
    if (p.fullName) {
      const parts = p.fullName.split(/\s+/);
      if (parts.length === 1) {
        setFirstName(parts[0]);
      } else {
        setFirstName(parts.slice(0, -1).join(" "));
        setLastName(parts[parts.length - 1]);
      }
    }
    if (p.email) setEmail(p.email);
  }, []);

  function discardPrefill() {
    clearPrefill();
    setPrefill(null);
    setFirstName("");
    setLastName("");
    setEmail("");
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const next: Record<string, string> = {};

    const firstName = String(form.get("firstName") ?? "").trim();
    const lastName = String(form.get("lastName") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const company = String(form.get("company") ?? "").trim();
    const terms = form.get("terms") === "on";

    if (firstName.length < 2) next.firstName = "Bitte geben Sie Ihren Vornamen ein.";
    if (lastName.length < 2) next.lastName = "Bitte geben Sie Ihren Nachnamen ein.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "Bitte geben Sie eine gültige geschäftliche E-Mail-Adresse ein.";
    if (password.length < 8)
      next.password = "Das Passwort muss mindestens 8 Zeichen lang sein.";
    if (role === "company" && company.length < 2)
      next.company = "Bitte geben Sie Ihren Unternehmensnamen ein.";
    if (!terms) next.terms = "Bitte stimmen Sie AGB und Datenschutz zu.";

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setPending(true);
    const { error } = await signUp({
      email,
      password,
      role: role === "company" ? "recruiter" : "freelancer",
      fullName: `${firstName} ${lastName}`,
      companyName: role === "company" ? company : undefined,
    });
    setPending(false);
    if (error) {
      setErrors({ form: error });
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div
        role="status"
        className="rounded-2xl border border-success-500/20 bg-success-500/5 p-6 text-sm text-ink-700"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-success-500/10 text-success-600">
            <Check className="h-5 w-5" aria-hidden />
          </span>
          <p className="font-medium text-ink-900">
            Vielen Dank — Ihre Registrierung wurde vorgemerkt.
          </p>
        </div>
        <p className="mt-3 leading-relaxed text-ink-600">
          Wir befinden uns aktuell in der geschlossenen Vorab-Phase. Sobald Ihr
          Konto freigeschaltet ist, erhalten Sie eine Bestätigung per E-Mail.
        </p>
        <Button href="/" variant="outline" size="md" className="mt-5">
          Zur Startseite
        </Button>
      </div>
    );
  }

  return (
    <>
    {!isSupabase && (
      <div className="mb-5 rounded-lg border border-warning-100 bg-warning-50 px-3.5 py-2.5 text-xs text-warning-700">
        Demo-Modus: echte Registrierung benötigt Supabase-ENV-Variablen.
        Sie können das Formular ausfüllen, aber kein Konto wird angelegt.
      </div>
    )}
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {prefill && <PrefillBanner profile={prefill} onDiscard={discardPrefill} />}

      <div className="grid grid-cols-2 gap-3">
        <Field label="Vorname" htmlFor="firstName" required error={errors.firstName}>
          <Input
            id="firstName"
            name="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            autoComplete="given-name"
            invalid={Boolean(errors.firstName)}
            required
          />
        </Field>
        <Field label="Nachname" htmlFor="lastName" required error={errors.lastName}>
          <Input
            id="lastName"
            name="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            autoComplete="family-name"
            invalid={Boolean(errors.lastName)}
            required
          />
        </Field>
      </div>

      {role === "company" && (
        <Field
          label="Unternehmen"
          htmlFor="company"
          required
          error={errors.company}
          hint="Firmenname laut Handelsregister"
        >
          <Input
            id="company"
            name="company"
            autoComplete="organization"
            invalid={Boolean(errors.company)}
            required
          />
        </Field>
      )}

      <Field
        label="Geschäftliche E-Mail"
        htmlFor="email"
        required
        error={errors.email}
      >
        <Input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          placeholder="vorname.nachname@firma.de"
          invalid={Boolean(errors.email)}
          required
        />
      </Field>

      <Field
        label="Passwort"
        htmlFor="password"
        required
        error={errors.password}
        hint="Mindestens 8 Zeichen, davon 1 Zahl und 1 Sonderzeichen empfohlen."
      >
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          invalid={Boolean(errors.password)}
          required
        />
      </Field>

      <div>
        <Checkbox
          name="terms"
          label={
            <>
              Ich akzeptiere die{" "}
              <Link
                href="/agb"
                className="font-medium text-brand-700 underline-offset-2 hover:underline"
              >
                AGB
              </Link>{" "}
              und{" "}
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
          <p className="mt-1.5 text-xs text-warning-700" role="alert">
            {errors.terms}
          </p>
        )}
      </div>

      <Checkbox
        name="newsletter"
        label="Ich möchte gelegentlich Updates zu passenden Projekten und neuen Funktionen erhalten."
        hint="Widerruf jederzeit per Link in jeder E-Mail."
      />

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
            Konto wird angelegt …
          </>
        ) : (
          <>
            Konto kostenlos erstellen
            <ArrowRight className="h-4 w-4" aria-hidden />
          </>
        )}
      </Button>
    </form>
    </>
  );
}

function PrefillBanner({
  profile,
  onDiscard,
}: {
  profile: ExtractedProfile;
  onDiscard: () => void;
}) {
  const extras: string[] = [];
  if (profile.title) extras.push(profile.title);
  if (profile.location) extras.push(profile.location);
  if (profile.yearsExperience !== undefined)
    extras.push(`${profile.yearsExperience} J. Erfahrung`);

  return (
    <section className="rounded-2xl border border-success-500/30 bg-success-500/5 p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-success-500/15 text-success-600">
          <Sparkles className="h-4 w-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold tracking-tight text-ink-900">
            Daten aus Ihrem Lebenslauf übernommen
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-ink-600">
            Name und E-Mail sind vorausgefüllt. Skills, Sprachen und weitere
            Felder werden nach Abschluss in Ihrem Profil hinterlegt.
          </p>
          {(profile.skills.length > 0 || profile.languages.length > 0) && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {extras.map((e) => (
                <Badge key={e} tone="neutral">
                  {e}
                </Badge>
              ))}
              {profile.skills.slice(0, 6).map((s) => (
                <Badge key={s} tone="brand">
                  {s}
                </Badge>
              ))}
              {profile.skills.length > 6 && (
                <span className="text-[11px] text-ink-500">
                  +{profile.skills.length - 6} weitere
                </span>
              )}
              {profile.languages.length > 0 && (
                <Badge tone="soft">
                  {profile.languages.slice(0, 3).join(" · ")}
                </Badge>
              )}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={onDiscard}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-ink-500 hover:bg-ink-100 hover:text-ink-900"
          aria-label="Übernommene Daten verwerfen"
          title="Daten verwerfen"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </section>
  );
}
