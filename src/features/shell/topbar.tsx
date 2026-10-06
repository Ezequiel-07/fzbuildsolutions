"use client";

import Link from "next/link";
import { Menu, Search, Sparkles, Bell, Settings } from "lucide-react";
import { getBreadcrumbs, type Crumb } from "./nav-config";

export function Topbar({
  pathname,
  onOpenMobile,
  onOpenCommand,
  onOpenAi,
}: {
  pathname: string;
  onOpenMobile: () => void;
  onOpenCommand: () => void;
  onOpenAi: () => void;
}) {
  const crumbs: Crumb[] = getBreadcrumbs(pathname);

  return (
    <header className="sticky top-0 z-30 flex items-center h-14 px-4 md:px-6 bg-os-surface/90 backdrop-blur-md border-b border-os-border gap-3">
      {/* Mobile Toggle */}
      <button
        onClick={onOpenMobile}
        className="lg:hidden p-1.5 rounded-lg text-os-muted hover:bg-os-surface-2 hover:text-os-fg"
        aria-label="Abrir menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Breadcrumb */}
      <nav
        aria-label="Navegação estrutural"
        className="flex-1 flex items-center gap-1.5 min-w-0"
      >
        <span className="text-[11px] font-mono text-os-muted/80 hidden sm:inline">
          FZ OS
        </span>
        <span className="text-os-border hidden sm:inline">/</span>
        {crumbs.map((c, idx) => {
          const isLast = idx === crumbs.length - 1;
          return (
            <div
              key={`${c.label}-${idx}`}
              className="flex items-center gap-1.5 min-w-0"
            >
              {c.href && !isLast ? (
                <Link
                  href={c.href}
                  className="text-xs font-medium text-os-muted hover:text-os-fg transition-colors truncate"
                >
                  {c.label}
                </Link>
              ) : (
                <span
                  className={`text-xs truncate ${
                    isLast
                      ? "font-semibold text-os-fg"
                      : "font-medium text-os-muted"
                  }`}
                >
                  {c.label}
                </span>
              )}
              {!isLast && <span className="text-os-muted/60 text-xs">›</span>}
            </div>
          );
        })}
      </nav>

      {/* Command Palette Trigger */}
      <button
        onClick={onOpenCommand}
        className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-os-border bg-os-surface-2/60 hover:bg-os-surface-2 text-os-muted text-xs transition-all w-52 lg:w-64"
      >
        <Search className="h-3.5 w-3.5 text-os-muted" />
        <span className="flex-1 text-left truncate">
          Buscar projetos, ações...
        </span>
        <kbd className="px-1.5 py-0.5 rounded bg-os-surface text-[10px] font-mono text-os-muted border border-os-border font-semibold">
          ⌘K
        </kbd>
      </button>

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        {/* FZ AI Button */}
        <button
          onClick={onOpenAi}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-os-primary/10 text-os-primary dark:text-os-accent hover:bg-os-primary/20 border border-os-primary/20 text-xs font-bold transition-all"
        >
          <Sparkles className="h-3.5 w-3.5 animate-pulse" />
          <span>AI</span>
        </button>

        {/* Notifications Bell */}
        <Link
          href="/os/notifications"
          className="relative p-2 rounded-lg text-os-muted hover:bg-os-surface-2 hover:text-os-fg transition-colors"
          title="Central de Notificações"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-os-primary rounded-full" />
        </Link>

        {/* Settings */}
        <Link
          href="/os/admin/settings"
          className="p-2 rounded-lg text-os-muted hover:bg-os-surface-2 hover:text-os-fg transition-colors"
          title="Configurações do Sistema"
        >
          <Settings className="h-4 w-4" />
        </Link>
      </div>
    </header>
  );
}
