import { renderToString } from "react-dom/server";
import App from "./App";

export { ROUTES, SITE_URL, SITE_NAME } from "./data/seo";

/** Renders one route to static HTML for the prerender step. */
export function render(path: string) {
  return renderToString(<App initialPath={path} />);
}
