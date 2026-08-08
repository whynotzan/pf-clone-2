import { PortfolioCanvas } from "@/components/PortfolioCanvas";
import { ExperienceSection } from "@/components/ExperienceSection";
import { MobileBio } from "@/components/MobileBio";
import { MobileHomeLinks } from "@/components/MobileHomeLinks";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <PortfolioCanvas />
      {/* Posters, bio, CV, then the links that the sticky bar carries on desktop.
          On desktop the bio is the fixed panel in the layout and both of these
          mobile blocks render nothing. */}
      <MobileBio />
      <ExperienceSection />
      <MobileHomeLinks />
    </main>
  );
}
