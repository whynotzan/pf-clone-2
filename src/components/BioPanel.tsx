"use client";

import { useSiteTransition } from "./transition/TransitionProvider";
import { BIO_PARAGRAPHS as PARAGRAPHS } from "./bioText";

/**
 * Homepage-only, but rendered from the (site) layout rather than the page: it
 * is `fixed`, and the page content now carries a transform during a transition,
 * which would re-anchor any fixed descendant to the moving box and make this
 * lurch. Living in the layout keeps it anchored to the viewport.
 *
 * Desktop only. The original drops the fixed panel below 1024 and puts the same
 * text in the scroll flow instead — that is `MobileBio`, rendered by the page.
 */
export function BioPanel() {
  const { displayedPath } = useSiteTransition();
  if (displayedPath !== "/") return null;

  return (
    // The wrapper spans the whole viewport to centre the column vertically, so
    // it would otherwise swallow every click meant for the canvas behind it —
    // no poster was reachable at any desktop width. Only the text itself takes
    // pointer events, which keeps it selectable.
    <div className="pointer-events-none fixed top-0 left-0 z-40 hidden h-screen w-full lg:flex lg:items-center">
      <div
        className="pointer-events-auto flex flex-col gap-[22px]"
        style={{
          marginLeft: 16,
          // 343/22px measured on the original; the previous 355/16px changed
          // where every paragraph wrapped.
          width: 343,
          fontSize: 16,
          lineHeight: "21px",
          letterSpacing: "0.2px",
          color: "#1b1b1b",
        }}
      >
        {PARAGRAPHS.map((p) => (
          <p key={p.slice(0, 12)}>{p}</p>
        ))}
      </div>
    </div>
  );
}
