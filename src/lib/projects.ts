import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "../../keystatic.config";
import type { ProjectBodyItem, ProjectData, ProjectMediaAsset } from "@/types/project";

const IMAGE_PUBLIC_PATH = "/images/projects/";
const VIDEO_PUBLIC_PATH = "/videos/projects/";

const reader = createReader(process.cwd(), keystaticConfig);

type ProjectEntry = Awaited<ReturnType<typeof reader.collections.projects.read>>;

function toMediaAsset(asset: { kind: string; image: string | null; video: string | null }): ProjectMediaAsset | null {
  if (asset.kind === "video" && asset.video) {
    return { kind: "video", src: VIDEO_PUBLIC_PATH + asset.video };
  }
  if (asset.image) {
    return { kind: "image", src: IMAGE_PUBLIC_PATH + asset.image };
  }
  return null;
}

function toProjectData(slug: string, entry: NonNullable<ProjectEntry>): ProjectData {
  const body: ProjectBodyItem[] = entry.body.flatMap((item): ProjectBodyItem[] => {
    if (item.discriminant === "media") {
      const assets = item.value.assets.map(toMediaAsset).filter((a): a is ProjectMediaAsset => a !== null);
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
  });

  return {
    slug,
    entryImage: { kind: "image", src: IMAGE_PUBLIC_PATH + entry.entryImage },
    meta: { client: entry.client, type: entry.type, year: entry.year },
    firstDescription: entry.firstDescription,
    body,
    exitImage: { kind: "image", src: IMAGE_PUBLIC_PATH + entry.exitImage },
  };
}

export async function getProjectSlugs(): Promise<string[]> {
  return reader.collections.projects.list();
}

export async function getProject(slug: string): Promise<ProjectData | null> {
  const entry = await reader.collections.projects.read(slug);
  if (!entry || !entry.entryImage || !entry.exitImage) return null;
  return toProjectData(slug, entry);
}
