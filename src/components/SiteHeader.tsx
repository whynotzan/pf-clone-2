export function SiteHeader() {
  return (
    <header
      className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 backdrop-blur-[30px]"
      style={{ height: 34 }}
    >
      <span className="font-bold text-[17px]">Alessandro Zanatta</span>
      <span className="font-bold text-[17px]">Graphic Design</span>
      <span className="font-bold text-[17px]">Portfolio</span>
      <a href="mailto:work@alessandrozanatta.it" className="font-bold text-[17px]">
        Say Hello!
      </a>
    </header>
  );
}
