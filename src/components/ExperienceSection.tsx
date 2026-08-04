import type { CvSection } from "@/types/portfolio";

const CV: CvSection[] = [
  {
    heading: "Experience",
    entries: [
      { title: "MOMO Creative Studio (TV)", subtitle: "Graphic Designer", period: "2025 –" },
      { title: "Mindd (TV)", subtitle: "Graphic Designer", period: "2023 – 2024" },
      { title: "Cardillo Design (PD)", subtitle: "Junior Graphic Designer", period: "2021 – 2022" },
    ],
  },
  {
    heading: "Education",
    entries: [
      { title: "Cognitive Sciences", subtitle: "Università Studi di Padova", period: "2017 – 2020" },
      { title: "Graphic Design", subtitle: "Veneto Formazione", period: "2021 – 2022" },
    ],
  },
];

/**
 * The CV panel sticks to the bottom of the viewport (like the original site's
 * fixed Experience/Education block) while its own opaque background slides up
 * over the tail end of the portfolio canvas images scrolling behind it.
 */
export function ExperienceSection() {
  return (
    <div className="sticky bottom-[34px] z-30 w-full bg-background" style={{ minHeight: 340 }}>
      <div className="relative mx-auto w-full max-w-[1440px] px-4 py-10 sm:px-0">
        <div className="flex gap-16 sm:absolute sm:left-[52%] sm:top-10 sm:gap-[130px]">
          {CV.map((section) => (
            <div key={section.heading} style={{ width: 228 }}>
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
