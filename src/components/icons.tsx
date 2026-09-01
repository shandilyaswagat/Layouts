/** Small stroke icons for the dock. Inline so there is no icon dependency. */
const base = {
  width: 19,
  height: 19,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const HomeIcon = () => (
  <svg {...base}><path d="M3 10.5 12 3.5l9 7" /><path d="M5.5 9.5V20h13V9.5" /></svg>
);

export const GridIcon = () => (
  <svg {...base}><rect x="3.5" y="3.5" width="7" height="7" rx="1.6" /><rect x="13.5" y="3.5" width="7" height="7" rx="1.6" /><rect x="3.5" y="13.5" width="7" height="7" rx="1.6" /><rect x="13.5" y="13.5" width="7" height="7" rx="1.6" /></svg>
);

export const SparkIcon = () => (
  <svg {...base}><path d="M12 3.5 13.7 9l5.5 1.7-5.5 1.7L12 18l-1.7-5.6L4.8 10.7 10.3 9 12 3.5Z" /></svg>
);

export const SunIcon = () => (
  <svg {...base}><circle cx="12" cy="12" r="4.2" /><path d="M12 2.4v2.2M12 19.4v2.2M2.4 12h2.2M19.4 12h2.2M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M18.8 5.2l-1.6 1.6M6.8 17.2l-1.6 1.6" /></svg>
);

export const MoonIcon = () => (
  <svg {...base}><path d="M20.5 14.6A8.6 8.6 0 0 1 9.4 3.5a8.6 8.6 0 1 0 11.1 11.1Z" /></svg>
);

export const InfoIcon = () => (
  <svg {...base}><circle cx="12" cy="12" r="8.6" /><path d="M12 11v5.2" /><path d="M12 7.9h.01" /></svg>
);
