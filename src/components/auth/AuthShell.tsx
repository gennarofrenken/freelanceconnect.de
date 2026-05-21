import type { ReactNode } from "react";
import Link from "next/link";
import { ShieldCheck, Lock, BadgeCheck } from "lucide-react";
import { Logo } from "@/components/layout/Logo";

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
  asideTitle?: string;
  asidePoints?: string[];
}

const DEFAULT_POINTS = [
  "Direkter Kontakt zwischen Auftraggeber und Freelancer — ohne Vermittlungsgebühr.",
  "Verifizierte Unternehmen aus der DACH-Region.",
  "DSGVO-konform, gehostet in der EU.",
];

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
  asideTitle = "Seriöse B2B-Projektbörse",
  asidePoints = DEFAULT_POINTS,
}: AuthShellProps) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-ink-50/40">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl gap-0 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_22rem] lg:gap-12 lg:py-16">
        <section className="flex flex-col justify-center">
          <div className="mx-auto w-full max-w-md">
            <Link href="/" className="lg:hidden">
              <Logo />
            </Link>
            <header className="mt-6 lg:mt-0">
              <h1 className="text-balance text-3xl font-semibold tracking-tight text-ink-900">
                {title}
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">
                {subtitle}
              </p>
            </header>

            <div className="mt-8">{children}</div>

            {footer && (
              <div className="mt-6 border-t border-ink-200 pt-6 text-sm text-ink-600">
                {footer}
              </div>
            )}
          </div>
        </section>

        <aside className="hidden lg:flex">
          <div className="relative flex w-full flex-col overflow-hidden rounded-2xl bg-brand-gradient p-8 text-white shadow-deep">
            <span
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-accent-400/20 blur-3xl"
            />
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-100">
              FreelanceConnect
            </p>
            <h2 className="mt-3 text-balance text-2xl font-semibold leading-tight tracking-tight">
              {asideTitle}
            </h2>

            <ul className="mt-8 space-y-4 text-sm leading-relaxed text-brand-50">
              {asidePoints.map((point, i) => (
                <li key={point} className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-inset ring-white/15"
                  >
                    {i === 0 ? (
                      <BadgeCheck className="h-4 w-4" />
                    ) : i === 1 ? (
                      <ShieldCheck className="h-4 w-4" />
                    ) : (
                      <Lock className="h-4 w-4" />
                    )}
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-10 text-xs text-brand-100/80">
              <p>
                Mit der Nutzung von FreelanceConnect stimmen Sie unseren{" "}
                <Link
                  href="/agb"
                  className="font-medium text-white underline-offset-2 hover:underline"
                >
                  AGB
                </Link>{" "}
                und der{" "}
                <Link
                  href="/datenschutz"
                  className="font-medium text-white underline-offset-2 hover:underline"
                >
                  Datenschutzerklärung
                </Link>{" "}
                zu.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
