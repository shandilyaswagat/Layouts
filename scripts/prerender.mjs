/**
 * Renders every known route to static HTML after the client build.
 *
 * A single page app serves crawlers an empty document. Search engines that run
 * scripts usually cope; social scrapers never do. This writes a real HTML file
 * per route, with that route's title, description, canonical and Open Graph
 * tags already in the markup, so both see the same thing.
 *
 * React still takes over on load, so behaviour is unchanged.
 */
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const dist = "dist";
const server = join(dist, "server", "entry-server.js");

const { render, ROUTES, SITE_URL, SITE_NAME, LAYOUT_ITEMS, AUTHOR } = await import(
  new URL(`../${server}`, import.meta.url).href
);

const template = await readFile(join(dist, "index.html"), "utf8");

const escape = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const abs = (path) => `${SITE_URL}${path === "/" ? "" : path}`;

/**
 * A breadcrumb trail from the home page down to this one. Search results show
 * it in place of the raw URL, so a detail page reads as part of the library
 * rather than as a loose page.
 */
const breadcrumb = (meta, url) => {
  if (meta.path === "/") return null;

  const trail = [{ name: "Home", item: SITE_URL }];
  if (meta.path.startsWith("/layouts/")) {
    const parent = ROUTES.find((r) => r.path === "/layouts");
    trail.push({ name: parent.crumb, item: abs(parent.path) });
  }
  trail.push({ name: meta.crumb ?? meta.title, item: url });

  return {
    "@type": "BreadcrumbList",
    "@id": `${url}#crumbs`,
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: t.item,
    })),
  };
};

const jsonLd = (meta, url) => {
  const image = `${SITE_URL}/og.png`;
  const isLibrary = meta.path === "/layouts";

  const page = {
    "@type": isLibrary ? "CollectionPage" : "WebPage",
    "@id": `${url}#page`,
    url,
    name: meta.title,
    description: meta.description,
    inLanguage: "en",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    primaryImageOfPage: { "@id": `${SITE_URL}/#ogimage` },
  };

  // The library page lists what it holds, so the six layouts can surface as
  // individual results rather than only the page that contains them.
  if (isLibrary) {
    page.mainEntity = {
      "@type": "ItemList",
      numberOfItems: LAYOUT_ITEMS.length,
      itemListElement: LAYOUT_ITEMS.map((l, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `${l.name} dashboard layout`,
        description: l.desc,
        url: abs(`/layouts/${l.id}`),
      })),
    };
  }

  const graph = [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: ROUTES[0].description,
      inLanguage: "en",
      publisher: { "@id": `${SITE_URL}/#org` },
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#org`,
      name: "Talvios",
      url: SITE_URL,
      logo: { "@id": `${SITE_URL}/#logo` },
      founder: { "@type": "Person", name: AUTHOR.name, url: AUTHOR.url },
      sameAs: [AUTHOR.url],
    },
    {
      "@type": "ImageObject",
      "@id": `${SITE_URL}/#logo`,
      url: `${SITE_URL}/icon-512.png`,
      width: 512,
      height: 512,
    },
    {
      "@type": "ImageObject",
      "@id": `${SITE_URL}/#ogimage`,
      url: image,
      width: 1200,
      height: 630,
    },
    page,
  ];

  const crumbs = breadcrumb(meta, url);
  if (crumbs) graph.push(crumbs);

  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
};

let written = 0;

for (const meta of ROUTES) {
  const url = `${SITE_URL}${meta.path === "/" ? "" : meta.path}`;
  const body = render(meta.path);

  const head = [
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    // og:image must come before its own structured properties. A parser
    // attaches width, height and alt to the last image it has seen, so
    // listing them first orphans them. iMessage drops the card entirely.
    `<meta property="og:image" content="${SITE_URL}/og.png" />`,
    `<meta property="og:image:type" content="image/png" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${escape(meta.title)}" />`,
    `<meta name="twitter:image" content="${SITE_URL}/og.png" />`,
    `<script type="application/ld+json">${jsonLd(meta, url)}</script>`,
  ].join("\n    ");

  const html = template
    .replace(/[ \t]*<meta\s+(?:property|name)="(?:og|twitter):image[^"]*"[^>]*\/>\n/g, "")
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(meta.title)}</title>`)
    .replace(
      /<meta\s+name="description"[\s\S]*?\/>/,
      `<meta name="description" content="${escape(meta.description)}" />`,
    )
    .replace(
      /<meta\s+property="og:title"[\s\S]*?\/>/,
      `<meta property="og:title" content="${escape(meta.title)}" />`,
    )
    .replace(
      /<meta\s+property="og:description"[\s\S]*?\/>/,
      `<meta property="og:description" content="${escape(meta.description)}" />`,
    )
    .replace("<!--app-head-->", head)
    .replace("<!--app-html-->", body);

  const out =
    meta.path === "/" ? join(dist, "index.html") : join(dist, meta.path, "index.html");
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, html);
  written += 1;
}

// A real 404 page at the output root. Vercel serves this with a 404 status for
// any path that is not a prerendered file, so a mistyped URL stops answering
//200 with the home page markup, which reads to a crawler as a duplicate.
{
  const meta = { path: "/404", title: "Page not found \u00b7 Layoutss", description: "That link does not point at anything in the library.", crumb: "Not found" };
  const html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(meta.title)}</title>`)
    .replace(
      /<meta\s+name="description"[\s\S]*?\/>/,
      `<meta name="description" content="${escape(meta.description)}" />`,
    )
    .replace(
      /<meta\s+name="robots"[\s\S]*?\/>/,
      `<meta name="robots" content="noindex, follow" />`,
    )
    .replace("<!--app-head-->", "")
    .replace("<!--app-html-->", render("/404"));
  await writeFile(join(dist, "404.html"), html);
}

// The sitemap and robots file, generated from the same route list.
const lastmod = new Date().toISOString().slice(0, 10);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ROUTES.map((r) => {
  const url = abs(r.path);
  const priority = r.path === "/" ? "1.0" : r.path === "/layouts" ? "0.9" : "0.7";
  return [
    "  <url>",
    `    <loc>${url}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    "    <changefreq>weekly</changefreq>",
    `    <priority>${priority}</priority>`,
    "  </url>",
  ].join("\n");
}).join("\n")}
</urlset>
`;

await writeFile(join(dist, "sitemap.xml"), sitemap);
await writeFile(
  join(dist, "robots.txt"),
  `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
);

await rm(join(dist, "server"), { recursive: true, force: true });

console.log(`prerendered ${written} routes, wrote sitemap.xml and robots.txt`);
