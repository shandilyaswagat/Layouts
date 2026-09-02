import { LAYOUTS } from "./layouts";

/**
 * Production origin, used for canonical URLs, Open Graph and the sitemap.
 * These are absolute, so if this does not match the domain the site is served
 * from, canonicals point somewhere that does not exist and social previews
 * fail. Update it if the domain ever changes.
 */
export const SITE_URL = "https://layoutss.vercel.app";

export const SITE_NAME = "Layoutss";

export type Meta = {
  path: string;
  title: string;
  description: string;
  /** Short label for this page in a breadcrumb trail. Home needs none. */
  crumb?: string;
};

const BASE: Meta[] = [
  {
    path: "/",
    title: "Layoutss · Dashboard layouts, mockups and palettes",
    description:
      "A free library of dashboard layouts and palettes with copy-ready hex codes. Build in Power BI, Tableau, Excel or on the web without starting from a blank canvas.",
  },
  {
    path: "/layouts",
    crumb: "Layouts",
    title: "Dashboard layouts library · Layoutss",
    description:
      "Every grid in the library, with spacing and tile sizes worked out. Filter by Power BI, Tableau, Excel or web, and preview each one in six palettes.",
  },
  {
    path: "/ai-assist",
    crumb: "AI assist",
    title: "AI assist, coming soon · Layoutss",
    description:
      "Describe what you are measuring and who reads it. The assistant picks a layout, suggests a palette and explains which chart belongs in each slot.",
  },
  {
    path: "/about",
    crumb: "About",
    title: "About Layoutss and Talvios",
    description:
      "Layoutss is a free dashboard design library made by Talvios, a one-person project building practical tools. No account, no tracking, nothing to pay for.",
  },
];

/** One entry per layout, so each detail page is indexable on its own terms. */
const DETAIL: Meta[] = LAYOUTS.map((l) => ({
  path: `/layouts/${l.id}`,
  crumb: l.name,
  title: `${l.name} dashboard layout · Layoutss`,
  description: `${l.desc} A ready made ${l.name.toLowerCase()} grid for ${l.platforms.join(
    " and ",
  )}, with spacing, tile sizes and six palettes to preview it in.`,
}));

export const ROUTES: Meta[] = [...BASE, ...DETAIL];

/** Minimal layout list for the ItemList on the library page. */
export const LAYOUT_ITEMS = LAYOUTS.map((l) => ({
  id: l.id,
  name: l.name,
  desc: l.desc,
}));

/** Author, used in structured data and the author meta tag. */
export const AUTHOR = {
  name: "Swagat Shandilya",
  url: "https://swagatshandilya.vercel.app/",
};

const FALLBACK: Meta = {
  path: "/404",
  title: "Page not found · Layoutss",
  description: "That link does not point at anything in the library.",
};

export function metaFor(path: string): Meta {
  return ROUTES.find((r) => r.path === path) ?? FALLBACK;
}
