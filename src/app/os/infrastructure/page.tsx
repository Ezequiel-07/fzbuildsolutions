"use client";

import { motion } from "framer-motion";
import {
  Server,
  Activity,
  ShieldAlert,
  Cpu,
  HardDrive,
  RefreshCw,
} from "lucide-react";

export default function InfrastructurePage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 min-h-screen bg-transparent select-none">
      <div className="max-w-[1600px] mx-auto w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 glass-card bg-white/70 backdrop-blur-xl border border-white/40 p-6 rounded-2xl shadow-xl shadow-blue-900/5">
          <div>
            <h1 className="font-heading text-2xl font-extrabold tracking-tight text-slate-800 uppercase">
              Mapa de Infraestrutura
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Monitoramento de ambientes, servidores e deploys
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Sistemas Operacionais
            </span>
            <button className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg font-bold shadow-sm flex items-center gap-2 hover:bg-slate-50 active:scale-95 transition-all text-xs font-sans">
              <RefreshCw className="h-4 w-4" />
              <span>Atualizar Dados</span>
            </button>
          </div>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Status Global",
              value: "99.98%",
              sub: "Uptime (30d)",
              icon: Activity,
              color: "text-green-500",
            },
            {
              title: "Servidores Ativos",
              value: "24",
              sub: "AWS / Vercel",
              icon: Server,
              color: "text-[#003d9b]",
            },
            {
              title: "Consumo de CPU",
              value: "42%",
              sub: "Média Global",
              icon: Cpu,
              color: "text-[#00e3fd]",
            },
            {
              title: "Erros Críticos",
              value: "0",
              sub: "Últimas 24h",
              icon: ShieldAlert,
              color: "text-red-500",
            },
          ].map((stat, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i}
              className="glass-card bg-white/70 backdrop-blur-xl border border-white/40 p-6 rounded-2xl shadow-lg shadow-blue-900/5 flex items-start justify-between group hover:scale-[1.02] transition-transform"
            >
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  {stat.title}
                </p>
                <h3 className="font-heading text-3xl font-extrabold text-slate-800">
                  {stat.value}
                </h3>
                <p className="text-xs text-slate-500 mt-2 font-medium">
                  {stat.sub}
                </p>
              </div>
              <div
                className={`p-3 rounded-xl bg-white shadow-sm border border-slate-100 ${stat.color}`}
              >
                <stat.icon className="w-5 h-5" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Environment Map */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Production */}
          <div className="lg:col-span-2 glass-card bg-[#f8f9fb]/80 backdrop-blur-xl border border-white/40 p-6 rounded-3xl shadow-xl shadow-blue-900/5 min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-mono text-xs font-bold tracking-widest text-[#003d9b] uppercase">
                Produção (Live)
              </h3>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-500">
                  Tudo operante
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {[1, 2, 3].map((server) => (
                <div
                  key={server}
                  className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-50 text-blue-600 p-2.5 rounded-lg">
                      <HardDrive className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-800">
                        app-cluster-prod-{server}
                      </h4>
                      <p className="text-xs text-slate-500">
                        AWS us-east-1 • Ubuntu 22.04
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        CPU
                      </span>
                      <span className="text-sm font-bold text-slate-700">
                        {30 + server * 12}%
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        RAM
                      </span>
                      <span className="text-sm font-bold text-slate-700">
                        {40 + server * 8}%
                      </span>
                    </div>
                    <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-400 to-[#00e3fd]"
                        style={{ width: `${30 + server * 12}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Staging / Dev */}
          <div className="glass-card bg-white/60 backdrop-blur-xl border border-white/40 p-6 rounded-3xl shadow-xl shadow-blue-900/5">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-mono text-xs font-bold tracking-widest text-[#003d9b] uppercase">
                Staging & Dev
              </h3>
            </div>

            <div className="space-y-4">
              {[1, 2].map((env) => (
                <div
                  key={env}
                  className="bg-[#f8f9fb] p-4 rounded-2xl border border-slate-100 flex flex-col gap-3"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-sm text-slate-800">
                      {env === 1 ? "staging-api" : "dev-frontend"}
                    </h4>
                    <span className="text-[10px] font-bold bg-slate-200 text-slate-600 px-2 py-1 rounded-md uppercase">
                      Vercel
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Último deploy:</span>
                    <span className="font-mono text-slate-700">
                      {env === 1 ? "10m atrás" : "2h atrás"}
                    </span>
                  </div>
                  <button className="w-full py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                    Ver Logs
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
