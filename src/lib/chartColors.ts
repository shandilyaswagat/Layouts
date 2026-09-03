import type { Palette } from "../data/palettes";

/**
 * How a chart hands colour to its marks.
 *
 * The old previews used one palette colour per tile and then faded the bars by
 * value, which encoded magnitude twice, once in the height and again in the
 * opacity, and left most of the palette unused. Colour now follows the job the
 * data is doing, which is the only thing that decides it.
 *
 *  single    one series, so one colour at full strength. Months, hours, a
 *            trend line. Nothing is being compared by hue.
 *  category  separate things sitting side by side, regions or channels. Each
 *            gets its own hue, handed out in the palette's validated order.
 *  ramp      one quantity ordered from most to least, a funnel or a ranked
 *            bar. One hue, light to dark, because the thing varying is amount
 *            and not identity.
 */
export type Encoding = "single" | "category" | "ramp";

const clamp = (n: number) => Math.min(255, Math.max(0, Math.round(n)));

function toRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.replace(/./g, (c) => c + c) : h;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

const toHex = (rgb: number[]) =>
  `#${rgb.map((v) => clamp(v).toString(16).padStart(2, "0")).join("")}`;

/** Mixes towards a target colour. t of 0 keeps the source, 1 returns the target. */
function mix(hex: string, target: string, t: number) {
  const a = toRgb(hex);
  const b = toRgb(target);
  return toHex(a.map((v, i) => v + (b[i] - v) * t));
}

/**
 * The colours a palette may give to marks on the current ground, in the order
 * they are handed out. Validated for separation, so the first two series of any
 * chart are always the furthest apart the palette allows.
 */
export function seriesColors(palette: Palette, dark: boolean): string[] {
  const idx = dark ? palette.seriesDark : palette.seriesLight;
  return idx.map((i) => palette.colors[i]);
}

const srgb = (v: number) => {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

function luminance(hex: string) {
  const [r, g, b] = toRgb(hex).map(srgb);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio between two colours. */
function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** The floor a filled mark has to clear against the surface behind it. */
const MARK_CONTRAST = 3;

/**
 * A sequential ramp of one hue for n ordered steps, strongest first.
 *
 * Built by fading the lead colour towards the ground rather than by dropping
 * opacity, so every step is a solid fill. The important part is where it stops:
 * the fade is walked back until the palest step still clears 3:1 against the
 * ground it sits on. Fading a fixed distance instead is what produced funnels
 * whose last two stages were invisible, on white and on the dark card alike.
 */
export function rampColors(palette: Palette, dark: boolean, n: number): string[] {
  const ground = dark ? "#1e1e1e" : "#ffffff";
  // The palette's signature hue, at the end of its range furthest from the
  // ground so the ramp has room to travel. On white it starts at full strength.
  // On the dark card it starts as a light tint of the same hue, because a ramp
  // there has to run bright to dim. Taking the pale tint instead would be
  // lighter still, but that colour is nearly neutral, and fading a neutral
  // gives a grey ramp with the palette nowhere in it.
  const hue = palette.colors[1];
  const base = dark ? mix(hue, "#ffffff", 0.7) : hue;
  if (n <= 1) return [base];

  let far = 0;
  for (let t = 0.05; t <= 0.8; t += 0.05) {
    if (contrast(mix(base, ground, t), ground) < MARK_CONTRAST) break;
    far = t;
  }

  return Array.from({ length: n }, (_, i) => mix(base, ground, (i / (n - 1)) * far));
}

/**
 * Colour for every mark in a chart, given how many marks there are.
 *
 * A category chart that asks for more series than the palette can separate
 * falls back to a ramp. Inventing a hue or cycling back to the first one both
 * break the rule that colour identifies a thing, so neither is an option.
 */
export function marksFor(
  palette: Palette,
  dark: boolean,
  enc: Encoding,
  count: number,
): string[] {
  const series = seriesColors(palette, dark);

  if (enc === "single") return Array.from({ length: count }, () => series[0]);
  if (enc === "ramp") return rampColors(palette, dark, count);

  if (count <= series.length) return series.slice(0, count);
  return rampColors(palette, dark, count);
}

/** The accent a non chart tile uses, taken from the same validated order. */
export function tileColor(palette: Palette, dark: boolean, slot: number): string {
  const series = seriesColors(palette, dark);
  return series[slot % series.length];
}
