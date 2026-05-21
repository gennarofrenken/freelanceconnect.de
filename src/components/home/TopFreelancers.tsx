import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MOCK_FREELANCERS } from "@/constants/mock-data";
import { FreelancerCard } from "@/components/cards/FreelancerCard";

export function TopFreelancers() {
  const featured = MOCK_FREELANCERS.slice(0, 4);

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-balance text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
              Verfügbare Experten
            </h2>
            <p className="mt-2 text-ink-600">
              Geprüfte IT-Freelancer mit transparenten Stundensätzen.
            </p>
          </div>
          <Link
            href="/search?type=freelancers"
            className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            Alle anzeigen
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((f) => (
            <FreelancerCard key={f.id} freelancer={f} />
          ))}
        </div>
      </div>
    </section>
  );
}
