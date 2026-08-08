# alessandrozanatta.it — Page Topology

Site engine: cntrl.site (Next.js page builder). Body background `#eeeeee`. Font: custom "Overused" (400/500/700, self-hosted OTF) with system fallback.

## Project routes on the original

All eight, confirmed from the homepage's own link targets:
`/intersections` · `/nutrients` · `/matteomeller` · `/bella` · `/miche` · `/anselmi` · `/visualgroup` · `/attivaservizi`

`content/_input/` also holds raw assets for **Galilei** and **Cortina 2K26**, which have
no route on the original — they are the likely candidates for the COMING SOON slot.

## Homepage (`/`)

Interaction model: **static document, absolute-positioned canvas**. Body scrolls normally (`scrollHeight: 4663px` at 1440 width). No JS-driven parallax/IntersectionObserver was detected — items are simply `position: absolute` at fixed px offsets within the tall document, or `position: fixed` for chrome (nav, footer, bio). Clicking nav labels does nothing (they're static labels, not routes/toggles). Portfolio thumbnails ARE links to `/<project-slug>`.

### Fixed chrome (position: fixed, present at all scroll positions)
- **Header nav** (top:0, full width, `#eeeeee` bg): "Alessandro Zanatta" (left) · "Graphic Design" (label) · "Portfolio" (label) · "Say Hello!" → `mailto:work@alessandrozanatta.it`. Font: Overused 700, ~17.6px, color `#1b1b1b`.
- **Bio panel** (top:132px, left:16px, w:355px): "Hello! I'm Alessandro Zanatta..." 4 paragraphs. Font: Overused 400, ~16.6px/21.8px line-height, color `#1b1b1b`.
- **Footer bar** (bottom, full width, `#eeeeee` bg): "2026" · "LinkedIn" → linkedin.com/in/alessandro-zanatta-515478223 · "Download Area" (cntrl.site file, treat as decorative/no-op) · "work@alessandrozanatta.it" → mailto.

### Absolute-positioned canvas items (canvas coords, authored at 1492px)

Link targets below are read from `link.url` in the layout JSON embedded in the
original's HTML, not inferred from the artwork. An earlier version of this table
guessed three of them wrong; the values here are the measured ones.

| top | left | w | h | asset | links to |
|---|---|---|---|---|---|
| 192 | 647 | 581 | 533 | 01K7FSHN...webp (INTERSECTIONS poster on gravel, −10°) | /intersections |
| 622 | 655 | 583 | 711 | 01K6ED322...gif | /nutrients |
| 1167 | 610 | 368 | 494 | 01KFRM9P...png (poster detail) | /matteomeller |
| 1484 | 898 | 371 | 464 | 01K7FVNC...mp4 video reel (−10°) | **/bella** |
| 1801 | 632 | 557 | 557 | 01K7J9GX...webp (circular photo) | /miche |
| 2204 | 508 | 570 | 433 | 01K7H4E2...png | /anselmi |
| 2403 | 757 | 611 | 599 | 01K7CH55...webp | **— (unlinked)** |
| 2684 | 1043 | 105 | 25 | "COMING SOON" (text label, no image) | — |
| 2860 | 558 | 560 | 588 | 01K7J8RZ...webp | /visualgroup |
| 3327 | 784 | 539 | 413 | 01K7CHHJ...webp | /attivaservizi |

The item at 2403 is the project the COMING SOON label sits on — the original
leaves it deliberately unlinked. It is *not* Nutrients; Nutrients is the gif at 622.

### Mobile layout — coordinates already exist, do not re-measure

Every item in the original's layout JSON carries `area.m` (mobile) alongside
`area.d` (desktop), both as fractions of the container width. So the original's
mobile model is **proportional scaling against a second coordinate set**, not a
reflow — which settles the open question in Phase 3 of the roadmap.

Homepage items, mobile `top/left/width/height` as fractions of viewport width:

| desktop top | mobile top | left | width | height | angle (d → m) |
|---|---|---|---|---|---|
| 192 | 0.216 | 0.149 | 0.702 | 0.595 | −10 → −10 |
| 622 | 0.884 | 0.143 | 0.713 | 0.984 | 0 |
| 1167 | 1.882 | 0.196 | 0.608 | 0.816 | 0 |
| 1484 | 2.800 | 0.174 | 0.651 | 0.726 | **−10 → +10** |
| 1801 | 3.627 | 0.099 | 0.801 | 0.801 | 0 |
| 2204 | 4.457 | 0.049 | 0.902 | 0.685 | 0 |
| 2403 | 5.089 | 0.109 | 0.782 | 0.767 | 0 |
| 2860 | 5.914 | 0.133 | 0.734 | 0.806 | 0 |
| 3327 | 6.784 | 0.133 | 0.734 | 0.501 | 0 |

Note the video reel flips its tilt from −10° to +10° on mobile.

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

## Project pages — all eight

Fixed nav header (same as homepage) stays on top. Fixed "← Back" link bottom-left
(returns to `/`). Every page opens with a **1492x754 entry image** and closes with a
**1492x906 exit image**, and every page carries a Client / Type / Year block plus a
description. That much is universal, and our Project Template matches it.

Below that, the model is **not** a vertical stack of rows — it is a canvas with
nested groups, the same engine as the homepage. Item inventory per page:

| page | images | videos | groups | other | Client / Type / Year |
|---|---|---|---|---|---|
| intersections | 13 | – | 4 | – | Intersections Festival / Visual Identity / 2024 |
| miche | 14 | 3 | 10 | – | Miche Srl / Product Graphic Design / 2023-2025 |
| anselmi | 5 | – | 3 | 1 rectangle | Fabio Anselmi / Brand Identity / 2025 |
| nutrients | 18 | – | 5 | **1 youtube-embed** | Personal / Motion Design / 2024 |
| visualgroup | 13 | 1 | 2 | – | Visual Group / Editorial / 2025 |
| attivaservizi | 8 | – | 3 | 1 rectangle | Attiva Servizi / Visual Identity / 2025 |
| bella | 12 | 1 | 5 | – | Bella che ti Spiazza / Visual Identity / 2025 |
| matteomeller | 17 | – | 4 | – | Matteo Meller / Brand Identity, Website / 2024 |

### Layout features the original uses that our template cannot express

- **Rotation.** intersections has a 379x379 image at **45°**; nutrients (60x30) and
  matteomeller (17x9) have small decorative marks at **180°**.
- **Overlap / free positioning.** matteomeller places a 444x313 image on top of the
  row above it; bella overlays a 507x677 image on a four-up strip.
- **`youtube-embed`** on nutrients — the Motion Design project. No such asset kind
  in `keystatic.config.ts` (image and video only).
- **`rectangle`** — a solid colour block, used on anselmi and attivaservizi.
- **Groups** — 2 to 10 nested coordinate spaces per page. Grouped items report
  coordinates relative to their group, so absolute positions for those cannot be
  read straight off the JSON.
- **Positioned text labels.** miche places `SYNTIUM` / `966` / `X1` as free-standing
  labels; intersections has a pull-quote carrying a `\r` soft line break.
  `ProjectTextBlock` only renders full-width left/center/right blocks.

### Row geometry

Rows are cropped to an **authored height**, not to the asset's own aspect ratio.
Heights seen: 1036, 995, 954, 953, 906, 870, 829, 811, 794, 788, 787, 783, 769,
754, 746, 705, 663, 580. Content column is 1217px wide at left=137 (81.57% of 1492);
full-bleed rows are 1492.

Column splits are **not always even** and gaps are authored per row:

- matteomeller: **735 + 482** with a **0px gap** (60/40 split)
- intersections: 553 + 551, gap 113
- nutrients: 464 + 464 gap 297; 547 + 547 gap 123; also a **4-up row** of 212x262 at
  left 0 / 336 / 671 / 1006
- bella: a 723-wide image left-aligned at left=0, i.e. partial width with an offset

Our default gap of 24px matches none of these — set it per row.

## Global
- Colors: bg `#eeeeee`, text `#1b1b1b` / `#000`.
- Font: "Overused" self-hosted OTF (400, 500, 700) — no Google Fonts actually rendered despite the preconnect/stylesheet tags present in source (defensive load, unused).
- No dark mode, no scroll-snap, no smooth-scroll library detected.
