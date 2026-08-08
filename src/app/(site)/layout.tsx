import { SiteHeader } from "@/components/SiteHeader";
import { SiteBottomBar } from "@/components/SiteBottomBar";
import { BioPanel } from "@/components/BioPanel";
import { PageShift } from "@/components/transition/PageShift";
import { TransitionProvider } from "@/components/transition/TransitionProvider";

/**
 * Shared chrome for the public site. The header and bottom bar are rendered
 * once here rather than by each page, so a navigation never unmounts them —
 * they are the same DOM nodes before and after, and never repaint.
 *
 * The route group keeps /keystatic out of this layout.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <TransitionProvider>
      <SiteHeader />
      <BioPanel />
      <PageShift>{children}</PageShift>
      <SiteBottomBar />
    </TransitionProvider>
  );
}
