import type { Tile } from "../data/layouts";

/** The miniature on a layout card. Deliberately abstract: block shapes only,
 *  so the card reads as a grid at a glance. Detail belongs in the expanded
 *  preview, not here. */
export function Thumb({ tiles }: { tiles: Tile[] }) {
  return (
    <div className="thumb-grid">
      {tiles.slice(0, 7).map((t, i) => (
        <i
          key={i}
          className={
            t.kind === "bar" || t.kind === "line" || t.kind === "donut" ? "hot" : undefined
          }
          style={{
            gridColumn: `span ${t.c}`,
            gridRow: t.r ? `span ${t.r}` : undefined,
          }}
        />
      ))}
    </div>
  );
}
