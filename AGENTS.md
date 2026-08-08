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

**When working in a worktree, 4577 is probably not yours.** Alessandro's own dev server usually holds it, and parallel worktree sessions take 4578, 4579 and up — `npm run dev` then fails with `EADDRINUSE` in the background while `curl localhost:4577` happily returns *another branch's* build. That cost a full round of verification on 2026-08-08: the page measured as though none of the changes existed. Start on a port you have confirmed free (`lsof -nP -iTCP -sTCP:LISTEN | grep :45`), and grep the response for a string only your branch produces. Never kill the process on 4577 — it is his.

Raycast shortcuts live outside this repo in `/Users/alessandro/raycast-scripts/`: `portfolio.sh` opens the site, `cms.sh` opens `/keystatic`. Both start the dev server on 4577 if it isn't running, sharing one instance.

## Architecture

```
src/
  app/
    (site)/                     # route group: everything sharing the public chrome
      layout.tsx                #   header + bio + bottom bar, mounted once (see below)
      page.tsx                  #   Homepage
      [slug]/page.tsx           #   Project pages (SSG from CMS entries)
    keystatic/[[...params]]/    # CMS admin UI  ("use client" required — see gotchas)
    api/keystatic/[...params]/  # CMS API route
    globals.css                 # design tokens, grain overlay, hidden scrollbar, page wipe
  components/
    SiteHeader.tsx  SiteBottomBar.tsx  # fixed chrome, 35px tall, backdrop-blur + bg tint
    PortfolioCanvas.tsx              # homepage: absolute-positioned items on a 1440px design canvas
    ScaledCanvas.tsx                 # scales that canvas to any viewport width
    BioPanel.tsx                     # fixed, vertically-centered bio (desktop only)
    ExperienceSection.tsx            # sticky CV reveal panel
    transition/                      # the page wipe between homepage and projects
      TransitionProvider.tsx         #   phase machine + the wipe panel itself
      TransitionLink.tsx  PageShift.tsx
    project/                         # the "Project Template" system
      ProjectTemplate.tsx  EntryImage.tsx  ExitImage.tsx
      ProjectInfo.tsx  ProjectMedia.tsx  ProjectTextBlock.tsx  MediaAsset.tsx
      RevealOnView.tsx               # built but intentionally UNUSED — see roadmap
  lib/projects.ts                    # Keystatic reader → ProjectData
  lib/transitionTags.ts              # the word the wipe holds, per route
  types/project.ts  types/portfolio.ts
content/projects/<slug>/index.json   # CMS content (git-tracked)
public/images/projects/<slug>/...    # CMS-managed assets (paths chosen by Keystatic)
keystatic.config.ts                  # CMS schema
middleware.ts                        # 404s /keystatic + /api/keystatic when process.env.VERCEL is set
```

### The "Project Template"

Every project page shares one layout. Sections, in order, using the names Alessandro uses for them:
**Entry Image** → **Client / Type / Year** + **First Description** → **Body** (media rows and text blocks) → **Exit Image**.

