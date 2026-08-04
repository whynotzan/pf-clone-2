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
