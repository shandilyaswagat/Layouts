import { PRODUCTS } from "../data/talvios";
import { Link } from "./Link";

export function AboutPage({ navigate }: { navigate: (to: string) => void }) {
  return (
    <>
      <section className="shell page-head">
        <Link to="/" navigate={navigate} className="back-link">
          ← Home
        </Link>
        <h1>About</h1>
        <p>
          Layouts is a free library of dashboard designs. It is made by Talvios, a
          one-person project building practical tools for people doing unglamorous work.
        </p>
      </section>

      <section className="shell about">
        <div className="about-block">
          <h2>Why this exists</h2>
          <p>Most dashboards go wrong in the first ten minutes.</p>
          <p>
            Someone opens Power BI, drags in every field they were given, adds a few
            charts, and ends up with fourteen tiles that all look equally important.
            Nothing is technically broken. It just doesn't answer anything.
          </p>
          <p>
            The decisions that make a dashboard useful are usually much simpler than
            that. What belongs above the fold. What should be given less attention. Which
            chart makes sense for a particular measure. How many colours are actually
            necessary.
          </p>
          <p>These things are learnable, and they repeat.</p>
          <p>
            So that's what this library is for. Instead of starting with a blank canvas,
            start with a layout that already makes sense, pick a palette that has been
            checked for contrast, and build from there.
          </p>
        </div>

        <div className="about-block">
          <h2>About Talvios</h2>
          <p>
            Talvios is a one-person project focused on one idea: clarity in complexity.
          </p>
          <p>
            The tools are built around problems that are easy to overcomplicate. The goal
            is to take the repetitive, confusing or time-consuming parts and turn them
            into something simpler and more useful.
          </p>
          <p>
            Most of the tools are designed to run locally. Your files stay with you, your
            API keys stay in your <code>.env</code>, and you don't need an account just
            to use them.
          </p>
          <p>
            Layouts is a little different because a design library is more useful when
            you can simply open it and browse. The same principle still applies: keep
            things simple, collect only what is necessary, and make the useful part
            accessible.
          </p>
        </div>

        <div className="about-block">
          <h2>The Man Behind Talvios</h2>
          <div className="maker">
            <div className="maker-mark" aria-hidden="true">S</div>
            <div>
              <h3>Swagat Shandilya</h3>
              <p className="maker-role">Bangalore, India.</p>
            </div>
          </div>
          <p>
            I’m a data analyst by background and a builder by curiosity. I like taking
            things that feel complicated or repetitive and finding a simpler way to work
            through them.
          </p>
          <p>
            Talvios started during my own job hunt. I was repeating the same work across
            applications, resumes and outreach, so I started building tools to make the
            process clearer and easier to manage.
          </p>
          <p>
            Layouts came from the same idea. I’d spent enough time starting dashboards
            from a blank canvas, figuring out what belonged where and which colours
            worked together. I wanted a clear starting point, so I built one.
          </p>
          <p>
            That’s what Talvios is really about: finding clarity in complexity and
            turning it into something useful.
          </p>
        </div>

        <div className="about-block">
          <h2>The rest of the shelf</h2>
          <p className="about-lede">
            These are the local ones. If you're job hunting, they're designed to work
            well together.
          </p>
          <div className="about-grid">
            {PRODUCTS.map((p) => (
              <div key={p.name} className="about-card reveal">
                <div className="about-card-head">
                  <h3>{p.name}</h3>
                  <span className="about-tag mono">{p.note}</span>
                </div>
                <p>{p.blurb}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="about-block">
          <h2>How this site is built</h2>
          <ul className="about-list">
            <li>
              <strong>Free, and meant to stay that way.</strong> Browsing the library
              costs nothing and doesn't require an account. When AI Assist arrives,
              you'll get a few free runs, followed by the option to use your own API key.
            </li>
            <li>
              <strong>Nothing is tracked.</strong> No analytics, no cookies, no
              unnecessary third-party scripts. Your theme preference stays in your
              browser.
            </li>
            <li>
              <strong>Every palette is checked.</strong> Colours are tested for contrast
              against the backgrounds and against each other, so they hold up in an
              actual dashboard, not just on a colour swatch.
            </li>
            <li>
              <strong>Built for the tools people actually use.</strong> Power BI,
              Tableau, Excel and the web all have different constraints. The layouts and
              palettes are designed with those constraints in mind. More tools coming
              soon.
            </li>
          </ul>
        </div>

        <div className="about-block">
          <h2>Get in touch</h2>
          <p>
            If a layout is wrong, a palette doesn't work somewhere it should, or there's
            a dashboard you keep building that you wish was already in the library, tell
            me.
          </p>
          <p>That's probably the most useful thing you can send.</p>
          <div className="hero-actions about-actions">
            <a
              className="btn-solid"
              href="https://swagatshandilya.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit my portfolio
              <svg
                className="ext"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M8 16 16 8" />
                <path d="M9.5 8H16v6.5" />
              </svg>
            </a>
            <Link to="/layouts" navigate={navigate} className="btn-quiet">
              Browse the library
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
