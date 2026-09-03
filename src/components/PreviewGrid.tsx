import { useEffect, useState } from "react";
import type { Tile } from "../data/layouts";
import type { Palette } from "../data/palettes";
import { useIsDark } from "../lib/theme";
import { PreviewTile } from "./PreviewTile";

/** The tiles on their own. Wrapped in chrome by PreviewFrame, used bare on
 *  layout cards so every dashboard on the site comes from one renderer. */
export function PreviewGrid({ tiles, palette }: { tiles: Tile[]; palette: Palette }) {
  const dark = useIsDark();

  // One selection for the whole page, which is how a page level slicer behaves.
  // It resets when the layout changes, or opening a second dashboard would
  // inherit the first one's filter.
  const [slice, setSlice] = useState(0);
  useEffect(() => setSlice(0), [tiles]);

  return (
    <div className="preview-canvas">
      <div className="preview-grid">
        {tiles.map((t, i) => (
          <PreviewTile
            key={i}
            tile={t}
            palette={palette}
            dark={dark}
            slice={slice}
            index={i}
            onSlice={setSlice}
          />
        ))}
      </div>
    </div>
  );
}
