import { GridIcon, HomeIcon, InfoIcon, MoonIcon, SparkIcon, SunIcon } from "./icons";
import { useTheme } from "../lib/theme";

type Props = {
  path: string;
  navigate: (to: string) => void;
};

const ITEMS = [
  { label: "Home", to: "/", match: "/", Icon: HomeIcon },
  { label: "Layouts", to: "/layouts", match: "/layouts", Icon: GridIcon },
  { label: "AI assist", to: "/ai-assist", match: "/ai-assist", Icon: SparkIcon },
  { label: "About", to: "/about", match: "/about", Icon: InfoIcon },
];

/** Mobile only. The header nav is hidden below 760px and this takes over. */
export function BottomDock({ path, navigate }: Props) {
  const { dark, toggle } = useTheme();

  return (
    <nav className="dock" aria-label="Mobile">
      <div className="dock-inner">
        {ITEMS.map(({ label, to, match, Icon }) => (
          <button
            key={label}
            type="button"
            aria-label={label}
            aria-current={match && path === match ? "page" : undefined}
            className={`dock-item${match && path === match ? " is-active" : ""}`}
            onClick={() => navigate(to)}
          >
            <Icon />
          </button>
        ))}
        <span className="dock-sep" aria-hidden="true" />
        <button
          type="button"
          className="dock-item"
          onClick={toggle}
          aria-label={`Switch to ${dark ? "light" : "dark"} theme`}
        >
          {dark ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </nav>
  );
}
