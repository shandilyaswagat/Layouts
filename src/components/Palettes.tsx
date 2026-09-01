import { PALETTES } from "../data/palettes";
import { Link } from "./Link";
import { PaletteGrid } from "./PaletteGrid";

type Props = {
  onCopy: (hex: string) => void;
  navigate: (to: string) => void;
};

/** Home section. Three palettes, then out to the full page. */
export function Palettes({ onCopy, navigate }: Props) {
  return (
    <section id="palettes" className="shell section">
      <div className="section-head reveal">
        <div>
          <h2>Palettes with hex codes</h2>
          <p className="section-desc" style={{ maxWidth: 560 }}>
            Tested for charts: enough contrast between series, readable on light and dark
            backgrounds. Click any swatch to copy its hex.
          </p>
        </div>
        <Link to="/layouts#palettes" navigate={navigate} className="section-link">
          View all {PALETTES.length} palettes →
        </Link>
      </div>

      <PaletteGrid palettes={PALETTES.slice(0, 3)} onCopy={onCopy} columns={3} />
    </section>
  );
}
