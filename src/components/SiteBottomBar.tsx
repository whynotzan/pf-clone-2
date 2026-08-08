"use client";

import { TransitionLink } from "@/components/transition/TransitionLink";
import { useSiteTransition } from "@/components/transition/TransitionProvider";

// Measured on the original the same way as SiteHeader — the footer sits on
// slightly different offsets than the header, so it keeps its own values.
const ITEM = "absolute top-1/2 -translate-y-1/2 font-bold text-[17px] whitespace-nowrap";

function HomeItems() {
  return (
    <>
      <span className={ITEM} style={{ left: "1.08%" }}>
        2026
      </span>
      <a
        href="https://www.linkedin.com/in/alessandro-zanatta-515478223/"
        target="_blank"
        rel="noreferrer"
        className={ITEM}
        style={{ left: "25.68%" }}
      >
        LinkedIn
      </a>
      <span className={ITEM} style={{ left: "50.68%" }}>
        Download Area
      </span>
      {/* Right-anchored: the original's right edge sits at 98.95% at every width. */}
      <a href="mailto:work@alessandrozanatta.it" className={ITEM} style={{ right: "1.05%" }}>
        work@alessandrozanatta.it
      </a>
    </>
  );
}

function ProjectItems() {
  return (
    <TransitionLink
      href="/"
      className="absolute top-1/2 left-4 flex -translate-y-1/2 items-center gap-2"
      style={{ fontSize: 16, fontWeight: 500 }}
    >
      <span aria-hidden>←</span> Back
    </TransitionLink>
  );
}

/**
 * The bottom chrome, hoisted out of the pages so the bar itself never unmounts.
 * The blurred block holds still across a navigation; only the row of text
 * inside it slides out and the next one slides in, clipped by the bar's height.
 */
export function SiteBottomBar() {
  const { phase, direction, displayedPath } = useSiteTransition();

  return (
    <div
      className="fixed bottom-0 left-0 z-50 w-full overflow-hidden bg-background/23 backdrop-blur-[30px]"
      style={{ height: 35 }}
    >
      <div className="bottom-bar-swap" data-phase={phase} data-direction={direction}>
        {displayedPath === "/" ? <HomeItems /> : <ProjectItems />}
      </div>
    </div>
  );
}
