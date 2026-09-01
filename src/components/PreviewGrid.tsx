import type { Tile } from "../data/layouts";
import { PreviewTile } from "./PreviewTile";

/** The tiles on their own. Wrapped in chrome by PreviewFrame, used bare on
 *  layout cards so every dashboard on the site comes from one renderer. */
export function PreviewGrid({
  tiles,
  colors,
}: {
  tiles: Tile[];
  colors: readonly string[];
}) {
  return (
    <div className="preview-canvas">
      <div className="preview-grid">
        {tiles.map((t, i) => (
          <PreviewTile key={i} tile={t} colors={colors} />
        ))}
      </div>
    </div>
  );
}
