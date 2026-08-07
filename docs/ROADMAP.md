# Roadmap

Working order, set by Alessandro. Work top-down: finish a phase before starting the next, unless he says otherwise.

Status: `[ ]` not started · `[~]` in progress · `[x]` done

---

## Phase 1 — Fix the site as we see it

Visual fidelity pass against the original. Desktop only at this stage; responsive comes in Phase 3.

- [ ] Walk the homepage and `/matteomeller` side by side with [alessandrozanatta.it](https://alessandrozanatta.it) and list what's off
- [ ] Known font mismatches, found in a full audit (deferred at the time, still outstanding):
  - [ ] `PortfolioCanvas.tsx` — "COMING SOON" badge is `700` / `13px`, original is `500` / `16px`
  - [ ] `ProjectTemplate.tsx` — "Back" link is `700` (`font-bold`) / `17px`, original is `500` / `16px`

Dropped by Alessandro on 2026-08-07, deliberately not tracked: the text-block CTA weight
(`matteomeller.com` rendering `400` where the original uses `500`), and the grain overlay
intensity. Both were judged fine as they are — do not reopen them as fidelity bugs.

Everything else checked in that audit (header, footer, bio, CV panel, project meta, first description) already matches on both weight and size.

## Phase 2 — Properly set up the template project

Make the Project Template genuinely reusable before pouring content into it.

- [ ] Exercise the untested paths: 3- and 4-column media rows, multiple text blocks in sequence, a `fullBleed` row, a video asset
- [ ] Decide whether text blocks need per-element styling (paragraph vs CTA) or stay block-level
- [ ] Confirm the entry/exit image crop (fixed 1492x754 / 1492x906 boxes + `object-cover`) holds for portrait, landscape, and square source images
- [ ] Body media rows need a per-row height: the original crops each row to an authored height (1036, 705, 829, 788, 663 …) rather than using the asset's own aspect ratio, which is why our rows don't line up with it. Needs a schema field, so it was left out of Phase 1.
- [ ] Settle the homepage → project linking model: every thumbnail currently hardcodes `/matteomeller` in `PortfolioCanvas.tsx`. Once real slugs exist, point each item at its own project.

## Phase 3 — Mobile and responsive

The homepage canvas currently scales the whole 1440px composition uniformly (`ScaledCanvas.tsx`), so on a phone everything shrinks proportionally rather than reflowing. `BioPanel` is desktop-only (`hidden lg:flex`).

- [ ] Decide the mobile model: proportional scaling (current), a distinct mobile layout, or a hybrid. The original site ships separate mobile coordinates — see `docs/research/PAGE_TOPOLOGY.md`.
- [ ] Project pages: check media grid, entry/exit images, sticky header/footer, and text blocks at phone and tablet widths
- [ ] Verify the sticky CV reveal on short viewports (two canvas items carry z-index above the panel and may bleed through — `coming-soon` at z-48 and `matteomeller` at z-42 vs the panel's z-30)

## Phase 4 — Upload all project media

Only `matteomeller` exists so far. The original site has these projects (see `PAGE_TOPOLOGY.md`):
Intersections · Miche · Anselmi · Nutrients · Visual Group · Attiva Servizi

- [ ] Create each project in `/keystatic` — **always upload through the CMS UI**, never by hand-editing JSON (see the gotchas in `AGENTS.md`)
- [ ] Point each homepage thumbnail at its real slug

## Phase 5 — Check

Full QA pass before going public on the real domain.

- [ ] Every project page renders correctly and every link resolves
- [ ] `npm run check` clean; CI green
- [ ] Cross-browser and cross-device spot check
- [ ] SEO basics: Open Graph tags, per-project `generateMetadata`, `sitemap.ts`, `robots.txt` — none exist yet
- [ ] Accessibility: CMS-driven images currently render with empty `alt` (`MediaAsset.tsx`); consider an alt-text field in the schema

## Phase 6 — Connect the domain

- [ ] Add the custom domain in Vercel → Project → Settings → Domains
- [ ] Update DNS at the registrar (`A`/`ALIAS` for the apex, `CNAME` for `www`)
- [ ] Confirm HTTPS issues automatically, then set `metadataBase` to the real origin

---

## Parked — revisit when the phases above are done

- **Entry/exit reveal animations.** `src/components/project/RevealOnView.tsx` is built and working (clip-path curtain wipe, direction-aware) but deliberately unhooked. Last state: 0.7s `ease-in-out`, no opacity fade. To re-enable, wrap the asset in `EntryImage.tsx` / `ExitImage.tsx` with `direction="down"` / `direction="up"`.
- **Lottie support.** Feasible: `fields.file()` accepts any file type, so uploads already work. Needs a third `"lottie"` asset kind in the schema, a player library (e.g. `lottie-react`), and wiring in `MediaAsset.tsx`.
- **CMS thumbnails in list views.** Keystatic's `itemLabel` only accepts a plain string in v0.6.4 — no images possible in the collapsed Body-blocks list. Workaround: keep the live project page open in a second tab while editing.
