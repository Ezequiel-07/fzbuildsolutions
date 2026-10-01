"use client";

import { motion } from "framer-motion";
import {
  Settings,
  Shield,
  ScrollText,
  Bell,
  Key,
  ChevronRight,
  Activity,
  Lock,
  UserCog,
} from "lucide-react";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.35, ease: [0.4, 0, 0.2, 1] },
  }),
};

const adminSections = [
  {
    title: "Usuários & Acesso",
    items: [
      {
        href: "/os/admin/users",
        label: "Gestão de Usuários",
        desc: "CRUD de usuários, roles e permissões",
        icon: UserCog,
        color: "text-blue-600",
        bg: "bg-blue-100 dark:bg-blue-900/30",
      },
      {
        href: "/os/admin/users",
        label: "Controle de Acesso (RBAC)",
        desc: "Admin, Manager, Member, Viewer",
        icon: Shield,
        color: "text-purple-600",
        bg: "bg-purple-100 dark:bg-purple-900/30",
      },
    ],
  },
  {
    title: "Sistema",
    items: [
      {
        href: "/os/admin/settings",
        label: "Configurações Gerais",
        desc: "Empresa, integrações e preferências",
        icon: Settings,
        color: "text-slate-600",
        bg: "bg-slate-100 dark:bg-slate-700/50",
      },
      {
        href: "/os/admin/logs",
        label: "Logs de Auditoria",
        desc: "Registro de todas as ações do sistema",
        icon: ScrollText,
        color: "text-amber-600",
        bg: "bg-amber-100 dark:bg-amber-900/30",
      },
      {
        href: "/os/notifications",
        label: "Notificações",
        desc: "Configurar alertas e notificações",
        icon: Bell,
        color: "text-cyan-600",
        bg: "bg-cyan-100 dark:bg-cyan-900/30",
      },
    ],
  },
  {
    title: "Segurança",
    items: [
      {
        href: "/os/admin/settings",
        label: "Autenticação & MFA",
        desc: "Segurança de login e 2FA",
        icon: Lock,
        color: "text-red-600",
        bg: "bg-red-100 dark:bg-red-900/30",
      },
      {
        href: "/os/admin/settings",
        label: "Chaves de API",
        desc: "Integrações e tokens de acesso",
        icon: Key,
        color: "text-green-600",
        bg: "bg-green-100 dark:bg-green-900/30",
      },
    ],
  },
];

const systemStatus = [
  { label: "Firebase Auth", status: "operational", latency: "12ms" },
  { label: "Firestore", status: "operational", latency: "8ms" },
  { label: "Storage", status: "operational", latency: "45ms" },
  { label: "App Hosting", status: "operational", latency: "22ms" },
];

export default function AdminPage() {
  return (
    <div className="max-w-[1400px] mx-auto w-full space-y-6">
      {/* HEADER */}
      <motion.div
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Administração
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Gestão de usuários, segurança, configurações e logs do sistema
        </p>
      </motion.div>

      {/* SYSTEM STATUS */}
      <motion.div
        custom={1}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="bg-white dark:bg-[#0D1C2C] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-4 w-4 text-[#003d9b]" />
          <h2 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
            Status do Sistema
          </h2>
          <span className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-green-600">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Todos os sistemas operacionais
          </span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {systemStatus.map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700"
            >
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {s.label}
                </p>
                <p className="text-[10px] font-mono text-slate-400">
                  {s.latency}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ADMIN SECTIONS */}
      {adminSections.map((section, si) => (
        <motion.div
          key={section.title}
          custom={si + 2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-1">
            {section.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {section.items.map((item) => (
              <Link
                key={item.href + item.label}
                href={item.href}
                className="group flex items-center gap-4 p-5 bg-white dark:bg-[#0D1C2C] rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-[#003d9b]/30 hover:shadow-md hover:shadow-blue-900/5 hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className={`p-3 rounded-xl ${item.bg} flex-shrink-0`}>
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-[#003d9b] transition-colors">
                    {item.label}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">
                    {item.desc}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-[#003d9b] transition-colors flex-shrink-0" />
              </Link>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
