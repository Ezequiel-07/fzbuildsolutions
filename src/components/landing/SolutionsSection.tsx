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

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const SOLUTIONS = [
  {
    icon: "psychology",
    title: "Inteligência Artificial",
    desc: "Agentes inteligentes, assistentes corporativos, automação com IA e análise preditiva de dados.",
    gradient: "from-[#0066ff]/20 to-[#00e3fd]/10",
    border: "border-[#0066ff]/20",
    glow: "hover:shadow-[0_0_40px_rgba(0,102,255,0.2)]",
    iconColor: "text-[#00e3fd]",
  },
  {
    icon: "cloud",
    title: "Sistemas SaaS",
    desc: "Plataformas modernas, escaláveis e seguras, construídas com tecnologias de última geração.",
    gradient: "from-[#7c3aed]/20 to-[#0066ff]/10",
    border: "border-[#7c3aed]/20",
    glow: "hover:shadow-[0_0_40px_rgba(124,58,237,0.2)]",
    iconColor: "text-[#a78bfa]",
  },
  {
    icon: "settings_suggest",
    title: "Automação de Processos",
    desc: "Elimine tarefas repetitivas e aumente a produtividade da sua equipe com workflows inteligentes.",
    gradient: "from-[#059669]/15 to-[#00e3fd]/10",
    border: "border-[#059669]/20",
    glow: "hover:shadow-[0_0_40px_rgba(5,150,105,0.2)]",
    iconColor: "text-[#34d399]",
  },
  {
    icon: "api",
    title: "Integração de Sistemas",
    desc: "Conectamos ERPs, APIs, CRMs e qualquer sistema necessário de forma nativa e confiável.",
    gradient: "from-[#f59e0b]/15 to-[#0066ff]/10",
    border: "border-[#f59e0b]/20",
    glow: "hover:shadow-[0_0_40px_rgba(245,158,11,0.2)]",
    iconColor: "text-[#fbbf24]",
  },
  {
    icon: "insights",
    title: "Dashboards & BI",
    desc: "Dados confiáveis transformados em visualizações poderosas para decisões ágeis e precisas.",
    gradient: "from-[#ec4899]/15 to-[#7c3aed]/10",
    border: "border-[#ec4899]/20",
    glow: "hover:shadow-[0_0_40px_rgba(236,72,153,0.2)]",
    iconColor: "text-[#f472b6]",
  },
  {
    icon: "straighten",
    title: "Desenvolvimento Sob Medida",
    desc: "Cada empresa possui necessidades únicas. Criamos exatamente o que o seu cenário exige.",
    gradient: "from-[#0066ff]/20 to-[#7c3aed]/10",
    border: "border-[#0066ff]/20",
    glow: "hover:shadow-[0_0_40px_rgba(0,102,255,0.2)]",
    iconColor: "text-[#60a5fa]",
  },
];

export function SolutionsSection() {
  return (
    <section
      id="solucoes"
      className="relative bg-[#050812] py-28 md:py-36 px-5 md:px-20 overflow-hidden"
    >
      {/* Background dots */}
      <div className="absolute inset-0 bg-dots-dark opacity-50" />
      {/* Blob */}
      <div className="blob-blue w-[500px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30" />

      <div className="relative z-10 max-w-[1400px] mx-auto">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.span
            variants={fadeUp}
            className="inline-block font-mono text-xs font-bold text-[#00e3fd] tracking-[0.25em] uppercase mb-4"
          >
            ÁREAS DE ATUAÇÃO
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="font-heading text-4xl md:text-5xl font-extrabold text-white tracking-tight"
          >
            Soluções que <span className="text-shimmer">desenvolvemos</span>
          </motion.h2>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {SOLUTIONS.map((s) => (
            <motion.div
              key={s.title}
              variants={fadeUp}
              whileHover={{ y: -6, scale: 1.01 }}
              className={`relative rounded-2xl p-7 border ${s.border} bg-gradient-to-br ${s.gradient} backdrop-blur-sm transition-all duration-300 ${s.glow} group cursor-default overflow-hidden`}
            >
              {/* Beam sweep on hover */}
              <div className="absolute inset-0 w-1/3 h-full bg-white/5 skew-x-[-15deg] translate-x-[-120%] group-hover:translate-x-[400%] transition-transform duration-700 pointer-events-none" />

              <div className="relative z-10">
                <div className="mb-5 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/10">
                  <span
                    className={`material-symbols-outlined text-2xl ${s.iconColor}`}
                  >
                    {s.icon}
                  </span>
                </div>
                <h3 className="font-heading text-lg font-bold text-white mb-3">
                  {s.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
