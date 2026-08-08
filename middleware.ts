import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * The CMS is a local-filesystem, unauthenticated admin: anyone who can reach
 * /keystatic can rewrite this site's content. It is therefore allowed in
 * exactly one place — `next dev` — and denied everywhere else.
 *
 * This deliberately keys off NODE_ENV rather than a host marker like
 * process.env.VERCEL. Blocking only on Vercel fails *open*: `output: "standalone"`
 * and the Dockerfile in this repo mean a self-hosted build would have served the
 * admin to the public internet. Denying by default means a new host has to be
 * opted in, not remembered.
 *
 * Note this also 404s the CMS under a local production build (`npm run build &&
 * npm start`). Edit content with `npm run dev -- -p 4577`.
 */
export function middleware(_request: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return new NextResponse(null, { status: 404 });
  }
  return NextResponse.next();
}

export const config = {
  // ":path*" matches zero or more segments, so these cover the bare
  // /keystatic and /api/keystatic paths as well as everything beneath them.
  matcher: ["/keystatic/:path*", "/api/keystatic/:path*"],
};
