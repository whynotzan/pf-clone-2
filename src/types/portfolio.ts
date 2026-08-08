export interface CanvasItem {
  id: string;
  top: number;
  left: number;
  width: number;
  height: number;
  zIndex: number;
  src: string;
  alt: string;
  /**
   * The project this thumbnail belongs to, as it is named on the original site.
   * Rendered as a link only once a project with this slug exists in the CMS, so
   * an item can carry its real destination before its page has been built.
   * Omitted for items that link nowhere on the original — the COMING SOON label
   * and the unannounced project above it.
   */
  slug?: string;
  borderRadius?: number;
  /** Degrees of rotation about the item's centre, matching the original's `rotate(…)` on tilted items. */
  rotate?: number;
  /** Renders as an autoplaying, muted, looping <video> instead of an <img>. `src` is the video file, `poster` is its cover frame. */
  kind?: "video";
  poster?: string;
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
