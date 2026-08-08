import { BIO_PARAGRAPHS } from "./bioText";

/**
 * Below 1024 the original abandons the fixed, vertically-centred bio panel and
 * places the same text in the scroll flow, directly after the last poster — it
 * sits at top 2806 of its 375px canvas, which is where `PortfolioCanvas` ends
 * its mobile canvas so this follows on without a gap.
 *
 * 18px side margins are the original's mobile content inset, the same one its
 * project pages use.
 */
export function MobileBio() {
  return (
    <div
      className="flex flex-col gap-[22px] px-[18px] lg:hidden"
      style={{ fontSize: 16, lineHeight: "21px", letterSpacing: "0.2px", color: "#1b1b1b" }}
    >
      {BIO_PARAGRAPHS.map((p) => (
        <p key={p.slice(0, 12)}>{p}</p>
      ))}
    </div>
  );
}
