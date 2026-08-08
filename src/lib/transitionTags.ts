/**
 * The word the wipe panel holds on screen while it covers the page.
 *
 * Deliberately *not* derived from a project's title. The tag is its own piece
 * of copy so it can diverge from the title later — a project can be renamed,
 * or given a shorter/longer tag, without either one dragging the other along.
 * For now each value is simply typed out to match the title it belongs to.
 */
const TAGS: Record<string, string> = {
  "/": "Alessandro Zanatta",
  "/matteomeller": "Matteo Meller",
};

const FALLBACK = "Alessandro Zanatta";

export function tagForPath(pathname: string): string {
  return TAGS[pathname] ?? FALLBACK;
}
