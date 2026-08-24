/**
 * One item's placement within a single layout. The original authors every item
 * twice — once against its 375px mobile canvas, once against the desktop one —
 * so these are per-layout rather than per-item.
 */
export interface CanvasPlacement {
  top: number;
  left: number;
  width: number;
  height: number;
  zIndex: number;
  /** Degrees of rotation about the item's centre, matching the original's `rotate(…)` on tilted items. */
  rotate?: number;
  /**
   * The original stores radius as a fraction of the layout width, so the same
   * stored value resolves differently per layout: Miche is a full circle on
   * desktop but an ~80px rounded square on mobile. Kept as the declared pixel
   * value and left to the browser to clamp against the box.
   */
  borderRadius?: number;
}

export interface CanvasItem {
  id: string;
  src: string;
  alt: string;
  /**
   * The project this thumbnail belongs to, as it is named on the original site.
   * Rendered as a link only once a project with this slug renders in the CMS, so
   * an item can carry its real destination before its page has been built.
   * Omitted for items that link nowhere on the original.
   */
  slug?: string;
  /** Renders as an autoplaying, muted, looping <video> instead of an <img>. `src` is the video file, `poster` is its cover frame. */
  kind?: "video";
  poster?: string;
  /**
   * How hard the browser should work to have this item painted on arrival.
   * Omitted means below the fold: lazy, fetched when it scrolls near view.
   *
   * - `"priority"` — above the fold and light enough to be worth a preload
   *   link and a place at the front of the network queue.
   * - `"eager"` — above the fold but heavy. Starts immediately rather than
   *   waiting out the lazy queue, but at low network priority, which also
   *   keeps React from holding the first paint until it has decoded.
   *
   * Only genuinely visible items belong here; every extra one competes with
   * the real LCP element for bandwidth.
   */
  loadStrategy?: "priority" | "eager";
  desktop: CanvasPlacement;
  mobile: CanvasPlacement;
}

export interface CvEntry {
  title: string;
  subtitle: string;
  period: string;
}

export interface CvSection {
  heading: string;
  entries: CvEntry[];
}
