# Roadmap

Working order, set by Alessandro. Work top-down: finish a phase before starting the next, unless he says otherwise.

Status: `[ ]` not started · `[~]` in progress · `[x]` done

---

## Phase 1 — Fix the site as we see it — DONE (2026-08-07)

Visual fidelity pass against the original. Desktop only at this stage; responsive comes in Phase 3.

- [x] Walk the homepage and `/matteomeller` side by side with [alessandrozanatta.it](https://alessandrozanatta.it) and list what's off
- [x] Known font mismatches, found in a full audit:
  - [x] `PortfolioCanvas.tsx` — "COMING SOON" badge `500` / `16px`
  - [x] `ProjectTemplate.tsx` — "Back" link `500` / `16px`
- [x] Canvas geometry — `DESIGN_WIDTH` is 1492, and the scale transform now actually applies
- [x] `-10deg` rotation on the intersections hero and the video reel
- [x] attivaservizi border-radius
- [x] Bio column 343px / 22px gaps, typographic quotes; CV dates on ASCII hyphens
- [x] 35px chrome bars; CV columns at 730px/1090px of 1440
- [x] Project page: 81.57% content column, meta at 251/369/724, fixed-box hero images, year 2024

Verified by probing both sites at matched viewports: all ten canvas items land within 1px
of the original at 1440px, and the project meta block matches exactly.

### How the original is built — measured, worth not rediscovering

- Its canvas is authored at **1492px** and scales by `viewport / 1492`. Its *text* is authored
  at **1440px** and scales by `viewport / 1440` — two different reference widths. That is why
  the canvas lives in `ScaledCanvas` while the chrome, bio and CV keep plain pixel values, and
  why `PAGE_TOPOLOGY.md` records odd fractional font sizes (17px x 1492/1440 = 17.6px).
- The bio and the CV block are both `position: fixed` and permanently on screen; the canvas
  images scroll over them, so the "reveal" is occlusion rather than any scroll effect.
- It ships a hidden duplicate of every item for mobile, so DOM queries hit zero-size copies first.

### Dropped, deliberately not tracked

The text-block CTA weight (`matteomeller.com` rendering `400` where the original uses `500`)
and the grain overlay intensity. Both judged fine as they are — do not reopen them as fidelity bugs.

### Carried out of Phase 1 on purpose

- **CV panel mechanism — decided 2026-08-07: keep ours as is.** The original keeps that block
  `position: fixed` and always mounted, revealing it by occlusion; ours is a sticky panel at the
  document end. Alessandro chose to keep ours. Two knock-on differences are therefore accepted
  rather than bugs: the internal spacing (the original puts each heading at the top of its column
  with the entries ~330px below) and the homepage running 4394px against the original's 4500px.
  Do not reopen any of this as a fidelity issue.
- **Per-row media heights** — done in Phase 2 (the `height` field).
- **Template gaps the original uses** — partial-width offset single images, and uneven column
  splits (735/490); our grid only splits evenly. Still open — now tracked explicitly in the
  Phase 2 checklist rather than only mentioned here.

## Phase 2 — Properly set up the template project

Make the Project Template genuinely reusable before pouring content into it.

- [x] Exercise the untested paths: 3- and 4-column media rows, multiple text blocks in sequence, a `fullBleed` row, a video asset — done 2026-08-08, see "What exercising the template found" below
- [x] Text blocks stay block-level — decided 2026-08-07, no per-element styling. The CTA inherits
      the block's weight by design; do not add a separate CTA weight field.
- [x] Confirm the entry/exit image crop (fixed 1492x754 / 1492x906 boxes + `object-cover`) holds for portrait, landscape, and square source images — done 2026-08-08, all six ratio/slot combinations centre-crop correctly
- [x] Body media rows need a per-row height: the original crops each row to an authored height (1036, 705, 829, 788, 663 …) rather than using the asset's own aspect ratio, which is why our rows don't line up with it. Needs a schema field, so it was left out of Phase 1. — added 2026-08-08 as the `height` field
- [x] **Uneven column splits** — done 2026-08-08. A `columnWidths` text field takes canvas px
      (`"735 490"`); anything unparseable degrades to equal columns.
- [x] **Partial-width offset single images** — done 2026-08-08, and it fell out of the same field:
      a single width leaves the row short, and `align` (left/center/right) places it.
- [ ] ~~Settle the homepage → project linking model~~ — **moved to Phase 4.** Every thumbnail
      hardcodes `/matteomeller` in `PortfolioCanvas.tsx`, and it cannot be fixed until the other
      projects exist and have real slugs.

### What exercising the template found

Built three throwaway projects covering every unused path, measured them in a real browser, then
deleted them. Two genuine bugs, both now fixed:

- **Authored row heights overflowed their box.** Setting `height` on the grid was not enough —
  grid tracks size to their content, so a tall asset simply overflowed while `h-full` resolved
  against the grown track. A 400px row was rendering a 1106px image. Fixed by pinning the implicit
  rows to `minmax(0, 1fr)`. The markup looked correct throughout; only measuring the live rows
  caught it.
- **Videos reserved no layout space.** Images get exact dimensions from sharp at build time;
  videos got nothing, so a `<video>` sat at the browser's default 150px until its metadata loaded
  and then snapped to full height — a ~1390px jump for an 864x1080 clip in a full-width row. Fixed
  by reading dimensions from the mp4's `tkhd` box in `src/lib/projects.ts`.

Everything else came through clean: 3- and 4-column rows, full-bleed rows, consecutive text blocks
with independent alignment/size/weight, and mixed video+image rows all render as authored. A row
with an authored height aligns sources of wildly different ratios (500x1400, 1800x500, 1000x1000)
to identical heights — which is the behaviour the original relies on.

### Where the media schema came from

`rowHeight`, `columnWidths` and `align` were taken from the unmerged `worktree-phase-2-template`
branch (7bf990a), along with its removal of `isRequired` from `columns` and `gap`. That branch also
gave every paragraph and CTA its own font size and weight; **that half was deliberately dropped** —
it predates the "no per-element text styling" decision and would have meant migrating stored
content. Text blocks stay block-level. The branch can be deleted.

One thing to know when authoring: `columnWidths` are absolute canvas measurements, so widths adding
up past the 1217px content column overflow it. The original's own 735/490 split is one of these
(1225px before the gap) and needs **Full width** ticked, which centres it in the viewport instead.
The field description says so.

## Phase 3 — Mobile and responsive — DONE (2026-08-08)

- [x] **Mobile model decided: hybrid.** The homepage canvas uses the original's own
      mobile coordinates; everything else reaches its mobile form with plain CSS.
- [x] Project pages: body rows collapse to one column at 18px margins, entry/exit images
      take their own mobile boxes, chrome and text blocks checked at 375px
- [x] The sticky CV reveal no longer bleeds — `PortfolioCanvas` isolates its stacking context,
      so `coming-soon` (z-48) and the poster (z-42) can't paint over the panel's z-30

### How the original does mobile — measured, worth not rediscovering

It ships **two independently authored layouts**, not one that reflows: mobile against a
**375px** reference, desktop against 1492, switching at **1024px** (which is Tailwind's `lg`).
Every item carries both coordinate sets.

**All of this came out of the original's own page payload, not out of a browser.** It embeds
its complete layout table in `<script id="__NEXT_DATA__">` — `props.pageProps.project.layouts`
gives the breakpoints, `props.pageProps.article.sections[].items` gives every item's `area.m`
and `area.d`. Dimensions are stored as fractions of the layout width, so multiply by 375 or
1492. Reach for that before measuring anything by hand; see
`docs/research/PAGE_TOPOLOGY.md`.

What it turned up that guesswork would have missed:

- Miche's radius is a *fraction of the layout width*, so the same stored value is a full circle
  on desktop and an ~80px rounded square on mobile. The video's tilt also flips, -10deg to +10deg.
- The original **hides** "Graphic Design", "Portfolio" and "Say Hello!" from the header below
  1024, showing a "Graphic Designer" label instead, and hides "LinkedIn" and "Download Area"
  from the bottom bar. Four items at the desktop offsets collide well before 375px.
- The bio stops being a fixed centred panel and joins the scroll flow (`MobileBio`), which is
  why the mobile canvas stops at 2806 — where the original's bio begins.
- Body media rows ignore `rowHeight`, `columnWidths` and `fullBleed` on mobile. Those are
  measurements of the 1492px canvas; the original stacks every row at left 18 / width 338.

Rather than the hidden duplicate of every item the original ships, each item carries both
placements as CSS custom properties and one media query in `globals.css` picks a set — one DOM
tree, so phones don't download the images twice.

Verified in a headless browser at 375px: all nine posters land within 1px of the original's
coordinates, all nine are hit-testable via `elementFromPoint`, no horizontal overflow on either
page, and the 1440px desktop layout is unchanged.

## Phase 4 — Upload all project media — DONE (2026-08-09)

All eight of the original's projects now exist: Intersections · Nutrients · Matteo Meller ·
Bella che ti Spiazza · Miche · Anselmi · Visual Group · Attiva Servizi. (The earlier list of
six was wrong — it omitted Bella, and three homepage thumbnails pointed at the wrong project.)

- [x] Create each project in `/keystatic` — done through the CMS UI, driven by Playwright
- [x] Point each homepage thumbnail at its real slug — items now carry a `slug`, and
      `PortfolioCanvas` links one only when its project actually renders, so adding a
      project needs no code change here
- [x] Media staged from the original's own CDN into `content/_input/_cdn/` (gitignored, 49MB)

### How the import works, and how to add another project

Three scripts in `scripts/`, run in order against a dev server:

1. `import-stage-assets.mjs` — downloads every published asset, naming each by size and
   position so it can be matched back to its item.
2. `import-specs.mjs` — reads the layout table embedded in each original page and writes
   `scripts/specs/<slug>.json`: meta, description, hero images, and the body as canvas items
   at the original's exact coordinates.
3. `import-author.mjs` — drives `/keystatic` in a real browser to author it. **Playwright is
   deliberately not a dependency**; install it only for the import and uninstall afterwards.
   The script header carries the exact sequence.

Verified with `import-verify.mjs`: every item on all seven new pages lands within **0px** of
its authored position at a 1492px viewport, and no page overflows horizontally at 375px. The
one apparent exception is intersections' 45° image, whose axis-aligned bounding box is
correctly 536px for a 379px square.

### Deliberate decisions

- **Bodies are one canvas block, not a stack of rows.** The original authors its own vertical
  rhythm (anselmi's rows sit 83px apart, not a flex gap), and several pages place items rows
  cannot express at all. One canvas reproduces both exactly. Media rows remain the right tool
  for hand-authored pages and are unchanged; `matteomeller` still uses them.
- **Cortina 2K26 was left out** at Alessandro's request. Galilei likewise has no route on the
  original; both remain candidates for the COMING SOON slot, which stays deliberately unlinked.
- **Weight:** `public/` now carries 83MB of media (65MB images, 18MB videos). `matteomeller`
  is still the heaviest single project at 22MB, then intersections at 12MB. Worth a pass in
  Phase 5 if it matters — these are the original's own already-compressed exports.

### What the original turned out to contain

- **`visualgroup` is half-finished on the original.** It keeps a Lorem ipsum intro block and a
  duplicated Client/Type/Year, both behind `hidden.d`, and names its last two sections
  identically. The import filters hidden items and keys sections by index rather than name.
- Its real copy ("We sometimes forget that the mannequins…") is what we ship.

## Phase 5 — Check

Full QA pass before going public on the real domain.

- [x] Every project page renders correctly and every link resolves — all 9 routes 200,
      **0 broken assets** across 260 references, 0 dead internal links, `/does-not-exist` 404s
- [x] `npm run check` clean; CI green
- [x] Cross-browser and cross-device spot check — Chromium, Firefox and WebKit at 1440x900
      and 375x812: no console errors, no page errors, no horizontal overflow, and every
      homepage poster hit-testable via `elementFromPoint` in all six combinations
- [x] SEO basics — `metadataBase`, site-wide Open Graph + Twitter cards, per-project
      `generateMetadata`, `sitemap.ts`, `robots.ts`
- [x] A real `not-found.tsx` (there was none; unknown URLs got Next's bare default)
- [x] Accessibility: **decided 2026-08-09 — CMS-driven images stay `alt=""` as decorative.**
      The case study's text blocks carry the meaning; an empty alt makes a screen reader skip
      the image rather than announce a filename. Do not replace this with a generated string —
      real per-image alt text means a schema field and ~100 authored strings. The decision is
      commented at both sites (`MediaAsset.tsx`, `ProjectCanvas.tsx`).

### Two real bugs found and fixed

- **Every desktop width scrolled sideways on `/intersections`** — 12px at 1440, growing with
  the viewport (8px at 1024, 21px at 2560). Not a transcription error: the original authors
  that PORTFOLIO 2 image at left 950.9 / width 552.6, i.e. running to **1503.6 on a 1492
  canvas**. The original absorbs it with `overflow: clip` on its `.article` wrapper; we had no
  equivalent. Fixed with `overflow-x: clip` on the desktop `.project-canvas` rule. It must be
  `clip` and not `hidden` — `hidden` on one axis forces the other to `auto`, making the canvas
  a scroll container. Phase 3 only ever checked overflow at 375px, which is why this survived.
- **`/nutrients` would have shared a blank link preview.** Its entry image is an SVG, and no
  major network renders SVG in a card. `generateMetadata` now falls back to the site card for
  SVG heroes.

### Open — need your call, not blockers

- **`public/seo/og-image.jpeg` is 300x209.** Above every network's minimum, so previews do
  work, but far below the 1200x630 they render at, so it will look soft and small. Replacing
  it is a design decision, so it was left alone; the real dimensions are declared in
  `layout.tsx` and the comment there says to update them when the asset changes.
- **The LinkedIn profile link cannot be verified programmatically.** It returns `999` to both
  curl and a real headless Chromium — that is LinkedIn's anti-automation block, not a dead
  link. Worth one manual click before going public.
- **`metadataBase` falls back to `https://pf-clone-2.vercel.app`.** Phase 6 should set
  `NEXT_PUBLIC_SITE_URL` to the real origin rather than edit `src/lib/site.ts`.

### Page weight — measured, not optimised

Deliberately measured only (decided 2026-08-09). Two numbers per page, and the gap between
them is the offscreen deferral from Phase 4 doing its job:

| Route | Initial load | Fully scrolled |
|---|---|---|
| `/` | 8.4 MB | 15.0 MB |
| `/matteomeller` | 4.6 MB | 23.3 MB |
| `/intersections` | 4.3 MB | 12.7 MB |
| `/miche` | 3.3 MB | 12.6 MB |
| `/bella` | 3.0 MB | 10.4 MB |
| `/nutrients` | 6.0 MB | 3.5 MB* |
| `/attivaservizi` | 3.1 MB | 5.5 MB |
| `/anselmi` | 4.1 MB | 4.2 MB |
| `/visualgroup` | 2.7 MB | 3.7 MB |

\* `/nutrients` measures *higher* on initial load because its GIFs and SVGs are inline and
eager, so nothing is deferred; the "fully scrolled" column counts `Content-Length` and the
two large GIFs compress differently in transit. It is the one page where deferral buys nothing.

The homepage's 8.4 MB before a single scroll is the number to watch if it ever matters — it is
the first impression and the heaviest entry point. Everything else is the original's own
already-compressed exports on a CDN.

### Branch housekeeping

`worktree-phase-4-projects` and `worktree-wipe-home-return` are fully merged into `master` and
can be deleted. `worktree-priorities-security-links` is stale — its code landed under different
hashes — **but its `docs/research/PAGE_TOPOLOGY.md` has two sections master's copy lacks** (the
mobile coordinate table and the per-page item inventory). Salvage that file before deleting it.

## Phase 6 — Connect the domain

- [ ] Add the custom domain in Vercel → Project → Settings → Domains
- [ ] Update DNS at the registrar (`A`/`ALIAS` for the apex, `CNAME` for `www`)
- [ ] Confirm HTTPS issues automatically, then set `metadataBase` to the real origin

---

## Parked — revisit when the phases above are done

- **Entry/exit reveal animations.** `src/components/project/RevealOnView.tsx` is built and working (clip-path curtain wipe, direction-aware) but deliberately unhooked. Last state: 0.7s `ease-in-out`, no opacity fade. To re-enable, wrap the asset in `EntryImage.tsx` / `ExitImage.tsx` with `direction="down"` / `direction="up"`. Unrelated to the page wipe between routes, which is live — see `AGENTS.md`.
- **Transition tags are hardcoded.** `src/lib/transitionTags.ts` maps each route by hand; all eight projects now have an entry. Any *new* project still needs one, or it falls back to "Alessandro Zanatta".
- **Lottie support.** Feasible: `fields.file()` accepts any file type, so uploads already work. Needs a third `"lottie"` asset kind in the schema, a player library (e.g. `lottie-react`), and wiring in `MediaAsset.tsx`.
- **CMS thumbnails in list views.** Keystatic's `itemLabel` only accepts a plain string in v0.6.4 — no images possible in the collapsed Body-blocks list. Workaround: keep the live project page open in a second tab while editing.
