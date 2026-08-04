import { config, fields, collection } from "@keystatic/core";

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
                layout: fields.select({
                  label: "Layout",
                  options: [
                    { label: "Full width", value: "full" },
                    { label: "Wide (centered)", value: "wide" },
                    { label: "Pair (side by side)", value: "pair" },
                  ],
                  defaultValue: "wide",
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
                    itemLabel: (props) => props.fields.kind.value,
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
            itemLabel: (props) => props.discriminant,
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
