"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
  Children,
} from "react";
import { motion } from "framer-motion";

/* ─────────────────────────────────────────────────────────────
   Split-panel fullpage scroll:

   EXIT  → current section halves collapse (zoom out) toward
            their outer edges.

   ENTER → new section halves grow (zoom in) from outer edges
            and converge at the center.

   Seam:  clips overlap by 1% each side so there is NEVER a
          visible gap or line between the two halves.
───────────────────────────────────────────────────────────── */

const ENTER_MS = 1050; // enter animation duration (ms)
const EXIT_MS = 820; // exit  animation duration (ms)
const LOCK_MS = ENTER_MS + 250; // navigation lock duration

const EASE_IN = [0.22, 1, 0.36, 1] as const;
const EASE_OUT = [0.45, 0, 0.85, 1] as const;

/* 49.5 % overlap on each side → 1 % total overlap at the center seam
   so the two halves always share ~16px of identical pixels and the
   clip boundary is completely invisible.                             */
const CLIP_OVERLAP = 49.5;

type PanelMode = "static" | "entering" | "exiting";

interface SplitHalfProps {
  children: ReactNode;
  side: "left" | "right";
  mode: PanelMode;
}

function SplitHalf({ children, side, mode }: SplitHalfProps) {
  const isLeft = side === "left";

  // Overlap removes the seam — each half shows slightly more than 50%
  const clipPath = isLeft
    ? `inset(0 ${CLIP_OVERLAP}% 0 0)` // left side: shows left 50.5%
    : `inset(0 0 0 ${CLIP_OVERLAP}%)`; // right side: shows right 50.5%

  // Scale origin at the OUTER edge of the panel so the zoom
  // appears to grow from / collapse toward the screen edges.
  const transformOrigin = isLeft ? "left center" : "right center";

  /* ── per-mode animation values ── */
  const initial =
    mode === "entering"
      ? { scale: 0.65, opacity: 0 }
      : { scale: 1, opacity: 1 }; // exiting / static

  const animate =
    mode === "entering"
      ? { scale: 1, opacity: 1 }
      : mode === "exiting"
        ? { scale: 0.68, opacity: 0 }
        : { scale: 1, opacity: 1 }; // static — already rendered

  const transition =
    mode === "entering"
      ? { duration: ENTER_MS / 1000, ease: EASE_IN, delay: 0.06 }
      : mode === "exiting"
        ? { duration: EXIT_MS / 1000, ease: EASE_OUT, delay: 0 }
        : { duration: 0 };

  return (
    <motion.div
      className="absolute inset-0"
      style={{ clipPath, transformOrigin, willChange: "transform, opacity" }}
      initial={initial}
      animate={animate}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}

/* ── Main Engine ──────────────────────────────────────────── */

interface FullPageScrollProps {
  children: ReactNode;
  sectionLabels?: string[];
}

export function FullPageScroll({
  children,
  sectionLabels = [],
}: FullPageScrollProps) {
  const sections = Children.toArray(children);
  const count = sections.length;

  const [current, setCurrent] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const locked = useRef(false);
  const hasMounted = useRef(false);
  const touchStart = useRef<number | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const navigateTo = useCallback(
    (targetIndex: number) => {
      if (locked.current || targetIndex === current) return;
      if (targetIndex < 0 || targetIndex >= count) return;

      locked.current = true;
      hasMounted.current = true;
      setPrevious(current);
      setCurrent(targetIndex);

      setTimeout(() => {
        setPrevious(null);
        locked.current = false;
      }, LOCK_MS);
    },
    [current, count],
  );

  const navigate = useCallback(
    (dir: 1 | -1) => {
      navigateTo(current + dir);
    },
    [current, navigateTo],
  );

  const goTo = useCallback(
    (index: number) => {
      navigateTo(index);
    },
    [navigateTo],
  );

  /* custom event listener for direct navigation (e.g. from NavBar) */
  useEffect(() => {
    const handleScrollTo = (e: Event) => {
      const customEvent = e as CustomEvent<{ index: number }>;
      if (customEvent.detail && typeof customEvent.detail.index === "number") {
        const idx = customEvent.detail.index;
        if (isMobile) {
          document
            .getElementById(`fz-section-${idx}`)
            ?.scrollIntoView({ behavior: "smooth" });
        } else {
          navigateTo(idx);
        }
      }
    };
    window.addEventListener("fz-scroll-to", handleScrollTo);
    return () => window.removeEventListener("fz-scroll-to", handleScrollTo);
  }, [navigateTo, isMobile]);

  /* events */
  useEffect(() => {
    if (isMobile) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (Math.abs(e.deltaY) < 20) return;
      navigate(e.deltaY > 0 ? 1 : -1);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [navigate, isMobile]);

  useEffect(() => {
    if (isMobile) return;
    const onStart = (e: TouchEvent) => {
      touchStart.current = e.touches[0].clientY;
    };
    const onEnd = (e: TouchEvent) => {
      if (touchStart.current === null) return;
      const d = touchStart.current - e.changedTouches[0].clientY;
      if (Math.abs(d) > 40) navigate(d > 0 ? 1 : -1);
      touchStart.current = null;
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, [navigate, isMobile]);

  useEffect(() => {
    if (isMobile) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") navigate(1);
      if (e.key === "ArrowUp" || e.key === "PageUp") navigate(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate, isMobile]);

  const enterMode: PanelMode = hasMounted.current ? "entering" : "static";

  if (isMobile) {
    return (
      <div className="w-full flex flex-col relative z-10 fz-scrollable-mobile-stack">
        {sections.map((sec, idx) => (
          <div
            id={`fz-section-${idx}`}
            key={idx}
            className="w-full relative flex items-center justify-center border-b border-white/5"
          >
            {sec}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className="relative h-screen w-full overflow-hidden"
      style={{ zIndex: 2 }}
    >
      {/* Previous section — halves split and zoom out to the edges */}
      {previous !== null && (
        <div
          key={`exit-${previous}`}
          className="absolute inset-0 z-10 pointer-events-none"
        >
          <SplitHalf side="left" mode="exiting">
            {sections[previous]}
          </SplitHalf>
          <SplitHalf side="right" mode="exiting">
            {sections[previous]}
          </SplitHalf>
        </div>
      )}

      {/* Current section — halves grow from the edges and join at center */}
      <div key={`enter-${current}`} className="absolute inset-0 z-20">
        <SplitHalf side="left" mode={enterMode}>
          {sections[current]}
        </SplitHalf>
        <SplitHalf side="right" mode={enterMode}>
          {sections[current]}
        </SplitHalf>
      </div>

      {/* ── Side dot navigation ── */}
      <nav
        className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3 items-end"
        aria-label="Navegação por seções"
      >
        {sections.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={sectionLabels[i] ?? `Seção ${i + 1}`}
            className="group relative flex items-center justify-end gap-2"
          >
            {sectionLabels[i] && (
              <span className="absolute right-6 text-xs font-mono tracking-[0.15em] uppercase opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none fz-nav-label select-none">
                {sectionLabels[i]}
              </span>
            )}
            <span
              className={`block rounded-full transition-all duration-300 fz-nav-dot ${
                i === current
                  ? "w-6 h-2 fz-nav-dot-active"
                  : "w-2 h-2 fz-nav-dot-inactive group-hover:opacity-60"
              }`}
            />
          </button>
        ))}
      </nav>

      {/* ── Section counter ── */}
      <div className="fixed bottom-6 right-6 z-50 font-mono text-xs fz-counter flex items-center gap-1.5 select-none">
        <span className="fz-counter-current font-semibold">
          {String(current + 1).padStart(2, "0")}
        </span>
        <span className="fz-counter-sep opacity-30">/</span>
        <span className="opacity-25">{String(count).padStart(2, "0")}</span>
      </div>

      {/* ── Top progress bar ── */}
      <div className="fixed top-0 left-0 right-0 h-[1.5px] z-50 fz-progress-track">
        <motion.div
          className="h-full fz-progress-fill"
          animate={{ scaleX: (current + 1) / count }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ transformOrigin: "left center" }}
        />
      </div>
    </div>
  );
}
