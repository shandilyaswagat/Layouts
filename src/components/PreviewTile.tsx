import type { Tile, TileKind } from "../data/layouts";

/**
 * Sizes are expressed against the width the preview has on desktop so the mock
 * keeps its proportions as the container narrows. Each dimension also carries a
 * floor: past a point, holding the exact ratio just produces tiles too small to
 * read, so below that the preview grows slightly taller instead. On desktop no
 * floor ever binds, so the composition there is untouched.
 */
const REF = 844;
const cq = (px: number) => `${((px / REF) * 100).toFixed(3)}cqw`;
const size = (px: number, floor: number) => `max(${floor}px, ${cq(px)})`;

/** Smallest height at which each kind of tile still reads. */
const FLOOR: Record<TileKind, number> = {
  title: 26,
  kpi: 54,
  bar: 100,
  line: 100,
  donut: 100,
  table: 116,
  row: 24,
  rail: 0,
};

type Props = {
  tile: Tile;
  colors: readonly string[];
};

export function PreviewTile({ tile, colors }: Props) {
  const tint = colors[tile.p] ?? colors[0];
  /* Middle of the ramp: dark anchor and pale tint both read badly as slices. */
  const segs = [colors[1], colors[2], colors[3]] as const;

  const style: React.CSSProperties = {
    gridColumn: `span ${tile.c}`,
    gridRow: tile.r ? `span ${tile.r}` : undefined,
    height:
      typeof tile.h === "number" ? size(tile.h, FLOOR[tile.kind] ?? 0) : tile.h,
  };

  return (
    <div className={`ptile ptile-${tile.kind}`} style={style}>
      {render(tile, tint, segs)}
    </div>
  );
}

function render(tile: Tile, tint: string, segs: readonly string[]) {
  switch (tile.kind) {
    case "title":
      return (
        <div className="pt-title">
          <span className="pt-chip" style={{ background: tint }} />
          <span style={{ fontSize: size(12, 10), fontWeight: 600 }}>{tile.label}</span>
          <span
            className="pt-muted pt-title-value"
            style={{ fontSize: size(10, 8.5), marginLeft: "auto" }}
          >
            {tile.value}
          </span>
        </div>
      );

    case "kpi":
      return (
        <div className="pt-kpi">
          <span className="pt-muted pt-kpi-label" style={{ fontSize: size(9.5, 8.5) }}>
            {tile.label}
          </span>
          <span
            className="pt-kpi-value"
            style={{ fontSize: size(15, 13), fontWeight: 600, letterSpacing: "-0.02em" }}
          >
            {tile.value}
          </span>
          <span className="pt-delta" style={{ fontSize: size(9, 8), color: tint }}>
            {tile.delta}
          </span>
        </div>
      );

    case "bar": {
      const series = tile.series ?? [];
      const max = Math.max(...series, 1);
      return (
        <>
          <span className="pt-label" style={{ fontSize: size(10, 9.5) }}>{tile.label}</span>
          <div className="pt-bars">
            {series.map((v, i) => (
              <span
                key={i}
                style={{
                  height: `${(v / max) * 100}%`,
                  background: tint,
                  opacity: i === series.length - 1 ? 1 : 0.32 + 0.5 * (v / max),
                }}
              />
            ))}
          </div>
        </>
      );
    }

    case "line": {
      const series = tile.series ?? [];
      const max = Math.max(...series, 1);
      const pts = series
        .map((v, i) => `${(i / (series.length - 1)) * 100},${40 - (v / max) * 34}`)
        .join(" ");
      return (
        <>
          <span className="pt-label" style={{ fontSize: size(10, 9.5) }}>{tile.label}</span>
          <svg className="pt-line" viewBox="0 0 100 40" preserveAspectRatio="none">
            <polyline
              points={pts}
              fill="none"
              stroke={tint}
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </>
      );
    }

    case "donut": {
      // A breakdown chart has more than one slice. Segments come from the
      // middle of the palette so the ring sits with the rest of the dashboard
      // rather than landing on whichever single colour the tile index picked.
      const share = Number.parseFloat(tile.value ?? "60") || 60;
      const rest = Math.max(0, 100 - share);
      const stops = [share, share + rest * 0.62, 100];
      const ring = `conic-gradient(${segs[0]} 0 ${stops[0]}%, ${segs[1]} ${stops[0]}% ${stops[1]}%, ${segs[2]} ${stops[1]}% 100%)`;
      return (
        <>
          <span className="pt-label" style={{ fontSize: size(10, 9.5) }}>{tile.label}</span>
          <div className="pt-donut-wrap">
            <div className="pt-donut" style={{ background: ring }}>
              <span style={{ fontSize: size(10, 8.5), fontWeight: 600 }}>{tile.value}</span>
            </div>
          </div>
        </>
      );
    }

    case "table":
      return (
        <>
          <span className="pt-label" style={{ fontSize: size(10, 9.5) }}>{tile.label}</span>
          <div className="pt-rows">
            {(tile.rows ?? []).map(([a, b, c], i) => (
              <div key={i} className="pt-row" style={{ fontSize: size(9.5, 8) }}>
                <span className="pt-dot" style={{ background: tint }} />
                <span className="pt-ellipsis">{a}</span>
                <span className="pt-muted" style={{ marginLeft: "auto" }}>{b}</span>
                <span className="pt-tag" style={{ color: tint }}>{c}</span>
              </div>
            ))}
          </div>
        </>
      );

    case "row": {
      const [a, b, c] = tile.rows?.[0] ?? ["", "", ""];
      return (
        <div className="pt-row pt-row-single" style={{ fontSize: size(10, 8.5) }}>
          <span className="pt-dot" style={{ background: tint }} />
          <span className="pt-ellipsis">{a}</span>
          <span style={{ marginLeft: "auto", fontWeight: 600 }}>{b}</span>
          <span className="pt-tag" style={{ color: tint }}>{c}</span>
        </div>
      );
    }

    case "rail":
      return (
        <div className="pt-rail">
          <span className="pt-muted" style={{ fontSize: size(9, 8) }}>{tile.label}</span>
          {[76, 92, 60, 84, 52].map((w, i) => (
            <span
              key={i}
              className="pt-railline"
              style={{ width: `${w}%`, background: i === 0 ? tint : undefined }}
            />
          ))}
        </div>
      );

    default:
      return null;
  }
}
