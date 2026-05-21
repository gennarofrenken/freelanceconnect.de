const STATS = [
  { label: "Aktive Projekte", value: "12.480+" },
  { label: "Verifizierte Freelancer", value: "38.700+" },
  { label: "Ø Besetzungszeit", value: "4 Tage" },
  { label: "Vermittlungsgebühr", value: "0 %" },
];

export function StatsTicker() {
  return (
    <section
      aria-label="Statistik der Plattform"
      className="border-y border-ink-100 bg-white"
    >
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <ul className="grid grid-cols-2 gap-y-6 sm:grid-cols-4 sm:divide-x sm:divide-ink-100">
          {STATS.map((s) => (
            <li
              key={s.label}
              className="text-center sm:px-6 sm:first:pl-0 sm:last:pr-0"
            >
              <p className="bg-gradient-to-br from-ink-900 to-brand-700 bg-clip-text text-2xl font-semibold tracking-tight text-transparent sm:text-3xl">
                {s.value}
              </p>
              <p className="mt-1.5 text-xs font-medium uppercase tracking-wider text-ink-500">
                {s.label}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
