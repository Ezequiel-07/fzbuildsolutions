"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  CheckCheck,
  FolderKanban,
  Brain,
  DollarSign,
  Zap,
  Clock,
  X,
} from "lucide-react";
import { useProjects } from "@/features/projects/api/use-projects";
import { useLeads } from "@/features/crm/api/use-leads";
import { useTransactions } from "@/features/finance/api/use-transactions";

type NotifType = "info" | "warning" | "success" | "system";

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  desc: string;
  time: string;
  read: boolean;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  }),
};

export default function NotificationsPage() {
  const { data: projects = [] } = useProjects();
  const { data: leads = [] } = useLeads();
  const { data: transactions = [] } = useTransactions();
  const [filter, setFilter] = useState<"all" | NotifType>("all");

  // Build notifications from real data
  const notifications: Notification[] = [
    ...projects.slice(0, 2).map((p, i) => ({
      id: `project-${p.id}`,
      type: "info" as NotifType,
      title: `Projeto "${p.name}" atualizado`,
      desc: `Status atual: ${p.status || "Em andamento"} · ${p.progress || 0}% concluído`,
      time: "agora",
      read: i > 0,
      icon: FolderKanban,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
    })),
    ...leads.slice(0, 2).map((l, i) => ({
      id: `lead-${l.id}`,
      type: "success" as NotifType,
      title: `Lead "${l.clientName}" — ${l.stage}`,
      desc: `Projeto: ${l.projectName}${l.value ? ` · Valor: R$ ${l.value.toLocaleString("pt-BR")}` : ""}`,
      time: "1h atrás",
      read: i > 0,
      icon: Brain,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
    })),
    ...transactions.slice(0, 2).map((t) => ({
      id: `transaction-${t.id}`,
      type: (t.type === "in" ? "success" : "warning") as NotifType,
      title: `${t.type === "in" ? "Receita" : "Despesa"} registrada`,
      desc: `${t.description} — ${t.category}`,
      time: "2h atrás",
      read: true,
      icon: DollarSign,
      iconColor: t.type === "in" ? "text-green-600" : "text-red-500",
      iconBg:
        t.type === "in"
          ? "bg-green-100 dark:bg-green-900/30"
          : "bg-red-100 dark:bg-red-900/30",
    })),
    {
      id: "sys-1",
      type: "system",
      title: "FZ OS atualizado para v2.0.0",
      desc: "Nova sidebar, módulo financeiro completo, planilha de transações e mais.",
      time: "3h atrás",
      read: true,
      icon: Zap,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-100 dark:bg-amber-900/30",
    },
  ];

  const [notifs, setNotifs] = useState(notifications);

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
    <div className="max-w-[800px] mx-auto w-full space-y-6">
      {/* HEADER */}
      <motion.div
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-3">
            Notificações
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center h-6 px-2 rounded-full bg-[#003d9b] text-white text-xs font-bold">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {unreadCount} não lida{unreadCount !== 1 ? "s" : ""} de{" "}
            {notifs.length} total
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <CheckCheck className="h-4 w-4" />
            Marcar todas como lidas
          </button>
        )}
      </motion.div>

      {/* FILTER */}
      <motion.div
        custom={1}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex items-center gap-1.5 flex-wrap"
      >
        {(["all", "info", "success", "warning", "system"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${filter === f ? "bg-[#003d9b] text-white shadow-md shadow-blue-900/20" : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"}`}
          >
            {f === "all"
              ? "Todas"
              : f === "info"
                ? "Info"
                : f === "success"
                  ? "Sucesso"
                  : f === "warning"
                    ? "Atenção"
                    : "Sistema"}
          </button>
        ))}
      </motion.div>

      {/* NOTIFICATIONS LIST */}
      <div className="space-y-2">
        <AnimatePresence>
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white dark:bg-[#0D1C2C] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-12 text-center"
            >
              <Bell className="h-10 w-10 text-slate-200 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-500">
                Nenhuma notificação
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Você está em dia com tudo!
              </p>
            </motion.div>
          ) : (
            filtered.map((notif, i) => (
              <motion.div
                key={notif.id}
                custom={i + 2}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                className={`flex items-start gap-4 p-4 rounded-2xl border transition-all duration-200 group cursor-pointer ${
                  notif.read
                    ? "bg-white dark:bg-[#0D1C2C] border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                    : "bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800/50 hover:border-blue-200 dark:hover:border-blue-700"
                }`}
                onClick={() => markRead(notif.id)}
              >
                <div
                  className={`p-2.5 rounded-xl ${notif.iconBg} flex-shrink-0`}
                >
                  <notif.icon className={`h-4.5 w-4.5 ${notif.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={`text-sm font-semibold ${notif.read ? "text-slate-700 dark:text-slate-300" : "text-slate-900 dark:text-slate-100"}`}
                    >
                      {notif.title}
                      {!notif.read && (
                        <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-[#003d9b] align-middle" />
                      )}
                    </p>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" />
                        {notif.time}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dismiss(notif.id);
                        }}
                        className="p-1 rounded-lg text-slate-300 hover:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    {notif.desc}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
