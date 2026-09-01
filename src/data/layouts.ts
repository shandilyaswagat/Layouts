export type TileKind = "title" | "kpi" | "bar" | "line" | "donut" | "table" | "row" | "rail";

/** One tile in a layout preview. Geometry plus the content it stands for. */
export type Tile = {
  /** Columns spanned, out of four. */
  c: number;
  /** Rows spanned, when the tile is a full height rail. */
  r?: number;
  /** Height in pixels at the reference width, or a CSS length for stretch tiles. */
  h: number | string;
  /** Index into the active palette. */
  p: number;
  kind: TileKind;
  label?: string;
  value?: string;
  delta?: string;
  /** Bar heights or line points, 0 to 100. */
  series?: number[];
  /** Table rows: label, then two figures. */
  rows?: [string, string, string][];
};

export type Layout = {
  id: string;
  name: string;
  desc: string;
  platforms: string[];
  tiles: Tile[];
};

/** The presets from the earlier build, given the grid each one implies. */
export const LAYOUTS: Layout[] = [
  {
    id: "revenue",
    name: "Revenue overview",
    desc: "Monthly read, one exec, four numbers that matter.",
    platforms: ["Power BI", "Web"],
    tiles: [
      { c: 4, h: 34, p: 5, kind: "title", label: "Revenue overview", value: "FY26 · Q3" },
      { c: 1, h: 74, p: 2, kind: "kpi", label: "Revenue", value: "$1.24M", delta: "+12.4%" },
      { c: 1, h: 74, p: 2, kind: "kpi", label: "Orders", value: "8,412", delta: "+3.1%" },
      { c: 1, h: 74, p: 3, kind: "kpi", label: "Avg. basket", value: "$147", delta: "-0.8%" },
      { c: 1, h: 74, p: 4, kind: "kpi", label: "Churn", value: "2.6%", delta: "flat" },
      { c: 3, h: 180, p: 1, kind: "bar", label: "Revenue by month", series: [44, 61, 38, 74, 56, 92] },
      { c: 1, h: 180, p: 4, kind: "donut", label: "Mix", value: "64%" },
    ],
  },
  {
    id: "funnel",
    name: "Marketing funnel",
    desc: "Weekly, stage drop off is the whole story.",
    platforms: ["Tableau", "Web"],
    tiles: [
      { c: 4, h: 190, p: 1, kind: "bar", label: "Funnel by stage", series: [96, 74, 52, 33, 18] },
      { c: 2, h: 120, p: 3, kind: "line", label: "Sessions", series: [40, 55, 48, 70, 62, 84, 78] },
      { c: 2, h: 120, p: 4, kind: "donut", label: "Channel mix", value: "42%" },
      { c: 4, h: 44, p: 5, kind: "title", label: "Conversion", value: "3.4%" },
    ],
  },
  {
    id: "support",
    name: "Support queue",
    desc: "Hourly, ages and breaches sort themselves to the top.",
    platforms: ["Power BI", "Excel"],
    tiles: [
      { c: 1, r: 3, h: "100%", p: 4, kind: "rail", label: "Filters" },
      { c: 3, h: 34, p: 5, kind: "title", label: "Support queue", value: "Live" },
      { c: 1, h: 80, p: 2, kind: "kpi", label: "Open", value: "312", delta: "+18" },
      { c: 1, h: 80, p: 2, kind: "kpi", label: "Breached", value: "7", delta: "-2" },
      { c: 1, h: 80, p: 3, kind: "kpi", label: "First reply", value: "14m", delta: "-3m" },
      {
        c: 3,
        h: 160,
        p: 1,
        kind: "table",
        label: "Oldest open",
        rows: [
          ["Billing sync fails", "4h 12m", "High"],
          ["Export times out", "3h 48m", "High"],
          ["SSO redirect loop", "2h 05m", "Med"],
          ["Seat count wrong", "1h 30m", "Low"],
        ],
      },
    ],
  },
  {
    id: "fleet",
    name: "Fleet and logistics",
    desc: "Live, geography plus exceptions, side by side.",
    platforms: ["Tableau", "Web"],
    tiles: [
      { c: 2, h: 150, p: 1, kind: "bar", label: "Loads by region", series: [58, 82, 44, 67, 91] },
      { c: 2, h: 150, p: 3, kind: "line", label: "On-time rate", series: [72, 68, 78, 74, 86, 82, 90] },
      { c: 2, h: 150, p: 2, kind: "donut", label: "Fleet status", value: "88%" },
      {
        c: 2,
        h: 150,
        p: 4,
        kind: "table",
        label: "Exceptions",
        rows: [
          ["Depot 4 delay", "42m", "Open"],
          ["Reroute 118", "17m", "Open"],
          ["Cold chain 22", "08m", "Ack"],
        ],
      },
    ],
  },
  {
    id: "ops",
    name: "Ops control room",
    desc: "Always on a wall, status before detail.",
    platforms: ["Power BI", "Tableau"],
    tiles: [
      { c: 4, h: 28, p: 5, kind: "title", label: "Ops control room", value: "All systems normal" },
      { c: 1, h: 66, p: 1, kind: "kpi", label: "Throughput", value: "1,204/h", delta: "+4%" },
      { c: 1, h: 66, p: 2, kind: "kpi", label: "Queue", value: "38", delta: "-11" },
      { c: 1, h: 66, p: 3, kind: "kpi", label: "Errors", value: "0.4%", delta: "flat" },
      { c: 1, h: 66, p: 4, kind: "kpi", label: "Uptime", value: "99.98%", delta: "30d" },
      { c: 2, h: 150, p: 1, kind: "bar", label: "Jobs per hour", series: [62, 71, 55, 88, 74, 93] },
      { c: 2, h: 150, p: 3, kind: "line", label: "P95 latency", series: [58, 62, 50, 44, 52, 38, 34] },
    ],
  },
  {
    id: "finance",
    name: "Finance close",
    desc: "Monthly, variance against plan, heavy on tables.",
    platforms: ["Excel", "Power BI"],
    tiles: [
      { c: 4, h: 34, p: 5, kind: "title", label: "Finance close", value: "March" },
      { c: 4, h: 24, p: 2, kind: "row", rows: [["Revenue", "1,240,880", "+6.2%"]] },
      { c: 4, h: 24, p: 4, kind: "row", rows: [["Cost of sales", "486,210", "-1.8%"]] },
      { c: 4, h: 24, p: 4, kind: "row", rows: [["Gross margin", "754,670", "+9.4%"]] },
      { c: 4, h: 24, p: 2, kind: "row", rows: [["Operating cost", "412,900", "+2.1%"]] },
      { c: 4, h: 24, p: 4, kind: "row", rows: [["Net", "341,770", "+14.0%"]] },
      { c: 2, h: 78, p: 1, kind: "bar", label: "Variance", series: [40, 66, 52, 78] },
      { c: 2, h: 78, p: 3, kind: "line", label: "Cash", series: [46, 52, 48, 64, 72] },
    ],
  },
];
