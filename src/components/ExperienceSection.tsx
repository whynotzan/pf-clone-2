import type { CvSection } from "@/types/portfolio";

const CV: CvSection[] = [
  {
    heading: "Experience",
    entries: [
      { title: "MOMO Creative Studio (TV)", subtitle: "Graphic Designer", period: "2025 -" },
      { title: "Mindd (TV)", subtitle: "Graphic Designer", period: "2023 - 2024" },
      { title: "Cardillo Design (PD)", subtitle: "Junior Graphic Designer", period: "2021 - 2022" },
    ],
  },
  {
    heading: "Education",
    entries: [
      { title: "Cognitive Sciences", subtitle: "Università Studi di Padova", period: "2017 - 2020" },
      { title: "Graphic Design", subtitle: "Veneto Formazione", period: "2021 - 2022" },
    ],
  },
];

/**
 * The CV panel keeps its compact height and opaque background (so it still
 * covers canvas images scrolling behind it) but sticks at the vertical centre
 * of the viewport rather than above the footer, which centres the CV on screen.
 *
 * The sticky offset is half the 340px panel height back from mid-viewport, so
 * the panel's centre — and the content centred within it — lands on 50vh.
 * These class names are spelled out rather than built from a constant because
 * Tailwind only generates classes it can find as literal strings.
 */
export function ExperienceSection() {
  return (
    <div
      className="sticky bottom-[35px] z-30 w-full bg-background sm:bottom-[calc(50vh-170px)] sm:h-[340px]"
      style={{ minHeight: 340 }}
    >
      <div className="relative mx-auto w-full max-w-[1440px] px-4 py-10 sm:h-full sm:px-0">
        {/* Columns land on the original's 730px / 1090px (of 1440) with 220px-wide entries. */}
        <div className="flex gap-16 sm:absolute sm:left-[50.69%] sm:top-1/2 sm:-translate-y-1/2 sm:gap-[140px]">
          {CV.map((section) => (
            <div key={section.heading} style={{ width: 220 }}>
              <h3 style={{ fontSize: 17, fontWeight: 400, marginBottom: 24, color: "#1b1b1b" }}>
                {section.heading}
              </h3>
              <div className="flex flex-col gap-6">
                {section.entries.map((entry) => (
                  <div key={entry.title} style={{ fontSize: 17, fontWeight: 400, lineHeight: "22px", color: "#1b1b1b" }}>
                    <div>{entry.title}</div>
                    <div>{entry.subtitle}</div>
                    <div>{entry.period}</div>
                  </div>
                ))}
              </div>
              {section.heading === "Education" && (
                <a
                  href="https://www.dropbox.com/scl/fi/crq3uste4nb7yyx3e6i8j/Zanatta-Alessandro-CV.pdf"
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: 17, fontWeight: 500, display: "block", marginTop: 24, color: "#1b1b1b" }}
                >
                  Download full CV here!
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
