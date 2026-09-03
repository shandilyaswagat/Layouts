import { useEffect } from "react";
import type { Layout } from "../data/layouts";
import { PALETTES } from "../data/palettes";
import { PreviewFrame } from "./PreviewFrame";

type Props = {
  layout: Layout;
  paletteIndex: number;
  onPalette: (i: number) => void;
  onClose: () => void;
  onCopy: (hex: string) => void;
};

export function LayoutModal({ layout, paletteIndex, onPalette, onClose, onCopy }: Props) {
  const palette = PALETTES[paletteIndex];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="modal-scrim" onClick={onClose} role="presentation">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={layout.name}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-head">
          <div>
            <h3>{layout.name}</h3>
            <p>{layout.desc}</p>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="modal-preview-wrap">
          <PreviewFrame layout={layout} palette={palette} />
        </div>

        <div className="modal-foot">
          <div className="pal-chips">
            <span>Palette</span>
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
          <div className="hex-row">
            {palette.colors.map((c) => (
              <button
                key={c}
                type="button"
                title={`Copy ${c}`}
                aria-label={`Copy ${c}`}
                style={{ background: c }}
                onClick={() => onCopy(c)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
