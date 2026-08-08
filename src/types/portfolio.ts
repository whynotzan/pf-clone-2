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
  href?: string;
  /** Renders as an autoplaying, muted, looping <video> instead of an <img>. `src` is the video file, `poster` is its cover frame. */
  kind?: "video";
  poster?: string;
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
