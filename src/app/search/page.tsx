import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchView } from "./SearchView";

export const metadata: Metadata = {
  title: "Projekte & Freelancer finden",
  description:
    "Durchsuchen Sie aktuelle IT-Projekte und Profile geprüfter Freelancer in der DACH-Region. Filtern Sie nach Skills, Branche, Stundensatz und Verfügbarkeit.",
};

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">Lade Suche…</div>}>
      <SearchView />
    </Suspense>
  );
}
