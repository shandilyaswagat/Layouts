import { useCallback, useState } from "react";
import type { Tile, TileKind } from "../data/layouts";
import type { Palette } from "../data/palettes";
import { marksFor, tileColor } from "../lib/chartColors";
import {
  sliceCells,
  sliceItems,
  sliceParts,
  slicePoints,
  sliceSeries,
  sliceValue,
} from "../lib/slice";

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
  spark: 78,
  status: 68,
  bar: 100,
  hbar: 100,
  stacked: 100,
  combo: 100,
  line: 100,
  mline: 100,
  area: 100,
  donut: 100,
  gauge: 100,
  treemap: 100,
  scatter: 110,
  map: 110,
  matrix: 110,
  waterfall: 100,
  table: 116,
  row: 34,
  slicer: 34,
  daterange: 34,
  rail: 0,
};

/**
 * Status colours are reserved: good, warning and bad are states, never series,
 * so they never come from the palette. They are tokens rather than literals
 * here so the dark ground can restate them, the same as every other colour on
 * the site.
 */
const TONE = {
  good: "var(--ok)",
  warn: "var(--warn)",
  bad: "var(--bad)",
} as const;

const round = (n: number) => Math.round(n).toLocaleString("en-US");

type Hover = { x: number; y: number; text: string } | null;

type Props = {
  tile: Tile;
  palette: Palette;
  dark: boolean;
  /** Which slicer option is active for the whole preview. 0 is "All". */
  slice: number;
  /** Position of this tile, so its generated numbers differ from its neighbours. */
  index: number;
  onSlice?: (i: number) => void;
};

export function PreviewTile({ tile, palette, dark, slice, index, onSlice }: Props) {
  const tint = tileColor(palette, dark, tile.p);
  const [hover, setHover] = useState<Hover>(null);

  // A tooltip is what turns a picture of a chart into something you can read a
  // value off. It follows the pointer inside the tile and never leaves it.
  const track = useCallback(
    (text: string) => ({
      onMouseEnter: (e: React.MouseEvent) => show(e, text),
      onMouseMove: (e: React.MouseEvent) => show(e, text),
      onMouseLeave: () => setHover(null),
    }),
    [],
  );

  function show(e: React.MouseEvent, text: string) {
    const box = (e.currentTarget as HTMLElement).closest(".ptile")?.getBoundingClientRect();
    if (!box) return;
    setHover({ x: e.clientX - box.left, y: e.clientY - box.top, text });
  }

  const style: React.CSSProperties = {
    gridColumn: `span ${tile.c}`,
    gridRow: tile.r ? `span ${tile.r}` : undefined,
    height:
      typeof tile.h === "number" ? size(tile.h, FLOOR[tile.kind] ?? 0) : tile.h,
  };

  return (
    <div className={`ptile ptile-${tile.kind} ptile-c${tile.c}`} style={style}>
      {render({ tile, tint, palette, dark, slice, index, onSlice, track })}
      {hover ? (
        <span
          className="pt-tip"
          style={{
            left: hover.x,
            top: hover.y,
            // Flip to the other side near the right edge so it never spills.
            transform: hover.x > 130 ? "translate(-100%, -145%)" : "translate(8px, -145%)",
          }}
        >
          {hover.text}
        </span>
      ) : null}
    </div>
  );
}

const Label = ({ text }: { text?: string }) =>
  text ? (
    <span className="pt-label" style={{ fontSize: size(10, 9.5) }}>
      {text}
    </span>
  ) : null;

/** A polyline through a series, in a 0 to 100 by 0 to 40 box. */
function path(series: number[], max: number) {
  return series
    .map((v, i) => `${(i / Math.max(1, series.length - 1)) * 100},${40 - (v / max) * 34}`)
    .join(" ");
}

/**
 * A sparkline is read for its shape, not its level, and it is too short to
 * spare any height. So it fills the box between the series' own low and high
 * instead of anchoring at zero, which is the one place that trade is right.
 */
function sparkPath(series: number[]) {
  const lo = Math.min(...series);
  const hi = Math.max(...series);
  const span = hi - lo || 1;
  return series
    .map((v, i) => `${(i / Math.max(1, series.length - 1)) * 100},${37 - ((v - lo) / span) * 34}`)
    .join(" ");
}

