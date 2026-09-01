export type PaletteKind = "sequential" | "categorical" | "corporate" | "dark mode";

export type Palette = {
  name: string;
  kind: PaletteKind;
  /** Six colours, dark anchor first through to a light tint. */
  colors: [string, string, string, string, string, string];
};

/**
 * The six palettes carried over from the earlier build. The middle four of
 * each row are the originals, unchanged. A dark anchor and a light tint were
 * added at either end so every palette reads as a full six step ramp, which is
 * what the palette cards and the layout previews are sized for.
 */
export const PALETTES: Palette[] = [
  {
    name: "Burgundy",
    kind: "categorical",
    colors: ["#5C1A22", "#9E1B2C", "#2B2644", "#4A7C7E", "#B08968", "#E3D5CB"],
  },
  {
    name: "Slate",
    kind: "sequential",
    colors: ["#12283F", "#1E3A5F", "#4F7A8C", "#7D9B76", "#C2836A", "#DCE5E8"],
  },
  {
    name: "Graphite",
    kind: "categorical",
    colors: ["#1C1C1F", "#2F2F33", "#6B6B73", "#9A5B4C", "#4D6B63", "#D9D8D6"],
  },
  {
    name: "Clay",
    kind: "categorical",
    colors: ["#6E3123", "#A14A34", "#7D7259", "#3C4F52", "#5C6B8A", "#E7DCD3"],
  },
  {
    name: "Moss",
    kind: "categorical",
    colors: ["#26381F", "#3D5A3F", "#7A8B5C", "#B5793F", "#46586B", "#DDE2D5"],
  },
  {
    name: "Ink",
    kind: "corporate",
    colors: ["#151A24", "#232B3A", "#55647D", "#8C6A4F", "#6B8F8A", "#D8DCE2"],
  },
];
