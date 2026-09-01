import { Link } from "./Link";
import { useTheme } from "../lib/theme";

type Props = {
  navigate: (to: string) => void;
  flash: (msg: string) => void;
  onSignIn: () => void;
};

export function Header({ navigate, flash, onSignIn }: Props) {
  const { accentName, toggle, cycleAccent } = useTheme();

  return (
    <header className="header">
      <div className="shell header-inner">
        <div className="brand">
          <button
            type="button"
            className="brand-mark"
            onClick={() => flash(cycleAccent())}
            title={`Accent: ${accentName}. Click to change.`}
            aria-label={`Accent: ${accentName}. Click to change.`}
          >
            <i />
            <i />
            <i />
          </button>
          <Link to="/" navigate={navigate} className="brand-name">Layoutss</Link>
        </div>

        <nav className="header-nav">
          <Link to="/" navigate={navigate}>Home</Link>
          <Link to="/layouts" navigate={navigate}>Layouts</Link>
          <Link to="/ai-assist" navigate={navigate}>AI assist</Link>
          <Link to="/about" navigate={navigate}>About</Link>
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="icon-btn"
            onClick={toggle}
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            <span data-icon="light">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                <circle cx="12" cy="12" r="4.2" />
                <path d="M12 2.4v2.2M12 19.4v2.2M2.4 12h2.2M19.4 12h2.2M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M18.8 5.2l-1.6 1.6M6.8 17.2l-1.6 1.6" />
              </svg>
            </span>
            <span data-icon="dark">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.5 14.6A8.6 8.6 0 0 1 9.4 3.5a8.6 8.6 0 1 0 11.1 11.1Z" />
              </svg>
            </span>
          </button>
          <button type="button" className="btn-accent" onClick={onSignIn}>
            Sign in
          </button>
        </div>
      </div>
    </header>
  );
}
