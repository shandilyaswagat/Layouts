export type PaletteKind = "sequential" | "categorical" | "corporate" | "dark mode";

export type Palette = {
  name: string;
  kind: PaletteKind;
  /** Six colours, dark anchor first through to a light tint. */
  colors: [string, string, string, string, string, string];
  /**
   * Which colours may carry a chart series, in the order they get handed out.
   *
   * Two things decide this. A mark has to clear 3:1 against the surface it sits
   * on, which rules the dark anchors out on a dark card and the pale tint out
   * on a light one. Then, of the survivors, the order is the one that maximises
   * the perceptual distance between neighbouring series, measured in OKLab and
   * under simulated protanopia and deuteranopia.
   *
   * The first four are also chosen so that every one of them differs from every
   * other, not only from the colour next to it, since four bars sit side by
   * side and the eye compares all of them at once.
   *
   * Picked in ramp order these palettes fail badly: Slate had two neighbours
   * 3.1 apart under deuteranopia and 11.4 apart in normal vision, which is why
   * the charts read as one muddy colour.
   *
   * Worth knowing where the ceiling is. Slate, Graphite and Moss carry three
   * genuinely distinct chart hues and no more, so a fourth category is close to
   * one of the first three whatever order it goes in. On a dark ground it is
   * three for every palette but Slate, because the dark anchors fall under the
   * contrast floor against the card and drop out entirely.
   */
  seriesLight: number[];
  seriesDark: number[];
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
    seriesLight: [1, 4, 2, 3, 0],
    seriesDark: [3, 5, 4],
  },
  {
    name: "Slate",
    kind: "sequential",
    colors: ["#12283F", "#1E3A5F", "#4F7A8C", "#7D9B76", "#C2836A", "#DCE5E8"],
    seriesLight: [1, 3, 0, 2, 4],
    seriesDark: [2, 4, 5, 3],
  },
  {
    name: "Graphite",
    kind: "categorical",
    colors: ["#1C1C1F", "#2F2F33", "#6B6B73", "#9A5B4C", "#4D6B63", "#D9D8D6"],
    seriesLight: [1, 3, 0, 2, 4],
    seriesDark: [2, 5, 3],
  },
  {
    name: "Clay",
    kind: "categorical",
    colors: ["#6E3123", "#A14A34", "#7D7259", "#3C4F52", "#5C6B8A", "#E7DCD3"],
    seriesLight: [0, 1, 4, 3, 2],
    seriesDark: [2, 5, 4],
  },
  {
    name: "Moss",
    kind: "categorical",
    colors: ["#26381F", "#3D5A3F", "#7A8B5C", "#B5793F", "#46586B", "#DDE2D5"],
    seriesLight: [0, 4, 2, 1, 3],
    seriesDark: [2, 5, 3],
  },
  {
    name: "Ink",
    kind: "corporate",
    colors: ["#151A24", "#232B3A", "#55647D", "#8C6A4F", "#6B8F8A", "#D8DCE2"],
    seriesLight: [2, 4, 0, 3, 1],
    seriesDark: [3, 5, 4],
  },
];
