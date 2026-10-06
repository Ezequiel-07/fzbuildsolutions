"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCheck,
  FolderKanban,
  Brain,
  DollarSign,
  X,
  MailOpen,
} from "lucide-react";
import { useProjects } from "@/features/projects/api/use-projects";
import { useLeads } from "@/features/crm/api/use-leads";
import { useTransactions } from "@/features/finance/api/use-transactions";
import { PageHeader } from "@/components/os/page-header";
import { Panel } from "@/components/os/panel";
import { Button } from "@/components/os/button";
import { EmptyState } from "@/components/os/empty-state";

type NotifType = "info" | "warning" | "success" | "system";

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  desc: string;
  time: string;
  read: boolean;
  icon: React.ElementType;
}

export default function NotificationsPage() {
  const { data: projects = [] } = useProjects();
  const { data: leads = [] } = useLeads();
  const { data: transactions = [] } = useTransactions();
  const [filter, setFilter] = useState<"all" | NotifType>("all");

  // Notifications assembled from real database state
  const rawNotifications: Notification[] = [
    ...projects.slice(0, 3).map((p, i) => ({
      id: `project-${p.id}`,
      type: "info" as NotifType,
      title: `Projeto "${p.name}" em execução`,
      desc: `Progresso: ${p.progress || 0}% · Fase: ${p.status || "Ativo"}`,
      time: "Recente",
      read: i > 0,
      icon: FolderKanban,
    })),
    ...leads.slice(0, 3).map((l, i) => ({
      id: `lead-${l.id}`,
      type: "success" as NotifType,
      title: `Oportunidade Comercial: ${l.clientName}`,
      desc: `${l.projectName || "Proposta"} — R$ ${(l.value || 0).toLocaleString("pt-BR")}`,
      time: "Hoje",
      read: i > 0,
      icon: Brain,
    })),
    ...transactions.slice(0, 3).map((t) => ({
      id: `transaction-${t.id}`,
      type: (t.type === "in" ? "success" : "warning") as NotifType,
      title: `${t.type === "in" ? "Receita" : "Despesa"}: ${t.description}`,
      desc: `R$ ${(t.amount || 0).toLocaleString("pt-BR")} — ${t.category}`,
      time: "Hoje",
      read: true,
      icon: DollarSign,
    })),
  ];

  const [notifs, setNotifs] = useState(rawNotifications);

  const filtered =
    filter === "all" ? notifs : notifs.filter((n) => n.type === filter);
  const unreadCount = notifs.filter((n) => !n.read).length;

  const markAllRead = () =>
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  const dismiss = (id: string) =>
    setNotifs((prev) => prev.filter((n) => n.id !== id));
  const markRead = (id: string) =>
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );

  return (
    <div className="max-w-[900px] mx-auto w-full space-y-6">
      <PageHeader
        title="Central de Notificações"
        description="Alertas operacionais consolidados sobre projetos, transações e pipeline comercial"
        meta={
          unreadCount > 0 ? (
            <span className="px-2 py-0.5 rounded-full bg-os-primary text-os-primary-fg text-xs font-mono font-bold">
              {unreadCount} não lida{unreadCount > 1 ? "s" : ""}
            </span>
          ) : undefined
        }
        actions={
          unreadCount > 0 ? (
            <Button variant="secondary" size="sm" onClick={markAllRead}>
              <CheckCheck className="h-4 w-4" />
              <span>Marcar todas como lidas</span>
            </Button>
          ) : undefined
        }
      />

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-os-border pb-2">
        {[
          { key: "all", label: "Todas" },
          { key: "info", label: "Projetos" },
          { key: "success", label: "Comercial" },
          { key: "warning", label: "Financeiro" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as typeof filter)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === tab.key
                ? "bg-os-primary text-os-primary-fg"
                : "text-os-muted hover:bg-os-surface-2 hover:text-os-fg"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <Panel className="overflow-hidden divide-y divide-os-border">
        {filtered.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={MailOpen}
              title="Nenhuma notificação encontrada"
              description="Você está em dia com todas as atualizações operacionais."
            />
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {filtered.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  onClick={() => markRead(item.id)}
                  className={`p-4 flex items-start justify-between gap-3 transition-colors cursor-pointer ${
                    item.read ? "bg-os-surface" : "bg-os-primary/5"
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-xl flex-shrink-0 ${
                        item.type === "success"
                          ? "bg-os-success/10 text-os-success"
                          : item.type === "warning"
                            ? "bg-os-warning/10 text-os-warning"
                            : "bg-os-primary/10 text-os-primary"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p
                        className={`text-xs ${
                          item.read
                            ? "font-medium text-os-fg"
                            : "font-bold text-os-fg"
                        }`}
                      >
                        {item.title}
                      </p>
                      <p className="text-[11px] text-os-muted mt-0.5">
                        {item.desc}
                      </p>
                      <span className="text-[10px] text-os-muted/80 font-mono mt-1 block">
                        {item.time}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dismiss(item.id);
                    }}
                    className="p-1 rounded text-os-muted hover:text-os-fg hover:bg-os-surface-2 transition-colors flex-shrink-0"
                    title="Dispensar notificação"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </Panel>
    </div>
  );
}
