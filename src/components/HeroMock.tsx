import { useEffect, useRef, useState } from "react";

const METRICS = [
  { label: "Revenue", value: "$1.24M", delta: "+12.4%", up: true, title: "Revenue by month", bars: [44, 61, 38, 74, 56, 92], line: [96, 78, 86, 52, 60, 26, 34] },
  { label: "Orders", value: "8,412", delta: "+3.1%", up: true, title: "Orders by month", bars: [52, 48, 66, 58, 80, 71], line: [88, 70, 74, 60, 44, 50, 30] },
  { label: "Avg. basket", value: "$147", delta: "-0.8%", up: false, title: "Average basket by month", bars: [30, 36, 42, 39, 48, 55], line: [74, 66, 72, 58, 64, 48, 42] },
  { label: "Churn", value: "2.6%", delta: "flat", up: false, title: "Churn by month", bars: [70, 62, 58, 50, 44, 36], line: [26, 38, 34, 50, 58, 72, 80] },
];

const RAIL = ["64%", "80%", "52%", "70%"];
const RAIL_LOWER = ["58%", "44%"];

export function HeroMock() {
  const [active, setActive] = useState(0);
  const polyRef = useRef<SVGPolylineElement>(null);
  const lineRef = useRef<number[]>(METRICS[0].line);
  const rafRef = useRef<number>(0);

  const metric = METRICS[active];
  const max = Math.max(...metric.bars);

  // Tween the sparkline between metrics rather than snapping to the new shape.
  useEffect(() => {
    const poly = polyRef.current;
    if (!poly) return;
    const from = lineRef.current.slice();
    const to = metric.line;
    lineRef.current = to.slice();
    const t0 = performance.now();
    const dur = 700;
    poly.style.strokeDasharray = "none";
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - k, 3);
      poly.setAttribute(
        "points",
        to.map((v, j) => `${j * 40},${(from[j] + (v - from[j]) * e).toFixed(1)}`).join(" "),
      );
      if (k < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [metric]);

  return (
    <div className="mock">
      <div className="mock-bar">
        <i />
        <i />
        <i />
        <span className="mock-path mono">revenue-overview / power-bi</span>
      </div>

      <div className="mock-body">
        <div className="mock-rail" aria-hidden="true">
          {RAIL.map((w, i) => (
            <span key={w} className={i === 0 ? "on" : undefined} style={{ width: w }} />
          ))}
          <hr />
          {RAIL_LOWER.map((w) => (
            <span key={w} style={{ width: w }} />
          ))}
        </div>

        <div className="mock-main">
          <div className="kpis">
            {METRICS.map((m, i) => (
              <button
                key={m.label}
                type="button"
                className={`kpi${i === active ? " is-active" : ""}`}
                style={{ animationDelay: `${0.3 + i * 0.08}s` }}
                onClick={() => setActive(i)}
              >
                <span className="kpi-label">{m.label}</span>
                <span className="kpi-value">{m.value}</span>
                <span className={`kpi-delta${m.up ? " up" : ""}`}>{m.delta}</span>
              </button>
            ))}
          </div>

          <div className="mock-charts">
            <div className="panel">
              <div className="panel-title">{metric.title}</div>
              <div className="bars">
                {metric.bars.map((v, i) => (
                  <i
                    key={i}
                    style={{
                      height: `${v}%`,
                      opacity: (0.26 + 0.74 * Math.pow(v / max, 3)).toFixed(2),
                      animationDelay: `${0.5 + i * 0.08}s`,
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="panel">
              <div className="panel-title">Active users</div>
              <svg viewBox="0 0 240 120" preserveAspectRatio="none" className="spark">
                <polyline
                  ref={polyRef}
                  points={METRICS[0].line.map((v, j) => `${j * 40},${v}`).join(" ")}
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="600"
                  style={{ animation: "glDraw 1.4s ease .7s both" }}
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
