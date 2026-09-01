import type { FormEvent } from "react";

export function Cta({ onJoin }: { onJoin: () => void }) {
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.currentTarget.reset();
    onJoin();
  }

  return (
    <section id="cta" className="shell cta">
      <h2 className="reveal">
        Stop designing dashboards
        <br />
        from a blank page.
      </h2>
      <p className="reveal">
        Browse the library free. Early access to AI assist opens this autumn.
      </p>
      <form className="reveal" onSubmit={submit}>
        <input type="email" required placeholder="you@company.com" aria-label="Email address" />
        <button type="submit">Get early access</button>
      </form>
    </section>
  );
}
