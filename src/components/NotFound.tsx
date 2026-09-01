import { Link } from "./Link";

export function NotFound({ navigate }: { navigate: (to: string) => void }) {
  return (
    <section className="shell page-soon">
      <div className="ai-tag">404</div>
      <h1>No page here</h1>
      <p>
        That link does not point at anything. It may have been a layout that has since
        been renamed.
      </p>
      <div className="hero-actions" style={{ marginTop: 34 }}>
        <Link to="/layouts" navigate={navigate} className="btn-solid">
          Browse the library
        </Link>
        <Link to="/" navigate={navigate} className="btn-quiet">
          Back home
        </Link>
      </div>
    </section>
  );
}
