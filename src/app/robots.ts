import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

/**
 * The CMS is already 404'd in production by middleware.ts; disallowing it here
 * as well keeps it out of crawl logs and costs nothing.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/keystatic", "/api/"] },
    sitemap: new URL("/sitemap.xml", siteUrl).href,
  };
}
