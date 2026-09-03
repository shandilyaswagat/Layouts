import type { Layout } from "../data/layouts";
import { PALETTES } from "../data/palettes";
import { Link } from "./Link";
import { PreviewFrame } from "./PreviewFrame";

type Props = {
  layout: Layout;
  paletteIndex: number;
  onPalette: (i: number) => void;
  onCopy: (hex: string) => void;
  navigate: (to: string) => void;
};

/** The full page version of a layout preview. Mobile opens this instead of
 *  the modal, which had too little room to be worth reading. */
export function LayoutDetailPage({
  layout,
  paletteIndex,
  onPalette,
  onCopy,
  navigate,
}: Props) {
  const palette = PALETTES[paletteIndex];

  return (
    <section className="shell detail">
      <Link to="/layouts" navigate={navigate} className="back-link">
        ← Layouts
      </Link>

      <h1>{layout.name}</h1>
      <p className="detail-desc">{layout.desc}</p>
      <div className="chips mono detail-chips">
        {layout.platforms.map((p) => (
          <span key={p}>{p}</span>
        ))}
      </div>

      <div className="detail-preview">
        <PreviewFrame layout={layout} palette={palette} />
      </div>

      <h2 className="detail-h2">Palette</h2>
      <div className="detail-palettes">
        {PALETTES.map((p, i) => (
          <button
            key={p.name}
            type="button"
            className={`pal-chip${i === paletteIndex ? " is-active" : ""}`}
            onClick={() => onPalette(i)}
          >
            <em>
              {p.colors.slice(0, 4).map((c) => (
                <i key={c} style={{ background: c }} />
              ))}
            </em>
            {p.name}
          </button>
        ))}
      </div>

      <div className="palette-card detail-swatches">
        <div className="palette-head">
          <div className="palette-name">{palette.name}</div>
          <div className="palette-kind">6 colours · {palette.kind}</div>
        </div>
        <div className="swatches">
          {palette.colors.map((hex) => (
            <button
              key={hex}
              type="button"
              title={`Copy ${hex}`}
              aria-label={`Copy ${hex}`}
              style={{ background: hex }}
              onClick={() => onCopy(hex)}
            />
          ))}
        </div>
        <div className="hexes mono">
          {palette.colors.map((hex) => (
            <span key={hex}>{hex.replace("#", "")}</span>
          ))}
        </div>
      </div>

      <div className="hero-actions detail-actions">
        <Link to="/layouts" navigate={navigate} className="btn-solid">
          Back to all layouts
        </Link>
        <Link to="/ai-assist" navigate={navigate} className="btn-quiet">
          See AI assist
        </Link>
      </div>
    </section>
  );
}