type Track = (text: string) => {
  onMouseEnter: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseLeave: () => void;
};

type Ctx = {
  tile: Tile;
  tint: string;
  palette: Palette;
  dark: boolean;
  slice: number;
  index: number;
  onSlice?: (i: number) => void;
  track: Track;
};

function render({ tile, tint, palette, dark, slice, index, onSlice, track }: Ctx) {
  const marks = (n: number, enc: "single" | "category" | "ramp" = "category") =>
    marksFor(palette, dark, enc, n);

  const series = sliceSeries(tile.series ?? [], slice, index);
  const value = sliceValue(tile.value, slice, index);
  const unit = tile.unit ?? "";
  const legend = tile.legend ?? [];
  const heads = tile.colHeads ?? [];

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
            {value}
          </span>
          <span className="pt-delta" style={{ fontSize: size(9, 8), color: tint }}>
            {tile.delta}
          </span>
        </div>
      );

    // A card with its own trend inside it, which is how a Power BI card visual
    // is built now. The sparkline carries the shape, the number carries the
    // level, and the card stays one tile instead of two.
    case "spark":
      return (
        <div className="pt-kpi pt-spark">
          <span className="pt-muted pt-kpi-label" style={{ fontSize: size(9.5, 8.5) }}>
            {tile.label}
          </span>
          <div className="pt-spark-row">
            <span
              className="pt-kpi-value"
              style={{ fontSize: size(15, 13), fontWeight: 600, letterSpacing: "-0.02em" }}
            >
              {value}
            </span>
            <svg className="pt-sparkline" viewBox="0 0 100 40" preserveAspectRatio="none">
              <polyline
                points={sparkPath(series)}
                fill="none"
                stroke={tint}
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
          <span className="pt-delta" style={{ fontSize: size(9, 8), color: tint }}>
            {tile.delta}
          </span>
        </div>
      );

    // The KPI indicator from the Customer Profitability sample: a number that
    // is judged, not just reported. Colour plus a word, never colour alone.
    case "status": {
      const tone = TONE[tile.tone ?? "good"];
      return (
        <div className="pt-kpi pt-status">
          <span className="pt-muted pt-kpi-label" style={{ fontSize: size(9.5, 8.5) }}>
            {tile.label}
          </span>
          <span
            className="pt-kpi-value"
            style={{ fontSize: size(15, 13), fontWeight: 600, letterSpacing: "-0.02em" }}
          >
            {value}
          </span>
          <span className="pt-status-row" style={{ fontSize: size(9, 8), color: tone }}>
            <i style={{ background: tone }} />
            {tile.delta}
          </span>
        </div>
      );
    }

    case "bar": {
      const max = Math.max(...series, 1);
      const fill = marks(series.length, tile.enc ?? "single");
      return (
        <>
          <Label text={tile.label} />
          <div className="pt-bars">
            {series.map((v, i) => (
              <span
                key={i}
                className="pt-hit"
                style={{ height: `${(v / max) * 100}%`, background: fill[i] }}
                {...track(`${heads[i] ? `${heads[i]}: ` : ""}${round(v)}${unit}`)}
              />
            ))}
          </div>
        </>
      );
    }

    // Ranked bars read left to right, which is how anyone reads a league table.
    case "hbar": {
      const items = sliceItems(tile.items ?? [], slice, index);
      const max = Math.max(...items.map(([, v]) => v), 1);
      const fill = marks(items.length, tile.enc ?? "ramp");
      return (
        <>
          <Label text={tile.label} />
          <div className="pt-hbars">
            {items.map(([name, v], i) => (
              <div key={name} className="pt-hbar" style={{ fontSize: size(9, 8) }}>
                <span className="pt-hbar-name pt-ellipsis">{name}</span>
                <span className="pt-hbar-track">
                  <i
                    className="pt-hit"
                    style={{ width: `${(v / max) * 100}%`, background: fill[i] }}
                    {...track(`${name}: ${round(v)}${unit}`)}
                  />
                </span>
              </div>
            ))}
          </div>
        </>
      );
    }

    // Stacked columns, as in defect quantity split by defect type. Segments get
    // a hairline of the tile behind them so two neighbours never merge.
    case "stacked": {
      const parts = sliceParts(tile.parts ?? [], slice, index);
      const totals = parts.map((p) => p.reduce((a, b) => a + b, 0));
      const max = Math.max(...totals, 1);
      const depth = Math.max(...parts.map((p) => p.length), 1);
      const fill = marks(depth);
      return (
        <>
          <Label text={tile.label} />
          <div className="pt-bars pt-stack">
            {parts.map((col, i) => (
              <span
                key={i}
                className="pt-stackcol"
                style={{ height: `${(totals[i] / max) * 100}%` }}
              >
                {col.map((v, j) => (
                  <i
                    key={j}
                    className="pt-hit"
                    style={{ flex: v, background: fill[j] }}
                    {...track(
                      `${heads[i] ? `${heads[i]} · ` : ""}${legend[j] ?? `Series ${j + 1}`}: ${round(v)}`,
                    )}
                  />
                ))}
              </span>
            ))}
          </div>
          <Legend names={legend} colors={fill} />
        </>
      );
    }

    // Columns for the amount, a line for the rate. The single most common
    // Power BI visual after the card, and the reason dual measures do not
    // need two tiles.
    case "combo": {
      const line = sliceSeries(tile.series2 ?? [], slice, index + 91);
      const max = Math.max(...series, 1);
      const lineMax = Math.max(...line, 1);
      const fill = marks(1, "single")[0];
      const stroke = marks(2)[1] ?? tint;
      return (
        <>
          <Label text={tile.label} />
          <div className="pt-combo">
            <div className="pt-bars">
              {series.map((v, i) => (
                <span
                  key={i}
                  className="pt-hit"
                  style={{ height: `${(v / max) * 100}%`, background: fill }}
                  {...track(
                    `${heads[i] ? `${heads[i]} · ` : ""}${legend[0] ?? "Amount"}: ${round(v)}` +
                      (line[i] != null ? ` · ${legend[1] ?? "Rate"}: ${round(line[i])}` : ""),
                  )}
                />
              ))}
            </div>
            <svg className="pt-overlay" viewBox="0 0 100 40" preserveAspectRatio="none">
              <polyline
                points={path(line, lineMax)}
                fill="none"
                stroke={stroke}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
          <Legend names={legend} colors={[fill, stroke]} />
        </>
      );
    }

    case "line":
      return (
        <>
          <Label text={tile.label} />
          <Plot series={[series]} colors={[tint]} unit={unit} heads={heads} track={track} />
        </>
      );

    // This year against last year, the comparison every retail report opens
    // with. Each line is an entity, so each takes its own hue.
    case "mline": {
      const all = [
        series,
        sliceSeries(tile.series2 ?? [], slice, index + 41),
        sliceSeries(tile.series3 ?? [], slice, index + 73),
      ].filter((s) => s.length);
      const stroke = marks(all.length);
      return (
        <>
          <Label text={tile.label} />
          <Plot
            series={all}
            colors={stroke}
            unit={unit}
            heads={heads}
            legend={legend}
            track={track}
          />
          <Legend names={legend} colors={stroke} />
        </>
      );
    }

    case "area":
      return (
        <>
          <Label text={tile.label} />
          <Plot
            series={[series]}
            colors={[tint]}
            unit={unit}
            heads={heads}
            filled
            track={track}
          />
        </>
      );

    case "donut": {
      const share = Number.parseFloat(value || "60") || 60;
      const rest = Math.max(0, 100 - share);
      const stops = [share, share + rest * 0.62, 100];
      const segs = marks(3);
      const ring =
        `conic-gradient(${segs[0]} 0 ${stops[0]}%, ` +
        `${segs[1]} ${stops[0]}% ${stops[1]}%, ` +
        `${segs[2]} ${stops[1]}% 100%)`;
      return (
        <>
          <Label text={tile.label} />
          <div className="pt-donut-wrap">
            <div
              className="pt-donut pt-hit"
              style={{ background: ring }}
              {...track(
                stops
                  .map(
                    (s, i) =>
                      `${legend[i] ?? `Part ${i + 1}`}: ${Math.round(s - (stops[i - 1] ?? 0))}%`,
                  )
                  .join(" · "),
              )}
            >
              <span style={{ fontSize: size(10, 8.5), fontWeight: 600 }}>{value}</span>
            </div>
          </div>
          <Legend names={legend} colors={segs} />
        </>
      );
    }

    // Progress against a target. A half ring rather than a full one, because
    // the question is how far along, not how it splits.
    case "gauge": {
      const raw = sliceValue(String(tile.target ?? 0), slice, index);
      const pct = Math.min(100, Math.max(0, Number.parseFloat(raw) || 0));
      const sweep = (pct / 100) * 180;
      const fill = marks(1, "single")[0];
      return (
        <>
          <Label text={tile.label} />
          <div className="pt-gauge-wrap">
            <div
              className="pt-gauge pt-hit"
              style={{
                background: `conic-gradient(from 270deg, ${fill} 0 ${sweep}deg, var(--line) ${sweep}deg 180deg, transparent 180deg 360deg)`,
              }}
              {...track(`${Math.round(pct)}% of target`)}
            >
              <span className="pt-gauge-value" style={{ fontSize: size(13, 11), fontWeight: 600 }}>
                {`${Math.round(pct)}%`}
              </span>
            </div>
            <span className="pt-muted" style={{ fontSize: size(9, 8) }}>{tile.delta}</span>
          </div>
        </>
      );
    }

    // Share of a whole where the parts have names worth reading, which is what
    // the supplier sample switches to when it wants the worst eight vendors.
    case "treemap": {
      const items = sliceItems(tile.items ?? [], slice, index);
      const total = items.reduce((a, [, v]) => a + v, 0) || 1;
      const fill = marks(items.length);
      return (
        <>
          <Label text={tile.label} />
          <div className="pt-treemap">
            {items.map(([name, v], i) => (
              <span
                key={name}
                className="pt-tm-cell pt-hit"
                style={{
                  flexGrow: v,
                  flexBasis: `${(v / total) * 100}%`,
                  background: fill[i],
                  fontSize: size(8.5, 7.5),
                }}
                {...track(`${name}: ${Math.round((v / total) * 100)}%`)}
              >
                <b className="pt-ellipsis">{name}</b>
              </span>
            ))}
          </div>
        </>
      );
    }

    // Three measures at once: position on both axes and size for weight. The
    // CFO in the profitability sample looks for the big bubbles first.
    case "scatter": {
      const points = slicePoints(tile.points ?? [], slice, index);
      const fill = marks(points.length);
      return (
        <>
          <Label text={tile.label} />
          <div className="pt-plot">
            <i className="pt-axis-x" />
            <i className="pt-axis-y" />
            {points.map(([x, y, r], i) => (
              <span
                key={i}
                className="pt-bubble pt-hit"
                style={{
                  left: `${x}%`,
                  bottom: `${y}%`,
                  width: `${6 + (r / 100) * 15}%`,
                  background: fill[i],
                }}
                {...track(`${legend[i] ?? `Item ${i + 1}`}: ${round(r)}${unit}`)}
              />
            ))}
          </div>
        </>
      );
    }

    // Geography, abstracted. A real map needs a real projection, and at this
    // size a shape plus weighted points says the same thing.
    case "map": {
      const points = slicePoints(tile.points ?? [], slice, index);
      const fill = marks(1, "single")[0];
      return (
        <>
          <Label text={tile.label} />
          <div className="pt-map">
            <svg viewBox="0 0 100 60" preserveAspectRatio="none" className="pt-map-shape">
              <path
                d="M4 22 L16 12 L34 15 L44 8 L62 11 L78 6 L94 16 L96 34 L84 50 L64 54 L46 48 L28 52 L10 44 Z"
                fill="var(--line)"
              />
            </svg>
            {points.map(([x, y, r], i) => (
              <span
                key={i}
                className="pt-pin pt-hit"
                style={{
                  left: `${x}%`,
                  top: `${100 - y}%`,
                  width: `${5 + (r / 100) * 11}%`,
                  background: fill,
                }}
                {...track(`${legend[i] ?? `Site ${i + 1}`}: ${round(r)}${unit}`)}
              />
            ))}
          </div>
        </>
      );
    }

    // The matrix, and the only place a single hue ramp belongs on a grid: every
    // cell is the same measure, so lightness is the whole encoding.
    case "matrix": {
      const cells = sliceCells(tile.cells ?? [], slice, index);
      const max = Math.max(...cells.flat(), 1);
      const ramp = marksFor(palette, dark, "ramp", 5);
      const step = (v: number) => ramp[Math.min(4, Math.floor((1 - v / max) * 5))];
      const rows = tile.rowHeads ?? [];
      return (
        <>
          <Label text={tile.label} />
          <div
            className="pt-matrix"
            style={{
              fontSize: size(8, 7),
              ["--mx-cols" as string]: String(heads.length || 1),
            }}
          >
            <div className="pt-mx-head">
              <span />
              {heads.map((h) => (
                <span key={h} className="pt-muted pt-ellipsis">{h}</span>
              ))}
            </div>
            {cells.map((row, i) => (
              <div key={i} className="pt-mx-row">
                <span className="pt-muted pt-ellipsis">{rows[i]}</span>
                {row.map((v, j) => (
                  <span
                    key={j}
                    className="pt-mx-cell pt-hit"
                    style={{ background: step(v) }}
                    {...track(`${rows[i] ?? ""} · ${heads[j] ?? ""}: ${round(v)}${unit}`)}
                  />
                ))}
              </div>
            ))}
          </div>
        </>
      );
    }

    // The bridge from one total to another. The first value is the opening
    // total and the rest are the moves; the closing total is computed and drawn
    // as its own column, because a bridge that does not land anywhere is just a
    // row of floating bars.
    case "waterfall": {
      const [open = 0, ...deltas] = series;
      let cum = open;
      const steps = deltas.map((v, i) => {
        // Slicing works on magnitudes, so the direction comes from the source.
        const signed = Math.sign((tile.series ?? [])[i + 1] ?? 1) * Math.abs(v);
        const from = cum;
        cum += signed;
        return { from, to: cum, v: signed };
      });
      const close = cum;
      const max = Math.max(open, close, ...steps.map((s) => Math.max(s.from, s.to)), 1);
      const up = TONE.good;
      const down = TONE.bad;
      const total = marksFor(palette, dark, "single", 1)[0];

      const col = (lo: number, hi: number, fillC: string, key: string, tip: string) => (
        <span key={key} className="pt-wf-col">
          <i
            className="pt-hit"
            style={{
              bottom: `${(lo / max) * 92}%`,
              height: `${Math.max(2, ((hi - lo) / max) * 92)}%`,
              background: fillC,
            }}
            {...track(tip)}
          />
        </span>
      );

      return (
        <>
          <Label text={tile.label} />
          <div className="pt-waterfall">
            {col(0, open, total, "open", `${heads[0] ?? "Opening"}: ${round(open)}`)}
            {steps.map((s, i) =>
              col(
                Math.min(s.from, s.to),
                Math.max(s.from, s.to),
                s.v >= 0 ? up : down,
                `d${i}`,
                `${heads[i + 1] ?? `Move ${i + 1}`}: ${s.v >= 0 ? "+" : "-"}${round(Math.abs(s.v))}`,
              ),
            )}
            {col(
              0,
              close,
              total,
              "close",
              `${heads[series.length] ?? "Closing"}: ${round(close)}`,
            )}
          </div>
        </>
      );
    }

    case "table": {
      const rows = tile.rows ?? [];
      const dots = marks(rows.length);
      return (
        <>
          <Label text={tile.label} />
          <div className="pt-rows">
            {rows.map(([a, b, c], i) => (
              <div key={i} className="pt-row" style={{ fontSize: size(9.5, 8) }}>
                <span className="pt-dot" style={{ background: dots[i] }} />
                <span className="pt-ellipsis">{a}</span>
                <span className="pt-muted" style={{ marginLeft: "auto" }}>
                  {sliceValue(b, slice, index + i)}
                </span>
                <span className="pt-tag" style={{ color: tint }}>{c}</span>
              </div>
            ))}
          </div>
        </>
      );
    }

    case "row": {
      const [a, b, c] = tile.rows?.[0] ?? ["", "", ""];
      return (
        <div className="pt-row pt-row-single" style={{ fontSize: size(10, 8.5) }}>
          <span className="pt-dot" style={{ background: tint }} />
          <span className="pt-ellipsis">{a}</span>
          <span style={{ marginLeft: "auto", fontWeight: 600 }}>
            {sliceValue(b, slice, index)}
          </span>
          <span className="pt-tag" style={{ color: tint }}>{c}</span>
        </div>
      );
    }

    // Slicers. Practically every report has at least one, and where it sits is
    // a layout decision in its own right: a chip row along the top when there
    // are a few values, a list down the side when there are many.
    case "slicer": {
      const items = tile.items ?? [];
      return (
        <div className="pt-slicer" style={{ fontSize: size(9.5, 8.5) }}>
          {tile.label ? <span className="pt-muted pt-slicer-name">{tile.label}</span> : null}
          <span className="pt-slicer-chips">
            {items.map(([name], i) => (
              <button
                key={name}
                type="button"
                className={`pt-chip-btn${i === slice ? " is-on" : ""}`}
                style={i === slice ? { background: tint, borderColor: tint } : undefined}
                onClick={() => onSlice?.(i)}
              >
                {name}
              </button>
            ))}
          </span>
        </div>
      );
    }

    case "daterange": {
      const items = tile.items ?? [];
      const at = items.length ? Math.min(slice, items.length - 1) : 0;
      const left = 4 + at * 15;
      const right = Math.max(10, 34 - at * 7);
      return (
        <div className="pt-daterange" style={{ fontSize: size(9.5, 8.5) }}>
          <span className="pt-muted pt-slicer-name">{tile.label}</span>
          <span className="pt-dr-track">
            <i style={{ background: tint, left: `${left}%`, right: `${right}%` }} />
            <b style={{ background: tint, left: `${left}%` }} />
            <b style={{ background: tint, left: `${100 - right}%` }} />
          </span>
          <span className="pt-slicer-chips">
            {items.map(([name], i) => (
              <button
                key={name}
                type="button"
                className={`pt-chip-btn${i === slice ? " is-on" : ""}`}
                style={i === slice ? { background: tint, borderColor: tint } : undefined}
                onClick={() => onSlice?.(i)}
              >
                {name}
              </button>
            ))}
          </span>
        </div>
      );
    }

    case "rail":
      return (
        <div className="pt-rail">
          <span className="pt-muted pt-rail-head" style={{ fontSize: size(9, 8) }}>
            {tile.label}
          </span>
          {(tile.items ?? []).map(([name], i) => (
            <button
              key={name}
              type="button"
              className={`pt-rail-item pt-ellipsis${i === slice ? " is-on" : ""}`}
              style={{ fontSize: size(9, 8), color: i === slice ? tint : undefined }}
              onClick={() => onSlice?.(i)}
            >
              {name}
            </button>
          ))}
        </div>
      );

    default:
      return null;
  }
}

