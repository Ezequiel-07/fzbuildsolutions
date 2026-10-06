"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowRight, Activity } from "lucide-react";
import { getAllNavLinks, type FlatNavLink } from "./nav-config";

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const links = getAllNavLinks();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  const filtered = links.filter((item) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    const matchLabel = item.label.toLowerCase().includes(q);
    const matchGroup = item.group.toLowerCase().includes(q);
    const matchKeywords = item.keywords?.some((k) =>
      k.toLowerCase().includes(q),
    );
    return matchLabel || matchGroup || matchKeywords;
  });

  const handleSelect = (href: string) => {
    onOpenChange(false);
    setQuery("");
    router.push(href);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -8 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-xl bg-os-surface rounded-2xl border border-os-border shadow-2xl overflow-hidden z-10"
          >
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-os-border">
              <Search className="h-4 w-4 text-os-muted" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar comando, tela ou digite '> status'..."
                className="flex-1 bg-transparent text-sm text-os-fg focus:outline-none placeholder:text-os-muted"
              />
              <kbd className="px-2 py-0.5 rounded bg-os-surface-2 text-[10px] font-mono text-os-muted border border-os-border">
                ESC
              </kbd>
            </div>

            {query.trim().toLowerCase() === "> status" ? (
              <div className="p-4 bg-os-success/10 text-os-success text-xs font-mono space-y-1">
                <div className="flex items-center gap-2 font-bold">
                  <Activity className="h-4 w-4 animate-pulse" />
                  <span>FZ SYSTEM ONLINE</span>
                </div>
                <p className="text-[11px] opacity-90">
                  CORE: OPERACIONAL · DB: FIRESTORE ATIVO · AUTH: ONLINE · AI:
                  PRONTO
                </p>
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto p-2 space-y-1">
                {filtered.length === 0 ? (
                  <div className="p-8 text-center text-xs text-os-muted">
                    Nenhum resultado encontrado para &quot;{query}&quot;
                  </div>
                ) : (
                  filtered.map((item: FlatNavLink) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={`${item.group}-${item.href}-${item.label}`}
                        onClick={() => handleSelect(item.href)}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-os-surface-2 text-left transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-os-surface-2 text-os-muted group-hover:text-os-primary group-hover:bg-os-primary/10 transition-colors">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-os-fg">
                              {item.label}
                            </p>
                            <p className="text-[10px] text-os-muted">
                              {item.group}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-os-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
