import { config, fields, collection } from "@keystatic/core";

function assetFilename(value: { filename: string } | string | null): string | null {
  if (!value) return null;
  return typeof value === "string" ? value : value.filename;
}

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
                columns: fields.integer({
                  label: "Columns",
                  description:
                    "How many images/videos sit side by side in this row (1-4). Use 1 for a single full-row image.",
                  defaultValue: 1,
                  validation: { isRequired: true, min: 1, max: 4 },
                }),
                gap: fields.integer({
                  label: "Gap (px)",
                  description: "Spacing between images in this row.",
                  defaultValue: 24,
                  validation: { isRequired: true, min: 0, max: 200 },
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
                  fields.text({ label: "Paragraph", multiline: true }),
                  {
                    label: "Paragraphs",
                    itemLabel: (props) => props.value || "Paragraph",
                  }
                ),
                ctaLabel: fields.text({ label: "CTA label", defaultValue: "" }),
                ctaHref: fields.text({ label: "CTA link", defaultValue: "" }),
              }),
            }
          ),
          {
            label: "Body blocks",
            itemLabel: (props) => {
              if (props.discriminant === "text") {
                const first = props.value.fields.paragraphs.elements[0]?.value ?? "";
                const cta = props.value.fields.ctaLabel.value;
                return `📝 Text — ${first || cta || "(empty)"}`;
              }
              const media = props.value.fields;
              const columns = media.columns.value;
              const fullBleed = media.fullBleed.value;
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
              return `🖼️ ${columns}-col${fullBleed ? " · full-width" : ""} — ${names}`;
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
