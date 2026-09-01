import { useCallback, useEffect, useRef, useState } from "react";
import { AboutPage } from "./components/AboutPage";
import { AiAssist } from "./components/AiAssist";
import { AiAssistPage } from "./components/AiAssistPage";
import { BottomDock } from "./components/BottomDock";
import { Cta } from "./components/Cta";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { LayoutDetailPage } from "./components/LayoutDetailPage";
import { LayoutModal } from "./components/LayoutModal";
import { Layouts } from "./components/Layouts";
import { NotFound } from "./components/NotFound";
import { LayoutsPage } from "./components/LayoutsPage";
import { Palettes } from "./components/Palettes";
import { SignInModal } from "./components/SignInModal";
import { Tools } from "./components/Tools";
import { LAYOUTS, type Layout } from "./data/layouts";
import { useMedia } from "./lib/useMedia";
import { useDocumentMeta } from "./lib/useDocumentMeta";
import { useRouter } from "./lib/router";
import { useReveal } from "./lib/useReveal";

export default function App({ initialPath }: { initialPath?: string } = {}) {
  const { path, navigate } = useRouter(initialPath);
  const isMobile = useMedia("(max-width: 760px)");
  const [open, setOpen] = useState<Layout | null>(null);
  const [pal, setPal] = useState(1);
  const [signIn, setSignIn] = useState(false);
  const [toast, setToast] = useState("");
  const toastTimer = useRef<number>(0);

  useReveal(path);
  useDocumentMeta(path);

  const flash = useCallback((msg: string) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 1500);
  }, []);

  const copy = useCallback(
    (hex: string) => {
      navigator.clipboard?.writeText(hex).catch(() => {});
      flash(`${hex}  copied`);
    },
    [flash],
  );

  /** Small screens get a page rather than a modal, which had no room. */
  const openLayout = useCallback(
    (layout: Layout) => {
      if (isMobile) navigate(`/layouts/${layout.id}`);
      else setOpen(layout);
    },
    [isMobile, navigate],
  );

  // A modal opened on desktop should not survive a resize down to mobile.
  useEffect(() => {
    if (isMobile && open) {
      const id = open.id;
      setOpen(null);
      navigate(`/layouts/${id}`);
    }
  }, [isMobile, open, navigate]);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const detailId = path.startsWith("/layouts/") ? path.slice("/layouts/".length) : null;
  const detail = detailId ? LAYOUTS.find((l) => l.id === detailId) ?? null : null;
  const isLayouts = path === "/layouts";
  const isAi = path === "/ai-assist";
  const isAbout = path === "/about";
  const isHome = path === "/" || path === "";
  const known = isHome || isLayouts || isAi || isAbout || !!detail;

  return (
    <>
      <Header navigate={navigate} flash={flash} onSignIn={() => setSignIn(true)} />

      {detail ? (
        <LayoutDetailPage
          layout={detail}
          paletteIndex={pal}
          onPalette={setPal}
          onCopy={copy}
          navigate={navigate}
        />
      ) : isAbout ? (
        <AboutPage navigate={navigate} />
      ) : isAi ? (
        <AiAssistPage navigate={navigate} />
      ) : isLayouts ? (
        <LayoutsPage onOpen={openLayout} onCopy={copy} navigate={navigate} />
      ) : !known ? (
        <NotFound navigate={navigate} />
      ) : (
        <>
          <Hero />
          <Tools />
          <Layouts onOpen={openLayout} navigate={navigate} />
          <Palettes onCopy={copy} navigate={navigate} />
          <AiAssist />
          <Cta onJoin={() => flash("you are on the list")} />
        </>
      )}

      <Footer navigate={navigate} />
      <BottomDock path={path} navigate={navigate} />

      {open && !isMobile && (
        <LayoutModal
          layout={open}
          paletteIndex={pal}
          onPalette={setPal}
          onClose={() => setOpen(null)}
          onCopy={copy}
        />
      )}

      {signIn && <SignInModal onClose={() => setSignIn(false)} />}

      <div className={`toast mono${toast ? " is-on" : ""}`} role="status">
        {toast}
      </div>
    </>
  );
}
