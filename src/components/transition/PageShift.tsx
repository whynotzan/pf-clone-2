"use client";

import { useSiteTransition } from "./TransitionProvider";

/**
 * Drifts the page a little in the wipe's direction while the panel closes, and
 * settles the incoming one back from the same offset as it opens — so the old
 * page reads as departing rather than sitting still under a curtain.
 *
 * The transform only exists during a transition. That matters: a transformed
 * ancestor becomes the containing block for `position: fixed` descendants, so
 * anything fixed inside the page would re-anchor to this box. BioPanel was
 * moved to the layout for exactly that reason.
 */
export function PageShift({ children }: { children: React.ReactNode }) {
  const { phase, direction } = useSiteTransition();

  return (
    <div className="page-shift" data-phase={phase} data-direction={direction}>
      {children}
    </div>
  );
}
