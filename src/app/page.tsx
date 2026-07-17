"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FullPageScroll } from "@/components/landing/FullPageScroll";
import { ParticleCanvas } from "@/components/landing/ParticleCanvas";
import { BuildTerminal } from "@/components/landing/BuildTerminal";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { Menu, X, Sun, Moon } from "lucide-react";

/* ──────────────────────────────────────────────
   THEME TOGGLE BUTTON
────────────────────────────────────────────── */
function ThemeToggle() {
  const { isDark, toggle } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button
        className="relative w-12 h-6 rounded-full border fz-toggle-track"
        aria-label="Alternar tema"
      />
    );
  }

  return (
    <button
      onClick={toggle}
      aria-label="Alternar tema"
      className="relative w-12 h-6 rounded-full border transition-all duration-500 fz-toggle-track flex items-center px-0.5"
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
        className="w-5 h-5 rounded-full fz-toggle-thumb flex items-center justify-center overflow-hidden"
        style={{ marginLeft: isDark ? 0 : "calc(100% - 20px)" }}
      >
        {isDark ? <Moon className="h-3 w-3" /> : <Sun className="h-3 w-3" />}
      </motion.span>
    </button>
  );
}

/* ──────────────────────────────────────────────
   NAV BAR
────────────────────────────────────────────── */
function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  const handleNavClick = (idx: number) => {
    const event = new CustomEvent("fz-scroll-to", { detail: { index: idx } });
    window.dispatchEvent(event);
    closeMenu();
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 fz-nav"
    >
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 md:px-16 py-3 md:py-4">
        {/* Logo */}
        <Link
          href="/"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick(0);
          }}
          className="flex items-center gap-2 group z-50"
        >
          <Image
            src="/fzbuildsemfundo.png"
            alt="FZ Build Solutions"
            width={96}
            height={96}
            className="h-14 md:h-20 w-auto fz-logo-img transition-opacity group-hover:opacity-70"
          />
        </Link>

        {/* Desktop Nav links */}
        <nav className="hidden md:flex items-center gap-8">
          {["Sobre", "Equipe", "Soluções", "Produtos", "Metodologia"].map(
            (label, idx) => (
              <span
                key={label}
                onClick={() => handleNavClick(idx + 1)}
                className="text-sm font-medium fz-nav-link relative group cursor-pointer"
              >
                {label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px fz-nav-underline group-hover:w-full transition-all duration-300" />
              </span>
            ),
          )}
        </nav>

        {/* Desktop Right actions */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="/login"
            className="text-xs font-semibold fz-nav-link hover:opacity-100 transition-opacity px-3 py-2 rounded-lg"
          >
            Login
          </Link>
          <Link
            href="https://wa.me/5511954297115?text=Ol%C3%A1%2C%20gostaria%20de%20solicitar%20um%20diagn%C3%B3stico%20da%20FZ%20Build%20Solutions."
            target="_blank"
            className="fz-btn-primary text-xs font-bold tracking-wider uppercase px-5 py-2.5 rounded-full overflow-hidden relative group"
          >
            <span className="relative z-10">Falar com a FZ</span>
            <span className="fz-btn-shine absolute inset-0 w-1/3 h-full skew-x-[-15deg] translate-x-[-120%] group-hover:translate-x-[400%] transition-transform duration-700" />
          </Link>
        </div>

        {/* Mobile controls & Toggle */}
        <div className="flex md:hidden items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="z-50 w-10 h-10 flex items-center justify-center text-[#0d1b3e] dark:text-white focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden fixed inset-0 w-full h-screen z-40 flex flex-col px-8 pt-28 pb-12 overflow-y-auto fz-mobile-drawer"
          >
            <div className="flex flex-col gap-6 items-center text-center">
              {["Sobre", "Equipe", "Soluções", "Produtos", "Metodologia"].map(
                (label, idx) => (
                  <span
                    key={label}
                    onClick={() => handleNavClick(idx + 1)}
                    className="text-lg font-semibold fz-nav-link py-1 cursor-pointer block w-full"
                  >
                    {label}
                  </span>
                ),
              )}

              <hr className="w-12 border-current opacity-10 my-2" />

              <Link
                href="/login"
                onClick={closeMenu}
                className="text-sm font-semibold fz-nav-link py-2 block w-full"
              >
                Login
              </Link>

              <Link
                href="https://wa.me/5511954297115?text=Ol%C3%A1%2C%20gostaria%20de%20solicitar%20um%20diagn%C3%B3stico%20da%20FZ%20Build%20Solutions."
                target="_blank"
                onClick={closeMenu}
                className="fz-btn-primary text-sm font-bold tracking-wider uppercase px-8 py-3 rounded-full overflow-hidden relative group w-fit mt-2"
              >
                <span className="relative z-10">Falar com a FZ</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

/* ──────────────────────────────────────────────
   SECTION 1 — HERO
────────────────────────────────────────────── */
function HeroSection() {
  const { isDark } = useTheme();
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(0);

  useEffect(() => {
    const animate = (
      setter: (n: number) => void,
      target: number,
      dur = 1800,
    ) => {
      let start: number;
      const step = (ts: number) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / dur, 1);
        const e = 1 - Math.pow(1 - p, 3);
        setter(Math.floor(e * target));
        if (p < 1) requestAnimationFrame(step);
      };
      setTimeout(() => requestAnimationFrame(step), 600);
    };
    animate(setCount1, 12);
    animate(setCount2, 99);
    animate(setCount3, 3);
  }, []);

  return (
    <section className="relative h-screen flex flex-col justify-center fz-hero overflow-hidden">
      {/* Absolute Background Image based on Theme */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <Image
          src={isDark ? "/fundoescuro.png" : "/fundoclaro.png"}
          alt=""
          fill
          priority
          className={`object-cover ${isDark ? "opacity-10" : "opacity-80"}`}
        />
      </div>

      {/* Reflection blobs (dark) / gradient shapes (light) */}
      <div className="fz-hero-blob-1 absolute pointer-events-none z-0" />
      <div className="fz-hero-blob-2 absolute pointer-events-none z-0" />
      <div className="fz-hero-blob-3 absolute pointer-events-none z-0" />

      {/* Grid/dot bg */}
      <div className="absolute inset-0 fz-bg-pattern opacity-40 pointer-events-none" />

      {/* Background large watermark logo in the center */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[45%] max-w-[600px] opacity-10 pointer-events-none z-0 flex items-center justify-center select-none">
        <Image
          src="/fzbuildsemfundo.png"
          alt=""
          width={600}
          height={600}
          className={`w-full h-auto object-contain ${isDark ? "brightness-0 invert" : ""}`}
        />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-16 w-full pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column — Text & Info */}
          <div className="lg:col-span-7 flex flex-col gap-7">
            {/* Badge */}
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 fz-badge text-xs font-bold tracking-[0.2em] uppercase px-4 py-2 rounded-full w-fit"
            >
              <span className="w-1.5 h-1.5 rounded-full fz-badge-dot animate-pulse" />
              Software House · Brasil
            </motion.span>

            {/* H1 */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.35,
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="font-heading font-extrabold text-[40px] sm:text-5xl md:text-7xl leading-[1.05] tracking-tight fz-hero-h1 break-words"
            >
              Transformamos
              <br />
              processos em <span className="fz-accent-text">software</span>
              <br />
              <span className="fz-accent-text">inteligente</span>.
            </motion.h1>

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="fz-hero-sub text-lg leading-relaxed max-w-2xl"
            >
              Construímos plataformas inteligentes que automatizam operações,
              conectam sistemas e aceleram empresas através de software e
              Inteligência Artificial.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.5 }}
              className="flex flex-wrap gap-4 mt-1"
            >
              <Link
                href="https://wa.me/5511954297115?text=Ol%C3%A1%2C%20gostaria%20de%20solicitar%20um%20diagn%C3%B3stico%20da%20FZ%20Build%20Solutions."
                target="_blank"
                className="fz-btn-primary relative overflow-hidden group font-bold text-sm px-8 py-4 rounded-full"
              >
                <span className="relative z-10">Solicitar Diagnóstico →</span>
                <span className="fz-btn-shine absolute inset-0 w-1/3 h-full skew-x-[-15deg] translate-x-[-120%] group-hover:translate-x-[400%] transition-transform duration-700" />
              </Link>
              <Link
                href="mailto:fzbuild.solutions@gmail.com"
                className="fz-btn-ghost font-medium text-sm px-8 py-4 rounded-full border"
              >
                Entrar em Contato
              </Link>
            </motion.div>

            {/* Metrics */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.7 }}
              className="grid grid-cols-3 gap-6 pt-8 mt-2 fz-metrics-border"
            >
              {[
                { value: count1, suffix: "+", label: "Projetos" },
                { value: count2, suffix: "%", label: "Uptime" },
                { value: count3, suffix: "", label: "Produtos" },
              ].map((m) => (
                <div key={m.label} className="flex flex-col gap-1">
                  <span className="font-heading font-extrabold text-3xl fz-metric-val">
                    {m.value}
                    {m.suffix}
                  </span>
                  <span className="text-xs font-medium fz-metric-label">
                    {m.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Column — Build Terminal & Orbiting Floating Tags */}
          <div className="hidden lg:col-span-5 lg:flex justify-end relative h-[440px] items-center px-4">
            {/* Soft faded glow background */}
            <div
              className="absolute inset-y-2 -left-28 -right-10 rounded-[40px] opacity-75 z-10 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(30,107,255,0.12) 0%, rgba(30,107,255,0.03) 55%, transparent 75%)",
                filter: "blur(20px)",
              }}
            />

            {/* Build Terminal container */}
            <div className="relative z-20 w-full max-w-sm xl:max-w-md mr-16">
              <BuildTerminal />

              {/* Orbiting floating tags around the terminal (positioned to the right) */}
              <div className="absolute inset-0 pointer-events-none z-30">
                {[
                  {
                    icon: "psychology",
                    label: "IA Aplicada",
                    top: "5%",
                    left: "98%",
                  },
                  {
                    icon: "cloud_done",
                    label: "SaaS",
                    top: "25%",
                    left: "104%",
                  },
                  {
                    icon: "sync_alt",
                    label: "Integrações",
                    top: "48%",
                    left: "106%",
                  },
                  {
                    icon: "robot",
                    label: "Automação",
                    top: "70%",
                    left: "104%",
                  },
                  {
                    icon: "bar_chart",
                    label: "Dashboards",
                    top: "90%",
                    left: "95%",
                  },
                ].map((t, i) => (
                  <motion.div
                    key={t.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
                    style={{
                      position: "absolute",
                      top: t.top,
                      left: t.left,
                      animation: `float ${5 + i * 0.7}s ease-in-out ${i * 0.5}s infinite`,
                    }}
                    className="fz-float-tag flex items-center gap-2.5 px-4 py-2.5 rounded-xl backdrop-blur-sm shadow-lg whitespace-nowrap"
                  >
                    <span className="material-symbols-outlined text-lg fz-icon-accent">
                      {t.icon}
                    </span>
                    <span className="text-[11px] font-semibold fz-float-tag-text">
                      {t.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-xs font-mono tracking-widest uppercase fz-scroll-cue">
          Scroll
        </span>
        <div className="w-px h-8 fz-scroll-line animate-pulse" />
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   SECTION 2 — ABOUT
────────────────────────────────────────────── */
function AboutSection() {
  const pillars = [
    {
      icon: "search_check",
      title: "Diagnóstico",
      desc: "Entendemos antes de codar.",
    },
    {
      icon: "hub",
      title: "Ecossistema",
      desc: "IA, dados e integrações unidos.",
    },
    {
      icon: "trending_up",
      title: "Crescimento",
      desc: "Escalabilidade desde o início.",
    },
    {
      icon: "rocket_launch",
      title: "Velocidade",
      desc: "Entregas ágeis com qualidade.",
    },
  ];

  return (
    <section className="relative h-screen flex items-center fz-section overflow-hidden">
      <div className="fz-hero-blob-1 absolute right-0 top-0 pointer-events-none opacity-50" />
      <div className="absolute inset-0 fz-bg-pattern opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-16 w-full pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-6"
          >
            <span className="fz-label font-mono text-xs font-bold tracking-[0.25em] uppercase">
              QUEM SOMOS
            </span>
            <h2 className="font-heading font-extrabold text-4xl md:text-5xl leading-tight fz-h2">
              Construindo o futuro{" "}
              <span className="fz-accent-text">através da tecnologia</span>.
            </h2>
            <p className="fz-body text-base leading-relaxed max-w-md">
              Não desenvolvemos apenas software. Analisamos processos,
              identificamos gargalos e construímos ecossistemas tecnológicos
              completos — unindo pessoas, sistemas, IA e dados.
            </p>
            <div className="fz-card-inset flex items-start gap-3 p-4 rounded-xl">
              <span className="material-symbols-outlined fz-icon-accent text-xl mt-0.5">
                psychology
              </span>
              <div>
                <p className="font-semibold text-sm fz-h2">
                  Antes de programar, entendemos seu negócio.
                </p>
                <p className="fz-body text-xs mt-0.5">
                  A maioria cria sistemas. Nós fazemos o diagnóstico primeiro.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right — pillars */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="grid grid-cols-2 gap-4"
          >
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.08 }}
                whileHover={{ scale: 1.04, y: -3 }}
                className="fz-card rounded-2xl p-5 flex flex-col gap-3 cursor-default transition-all duration-300"
              >
                <div className="fz-icon-box w-9 h-9 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg fz-icon-accent">
                    {p.icon}
                  </span>
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm fz-h2 mb-0.5">
                    {p.title}
                  </h4>
                  <p className="fz-body text-xs">{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   SECTION 2.5 — TEAM / EQUIPE
────────────────────────────────────────────── */
const TEAM = [
  {
    name: "Ezequiel Antunes",
    role: "CEO • Full Stack Developer • Software Architect • AI Engineer",
    initials: "EA",
    gradient: "from-[#1e6bff] to-[#38bdf8]",
    responsibilities: [
      "Arquitetura de Software",
      "Inteligência Artificial",
      "Desenvolvimento Full Stack",
      "Produtos",
      "Estratégia",
    ],
  },
  {
    name: "Felipe Honorato",
    role: "CEO • Marketing • Comercial • Branding",
    initials: "FH",
    gradient: "from-[#8b5cf6] to-[#ec4899]",
    responsibilities: ["Marketing", "Vendas", "Posicionamento", "Marca"],
  },
  {
    name: "Matheus Nandi",
    role: "Backend Engineer • Database Specialist",
    initials: "MN",
    gradient: "from-[#3b82f6] to-[#10b981]",
    responsibilities: [
      "APIs",
      "Banco de Dados",
      "Infraestrutura",
      "Performance",
    ],
  },
  {
    name: "Beatriz Callegari",
    role: "Project Manager (PM)",
    initials: "BC",
    gradient: "from-[#f59e0b] to-[#ef4444]",
    responsibilities: [
      "Gestão de Projetos",
      "Atendimento",
      "Planejamento",
      "Organização",
    ],
  },
];

function EquipeSection() {
  return (
    <section className="relative h-screen flex items-center fz-section overflow-hidden">
      <div className="fz-hero-blob-3 absolute left-[-100px] top-[10%] opacity-40 pointer-events-none" />
      <div className="absolute inset-0 fz-bg-pattern opacity-25 pointer-events-none" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-16 w-full pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <span className="fz-label font-mono text-xs font-bold tracking-[0.25em] uppercase">
            QUEM FAZ ACONTECER
          </span>
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl mt-2 fz-h2">
            Nossa <span className="fz-accent-text">Equipe</span> de
            Especialistas
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.6 }}
              whileHover={{ y: -6 }}
              className="fz-card rounded-2xl p-6 flex flex-col gap-5 cursor-default transition-all duration-300"
            >
              {/* Avatar Initial */}
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${m.gradient} flex items-center justify-center text-white font-heading font-extrabold text-lg shadow-md`}
              >
                {m.initials}
              </div>

              <div>
                <h3 className="font-heading font-bold text-base fz-h2 leading-snug">
                  {m.name}
                </h3>
                <p className="text-xs font-semibold fz-accent-text mt-1 line-clamp-2 leading-relaxed h-8">
                  {m.role}
                </p>
              </div>

              <div className="border-t border-white/5 pt-4 flex flex-col gap-2">
                <span className="text-[10px] font-mono tracking-wider uppercase text-white/40">
                  Foco Principal:
                </span>
                <ul className="flex flex-col gap-1.5">
                  {m.responsibilities.map((resp) => (
                    <li
                      key={resp}
                      className="flex items-center gap-2 text-xs fz-body"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1e6bff]" />
                      {resp}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   SECTION 3 — SOLUTIONS
────────────────────────────────────────────── */
const SOLUTIONS = [
  {
    icon: "straighten",
    title: "Software Sob Medida",
    desc: "Sistemas Web e aplicativos mobile customizados.",
  },
  {
    icon: "cloud",
    title: "Sistemas SaaS",
    desc: "Desenvolvimento de plataformas escaláveis por assinatura.",
  },
  {
    icon: "psychology",
    title: "Inteligência Artificial",
    desc: "Agentes inteligentes e RAG para sua operação.",
  },
  {
    icon: "settings_suggest",
    title: "Automação",
    desc: "Eliminação de retrabalho com workflows inteligentes.",
  },
  {
    icon: "insights",
    title: "Dashboards & BI",
    desc: "Dados centralizados e transformados em inteligência.",
  },
  {
    icon: "api",
    title: "Integrações & APIs",
    desc: "Conexão nativa entre seus ERPs, CRMs e bancos de dados.",
  },
  {
    icon: "phone_android",
    title: "Aplicativos Mobile",
    desc: "Apps de alta performance criados nativamente com Flutter.",
  },
  {
    icon: "contact_support",
    title: "Consultoria Tecnológica",
    desc: "Diagnóstico profundo de stack, arquitetura e processos.",
  },
];

function SolutionsSection() {
  return (
    <section className="relative h-screen flex items-center fz-section overflow-hidden">
      <div className="fz-hero-blob-2 absolute left-[-200px] top-1/2 pointer-events-none opacity-40" />
      <div className="absolute inset-0 fz-bg-pattern opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-16 w-full pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <span className="fz-label font-mono text-xs font-bold tracking-[0.25em] uppercase">
            ÁREAS DE ATUAÇÃO
          </span>
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl mt-2 fz-h2">
            Soluções que <span className="fz-accent-text">desenvolvemos</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {SOLUTIONS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.5 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="fz-card rounded-2xl p-5 flex flex-col gap-3 cursor-default transition-all duration-300 group relative overflow-hidden"
            >
              {/* Sweep */}
              <div className="absolute inset-0 w-1/3 h-full fz-card-sweep skew-x-[-15deg] translate-x-[-120%] group-hover:translate-x-[400%] transition-transform duration-700 pointer-events-none" />
              <div className="fz-icon-box w-10 h-10 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-xl fz-icon-accent">
                  {s.icon}
                </span>
              </div>
              <div>
                <h3 className="font-heading font-bold text-sm fz-h2 mb-1">
                  {s.title}
                </h3>
                <p className="fz-body text-xs leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   SECTION 4 — PRODUCTS
────────────────────────────────────────────── */
const PRODUCTS = [
  {
    name: "DP Core",
    badge: "Em Produção",
    icon: "science",
    desc: "Gestão de laboratórios clínicos com IA para apoio operacional e auditoria de processos.",
    features: [
      "Requisição online",
      "Automação de faturamento",
      "IA operacional",
      "Auditoria de guias",
    ],
    featured: true,
  },
  {
    name: "EZYX Platform",
    badge: "Logística",
    icon: "hub",
    desc: "Ecossistema de gerenciamento logístico com roteirização inteligente e painéis em tempo real.",
    features: [
      "Rastreamento ativo",
      "Otimização de rotas",
      "App motorista",
      "Dashboard de fretes",
    ],
    featured: false,
  },
  {
    name: "EZYX Fiscal",
    badge: "Fiscal",
    icon: "receipt_long",
    desc: "Emissão e controle fiscal automático integrado de ponta a ponta com as SEFAZ estaduais.",
    features: [
      "Emissão em lote",
      "Validação automatizada",
      "Manifesto eletrônico",
      "Custos de frete",
    ],
    featured: false,
  },
  {
    name: "LogVida",
    badge: "Monitoramento",
    icon: "local_shipping",
    desc: "Plataforma de gestão e monitoramento logístico em tempo real com alertas operacionais.",
    features: [
      "Status de entrega",
      "Rastreadores IoT",
      "Alertas de atraso",
      "Controle de SLA",
    ],
    featured: false,
  },
  {
    name: "CIA",
    badge: "Central de IA",
    icon: "support_agent",
    desc: "Central Inteligente de Atendimento automática integrada com agentes autônomos de voz e chat.",
    features: [
      "Ura inteligente",
      "Atendimento via WhatsApp",
      "IA Generativa",
      "RAG integrado",
    ],
    featured: false,
  },
  {
    name: "FZ OS",
    badge: "Em Desenvolvimento",
    icon: "terminal",
    desc: "Sistema operacional corporativo com orquestração de tarefas por agentes inteligentes de IA.",
    features: [
      "CRM inteligente",
      "Orquestrador de tarefas",
      "Analytics avançado",
      "Portal unificado",
    ],
    featured: true,
  },
];

function ProductsSection() {
  return (
    <section className="relative h-screen flex items-center fz-section overflow-hidden">
      <div className="fz-hero-blob-3 absolute right-[-100px] bottom-0 pointer-events-none opacity-40" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-16 w-full pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <span className="fz-label font-mono text-xs font-bold tracking-[0.25em] uppercase">
            PRODUTOS
          </span>
          <h2 className="font-heading font-extrabold text-2xl md:text-3xl mt-1.5 fz-h2">
            Plataformas da <span className="fz-accent-text">FZ Build</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {PRODUCTS.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.05, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className={`fz-product-card rounded-2xl p-5 flex flex-col gap-3.5 transition-all duration-300 ${p.featured ? "fz-product-featured" : ""}`}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <span
                  className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full fz-product-badge ${p.featured ? "fz-product-badge-featured" : ""}`}
                >
                  {p.badge}
                </span>
                <div className="w-8 h-8 rounded-lg fz-icon-box flex items-center justify-center">
                  <span
                    className={`material-symbols-outlined text-base fz-icon-accent`}
                  >
                    {p.icon}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-heading font-bold text-base fz-h2 mb-0.5">
                  {p.name}
                </h3>
                <p className="fz-body text-[11px] leading-relaxed line-clamp-2 h-9">
                  {p.desc}
                </p>
              </div>

              <ul className="grid grid-cols-2 gap-1 border-t border-white/5 pt-3">
                {p.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-1.5 text-[10px] fz-body"
                  >
                    <span className="material-symbols-outlined fz-icon-accent text-xs">
                      check_circle
                    </span>
                    <span className="truncate">{f}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   SECTION 5 — METHODOLOGY
────────────────────────────────────────────── */
const STEPS = [
  {
    n: "01",
    title: "Diagnóstico",
    desc: "Mapeamos gargalos e oportunidades.",
    icon: "search_check",
  },
  {
    n: "02",
    title: "Arquitetura",
    desc: "Stack, integrações e escopo.",
    icon: "architecture",
  },
  {
    n: "03",
    title: "Desenvolvimento",
    desc: "Sprints com entregas incrementais.",
    icon: "code",
  },
  {
    n: "04",
    title: "Implantação",
    desc: "Go-live assistido e treinamento.",
    icon: "rocket_launch",
  },
  {
    n: "05",
    title: "Evolução",
    desc: "Suporte e melhoria contínua.",
    icon: "trending_up",
  },
];

function MethodologySection() {
  return (
    <section className="relative h-screen flex items-center fz-section overflow-hidden">
      <div className="fz-hero-blob-1 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none" />
      <div className="absolute inset-0 fz-bg-pattern opacity-25 pointer-events-none" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-16 w-full pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <span className="fz-label font-mono text-xs font-bold tracking-[0.25em] uppercase">
            COMO TRABALHAMOS
          </span>
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl mt-2 fz-h2">
            Nossa <span className="fz-accent-text">Metodologia</span>
          </h2>
        </motion.div>

        <div className="relative">
          {/* Line */}
          <div className="hidden md:block absolute top-10 left-0 right-0 h-px fz-step-line" />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1, duration: 0.6 }}
                className="flex flex-col items-center text-center gap-4 group"
              >
                <div className="relative w-20 h-20 rounded-2xl fz-step-node flex items-center justify-center transition-all duration-400 group-hover:fz-step-node-active">
                  <span className="material-symbols-outlined text-2xl fz-icon-accent group-hover:scale-110 transition-transform">
                    {s.icon}
                  </span>
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full fz-step-badge flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                </div>
                <div>
                  <h4 className="font-heading font-bold fz-h2 text-sm mb-1">
                    {s.title}
                  </h4>
                  <p className="fz-body text-xs">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom trio */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-14"
        >
          {[
            {
              icon: "search_check",
              title: "Diagnóstico preciso",
              desc: "Entendemos o negócio antes de codar",
            },
            {
              icon: "architecture",
              title: "Arquitetura robusta",
              desc: "Escalabilidade planejada desde o início",
            },
            {
              icon: "hub",
              title: "Integração nativa",
              desc: "Conectamos todos os seus sistemas",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="fz-card rounded-2xl p-5 flex items-start gap-4 group hover:scale-[1.02] transition-all duration-300"
            >
              <div className="fz-icon-box w-9 h-9 rounded-xl flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-lg fz-icon-accent">
                  {item.icon}
                </span>
              </div>
              <div>
                <p className="font-semibold text-sm fz-h2 mb-0.5">
                  {item.title}
                </p>
                <p className="fz-body text-xs">{item.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   SECTION 6 — WHY FZ
────────────────────────────────────────────── */
const WHY = [
  { icon: "done_all", title: "Diagnóstico antes do desenvolvimento" },
  { icon: "inventory_2", title: "Produtos próprios consolidados" },
  { icon: "psychology", title: "IA integrada desde o início" },
  { icon: "security", title: "Arquitetura escalável e segura" },
  { icon: "emoji_events", title: "Foco absoluto em resultados" },
  { icon: "support_agent", title: "Suporte contínuo e evolução" },
];

const TECH = [
  "Next.js",
  "React",
  "TypeScript",
  "Node.js",
  "Firebase",
  "Firestore",
  "PostgreSQL",
  "Flutter",
  "Tailwind CSS",
  "Docker",
  "IA Generativa",
  "MCP",
  "RAG",
  "REST APIs",
  "Webhooks",
];

function WhySection() {
  return (
    <section className="relative h-screen flex items-center fz-section overflow-hidden">
      <div className="fz-hero-blob-2 absolute right-[-100px] top-[-100px] opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-16 w-full pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col gap-5"
          >
            <span className="fz-label font-mono text-xs font-bold tracking-[0.25em] uppercase">
              POR QUE A FZ?
            </span>
            <h2 className="font-heading font-extrabold text-4xl md:text-5xl leading-tight fz-h2">
              Visão estratégica{" "}
              <span className="fz-accent-text">+ excelência técnica</span>
            </h2>
            <p className="fz-body leading-relaxed max-w-sm">
              Não somos uma fábrica de software. Somos parceiros de tecnologia
              que entendem o seu negócio e entregam resultados reais.
            </p>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex flex-col gap-3"
          >
            {WHY.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.07 }}
                whileHover={{ x: 6 }}
                className="flex items-center gap-4 p-3 rounded-xl fz-why-item transition-all duration-200"
              >
                <div className="fz-icon-box w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-base fz-icon-accent">
                    {item.icon}
                  </span>
                </div>
                <span className="font-semibold text-sm fz-h2">
                  {item.title}
                </span>
              </motion.div>
            ))}

            {/* Tech tags */}
            <div className="flex flex-wrap gap-2 mt-3">
              {TECH.map((t, i) => (
                <motion.span
                  key={t}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 + i * 0.04 }}
                  whileHover={{ scale: 1.08 }}
                  className="fz-tech-tag px-3 py-1 rounded-full text-xs font-medium cursor-default transition-all duration-200"
                >
                  {t}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   SECTION 7 — CTA
────────────────────────────────────────────── */
function CTASection() {
  return (
    <section className="relative h-screen flex items-center fz-section fz-cta-section overflow-hidden">
      {/* Rings */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute rounded-full fz-ring border animate-pulse"
            style={{
              width: `${i * 300}px`,
              height: `${i * 300}px`,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              animationDelay: `${i * 0.6}s`,
              animationDuration: "3s",
            }}
          />
        ))}
      </div>

      <div className="fz-hero-blob-1 absolute left-[-200px] top-0 opacity-30 pointer-events-none" />
      <div className="fz-hero-blob-3 absolute right-[-200px] bottom-0 opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-16 w-full pt-16 text-center flex flex-col items-center gap-6">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fz-badge flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase px-4 py-2 rounded-full"
        >
          <span className="w-1.5 h-1.5 rounded-full fz-badge-dot animate-pulse" />
          Vamos Conversar
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading font-extrabold text-4xl md:text-5xl leading-[1.1] tracking-tight fz-h2"
        >
          Vamos construir a próxima{" "}
          <span className="fz-accent-text">solução da sua empresa?</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-4 justify-center mt-2"
        >
          <Link
            href="https://wa.me/5511954297115?text=Ol%C3%A1%2C%20gostaria%20de%20solicitar%20um%20diagn%C3%B3stico%20da%20FZ%20Build%20Solutions."
            target="_blank"
            className="fz-btn-primary relative overflow-hidden group font-bold text-sm px-8 py-3.5 rounded-full flex items-center gap-2"
          >
            <span className="relative z-10">WhatsApp Comercial (SP)</span>
            <span className="fz-btn-shine absolute inset-0 w-1/3 h-full skew-x-[-15deg] translate-x-[-120%] group-hover:translate-x-[400%] transition-transform duration-700" />
          </Link>
          <Link
            href="https://wa.me/5548998503327?text=Ol%C3%A1%2C%20gostaria%20de%20falar%20com%20a%20equipe%20da%20FZ%20Build%20Solutions."
            target="_blank"
            className="fz-btn-ghost font-medium text-sm px-8 py-3.5 rounded-full border"
          >
            WhatsApp Operacional (SC)
          </Link>
        </motion.div>

        {/* Corporate Information Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl border-t border-white/5 pt-6 mt-4 text-left text-xs"
        >
          <div className="flex flex-col gap-2.5">
            <div>
              <span className="font-semibold fz-h2 block mb-0.5">Endereço</span>
              <span className="fz-body block">
                Rua Porto Alegre, 520 · Bairro Vila Moema
              </span>
              <span className="fz-body block">
                CEP: 88705-882 · Tubarão – SC
              </span>
            </div>
            <div>
              <span className="font-semibold fz-h2 block mb-0.5">E-mail</span>
              <Link
                href="mailto:fzbuild.solutions@gmail.com"
                className="hover:text-[#1e6bff] fz-body underline transition-colors block"
              >
                fzbuild.solutions@gmail.com
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <div>
              <span className="font-semibold text-white block mb-0.5">
                Dados Corporativos
              </span>
              <span className="opacity-80 block">FZ Build Solutions LTDA</span>
              <span className="opacity-80 block">CNPJ: 67.700.723/0001-74</span>
              <span className="opacity-80 block">Fundada em 2026</span>
            </div>
          </div>
        </motion.div>

        {/* Footer strip (relative, inline to prevent overlapping on shorter viewports) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="w-full flex flex-col sm:flex-row justify-between items-center border-t border-white/5 pt-4 mt-2 fz-body text-[10px] opacity-40 gap-2"
        >
          <span className="flex items-center gap-2">
            <Image
              src="/fzbuildsemfundo.png"
              alt=""
              width={20}
              height={20}
              className="h-5 w-auto fz-logo-img"
            />
            <span>
              © 2026 FZ Build Solutions LTDA. Todos os direitos reservados.
            </span>
          </span>
          <div className="flex items-center gap-3">
            <span>Tubarão/SC</span>
            <span>·</span>
            <span>São Paulo/SP</span>
            <span>·</span>
            <span className="font-mono">CNPJ: 67.700.723/0001-74</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   ROOT
────────────────────────────────────────────── */
const LABELS = [
  "Início",
  "Sobre",
  "Equipe",
  "Soluções",
  "Produtos",
  "Metodologia",
  "Por que FZ",
  "Contato",
];

function LandingPage() {
  return (
    <div className="fz-root">
      <NavBar />
      <FullPageScroll sectionLabels={LABELS}>
        <HeroSection />
        <AboutSection />
        <EquipeSection />
        <SolutionsSection />
        <ProductsSection />
        <MethodologySection />
        <WhySection />
        <CTASection />
      </FullPageScroll>
    </div>
  );
}

export default function Home() {
  return (
    <ThemeProvider>
      {/* Particle network canvas — behind everything (z-index 0) */}
      <ParticleCanvas />
      <LandingPage />
    </ThemeProvider>
  );
}
