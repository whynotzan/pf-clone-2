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
  /**
   * Authored row height in px on the 1492 design canvas. The original crops each row
   * to a fixed height rather than following the asset's own aspect ratio. Undefined
   * keeps the natural proportions.
   */
  rowHeight?: number;
  /** Per-column widths in px on the 1492 canvas, for uneven splits (e.g. [735, 490]). Empty means equal columns. */
  columnWidths: number[];
  /** Where the row sits when `columnWidths` don't fill the available space. */
  align: "left" | "center" | "right";
  assets: ProjectMediaAsset[];
}

/** Size and weight carried by a single run of text - a paragraph or the CTA. */
export interface TextStyle {
  fontSize: number;
  fontWeight: 400 | 500 | 700;
}

export interface ProjectParagraph extends TextStyle {
  text: string;
}

/**
 * An interstitial paragraph block, optionally with a call-to-action link (e.g.
 * "Visit the website!"). Alignment is block-level; size and weight are per piece,
 * so a block can mix a 400 paragraph with a 500 link like the original does.
 */
export interface ProjectTextBlock {
  paragraphs: ProjectParagraph[];
  cta?: { label: string; href: string } & TextStyle;
  textAlign: "left" | "center" | "right";
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
