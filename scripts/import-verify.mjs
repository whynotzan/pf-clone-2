import { chromium } from "playwright";
import fs from "node:fs";

const BASE = "http://localhost:4590";
const slug = process.argv[2];
const spec = JSON.parse(fs.readFileSync(`scripts/specs/${slug}.json`, "utf8"));
const authored = spec.body[0].items;

const browser = await chromium.launch();

// Desktop at exactly the design width, so canvas px map 1:1 to screen px.
const page = await browser.newPage({ viewport: { width: 1492, height: 1000 } });
await page.goto(`${BASE}/${slug}`, { waitUntil: "networkidle" });
await page.waitForTimeout(1200);

const domCount = await page.locator(".project-canvas-item").count();
console.log(`DOM canvas items: ${domCount} (authored ${authored.length})`);

const canvasBox = await page.locator(".project-canvas").first().boundingBox();
const boxes = await page.locator(".project-canvas-item").evaluateAll((els) =>
  els.map((el) => {
    const r = el.getBoundingClientRect();
    return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
  })
);

let worst = 0;
authored.forEach((a, i) => {
  const b = boxes[i];
  if (!b) return;
  const dx = Math.abs(b.x - a.left);
  const dy = Math.abs(b.y - (canvasBox.y + a.top));
  const dw = Math.abs(b.w - a.width);
  worst = Math.max(worst, dx, dy, dw);
  const flag = dx > 2 || dy > 2 || dw > 2 ? "  <-- OFF" : "";
  console.log(
    `  ${String(i).padStart(2)} ${a.kind.padEnd(9)} authored ${a.left},${a.top} ${a.width}x${a.height ?? "-"}` +
      `  rendered ${b.x},${Math.round(b.y - canvasBox.y)} ${b.w}x${b.h}${flag}`
  );
});
console.log(`worst delta: ${worst}px`);

// No horizontal overflow at phone width.
const mobile = await browser.newPage({ viewport: { width: 375, height: 800 } });
await mobile.goto(`${BASE}/${slug}`, { waitUntil: "networkidle" });
await mobile.waitForTimeout(1000);
const overflow = await mobile.evaluate(
  () => document.documentElement.scrollWidth - document.documentElement.clientWidth
);
const stacked = await mobile.locator(".project-canvas-item").evaluateAll((els) =>
  els.map((el) => Math.round(el.getBoundingClientRect().width))
);
console.log(`mobile: overflow ${overflow}px, item widths ${[...new Set(stacked)].join(",")}`);

await browser.close();
