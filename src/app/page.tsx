import type { Metadata } from "next";
import { HeroSearch } from "@/components/home/HeroSearch";
import { StatsTicker } from "@/components/home/StatsTicker";
import { CategoryTiles } from "@/components/home/CategoryTiles";
import { RecentProjects } from "@/components/home/RecentProjects";
import { TopFreelancers } from "@/components/home/TopFreelancers";
import { HowItWorks } from "@/components/home/HowItWorks";
import { TrustLogos } from "@/components/home/TrustLogos";
import { TrustSection } from "@/components/home/TrustSection";
import { CtaBanner } from "@/components/home/CtaBanner";
import { OrganizationJsonLd, WebsiteJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "IT-Freelancer & Projekte in der DACH-Region",
  description:
    "Über 12.000 aktive IT-Projekte und tausende geprüfte Freelancer. Direkt, transparent, ohne Vermittlungsgebühr — Banken, Versicherungen, Industrie & öffentlicher Sektor.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <OrganizationJsonLd />
      <WebsiteJsonLd />
      <HeroSearch />
      <StatsTicker />
      <TrustLogos />
      <CategoryTiles />
      <RecentProjects />
      <TopFreelancers />
      <HowItWorks />
      <TrustSection />
      <CtaBanner />
    </>
  );
}
