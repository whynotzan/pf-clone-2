import path from "node:path";
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

async function toMediaAsset(asset: { kind: string; image: string | null; video: string | null }): Promise<ProjectMediaAsset | null> {
  if (asset.kind === "video" && asset.video) {
    return { kind: "video", src: asset.video };
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
