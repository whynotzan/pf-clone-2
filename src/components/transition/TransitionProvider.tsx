"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type Phase = "idle" | "covering" | "revealing" | "settling";
type Direction = "up" | "down";

type Timing = { cover: number; hold: number; reveal: number; settle: number };

/**
 * Timings are mirrored in globals.css (--wipe-cover / --wipe-hold / --wipe-reveal).
 * They live in both places because CSS drives the paint and JS drives the route
 * change; keep the two in step if you retune them.
 *
 * The two directions are deliberately asymmetric. Going *up* into a project is
 * an arrival worth announcing, so the panel holds the project's tag on screen.
 * Coming back *down* to the index shows no tag and runs 700ms flat: with
 * nothing to read there is nothing for the hold to hold, and a return to
 * somewhere already seen should not be made to wait.
 *
 * `settle` is the tail after the panel has gone, while the arriving page is
 * still drifting into place — the only part of that drift the visitor actually
 * sees. Navigation is allowed again during it, so it does not lengthen the wipe.
 */
const TIMINGS: Record<Direction, Timing> = {
  up: { cover: 550, hold: 300, reveal: 550, settle: 450 },
  down: { cover: 350, hold: 0, reveal: 350, settle: 350 },
};

/** Bail out of a stuck navigation rather than leaving the panel up forever. */
const SAFETY_MS = 4000;

type TransitionValue = {
  phase: Phase;
  direction: Direction;
  /** The route the persistent chrome should currently be dressed for. */
  displayedPath: string;
  /** Returns true when it took over the navigation, false to let Next handle it. */
  begin: (href: string, tag: string) => boolean;
};

const TransitionContext = createContext<TransitionValue | null>(null);

export function useSiteTransition(): TransitionValue {
  const value = useContext(TransitionContext);
  if (!value) throw new Error("useSiteTransition must be used inside <TransitionProvider>");
  return value;
}

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [phase, setPhase] = useState<Phase>("idle");
  const [direction, setDirection] = useState<Direction>("up");
  const [tag, setTag] = useState("");
  const [fromPath, setFromPath] = useState(pathname);

  const pendingHref = useRef<string | null>(null);
  const timers = useRef<number[]>([]);
  /** The timings the in-flight wipe started under, read back when it reveals. */
  const timing = useRef<Timing>(TIMINGS.up);

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const begin = useCallback(
    (href: string, nextTag: string) => {
      // Ignore re-entrant clicks, and links that go nowhere. "settling" counts
      // as available: the panel has already gone, so a new wipe can start.
      if ((phase !== "idle" && phase !== "settling") || href === pathname) return false;
      // Hand back to Next rather than making these visitors sit through a
      // delay with nothing to look at — the CSS opts out of the paint, but the
      // wait would remain unless the navigation itself stays instant.
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;

      // Going deeper travels up; returning to the index retraces downward.
      const nextDirection: Direction = href === "/" ? "down" : "up";
      timing.current = TIMINGS[nextDirection];

      pendingHref.current = href;
      setFromPath(pathname);
      // The return to the index is wordless — see TIMINGS.
      setTag(nextDirection === "down" ? "" : nextTag);
      setDirection(nextDirection);
      setPhase("covering");

      clearTimers();
      timers.current.push(
        // Hand over to the router only once the panel is fully covering, so the
        // swap underneath — and the scroll reset that comes with it — is never
        // visible.
        window.setTimeout(() => router.push(href), timing.current.cover + timing.current.hold),
        window.setTimeout(() => {
          pendingHref.current = null;
          setPhase("idle");
        }, SAFETY_MS)
      );

      return true;
    },
    [clearTimers, pathname, phase, router]
  );

  // The route has landed under the panel: give it a couple of frames' grace to
  // paint, then pull the panel away.
  //
  // A timer rather than requestAnimationFrame on purpose — rAF never fires in a
  // background tab, so a click followed by a tab switch would strand the panel
  // on screen. For the same reason the safety timeout armed in `begin` is left
  // running here; only the next `begin` (or unmount) clears it.
  useEffect(() => {
    if (pendingHref.current !== pathname) return;

    pendingHref.current = null;
    const { reveal, settle } = timing.current;
    timers.current.push(
      window.setTimeout(() => {
        setPhase("revealing");
        timers.current.push(
          window.setTimeout(() => setPhase("settling"), reveal),
          window.setTimeout(() => setPhase("idle"), reveal + settle)
        );
      }, 32)
    );
  }, [pathname]);

  // Derived rather than stored: while the panel is closing, the chrome still
  // belongs to the page we are leaving. Everywhere else it follows the router —
  // which is what keeps browser back/forward correct for free.
  const displayedPath = phase === "covering" ? fromPath : pathname;

  return (
    <TransitionContext.Provider value={{ phase, direction, displayedPath, begin }}>
      {children}
      <div className="page-wipe" data-phase={phase} data-direction={direction} aria-hidden>
        {tag ? <span className="page-wipe__tag">{tag}</span> : null}
      </div>
    </TransitionContext.Provider>
  );
}