Body media rows are a flexible grid: `columns` (1–4), `gap` (px), `fullBleed` (ignore the 81.57% width cap — the original's 1217px column on its 1492px canvas), plus optional `rowHeight`, `columnWidths` and `align`. Text blocks carry their own `textAlign` / `fontSize` / `fontWeight`, and stay block-level by decision — do not add per-paragraph or per-CTA typography.

`rowHeight` and `columnWidths` are both authored against the 1492px design canvas, like the entry/exit boxes, so they scale with window width rather than window height. `gap`, by contrast, is a real screen px value and does not scale — worth remembering when a row has to match the original exactly.

- **`rowHeight`** exists because the original crops each row to a height it chose by hand (1036, 705, 829, 788, 663 …) instead of following the asset's aspect ratio. Setting it requires `gridAutoRows: minmax(0, 1fr)` as well as `height` — grid tracks otherwise size to their content and the assets overflow the box. Empty keeps the asset's natural proportions.
- **`columnWidths`** is a space-separated string (`"735 490"`) covering the original's uneven splits. A single width makes a partial-width row, and `align` then places it left/center/right. Empty means equal columns; anything unparseable degrades to equal columns rather than failing.

Widths are absolute, so a row whose widths exceed the 1217px content column spills over its edges. The original's own 735/490 is such a case (1225px before the gap) and wants `fullBleed` ticked.

Entry and Exit images are cropped to the original's fixed design boxes — 1492x754 and 1492x906, expressed as `calc(100vw * h / 1492)` with `object-cover`. They are deliberately **not** `h-screen`: the original's heights held at both 900px and 1300px viewport heights, so they scale with canvas width, not screen height. The entry image starts below the 35px header; the exit image runs flush to the bottom edge, behind the footer.

### The page wipe

Navigating between the homepage and a project runs an opaque panel across the viewport, holds, then carries it off the far edge. `TransitionProvider` owns a four-phase machine (`covering → revealing → settling → idle`) and renders the panel; `TransitionLink` hands a navigation to it; `PageShift` drifts the page underneath. Timings live in **both** `TransitionProvider.tsx` and `globals.css` (`--wipe-cover` / `--wipe-hold` / `--wipe-reveal`) — retune them together.

Things that are load-bearing and easy to undo by accident:

- **The chrome lives in `(site)/layout.tsx`, not in the pages.** Mounted once, it never unmounts across a navigation, so the header and bottom bar do not repaint mid-wipe. Moving either back into a page breaks that.
- **`BioPanel` is in the layout for a second reason:** `PageShift` applies a transform during a transition, and a transformed ancestor becomes the containing block for `position: fixed` descendants — anything fixed inside the page would re-anchor to it.
- **`BioPanel`'s wrapper must keep `pointer-events-none`.** It spans the viewport to centre its column, so without it the panel is a full-screen click shield and *no* poster is clickable at any width or scroll position. The text column carries `pointer-events-auto` so it stays selectable.
- **`TransitionLink` uses `onNavigate`, not `onClick`,** so cmd-click, middle-click and external links keep behaving like ordinary links.
- The z-order the wipe depends on: header 50, wipe panel 45, bottom bar 44, BioPanel 40, CV panel 30.
- Reduced-motion visitors skip the wipe entirely and navigate instantly, rather than waiting through a delay with nothing to look at.

**Never conclude a link works from a programmatic `element.click()`** — it skips hit-testing and passes even when the element is shielded. Use `document.elementFromPoint(x, y)` and assert the result is inside the link. Note the posters are a collage and genuinely overlap, so a covered centre is normal; what matters is that each poster is reachable *somewhere*.

## CMS gotchas — each of these cost hours; do not relearn them

**1. Never hand-author image paths in `content/**/index.json`.**
Keystatic ignores whatever filename you write and computes its own storage path from the field's key and position in the schema (e.g. `/images/projects/<slug>/body/4/value/assets/1/image.gif`). Hand-written paths make the admin UI show *empty* image fields with no error at all, even while the public site renders fine. Always upload through the `/keystatic` UI so Keystatic writes both the file and the reference itself.

**2. Never use `validation: { isRequired: true }` on `fields.integer()`.**
Keystatic's integer field has a hydration bug: an existing saved value renders correctly in the input but never populates its internal validated state. With `isRequired`, Save is permanently blocked ("X is required") on any pre-existing entry until that field is manually retyped. Omit `isRequired`, keep `min`/`max`, and apply the default in `src/lib/projects.ts` instead (`item.value.fontSize ?? 22`).

**3. `src/app/keystatic/[[...params]]/page.tsx` must keep its `"use client"` directive.** Without it the admin renders a blank page with no error.

**4. Debugging the admin UI.** It's a client-rendered React app, so server logs and `curl` reveal almost nothing. When something fails silently, temporarily install Playwright (`npm i -D playwright && npx playwright install chromium`) and drive a real headless browser to capture console/network/DOM — it can even perform genuine uploads via `filechooser` interception. Uninstall it and delete the scratch script afterwards. This technique found both gotchas above after static code reading had stalled.

**5. Editing a body block is a modal dialog, and `Escape` throws the edit away.** Clicking a row
in Body blocks opens an "Edit item" dialog whose changes only commit when you press its **Done**
button. While it is open the page-level **Save** is deliberately unclickable — a hit test there
returns `<body>`, and Playwright reports "body intercepts pointer events". That is correct modal
behaviour, not the bug it looks like. The working order is: open row → edit → **Done** → **Save**.

**6. Synthetic events do not drive this admin.** Neither the Chrome extension's `computer` clicks
nor hand-dispatched `PointerEvent`/`click` sequences reach Keystatic's react-aria controls — a
save appears to succeed while nothing reaches disk. Always confirm an admin write by reading
`content/**/index.json` back off disk, and use Playwright when you need genuine input.

**7. `fields.integer()` renders with a locale thousands separator.** A saved `1036` reads back
out of the input as `"1,036"`, so strip non-digits before comparing values in any check.

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
