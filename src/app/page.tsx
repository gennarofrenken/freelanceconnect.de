import { HeroSearch } from "@/components/home/HeroSearch";
import { StatsTicker } from "@/components/home/StatsTicker";
import { CategoryTiles } from "@/components/home/CategoryTiles";
import { RecentProjects } from "@/components/home/RecentProjects";
import { TopFreelancers } from "@/components/home/TopFreelancers";
import { HowItWorks } from "@/components/home/HowItWorks";
import { TrustLogos } from "@/components/home/TrustLogos";
import { TrustSection } from "@/components/home/TrustSection";
import { CtaBanner } from "@/components/home/CtaBanner";

export default function HomePage() {
  return (
    <>
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
