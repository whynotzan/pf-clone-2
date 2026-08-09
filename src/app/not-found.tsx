import Link from "next/link";

/**
 * Covers both ways a page can be missing: an unmatched URL, and `notFound()`
 * from a project route whose slug has no entry. It sits at the app root rather
 * than inside the (site) group deliberately — the site chrome's TransitionLink
 * needs the TransitionProvider that only the (site) layout mounts, so a 404
 * rendered outside that tree cannot use it. Plain links here, and no chrome.
 */
export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-[18px] text-center">
      <p className="font-bold text-[17px]">Page not found</p>
      <p className="text-[17px] max-w-[420px]">
        This page doesn&apos;t exist, or the project moved.
      </p>
      <Link href="/" className="font-bold text-[17px] underline underline-offset-4">
        Back to the portfolio
      </Link>
    </main>
  );
}
