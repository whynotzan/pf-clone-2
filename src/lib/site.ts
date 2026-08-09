/**
 * The origin the site describes itself with in metadata, the sitemap and robots.
 *
 * Vercel exposes no single "this is the canonical production URL" variable that
 * is correct on both preview and production deploys, so this stays an explicit
 * setting. Phase 6 points NEXT_PUBLIC_SITE_URL at the real domain; until then
 * the fallback is the Vercel URL the site actually lives on.
 */
export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://pf-clone-2.vercel.app"
);
