// Drives the Keystatic admin with a real browser to author a whole project.
//
// Uploads must go through the UI: Keystatic computes its own storage path from
// each field's key and position, so hand-written paths leave the admin showing
// empty image fields (AGENTS.md, CMS gotcha 1). Synthetic events don't reach its
// react-aria controls either (gotcha 6), hence a real browser.
//
// The admin nests dialogs: "Add" on Body blocks opens a block dialog, and its
// own "Add" opens a second dialog per asset / canvas item. Each commits with its
// own submit button, innermost first (gotcha 5).
//
// Playwright is not a dependency of this repo — install it only while importing:
//   npm i -D playwright && npx playwright install chromium
//   npm run dev -- --port 4590        (on a port you have confirmed free)
//   node scripts/import-author.mjs scripts/specs/<slug>.json
//   npm uninstall playwright
// BASE below must match the port the dev server is actually on.
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = "http://localhost:4590";
const ROOT = process.cwd();
const CDN = path.join(ROOT, "content/_input/_cdn");

const spec = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const headed = process.argv.includes("--headed");
const file = (name) => path.join(CDN, spec.slug, name);

const browser = await chromium.launch({ headless: !headed });
const page = await browser.newPage({ viewport: { width: 1600, height: 1200 } });
page.on("console", (m) => {
  if (m.type() === "error") console.log("   [console]", m.text().slice(0, 120));
});

/** The innermost open dialog — the one a nested Add just produced. */
const top = () => page.getByRole("dialog").last();

// Scoped to textboxes: a bare getByLabel also matches <select>s whose option
// text happens to contain the label (Kind's "Colour block" vs the Colour field).
async function setText(scope, label, value) {
  if (value === undefined || value === null) return;
  const box = scope.getByRole("textbox", { name: label, exact: false }).first();
  await box.waitFor({ state: "visible", timeout: 10000 });
  await box.fill(String(value));
}

// A video item shows two "Choose file" buttons — the image field's and the
// video field's, in schema order. Picking the first put mp4s on the image field,
// which Keystatic dropped silently, losing every video on the page.
async function pickFile(scope, label, filePath, which = 0) {
  const [chooser] = await Promise.all([
    page.waitForEvent("filechooser"),
    scope.getByRole("button", { name: label }).nth(which).click(),
  ]);
  await chooser.setFiles(filePath);
  await page.waitForTimeout(500);
}

/** Commits the innermost dialog and waits for it to go away. */
async function commit() {
  // Baseline taken while the dialog is open: nested dialogs mean the count
  // drops to the parent's level, not to zero.
  const before = await page.getByRole("dialog").count();
  await top().getByRole("button", { name: /^(Add|Done|Save)$/ }).last().click();
  try {
    await page.waitForFunction(
      (n) => document.querySelectorAll('[role="dialog"]').length < n,
      before,
      { timeout: 12000 }
    );
  } catch {
    const state = await page.evaluate(() => {
      const ds = [...document.querySelectorAll('[role="dialog"]')];
      const d = ds[ds.length - 1];
      return {
        count: ds.length,
        buttons: [...d.querySelectorAll("button")].map((b) => b.textContent.trim()),
        text: d.textContent.slice(0, 500),
      };
    });
    console.log("   !! dialog did not close:", JSON.stringify(state, null, 1).slice(0, 900));
    await page.screenshot({ path: "scratch-stuck.png" });
    throw new Error("commit failed");
  }
  await page.waitForTimeout(350);
}

async function addAsset(asset) {
  await top().getByRole("button", { name: "Add", exact: true }).first().click();
  await page.waitForTimeout(700);
  const d = top();
  if (asset.kind === "video") {
    await d.locator("select").first().selectOption({ label: "Video" });
    await page.waitForTimeout(300);
    await pickFile(d, "Choose file", file(asset.file), 1);
  } else {
    await pickFile(d, "Choose file", file(asset.file));
  }
  await commit();
}

const CANVAS_KIND_LABEL = {
  image: "Image / GIF",
  video: "Video",
  youtube: "YouTube embed",
  rectangle: "Colour block",
  text: "Text",
};

