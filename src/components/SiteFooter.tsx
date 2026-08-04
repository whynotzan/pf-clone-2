export function SiteFooter() {
  return (
    <footer
      className="fixed bottom-0 left-0 w-full z-50 flex items-center justify-between px-4 backdrop-blur-[30px]"
      style={{ height: 34 }}
    >
      <span className="font-bold text-[17px]">2026</span>
      <a
        href="https://www.linkedin.com/in/alessandro-zanatta-515478223/"
        target="_blank"
        rel="noreferrer"
        className="font-bold text-[17px]"
      >
        LinkedIn
      </a>
      <span className="font-bold text-[17px]">Download Area</span>
      <a href="mailto:work@alessandrozanatta.it" className="font-bold text-[17px]">
        work@alessandrozanatta.it
      </a>
    </footer>
  );
}
