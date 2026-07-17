"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const STEPS = [
  {
    number: "01",
    title: "Diagnóstico",
    desc: "Mergulhamos fundo na sua operação. Identificamos gargalos, desperdícios e oportunidades de melhoria antes de escrever uma linha de código.",
    icon: "search_check",
    color: "#0066ff",
  },
  {
    number: "02",
    title: "Arquitetura",
    desc: "Projetamos a solução ideal: stack tecnológica, integrações necessárias, fluxos de dados e escopo de entrega.",
    icon: "architecture",
    color: "#00e3fd",
  },
  {
    number: "03",
    title: "Desenvolvimento",
    desc: "Sprints ágeis com entregas incrementais. Você acompanha o progresso em tempo real e valida cada funcionalidade.",
    icon: "code",
    color: "#a78bfa",
  },
  {
    number: "04",
    title: "Implantação",
    desc: "Go-live assistido, treinamento da equipe e monitoramento intensivo no período inicial para garantir uma transição suave.",
    icon: "rocket_launch",
    color: "#34d399",
  },
  {
    number: "05",
    title: "Evolução",
    desc: "Suporte contínuo, monitoramento de performance e evolução constante da plataforma conforme o seu negócio cresce.",
    icon: "trending_up",
    color: "#fbbf24",
  },
];

export function MethodologySection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const lineWidth = useTransform(scrollYProgress, [0.1, 0.9], ["0%", "100%"]);

  return (
    <section
      id="metodologia"
      ref={ref}
      className="relative bg-[#050812] py-28 md:py-36 px-5 md:px-20 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-grid-dark opacity-40" />
      <div className="blob-blue w-[400px] h-[400px] bottom-0 right-0 opacity-20" />

      <div className="relative z-10 max-w-[1400px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <span className="inline-block font-mono text-xs font-bold text-[#00e3fd] tracking-[0.25em] uppercase mb-4">
            COMO TRABALHAMOS
          </span>
          <h2 className="font-heading text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Nossa <span className="text-shimmer">Metodologia</span>
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Animated progress line (desktop) */}
          <div className="hidden md:block absolute top-10 left-0 right-0 h-px bg-white/6">
            <motion.div
              style={{ width: lineWidth }}
              className="h-full bg-gradient-to-r from-[#0066ff] to-[#00e3fd]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex flex-col items-center text-center gap-5 group"
              >
                {/* Step node */}
                <div
                  className="relative w-20 h-20 rounded-2xl flex items-center justify-center border border-white/8 bg-[#0a0f1e] transition-all duration-500 group-hover:scale-110"
                  style={{
                    boxShadow: `0 0 0 0 ${step.color}00`,
                  }}
                >
                  {/* Glow ring */}
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      boxShadow: `0 0 30px ${step.color}40, 0 0 0 1px ${step.color}30`,
                    }}
                  />
                  <span
                    className="material-symbols-outlined text-2xl transition-colors duration-300"
                    style={{ color: step.color }}
                  >
                    {step.icon}
                  </span>
                  {/* Number badge */}
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#050812] border border-white/10 flex items-center justify-center text-xs font-bold text-white/40 group-hover:text-white group-hover:border-white/30 transition-all">
                    {i + 1}
                  </span>
                </div>

                <div>
                  <h4 className="font-heading font-bold text-white text-base mb-2">
                    {step.title}
                  </h4>
                  <p className="text-white/40 text-xs leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom differentials box */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {[
            {
              icon: "search_check",
              title: "Diagnóstico preciso",
              desc: "Entendemos o negócio antes de codar",
              color: "text-[#00e3fd]",
            },
            {
              icon: "architecture",
              title: "Arquitetura robusta",
              desc: "Escalabilidade planejada desde o início",
              color: "text-[#a78bfa]",
            },
            {
              icon: "hub",
              title: "Integração nativa",
              desc: "Conectamos todos os seus sistemas",
              color: "text-[#34d399]",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="glass-card rounded-2xl p-6 flex items-start gap-4 group hover:glass-card-blue transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                <span
                  className={`material-symbols-outlined text-xl ${item.color}`}
                >
                  {item.icon}
                </span>
              </div>
              <div>
                <p className="text-white font-semibold text-sm mb-1">
                  {item.title}
                </p>
                <p className="text-white/40 text-xs">{item.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
