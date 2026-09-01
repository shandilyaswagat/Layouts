import { useCallback, useEffect, useState } from "react";

/**
 * Two pages, so a hand rolled router rather than a dependency. Real paths
 * rather than hashes, because the design's in page anchors already use the
 * hash. Needs the SPA rewrite in vercel.json to survive a hard refresh.
 */
export function useRouter(initialPath?: string) {
  const [path, setPath] = useState(
    () =>
      initialPath ?? (typeof window === "undefined" ? "/" : window.location.pathname),
  );

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = useCallback(
    (to: string) => {
      const [target, hash] = to.split("#");
      const nextPath = target || "/";
      const samePage = nextPath === window.location.pathname;

      if (!samePage) {
        window.history.pushState({}, "", to);
        setPath(nextPath);
      } else if (hash) {
        window.history.replaceState({}, "", to);
      }

      // Let the new page paint before looking for the anchor.
      requestAnimationFrame(() => {
        if (hash) document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
        else if (!samePage) window.scrollTo(0, 0);
      });
    },
    [],
  );

  return { path, navigate };
}
