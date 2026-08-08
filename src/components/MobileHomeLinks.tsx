/**
 * The homepage's footer links, in the scroll flow under the CV instead of in the
 * sticky bottom bar, which is hidden below 1024 (`SiteBottomBar`). Plain stacked
 * alignment on the same 18px inset as the rest of the mobile content — styling
 * is deliberately left for later.
 */
export function MobileHomeLinks() {
  return (
    <div
      className="flex flex-col gap-2 px-[18px] pt-10 pb-12 lg:hidden"
      style={{ fontSize: 17, fontWeight: 700, color: "#1b1b1b" }}
    >
      <a href="mailto:work@alessandrozanatta.it">work@alessandrozanatta.it</a>
      <a
        href="https://www.linkedin.com/in/alessandro-zanatta-515478223/"
        target="_blank"
        rel="noreferrer"
      >
        LinkedIn
      </a>
      <span>Download Area</span>
    </div>
  );
}
