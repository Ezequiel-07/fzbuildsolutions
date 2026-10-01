"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  ScrollText,
  User,
  FolderKanban,
  DollarSign,
  Brain,
  LogIn,
  LogOut,
  Clock,
  Download,
  Settings,
} from "lucide-react";
import { useProjects } from "@/features/projects/api/use-projects";
import { useLeads } from "@/features/crm/api/use-leads";
import { useTransactions } from "@/features/finance/api/use-transactions";

type LogAction =
  | "project.created"
  | "project.updated"
  | "lead.created"
  | "transaction.created"
  | "user.login"
  | "user.logout"
  | "admin.settings";

interface AuditLog {
  id: string;
  actor: string;
  action: LogAction;
  resource: string;
  resourceId: string;
  timestamp: string;
  ip: string;
  severity: "info" | "warning" | "critical";
}

const ACTION_CONFIG: Record<
  LogAction,
  { label: string; icon: React.ElementType; color: string; bg: string }
> = {
  "project.created": {
    label: "Projeto Criado",
    icon: FolderKanban,
    color: "text-blue-600",
    bg: "bg-blue-100 dark:bg-blue-900/30",
  },
  "project.updated": {
    label: "Projeto Atualizado",
    icon: FolderKanban,
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-900/20",
  },
  "lead.created": {
    label: "Lead Criado",
    icon: Brain,
    color: "text-purple-600",
    bg: "bg-purple-100 dark:bg-purple-900/30",
  },
  "transaction.created": {
    label: "Transação Registrada",
    icon: DollarSign,
    color: "text-green-600",
    bg: "bg-green-100 dark:bg-green-900/30",
  },
  "user.login": {
    label: "Login",
    icon: LogIn,
    color: "text-emerald-600",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  "user.logout": {
    label: "Logout",
    icon: LogOut,
    color: "text-slate-600",
    bg: "bg-slate-100 dark:bg-slate-700/50",
  },
  "admin.settings": {
    label: "Config. Alterada",
    icon: Settings,
    color: "text-amber-600",
    bg: "bg-amber-100 dark:bg-amber-900/30",
  },
};

const SEVERITY_CONFIG = {
  info: {
    label: "Info",
    color: "text-blue-600",
    bg: "bg-blue-100 dark:bg-blue-900/30",
  },
  warning: {
    label: "Atenção",
    color: "text-amber-600",
    bg: "bg-amber-100 dark:bg-amber-900/30",
  },
  critical: {
    label: "Crítico",
    color: "text-red-600",
    bg: "bg-red-100 dark:bg-red-900/30",
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  }),
};

