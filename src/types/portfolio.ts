export interface CanvasItem {
  id: string;
  top: number;
  left: number;
  width: number;
  height: number;
  zIndex: number;
  src: string;
  alt: string;
  href?: string;
  borderRadius?: number;
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
