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
].map((f) => ({ url: `${BASE}/articles-assets/${f}`, out: `public/images/home/${f}` }));

const MATTEOMELLER = [
  "01K7YBMEEBCQDECMBTEZ96KF3C.webp",
  "01K6B9WCYC506PHVMFJ6G9W242.svg",
  "01K7YCNDKYCV37XWE4351MQYDM.gif",
  "01K7YCMP9YZTG7876T67W1MSX0.webp",
  "01K7YCHMESWDHSX6KYTGJR9TSV.gif",
  "01K7YCEH77AYZA7Z2JZ1J7ZKR3.gif",
  "01K7YC9HVGQ9VT27KAPJ7HE4FV.webp",
  "01KGZRY911MTGDKRGGEDKG3SXJ.jpeg",
  "01K7YC6W00H9QD57Y6AP1BZ96J.webp",
  "01K7YC2MCW9C45VP8Y3W9HYNPS.jpeg",
  "01K7YBNP4KG8WS1JM95YYMXPFA.webp",
  "01KGZRXFJS46FW9PX4PHNFNP91.jpeg",
  "01K7YBPEW9X40KT8HMH0YB5QPG.webp",
  "01K7YBR3561R9R4TQ47516XJ8W.webp",
  "01K7YBPYG17A9HRWJ4HTQK9AQX.webp",
  "01K7YBP61KWASJ5JFFHG1CFQ38.webp",
  "01K7YCAZXBCDMWZDDD483SKPA9.webp",
].map((f) => ({ url: `${BASE}/articles-assets/${f}`, out: `public/images/matteomeller/${f}` }));

const BELLA = [
  "01K6B9WCYC506PHVMFJ6G9W242.svg",
  "01KARZSJ90YMNFASSEBWM5ZJZF.webp",
  "01KAS06XPCAV8B0WPN15XC3Q30.webp",
  "01K6BQEK9NE02T38Y7G5109Q2B.webp",
  "01K6BQ3KXVYSFJPB453YM600C6.webp",
  "01K6BN66KDHKF2TZ4S47H8E7AQ.jpeg",
  "01K6BN6QPRG5VVYKNEPG74PC7M.jpeg",
  "01K6BN6XFTYB4W2X04MXHH568M.jpeg",
  "01K6BN7H3PVRZYY3EVH2V9MSR1.jpeg",
  "01K6BMZS0K57WWXK5GMBAG933J.webp",
  "01KAS14D002S83BWZ8REHX02QJ.webp",
  "01K6BN39CCN8Q597RFD9DMTE17.webp",
  "01K6BMZ0RZRJXJ52A2NR2BW0AW.webp",
  "01KAS152SBC3TXJ3JZXVBAQJFJ.webp",
].map((f) => ({ url: `${BASE}/articles-assets/${f}`, out: `public/images/bella/${f}` }));

const ALL = [...FONTS, ...SEO, ...HOME, ...MATTEOMELLER, ...BELLA];

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
