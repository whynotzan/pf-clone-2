import type { ProjectMeta } from "@/types/project";

const LABEL_STYLE = { fontSize: 16, fontWeight: 500, lineHeight: "22px", color: "#1b1b1b" } as const;
const VALUE_STYLE = { fontSize: 16, fontWeight: 500, lineHeight: "22px", color: "#1b1b1b" } as const;

/** Client name / Type / Year, plus the first descriptive paragraph, laid out right after the Entry Image. */
export function ProjectInfo({ meta, firstDescription }: { meta: ProjectMeta; firstDescription: string }) {
  return (
    // The 251/369/724 offsets below only exist in the original's desktop layout,
    // so they start at 1024 with it — `sm` handed them to tablets 384px early.
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-[18px] pt-16 pb-8 lg:flex-row lg:gap-0 lg:px-0 lg:pt-12">
      {/* Offsets are the original's, measured against its 1440px text grid: labels
          at 251px, values at 369px, description at 724px. Fixing the label column
          and the group width keeps those three columns from drifting with copy. */}
      <div className="flex gap-4 lg:ml-[251px] lg:w-[473px] lg:gap-0">
        <div className="flex flex-col gap-0 lg:w-[118px]" style={LABEL_STYLE}>
          <span>Client</span>
          <span>Type</span>
          <span>Year</span>
        </div>
        <div className="flex flex-col gap-0" style={VALUE_STYLE}>
          <span>{meta.client}</span>
          <span>{meta.type}</span>
          <span>{meta.year}</span>
        </div>
      </div>
      <p
        style={{ fontSize: 17, fontWeight: 400, lineHeight: "22px", color: "#1b1b1b", maxWidth: 532 }}
      >
        {firstDescription}
      </p>
    </div>
  );
}