/** A line plot with a hit target over every point, so values are readable. */
function Plot({
  series,
  colors,
  unit,
  heads,
  legend,
  filled,
  track,
}: {
  series: number[][];
  colors: string[];
  unit: string;
  heads?: string[];
  legend?: string[];
  filled?: boolean;
  track: Track;
}) {
  const max = Math.max(...series.flat(), 1);
  return (
    <div className="pt-linewrap">
      <svg className="pt-line" viewBox="0 0 100 40" preserveAspectRatio="none">
        {filled ? (
          <polygon points={`0,40 ${path(series[0], max)} 100,40`} fill={colors[0]} opacity="0.22" />
        ) : null}
        {series.map((s, i) => (
          <polyline
            key={i}
            points={path(s, max)}
            fill="none"
            stroke={colors[i]}
            strokeWidth={i === 0 ? "1.8" : "1.4"}
            strokeDasharray={i === 2 ? "3 3" : undefined}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      <div className="pt-linehits">
        {series[0]?.map((_, i) => (
          <span
            key={i}
            className="pt-linehit"
            {...track(
              [
                heads?.[i],
                ...series.map(
                  (s, j) =>
                    `${legend?.[j] ?? (series.length > 1 ? `Series ${j + 1}` : "Value")}: ${round(
                      s[i] ?? 0,
                    )}${unit}`,
                ),
              ]
                .filter(Boolean)
                .join(" · "),
            )}
          />
        ))}
      </div>
    </div>
  );
}

/** Identity is never colour alone, so any chart carrying two or more series
 *  names them underneath. */
function Legend({ names, colors }: { names: string[]; colors: string[] }) {
  if (names.length < 2) return null;
  return (
    <div className="pt-legend" style={{ fontSize: size(8.5, 7.5) }}>
      {names.map((n, i) => (
        <span key={n} className="pt-legend-item">
          <i style={{ background: colors[i] }} />
          <span className="pt-ellipsis">{n}</span>
        </span>
      ))}
    </div>
  );
}
