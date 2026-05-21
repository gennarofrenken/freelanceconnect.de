export default function Loading() {
  return (
    <div className="bg-ink-50/40" aria-busy="true" aria-live="polite">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="h-8 w-2/3 max-w-md animate-pulse rounded-md bg-ink-200/70" />
          <div className="h-4 w-1/2 max-w-sm animate-pulse rounded-md bg-ink-200/60" />

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
      <span className="sr-only">Inhalte werden geladen…</span>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-soft">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 animate-pulse rounded-full bg-ink-200/70" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-3/4 animate-pulse rounded bg-ink-200/70" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-ink-200/50" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 w-full animate-pulse rounded bg-ink-200/50" />
        <div className="h-3 w-5/6 animate-pulse rounded bg-ink-200/40" />
      </div>
      <div className="mt-5 flex gap-1.5">
        <div className="h-5 w-14 animate-pulse rounded-full bg-ink-200/50" />
        <div className="h-5 w-12 animate-pulse rounded-full bg-ink-200/50" />
        <div className="h-5 w-16 animate-pulse rounded-full bg-ink-200/50" />
      </div>
    </div>
  );
}
