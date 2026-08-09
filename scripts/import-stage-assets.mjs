// Stages every published asset for the projects cloned from the original, into
// the gitignored content/_input/_cdn/<slug>/. Files are named by size and
// position so import-specs.mjs can match each one to its item, and so the
// authoring order is readable: 00-entry, NN-body, 99-exit.
//
// Run order: import-stage-assets.mjs -> import-specs.mjs -> import-author.mjs.
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const PAGES = path.join(ROOT, "content/_input/_cdn/_pages");
const OUT = path.join(ROOT, "content/_input/_cdn");
const W = 1492;
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36";

const SLUGS = [
  "intersections",
  "nutrients",
  "bella",
  "miche",
  "anselmi",
  "visualgroup",
  "attivaservizi",
];

async function pageData(slug) {
  fs.mkdirSync(PAGES, { recursive: true });
  const file = path.join(PAGES, `og-${slug}.html`);
  if (!fs.existsSync(file)) {
    const res = await fetch(`https://alessandrozanatta.it/${slug}`, {
      headers: { "user-agent": UA },
    });
    fs.writeFileSync(file, await res.text());
  }
  const html = fs.readFileSync(file, "utf8");
  return JSON.parse(html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/)[1]);
}

let total = 0;
for (const slug of SLUGS) {
  const data = await pageData(slug);
  const sections = data.props.pageProps.article.sections;
  const last = sections.length - 1;
  const rows = [];

  // Groups nest and report child coordinates relative to the group, so offsets
  // accumulate on the way down — the same resolution import-specs.mjs does.
  const walk = (items, secIndex, offX = 0, offY = 0) => {
    for (const it of items || []) {
      const d = it.area?.d ?? {};
      const px = (v) => (typeof v === "number" ? Math.round(v * W) : null);
      const left = (px(d.left) ?? 0) + offX;
      const top = (px(d.top) ?? 0) + offY;
      if (it.commonParams?.url && secIndex > 0) {
        rows.push({ secIndex, top, left, width: px(d.width), height: px(d.height), url: it.commonParams.url });
      }
      if (it.items?.length) walk(it.items, secIndex, left, top);
    }
  };
  sections.forEach((s, i) => walk(s.items, i));

  const dir = path.join(OUT, slug);
  fs.mkdirSync(dir, { recursive: true });

  let n = 0;
  let bytes = 0;
  for (const r of rows) {
    const slot = r.secIndex === 1 ? "00-entry" : r.secIndex === last ? "99-exit" : `${String(10 + n++).padStart(2, "0")}-body`;
    const ext = path.extname(new URL(r.url).pathname) || ".bin";
    const dest = path.join(dir, `${slot}_${r.width}x${r.height}_t${r.top}_l${r.left}${ext}`);
    if (fs.existsSync(dest)) {
      bytes += fs.statSync(dest).size;
      continue;
    }
    const res = await fetch(r.url);
    if (!res.ok) {
      console.log(`  !! ${res.status} ${r.url}`);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buf);
    bytes += buf.length;
  }
  total += bytes;
  console.log(`${slug.padEnd(15)} ${String(rows.length).padStart(2)} assets  ${(bytes / 1e6).toFixed(1)} MB`);
}
console.log(`\ntotal ${(total / 1e6).toFixed(1)} MB`);
