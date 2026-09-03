import type { Layout } from "../data/layouts";
import type { Palette } from "../data/palettes";
import { PreviewGrid } from "./PreviewGrid";

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

/** The layout preview, framed like the dashboard on the home page. */
export function PreviewFrame({ layout, palette }: { layout: Layout; palette: Palette }) {
  return (
    <div className="pframe">
      <div className="pframe-bar">
        <i />
        <i />
        <i />
        <span className="pframe-path mono">
          {slug(layout.name)} / {slug(layout.platforms[0] ?? "web")}
        </span>
      </div>
      <div className="pframe-body">
        <PreviewGrid tiles={layout.tiles} palette={palette} />
      </div>
    </div>
  );
}
