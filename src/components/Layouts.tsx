import { LAYOUTS, type Layout } from "../data/layouts";
import { LayoutGrid } from "./LayoutGrid";
import { Link } from "./Link";

type Props = {
  onOpen: (layout: Layout) => void;
  navigate: (to: string) => void;
};

/** Home section. Three layouts, then out to the full page. */
export function Layouts({ onOpen, navigate }: Props) {
  return (
    <section id="layouts" className="shell section">
      <div className="section-head reveal">
        <div>
          <h2>Layouts</h2>
          <p className="section-desc">
            Grid structures for the dashboards people actually build. Each one comes with
            spacing, sizes and a matching palette.
          </p>
        </div>
        <Link to="/layouts" navigate={navigate} className="section-link">
          View all {LAYOUTS.length} layouts →
        </Link>
      </div>

      <LayoutGrid layouts={LAYOUTS.slice(0, 3)} onOpen={onOpen} />
    </section>
  );
}
