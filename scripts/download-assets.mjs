import fs from "node:fs";
import path from "node:path";

const BASE = "https://cdn.cntrl.site/projects/01JCQK4BJ0Z23TMMEBT7AF1T1X";

const FONTS = [
  { url: `${BASE}/fonts/01K1KNN23P4CXJ49AHJ445B227.otf`, out: "public/fonts/overused-medium.otf" },
  { url: `${BASE}/fonts/01K0YNA6DKMQTCEJX9RPT6WRA9.otf`, out: "public/fonts/overused-bold.otf" },
  { url: `${BASE}/fonts/01K0YN96R4TWK5VNE85GT7R1XD.otf`, out: "public/fonts/overused-regular.otf" },
];

const SEO = [
  { url: `${BASE}/project-assets/01K758S3KZV13KP486N12VRRDV.svg`, out: "public/seo/favicon.svg" },
  { url: `${BASE}/project-assets/01KFTZ3TNGG8H5S97M6R6RPSS5.jpeg`, out: "public/seo/og-image.jpeg" },
];

const HOME = [
  "01KFRM9P6S9WPJZY8WYQMH09AQ.png",
  "01K7J9GXPKRC6EHA66C8E3TMWC.webp",
  "01K7H4E2QYKQSFEAY19RKRPFWJ.png",
  "01K7FSHN3PBRK38PQNRBV3S3XH.webp",
  "01K7J8RZ7BY2Z2QGC84N1D65G7.webp",
  "01K7CHHJ966KN521QRZEA3GEW7.webp",
  "01K7CH55PWQR15RV07GT255G67.webp",
  "01K6ED322FX5PF204385YMPZ13.gif",
  "01KAVH6HP6ZK57SPGRTM885Q7M.jpeg",
].map((f) => ({ url: `${BASE}/articles-assets/${f}`, out: `public/images/home/${f}` }));

const HOME_VIDEOS = [
  "01K7FVNCECYCS9NXXCMDEPJFNY.mp4",
].map((f) => ({ url: `${BASE}/articles-assets/${f}`, out: `public/videos/home/${f}` }));

const ALL = [...FONTS, ...SEO, ...HOME, ...HOME_VIDEOS];

async function downloadOne({ url, out }) {
  const dest = path.resolve(process.cwd(), out);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (fs.existsSync(dest)) return { out, status: "skip" };
  const res = await fetch(url);
  if (!res.ok) return { out, status: `error ${res.status}` };
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  return { out, status: `ok (${buf.length}b)` };
}

async function run() {
  const batchSize = 4;
  for (let i = 0; i < ALL.length; i += batchSize) {
    const batch = ALL.slice(i, i + batchSize);
    const results = await Promise.all(batch.map(downloadOne));
    results.forEach((r) => console.log(r.status.padEnd(14), r.out));
  }
}

run();
