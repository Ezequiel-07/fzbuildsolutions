"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="relative bg-[#050812] py-28 md:py-36 px-5 md:px-20 overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,102,255,0.15)_0%,_transparent_70%)]" />
      <div className="absolute inset-0 bg-grid-dark opacity-30" />

      {/* Floating orbs */}
      <div className="blob-blue w-[500px] h-[500px] top-[-150px] left-[-100px] opacity-30 animate-glow" />
      <div
        className="blob-cyan w-[400px] h-[400px] bottom-[-100px] right-[-100px] opacity-20 animate-glow"
        style={{ animationDelay: "2s" }}
      />

      {/* Pulse rings */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute rounded-full border border-[#0066ff]/10 animate-pulse-ring"
            style={{
              width: `${i * 280}px`,
              height: `${i * 280}px`,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              animationDelay: `${i * 0.5}s`,
              animationDuration: "3s",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center gap-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-flex items-center gap-2 border border-[#0066ff]/30 bg-[#0066ff]/10 text-[#00e3fd] text-xs font-bold tracking-[0.2em] uppercase px-4 py-2 rounded-full backdrop-blur-sm mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00e3fd] animate-pulse" />
            Vamos Conversar
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-heading text-4xl md:text-6xl font-extrabold text-white leading-[1.1] tracking-tight"
        >
          Vamos construir a próxima{" "}
          <span className="text-shimmer">solução da sua empresa?</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-white/50 text-lg leading-relaxed max-w-xl"
        >
          Cada empresa tem desafios únicos. Agende uma sessão de diagnóstico
          gratuita e descubra como a tecnologia pode transformar sua operação.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <Link
            href="mailto:contato@fzbuild.solutions"
            id="cta-final-primary"
            className="relative inline-flex items-center gap-3 bg-[#0066ff] text-white font-bold text-base px-10 py-5 rounded-full group overflow-hidden hover:shadow-[0_0_60px_rgba(0,102,255,0.6)] transition-all duration-300"
          >
            <span className="relative z-10 flex items-center gap-2">
              Agendar Diagnóstico Gratuito
              <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-[#0044cc] via-[#0066ff] to-[#0088ff] opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="absolute inset-0 w-1/3 h-full bg-white/25 skew-x-[-15deg] translate-x-[-120%] group-hover:translate-x-[400%] transition-transform duration-700" />
          </Link>

          <Link
            href="/login"
            id="cta-final-secondary"
            className="inline-flex items-center gap-2 border border-white/15 text-white/70 hover:text-white hover:border-white/30 font-medium text-base px-10 py-5 rounded-full transition-all backdrop-blur-sm hover:bg-white/5"
          >
            Acessar Plataforma
          </Link>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-3 text-white/30 text-xs mt-4"
        >
          <span className="material-symbols-outlined text-sm text-[#00e3fd]">
            verified
          </span>
          <span>Sem compromisso · Resposta em até 24h · 100% confidencial</span>
        </motion.div>
      </div>
    </section>
  );
}
