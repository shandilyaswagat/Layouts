import { Link } from "./Link";

export function Cta({ navigate }: { navigate: (to: string) => void }) {
  return (
    <section id="cta" className="shell cta">
      <h2 className="reveal">
        Stop designing dashboards
        <br />
        from a blank page.
      </h2>
      <p className="reveal">
        Browse the library free. AI assist opens this autumn.
      </p>
      <div className="reveal cta-actions">
        <Link to="/layouts" navigate={navigate} className="btn-solid">
          Explore the library
        </Link>
      </div>
    </section>
  );
}
