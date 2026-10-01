"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Bell,
  Lock,
  Globe,
  Save,
  Database,
  Key,
  Shield,
  Check,
} from "lucide-react";
import Image from "next/image";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.35, ease: [0.4, 0, 0.2, 1] },
  }),
};

const tabs = [
  { id: "company", label: "Empresa", icon: Building2 },
  { id: "notifications", label: "Notificações", icon: Bell },
  { id: "security", label: "Segurança", icon: Lock },
  { id: "integrations", label: "Integrações", icon: Globe },
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("company");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-[900px] mx-auto w-full space-y-6">
      <motion.div
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Configurações
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Empresa, segurança, notificações e integrações
          </p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg transition-all duration-200 hover:-translate-y-0.5 ${saved ? "bg-green-600 text-white shadow-green-900/20" : "bg-[#003d9b] hover:bg-[#003280] text-white shadow-blue-900/20"}`}
        >
          {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saved ? "Salvo!" : "Salvar"}
        </button>
      </motion.div>

      {/* Tabs */}
      <motion.div
        custom={1}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl w-fit"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id ? "bg-white dark:bg-[#0D1C2C] text-slate-900 dark:text-slate-100 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Company Tab */}
      {activeTab === "company" && (
        <motion.div
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <div className="bg-white dark:bg-[#0D1C2C] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-5">
            <h2 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-[#003d9b]" />
              Informações da Empresa
            </h2>
            <div className="flex items-center gap-4">
              <Image
                src="/fzbuildsemfundo.png"
                alt="Logo"
                width={56}
                height={56}
                className="w-14 h-14 rounded-2xl border border-slate-200 object-contain p-1"
              />
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  FZ Build Solutions
                </p>
                <p className="text-xs text-slate-500">
                  Software House · São Paulo, Brasil
                </p>
                <button className="text-xs text-[#003d9b] hover:underline mt-1">
                  Trocar logo
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  label: "Nome da Empresa",
                  value: "FZ Build Solutions",
                  type: "text",
                },
                {
                  label: "E-mail",
                  value: "contato@fzbuild.com",
                  type: "email",
                },
                { label: "Telefone", value: "+55 11 99999-9999", type: "tel" },
                { label: "Cidade", value: "São Paulo, SP", type: "text" },
              ].map((field) => (
                <div key={field.label}>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    defaultValue={field.value}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-[#003d9b]/20 focus:border-[#003d9b] transition-all"
                  />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <motion.div
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="bg-white dark:bg-[#0D1C2C] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-4"
        >
          <h2 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Bell className="h-4 w-4 text-[#003d9b]" />
            Preferências de Notificação
          </h2>
          {[
            { label: "Novos projetos criados", on: true },
            { label: "Atualizações de leads no CRM", on: true },
            { label: "Transações financeiras", on: false },
            { label: "Alertas de segurança", on: true },
            { label: "Relatórios semanais", on: false },
            { label: "Alertas de infraestrutura", on: true },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between py-2.5 border-b border-slate-50 dark:border-slate-800 last:border-0"
            >
              <span className="text-sm text-slate-700 dark:text-slate-300">
                {item.label}
              </span>
              <button
                className={`relative w-10 h-5.5 rounded-full transition-colors ${item.on ? "bg-[#003d9b]" : "bg-slate-200 dark:bg-slate-600"}`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${item.on ? "left-5" : "left-0.5"}`}
                />
              </button>
            </div>
          ))}
        </motion.div>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <motion.div
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <div className="bg-white dark:bg-[#0D1C2C] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-4">
            <h2 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Lock className="h-4 w-4 text-[#003d9b]" />
              Segurança
            </h2>
            {[
              {
                icon: Shield,
                label: "Autenticação de dois fatores (MFA)",
                desc: "Proteja sua conta com verificação adicional",
                active: true,
              },
              {
                icon: Key,
                label: "Timeout de Sessão",
                desc: "30 minutos de inatividade",
                active: true,
              },
              {
                icon: Database,
                label: "Logs de Auditoria",
                desc: "Registro de todas as ações críticas",
                active: true,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700"
              >
                <div className="p-2 bg-[#003d9b]/10 rounded-xl flex-shrink-0">
                  <item.icon className="h-4.5 w-4.5 text-[#003d9b]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {item.label}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                </div>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${item.active ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-500"}`}
                >
                  {item.active ? "Ativo" : "Inativo"}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Integrations Tab */}
      {activeTab === "integrations" && (
        <motion.div
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="bg-white dark:bg-[#0D1C2C] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-4"
        >
          <h2 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Globe className="h-4 w-4 text-[#003d9b]" />
            Integrações
          </h2>
          {[
            {
              name: "Firebase",
              desc: "Auth, Firestore, Storage",
              connected: true,
              icon: "🔥",
            },
            {
              name: "Google Analytics",
              desc: "Análise de uso e comportamento",
              connected: false,
              icon: "📊",
            },
            {
              name: "Slack",
              desc: "Notificações no canal da equipe",
              connected: false,
              icon: "💬",
            },
            {
              name: "GitHub",
              desc: "Deploy e versionamento de código",
              connected: false,
              icon: "🐙",
            },
          ].map((integration) => (
            <div
              key={integration.name}
              className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
            >
              <span className="text-2xl flex-shrink-0">{integration.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {integration.name}
                </p>
                <p className="text-xs text-slate-500">{integration.desc}</p>
              </div>
              <button
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${integration.connected ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-[#003d9b]/10 text-[#003d9b] hover:bg-[#003d9b] hover:text-white"}`}
              >
                {integration.connected ? "✓ Conectado" : "Conectar"}
              </button>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
