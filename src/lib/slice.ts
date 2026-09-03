/**
 * Canned slicer states.
 *
 * The previews carry invented numbers, so there is no data model to filter. But
 * a slicer that does nothing teaches the wrong thing about a layout, since the
 * whole point of one is that it changes what the rest of the page shows. So
 * picking an option runs every figure on the page through a deterministic
 * shift: same option, same numbers, every time and on every machine.
 *
 * It is a demonstration, not an analysis. The shapes move the way a real filter
 * moves them, the totals fall when you narrow the selection, and nothing claims
 * to be a fact.
 */

/** A small deterministic hash. Same inputs, same output, no state. */
function noise(seed: number, i: number) {
  const n = Math.sin(seed * 127.1 + i * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

/** Selecting "All" is index 0 and never changes anything. */
export const isAll = (slice: number) => slice === 0;

/**
 * How much a selection takes off a total. Narrowing to one member of a slicer
 * shows less than the whole, so every option scales down, by a different amount
 * each, rather than by the same token 20%.
 */
function scaleFor(slice: number) {
  if (isAll(slice)) return 1;
  return 0.42 + noise(slice, 0) * 0.4;
}

/** Reshapes a series for the given selection, keeping it inside 0 to 100. */
export function sliceSeries(series: number[], slice: number, key: number): number[] {
  if (isAll(slice)) return series;
  const scale = scaleFor(slice);
  return series.map((v, i) => {
    const wobble = 0.72 + noise(slice * 31 + key, i) * 0.62;
    return Math.max(4, Math.min(100, v * scale * wobble));
  });
}

/** The same, for the nested arrays a stacked column uses. */
export function sliceParts(parts: number[][], slice: number, key: number): number[][] {
  if (isAll(slice)) return parts;
  return parts.map((col, i) => sliceSeries(col, slice, key * 17 + i));
}

/** The same, for labelled items in a treemap or a ranked bar. */
export function sliceItems(
  items: [string, number][],
  slice: number,
  key: number,
): [string, number][] {
  if (isAll(slice)) return items;
  const next = items.map(
    ([name, v], i) => [name, sliceSeries([v], slice, key * 13 + i)[0]] as [string, number],
  );
  // A ranked chart that keeps its order under every filter looks fake, and the
  // reordering is most of what a slicer visibly does to one.
  return next.sort((a, b) => b[1] - a[1]);
}

/** The same, for a matrix of cells. */
export function sliceCells(cells: number[][], slice: number, key: number): number[][] {
  if (isAll(slice)) return cells;
  return cells.map((row, i) => sliceSeries(row, slice, key * 23 + i));
}

/** The same, for scatter points. Position moves, weight moves with it. */
export function slicePoints(
  points: [number, number, number][],
  slice: number,
  key: number,
): [number, number, number][] {
  if (isAll(slice)) return points;
  return points.map(([x, y, r], i) => {
    const jx = (noise(slice * 7 + key, i) - 0.5) * 22;
    const jy = (noise(slice * 11 + key, i + 50) - 0.5) * 22;
    return [
      Math.max(10, Math.min(90, x + jx)),
      Math.max(14, Math.min(86, y + jy)),
      Math.max(12, Math.min(100, r * (0.55 + noise(slice, i) * 0.6))),
    ];
  });
}

/**
 * Rescales a formatted figure while keeping how it was written.
 *
 * "$1.24M" stays a dollar amount to two places, "8,412" keeps its separator,
 * "2.6%" stays a percentage. Anything with no number in it, like "On plan", is
 * left exactly as it is, because scaling a word is meaningless.
 */
export function sliceValue(value: string | undefined, slice: number, key: number): string {
  if (!value || isAll(slice)) return value ?? "";

  const match = /^([^\d-]*)(-?[\d,]+(?:\.\d+)?)(.*)$/.exec(value);
  if (!match) return value;

  const [, prefix, digits, suffix] = match;
  const decimals = digits.includes(".") ? digits.split(".")[1].length : 0;
  const grouped = digits.includes(",");
  const n = Number(digits.replace(/,/g, ""));
  if (!Number.isFinite(n)) return value;

  // Percentages and rates do not shrink when you narrow the selection, they
  // move around. Only counts and amounts scale down.
  const rate = suffix.includes("%") || suffix.includes("pt");
  const next = rate
    ? n * (0.86 + noise(slice + key, 3) * 0.3)
    : n * scaleFor(slice) * (0.86 + noise(slice + key, 7) * 0.28);

  const shown = next.toFixed(decimals);
  return `${prefix}${grouped ? Number(shown).toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }) : shown}${suffix}`;
}
