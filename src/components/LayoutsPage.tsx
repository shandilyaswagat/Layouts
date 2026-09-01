import { useMemo, useState } from "react";
import { LAYOUTS, type Layout } from "../data/layouts";
import { PALETTES } from "../data/palettes";
import { LayoutGrid } from "./LayoutGrid";
import { Link } from "./Link";
import { PaletteGrid } from "./PaletteGrid";

type Props = {
  onOpen: (layout: Layout) => void;
  onCopy: (hex: string) => void;
  navigate: (to: string) => void;
};

const FILTERS = ["All", "Power BI", "Tableau", "Excel", "Web / React"] as const;

export function LayoutsPage({ onOpen, onCopy, navigate }: Props) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");

  const shown = useMemo(
    () =>
      filter === "All"
        ? LAYOUTS
        : LAYOUTS.filter((l) => l.platforms.some((p) => filter.startsWith(p))),
    [filter],
  );

  return (
    <>
      <section className="shell page-head">
        <Link to="/" navigate={navigate} className="back-link">
          ← Home
        </Link>
        <h1>Layouts</h1>
        <p>
          Every grid in the library, with spacing and tile sizes worked out. Open one to
          preview it in any palette.
        </p>
        <div className="filters">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              className={`filter${f === filter ? " is-active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f === "All" ? `All ${LAYOUTS.length}` : f}
            </button>
          ))}
        </div>
      </section>

      <section id="layouts" className="shell page-grid">
        {shown.length ? (
          <LayoutGrid layouts={shown} onOpen={onOpen} />
        ) : (
          <p className="page-note">
            No layouts for {filter} yet. That adapter is still being drawn.
          </p>
        )}
        <p className="page-note">More layouts are being drawn. New sets land every week.</p>
      </section>

      <section id="palettes" className="shell section">
        <div className="reveal">
          <h2>Palettes with hex codes</h2>
          <p className="section-desc" style={{ maxWidth: 560 }}>
            Tested for charts: enough contrast between series, readable on light and dark
            backgrounds. Click any swatch to copy its hex.
          </p>
        </div>
        <PaletteGrid palettes={PALETTES} onCopy={onCopy} />
      </section>
    </>
  );
}
