import type { Encoding } from "../lib/chartColors";

export type TileKind =
  | "title"
  | "kpi"
  | "spark"
  | "status"
  | "bar"
  | "hbar"
  | "stacked"
  | "combo"
  | "line"
  | "mline"
  | "area"
  | "donut"
  | "gauge"
  | "treemap"
  | "scatter"
  | "map"
  | "matrix"
  | "waterfall"
  | "table"
  | "row"
  | "slicer"
  | "daterange"
  | "rail";

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
  /**
   * How the marks in this tile take colour. Months and hours are one series,
   * so they default to a single hue. Set "category" when the bars are separate
   * things, and "ramp" when they are one quantity in order, like a funnel.
   */
  enc?: Encoding;
  /** Second measure, for a combo chart's line or a second line series. */
  series2?: number[];
  /** A third line series, for year on year comparisons. */
  series3?: number[];
  /** Stacked column segments, one inner array per column. */
  parts?: number[][];
  /** Ranked or nested items: a label and its share. Drives hbar and treemap. */
  items?: [string, number][];
  /** Bubbles as x, y and size, each 0 to 100. */
  points?: [number, number, number][];
  /** Heatmap cells, one inner array per row. */
  cells?: number[][];
  /** Row and column headers for a matrix, and the category names along the
   *  bottom of a bar, combo, stacked or line chart. Used by the tooltips. */
  rowHeads?: string[];
  colHeads?: string[];
  /** Series names. Two or more of them and the chart draws a legend, because
   *  identity is never carried by colour alone. */
  legend?: string[];
  /** Suffix on a tooltip value, such as "m" or "%". */
  unit?: string;
  /** Progress against target, 0 to 100, for a gauge. */
  target?: number;
  /** Status colour on a KPI. Deliberately separate from the palette. */
  tone?: "good" | "warn" | "bad";
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

/**
 * The library. The first six came from the earlier build. The ten after them
 * are the layout patterns that keep turning up in real Power BI work, taken
 * from Microsoft's own report guidance, the published pattern catalogues and
 * the template repos people actually download: a KPI row over a chart grid, a
 * two by four scorecard, a filter bar on top, a left rail, an inverted
 * pyramid, a quadrant, a monitoring wall, a headline and detail split, a side
 * by side comparison, and the long scrolling report.
 *
 * Each one is sized for the 1280 by 720 canvas Power BI opens with, on a four
 * column grid with the KPI band above the charts and any table last, which is
 * the hierarchy the eye tracking work keeps landing on.
 */
