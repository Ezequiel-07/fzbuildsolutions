"use client";

import { UserNav } from "./user-nav";
import { ThemeSwitcher } from "./theme-switcher";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Dashboard", href: "/os" },
    { name: "Projetos", href: "/os/projects" },
    { name: "CRM", href: "/os/crm" },
    { name: "Equipe", href: "/os/team" },
    { name: "Financeiro", href: "/os/finance" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/40 shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8 max-w-[1600px] mx-auto">
        <div className="flex items-center gap-4">
          {/* Logo or placeholder could go here */}
        </div>

        {/* Top Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 mx-auto bg-slate-100/50 p-1 rounded-full border border-slate-200/50">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                  isActive
                    ? "bg-white text-[#003d9b] shadow-sm scale-105"
                    : "text-slate-500 hover:text-[#003d9b] hover:bg-white/50"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center justify-end space-x-4">
          <ThemeSwitcher />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
