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
      <a
        href="https://www.dropbox.com/scl/fo/8gxt6zdavvwwu0rs1aaq9/AKNits2QF9aPRZtoL5YI5zw?rlkey=1wgmz5k9817xc17a94qnbshny&st=0y19lh35&dl=0"
        target="_blank"
        rel="noreferrer"
      >
        Download Area
      </a>
    </div>
  );
}