export const LAYOUTS: Layout[] = [
  {
    id: "revenue",
    name: "Revenue overview",
    desc: "Monthly read, one exec, four numbers that matter.",
    platforms: ["Power BI", "Web"],
    tiles: [
      { c: 4, h: 34, p: 5, kind: "title", label: "Revenue overview", value: "FY26 · Q3" },
      { c: 4, h: 36, p: 0, kind: "slicer", label: "Region", items: [["All", 1], ["East", 1], ["West", 1], ["North", 1], ["South", 1]] },
      { c: 1, h: 74, p: 2, kind: "kpi", label: "Revenue", value: "$1.24M", delta: "+12.4%" },
      { c: 1, h: 74, p: 2, kind: "kpi", label: "Orders", value: "8,412", delta: "+3.1%" },
      { c: 1, h: 74, p: 3, kind: "kpi", label: "Avg. basket", value: "$147", delta: "-0.8%" },
      { c: 1, h: 74, p: 4, kind: "kpi", label: "Churn", value: "2.6%", delta: "flat" },
      { c: 3, h: 180, p: 1, kind: "bar", label: "Revenue by month", colHeads: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"], series: [44, 61, 38, 74, 56, 92] },
      { c: 1, h: 180, p: 4, kind: "donut", label: "Mix", legend: ["Direct", "Partner", "Online"], value: "64%" },
    ],
  },
  {
    id: "funnel",
    name: "Marketing funnel",
    desc: "Weekly, stage drop off is the whole story.",
    platforms: ["Tableau", "Web"],
    tiles: [
      { c: 4, h: 36, p: 0, kind: "slicer", label: "Channel", items: [["All", 1], ["Paid", 1], ["Organic", 1], ["Email", 1], ["Social", 1]] },
      { c: 4, h: 190, p: 1, kind: "bar", label: "Funnel by stage", enc: "ramp", colHeads: ["Visits", "Signups", "Trials", "Qualified", "Won"], series: [96, 74, 52, 33, 18] },
      { c: 2, h: 120, p: 3, kind: "line", label: "Sessions", series: [40, 55, 48, 70, 62, 84, 78] },
      { c: 2, h: 120, p: 4, kind: "donut", label: "Channel mix", legend: ["Paid", "Organic", "Referral"], value: "42%" },
      { c: 4, h: 44, p: 5, kind: "title", label: "Conversion", value: "3.4%" },
    ],
  },
  {
    id: "support",
    name: "Support queue",
    desc: "Hourly, ages and breaches sort themselves to the top.",
    platforms: ["Power BI", "Excel"],
    tiles: [
      { c: 1, r: 3, h: "100%", p: 0, kind: "rail", label: "Queue", items: [["All open", 1], ["Breached", 1], ["Escalated", 1], ["Waiting", 1], ["Mine", 1]] },
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
      { c: 4, h: 36, p: 0, kind: "slicer", label: "Depot", items: [["All", 1], ["North", 1], ["Midlands", 1], ["South", 1]] },
      { c: 2, h: 150, p: 1, kind: "bar", label: "Loads by region", enc: "category", colHeads: ["North", "Midlands", "South", "Wales"], series: [58, 82, 44, 67] },
      { c: 2, h: 150, p: 3, kind: "line", label: "On-time rate", series: [72, 68, 78, 74, 86, 82, 90] },
      { c: 2, h: 150, p: 2, kind: "donut", label: "Fleet status", legend: ["Active", "Idle", "Service"], value: "88%" },
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
      { c: 4, h: 36, p: 0, kind: "slicer", label: "Service", items: [["All", 1], ["Checkout", 1], ["Payments", 1], ["Search", 1]] },
      { c: 1, h: 66, p: 1, kind: "kpi", label: "Throughput", value: "1,204/h", delta: "+4%" },
      { c: 1, h: 66, p: 2, kind: "kpi", label: "Queue", value: "38", delta: "-11" },
      { c: 1, h: 66, p: 3, kind: "kpi", label: "Errors", value: "0.4%", delta: "flat" },
      { c: 1, h: 66, p: 4, kind: "kpi", label: "Uptime", value: "99.98%", delta: "30d" },
      { c: 2, h: 150, p: 1, kind: "bar", label: "Jobs per hour", colHeads: ["09", "10", "11", "12", "13", "14"], series: [62, 71, 55, 88, 74, 93] },
      { c: 2, h: 150, p: 3, kind: "line", label: "P95 latency", unit: "ms", colHeads: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], series: [58, 62, 50, 44, 52, 38, 34] },
    ],
  },
  {
    id: "finance",
    name: "Finance close",
    desc: "Monthly, variance against plan, heavy on tables.",
    platforms: ["Excel", "Power BI"],
    tiles: [
      { c: 4, h: 34, p: 5, kind: "title", label: "Finance close", value: "March" },
      { c: 4, h: 36, p: 0, kind: "slicer", label: "Entity", items: [["Group", 1], ["EMEA", 1], ["Americas", 1], ["APAC", 1]] },
      { c: 4, h: 34, p: 2, kind: "row", rows: [["Revenue", "1,240,880", "+6.2%"]] },
      { c: 4, h: 34, p: 4, kind: "row", rows: [["Cost of sales", "486,210", "-1.8%"]] },
      { c: 4, h: 34, p: 4, kind: "row", rows: [["Gross margin", "754,670", "+9.4%"]] },
      { c: 4, h: 34, p: 2, kind: "row", rows: [["Operating cost", "412,900", "+2.1%"]] },
      { c: 4, h: 34, p: 4, kind: "row", rows: [["Net", "341,770", "+14.0%"]] },
      { c: 2, h: 78, p: 1, kind: "bar", label: "Variance", enc: "category", series: [40, 66, 52, 78] },
      { c: 2, h: 78, p: 3, kind: "line", label: "Cash", series: [46, 52, 48, 64, 72] },
    ],
  },

  {
    id: "supplier-quality",
    name: "Supplier quality",
    desc: "Which vendors cost you downtime, and which plants catch it first.",
    platforms: ["Power BI", "Tableau"],
    tiles: [
      {
        c: 4,
        h: 30,
        p: 0,
        kind: "slicer",
        label: "Material type",
        items: [["All", 1], ["Corrugate", 1], ["Raw", 1], ["Packaging", 1], ["Electrical", 1]],
      },
      { c: 1, h: 68, p: 0, kind: "kpi", label: "Defect quantity", value: "33.0M", delta: "+8.4%" },
      { c: 1, h: 68, p: 1, kind: "kpi", label: "Downtime", value: "77,180m", delta: "+2.1%" },
      { c: 1, h: 68, p: 2, kind: "kpi", label: "Vendors", value: "218", delta: "flat" },
      { c: 1, h: 68, p: 3, kind: "status", label: "Plants at risk", value: "3", delta: "Springfield worst", tone: "bad" },
      {
        c: 2,
        h: 152,
        p: 0,
        kind: "combo",
        label: "Defects and downtime by material type",
        colHeads: ["Corrugate", "Raw", "Packaging", "Electrical", "Fasteners", "Other"],
        legend: ["Defect quantity", "Downtime"],
        series: [92, 61, 74, 44, 33, 21],
        series2: [38, 72, 55, 88, 46, 30],
      },
      {
        c: 2,
        h: 152,
        p: 1,
        kind: "map",
        label: "Downtime by plant",
        unit: "m",
        legend: ["Springfield", "Naperville", "Aurora", "Peoria", "Joliet"],
        points: [[22, 34, 70], [41, 22, 40], [58, 46, 92], [74, 30, 55], [86, 52, 28]],
      },
      {
        c: 2,
        h: 132,
        p: 2,
        kind: "treemap",
        label: "Downtime by vendor",
        items: [["Wilkins", 34], ["Elorac", 22], ["Sundial", 16], ["Ballard", 11], ["Other", 17]],
      },
      {
        c: 2,
        h: 132,
        p: 3,
        kind: "stacked",
        label: "Defect quantity by material and type",
        colHeads: ["Corrugate", "Raw", "Packaging", "Electrical", "Fasteners"],
        legend: ["Impact", "Rejected", "No impact"],
        parts: [[52, 28, 14], [38, 44, 10], [61, 18, 22], [29, 33, 26], [44, 21, 12]],
      },
    ],
  },
  {
    id: "customer-profit",
    name: "Customer profitability",
    desc: "Five managers, one scorecard, margin against budget every month.",
    platforms: ["Power BI", "Excel"],
    tiles: [
      {
        c: 1,
        r: 4,
        h: "100%",
        p: 0,
        kind: "rail",
        label: "Executive",
        items: [["Andrew", 1], ["Annelie", 1], ["Carlos", 1], ["Tina", 1], ["Valery", 1]],
      },
      { c: 3, h: 30, p: 4, kind: "title", label: "Team scorecard", value: "FY26 · all regions" },
      { c: 1, h: 76, p: 0, kind: "status", label: "Revenue status", value: "On plan", delta: "Total year", tone: "good" },
      { c: 1, h: 76, p: 1, kind: "kpi", label: "Gross margin", value: "42.5%", delta: "-1.2pt" },
      { c: 1, h: 76, p: 2, kind: "kpi", label: "Customers", value: "80", delta: "+6" },
      {
        c: 3,
        h: 152,
        p: 0,
        kind: "combo",
        label: "Revenue % variance to budget by month",
        colHeads: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
        legend: ["Revenue", "Variance to budget"],
        series: [58, 34, 88, 62, 71, 49, 80],
        series2: [44, 66, 52, 74, 58, 70, 86],
      },
      {
        c: 3,
        h: 124,
        p: 1,
        kind: "treemap",
        label: "Total revenue by region",
        items: [["East", 38], ["North", 27], ["Central", 18], ["West", 11], ["South", 6]],
      },
    ],
  },
  {
    id: "retail-stores",
    name: "Retail store sales",
    desc: "This year against last, by district, with the outliers visible.",
    platforms: ["Power BI", "Excel"],
    tiles: [
      {
        c: 4,
        h: 30,
        p: 0,
        kind: "slicer",
        label: "District manager",
        items: [["All", 1], ["Allan", 1], ["Andrew", 1], ["Carlos", 1], ["Valery", 1]],
      },
      {
        c: 2,
        h: 74,
        p: 0,
        kind: "spark",
        label: "This year sales",
        value: "$27.9M",
        delta: "+12.4% on last year",
        series: [42, 48, 44, 56, 61, 58, 70, 66, 78, 74, 86, 92],
      },
      {
        c: 2,
        h: 74,
        p: 1,
        kind: "spark",
        label: "Sales per sq ft",
        value: "$18.42",
        delta: "+$1.06",
        series: [50, 54, 51, 58, 55, 62, 60, 66, 63, 70, 68, 74],
      },
      {
        c: 2,
        h: 158,
        p: 0,
        kind: "scatter",
        label: "Sales variance % by district",
        legend: ["FD-01", "FD-02", "FD-03", "FD-04", "LI-01"],
        unit: "%",
        points: [[16, 58, 44], [33, 30, 78], [50, 72, 30], [68, 46, 92], [86, 26, 52]],
      },
      {
        c: 2,
        h: 158,
        p: 1,
        kind: "mline",
        label: "This year and last year by month",
        colHeads: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        legend: ["This year", "Last year"],
        series: [40, 48, 44, 58, 54, 68, 64, 76, 72, 84, 80, 92],
        series2: [36, 40, 42, 46, 50, 52, 58, 60, 64, 66, 70, 74],
      },
      {
        c: 4,
        h: 124,
        p: 2,
        kind: "hbar",
        label: "Sales per sq ft by new store",
        unit: " psf",
        items: [["Winchester", 92], ["Fairfax", 74], ["Cincinnati 1", 61], ["Cincinnati 2", 43]],
      },
    ],
  },
  {
    id: "industry-margin",
    name: "Industry margin analysis",
    desc: "Bubbles, because size is the third thing you need to see.",
    platforms: ["Power BI", "Tableau"],
    tiles: [
      {
        c: 4,
        h: 30,
        p: 0,
        kind: "slicer",
        label: "Industry",
        items: [["All", 1], ["CPG", 1], ["Federal", 1], ["High tech", 1], ["Services", 1]],
      },
      { c: 1, h: 66, p: 0, kind: "kpi", label: "Gross margin", value: "38.2%", delta: "+0.9pt" },
      { c: 1, h: 66, p: 1, kind: "kpi", label: "Revenue", value: "$14.6M", delta: "+7.2%" },
      { c: 1, h: 66, p: 2, kind: "kpi", label: "Segments", value: "11", delta: "flat" },
      { c: 1, h: 66, p: 3, kind: "status", label: "Against budget", value: "-2.4%", delta: "Behind", tone: "warn" },
      {
        c: 3,
        h: 172,
        p: 0,
        kind: "scatter",
        label: "Variance %, margin % and revenue by industry",
        legend: ["CPG", "Federal", "High tech", "Services", "Industrial", "Distribution"],
        points: [[13, 32, 34], [27, 60, 88], [43, 44, 52], [57, 70, 26], [71, 36, 70], [87, 56, 44]],
      },
      { c: 1, h: 172, p: 1, kind: "donut", label: "Segment mix", legend: ["Enterprise", "Mid market", "SMB"], value: "46%" },
      {
        c: 4,
        h: 118,
        p: 2,
        kind: "mline",
        label: "Gross margin % by month and executive",
        colHeads: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
        legend: ["Andrew", "Valery", "Carlos"],
        unit: "%",
        series: [44, 48, 46, 54, 58, 56, 62],
        series2: [62, 58, 64, 60, 56, 52, 50],
        series3: [30, 36, 34, 42, 46, 52, 58],
      },
    ],
  },
  {
    id: "exec-scorecard",
    name: "Executive scorecard",
    desc: "Four cards that carry their own trend, and one number against target.",
    platforms: ["Power BI", "Excel"],
    tiles: [
      {
        c: 4,
        h: 36,
        p: 0,
        kind: "daterange",
        label: "Fiscal year",
        items: [["Full year", 1], ["H1", 1], ["Q3", 1], ["Last 90 days", 1]],
      },
      {
        c: 2,
        h: 76,
        p: 0,
        kind: "spark",
        label: "Bookings",
        value: "$4.8M",
        delta: "+9.2%",
        series: [38, 44, 41, 52, 49, 61, 58, 66, 72, 69, 80, 88],
      },
      {
        c: 2,
        h: 76,
        p: 1,
        kind: "spark",
        label: "Pipeline",
        value: "$12.1M",
        delta: "+4.4%",
        series: [60, 58, 64, 62, 70, 66, 74, 71, 78, 76, 82, 80],
      },
      {
        c: 2,
        h: 76,
        p: 2,
        kind: "spark",
        label: "Net retention",
        value: "118%",
        delta: "+6pt",
        series: [44, 46, 50, 48, 55, 58, 56, 63, 66, 70, 74, 78],
      },
      {
        c: 2,
        h: 76,
        p: 3,
        kind: "spark",
        label: "CAC payback",
        value: "11mo",
        delta: "-1mo",
        series: [82, 78, 80, 74, 70, 72, 66, 62, 58, 60, 54, 50],
      },
      { c: 1, h: 152, p: 0, kind: "gauge", label: "Against target", value: "92%", delta: "$5.2M of $5.6M", target: 92 },
      {
        c: 3,
        h: 152,
        p: 1,
        kind: "mline",
        label: "Bookings against plan and last year",
        colHeads: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        legend: ["Actual", "Plan", "Last year"],
        series: [38, 44, 41, 52, 49, 61, 58, 66, 72, 69, 80, 88],
        series2: [40, 45, 50, 55, 60, 64, 68, 72, 76, 80, 84, 88],
        series3: [30, 34, 33, 40, 42, 47, 50, 54, 58, 61, 65, 70],
      },
    ],
  },
  {
    id: "finance-bridge",
    name: "Finance variance bridge",
    desc: "How plan became actual, then the same story as a matrix.",
    platforms: ["Excel", "Power BI"],
    tiles: [
      {
        c: 4,
        h: 30,
        p: 0,
        kind: "slicer",
        label: "Entity",
        items: [["Group", 1], ["EMEA", 1], ["Americas", 1], ["APAC", 1]],
      },
      { c: 1, h: 66, p: 0, kind: "kpi", label: "Plan", value: "$8.40M", delta: "FY26" },
      { c: 1, h: 66, p: 1, kind: "kpi", label: "Actual", value: "$9.12M", delta: "+8.6%" },
      { c: 1, h: 66, p: 2, kind: "kpi", label: "Variance", value: "+$720K", delta: "favourable" },
      { c: 1, h: 66, p: 3, kind: "status", label: "Close status", value: "Day 4", delta: "On schedule", tone: "good" },
      {
        c: 3,
        h: 158,
        p: 0,
        kind: "waterfall",
        label: "Plan to actual bridge",
        colHeads: ["Plan", "Volume", "Price", "Mix", "Cost", "FX", "Actual"],
        series: [58, 14, -7, 11, -5, 9],
      },
      { c: 1, h: 158, p: 1, kind: "gauge", label: "Budget used", value: "68%", delta: "of $13.4M", target: 68 },
      {
        c: 4,
        h: 134,
        p: 2,
        kind: "matrix",
        label: "Variance by cost centre and month",
        unit: "K",
        rowHeads: ["Sales", "Marketing", "R&D", "G&A"],
        colHeads: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        cells: [
          [82, 64, 48, 71, 36, 58],
          [44, 78, 62, 30, 66, 41],
          [56, 38, 88, 52, 74, 60],
          [28, 51, 34, 66, 42, 77],
        ],
      },
    ],
  },
  {
    id: "people-hr",
    name: "People analytics",
    desc: "Headcount, tenure and where attrition actually sits.",
    platforms: ["Power BI", "Excel"],
    tiles: [
      {
        c: 4,
        h: 30,
        p: 0,
        kind: "slicer",
        label: "Department",
        items: [["All", 1], ["Engineering", 1], ["Sales", 1], ["Support", 1], ["G&A", 1]],
      },
      {
        c: 2,
        h: 74,
        p: 0,
        kind: "spark",
        label: "Headcount",
        value: "1,284",
        delta: "+22 this month",
        series: [60, 62, 64, 63, 66, 68, 70, 69, 73, 76, 78, 82],
      },
      {
        c: 2,
        h: 74,
        p: 1,
        kind: "spark",
        label: "Attrition, rolling 12",
        value: "9.4%",
        delta: "-0.6pt",
        series: [80, 76, 74, 70, 72, 66, 64, 60, 58, 56, 52, 50],
      },
      { c: 2, h: 152, p: 0, kind: "area", label: "Joiners and leavers by month",
        colHeads: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"], series: [40, 52, 46, 61, 55, 70, 64, 78] },
      { c: 2, h: 152, p: 1, kind: "donut", label: "Tenure mix",
        legend: ["Under 1 year", "1 to 3 years", "Over 3 years"], value: "46%" },
      {
        c: 4,
        h: 134,
        p: 2,
        kind: "matrix",
        label: "Attrition by function and quarter",
        unit: "%",
        rowHeads: ["Engineering", "Sales", "Support", "G&A"],
        colHeads: ["Q1", "Q2", "Q3", "Q4"],
        cells: [
          [34, 41, 28, 36],
          [72, 66, 81, 74],
          [55, 62, 48, 58],
          [22, 30, 26, 19],
        ],
      },
    ],
  },
  {
    id: "plant-ops",
    name: "Plant operations",
    desc: "Yield by line and shift, with the hourly picture underneath.",
    platforms: ["Power BI", "Tableau"],
    tiles: [
      {
        c: 4,
        h: 30,
        p: 0,
        kind: "slicer",
        label: "Plant",
        items: [["All", 1], ["Springfield", 1], ["Naperville", 1], ["Aurora", 1]],
      },
      { c: 1, h: 72, p: 0, kind: "status", label: "Line 1", value: "Running", delta: "98.2% yield", tone: "good" },
      { c: 1, h: 72, p: 1, kind: "status", label: "Line 2", value: "Slow", delta: "91.4% yield", tone: "warn" },
      { c: 1, h: 72, p: 2, kind: "status", label: "Line 3", value: "Stopped", delta: "changeover", tone: "bad" },
      { c: 1, h: 86, p: 3, kind: "kpi", label: "Output today", value: "18,204", delta: "+3.1%" },
      { c: 1, h: 152, p: 0, kind: "gauge", label: "OEE", value: "84%", delta: "target 88%", target: 84 },
      {
        c: 3,
        h: 152,
        p: 1,
        kind: "combo",
        label: "Output and scrap rate by hour",
        colHeads: ["06", "08", "10", "12", "14", "16", "18", "20"],
        legend: ["Output", "Scrap rate"],
        series: [62, 71, 55, 88, 74, 93, 81, 69],
        series2: [40, 34, 52, 28, 44, 22, 36, 48],
      },
      {
        c: 4,
        h: 134,
        p: 2,
        kind: "matrix",
        label: "Yield by line and shift",
        unit: "%",
        rowHeads: ["Line 1", "Line 2", "Line 3", "Line 4"],
        colHeads: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        cells: [
          [88, 92, 85, 90, 94, 76],
          [72, 68, 80, 74, 66, 58],
          [54, 61, 48, 66, 52, 40],
          [90, 86, 92, 88, 84, 80],
        ],
      },
    ],
  },
  {
    id: "web-analytics",
    name: "Website analytics",
    desc: "Sessions against last year, where they came from, what they opened.",
    platforms: ["Web", "Power BI"],
    tiles: [
      {
        c: 4,
        h: 36,
        p: 0,
        kind: "daterange",
        label: "Date range",
        items: [["28 days", 1], ["7 days", 1], ["90 days", 1], ["12 months", 1]],
      },
      {
        c: 1,
        h: 86,
        p: 0,
        kind: "spark",
        label: "Sessions",
        value: "128K",
        delta: "+11.4%",
        series: [48, 52, 44, 61, 58, 72, 66, 78, 74, 88],
      },
      {
        c: 1,
        h: 86,
        p: 1,
        kind: "spark",
        label: "Users",
        value: "94K",
        delta: "+8.1%",
        series: [40, 44, 42, 50, 54, 58, 56, 64, 68, 72],
      },
      { c: 1, h: 86, p: 2, kind: "kpi", label: "Bounce", value: "41%", delta: "-2.2pt" },
      { c: 1, h: 86, p: 3, kind: "kpi", label: "Avg. time", value: "2m 18s", delta: "+14s" },
      {
        c: 3,
        h: 152,
        p: 0,
        kind: "mline",
        label: "Sessions, this year and last",
        colHeads: ["Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 5", "Wk 6", "Wk 7", "Wk 8", "Wk 9", "Wk 10"],
        legend: ["This year", "Last year"],
        series: [44, 50, 46, 58, 62, 56, 70, 74, 68, 82],
        series2: [38, 41, 44, 46, 50, 52, 55, 58, 60, 64],
      },
      { c: 1, h: 152, p: 1, kind: "donut", label: "Device mix",
        legend: ["Desktop", "Mobile", "Tablet"], value: "58%" },
      {
        c: 2,
        h: 126,
        p: 2,
        kind: "treemap",
        label: "Traffic sources",
        items: [["Organic", 42], ["Direct", 24], ["Referral", 16], ["Social", 11], ["Paid", 7]],
      },
      {
        c: 2,
        h: 126,
        p: 3,
        kind: "hbar",
        label: "Top pages",
        unit: "K views",
        items: [["/pricing", 88], ["/docs", 66], ["/blog", 51], ["/changelog", 34]],
      },
    ],
  },
  {
    id: "portfolio",
    name: "Project portfolio",
    desc: "Every workstream, its state by month, and where the money went.",
    platforms: ["Power BI", "Excel"],
    tiles: [
      {
        c: 4,
        h: 30,
        p: 0,
        kind: "slicer",
        label: "Programme",
        items: [["All", 1], ["Platform", 1], ["Commercial", 1], ["Compliance", 1]],
      },
      { c: 1, h: 66, p: 0, kind: "status", label: "On track", value: "17", delta: "of 24", tone: "good" },
      { c: 1, h: 66, p: 1, kind: "status", label: "At risk", value: "5", delta: "review Friday", tone: "warn" },
      { c: 1, h: 66, p: 2, kind: "status", label: "Blocked", value: "2", delta: "needs decision", tone: "bad" },
      { c: 1, h: 66, p: 3, kind: "kpi", label: "Milestones", value: "38/54", delta: "this quarter" },
      {
        c: 3,
        h: 152,
        p: 0,
        kind: "matrix",
        label: "Status by workstream and month",
        unit: "% complete",
        rowHeads: ["Migration", "Billing", "Mobile", "Reporting"],
        colHeads: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        cells: [
          [88, 74, 62, 45, 30, 22],
          [40, 55, 68, 72, 80, 86],
          [66, 58, 44, 52, 61, 70],
          [24, 33, 48, 60, 55, 68],
        ],
      },
      { c: 1, h: 152, p: 1, kind: "gauge", label: "Budget used", value: "68%", delta: "of $2.4M", target: 68 },
      {
        c: 4,
        h: 122,
        p: 2,
        kind: "hbar",
        label: "Spend by project",
        unit: "K",
        items: [["Migration", 92], ["Billing", 71], ["Mobile", 54], ["Reporting", 38], ["Data", 26]],
      },
    ],
  },
];
