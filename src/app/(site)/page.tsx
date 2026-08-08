import { PortfolioCanvas } from "@/components/PortfolioCanvas";
import { ExperienceSection } from "@/components/ExperienceSection";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <PortfolioCanvas />
      <ExperienceSection />
    </main>
  );
}
