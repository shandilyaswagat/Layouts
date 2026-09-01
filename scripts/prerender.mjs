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

const { render, ROUTES, SITE_URL, SITE_NAME } = await import(
  new URL(`../${server}`, import.meta.url).href
);

const template = await readFile(join(dist, "index.html"), "utf8");

const escape = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const jsonLd = (meta, url) => {
  const graph = [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: ROUTES[0].description,
      publisher: { "@id": `${SITE_URL}/#org` },
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#org`,
      name: "Talvios",
      url: SITE_URL,
      founder: { "@type": "Person", name: "Swagat Shandilya" },
    },
    {
      "@type": "WebPage",
      "@id": `${url}#page`,
      url,
      name: meta.title,
      description: meta.description,
      isPartOf: { "@id": `${SITE_URL}/#website` },
    },
  ];
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
    `<script type="application/ld+json">${jsonLd(meta, url)}</script>`,
  ].join("\n    ");

  const html = template
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

// The sitemap and robots file, generated from the same route list.
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemap.org/schemas/sitemap/0.9">
${ROUTES.map((r) => {
  const url = `${SITE_URL}${r.path === "/" ? "" : r.path}`;
  return `  <url>\n    <loc>${url}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${r.path === "/" ? "1.0" : "0.7"}</priority>\n  </url>`;
}).join("\n")}
</urlset>
`.replace("www.sitemap.org", "www.sitemaps.org");

await writeFile(join(dist, "sitemap.xml"), sitemap);
await writeFile(
  join(dist, "robots.txt"),
  `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
);

await rm(join(dist, "server"), { recursive: true, force: true });

console.log(`prerendered ${written} routes, wrote sitemap.xml and robots.txt`);
