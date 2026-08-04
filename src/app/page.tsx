import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { BioPanel } from "@/components/BioPanel";
import { PortfolioCanvas } from "@/components/PortfolioCanvas";
import { ExperienceSection } from "@/components/ExperienceSection";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <SiteHeader />
      <BioPanel />
      <PortfolioCanvas />
      <ExperienceSection />
      <SiteFooter />
    </main>
  );
}
