import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchView } from "./SearchView";
import Loading from "./loading";
import { listAllProjectsHybrid } from "@/lib/db/listing-queries";

export const metadata: Metadata = {
  title: "Projekte & Freelancer finden",
  description:
    "Durchsuchen Sie aktuelle IT-Projekte und Profile geprüfter Freelancer in der DACH-Region. Filtern Sie nach Skills, Branche, Stundensatz und Verfügbarkeit.",
  alternates: { canonical: "/search" },
};

// User-spezifische Sichtbarkeit (RLS) — pro Request rendern.
export const dynamic = "force-dynamic";

export default async function SearchPage() {
  const { combined, fromDb } = await listAllProjectsHybrid();

  return (
    <Suspense fallback={<Loading />}>
      <SearchView initialProjects={combined} dbProjectCount={fromDb.length} />
    </Suspense>
  );
}
