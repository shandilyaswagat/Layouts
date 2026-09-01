import { useEffect } from "react";

/**
 * Staggered scroll reveal, matching the canvas behaviour: siblings that also
 * reveal are delayed 80ms apart, and an observer shows each one as it enters.
 *
 * The elements are hidden by script rather than in the markup, and a timer
 * shows everything after 2.5s regardless, so a blocked observer can never
 * leave the page blank.
 */
export function useReveal(key?: string) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (!els.length) return;

    els.forEach((el) => {
      const sibs = Array.from(el.parentElement?.children ?? []).filter((n) =>
        (n as HTMLElement).classList?.contains("reveal"),
      );
      const i = Math.max(0, sibs.indexOf(el));
      el.classList.add("is-hidden");
      el.style.transitionDelay = `${i * 80}ms`;
    });

    const show = (el: HTMLElement) => el.classList.remove("is-hidden");

    let io: IntersectionObserver | undefined;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (e.isIntersecting) {
              show(e.target as HTMLElement);
              io?.unobserve(e.target);
            }
          }),
        { rootMargin: "0px 0px -8% 0px" },
      );
      els.forEach((el) => io?.observe(el));
    }

    const fallback = setTimeout(() => els.forEach(show), 2500);

    return () => {
      io?.disconnect();
      clearTimeout(fallback);
    };
  }, [key]);
}
