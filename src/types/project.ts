/**
 * Shared shape for every project case-study page, built on the
 * "Project Template" (see src/components/project/ProjectTemplate.tsx).
 * Section names mirror how the project is discussed: Entry Image, Client
 * name / Type / Year, First Description, Body Media, extra text blocks,
 * Exit Image.
 */

export interface ProjectMediaAsset {
  kind: "image" | "video";
  src: string;
  /** Real pixel dimensions, when known (images only) - used to reserve layout space via aspect-ratio and avoid load-in shift. */
  width?: number;
  height?: number;
}

/** The hero image immediately below the header. Full-bleed, runs under the header blur. */
export type EntryImage = ProjectMediaAsset;

/** The closing image at the end of the page. Full-bleed, runs under the footer blur. */
export type ExitImage = ProjectMediaAsset;

export interface ProjectMeta {
  client: string;
  type: string;
  year: string;
}

/** A row of body media: 1-4 assets laid out side by side in a grid. */
export interface ProjectMediaBlock {
  /** How many assets sit side by side in this row (1-4). */
  columns: number;
  /** Spacing between assets in this row, in px. */
  gap: number;
  /** Ignore the 85% content cap and span edge-to-edge, like the entry/exit images. */
  fullBleed: boolean;
  assets: ProjectMediaAsset[];
}

/** An interstitial paragraph block, optionally with a call-to-action link (e.g. "Visit the website!"). */
export interface ProjectTextBlock {
  paragraphs: string[];
  cta?: { label: string; href: string };
}

export type ProjectBodyItem =
  | { type: "media"; block: ProjectMediaBlock }
  | { type: "text"; block: ProjectTextBlock };

export interface ProjectData {
  slug: string;
  entryImage: EntryImage;
  meta: ProjectMeta;
  firstDescription: string;
  body: ProjectBodyItem[];
  exitImage: ExitImage;
}
