"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

/* ─────────────────────────────────────────────────────────────
   BuildTerminal — animated CLI window that types out the
   FZ Build process line by line, looping forever.
   Evokes: code being built, systems being constructed.
───────────────────────────────────────────────────────────── */

const LINES = [
  { type: "cmd", text: "$ fz build --init ecosystem" },
  { type: "info", text: "  › Analisando processos..." },
  { type: "info", text: "  › Mapeando integrações..." },
  { type: "success", text: "  ✓ 23 pontos de otimização" },
  { type: "blank", text: "" },
  { type: "cmd", text: "$ fz build --connect ai" },
  { type: "code", text: "  const core = new FZIntelligence({" },
  { type: "code", text: "    model: 'adaptive'," },
  { type: "code", text: "    systems: [erp, crm, bi]" },
  { type: "code", text: "  })" },
  { type: "success", text: "  ✓ IA layer: ATIVO" },
  { type: "blank", text: "" },
  { type: "cmd", text: "$ fz build --deploy --prod" },
  { type: "info", text: "  › Implantando solução..." },
  { type: "success", text: "  ✓ BUILD COMPLETO [v2.0.0]" },
  { type: "metric", text: "    uptime: 99.9%  │  scale: ∞" },
];

const COLOR: Record<string, string> = {
  cmd: "#38bdf8", // sky blue — commands
  info: "#94a3b8", // slate — info
  success: "#4ade80", // green — success
  code: "#c084fc", // purple — code
  metric: "#fbbf24", // amber — metrics
  blank: "transparent",
};

const CHAR_SPEED = 26; // ms per character
const LINE_PAUSE = 180; // ms pause after line completes
const RESTART_PAUSE = 2800; // ms pause before loop restart

interface RenderedLine {
  type: string;
  text: string;
}

export function BuildTerminal() {
  const [rendered, setRendered] = useState<RenderedLine[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  useEffect(() => {
    clear();

    const line = LINES[currentLine];
    if (!line) return;

    // Blank lines: add immediately, move to next
    if (line.type === "blank") {
      setRendered((prev) => [...prev, { type: "blank", text: "" }]);
      timerRef.current = setTimeout(() => {
        setCurrentLine((l) => l + 1);
        setCurrentChar(0);
      }, LINE_PAUSE / 2);
      return;
    }

    // Not yet finished typing this line
    if (currentChar < line.text.length) {
      timerRef.current = setTimeout(() => {
        setCurrentChar((c) => c + 1);
      }, CHAR_SPEED);
      return;
    }

    // Line complete — commit and advance
    timerRef.current = setTimeout(() => {
      setRendered((prev) => [...prev, { type: line.type, text: line.text }]);

      if (currentLine + 1 >= LINES.length) {
        // All lines done — restart after pause
        timerRef.current = setTimeout(() => {
          setRendered([]);
          setCurrentLine(0);
          setCurrentChar(0);
        }, RESTART_PAUSE);
      } else {
        setCurrentLine((l) => l + 1);
        setCurrentChar(0);
      }
    }, LINE_PAUSE);

    return clear;
  }, [currentLine, currentChar]);

  const { isDark } = useTheme();
  const activeLine = LINES[currentLine];
  const activeTyped = activeLine ? activeLine.text.slice(0, currentChar) : "";

  // Dynamic styles
  const windowClass = isDark
    ? "bg-[#0b0f19]/25 border border-[#1e6bff]/20 shadow-[0_24px_60px_rgba(0,0,0,0.3)]"
    : "bg-slate-500/[0.03] border border-[#0d1b3e]/12 shadow-[0_24px_50px_rgba(13,27,62,0.06)]";

  const titleBarClass = isDark
    ? "bg-[#0b0f19]/40 border-b border-white/[0.06] text-white/40"
    : "bg-[#0d1b3e]/[0.03] border-b border-[#0d1b3e]/10 text-[#0d1b3e]/40";

  const bottomBarClass = isDark
    ? "bg-[#1e6bff]/[0.05] border-t border-[#1e6bff]/15 text-white/30"
    : "bg-[#0d1b3e]/[0.02] border-t border-[#0d1b3e]/10 text-[#0d1b3e]/40";

  const maxVisible = 7;
  const showTyping =
    activeLine && activeLine.type !== "blank" && currentChar > 0;
  const sliceCount = showTyping ? maxVisible - 1 : maxVisible;
  const visibleLines = rendered.slice(-sliceCount);

  return (
    <div className="relative w-full max-w-xs xl:max-w-sm">
      {/* Window chrome with thin border and transparent glass bg */}
      <div
        className={`rounded-2xl overflow-hidden backdrop-blur-[6px] transition-all duration-300 ${windowClass}`}
      >
        {/* Title bar */}
        <div
          className={`flex items-center gap-2 px-4 py-2.5 select-none ${titleBarClass}`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]/80" />
          <span className="ml-2 text-[11px] font-mono tracking-wider">
            fz build — terminal
          </span>
          <div className="ml-auto flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-[#4ade80] animate-pulse" />
            <span className="text-[9px] text-[#4ade80] font-mono font-bold">
              LIVE
            </span>
          </div>
        </div>

        {/* Terminal body — 210px height to fit last 7 lines perfectly */}
        <div className="p-4 font-mono text-[11px] leading-5 h-[190px] overflow-hidden bg-transparent">
          <AnimatePresence initial={false}>
            {visibleLines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.12 }}
                className="whitespace-pre"
                style={{
                  color: COLOR[line.type] ?? "#fff",
                  minHeight: "1.25rem",
                }}
              >
                {line.text}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Currently typing line */}
          {activeLine && activeLine.type !== "blank" && currentChar > 0 && (
            <div
              className="whitespace-pre flex items-center gap-0"
              style={{ color: COLOR[activeLine.type] ?? "#fff" }}
            >
              <span>{activeTyped}</span>
              {/* Blinking cursor */}
              <span
                className="inline-block w-[2px] h-[12px] ml-[1px] align-middle"
                style={{
                  background: COLOR[activeLine.type] ?? "#fff",
                  animation: "blink 0.7s step-end infinite",
                }}
              />
            </div>
          )}

          {/* Idle cursor when no line is being typed */}
          {(!activeLine || currentChar === 0) && rendered.length === 0 && (
            <div className="flex items-center gap-1 text-[#38bdf8]">
              <span>$</span>
              <span
                className="inline-block w-[2px] h-[12px] ml-[2px] bg-[#38bdf8]"
                style={{ animation: "blink 0.7s step-end infinite" }}
              />
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div
          className={`px-4 py-1.5 flex items-center gap-3 font-mono text-[9px] ${bottomBarClass}`}
        >
          <span>FZ Build Solutions</span>
          <span className="ml-auto opacity-70">TypeScript · Next.js 15</span>
        </div>
      </div>

      {/* Glow under the terminal */}
      <div
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse, rgba(30,107,255,0.18) 0%, transparent 70%)",
          filter: "blur(12px)",
        }}
      />
    </div>
  );
}
