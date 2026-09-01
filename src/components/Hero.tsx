import { Fragment } from "react";
import { HeroMock } from "./HeroMock";

const WORDS = ["Dashboard", "layouts,", "mockups", "and", "palettes", "that", "just", "work."];
/** Line breaks after "mockups", as designed. */
const BREAK_AFTER = 2;

export function Hero() {
  return (
    <section id="top" className="shell hero">
      <div className="badge">
        <b>NEW</b>
        AI layout suggestions are live
      </div>

      <h1>
        {WORDS.map((word, i) => (
          <Fragment key={word}>
            <span style={{ animationDelay: `${0.05 + i * 0.08}s` }}>{word}</span>
            {i === BREAK_AFTER ? <br /> : " "}
          </Fragment>
        ))}
      </h1>

      <p className="hero-lede">
        A growing library of simple, functional dashboard designs with copy-ready hex
        codes. Build in Power BI, Excel or on the web without starting from a blank
        canvas.
      </p>

      <div className="hero-actions">
        <a href="#layouts" className="btn-solid">Explore the library</a>
        <a href="#ai" className="btn-quiet">See AI assist</a>
      </div>

      <p className="hero-note">Free to browse. No account needed.</p>

      <HeroMock />
    </section>
  );
}
