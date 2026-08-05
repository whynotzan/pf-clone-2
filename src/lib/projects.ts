import path from "node:path";
import sharp from "sharp";
import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "../../keystatic.config";
import type { ProjectBodyItem, ProjectData, ProjectMediaAsset } from "@/types/project";

const IMAGE_PUBLIC_PATH = "/images/projects/";
const VIDEO_PUBLIC_PATH = "/videos/projects/";
const IMAGE_DIR = path.join(process.cwd(), "public", "images", "projects");

const reader = createReader(process.cwd(), keystaticConfig);

type ProjectEntry = Awaited<ReturnType<typeof reader.collections.projects.read>>;

/** Real pixel dimensions of an image on disk, used to reserve layout space via CSS aspect-ratio and avoid load-in shift. */
async function getImageDimensions(filename: string): Promise<{ width: number; height: number } | null> {
  try {
    const { width, height } = await sharp(path.join(IMAGE_DIR, filename)).metadata();
    if (!width || !height) return null;
    return { width, height };
  } catch {
    return null;
  }
}

async function toMediaAsset(asset: { kind: string; image: string | null; video: string | null }): Promise<ProjectMediaAsset | null> {
  if (asset.kind === "video" && asset.video) {
    return { kind: "video", src: VIDEO_PUBLIC_PATH + asset.video };
  }
  if (asset.image) {
    const dimensions = await getImageDimensions(asset.image);
    return { kind: "image", src: IMAGE_PUBLIC_PATH + asset.image, ...dimensions };
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
    entryImage: { kind: "image", src: IMAGE_PUBLIC_PATH + entryImage, ...entryDimensions },
    meta: { client: entry.client, type: entry.type, year: entry.year },
    firstDescription: entry.firstDescription,
    body,
    exitImage: { kind: "image", src: IMAGE_PUBLIC_PATH + exitImage, ...exitDimensions },
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
