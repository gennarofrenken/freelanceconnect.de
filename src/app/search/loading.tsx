export default function Loading() {
  return (
    <div className="bg-ink-50/50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Bar className="h-7 w-44" />
            <Bar className="mt-2 h-4 w-32" />
          </div>
          <div className="flex items-center gap-3">
            <Bar className="h-10 w-20" />
            <Bar className="h-10 w-40" />
          </div>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-[18rem_1fr]">
          <aside className="rounded-2xl border border-ink-200 bg-white p-5">
            <Bar className="h-5 w-16" />
            <div className="mt-5 space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Bar className="h-3 w-24" />
                  <Bar className="h-9 w-full" />
                </div>
              ))}
            </div>
          </aside>

          <section className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-ink-200 bg-white p-5"
              >
                <div className="flex items-center justify-between">
                  <Bar className="h-5 w-72" />
                  <Bar className="h-4 w-20" />
                </div>
                <div className="mt-3 flex gap-3">
                  <Bar className="h-4 w-24" />
                  <Bar className="h-4 w-20" />
                  <Bar className="h-4 w-16" />
                </div>
                <div className="mt-4 flex gap-2">
                  <Bar className="h-6 w-16 rounded-full" />
                  <Bar className="h-6 w-20 rounded-full" />
                  <Bar className="h-6 w-14 rounded-full" />
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}

function Bar({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`block animate-pulse rounded-md bg-ink-100 ${className}`}
    />
  );
}
