import { useEffect } from "react";
import { SITE_URL, metaFor } from "../data/seo";

function upsert(selector: string, attrs: Record<string, string>) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement(selector.startsWith("link") ? "link" : "meta");
    document.head.appendChild(el);
  }
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
}

/**
 * Keeps title, description and canonical in step as you navigate. Crawlers that
 * run scripts pick this up; the ones that do not are served the prerendered
 * HTML, which carries the same values.
 */
export function useDocumentMeta(path: string) {
  useEffect(() => {
    const meta = metaFor(path);
    const url = `${SITE_URL}${path === "/" ? "" : path}`;

    document.title = meta.title;
    upsert('meta[name="description"]', { name: "description", content: meta.description });
    upsert('link[rel="canonical"]', { rel: "canonical", href: url });
    upsert('meta[property="og:title"]', { property: "og:title", content: meta.title });
    upsert('meta[property="og:description"]', {
      property: "og:description",
      content: meta.description,
    });
    upsert('meta[property="og:url"]', { property: "og:url", content: url });
  }, [path]);
}
