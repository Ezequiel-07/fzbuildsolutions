"use client";

import Image from "next/image";
import Link from "next/link";

const NAV_LINKS = [
  { href: "#quem-somos", label: "Sobre" },
  { href: "#solucoes", label: "Soluções" },
  { href: "#produtos", label: "Produtos" },
  { href: "#metodologia", label: "Metodologia" },
];

const INSTITUTIONAL = [
  { href: "mailto:contato@fzbuild.solutions", label: "Contato" },
  { href: "#", label: "Privacidade" },
];

const SOCIAL = [
  { href: "https://linkedin.com", label: "LinkedIn", icon: "open_in_new" },
  {
    href: "https://github.com/Ezequiel-07/fzbuildsolutions",
    label: "GitHub",
    icon: "open_in_new",
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-[#030710] border-t border-white/5 px-5 md:px-20 py-16 overflow-hidden">
      {/* Top gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0066ff]/40 to-transparent" />

      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-12">
          {/* Brand */}
          <div className="flex flex-col gap-4 max-w-xs">
            <Image
              src="/fzbuildsemfundo.png"
              alt="FZ Build Solutions"
              width={36}
              height={36}
              className="h-9 w-auto brightness-0 invert opacity-80"
            />
            <p className="text-white/35 text-sm leading-relaxed">
              Building Future Ecosystems through Intelligent Software.
            </p>
            <div className="flex gap-3 mt-2">
              {SOCIAL.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg border border-white/8 bg-white/[0.03] flex items-center justify-center text-white/40 hover:text-white hover:border-[#0066ff]/40 hover:bg-[#0066ff]/10 transition-all duration-200"
                  aria-label={s.label}
                >
                  <span className="text-xs font-bold font-mono">
                    {s.label.slice(0, 2)}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-3 gap-12">
            <div className="flex flex-col gap-3">
              <h4 className="text-white/70 text-xs font-bold uppercase tracking-widest font-mono mb-1">
                Navegação
              </h4>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-white/35 hover:text-white text-sm transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-white/70 text-xs font-bold uppercase tracking-widest font-mono mb-1">
                Institucional
              </h4>
              {INSTITUTIONAL.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-white/35 hover:text-white text-sm transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-white/70 text-xs font-bold uppercase tracking-widest font-mono mb-1">
                Produtos
              </h4>
              {["DP Core", "EZYX", "FZ OS"].map((p) => (
                <span key={p} className="text-white/35 text-sm cursor-default">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-white/25 text-xs">
          <span>
            © {year} FZ Build Solutions. Todos os direitos reservados.
          </span>
          <div className="flex items-center gap-4 font-mono">
            <span>Brasil</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>Intelligent Ecosystems</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="text-[#0066ff]/60">v2.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
