/** Color schemes and mixing strategies for multi-calendar events. */

/* ------------------------------------------------------------------ */
/*  RGB helpers                                                        */
/* ------------------------------------------------------------------ */

type RGB = [number, number, number];

function hexToRgb(hex: string): RGB {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function rgbToHex([r, g, b]: RGB): string {
  const c = (v: number) =>
    Math.round(Math.max(0, Math.min(255, v)))
      .toString(16)
      .padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`;
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

/* ------------------------------------------------------------------ */
/*  OKLCH helpers (approximate, no external deps)                      */
/* ------------------------------------------------------------------ */

function srgbToLinear(c: number): number {
  c /= 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function linearToSrgb(c: number): number {
  c = clamp01(c);
  return (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055) * 255;
}

function rgbToOklab([r, g, b]: RGB): [number, number, number] {
  const lr = srgbToLinear(r);
  const lg = srgbToLinear(g);
  const lb = srgbToLinear(b);

  const l_ = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m_ = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s_ = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);

  return [
    0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
    1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
    0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_,
  ];
}

function oklabToRgb([L, a, b]: [number, number, number]): RGB {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  return [
    linearToSrgb(+4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    linearToSrgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    linearToSrgb(-0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s),
  ];
}

/* ------------------------------------------------------------------ */
/*  Mixing functions                                                   */
/* ------------------------------------------------------------------ */

function mixAdditive(colors: RGB[]): RGB {
  const n = colors.length;
  const avg: RGB = [0, 0, 0];
  for (const c of colors) {
    avg[0] += c[0];
    avg[1] += c[1];
    avg[2] += c[2];
  }
  avg[0] /= n;
  avg[1] /= n;
  avg[2] /= n;

  /* boost saturation: push away from gray */
  const gray = (avg[0] + avg[1] + avg[2]) / 3;
  const boost = 1.4;
  return [
    gray + (avg[0] - gray) * boost,
    gray + (avg[1] - gray) * boost,
    gray + (avg[2] - gray) * boost,
  ];
}

function mixSubtractive(colors: RGB[]): RGB {
  /* multiply in [0,1] space — simulates overlapping filters/pigments */
  let r = 1, g = 1, b = 1;
  for (const c of colors) {
    r *= c[0] / 255;
    g *= c[1] / 255;
    b *= c[2] / 255;
  }
  /* lighten to keep visible */
  const lift = 0.3;
  return [
    (r + lift * (1 - r)) * 255,
    (g + lift * (1 - g)) * 255,
    (b + lift * (1 - b)) * 255,
  ];
}

function mixOklch(colors: RGB[]): RGB {
  const labs = colors.map(rgbToOklab);
  const n = labs.length;

  let L = 0;
  let sinH = 0, cosH = 0;
  let C = 0;

  for (const [l, a, b] of labs) {
    L += l;
    const c = Math.sqrt(a * a + b * b);
    const h = Math.atan2(b, a);
    C += c;
    sinH += Math.sin(h);
    cosH += Math.cos(h);
  }

  L /= n;
  C /= n;
  const avgH = Math.atan2(sinH / n, cosH / n);

  const a = C * Math.cos(avgH);
  const b = C * Math.sin(avgH);

  return oklabToRgb([L, a, b]);
}

/* ------------------------------------------------------------------ */
/*  Scheme definitions                                                 */
/* ------------------------------------------------------------------ */

export interface ColorScheme {
  name: string;
  label: string;
  baseColors: [string, string, string, string];
  mix: (hexColors: string[]) => string;
}

function makeMixer(
  fn: (colors: RGB[]) => RGB,
): (hexColors: string[]) => string {
  return (hexColors) => {
    if (hexColors.length === 1) return hexColors[0];
    return rgbToHex(fn(hexColors.map(hexToRgb)));
  };
}

export const COLOR_SCHEMES: Record<string, ColorScheme> = {
  colorblind: {
    name: "colorblind",
    label: "Colorblind-safe (Tol)",
    baseColors: ["#0077BB", "#EE7733", "#CC3399", "#009988"],
    mix: makeMixer(mixOklch),
  },
  additive: {
    name: "additive",
    label: "Additive (light)",
    baseColors: ["#E03030", "#30B040", "#3060E0", "#E0A020"],
    mix: makeMixer(mixAdditive),
  },
  subtractive: {
    name: "subtractive",
    label: "Subtractive (paint)",
    baseColors: ["#00AACC", "#CC00AA", "#AACC00", "#888888"],
    mix: makeMixer(mixSubtractive),
  },
  oklch: {
    name: "oklch",
    label: "Perceptual (OKLCH)",
    baseColors: ["#E05060", "#4098E0", "#40C070", "#B060D0"],
    mix: makeMixer(mixOklch),
  },
};

export const DEFAULT_SCHEME = "colorblind";

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

export function getScheme(name?: string): ColorScheme {
  return COLOR_SCHEMES[name || DEFAULT_SCHEME] || COLOR_SCHEMES[DEFAULT_SCHEME];
}

/** Get the base color for calendar at index i in the given scheme. */
export function calendarColor(
  index: number,
  scheme: ColorScheme,
): string {
  return scheme.baseColors[index % scheme.baseColors.length];
}

/** Get the mixed color for an event spanning multiple calendars. */
export function eventColor(
  calendarIds: string[],
  calendarOrder: string[],
  scheme: ColorScheme,
): string {
  const colors = calendarIds
    .map((id) => calendarOrder.indexOf(id))
    .filter((i) => i >= 0)
    .map((i) => calendarColor(i, scheme));
  if (colors.length === 0) return "#888";
  return scheme.mix(colors);
}

/**
 * Generate all combinations for a visual sampler.
 * Returns array of { label, calendarIds, color }.
 */
export function allCombinations(
  calendarIds: string[],
  scheme: ColorScheme,
): Array<{ label: string; ids: string[]; color: string }> {
  const n = calendarIds.length;
  const results: Array<{ label: string; ids: string[]; color: string }> = [];
  const labels = ["A", "B", "C", "D"];

  for (let mask = 1; mask < 1 << n; mask++) {
    const ids: string[] = [];
    let label = "";
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        ids.push(calendarIds[i]);
        label += labels[i] || `${i}`;
      }
    }
    results.push({
      label,
      ids,
      color: eventColor(ids, calendarIds, scheme),
    });
  }

  return results;
}
