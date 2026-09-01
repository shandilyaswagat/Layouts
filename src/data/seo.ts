import { LAYOUTS } from "./layouts";

/**
 * Production origin, used for canonical URLs, Open Graph and the sitemap.
 * CHANGE THIS before launch. Social scrapers need an absolute URL, so a wrong
 * value here means broken previews even though the site itself works.
 */
export const SITE_URL = "https://layouts.vercel.app";

export const SITE_NAME = "Layouts";

export type Meta = {
  path: string;
  title: string;
  description: string;
};

const BASE: Meta[] = [
  {
    path: "/",
    title: "Layouts · Dashboard layouts, mockups and palettes",
    description:
      "A free library of dashboard layouts and palettes with copy-ready hex codes. Build in Power BI, Tableau, Excel or on the web without starting from a blank canvas.",
  },
  {
    path: "/layouts",
    title: "Dashboard layouts library · Layouts",
    description:
      "Every grid in the library, with spacing and tile sizes worked out. Filter by Power BI, Tableau, Excel or web, and preview each one in six palettes.",
  },
  {
    path: "/ai-assist",
    title: "AI assist, coming soon · Layouts",
    description:
      "Describe what you are measuring and who reads it. The assistant picks a layout, suggests a palette and explains which chart belongs in each slot.",
  },
  {
    path: "/about",
    title: "About Layouts and Talvios",
    description:
      "Layouts is a free dashboard design library made by Talvios, a one-person project building practical tools. No account, no tracking, nothing to pay for.",
  },
];

/** One entry per layout, so each detail page is indexable on its own terms. */
const DETAIL: Meta[] = LAYOUTS.map((l) => ({
  path: `/layouts/${l.id}`,
  title: `${l.name} dashboard layout · Layouts`,
  description: `${l.desc} A ready made ${l.name.toLowerCase()} grid for ${l.platforms.join(
    " and ",
  )}, with spacing, tile sizes and six palettes to preview it in.`,
}));

export const ROUTES: Meta[] = [...BASE, ...DETAIL];

const FALLBACK: Meta = {
  path: "/404",
  title: "Page not found · Layouts",
  description: "That link does not point at anything in the library.",
};

export function metaFor(path: string): Meta {
  return ROUTES.find((r) => r.path === path) ?? FALLBACK;
}
