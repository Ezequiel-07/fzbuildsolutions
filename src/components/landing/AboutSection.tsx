"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };

const PILLARS = [
  {
    icon: "search_check",
    title: "Diagnóstico",
    desc: "Entendemos a fundo antes de propor qualquer solução.",
    color: "#0066ff",
  },
  {
    icon: "hub",
    title: "Ecossistema",
    desc: "Unimos IA, dados e integrações em um só ambiente.",
    color: "#00e3fd",
  },
  {
    icon: "trending_up",
    title: "Crescimento",
    desc: "Soluções que escalam conforme o seu negócio evolui.",
    color: "#a78bfa",
  },
  {
    icon: "rocket_launch",
    title: "Velocidade",
    desc: "Entregas ágeis sem abrir mão da qualidade técnica.",
    color: "#34d399",
  },
];

export function AboutSection() {
  return (
    <section
      id="quem-somos"
      className="relative bg-[#030710] py-28 md:py-36 px-5 md:px-20 overflow-hidden"
    >
      {/* BG */}
      <div className="absolute inset-0 bg-dots-dark opacity-50" />
      <div className="blob-blue w-[600px] h-[600px] top-1/2 right-[-200px] -translate-y-1/2 opacity-15" />

      <div className="relative z-10 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left text */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="flex flex-col gap-6"
          >
            <motion.span
              variants={fadeUp}
              className="inline-block font-mono text-xs font-bold text-[#00e3fd] tracking-[0.25em] uppercase"
            >
              QUEM SOMOS
            </motion.span>

            <motion.h2
              variants={fadeUp}
              className="font-heading text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight"
            >
              Construindo o futuro dos negócios{" "}
              <span className="text-shimmer">através da tecnologia</span>.
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="text-white/50 text-lg leading-relaxed"
            >
              Não desenvolvemos apenas software. Analisamos processos,
              identificamos gargalos e construímos ecossistemas tecnológicos
              completos que unem pessoas, sistemas, IA e dados.
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="text-white/40 leading-relaxed"
            >
              Nosso objetivo é simples:{" "}
              <span className="text-white font-semibold">reduzir custos</span>,{" "}
              <span className="text-white font-semibold">
                eliminar desperdícios
              </span>{" "}
              e{" "}
              <span className="text-white font-semibold">
                acelerar o crescimento
              </span>{" "}
              dos nossos clientes — com tecnologia que realmente funciona.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex items-center gap-3 mt-2"
            >
              <div className="w-10 h-10 rounded-xl bg-[#0066ff]/20 border border-[#0066ff]/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#00e3fd] text-xl">
                  psychology
                </span>
              </div>
              <div>
                <p className="text-white font-semibold text-sm">
                  Antes de programar, entendemos seu negócio.
                </p>
                <p className="text-white/35 text-xs">
                  A maioria cria sistemas. Nós primeiro fazemos o diagnóstico.
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right — pillars */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid grid-cols-2 gap-4"
          >
            {PILLARS.map((pillar) => (
              <motion.div
                key={pillar.title}
                variants={fadeUp}
                whileHover={{ scale: 1.04, y: -4 }}
                className="glass-card rounded-2xl p-6 flex flex-col gap-3 group transition-all duration-300 hover:glow-border cursor-default"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: `${pillar.color}15`,
                    border: `1px solid ${pillar.color}30`,
                  }}
                >
                  <span
                    className="material-symbols-outlined text-xl transition-transform group-hover:scale-110"
                    style={{ color: pillar.color }}
                  >
                    {pillar.icon}
                  </span>
                </div>
                <div>
                  <h4 className="font-heading font-bold text-white text-base mb-1">
                    {pillar.title}
                  </h4>
                  <p className="text-white/40 text-xs leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