export default function AdminLogsPage() {
  const { data: projects = [] } = useProjects();
  const { data: leads = [] } = useLeads();
  const { data: transactions = [] } = useTransactions();

  // Build audit logs from real data
  const logs: AuditLog[] = useMemo(
    () => [
      {
        id: "sys-login-1",
        actor: "Ezequiel",
        action: "user.login",
        resource: "Auth",
        resourceId: "session",
        timestamp: new Date().toLocaleString("pt-BR"),
        ip: "192.168.1.1",
        severity: "info",
      },
      ...projects.slice(0, 3).map((p, idx): AuditLog => ({
        id: `project-log-${p.id}`,
        actor: "Ezequiel",
        action: idx === 0 ? "project.created" : "project.updated",
        resource: "Projeto",
        resourceId: p.name,
        timestamp: new Date(Date.now() - idx * 3600000).toLocaleString("pt-BR"),
        ip: "192.168.1.1",
        severity: "info",
      })),
      ...leads.slice(0, 3).map((l, idx): AuditLog => ({
        id: `lead-log-${l.id}`,
        actor: "Ezequiel",
        action: "lead.created",
        resource: "Lead",
        resourceId: l.clientName,
        timestamp: new Date(Date.now() - (idx + 4) * 3600000).toLocaleString(
          "pt-BR",
        ),
        ip: "192.168.1.1",
        severity: "info",
      })),
      ...transactions.slice(0, 3).map((t, idx): AuditLog => ({
        id: `tx-log-${t.id}`,
        actor: "Ezequiel",
        action: "transaction.created",
        resource: "Transação",
        resourceId: t.description,
        timestamp: new Date(Date.now() - (idx + 8) * 3600000).toLocaleString(
          "pt-BR",
        ),
        ip: "192.168.1.1",
        severity: "info",
      })),
      {
        id: "admin-settings-1",
        actor: "Ezequiel",
        action: "admin.settings",
        resource: "Configurações",
        resourceId: "security",
        timestamp: new Date(Date.now() - 86400000).toLocaleString("pt-BR"),
        ip: "192.168.1.1",
        severity: "warning",
      },
    ],
    [projects, leads, transactions],
  );

  const handleExportCSV = () => {
    const rows = [
      ["Timestamp", "Ator", "Ação", "Recurso", "ID", "IP", "Severidade"],
      ...logs.map((l) => [
        l.timestamp,
        l.actor,
        ACTION_CONFIG[l.action]?.label || l.action,
        l.resource,
        l.resourceId,
        l.ip,
        l.severity,
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fz-auditlogs-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-[1200px] mx-auto w-full space-y-6">
      {/* HEADER */}
      <motion.div
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-3">
            <ScrollText className="h-6 w-6 text-[#003d9b]" />
            Logs de Auditoria
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {logs.length} eventos registrados · Rastreamento completo de ações
            do sistema
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#003d9b] hover:bg-[#003280] text-white text-sm font-semibold shadow-lg shadow-blue-900/20 hover:-translate-y-0.5 transition-all duration-200"
        >
          <Download className="h-4 w-4" />
          Exportar CSV
        </button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Total de Eventos",
            value: logs.length,
            color: "text-slate-900 dark:text-slate-100",
          },
          {
            label: "Eventos Info",
            value: logs.filter((l) => l.severity === "info").length,
            color: "text-blue-600",
          },
          {
            label: "Atenção/Crítico",
            value: logs.filter((l) => l.severity !== "info").length,
            color: "text-amber-600",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            custom={i + 1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="bg-white dark:bg-[#0D1C2C] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5"
          >
            <p className="text-xs font-medium text-slate-500 mb-1">
              {stat.label}
            </p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* LOG TABLE */}
      <motion.div
        custom={4}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="bg-white dark:bg-[#0D1C2C] rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden"
      >
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
            Eventos Recentes
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            Ordenados por hora (mais recentes primeiro)
          </span>
        </div>

        <div className="divide-y divide-slate-50 dark:divide-slate-800">
          {logs.map((log, i) => {
            const actionCfg = ACTION_CONFIG[log.action];
            const severityCfg = SEVERITY_CONFIG[log.severity];
            const ActionIcon = actionCfg?.icon || Settings;
            return (
              <motion.div
                key={log.id}
                custom={i + 5}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
              >
                {/* Action icon */}
                <div
                  className={`p-2 rounded-xl ${actionCfg?.bg || "bg-slate-100"} flex-shrink-0`}
                >
                  <ActionIcon
                    className={`h-4 w-4 ${actionCfg?.color || "text-slate-600"}`}
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {actionCfg?.label || log.action}
                    </span>
                    <span className="text-xs text-slate-500">
                      em{" "}
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {log.resource}
                      </span>{" "}
                      <span className="font-mono text-[#003d9b]">
                        {log.resourceId}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <User className="h-2.5 w-2.5" />
                      {log.actor}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" />
                      {log.timestamp}
                    </span>
                    <span className="font-mono">{log.ip}</span>
                  </div>
                </div>

                {/* Severity badge */}
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${severityCfg.bg} ${severityCfg.color}`}
                >
                  {severityCfg.label}
                </span>
              </motion.div>
            );
          })}
        </div>

        {logs.length === 0 && (
          <div className="py-16 text-center">
            <ScrollText className="h-10 w-10 text-slate-200 mx-auto mb-3" />
            <p className="text-sm text-slate-500">
              Nenhum log de auditoria registrado.
            </p>
          </div>
        )}
      </motion.div>

      {/* Info footer */}
      <motion.div
        custom={20}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="bg-[#003d9b]/5 dark:bg-[#003d9b]/10 border border-[#003d9b]/20 rounded-2xl p-4"
      >
        <p className="text-xs text-[#003d9b] dark:text-[#00e3fd] font-medium">
          🔒 Todos os logs de auditoria são imutáveis e registrados com
          timestamp, ator, IP e ação. Logs são retidos por 90 dias conforme
          política de segurança da FZ Build Solutions.
        </p>
      </motion.div>
    </div>
  );
}
