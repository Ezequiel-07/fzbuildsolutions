"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  delay: Math.random() * 8,
  duration: 8 + Math.random() * 10,
  size: 1 + Math.random() * 2,
}));

function AnimatedCounter({
  target,
  suffix = "",
}: {
  target: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const duration = 1800;
          const step = (timestamp: number) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center bg-grid-dark overflow-hidden"
    >
      {/* Animated blobs */}
      <div className="blob-blue w-[600px] h-[600px] top-[-200px] right-[-100px] animate-glow" />
      <div
        className="blob-cyan w-[400px] h-[400px] bottom-[-100px] left-[10%] animate-glow"
        style={{ animationDelay: "2s" }}
      />

      {/* Floating particles */}
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-[#0066ff]/40 animate-particle-float"
          style={{
            left: `${p.x}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}

      {/* Top gradient fade */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#050812] to-transparent z-10" />
      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050812] to-transparent z-10" />

      <div className="relative z-20 w-full max-w-[1400px] mx-auto px-5 md:px-20 pt-28 pb-16">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="flex flex-col items-start gap-8 max-w-3xl"
        >
          {/* Badge */}
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 border border-[#0066ff]/30 bg-[#0066ff]/10 text-[#00e3fd] text-xs font-bold tracking-[0.2em] uppercase px-4 py-2 rounded-full backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00e3fd] animate-pulse" />
              Tecnologia de Alta Performance
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="font-heading text-5xl md:text-7xl font-extrabold text-white leading-[1.05] tracking-tight"
          >
            Transformamos processos <br className="hidden md:block" />
            complexos em{" "}
            <span className="text-shimmer">software inteligente</span>.
          </motion.h1>

          {/* Sub */}
          <motion.p
            variants={fadeUp}
            className="text-white/55 text-lg md:text-xl leading-relaxed max-w-xl"
          >
            A FZ Build desenvolve plataformas SaaS, Inteligência Artificial,
            automação de processos e soluções sob medida — eliminando retrabalho
            e gerando decisões com dados confiáveis.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mt-2">
            <Link
              href="mailto:contato@fzbuild.solutions"
              id="hero-cta-primary"
              className="relative inline-flex items-center gap-2 bg-[#0066ff] text-white font-bold text-sm tracking-wide px-8 py-4 rounded-full group overflow-hidden hover:shadow-[0_0_40px_rgba(0,102,255,0.5)] transition-all duration-300"
            >
              <span className="relative z-10 flex items-center gap-2">
                Solicitar Diagnóstico
                <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-[#0066ff] via-[#0088ff] to-[#00aaff] opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <Link
              href="#solucoes"
              id="hero-cta-secondary"
              className="inline-flex items-center gap-2 border border-white/15 text-white/70 hover:text-white hover:border-white/30 font-medium text-sm px-8 py-4 rounded-full transition-all duration-300 backdrop-blur-sm hover:bg-white/5"
            >
              Ver Soluções
            </Link>
          </motion.div>

          {/* Metrics bar */}
          <motion.div
            variants={fadeUp}
            className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t border-white/8 w-full"
          >
            {[
              { value: 12, suffix: "+", label: "Projetos entregues" },
              { value: 99, suffix: "%", label: "Uptime nas plataformas" },
              { value: 3, suffix: "", label: "Produtos próprios ativos" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <span className="text-2xl md:text-3xl font-bold font-heading text-white">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </span>
                <span className="text-white/40 text-xs font-medium">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Floating tech tags */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="hidden lg:flex absolute right-20 top-1/2 -translate-y-1/2 flex-col gap-3"
        >
          {[
            { icon: "psychology", label: "IA Aplicada" },
            { icon: "cloud_done", label: "SaaS" },
            { icon: "sync_alt", label: "Integrações" },
            { icon: "robot", label: "Automação" },
            { icon: "bar_chart", label: "Dashboards" },
          ].map((tag, i) => (
            <motion.div
              key={tag.label}
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
              }}
              className="glass-card flex items-center gap-3 px-5 py-3 rounded-2xl group hover:glass-card-blue transition-all cursor-default"
            >
              <span className="material-symbols-outlined text-[#00e3fd] text-xl">
                {tag.icon}
              </span>
              <span className="text-white/70 text-sm font-medium group-hover:text-white transition-colors">
                {tag.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-white/30 text-xs font-mono tracking-widest uppercase">
          Scroll
        </span>
        <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent animate-pulse" />
      </motion.div>
    </section>
  );
}
