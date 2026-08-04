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

/** A row of body media: one full-width asset, one centered "wide" asset, or two side by side. */
export interface ProjectMediaBlock {
  layout: "full" | "wide" | "pair";
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
