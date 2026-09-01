import type { Layout } from "../data/layouts";
import { Thumb } from "./Thumb";

type Props = {
  layouts: Layout[];
  onOpen: (layout: Layout) => void;
  className?: string;
};

export function LayoutGrid({ layouts, onOpen, className = "" }: Props) {
  return (
    <div className={`card-grid ${className}`}>
      {layouts.map((layout) => (
        <button
          key={layout.id}
          type="button"
          className="layout-card reveal"
          onClick={() => onOpen(layout)}
        >
          <span className="layout-thumb">
            <Thumb tiles={layout.tiles} />
          </span>
          <span className="layout-meta">
            <span className="layout-name">{layout.name}</span>
            <span className="layout-desc">{layout.desc}</span>
            <span className="chips mono">
              {layout.platforms.map((p) => (
                <span key={p}>{p}</span>
              ))}
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}
