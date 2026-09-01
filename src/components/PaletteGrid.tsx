import type { Palette } from "../data/palettes";

type Props = {
  palettes: Palette[];
  onCopy: (hex: string) => void;
  /** Home shows three across so the row is complete; the full page keeps the designed two. */
  columns?: 2 | 3;
};

export function PaletteGrid({ palettes, onCopy, columns = 2 }: Props) {
  return (
    <div className={`palette-grid cols-${columns}`}>
      {palettes.map((palette) => (
        <div key={palette.name} className="palette-card reveal">
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
      ))}
    </div>
  );
}
