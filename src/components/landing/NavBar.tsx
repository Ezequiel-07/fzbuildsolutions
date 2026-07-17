"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#quem-somos", label: "Sobre" },
    { href: "#solucoes", label: "Soluções" },
    { href: "#produtos", label: "Produtos" },
    { href: "#metodologia", label: "Metodologia" },
  ];

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#050812]/90 backdrop-blur-xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,102,255,0.08)]"
          : "bg-transparent"
      }`}
    >
      <div className="flex justify-between items-center px-5 md:px-20 py-4 max-w-[1400px] mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/fzbuildsemfundo.png"
            alt="FZ Build Solutions"
            width={36}
            height={36}
            className="h-9 w-auto brightness-0 invert transition-all group-hover:opacity-80"
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white/60 hover:text-white text-sm font-medium transition-colors duration-200 relative group"
            >
              {link.label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#00e3fd] group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
          >
            Entrar
          </Link>
          <Link
            href="mailto:contato@fzbuild.solutions"
            className="relative inline-flex items-center gap-2 bg-[#0066ff] text-white text-xs font-bold tracking-wider uppercase px-5 py-2.5 rounded-full overflow-hidden group transition-all hover:shadow-[0_0_20px_rgba(0,102,255,0.5)]"
          >
            <span className="relative z-10">Falar com a FZ</span>
            <span className="absolute inset-0 bg-gradient-to-r from-[#0066ff] to-[#00aaff] opacity-0 group-hover:opacity-100 transition-opacity" />
            {/* Beam effect */}
            <span className="absolute inset-0 w-1/3 h-full bg-white/20 skew-x-[-15deg] translate-x-[-100%] group-hover:translate-x-[400%] transition-transform duration-700" />
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-white/70 hover:text-white p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <span className="material-symbols-outlined">
              {mobileOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-[#050812]/95 backdrop-blur-xl border-t border-white/5 px-5 py-6 flex flex-col gap-4"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-white/70 hover:text-white text-base font-medium py-2 border-b border-white/5 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="mailto:contato@fzbuild.solutions"
            className="mt-2 bg-[#0066ff] text-white text-sm font-bold tracking-wider uppercase px-5 py-3 rounded-full text-center hover:shadow-[0_0_20px_rgba(0,102,255,0.5)] transition-all"
          >
            Falar com a FZ
          </Link>
        </motion.div>
      )}
    </motion.nav>
  );
}
