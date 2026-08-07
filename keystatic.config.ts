import { config, fields, collection } from "@keystatic/core";

function assetFilename(value: { filename: string } | string | null): string | null {
  if (!value) return null;
  return typeof value === "string" ? value : value.filename;
}

/**
 * Per-piece type controls. Every paragraph and the CTA carry their own size and
 * weight, so a block can mix them - e.g. the original's body copy at 400 next to
 * a heavier 500 link. Factories, not shared instances, so each schema slot owns
 * its own field. No `isRequired` on the integer - see the note on `columns`.
 */
const fontSizeField = () =>
  fields.integer({
    label: "Font size (px)",
    defaultValue: 22,
    validation: { min: 10, max: 72 },
  });

const fontWeightField = () =>
  fields.select({
    label: "Font weight",
    description: "Limited to the weights the site's font actually loads.",
    options: [
      { label: "Regular", value: "400" },
      { label: "Medium", value: "500" },
      { label: "Bold", value: "700" },
    ],
    defaultValue: "400",
  });

export default config({
  storage: { kind: "local" },
  collections: {
    projects: collection({
      label: "Projects",
      slugField: "name",
      path: "content/projects/*/",
      format: { data: "json" },
      schema: {
        name: fields.slug({ name: { label: "Project name" } }),
        client: fields.text({ label: "Client" }),
        type: fields.text({ label: "Type" }),
        year: fields.text({ label: "Year" }),
        firstDescription: fields.text({
          label: "First description",
          multiline: true,
        }),
        entryImage: fields.image({
          label: "Entry image",
          description: "Full-bleed hero image, runs under the header.",
          directory: "public/images/projects",
          publicPath: "/images/projects/",
        }),
        body: fields.array(
          fields.conditional(
            fields.select({
              label: "Block type",
              options: [
                { label: "Media row", value: "media" },
                { label: "Text block", value: "text" },
              ],
              defaultValue: "media",
            }),
            {
              media: fields.object({
                // No `isRequired` on these: Keystatic's integer field never populates its
                // validated state from a saved value, so requiring it blocks Save forever on
                // any existing entry. Defaults are applied in src/lib/projects.ts instead.
                columns: fields.integer({
                  label: "Columns",
                  description:
                    "How many images/videos sit side by side in this row (1-4). Use 1 for a single full-row image.",
                  defaultValue: 1,
                  validation: { min: 1, max: 4 },
                }),
                gap: fields.integer({
                  label: "Gap (px)",
                  description: "Spacing between images in this row.",
                  defaultValue: 24,
                  validation: { min: 0, max: 200 },
                }),
                rowHeight: fields.integer({
                  label: "Row height (px)",
                  description:
                    "Crop this row to a fixed height, like the original does (e.g. 1036, 705, 829). Measured on the 1492px design canvas and scaled to the viewport. Leave empty to let the images keep their own proportions.",
                  validation: { min: 0, max: 4000 },
                }),
                columnWidths: fields.text({
                  label: "Column widths (px)",
                  description:
                    "Optional. Space-separated widths on the 1492px canvas for uneven splits, e.g. \"735 490\". One number makes a partial-width row. Leave empty for equal columns filling the row.",
                  defaultValue: "",
                }),
                align: fields.select({
                  label: "Row alignment",
                  description: "Where the row sits when the column widths don't fill the available space.",
                  options: [
                    { label: "Left", value: "left" },
                    { label: "Center", value: "center" },
                    { label: "Right", value: "right" },
                  ],
                  defaultValue: "center",
                }),
                fullBleed: fields.checkbox({
                  label: "Full width",
                  description:
                    "Ignore the 85% content cap and span edge-to-edge, like the entry/exit images.",
                  defaultValue: false,
                }),
                assets: fields.array(
                  fields.object({
                    kind: fields.select({
                      label: "Kind",
                      options: [
                        { label: "Image / GIF", value: "image" },
                        { label: "Video", value: "video" },
                      ],
                      defaultValue: "image",
                    }),
                    image: fields.image({
                      label: "Image file",
                      directory: "public/images/projects",
                      publicPath: "/images/projects/",
                    }),
                    video: fields.file({
                      label: "Video file (mp4)",
                      directory: "public/videos/projects",
                      publicPath: "/videos/projects/",
                    }),
                  }),
                  {
                    label: "Assets",
                    itemLabel: (props) => {
                      const kind = props.fields.kind.value;
                      const name =
                        kind === "video"
                          ? assetFilename(props.fields.video.value)
                          : assetFilename(props.fields.image.value);
                      const icon = kind === "video" ? "🎬" : "🖼️";
                      return `${icon} ${name ?? "(no file yet)"}`;
                    },
                  }
                ),
              }),
              text: fields.object({
                paragraphs: fields.array(
                  fields.object({
                    text: fields.text({ label: "Paragraph", multiline: true }),
                    fontSize: fontSizeField(),
                    fontWeight: fontWeightField(),
                  }),
                  {
                    label: "Paragraphs",
                    itemLabel: (props) => props.fields.text.value || "Paragraph",
                  }
                ),
                ctaLabel: fields.text({ label: "CTA label", defaultValue: "" }),
                ctaHref: fields.text({ label: "CTA link", defaultValue: "" }),
                ctaFontSize: fontSizeField(),
                ctaFontWeight: fontWeightField(),
                textAlign: fields.select({
                  label: "Text align",
                  description:
                    "Alignment applies to the whole block. Size and weight are set per paragraph and on the CTA separately.",
                  options: [
                    { label: "Left", value: "left" },
                    { label: "Center", value: "center" },
                    { label: "Right", value: "right" },
                  ],
                  defaultValue: "left",
                }),
              }),
            }
          ),
          {
            label: "Body blocks",
            itemLabel: (props) => {
              if (props.discriminant === "text") {
                const first = props.value.fields.paragraphs.elements[0]?.fields.text.value ?? "";
                const cta = props.value.fields.ctaLabel.value;
                return `📝 Text — ${first || cta || "(empty)"}`;
              }
              const media = props.value.fields;
              const columns = media.columns.value;
              const fullBleed = media.fullBleed.value;
              const height = media.rowHeight.value;
              const names = media.assets.elements
                .map((el) => {
                  const kind = el.fields.kind.value;
                  const name =
                    kind === "video"
                      ? assetFilename(el.fields.video.value)
                      : assetFilename(el.fields.image.value);
                  return name ?? "empty";
                })
                .join(", ");
              return `🖼️ ${columns}-col${fullBleed ? " · full-width" : ""}${height ? ` · ${height}px` : ""} — ${names}`;
            },
          }
        ),
        exitImage: fields.image({
          label: "Exit image",
          description: "Full-bleed closing image, runs under the footer.",
          directory: "public/images/projects",
          publicPath: "/images/projects/",
        }),
      },
    }),
  },
});
