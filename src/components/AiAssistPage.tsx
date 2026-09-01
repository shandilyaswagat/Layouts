import { Link } from "./Link";

export function AiAssistPage({ navigate }: { navigate: (to: string) => void }) {
  return (
    <section className="shell page-soon">
      <Link to="/" navigate={navigate} className="back-link">
        ← Home
      </Link>
      <div className="ai-tag" style={{ marginTop: 20 }}>COMING SOON</div>
      <h1>AI assist</h1>
      <p>
        Describe what you are measuring and who reads it, and the assistant picks a
        layout, suggests a palette and explains which chart belongs in each slot. It is
        being built now. Early access opens this autumn.
      </p>

      <ul className="soon-list">
        <li><i />Layout picked from your metric count and audience</li>
        <li><i />Palette matched to your brand colour</li>
        <li><i />Chart-type guidance per tile, with the reasoning</li>
        <li><i />Output in the tool you are building in, not a generic mock</li>
      </ul>

      <div className="hero-actions" style={{ marginTop: 34 }}>
        <Link to="/layouts" navigate={navigate} className="btn-solid">
          Browse the library
        </Link>
        <Link to="/" navigate={navigate} className="btn-quiet">
          Back home
        </Link>
      </div>
    </section>
  );
}
