import { TransitionLink } from "./transition/TransitionLink";

// Offsets are percentages of the viewport width, measured on the original at
// 1024/1440/1920 — they were identical at all three, so the original positions
// this bar proportionally rather than at fixed pixel offsets.
const ITEM = "absolute top-1/2 -translate-y-1/2 font-bold text-[17px] whitespace-nowrap";

export function SiteHeader() {
  return (
    <header
      className="fixed top-0 left-0 w-full z-50 bg-background/23 backdrop-blur-[30px]"
      style={{ height: 35 }}
    >
      {/* 0.91% of a 375px screen is 3px, which reads as touching the edge. Below
          1024 it sits on the same 18px inset as the bio, CV and project content. */}
      <TransitionLink href="/" className={`${ITEM} left-[18px] lg:left-[0.91%]`}>
        Alessandro Zanatta
      </TransitionLink>
      {/* The original hides these three below 1024 and shows a "Graphic Designer"
          label instead — four items at these offsets collide well before 375px. */}
      <span className={`${ITEM} hidden lg:block`} style={{ left: "25.69%" }}>
        Graphic Design
      </span>
      <span className={`${ITEM} hidden lg:block`} style={{ left: "50.25%" }}>
        Portfolio
      </span>
      {/* Right-anchored: the original's right edge sits at 99% at every width. */}
      <a
        href="mailto:work@alessandrozanatta.it"
        className={`${ITEM} hidden lg:block`}
        style={{ right: "1%" }}
      >
        Say Hello!
      </a>
      <span className={`${ITEM} lg:hidden`} style={{ left: "59.5%" }}>
        Graphic Designer
      </span>
    </header>
  );
}
