const PARAGRAPHS = [
  "Hello! I'm Alessandro Zanatta, a graphic designer from Treviso, Italy.",
  "I work in graphic design, specialising in visual and brand identity. Over the years, I have developed the skills necessary to juggle different aspects of design, from motion to screen printing. I have worked with various types of companies, from SMEs to public limited companies, learning to adapt my design method to different needs and objectives each time.",
  "My approach to design is centred on the concept of “good design”: functional, thoughtful, simple and ethical. I believe that design should solve concrete problems and improve the user experience, always prioritising sustainability and integrity.",
  "I believe that the interaction between technology, nature and art is the driving force behind creativity and inspiration. Every project is an opportunity to explore how these three elements can coexist and reinforce each other, giving rise to unique and meaningful results.",
];

export function BioPanel() {
  return (
    // The wrapper spans the whole viewport to centre the column vertically, so
    // it would otherwise swallow every click meant for the canvas behind it —
    // no poster was reachable at any desktop width. Only the text itself takes
    // pointer events, which keeps it selectable.
    <div className="pointer-events-none fixed top-0 left-0 z-40 hidden h-screen w-full lg:flex lg:items-center">
      <div
        className="pointer-events-auto flex flex-col gap-[22px]"
        style={{
          marginLeft: 16,
          // 343/22px measured on the original; the previous 355/16px changed
          // where every paragraph wrapped.
          width: 343,
          fontSize: 16,
          lineHeight: "21px",
          letterSpacing: "0.2px",
          color: "#1b1b1b",
        }}
      >
        {PARAGRAPHS.map((p) => (
          <p key={p.slice(0, 12)}>{p}</p>
        ))}
      </div>
    </div>
  );
}
