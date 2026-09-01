import { useCallback, useEffect, useState } from "react";

const THEME_KEY = "gl-theme";
const ACCENT_KEY = "gl-accent";

/** null is the default Steel blue, which needs no attribute. */
export const ACCENTS: { id: string | null; name: string }[] = [
  { id: null, name: "Steel blue" },
  { id: "talvios", name: "Talvios burgundy" },
  { id: "evergreen", name: "Muted evergreen" },
  { id: "plum", name: "Dusty plum" },
  { id: "terracotta", name: "Terracotta" },
];

function save(key: string, value: string | null) {
  try {
    if (value) localStorage.setItem(key, value);
    else localStorage.removeItem(key);
  } catch {
    /* private mode, nothing to do */
  }
}

/**
 * Ground and accent are separate. Light and dark set the ground; the accent
 * cycles through the options above and applies on either ground.
 */
export function useTheme() {
  const [dark, setDark] = useState(false);
  const [accent, setAccent] = useState(0);

  useEffect(() => {
    const root = document.documentElement;
    setDark(root.getAttribute("data-theme") === "dark");
    const current = root.getAttribute("data-accent");
    const i = ACCENTS.findIndex((a) => a.id === current);
    setAccent(i === -1 ? 0 : i);
  }, []);

  const toggle = useCallback(() => {
    const root = document.documentElement;
    const isDark = root.getAttribute("data-theme") === "dark";
    if (isDark) root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", "dark");
    save(THEME_KEY, isDark ? "light" : "dark");
    setDark(!isDark);
  }, []);

  /** Steps to the next accent and reports its name, for the toast. */
  const cycleAccent = useCallback(() => {
    const root = document.documentElement;
    const current = root.getAttribute("data-accent");
    const at = ACCENTS.findIndex((a) => a.id === current);
    const next = ACCENTS[((at === -1 ? 0 : at) + 1) % ACCENTS.length];

    if (next.id) root.setAttribute("data-accent", next.id);
    else root.removeAttribute("data-accent");
    save(ACCENT_KEY, next.id);
    setAccent(ACCENTS.indexOf(next));
    return next.name;
  }, []);

  return { dark, accent, accentName: ACCENTS[accent].name, toggle, cycleAccent };
}
