import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchView } from "./SearchView";
import Loading from "./loading";

export const metadata: Metadata = {
  title: "Projekte & Freelancer finden",
  description:
    "Durchsuchen Sie aktuelle IT-Projekte und Profile geprüfter Freelancer in der DACH-Region. Filtern Sie nach Skills, Branche, Stundensatz und Verfügbarkeit.",
  alternates: { canonical: "/search" },
};

export default function SearchPage() {
  return (
    <Suspense fallback={<Loading />}>
      <SearchView />
    </Suspense>
  );
}