async function addCanvasItem(item) {
  await top().getByRole("button", { name: "Add", exact: true }).first().click();
  await page.waitForTimeout(700);
  const d = top();
  await d.locator("select").first().selectOption({ label: CANVAS_KIND_LABEL[item.kind] });
  await page.waitForTimeout(400);

  if (item.kind === "image" || item.kind === "video") {
    await pickFile(d, "Choose file", file(item.file), item.kind === "video" ? 1 : 0);
  }
  if (item.kind === "youtube") await setText(d, "YouTube URL", item.url);
  if (item.kind === "rectangle") await setText(d, "Colour", item.color);
  if (item.kind === "text") {
    await setText(d, "Text", item.text);
    await setText(d, "Font size", item.fontSize);
    if (item.fontWeight) {
      await d
        .locator("select")
        .last()
        .selectOption({ label: { 400: "Regular", 500: "Medium", 700: "Bold" }[item.fontWeight] });
    }
  }
  await setText(d, "Top (px)", item.top);
  await setText(d, "Left (px)", item.left);
  await setText(d, "Width (px)", item.width);
  if (item.height !== undefined) await setText(d, "Height (px)", item.height);
  if (item.rotate) await setText(d, "Rotation", item.rotate);
  if (item.blend && item.blend !== "normal") {
    // Selects here take their accessible name from their option text, so match
    // by position: [0] Kind, [1] Blend, [2] Font weight.
    await d.locator("select").nth(1).selectOption({
      label: { multiply: "Multiply (hide white)", darken: "Darken" }[item.blend],
    });
    await page.waitForTimeout(250);
  }
  await setText(d, "Layer", item.zIndex ?? 1);
  await commit();
}

async function addBlock(block) {
  await page.getByRole("button", { name: "Add", exact: true }).first().click();
  await page.waitForTimeout(900);
  const d = top();
  const label =
    block.type === "media"
      ? "Media row"
      : block.type === "canvas"
        ? "Canvas (free placement)"
        : "Text block";
  await d.locator("select").first().selectOption({ label });
  await page.waitForTimeout(500);

  if (block.type === "media") {
    await setText(d, "Columns", block.columns ?? 1);
    await setText(d, "Gap (px)", block.gap ?? 24);
    if (block.fullBleed) await d.getByLabel("Full width", { exact: false }).check();
    if (block.rowHeight) await setText(d, "Row height", block.rowHeight);
    if (block.columnWidths) await setText(d, "Column widths", block.columnWidths);
    if (block.align) {
      await d.locator("select").last().selectOption({
        label: block.align[0].toUpperCase() + block.align.slice(1),
      });
    }
    for (const a of block.assets) await addAsset(a);
  } else if (block.type === "canvas") {
    if (block.height) await setText(d, "Canvas height", block.height);
    for (const it of block.items) await addCanvasItem(it);
  } else {
    for (const p of block.paragraphs) {
      await top().getByRole("button", { name: "Add", exact: true }).first().click();
      await page.waitForTimeout(600);
      await setText(top(), "Paragraph", p);
      await commit();
    }
    if (block.ctaLabel) await setText(d, "CTA label", block.ctaLabel);
    if (block.ctaHref) await setText(d, "CTA link", block.ctaHref);
    if (block.fontSize) await setText(d, "Font size", block.fontSize);
  }

  await commit();
  console.log(`   + ${block.type} block`);
}

// ---------------------------------------------------------------- create pass
const onDisk = path.join(ROOT, "content/projects", spec.slug, "index.json");
console.log(`→ ${spec.slug}`);

await page.goto(`${BASE}/keystatic/collection/projects/create`, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);

await page.getByLabel("Project name").fill(spec.name);
await page.waitForTimeout(300);
await page.getByLabel("Slug", { exact: false }).fill(spec.slug);
await page.getByLabel("Client").fill(spec.client);
await page.getByLabel("Type").fill(spec.type);
await page.getByLabel("Year").fill(spec.year);
await page.getByLabel("First description").fill(spec.description);

await pickFile(page, "Choose file", file(spec.entry));
const [c2] = await Promise.all([
  page.waitForEvent("filechooser"),
  page.getByRole("button", { name: "Choose file" }).last().click(),
]);
await c2.setFiles(file(spec.exit));
await page.waitForTimeout(600);

for (const block of spec.body) await addBlock(block);

await page.getByRole("button", { name: "Create" }).click();
await page.waitForTimeout(4000);

if (fs.existsSync(onDisk)) {
  const json = JSON.parse(fs.readFileSync(onDisk, "utf8"));
  console.log(`   ✓ ${spec.slug}: ${json.body.length} body blocks`);
  console.log("     entry:", json.entryImage, " exit:", json.exitImage);
  for (const b of json.body) {
    const n =
      b.discriminant === "media"
        ? b.value.assets.length
        : b.discriminant === "canvas"
          ? b.value.items.length
          : b.value.paragraphs.length;
    console.log(`     - ${b.discriminant} (${n})`);
  }
} else {
  console.log("   ✗ nothing on disk");
  await page.screenshot({ path: `scratch-fail-${spec.slug}.png`, fullPage: true });
}

await browser.close();
