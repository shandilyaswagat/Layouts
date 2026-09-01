import { Link } from "./Link";

export function Footer({ navigate }: { navigate: (to: string) => void }) {
  return (
    <footer className="footer">
      <div className="shell footer-inner">
        <span>© 2026 Layouts</span>
        <div className="footer-links">
          <Link to="/layouts" navigate={navigate}>Layouts</Link>
          <Link to="/layouts#palettes" navigate={navigate}>Palettes</Link>
          <Link to="/ai-assist" navigate={navigate}>AI assist</Link>
          <Link to="/about" navigate={navigate}>About</Link>
          <Link to="/#cta" navigate={navigate}>Contact</Link>
        </div>
      </div>
    </footer>
  );
}
