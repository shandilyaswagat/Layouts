import { PLATFORMS } from "../data/platforms";

export function Tools() {
  return (
    <section id="about" className="shell tools">
      <p className="tools-label reveal">Built for the tools you already use</p>
      <div className="tools-row reveal">
        {PLATFORMS.map((p) => (
          <span key={p.id} className="tool-pill">
            {p.name}
          </span>
        ))}
        <span className="tool-pill soon">More coming soon</span>
      </div>
    </section>
  );
}
