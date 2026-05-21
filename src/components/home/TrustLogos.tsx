const COMPANIES = [
  "Nordstern Banking",
  "Industriewerke Süd",
  "Allwetter Versicherung",
  "Helios Search Labs",
  "Mobilbank Direkt",
  "Stadtwerke Rheinland",
];

export function TrustLogos() {
  return (
    <section className="border-y border-ink-100 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">
          Vertraut von Unternehmen aus der DACH-Region
        </p>
        <ul className="mt-7 grid grid-cols-2 items-center gap-x-8 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
          {COMPANIES.map((name) => (
            <li
              key={name}
              className="flex items-center justify-center"
            >
              <span className="text-center text-[15px] font-bold tracking-tight text-ink-400 transition-colors hover:text-ink-700">
                {name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
