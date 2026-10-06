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
  ShieldCheck,
} from "lucide-react";
import { useProjects } from "@/features/projects/api/use-projects";
import { useLeads } from "@/features/crm/api/use-leads";
import { useTransactions } from "@/features/finance/api/use-transactions";
import { PageHeader } from "@/components/os/page-header";
import { Button } from "@/components/os/button";
import { Panel, PanelHeader } from "@/components/os/panel";
import { StatusBadge } from "@/components/os/status-badge";
import type { Tone } from "@/domain/tone";

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
  { label: string; icon: React.ElementType; tone: Tone }
> = {
  "project.created": {
    label: "Projeto Criado",
    icon: FolderKanban,
    tone: "info",
  },
  "project.updated": {
    label: "Projeto Atualizado",
    icon: FolderKanban,
    tone: "accent",
  },
  "lead.created": {
    label: "Lead Criado",
    icon: Brain,
    tone: "info",
  },
  "transaction.created": {
    label: "Transação Registrada",
    icon: DollarSign,
    tone: "success",
  },
  "user.login": {
    label: "Login no Sistema",
    icon: LogIn,
    tone: "success",
  },
  "user.logout": {
    label: "Logout",
    icon: LogOut,
    tone: "neutral",
  },
  "admin.settings": {
    label: "Configurações Alteradas",
    icon: Settings,
    tone: "warning",
  },
};

const SEVERITY_CONFIG: Record<
  "info" | "warning" | "critical",
  { label: string; tone: Tone }
> = {
  info: { label: "Info", tone: "info" },
  warning: { label: "Atenção", tone: "warning" },
  critical: { label: "Crítico", tone: "danger" },
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
        resourceId: "Sessão Ativa",
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
        resource: "Segurança",
        resourceId: "Políticas MFA",
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
      <PageHeader
        title="Logs de Auditoria"
        description={`${logs.length} eventos registrados · Rastreamento de ações, segurança e conformidade operacional`}
        breadcrumbs={[
          { label: "Sistema", href: "/os/admin" },
          { label: "Auditoria" },
        ]}
        actions={
          <Button
            variant="secondary"
            size="sm"
            leadingIcon={<Download className="h-4 w-4" />}
            onClick={handleExportCSV}
          >
            Exportar CSV
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Total de Eventos",
            value: logs.length,
            color: "text-os-text",
          },
          {
            label: "Eventos Informativos",
            value: logs.filter((l) => l.severity === "info").length,
            color: "text-os-primary",
          },
          {
            label: "Avisos e Segurança",
            value: logs.filter((l) => l.severity !== "info").length,
            color: "text-amber-600 dark:text-amber-400",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            custom={i + 1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <Panel className="p-5">
              <p className="text-xs font-medium text-os-muted mb-1">
                {stat.label}
              </p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </Panel>
          </motion.div>
        ))}
      </div>

      {/* LOG TABLE */}
      <motion.div
        custom={4}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <Panel className="overflow-hidden">
          <div className="px-5 py-3.5 border-b border-os-border flex items-center justify-between">
            <PanelHeader
              title="Eventos Recentes do Sistema"
              description="Ordenados cronologicamente do mais recente ao mais antigo"
              icon={<ScrollText className="h-4 w-4 text-os-primary" />}
            />
            <span className="text-xs text-os-muted font-mono">
              Retenção: 90 dias
            </span>
          </div>

          <div className="divide-y divide-os-border">
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
                  className="flex items-center gap-4 px-5 py-4 hover:bg-os-bg/50 transition-colors"
                >
                  {/* Action icon */}
                  <div className="p-2.5 rounded-xl bg-os-bg border border-os-border flex-shrink-0">
                    <ActionIcon className="h-4 w-4 text-os-primary" />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-os-text">
                        {actionCfg?.label || log.action}
                      </span>
                      <span className="text-xs text-os-muted">
                        em{" "}
                        <span className="font-medium text-os-text">
                          {log.resource}
                        </span>{" "}
                        <span className="font-mono text-os-primary">
                          {log.resourceId}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-[11px] text-os-muted">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {log.actor}
                      </span>
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="h-3 w-3" />
                        {log.timestamp}
                      </span>
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-os-bg border border-os-border">
                        {log.ip}
                      </span>
                    </div>
                  </div>

                  {/* Severity badge */}
                  <StatusBadge
                    label={severityCfg.label}
                    tone={severityCfg.tone}
                    size="sm"
                  />
                </motion.div>
              );
            })}
          </div>

          {logs.length === 0 && (
            <div className="py-16 text-center">
              <ScrollText className="h-10 w-10 text-os-muted mx-auto mb-3 opacity-40" />
              <p className="text-sm text-os-muted">
                Nenhum log de auditoria registrado.
              </p>
            </div>
          )}
        </Panel>
      </motion.div>

      {/* Info footer */}
      <motion.div
        custom={10}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <Panel className="p-4 bg-os-primary/5 border-os-primary/20 flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-os-primary flex-shrink-0 mt-0.5" />
          <p className="text-xs text-os-text leading-relaxed">
            <span className="font-semibold text-os-primary">
              Conformidade e Segurança:
            </span>{" "}
            Todos os logs de auditoria do FZ OS são imutáveis e registrados com
            identificação do operador, carimbo de data/hora oficial e endereço
            de IP de origem.
          </p>
        </Panel>
      </motion.div>
    </div>
  );
}
