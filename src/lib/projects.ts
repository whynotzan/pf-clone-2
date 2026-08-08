import path from "node:path";
import { readFile } from "node:fs/promises";
import sharp from "sharp";
import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "../../keystatic.config";
import type { ProjectBodyItem, ProjectData, ProjectMediaAsset } from "@/types/project";

const reader = createReader(process.cwd(), keystaticConfig);

type ProjectEntry = Awaited<ReturnType<typeof reader.collections.projects.read>>;

/**
 * Real pixel dimensions of an image on disk, used to reserve layout space via
 * CSS aspect-ratio and avoid load-in shift. `publicPath` is the value Keystatic
 * stores for image fields - already a full public path (e.g.
 * "/images/projects/matteomeller/entryImage.webp"), not a bare filename.
 */
async function getImageDimensions(publicPath: string): Promise<{ width: number; height: number } | null> {
  try {
    const { width, height } = await sharp(path.join(process.cwd(), "public", publicPath)).metadata();
    if (!width || !height) return null;
    return { width, height };
  } catch {
    return null;
  }
}

/**
 * Display dimensions of an mp4/mov, read straight from its `moov/trak/tkhd` box.
 *
 * Videos need the same layout-shift protection images get from sharp: a <video>
 * with no reserved space renders at the browser's default 300x150 until metadata
 * arrives, then snaps to its real height - a jump of well over a thousand pixels
 * for a portrait clip in a full-width row. There is no ffprobe on the build
 * machine, and the header walk is short enough not to be worth a dependency.
 *
 * Returns null for anything it cannot parse (webm, an unexpected layout), which
 * simply leaves that asset reserving no space, exactly as before.
 */
async function getVideoDimensions(publicPath: string): Promise<{ width: number; height: number } | null> {
  try {
    const buf = await readFile(path.join(process.cwd(), "public", publicPath));

    const findBox = (start: number, end: number, type: string): [number, number] | null => {
      let offset = start;
      while (offset + 8 <= end) {
        const size = buf.readUInt32BE(offset);
        if (size < 8) return null;
        if (buf.toString("ascii", offset + 4, offset + 8) === type) return [offset + 8, offset + size];
        offset += size;
      }
      return null;
    };

    const moov = findBox(0, buf.length, "moov");
    const trak = moov && findBox(moov[0], moov[1], "trak");
    const tkhd = trak && findBox(trak[0], trak[1], "tkhd");
    if (!tkhd) return null;

    const [payload] = tkhd;
    const version = buf.readUInt8(payload);
    // version 1 widens the creation/modification/duration fields; the 36-byte
    // transform matrix then sits between the track header and the dimensions.
    const matrixOffset = payload + (version === 1 ? 36 : 24) + 16;
    const width = buf.readUInt32BE(matrixOffset + 36) / 65536;
    const height = buf.readUInt32BE(matrixOffset + 40) / 65536;
    if (!width || !height) return null;

    // A quarter-turn rotation lives in the matrix rather than in the stored
    // dimensions, so a phone-shot clip would otherwise come back transposed.
    // The matrix runs a, b, u, c, d, v, x, y, w - hence b at +4 and c at +12.
    const b = buf.readInt32BE(matrixOffset + 4) / 65536;
    const c = buf.readInt32BE(matrixOffset + 12) / 65536;
    const rotated = Math.abs(b) === 1 && Math.abs(c) === 1;

    return rotated
      ? { width: Math.round(height), height: Math.round(width) }
      : { width: Math.round(width), height: Math.round(height) };
  } catch {
    return null;
  }
}

async function toMediaAsset(asset: { kind: string; image: string | null; video: string | null }): Promise<ProjectMediaAsset | null> {
  if (asset.kind === "video" && asset.video) {
    const dimensions = await getVideoDimensions(asset.video);
    return { kind: "video", src: asset.video, ...dimensions };
  }
  if (asset.image) {
    const dimensions = await getImageDimensions(asset.image);
    return { kind: "image", src: asset.image, ...dimensions };
  }
  return null;
}

async function toProjectData(
  slug: string,
  entry: NonNullable<ProjectEntry>,
  entryImage: string,
  exitImage: string
): Promise<ProjectData> {
  const body: ProjectBodyItem[] = (
    await Promise.all(
      entry.body.map(async (item): Promise<ProjectBodyItem[]> => {
        if (item.discriminant === "media") {
          const assets = (await Promise.all(item.value.assets.map(toMediaAsset))).filter(
            (a): a is ProjectMediaAsset => a !== null
          );
          if (assets.length === 0) return [];
          return [
            {
              type: "media" as const,
              block: {
                columns: item.value.columns,
                gap: item.value.gap,
                fullBleed: item.value.fullBleed,
                height: item.value.height ?? undefined,
                assets,
              },
            },
          ];
        }
        return [
          {
            type: "text" as const,
            block: {
              paragraphs: item.value.paragraphs.filter((p): p is string => !!p),
              cta: item.value.ctaLabel && item.value.ctaHref ? { label: item.value.ctaLabel, href: item.value.ctaHref } : undefined,
              textAlign: item.value.textAlign,
              fontSize: item.value.fontSize ?? 22,
              fontWeight: Number(item.value.fontWeight) as 400 | 500 | 700,
            },
          },
        ];
      })
    )
  ).flat();

  const [entryDimensions, exitDimensions] = await Promise.all([
    getImageDimensions(entryImage),
    getImageDimensions(exitImage),
  ]);

  return {
    slug,
    entryImage: { kind: "image", src: entryImage, ...entryDimensions },
    meta: { client: entry.client, type: entry.type, year: entry.year },
    firstDescription: entry.firstDescription,
    body,
    exitImage: { kind: "image", src: exitImage, ...exitDimensions },
  };
}

export async function getProjectSlugs(): Promise<string[]> {
  return reader.collections.projects.list();
}

export async function getProject(slug: string): Promise<ProjectData | null> {
  const entry = await reader.collections.projects.read(slug);
  if (!entry || !entry.entryImage || !entry.exitImage) return null;
  return toProjectData(slug, entry, entry.entryImage, entry.exitImage);
}
