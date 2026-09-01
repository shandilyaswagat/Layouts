# Layoutss

<https://layoutss.vercel.app>

A free library of dashboard layouts, mockups and palettes with copy-ready hex
codes. Built for people who have to make a dashboard in Power BI, Tableau, Excel
or on the web and do not want to start from a blank canvas.

Made by [Talvios](https://github.com/shandilyaswagat).

---

## Running it

```bash
npm install
npm run dev
```

Opens on <http://localhost:5173>.

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Typecheck, build, then prerender every route to `dist/` |
| `npm run preview` | Serve the built output locally |

No environment variables, no database, no API keys. The whole thing is static.

---

## What's in the box

```
src/
├── main.tsx              mount
├── App.tsx               routing and shared state (modal, toast, palette)
├── styles.css            every style in the site, tokens first
├── components/           one file per section or piece
├── data/                 the content: layouts, palettes, platforms, products
└── lib/                  router, theme, media query, scroll reveal
```

There is no CSS framework and no component library. Styles are plain CSS driven
by custom properties, which is what makes theming a two-line change.

---

## The content model

Everything the site shows comes from four files in `src/data/`.

**`layouts.ts`** is the library. Each layout has a name, a description, the
platforms it suits, and a list of tiles. A tile carries its grid geometry
(`c` columns, optional `r` rows, `h` height, `p` palette index) and what it
stands for (`kind`, plus a label, value, series or rows). Adding a layout is
adding an object to that array.

**`palettes.ts`** is six palettes of six colours each, ordered dark to light.
The middle four of every palette are the originals from the earlier build.

**`platforms.ts`** carries the four supported tools and, for each, the facts an
adapter needs: how many colour slots it accepts, which fonts are installed, what
its layout primitive is, and what file it imports.

**`talvios.ts`** is the product list on the About page.

---

## Theming

Three things stack, and they are independent.

**Ground** is light or dark, stamped as `data-theme="dark"` on the root element.
There is no `prefers-color-scheme` handling: the design defaults to light and
only changes when someone asks. Stored as `gl-theme`.

**Accent** is one of five, stamped as `data-accent` on the root. Steel blue is
the default and needs no attribute. Stored as `gl-accent`. Clicking the brand
mark in the header cycles through them.

| Accent | Light | Dark |
|---|---|---|
| Steel blue (default) | `#397baf` | `#72aad0` |
| Talvios burgundy | `#9a4058` | `#c05a73` |
| Muted evergreen | `#3f7657` | `#6ba783` |
| Dusty plum | `#76516b` | `#a77f99` |
| Terracotta | `#a35d45` | `#c98269` |

Each accent overrides only `--accent` and `--accent-soft`. The neutral palette
is Notion's and never moves, which is what keeps the swaps cheap.

**Palette** is the six-colour set applied to a layout preview. That is content,
not chrome, and has nothing to do with the site theme.

---

## Routing

Hand rolled, in `src/lib/router.ts`. Real paths rather than hashes, because the
design already uses the hash for in-page anchors.

| Path | Page |
|---|---|
| `/` | Home |
| `/layouts` | The full library, with platform filters |
| `/layouts/<id>` | One layout, full page |
| `/ai-assist` | Coming soon |
| `/about` | About Layoutss and Talvios |

`vercel.json` rewrites everything to `index.html`, so deep links survive a hard
refresh. Any static host needs the same rule.

Below 760px, opening a layout navigates to `/layouts/<id>`. Above it, the same
click opens a modal. Both render the identical preview.

---

## SEO and prerendering

A single page app serves crawlers an empty document. Search engines that run
scripts usually cope; social scrapers never do.

So `npm run build` has a third step. After the client build, Vite builds an SSR
bundle from `src/entry-server.tsx`, and `scripts/prerender.mjs` renders every
route in `src/data/seo.ts` to a real HTML file with that route's title,
description, canonical, Open Graph tags and JSON-LD already in the markup. It
also writes `sitemap.xml` and `robots.txt` from the same route list, then
deletes the SSR bundle.

React still takes over on load, so behaviour is identical. Ten routes are
prerendered: the four pages plus one per layout.

**`SITE_URL` in `src/data/seo.ts` must match the domain the site is served
from.** Canonical tags, Open Graph URLs and the sitemap are all absolute, so a
mismatch means canonicals pointing at a host that does not exist. It is set to
`https://layoutss.vercel.app`.

Adding a layout to `src/data/layouts.ts` automatically adds its detail page to
the prerender list and the sitemap. Nothing else to update.

---

## Gotchas

Real ones, each of which cost time.

**Inline styles beat media and container queries.** Setting
`grid-template-columns` inline meant the palette grid never collapsed on mobile
and the page overflowed sideways. Anything a breakpoint is responsible for must
live in CSS, not in a `style` prop.

**Buttons do not inherit colour.** An unstyled `<button>` falls back to the user
agent default, which is black, so KPI cards rendered black text on a dark card.
`button { color: inherit }` is set in the base layer.

**Class names are global.** `.soon` was the AI assist page section and also the
"More coming soon" pill, so the pill inherited 96px of padding and stretched
every sibling in its flex row. Prefix component classes.

**The preview scales, with floors.** Tile heights and font sizes are in `cqw`
against a 844px reference so proportions hold as the container narrows, but each
carries a `max(floor, ...)`. Without the floor, mobile previews became correct
and unreadable. On desktop no floor ever binds.

---

## Licence

MIT. See [LICENSE](LICENSE).
