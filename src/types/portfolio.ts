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
   * Omitted for items that link nowhere on the original — the COMING SOON label
   * and the unannounced project above it.
   */
  slug?: string;
  /** Renders as an autoplaying, muted, looping <video> instead of an <img>. `src` is the video file, `poster` is its cover frame. */
  kind?: "video";
  poster?: string;
  /**
   * Alternative encodings, offered to the browser in order before `src`. The
   * one case that needs it is transparency: no single format carries an alpha
   * channel everywhere, so an item can ship HEVC-in-QuickTime for Safari and
   * VP9-in-WebM for everyone else.
   *
   * Order is load-bearing, and so is the QuickTime container. Chromium can
   * decode HEVC but *not* HEVC's alpha channel, so if it ever picked that file
   * the transparent area would paint opaque — listing it as `video/quicktime`
   * is what makes Chromium skip it and fall through to the WebM.
   */
  sources?: { src: string; type: string }[];
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
   * On a video item this picks the `preload` instead: either strategy loads it
   * up front, and omitting it means `preload="none"` — nothing is fetched until
   * the browser decides to play, which is what a below-the-fold reel wants.
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
