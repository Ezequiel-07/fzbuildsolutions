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
  show: { transition: { staggerChildren: 0.13 } },
};

const PRODUCTS = [
  {
    id: "dp-core",
    name: "DP Core",
    badge: "Em Produção",
    badgeColor: "bg-[#00e3fd]/15 text-[#00e3fd] border border-[#00e3fd]/30",
    icon: "science",
    iconColor: "text-[#00e3fd]",
    subtitle: "Management of Clinical Labs & Diagnostic Centers",
    desc: "Plataforma completa para gestão físico-financeira de laboratórios clínicos e centros de diagnóstico, com IA para apoio operacional.",
    features: [
      "Requisição online",
      "Automação de codificação",
      "Integrações nativas (APLIS, etc.)",
      "Painéis gerenciais",
      "IA para apoio operacional",
      "Auditoria de processos",
    ],
    featured: true,
    link: null,
  },
  {
    id: "fz-os",
    name: "FZ OS",
    badge: "Em Desenvolvimento",
    badgeColor: "bg-white/5 text-white/50 border border-white/10",
    icon: "terminal",
    iconColor: "text-[#a78bfa]",
    subtitle: "Sistema Operacional Corporativo com Agentes Inteligentes",
    desc: "Orquestração de tarefas complexas, CRM inteligente e automação total para empresas que precisam de alta performance operacional.",
    features: [
      "CRM Inteligente",
      "Automação Total",
      "Analytics",
      "Portal do Cliente",
    ],
    featured: false,
    link: null,
  },
  {
    id: "ezyx",
    name: "EZYX",
    badge: "Logística",
    badgeColor: "bg-[#f59e0b]/15 text-[#fbbf24] border border-[#f59e0b]/30",
    icon: "local_shipping",
    iconColor: "text-[#fbbf24]",
    subtitle: "Plataforma de Gerenciamento Logístico",
    desc: "Gestão completa de frotas, rotas otimizadas com IA e controle total da logística em tempo real.",
    features: [
      "Rastreamento em tempo real",
      "Otimização de rotas",
      "Gestão de ordens de serviço",
      "App para motoristas",
      "Dashboards e BI",
      "Integração financeira",
    ],
    featured: true,
    link: null,
  },
];

export function ProductsSection() {
  return (
    <section
      id="produtos"
      className="relative bg-[#030710] py-28 md:py-36 px-5 md:px-20 overflow-hidden"
    >
      {/* BG grid */}
      <div className="absolute inset-0 bg-grid-dark opacity-60" />
      {/* Glow blobs */}
      <div className="blob-blue w-[700px] h-[700px] top-0 right-[-200px] opacity-20" />
      <div className="blob-cyan w-[400px] h-[400px] bottom-0 left-[-100px] opacity-15" />

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
            PRODUTOS
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="font-heading text-4xl md:text-5xl font-extrabold text-white tracking-tight"
          >
            Plataformas construídas pela{" "}
            <span className="text-shimmer">FZ Build</span>
          </motion.h2>
        </motion.div>

        {/* Video showcase banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl overflow-hidden mb-12 border border-white/8 group"
        >
          <video
            src="/videodashboardfundo.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-[280px] md:h-[400px] object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030710] via-[#030710]/60 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 px-8 text-center">
            <span className="inline-flex items-center gap-2 bg-[#0066ff]/20 border border-[#0066ff]/30 text-[#00e3fd] text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-4 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00e3fd] animate-pulse" />
              Live Preview — DP Core Dashboard
            </span>
            <p className="text-white/60 text-sm max-w-md">
              Interface real da plataforma DP Core em operação
            </p>
          </div>
        </motion.div>

        {/* Product Cards */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {PRODUCTS.map((product) => (
            <motion.div
              key={product.id}
              variants={fadeUp}
              whileHover={{ y: -5 }}
              className={`relative rounded-3xl p-8 border overflow-hidden flex flex-col gap-5 transition-all duration-300 ${
                product.featured
                  ? "bg-gradient-to-br from-[#0a1628] to-[#050d1f] border-[#0066ff]/25 hover:border-[#0066ff]/50 hover:shadow-[0_0_50px_rgba(0,102,255,0.15)]"
                  : "bg-[#080d18] border-white/6 hover:border-white/15"
              }`}
            >
              {/* Beam sweep */}
              <div className="absolute inset-0 w-1/3 h-full bg-white/3 skew-x-[-15deg] translate-x-[-120%] hover:translate-x-[400%] transition-transform duration-1000 pointer-events-none" />

              {/* Decorative glow top right */}
              {product.featured && (
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#0066ff]/10 rounded-full blur-2xl" />
              )}

              {/* Header row */}
              <div className="flex items-start justify-between">
                <span
                  className={`text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full ${product.badgeColor}`}
                >
                  {product.badge}
                </span>
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center">
                  <span
                    className={`material-symbols-outlined text-xl ${product.iconColor}`}
                  >
                    {product.icon}
                  </span>
                </div>
              </div>

              {/* Title */}
              <div>
                <h3 className="font-heading text-2xl font-bold text-white mb-1">
                  {product.name}
                </h3>
                <p className="text-[#0066ff] text-xs font-medium">
                  {product.subtitle}
                </p>
              </div>

              {/* Description */}
              <p className="text-white/45 text-sm leading-relaxed">
                {product.desc}
              </p>

              {/* Features */}
              <ul className="grid grid-cols-2 gap-2">
                {product.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-xs text-white/60"
                  >
                    <span className="material-symbols-outlined text-[#00e3fd] text-sm">
                      check_circle
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
