import { useEffect, useRef } from "react";
import { PALETTES } from "../data/palettes";

const INK = PALETTES.find((p) => p.name === "Ink")!;

export function AiAssist() {
  const chatRef = useRef<HTMLDivElement>(null);

  /**
   * Replays the conversation on a loop. Messages are collapsed by a negative
   * margin equal to their own height, so revealing one pushes the stack up
   * instead of the container growing.
   */
  useEffect(() => {
    const chat = chatRef.current;
    if (!chat) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const msgs = Array.from(chat.querySelectorAll<HTMLElement>(".msg"));
    const typing = chat.querySelector<HTMLElement>(".typing");
    if (!msgs.length) return;

    const GAP = 12;
    const all = typing ? [...msgs, typing] : msgs;
    const heights = new Map<HTMLElement, number>();
    all.forEach((m) => heights.set(m, m.offsetHeight));

    let stopped = false;
    const timers: number[] = [];
    const wait = (ms: number) =>
      new Promise<void>((res) => timers.push(window.setTimeout(res, ms)));

    const collapse = (m: HTMLElement) => {
      m.style.marginTop = `-${(heights.get(m) ?? 0) + GAP}px`;
      m.style.opacity = "0";
      m.style.transform = "translateY(14px) scale(.96)";
      m.style.pointerEvents = "none";
    };
    const reveal = (m: HTMLElement) => {
      m.style.marginTop = "0px";
      m.style.opacity = "1";
      m.style.transform = "none";
      m.style.pointerEvents = "";
    };

    const run = async () => {
      while (!stopped) {
        all.forEach(collapse);
        await wait(900);
        for (let i = 0; i < msgs.length && !stopped; i++) {
          const fromAi = i % 2 === 1;
          if (fromAi && typing) {
            reveal(typing);
            await wait(1200);
            collapse(typing);
            await wait(320);
          }
          reveal(msgs[i]);
          await wait(fromAi ? 2000 : 1200);
        }
        await wait(3600);
      }
    };

    const start = () => {
      if (!stopped) void run();
    };
    if (document.fonts?.ready) document.fonts.ready.then(start);
    else start();

    return () => {
      stopped = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <section id="ai" className="shell ai-wrap">
      <div className="ai-card reveal">
        <div>
          <div className="ai-tag">AI ASSIST</div>
          <h2>Describe the dashboard. Get a starting point.</h2>
          <p>
            Tell the assistant what you are measuring and who reads it. It picks a layout,
            suggests a palette and explains which chart belongs in each slot, in the tool
            you are building in.
          </p>
          <ul className="ai-list">
            <li><i />Layout picked from your metric count and audience</li>
            <li><i />Palette matched to your brand colour</li>
            <li><i />Chart-type guidance per tile, with reasoning</li>
          </ul>
        </div>

        <div className="chat" ref={chatRef}>
          <div className="msg me">
            Weekly sales report in Power BI for regional managers. 5 KPIs.
          </div>
          <div className="msg">
            Use <strong>Revenue overview</strong> — KPI strip across the top, one hero
            chart below. Five metrics is one too many for a row of four, so promote{" "}
            <em>Revenue</em> to a wide tile.
            <div className="msg-swatches">
              {INK.colors.slice(0, 5).map((hex) => (
                <i key={hex} style={{ background: hex }} />
              ))}
            </div>
            <div className="msg-pal mono">palette: {INK.name}</div>
          </div>
          <div className="msg me">
            Will it still read on a projector at the back of the room?
          </div>
          <div className="msg">
            Switch to <strong>Slate</strong> for the stronger contrast, set KPI labels at
            16px and drop the sparkline row. Four large tiles beat six small ones at that
            distance.
          </div>
          <div className="msg me">Perfect, thanks.</div>
          <div className="typing">
            <i />
            <i />
            <i />
          </div>
        </div>
      </div>
    </section>
  );
}
