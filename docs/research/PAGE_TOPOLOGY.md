# alessandrozanatta.it — Page Topology

Site engine: cntrl.site (Next.js page builder). Body background `#eeeeee`. Font: custom "Overused" (400/500/700, self-hosted OTF) with system fallback.

## Don't measure it — read its layout table

The site embeds its **complete authored layout** in `<script id="__NEXT_DATA__">`, for every
page and both layouts. One `curl` plus a JSON parse beats any amount of browser probing, and
it is how the mobile coordinates in Phase 3 were obtained.

```
curl -sL --compressed -A "<a desktop UA>" https://alessandrozanatta.it -o og-home.html
# parse the __NEXT_DATA__ script tag as JSON, then:
props.pageProps.project.layouts             # [{id:"m",startsWith:0,exemplary:375},
                                            #  {id:"d",startsWith:1024,exemplary:1440}]
props.pageProps.article.sections[].items    # every item, with area.m and area.d
```

- `top/left/width/height/radius` are **fractions of the layout width**. Multiply by 375 for
  mobile, and by **1492** for desktop — the measured canvas width, not the declared 1440.
  A radius therefore resolves differently per layout (see Miche in `ROADMAP.md`).
- `hidden.m` / `hidden.d` mark items dropped from a layout — this is how the mobile chrome
  was established.
- `item.type` is `richtext` (not `rich-text`), and its copy lives in `commonParams.text`,
  never in `layoutParams`. Compounds and groups nest their children under `items`.
- `commonParams.url` is the CDN asset URL; its ULID is what maps an item to our local file.
- `link.url` is each thumbnail's **real** slug — `/intersections`, `/nutrients`, `/bella`,
  `/miche`, `/anselmi`, `/visualgroup`, `/attivaservizi`. That is what Phase 4 needs to
  replace the hardcoded `/matteomeller` on every homepage item.

## Scope built
- `/` — Homepage (canvas)
- `/matteomeller` — Project case study (image stack)
- `/bella` — Project case study (image stack)

## Homepage (`/`)

Interaction model: **static document, absolute-positioned canvas**. Body scrolls normally (`scrollHeight: 4663px` at 1440 width). No JS-driven parallax/IntersectionObserver was detected — items are simply `position: absolute` at fixed px offsets within the tall document, or `position: fixed` for chrome (nav, footer, bio). Clicking nav labels does nothing (they're static labels, not routes/toggles). Portfolio thumbnails ARE links to `/<project-slug>`.

### Fixed chrome (position: fixed, present at all scroll positions)
- **Header nav** (top:0, full width, `#eeeeee` bg): "Alessandro Zanatta" (left) · "Graphic Design" (label) · "Portfolio" (label) · "Say Hello!" → `mailto:work@alessandrozanatta.it`. Font: Overused 700, ~17.6px, color `#1b1b1b`.
- **Bio panel** (top:132px, left:16px, w:355px): "Hello! I'm Alessandro Zanatta..." 4 paragraphs. Font: Overused 400, ~16.6px/21.8px line-height, color `#1b1b1b`.
- **Footer bar** (bottom, full width, `#eeeeee` bg): "2026" · "LinkedIn" → linkedin.com/in/alessandro-zanatta-515478223 · "Download Area" (cntrl.site file, treat as decorative/no-op) · "work@alessandrozanatta.it" → mailto.

### Absolute-positioned canvas items (document coords at 1440px viewport width)
Pre-rotated/composited images (rotation baked into the asset, no CSS transform needed):

| top | left | w | h | asset | links to |
|---|---|---|---|---|---|
| 192 | 647 | 581 | 533 | 01K7FSHN...webp (INTERSECTIONS poster on gravel) | /intersections |
| 1167 | 610 | 368 | 494 | 01KFRM9P...png (poster detail) | /matteomeller |
| 1801 | 632 | 557 | 557 | 01K7J9GX...webp (circular photo, border-radius 320px) | /miche |
| 2204 | 508 | 570 | 433 | 01K7H4E2...png | /anselmi |
| 2403 | 757 | 611 | 599 | 01K7CH55...webp | /nutrients |
| 2860 | 558 | 560 | 588 | 01K7J8RZ...webp | /visualgroup |
| 3327 | 784 | 539 | 413 | 01K7CHHJ...webp | /attivaservizi |
| 2684 | 1043 | 105 | 25 | "COMING SOON" (text label, no image) | — |
| ~4700 | 585 | — | — | "work@alessandrozanatta.it" mailto (bottom canvas) | mailto |

Plus a decorative gif (01K6ED322...gif) placed among the above (exact slot not pinned — treat as an additional floating element near the hero).

### CV panel (bottom of page, ~top 14000+, static 2-column layout, NOT the absolute canvas)
Two columns, "Experience" / "Education" headers, entries stacked, "Download full CV here!" → Dropbox PDF link. Content:

**Experience**
- MOMO Creative Studio (TV) — Graphic Designer — 2025 –
- Mindd (TV) — Graphic Designer — 2023 – 2024
- Cardillo Design (PD) — Junior Graphic Designer — 2021 – 2022

**Education**
- Cognitive Sciences — Università Studi di Padova — 2017 – 2020
- Graphic Design — Veneto Formazione — 2021 – 2022
- "Download full CV here!" → `https://www.dropbox.com/scl/fi/crq3uste4nb7yyx3e6i8j/Zanatta-Alessandro-CV.pdf`

## Project pages (`/matteomeller`, `/bella`)

Interaction model: **static, simple vertical flow** — no canvas positioning. Fixed nav header (same as homepage) stays on top. Fixed "← Back" link bottom-left (returns to `/`). Body is a centered column, max content width ~1492px, images stacked top-to-bottom (full-bleed 1492px wide, or centered 1217px wide, or paired side-by-side ~605-735px each). No text content on these pages besides the nav/back — pure image galleries.

- `/matteomeller`: 18 images (webp/jpeg/gif), total height 11546px.
- `/bella`: 14 images (webp/jpeg/svg), total height 8865px, includes tiny decorative SVG marks (17x9) placed between images.

## Global
- Colors: bg `#eeeeee`, text `#1b1b1b` / `#000`.
- Font: "Overused" self-hosted OTF (400, 500, 700) — no Google Fonts actually rendered despite the preconnect/stylesheet tags present in source (defensive load, unused).
- No dark mode, no scroll-snap, no smooth-scroll library detected.
