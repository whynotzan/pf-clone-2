<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Alessandro Zanatta — Portfolio

A pixel-faithful rebuild of [alessandrozanatta.it](https://alessandrozanatta.it) (originally built on the cntrl.site page builder) as a self-owned Next.js codebase with a git-backed CMS.

- **Repo:** `git@github.com:whynotzan/pf-clone-2.git`
- **Live:** https://pf-clone-2.vercel.app — Vercel auto-deploys on every push to `master`
- **Roadmap / current priorities:** `docs/ROADMAP.md` — read this before starting work
- **Reference on the original site:** `docs/research/PAGE_TOPOLOGY.md` (layout coordinates, fonts, colors, asset inventory)

## Tech Stack

- **Next.js 16** — App Router, React 19, TypeScript strict, Turbopack
- **Tailwind CSS v4** + shadcn/ui primitives
- **Keystatic** — CMS, `storage: { kind: "local" }` (local filesystem, git-backed)
- **sharp** — reads real image dimensions at build time to prevent layout shift
- **Deployment:** Vercel

## Commands

```bash
npm run dev -- -p 4577   # dev server (port 4577 by convention — see below)
npm run build            # production build
npm run lint             # ESLint
npm run typecheck        # tsc --noEmit
npm run check            # lint + typecheck + build
```

**Use port 4577, not 3000.** An unrelated long-running process occupies port 3000 on this machine and answers HTTP requests, so naive "is the server up?" checks return false positives. Verify the server is genuinely ours by checking response *content* (e.g. grep for "Alessandro Zanatta"), not just for a 200.

Raycast shortcuts live outside this repo in `/Users/alessandro/raycast-scripts/`: `portfolio.sh` opens the site, `cms.sh` opens `/keystatic`. Both start the dev server on 4577 if it isn't running, sharing one instance.

## Architecture

```
src/
  app/
    page.tsx                    # Homepage
    [slug]/page.tsx             # Project pages (SSG from CMS entries)
    keystatic/[[...params]]/    # CMS admin UI  ("use client" required — see gotchas)
    api/keystatic/[...params]/  # CMS API route
    globals.css                 # design tokens, grain overlay, hidden scrollbar
  components/
    SiteHeader.tsx  SiteFooter.tsx   # fixed chrome, 34px tall, backdrop-blur + bg tint
    PortfolioCanvas.tsx              # homepage: absolute-positioned items on a 1440px design canvas
    ScaledCanvas.tsx                 # scales that canvas to any viewport width
    BioPanel.tsx                     # fixed, vertically-centered bio (desktop only)
    ExperienceSection.tsx            # sticky CV reveal panel
    project/                         # the "Project Template" system
      ProjectTemplate.tsx  EntryImage.tsx  ExitImage.tsx
      ProjectInfo.tsx  ProjectMedia.tsx  ProjectTextBlock.tsx  MediaAsset.tsx
      RevealOnView.tsx               # built but intentionally UNUSED — see roadmap
  lib/projects.ts                    # Keystatic reader → ProjectData
  types/project.ts  types/portfolio.ts
content/projects/<slug>/index.json   # CMS content (git-tracked)
public/images/projects/<slug>/...    # CMS-managed assets (paths chosen by Keystatic)
keystatic.config.ts                  # CMS schema
middleware.ts                        # 404s /keystatic + /api/keystatic when process.env.VERCEL is set
```

### The "Project Template"

Every project page shares one layout. Sections, in order, using the names Alessandro uses for them:
**Entry Image** → **Client / Type / Year** + **First Description** → **Body** (media rows and text blocks) → **Exit Image**.

Body media rows are a flexible grid: `columns` (1–4), `gap` (px), `fullBleed` (ignore the 85% width cap). Text blocks carry their own `textAlign` / `fontSize` / `fontWeight`.

Entry and Exit images are each exactly one viewport tall (`h-screen` + `object-cover`) and run under the fixed header/footer.

## CMS gotchas — each of these cost hours; do not relearn them

**1. Never hand-author image paths in `content/**/index.json`.**
Keystatic ignores whatever filename you write and computes its own storage path from the field's key and position in the schema (e.g. `/images/projects/<slug>/body/4/value/assets/1/image.gif`). Hand-written paths make the admin UI show *empty* image fields with no error at all, even while the public site renders fine. Always upload through the `/keystatic` UI so Keystatic writes both the file and the reference itself.

**2. Never use `validation: { isRequired: true }` on `fields.integer()`.**
Keystatic's integer field has a hydration bug: an existing saved value renders correctly in the input but never populates its internal validated state. With `isRequired`, Save is permanently blocked ("X is required") on any pre-existing entry until that field is manually retyped. Omit `isRequired`, keep `min`/`max`, and apply the default in `src/lib/projects.ts` instead (`item.value.fontSize ?? 22`).

**3. `src/app/keystatic/[[...params]]/page.tsx` must keep its `"use client"` directive.** Without it the admin renders a blank page with no error.

**4. Debugging the admin UI.** It's a client-rendered React app, so server logs and `curl` reveal almost nothing. When something fails silently, temporarily install Playwright (`npm i -D playwright && npx playwright install chromium`) and drive a real headless browser to capture console/network/DOM — it can even perform genuine uploads via `filechooser` interception. Uninstall it and delete the scratch script afterwards. This technique found both gotchas above after static code reading had stalled.

## Code style

- TypeScript strict, no `any`
- Named exports; PascalCase components, camelCase utilities
- Tailwind utility classes; inline `style` only for values coming from the CMS or from exact-match design coordinates
- 2-space indentation
- Match the surrounding file's comment density — comments explain *why*, not *what*

## Working agreements

- **Commit freely, but do not `git push` unless Alessandro explicitly asks.** Pushing deploys to the live site. The normal loop: make the change → `npm run check` → restart the dev server → tell him it's ready to review locally → wait for "push".
- **Investigation and action are separate requests.** If he asks you to check or audit something, report findings and stop there.
- **When a request could mean either a small contained change or a larger redesign, ask first.** He has consistently chosen the more conservative option.
- Use a background subagent for broad audits so the main thread stays focused.
