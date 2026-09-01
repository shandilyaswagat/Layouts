export type Platform = {
  id: "powerbi" | "tableau" | "excel" | "web";
  /** Label shown on the pill row. */
  name: string;
  /** How many series colours the platform actually accepts. */
  colours: string;
  /** Typefaces a person can rely on being installed. */
  fonts: string;
  /** The unit a layout is expressed in on this platform. */
  layout: string;
  /** What lands in the download. */
  export: string;
};

export const PLATFORMS: Platform[] = [
  {
    id: "powerbi",
    name: "Power BI",
    colours: "Eight or more, ordered, assigned by series index",
    fonts: "Segoe UI, DIN, Arial",
    layout: "Fixed canvas, visuals placed absolutely",
    export: "theme.json",
  },
  {
    id: "tableau",
    name: "Tableau",
    colours: "An ordered categorical list",
    fonts: "Tableau Book, Benton Sans",
    layout: "Tiled and floating containers",
    export: ".tps preferences",
  },
  {
    id: "excel",
    name: "Excel",
    colours: "Exactly six accents, no more",
    fonts: "Aptos, Calibri",
    layout: "Cell grid and merged ranges",
    export: ".thmx theme",
  },
  {
    id: "web",
    name: "Web / React",
    colours: "As many as the chart library allows",
    fonts: "Anything you can load",
    layout: "CSS grid",
    export: "CSS custom properties",
  },
];
