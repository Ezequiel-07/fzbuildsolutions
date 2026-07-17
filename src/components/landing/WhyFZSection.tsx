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
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

const WHY_ITEMS = [
  {
    icon: "done_all",
    title: "Diagnóstico antes do desenvolvimento",
    desc: "Primeiro entendemos, depois construímos.",
  },
  {
    icon: "inventory_2",
    title: "Produtos próprios consolidados",
    desc: "DP Core, EZYX e FZ OS já em produção.",
  },
  {
    icon: "psychology",
    title: "IA integrada desde o início",
    desc: "Não como add-on — como pilar da solução.",
  },
  {
    icon: "security",
    title: "Arquitetura escalável e segura",
    desc: "Projetada para crescer junto com você.",
  },
  {
    icon: "emoji_events",
    title: "Foco absoluto em resultados",
    desc: "Métricas reais, ROI mensurável.",
  },
  {
    icon: "support_agent",
    title: "Suporte contínuo e evolução",
    desc: "Não entregamos e sumimos. Evoluímos.",
  },
];

const TECH_STACK = [
  "Next.js 15",
  "React 19",
  "TypeScript",
  "Node.js",
  "PostgreSQL",
  "Firebase",
  "Docker",
  "IA Generativa",
  "APIs REST",
  "Azure / AWS",
  "CI/CD",
  "Framer Motion",
];

export function WhyFZSection() {
  return (
    <section className="relative bg-[#030710] py-28 md:py-36 px-5 md:px-20 overflow-hidden">
      {/* BG */}
      <div className="absolute inset-0 bg-dots-dark opacity-40" />
      <div className="blob-cyan w-[600px] h-[600px] top-0 left-[-200px] opacity-20" />
      <div className="blob-blue w-[500px] h-[500px] bottom-0 right-[-150px] opacity-15" />

      <div className="relative z-10 max-w-[1400px] mx-auto">
        {/* Why FZ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-24">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block font-mono text-xs font-bold text-[#00e3fd] tracking-[0.25em] uppercase mb-4">
              POR QUE A FZ?
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
              Visão estratégica <br />
              <span className="text-shimmer">+ excelência técnica</span>
            </h2>
            <p className="text-white/50 text-lg leading-relaxed mb-8">
              Não somos uma fábrica de software. Somos parceiros de tecnologia
              que entendem o seu negócio e entregam resultados reais.
            </p>

            {/* Big stat */}
            <div className="glass-card rounded-2xl p-6 inline-flex flex-col gap-1">
              <span className="text-4xl font-heading font-extrabold text-white">
                100%
              </span>
              <span className="text-white/40 text-sm">
                dos projetos entregues dentro do prazo
              </span>
            </div>
          </motion.div>

          {/* Right — checklist */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid grid-cols-1 gap-3"
          >
            {WHY_ITEMS.map((item) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                whileHover={{ x: 6 }}
                className="flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-[#0066ff]/20 transition-all duration-300 group"
              >
                <div className="w-9 h-9 rounded-lg bg-[#0066ff]/10 border border-[#0066ff]/20 flex items-center justify-center shrink-0 group-hover:bg-[#0066ff]/20 transition-colors">
                  <span className="material-symbols-outlined text-[#0066ff] text-lg">
                    {item.icon}
                  </span>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm mb-0.5">
                    {item.title}
                  </p>
                  <p className="text-white/35 text-xs">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h3 className="text-center font-heading text-xl font-bold text-white mb-8">
            Stack tecnológico que dominamos
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {TECH_STACK.map((tech, i) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.4 }}
                whileHover={{ scale: 1.08, borderColor: "rgba(0,102,255,0.6)" }}
                className="px-4 py-2 rounded-full text-sm font-medium text-white/50 border border-white/8 bg-white/[0.03] cursor-default hover:text-white hover:bg-[#0066ff]/10 transition-all duration-200"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
