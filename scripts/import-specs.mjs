// Turns each original project page into an authoring spec: meta, hero images,
// and one canvas block carrying the body at the original's exact coordinates.
//
// The body is a single canvas rather than a stack of rows because the original
// authors the vertical rhythm itself — anselmi's rows sit 83px apart, not the
// template's flex gap — and because several pages place items rows cannot hold
// at all. One canvas reproduces both exactly and keeps authoring uniform.
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
// Cached copies of the original's pages, under the gitignored staging tree.
const TMP = path.join(ROOT, "content/_input/_cdn/_pages");
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36";
const W = 1492;

const META = {
  intersections: { name: "Intersections" },
  nutrients: { name: "Nutrients" },
  bella: { name: "Bella che ti Spiazza" },
  miche: { name: "Miche" },
  anselmi: { name: "Anselmi" },
  visualgroup: { name: "Visual Group" },
  attivaservizi: { name: "Attiva Servizi" },
};

/** oklch(L C H / A) -> #rrggbb. The originals are near-neutral, so this only has to be close. */
function oklchToHex(str) {
  const m = str.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)/);
  if (!m) return "#000000";
  const [L, C, H] = [parseFloat(m[1]), parseFloat(m[2]), (parseFloat(m[3]) * Math.PI) / 180];
  const a = C * Math.cos(H);
  const b = C * Math.sin(H);
  const l_ = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m_ = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s_ = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const lin = [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ];
  const g = (v) =>
    Math.round(255 * Math.max(0, Math.min(1, v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055)));
  return "#" + lin.map((v) => g(v).toString(16).padStart(2, "0")).join("");
}

async function pageHtml(slug) {
  fs.mkdirSync(TMP, { recursive: true });
  const file = path.join(TMP, `og-${slug}.html`);
  if (!fs.existsSync(file)) {
    const res = await fetch(`https://alessandrozanatta.it/${slug}`, {
      headers: { "user-agent": UA },
    });
    fs.writeFileSync(file, await res.text());
  }
  return fs.readFileSync(file, "utf8");
}

function pageItems(slug, html) {
  const data = JSON.parse(html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/)[1]);
  const out = [];
  const walk = (items, sec, secIndex, offX = 0, offY = 0) => {
    for (const it of items || []) {
      const d = it.area?.d ?? {};
      const px = (v) => (typeof v === "number" ? Math.round(v * W) : null);
      const left = (px(d.left) ?? 0) + offX;
      const topv = (px(d.top) ?? 0) + offY;
      out.push({
        section: sec,
        secIndex,
        type: it.type,
        top: topv,
        left,
        width: px(d.width),
        height: px(d.height),
        angle: Math.round(d.angle ?? 0),
        z: d.zIndex ?? 1,
        url: it.commonParams?.url ?? null,
        text: it.commonParams?.text ?? null,
        fill: it.layoutParams?.d?.fill?.[0]?.value ?? null,
        backdrop: it.layoutParams?.d?.backdropBlur ?? 0,
        hiddenD: it.hidden?.d ?? false,
        fontSize: it.layoutParams?.d?.fontSize
          ? Math.round(it.layoutParams.d.fontSize * 1440)
          : null,
        fontWeight: it.layoutParams?.d?.fontWeight ?? null,
      });
      if (it.items?.length) walk(it.items, sec, secIndex, left, topv);
    }
  };
  const sections = data.props.pageProps.article.sections;
  sections.forEach((s, i) => walk(s.items, s.name, i));
  out.lastSection = sections.length - 1;
  return out;
}

const staged = (slug) => fs.readdirSync(path.join(ROOT, "content/_input/_cdn", slug));

for (const slug of Object.keys(META)) {
  const items = pageItems(slug, await pageHtml(slug));
  const files = staged(slug);

  // Meta text lives in INTRO TEXT: a "Client/Type/Year" label column, the values
  // beside it, and the description. The values block is the one that is not the
  // label block and sits left of the description.
  const last = items.lastSection;
  const intro = items
    .filter((i) => i.secIndex === 2 && i.text?.trim() && !i.hiddenD)
    .sort((a, b) => a.left - b.left);
  const labels = intro.find((i) => i.text.startsWith("Client"));
  const values = intro.find((i) => i !== labels && i.left < (labels?.left ?? 0) + 400 && i.left > (labels?.left ?? 0));
  const description = intro
    .filter((i) => i !== labels && i !== values && !i.text.startsWith("Client"))
    .sort((a, b) => b.text.length - a.text.length)[0];
  const [client, type, year] = (values?.text ?? "\n\n").split("\n");

  const entry = items.find((i) => i.secIndex === 1 && i.url && i.width === W && !i.hiddenD);
  const exit = items.find((i) => i.secIndex === last && i.url && i.width === W);

  // Body = everything below the intro, minus the page chrome.
  const body = items.filter(
    (i) =>
      i.secIndex >= 3 &&
      i.secIndex < last &&
      !i.hiddenD &&
      !["group", "compound"].includes(i.type) &&
      !(i.type === "rectangle" && i.backdrop > 0) // header/footer bars
  );
  const minTop = Math.min(...body.map((i) => i.top));

  const fileFor = (it) =>
    files.find(
      (f) =>
        !f.startsWith("00-entry") &&
        !f.startsWith("99-exit") &&
        f.includes(`_t${it.top}_l${it.left}`)
    ) ?? null;

  const canvasItems = [];
  for (const it of body) {
    const base = {
      top: it.top - minTop,
      left: it.left,
      width: it.width,
      zIndex: it.z,
      rotate: it.angle || 0,
    };
    if (it.type === "image" || it.type === "video") {
      const f = fileFor(it);
      if (!f) {
        console.log(`  !! ${slug}: no staged file for ${it.type} t${it.top} l${it.left}`);
        continue;
      }
      canvasItems.push({ ...base, kind: it.type, file: f, height: it.height });
    } else if (it.type === "youtube-embed") {
      canvasItems.push({ ...base, kind: "youtube", url: it.url, height: it.height });
    } else if (it.type === "rectangle") {
      canvasItems.push({ ...base, kind: "rectangle", color: oklchToHex(it.fill ?? ""), height: it.height });
    } else if (it.type === "richtext" && it.text?.trim()) {
      canvasItems.push({
        ...base,
        kind: "text",
        text: it.text.replace(/\r/g, "").trimEnd(),
        fontSize: it.fontSize ?? 22,
        fontWeight: it.fontWeight ?? 400,
      });
    }
  }
  canvasItems.sort((a, b) => a.top - b.top || a.left - b.left);
  const height = Math.max(...canvasItems.map((i) => i.top + (i.height ?? 0)));

  const spec = {
    slug,
    name: META[slug].name,
    client: (client ?? "").trim(),
    type: (type ?? "").trim(),
    year: (year ?? "").trim(),
    description: (description?.text ?? "").replace(/\r/g, "").trim(),
    entry: entry && files.find((f) => f.includes(`${entry.width}x${entry.height}_t${entry.top}_l${entry.left}`)),
    exit: exit && files.find((f) => f.includes(`${exit.width}x${exit.height}_t${exit.top}_l${exit.left}`)),
    body: [{ type: "canvas", height, items: canvasItems }],
  };

  fs.writeFileSync(
    path.join(ROOT, "scripts/specs", `${slug}.json`),
    JSON.stringify(spec, null, 1)
  );
  console.log(
    `${slug.padEnd(15)} ${String(canvasItems.length).padStart(2)} items  h${height}  ${spec.client} / ${spec.type} / ${spec.year}`
  );
}
