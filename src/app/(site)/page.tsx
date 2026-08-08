import { PortfolioCanvas } from "@/components/PortfolioCanvas";
import { ExperienceSection } from "@/components/ExperienceSection";
import { MobileBio } from "@/components/MobileBio";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <PortfolioCanvas />
      {/* Posters, bio, then CV — the original's mobile reading order. On desktop
          the bio is the fixed panel in the layout and this renders nothing. */}
      <MobileBio />
      <ExperienceSection />
    </main>
  );
}
