# Changelog

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the
project uses [semantic versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

Nothing yet.

## [1.0.0] - 2026-09-01

First public build. The site is feature complete for browsing; AI assist is
announced but not implemented.

### Added

- Home page: hero with an interactive dashboard mock, platform row, three
  featured layouts, three featured palettes, AI assist teaser, email capture.
- Layouts page at `/layouts` with all six layouts and platform filters.
- Layout detail page at `/layouts/<id>`, used on screens under 760px where the
  modal has too little room.
- Layout preview rendered as a real dashboard: KPI cards, bar and line charts,
  donuts, tables, filter rails, all with dummy values, framed in window chrome.
- Six palettes of six colours each, click any swatch to copy its hex.
- AI assist page at `/ai-assist`, marked coming soon.
- About page at `/about` covering Layouts and the rest of the Talvios shelf.
- Five accent themes cycled by clicking the brand mark: Steel blue (default),
  Talvios burgundy, Muted evergreen, Dusty plum, Terracotta.
- Light and dark grounds, chosen explicitly and stored per browser.
- Floating dock navigation on mobile, replacing the header nav below 760px.
- Hand rolled router with `vercel.json` rewrites for deep links.

### Added (post 1.0.0 build)

- Static prerendering of all ten routes at build time, using `react-dom/server`
  with no new dependencies. Each route ships real HTML with its own title,
  description, canonical, Open Graph tags and JSON-LD.
- Generated `sitemap.xml` and `robots.txt`, both driven by the same route list.
- Per-route document title and meta kept in step during client navigation.
- Sign in now opens a coming soon dialog rather than jumping to the email form.
- Portfolio link in the About page's Get in touch section.

### Changed

- Rebuilt the entire front end from the design canvas export. Dropped
  Tailwind, framer-motion and lucide-react in favour of plain CSS and inline
  SVG. Bundle went from 97.5 kB to 58 kB gzipped.
- Default accent is Steel blue rather than Notion azure. Notion azure measured
  3.88:1 on white and failed AA for normal text.
- Home shows three layouts and three palettes instead of all six, with view all
  links out to the full library.
- Mobile layout previews keep the desktop composition and scale down, rather
  than rearranging into a different dashboard.
- Removed the duplicate contact invitation from the About page maker section.

### Fixed

- Donut charts in the layout preview filled their tile edge to edge and drew in
  whichever single palette colour the tile index landed on, so a blue dashboard
  got one orange ring. They are now multi-segment, drawn from the middle of the
  palette, and inset from the tile edges.
- White text on the accent button fell below AA in dark mode for every accent,
  between 2.5:1 and 4.2:1. Dark accents are lightened to stand off the
  background, which is what made white sit badly on them. Now uses the ink token
  and measures 7.01:1.

- KPI values rendered black in dark mode. Buttons do not inherit `color`, so an
  unstyled button fell back to the user agent default.
- Palette grid did not collapse on mobile, overflowing the page sideways. The
  column count was an inline style, which beats the media query.
- Tool pills stretched into tall ovals. The `.soon` class was shared between the
  AI assist page and the "More coming soon" pill, so the pill inherited 96px of
  page padding and stretched its whole flex row.
- Preview tiles clipped their content at small widths once heights scaled below
  the type floor.
- Scroll reveal could leave content permanently invisible if the observer never
  fired. It now has a geometry check on mount, a shared scroll listener, and a
  timeout that reveals everything regardless.
- "← Home" and the COMING SOON tag collided on one line on the AI assist page.

[Unreleased]: https://github.com/shandilyaswagat/Layouts/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/shandilyaswagat/Layouts/releases/tag/v1.0.0
