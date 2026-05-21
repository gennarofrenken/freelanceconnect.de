const STEPS = [
  {
    n: "01",
    title: "Profil oder Projekt anlegen",
    description:
      "In wenigen Minuten — als Freelancer mit Skills und Verfügbarkeit, als Unternehmen mit dem konkreten Bedarf.",
  },
  {
    n: "02",
    title: "Direkten Match erhalten",
    description:
      "Wir zeigen passende Projekte und Profile auf Basis von Skills, Region und Verfügbarkeit. Kein Bieten, kein Auktionsmodell.",
  },
  {
    n: "03",
    title: "Direkt verhandeln",
    description:
      "Sie schreiben sich direkt — ohne Mittelmann. Honorar, Konditionen und Start klären Sie selbst.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <header className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
            In drei Schritten zum nächsten Projekt
          </h2>
          <p className="mt-3 text-pretty text-ink-600">
            Wir bringen Unternehmen und Freelancer direkt zusammen — transparent,
            ohne versteckte Kosten.
          </p>
        </header>

        <ol className="mx-auto mt-14 grid max-w-4xl gap-10 md:grid-cols-3">
          {STEPS.map((step) => (
            <li key={step.n} className="relative">
              <span className="block text-xs font-semibold tracking-[0.18em] text-brand-600">
                SCHRITT {step.n}
              </span>
              <h3 className="mt-3 text-lg font-semibold tracking-tight text-ink-900">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
