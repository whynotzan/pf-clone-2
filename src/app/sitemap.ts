import type { MetadataRoute } from "next";
import { getPublishedProjectSlugs } from "@/lib/projects";
import { siteUrl } from "@/lib/site";

/**
 * Lists only the slugs that actually render. `getProjectSlugs` includes entries
 * missing a hero image, whose routes 404 — submitting those would be advertising
 * dead URLs. Same rule the homepage uses to decide what to link.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getPublishedProjectSlugs();
  return [
    { url: new URL("/", siteUrl).href, changeFrequency: "monthly", priority: 1 },
    ...slugs.map((slug) => ({
      url: new URL(`/${slug}`, siteUrl).href,
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
  ];
}
