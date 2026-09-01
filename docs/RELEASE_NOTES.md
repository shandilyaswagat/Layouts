# Release notes

## v1.0.0 — 1 September 2026

The first build of Layoutss.

### What it does

Layoutss is a free library of dashboard designs. You pick a grid that matches
what you are building, preview it in any of six palettes, and copy the hex codes
straight into Power BI, Tableau, Excel or your own code. No account, nothing to
pay for.

### What is in this build

**Six layouts.** Revenue overview, Marketing funnel, Support queue, Fleet and
logistics, Ops control room, Finance close. Each one is a real grid with tile
sizes and spacing worked out, previewed as an actual dashboard with KPI cards,
charts and tables rather than coloured blocks.

**Six palettes.** Burgundy, Slate, Graphite, Clay, Moss and Ink. Six colours
each, ordered dark to light, contrast checked between series and against both
backgrounds. Click any swatch to copy it.

**Four platforms.** Power BI, Tableau, Excel and web. The library records what
each tool actually constrains: colour slot counts, installed fonts, layout
primitive and export format.

**Five accent themes.** Click the mark in the top left to cycle. Steel blue is
the default. Light and dark both supported, chosen explicitly rather than
following your operating system.

### What is not in this build

**AI assist.** The page exists and says coming soon. The plan is a few free runs
per visitor, then the option to bring your own API key, which stays in your
browser and never reaches the server.

**Accounts.** Nothing to sign in to yet. Sign in opens a coming soon dialog.

**No email capture.** The mailing list form was removed, so there is currently
no way to collect interest ahead of AI assist launching.

**Exports.** Palettes copy as hex. The Power BI theme JSON, Tableau `.tps` and
Excel `.thmx` files are not generated yet.

### Live at

<https://layoutss.vercel.app>

### Known issues

**White text on the accent button in dark mode falls below AA.** Every accent
lands between 2.5:1 and 4.2:1 for white on the Sign in button in dark mode,
under the 4.5:1 threshold. Dark accents are lightened for visibility against the
background, which is exactly what makes white sit badly on them. Fix is to use
the text token instead of white in dark mode.

**Mobile previews are thumbnails.** They keep the desktop proportions and stay
readable, but at 324px the tiles are small. A horizontally scrollable canvas at
a larger reference width is the likely next step.

### Numbers

| | |
|---|---|
| Bundle | 57.9 kB gzipped JS, 6.0 kB gzipped CSS |
| Dependencies | 2 (`react`, `react-dom`) |
| Routes | 5 |
| Third party scripts | None |
| Analytics | None |
| Prerendered routes | 10 |
