import { Quote, Star } from "lucide-react";

export function TrustSection() {
  return (
    <section className="relative overflow-hidden bg-ink-50/60">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-dot-grid opacity-40 [mask-image:radial-gradient(50%_60%_at_50%_50%,black,transparent)]"
      />
      <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-24 lg:px-8">
        <div
          aria-hidden
          className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-soft ring-1 ring-ink-100"
        >
          <Quote className="h-5 w-5" />
        </div>
        <blockquote className="mt-7 text-balance text-xl font-medium leading-relaxed tracking-tight text-ink-800 sm:text-2xl">
          „Wir haben innerhalb von drei Tagen einen erfahrenen SAP-Berater
          gefunden. Die Profilqualität ist deutlich höher als bei anderen
          Plattformen.“
        </blockquote>
        <div className="mt-6 flex items-center justify-center gap-0.5 text-accent-500">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className="h-4 w-4 fill-accent-500"
              aria-hidden
            />
          ))}
        </div>
        <footer className="mt-3 text-sm text-ink-500">
          <span className="font-semibold text-ink-900">Dr. Sandra Walter</span>
          <span aria-hidden> · </span>
          <span>Head of IT, Industriewerke Süd AG</span>
        </footer>
      </div>
    </section>
  );
}
