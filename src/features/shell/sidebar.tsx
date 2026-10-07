"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  NAV_GROUPS,
  type NavItem,
  isItemActive,
  getActiveLink,
} from "./nav-config";
import { UserProfileMenu } from "./user-profile-menu";

function NavItemRow({
  item,
  activeHref,
  collapsed,
  onNavigate,
}: {
  item: NavItem;
  activeHref: string | undefined;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const hasChildren = !!item.children?.length;
  const isActive = isItemActive(activeHref, item);
  const [open, setOpen] = useState(isActive && hasChildren);
  const Icon = item.icon;

  if (hasChildren) {
    return (
      <div className="space-y-0.5">
        <button
          onClick={() => setOpen((v) => !v)}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
            collapsed ? "lg:justify-center" : ""
          } ${
            isActive
              ? "bg-os-primary/10 text-os-primary dark:text-os-accent font-semibold"
              : "text-os-muted hover:bg-os-surface-2 hover:text-os-fg"
          }`}
        >
          <Icon className="h-4 w-4 flex-shrink-0" />
          <span
            className={`flex-1 text-left truncate ${
              collapsed ? "lg:hidden" : ""
            }`}
          >
            {item.label}
          </span>
          <ChevronDown
            className={`h-3.5 w-3.5 flex-shrink-0 text-os-muted transition-transform duration-200 ${
              collapsed ? "lg:hidden" : ""
            } ${open ? "rotate-180" : ""}`}
          />
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className={`overflow-hidden ${collapsed ? "lg:hidden" : ""}`}
            >
              <div className="mt-0.5 ml-3 pl-3 border-l border-os-border space-y-0.5 py-0.5">
                {item.children!.map((child) => {
                  const ChildIcon = child.icon;
                  const isChildActive = activeHref === child.href;
                  return (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={onNavigate}
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                        isChildActive
                          ? "bg-os-primary/10 text-os-primary dark:text-os-accent font-semibold"
                          : "text-os-muted hover:bg-os-surface-2 hover:text-os-fg"
                      }`}
                    >
                      <ChildIcon className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="truncate">{child.label}</span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="relative group/tooltip">
      <Link
        href={item.href}
        onClick={onNavigate}
        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
          collapsed ? "lg:justify-center" : ""
        } ${
          isActive
            ? "bg-os-primary/10 text-os-primary dark:text-os-accent font-semibold"
            : "text-os-muted hover:bg-os-surface-2 hover:text-os-fg"
        }`}
      >
        <Icon className="h-4 w-4 flex-shrink-0" />
        <span className={`truncate ${collapsed ? "lg:hidden" : ""}`}>
          {item.label}
        </span>
      </Link>
      {collapsed && (
        <div className="hidden lg:block absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1 rounded-md bg-os-fg text-os-bg text-xs font-medium whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-150 pointer-events-none z-50 shadow-lg">
          {item.label}
        </div>
      )}
    </div>
  );
}

export function Sidebar({
  pathname,
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}: {
  pathname: string;
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (m: boolean) => void;
}) {
  const activeLink = getActiveLink(pathname);
  const activeHref = activeLink?.href;

  return (
    <aside
      className={`fixed left-0 top-0 h-full z-50 flex flex-col bg-os-surface border-r border-os-border shadow-2xl lg:shadow-sm overflow-hidden
        w-[280px] max-w-[85vw]
        ${collapsed ? "lg:w-[72px]" : "lg:w-[240px]"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        transition-all duration-200 ease-in-out
      `}
    >
      {/* Brand Header */}
      <div
        className={`flex items-center h-16 border-b border-os-border flex-shrink-0 px-4 ${
          collapsed ? "lg:justify-center lg:px-3" : "justify-between"
        }`}
      >
        <Link
          href="/os"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2.5 min-w-0 flex-1 overflow-hidden"
        >
          <div className="relative h-8 w-8 min-w-[32px] flex-shrink-0 flex items-center justify-center">
            <Image
              src="/fzbuildsemfundo.png"
              alt="FZ Build"
              width={32}
              height={32}
              className="h-8 w-8 object-contain flex-shrink-0"
              priority
            />
          </div>
          <div
            className={`flex flex-col min-w-0 ${collapsed ? "lg:hidden" : ""}`}
          >
            <span className="font-extrabold text-xs tracking-tight text-os-fg uppercase leading-none truncate">
              FZ BUILD
            </span>
            <span className="font-bold text-[8px] tracking-widest text-os-primary dark:text-os-accent uppercase mt-0.5 leading-none truncate">
              SOLUTIONS
            </span>
          </div>
        </Link>

        {/* Mobile Close Button (X) */}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-os-muted hover:bg-os-surface-2 hover:text-os-fg transition-colors flex-shrink-0"
          aria-label="Fechar menu"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Desktop Collapse Toggle */}
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="hidden lg:flex p-1.5 rounded-lg text-os-muted hover:bg-os-surface-2 hover:text-os-fg transition-colors flex-shrink-0"
            aria-label="Colapsar barra lateral"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Expand Button When Collapsed (Desktop only) */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="hidden lg:flex mx-auto mt-2 p-1.5 rounded-lg text-os-muted hover:bg-os-surface-2 hover:text-os-fg transition-colors"
          aria-label="Expandir barra lateral"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}

      {/* Nav Groups */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.id} className="space-y-1">
            <p
              className={`px-3 text-[10px] font-bold text-os-muted/80 uppercase tracking-wider font-mono ${
                collapsed ? "lg:hidden" : ""
              }`}
            >
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavItemRow
                  key={item.href}
                  item={item}
                  activeHref={activeHref}
                  collapsed={collapsed}
                  onNavigate={() => setMobileOpen(false)}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Profile */}
      <UserProfileMenu collapsed={collapsed} />
    </aside>
  );
}
