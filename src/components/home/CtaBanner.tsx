import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function CtaBanner() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-8 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-brand-gradient px-6 py-14 text-white shadow-deep sm:px-12 sm:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-400/30 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-accent-400/15 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-dot-grid opacity-[0.08]"
          />
          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Jetzt kostenlos starten
            </h2>
            <p className="mt-3 text-pretty text-brand-100">
              In unter zwei Minuten registriert. Keine Vertragsbindung, keine
              versteckten Kosten, jederzeit kündbar.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href="/register?role=company" variant="accent" size="lg">
                Als Unternehmen starten
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
              <Button
                href="/register?role=freelancer"
                variant="outline"
                size="lg"
                className="border-white/30 bg-white/10 text-white backdrop-blur hover:border-white hover:bg-white hover:text-brand-900"
              >
                Als Freelancer starten
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
