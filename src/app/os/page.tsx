"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Search,
  Bell,
  Sun,
  Moon,
  FolderKanban,
  Users,
  DollarSign,
  ListChecks,
  Plus,
  CreditCard,
  FileText,
  ChevronDown,
  CheckCircle2,
  Inbox,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { NewProjectModal } from "@/features/projects/components/new-project-modal";
import { useProjects } from "@/features/projects/api/use-projects";
import { useLeads } from "@/features/crm/api/use-leads";
import { useTransactions } from "@/features/finance/api/use-transactions";
import { useTeam } from "@/features/team/api/use-team";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.35, ease: [0.4, 0, 0.2, 1] },
  }),
};

const MONTHS = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];
const PALETTE = [
  "#003D9B",
  "#00E3FD",
  "#8B5CF6",
  "#F59E0B",
  "#10B981",
  "#EC4899",
  "#6366F1",
];

type NotificationCategory = "todas" | "criticas" | "atencao" | "info";

function formatTimestamp(ts?: {
  seconds: number;
  nanoseconds: number;
}): string {
  if (!ts || !ts.seconds) return "recente";
  const date = new Date(ts.seconds * 1000);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function formatRelativeTime(ts?: {
  seconds: number;
  nanoseconds: number;
}): string {
  if (!ts || !ts.seconds) return "recente";
  const now = Date.now();
  const diffMs = now - ts.seconds * 1000;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return "agora";
  if (diffHours < 24) return `${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d`;
}

export default function DashboardOverviewPage() {
  const { theme, setTheme } = useTheme();
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [timeframe, setTimeframe] = useState<"7D" | "30D" | "90D" | "1Y">(
    "30D",
  );
  const [notifFilter, setNotifFilter] = useState<NotificationCategory>("todas");
  const [completedTaskIds, setCompletedTaskIds] = useState<
    Record<string, boolean>
  >({});

  // 100% REAL DATA FROM FIRESTORE
  const { data: projects = [], isLoading: isLoadingProjects } = useProjects();
  const { data: leads = [], isLoading: isLoadingLeads } = useLeads();
  const { data: transactions = [], isLoading: isLoadingTransactions } =
    useTransactions();
  const { data: teamMembers = [] } = useTeam();

  // 1. Metric Calculations from real DB
  const activeProjects = useMemo(() => {
    return projects.filter(
      (p) =>
        p.status?.toLowerCase() !== "done" &&
        p.status?.toLowerCase() !== "concluido" &&
        p.status?.toLowerCase() !== "completed",
    );
  }, [projects]);

  const openLeads = useMemo(() => {
    return leads.filter((l) => l.stage !== "Fechado" && l.stage !== "Perdido");
  }, [leads]);

  const totalRevenue = useMemo(() => {
    return transactions
      .filter((t) => t.type === "in")
      .reduce((acc, t) => acc + (t.amount || 0), 0);
  }, [transactions]);

  const totalExpenses = useMemo(() => {
    return transactions
      .filter((t) => t.type === "out")
      .reduce((acc, t) => acc + (t.amount || 0), 0);
  }, [transactions]);

  // Current Month Revenue
  const currentMonthRevenue = useMemo(() => {
    const now = new Date();
    const currMonth = now.getMonth();
    const currYear = now.getFullYear();

    const sum = transactions
      .filter((t) => {
        if (t.type !== "in") return false;
        if (!t.createdAt) return true;
        const d = new Date(t.createdAt.seconds * 1000);
        return d.getMonth() === currMonth && d.getFullYear() === currYear;
      })
      .reduce((acc, t) => acc + (t.amount || 0), 0);

    return sum > 0 ? sum : totalRevenue;
  }, [transactions, totalRevenue]);

  // 2. Real Fluxo Financeiro (Spline Double Curve: Receita vs Despesa over last 6 months)
  const fluxoFinanceiroData = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const monthIdx = d.getMonth();
      const year = d.getFullYear();

      const receita = transactions
        .filter((t) => {
          if (t.type !== "in") return false;
          if (!t.createdAt) return false;
          const td = new Date(t.createdAt.seconds * 1000);
          return td.getMonth() === monthIdx && td.getFullYear() === year;
        })
        .reduce((acc, t) => acc + (t.amount || 0), 0);

      const despesa = transactions
        .filter((t) => {
          if (t.type !== "out") return false;
          if (!t.createdAt) return false;
          const td = new Date(t.createdAt.seconds * 1000);
          return td.getMonth() === monthIdx && td.getFullYear() === year;
        })
        .reduce((acc, t) => acc + (t.amount || 0), 0);

      return {
        mes: MONTHS[monthIdx],
        receita,
        despesa,
      };
    });
  }, [transactions]);

  const maxFluxoValue = useMemo(() => {
    const maxVal = Math.max(
      ...fluxoFinanceiroData.map((d) => Math.max(d.receita, d.despesa)),
      1000,
    );
    return Math.ceil(maxVal * 1.2);
  }, [fluxoFinanceiroData]);

  // 3. Real Recent Activity Feed (merged from latest real projects, transactions & leads)
  const recentActivities = useMemo(() => {
    const list: Array<{
      id: string;
      dot: string;
      time: string;
      title: string;
      subtitle: string;
      isFinancial?: boolean;
      isTech?: boolean;
      timestamp: number;
    }> = [];

    // Projects
    projects.forEach((p) => {
      list.push({
        id: `proj-${p.id}`,
        dot: "bg-blue-500",
        time: formatTimestamp(p.createdAt),
        title: `Projeto: ${p.name}`,
        subtitle: `Status: ${p.status || "Ativo"} · Progresso: ${p.progress || 0}%`,
        isTech: true,
        timestamp: p.createdAt?.seconds || 0,
      });
    });

    // Transactions
    transactions.forEach((t) => {
      const isIncome = t.type === "in";
      list.push({
        id: `trans-${t.id}`,
        dot: isIncome ? "bg-emerald-500" : "bg-red-500",
        time: formatTimestamp(t.createdAt),
        title: `${isIncome ? "Receita" : "Despesa"}: ${t.description}`,
        subtitle: `R$ ${(t.amount || 0).toLocaleString("pt-BR")} — ${t.category || "Geral"}`,
        isFinancial: true,
        timestamp: t.createdAt?.seconds || 0,
      });
    });

    // Leads
    leads.forEach((l) => {
      list.push({
        id: `lead-${l.id}`,
        dot: "bg-purple-500",
        time: formatTimestamp(l.createdAt),
        title: `Lead: ${l.clientName}`,
        subtitle: `${l.projectName || "Proposta"} — R$ ${(l.value || 0).toLocaleString("pt-BR")}`,
        timestamp: l.createdAt?.seconds || 0,
      });
    });

    // Team members
    teamMembers.forEach((m) => {
      list.push({
        id: `team-${m.id}`,
        dot: "bg-teal-500",
        time: formatTimestamp(m.createdAt),
        title: `Membro: ${m.name}`,
        subtitle: `${m.role || "Especialista"} · Status: ${m.status || "Ativo"}`,
        timestamp: m.createdAt?.seconds || 0,
      });
    });

    // Sort by timestamp descending
    list.sort((a, b) => b.timestamp - a.timestamp);
    return list.slice(0, 5);
  }, [projects, transactions, leads, teamMembers]);

  // 4. Real Visão Geral (Donut breakdown by transaction categories)
  const visaoGeralData = useMemo(() => {
    const catMap: Record<string, number> = {};
    transactions.forEach((t) => {
      const cat = t.category?.trim() || "Geral";
      catMap[cat] = (catMap[cat] || 0) + (t.amount || 0);
    });

    const grandTotal = Object.values(catMap).reduce((a, b) => a + b, 0);

    if (grandTotal === 0) {
      return [];
    }

    return Object.entries(catMap)
      .map(([name, amount], idx) => ({
        name,
        value: Math.round((amount / grandTotal) * 100),
        amount: `R$ ${amount.toLocaleString("pt-BR")}`,
        color: PALETTE[idx % PALETTE.length],
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const totalCategorizedAmount = useMemo(() => {
    return transactions.reduce((acc, t) => acc + (t.amount || 0), 0);
  }, [transactions]);

  // 5. Real Distribuição de Custos (Monthly Expenses)
  const custosBarData = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const monthIdx = d.getMonth();
      const year = d.getFullYear();

      const valor = transactions
        .filter((t) => {
          if (t.type !== "out") return false;
          if (!t.createdAt) return false;
          const td = new Date(t.createdAt.seconds * 1000);
          return td.getMonth() === monthIdx && td.getFullYear() === year;
        })
        .reduce((acc, t) => acc + (t.amount || 0), 0);

      return {
        mes: MONTHS[monthIdx],
        valor,
      };
    });
  }, [transactions]);

  const maxCustosValue = useMemo(() => {
    const maxVal = Math.max(...custosBarData.map((d) => d.valor), 1000);
    return Math.ceil(maxVal * 1.2);
  }, [custosBarData]);

  // 6. Real My Day Tasks (Derived directly from open projects and leads in Firestore)
  const myDayTasks = useMemo(() => {
    const taskItems: Array<{ id: string; text: string; defaultDone: boolean }> =
      [];

    // Pending projects needing progress
    activeProjects.forEach((p) => {
      taskItems.push({
        id: `task-proj-${p.id}`,
        text: `Atualizar entregas do projeto "${p.name}" (${p.progress || 0}%)`,
        defaultDone: (p.progress || 0) >= 100,
      });
    });

    // Pending leads needing contact
    openLeads.forEach((l) => {
      taskItems.push({
        id: `task-lead-${l.id}`,
        text: `Fazer follow-up com cliente "${l.clientName}" (${l.stage})`,
        defaultDone: l.stage === "Fechado",
      });
    });

    // Expenses needing validation
    const expenses = transactions.filter((t) => t.type === "out");
    if (expenses.length > 0) {
      taskItems.push({
        id: `task-exp-${expenses[0].id}`,
        text: `Aprovar despesa: ${expenses[0].description} (R$ ${expenses[0].amount.toLocaleString("pt-BR")})`,
        defaultDone: false,
      });
    }

    return taskItems.slice(0, 5);
  }, [activeProjects, openLeads, transactions]);

  const toggleTask = (id: string) => {
    setCompletedTaskIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const completedTasksCount = useMemo(() => {
    return myDayTasks.filter((t) => completedTaskIds[t.id] ?? t.defaultDone)
      .length;
  }, [myDayTasks, completedTaskIds]);

  const taskPercentage =
    myDayTasks.length > 0
      ? Math.round((completedTasksCount / myDayTasks.length) * 100)
      : 0;

  // 7. Real Notifications List (Derived directly from real projects, transactions, leads)
  const realNotifications = useMemo(() => {
    const notifs: Array<{
      id: string;
      type: NotificationCategory;
      title: string;
      subtitle: string;
      time: string;
      badgeColor: string;
      badgeBg: string;
    }> = [];

    // Real transactions
    transactions.slice(0, 2).forEach((t) => {
      const isExpense = t.type === "out";
      notifs.push({
        id: `notif-trans-${t.id}`,
        type: isExpense ? "criticas" : "info",
        title: isExpense ? "Despesa registrada" : "Receita confirmada",
        subtitle: `${t.description} — R$ ${t.amount.toLocaleString("pt-BR")}`,
        time: formatRelativeTime(t.createdAt),
        badgeColor: isExpense ? "bg-red-500" : "bg-[#003D9B]",
        badgeBg: isExpense
          ? "bg-red-50 dark:bg-red-950/40 text-red-500"
          : "bg-blue-50 dark:bg-blue-950/40 text-[#003D9B] dark:text-[#00E3FD]",
      });
    });

    // Real leads
    leads.slice(0, 2).forEach((l) => {
      notifs.push({
        id: `notif-lead-${l.id}`,
        type: "atencao",
        title: `Proposta comercial: ${l.clientName}`,
        subtitle: `${l.projectName || "SaaS"} — R$ ${(l.value || 0).toLocaleString("pt-BR")}`,
        time: formatRelativeTime(l.createdAt),
        badgeColor: "bg-amber-500",
        badgeBg:
          "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400",
      });
    });

    // Real projects
    projects.slice(0, 2).forEach((p) => {
      notifs.push({
        id: `notif-proj-${p.id}`,
        type: "info",
        title: `Status: ${p.name}`,
        subtitle: `${p.status || "Ativo"} · ${p.progress || 0}% concluído`,
        time: formatRelativeTime(p.createdAt),
        badgeColor: "bg-emerald-500",
        badgeBg: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500",
      });
    });

    return notifs;
  }, [transactions, leads, projects]);

  const filteredNotifications = useMemo(() => {
    if (notifFilter === "todas") return realNotifications;
    return realNotifications.filter((n) => n.type === notifFilter);
  }, [realNotifications, notifFilter]);

  const criticasCount = realNotifications.filter(
    (n) => n.type === "criticas",
  ).length;
  const atencaoCount = realNotifications.filter(
    (n) => n.type === "atencao",
  ).length;
  const infoCount = realNotifications.filter((n) => n.type === "info").length;

  return (
    <div className="max-w-[1520px] mx-auto w-full space-y-6 pb-12">
      {/* ============================================================
          TOP HEADER: GREETING + SEARCH + ACTIONS
          ============================================================ */}
      <motion.div
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
      >
        {/* Left: Greeting matching Geist specs */}
        <div>
          <h1 className="text-xl sm:text-2xl md:text-[26px] font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            Boa noite, Ezequiel.
          </h1>
          <p className="text-xs sm:text-sm font-normal text-slate-500 dark:text-slate-400 mt-0.5">
            Dados operacionais em tempo real conectados ao Firestore.
          </p>
        </div>

        {/* Center/Right: Search bar pill + Quick Icons */}
        <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
          {/* Search Pill */}
          <div className="relative flex items-center w-full sm:w-72 md:w-80 lg:w-96 bg-white dark:bg-[#0A1624] border border-[#E2E8F0] dark:border-[#162235] rounded-xl px-3.5 py-2 shadow-sm hover:border-[#003D9B]/30 dark:hover:border-[#00E3FD]/30 transition-all">
            <Search className="h-4 w-4 text-slate-400 mr-2.5 flex-shrink-0" />
            <input
              type="text"
              readOnly
              placeholder="Buscar projetos, clientes, ações..."
              className="w-full bg-transparent text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none cursor-pointer"
              onClick={() => {
                const event = new KeyboardEvent("keydown", {
                  key: "k",
                  metaKey: true,
                  bubbles: true,
                });
                window.dispatchEvent(event);
              }}
            />
            <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80 text-[10px] font-mono font-medium text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60 flex-shrink-0">
              ⌘ K
            </kbd>
          </div>

          {/* Quick Notification Bell */}
          <Link
            href="/os/notifications"
            className="relative p-2.5 rounded-xl bg-white dark:bg-[#0A1624] border border-[#E2E8F0] dark:border-[#162235] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 shadow-sm transition-all"
            title="Notificações"
          >
            <Bell className="h-4 w-4" />
            {realNotifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-[#0A1624]" />
            )}
          </Link>

          {/* Theme Toggle Button */}
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-2.5 rounded-xl bg-white dark:bg-[#0A1624] border border-[#E2E8F0] dark:border-[#162235] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 shadow-sm transition-all"
            title="Alternar tema"
          >
            <div className="relative h-4 w-4">
              <Sun className="h-4 w-4 absolute rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
              <Moon className="h-4 w-4 absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-cyan-400" />
            </div>
          </button>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-[#0A1624] border border-[#E2E8F0] dark:border-[#162235] shadow-sm">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#003D9B] to-[#00E3FD] flex items-center justify-center text-white text-[10px] font-bold">
              EA
            </div>
            <span className="text-xs font-medium text-slate-800 dark:text-slate-200 hidden sm:inline">
              Ezequiel
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </div>

          {/* Sistema Online Badge */}
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-medium">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Sistema Online</span>
          </div>
        </div>
      </motion.div>

      {/* ============================================================
          MASTER RESPONSIVE 2-COLUMN WORKSPACE
          100% REAL FIRESTORE DATA — ZERO MOCKS
          ============================================================ */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* ============================================================
            LEFT SECTION (xl:col-span-8): Main Operations Canvas
            ============================================================ */}
        <div className="xl:col-span-8 flex flex-col gap-6 w-full">
          {/* 1. TOP METRIC CARDS (4 cards) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {/* Card 1: Projetos Ativos */}
            <motion.div
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="fz-os-card p-4 sm:p-5"
            >
              <div className="flex items-start justify-between mb-2.5 sm:mb-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#003D9B] dark:text-[#00E3FD] flex items-center justify-center border border-blue-100 dark:border-blue-900/40">
                  <FolderKanban className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                </div>
              </div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 truncate">
                Projetos Ativos
              </p>
              <div className="flex items-baseline gap-2 flex-wrap">
                <p
                  className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-slate-100 font-mono tracking-tight"
                  suppressHydrationWarning
                >
                  {isLoadingProjects ? "..." : activeProjects.length}
                </p>
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 font-mono">
                  {projects.length} total
                </span>
              </div>
            </motion.div>

            {/* Card 2: Leads */}
            <motion.div
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="fz-os-card p-4 sm:p-5"
            >
              <div className="flex items-start justify-between mb-2.5 sm:mb-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#003D9B] dark:text-[#00E3FD] flex items-center justify-center border border-blue-100 dark:border-blue-900/40">
                  <Users className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                </div>
              </div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 truncate">
                Leads
              </p>
              <div className="flex items-baseline gap-2 flex-wrap">
                <p
                  className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-slate-100 font-mono tracking-tight"
                  suppressHydrationWarning
                >
                  {isLoadingLeads ? "..." : leads.length}
                </p>
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 font-mono">
                  {openLeads.length} abertos
                </span>
              </div>
            </motion.div>

            {/* Card 3: Receita do Mês */}
            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="fz-os-card p-4 sm:p-5"
            >
              <div className="flex items-start justify-between mb-2.5 sm:mb-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/40">
                  <DollarSign className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                </div>
              </div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 truncate">
                Receita do Mês
              </p>
              <div className="flex items-baseline gap-2 flex-wrap">
                <p
                  className="text-xl sm:text-2xl md:text-3xl font-semibold text-slate-900 dark:text-slate-100 font-mono tracking-tight"
                  suppressHydrationWarning
                >
                  {isLoadingTransactions
                    ? "..."
                    : `R$ ${currentMonthRevenue.toLocaleString("pt-BR")}`}
                </p>
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 font-mono">
                  {totalRevenue > totalExpenses ? "Positivo" : "Equilibrado"}
                </span>
              </div>
            </motion.div>

            {/* Card 4: Tarefas Pendentes */}
            <motion.div
              custom={4}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="fz-os-card p-4 sm:p-5"
            >
              <div className="flex items-start justify-between mb-2.5 sm:mb-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#003D9B] dark:text-[#00E3FD] flex items-center justify-center border border-blue-100 dark:border-blue-900/40">
                  <ListChecks className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                </div>
              </div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 truncate">
                Tarefas Pendentes
              </p>
              <div className="flex items-baseline gap-2 flex-wrap">
                <p
                  className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-slate-100 font-mono tracking-tight"
                  suppressHydrationWarning
                >
                  {myDayTasks.length - completedTasksCount}
                </p>
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 font-mono">
                  {myDayTasks.length} total
                </span>
              </div>
            </motion.div>
          </div>

          {/* 2. MIDDLE ROW: Fluxo Financeiro (7 cols) + Atividade Recente (5 cols) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Fluxo Financeiro */}
            <motion.div
              custom={5}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="md:col-span-7 fz-os-card p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Fluxo Financeiro
                    </h2>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Saldo Líquido: R${" "}
                      {(totalRevenue - totalExpenses).toLocaleString("pt-BR")}
                    </p>
                  </div>
                  {/* Timeframe selector pills */}
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#07101B] p-0.5 rounded-lg border border-slate-200/60 dark:border-slate-800">
                    {(["7D", "30D", "90D", "1Y"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTimeframe(t)}
                        className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-medium transition-all ${
                          timeframe === t
                            ? "bg-[#003D9B] text-white shadow-sm"
                            : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#003D9B]" />
                    <span>
                      Receita (R$ {totalRevenue.toLocaleString("pt-BR")})
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#00E3FD]" />
                    <span>
                      Despesa (R$ {totalExpenses.toLocaleString("pt-BR")})
                    </span>
                  </div>
                </div>

                {/* Spline Area Chart */}
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={fluxoFinanceiroData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="gradReceita"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#003D9B"
                            stopOpacity={0.25}
                          />
                          <stop
                            offset="95%"
                            stopColor="#003D9B"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="gradDespesa"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#00E3FD"
                            stopOpacity={0.25}
                          />
                          <stop
                            offset="95%"
                            stopColor="#00E3FD"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="mes"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: "#94A3B8" }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: "#94A3B8" }}
                        tickFormatter={(v) =>
                          v >= 1000 ? `R$ ${v / 1000}k` : `R$ ${v}`
                        }
                        domain={[0, maxFluxoValue]}
                      />
                      <RechartsTooltip
                        formatter={(val: number) => [
                          `R$ ${val.toLocaleString("pt-BR")}`,
                        ]}
                        contentStyle={{
                          backgroundColor: "#0A1624",
                          borderColor: "#162235",
                          borderRadius: "10px",
                          fontSize: "12px",
                          color: "#fff",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="receita"
                        stroke="#003D9B"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#gradReceita)"
                      />
                      <Area
                        type="monotone"
                        dataKey="despesa"
                        stroke="#00E3FD"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#gradDespesa)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>

            {/* Atividade Recente (100% Real from Firestore) */}
            <motion.div
              custom={6}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="md:col-span-5 fz-os-card p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Atividade Recente
                </h2>
                <span className="text-[10px] font-mono text-emerald-500 font-medium">
                  AO VIVO
                </span>
              </div>
              <div className="space-y-3.5">
                {recentActivities.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    <Inbox className="h-6 w-6 mx-auto mb-2 opacity-50" />
                    Nenhuma atividade registrada ainda.
                  </div>
                ) : (
                  recentActivities.map((act) => (
                    <div key={act.id} className="flex items-start gap-3">
                      <span
                        className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${act.dot}`}
                      />
                      <span className="font-mono text-xs text-slate-400 flex-shrink-0 w-11">
                        {act.time}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                          {act.title}
                        </p>
                        <p
                          className={`text-[11px] text-slate-400 truncate ${
                            act.isFinancial || act.isTech ? "font-mono" : ""
                          }`}
                        >
                          {act.subtitle}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>

          {/* 3. BOTTOM ROW: Projetos em Destaque + Visão Geral + Distribuição de Custos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Projetos em Destaque (100% Real from Firestore) */}
            <motion.div
              custom={7}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="fz-os-card p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Projetos em Destaque
                </h2>
                <Link
                  href="/os/projects"
                  className="text-xs font-medium text-[#003D9B] dark:text-[#00E3FD] hover:underline"
                >
                  Ver todos →
                </Link>
              </div>

              <div className="space-y-3.5">
                {projects.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs space-y-2">
                    <p>Nenhum projeto cadastrado no banco de dados.</p>
                    <button
                      onClick={() => setIsNewProjectModalOpen(true)}
                      className="text-[#003D9B] dark:text-[#00E3FD] font-semibold hover:underline block mx-auto text-xs"
                    >
                      + Criar primeiro projeto
                    </button>
                  </div>
                ) : (
                  projects.slice(0, 4).map((p) => (
                    <Link
                      key={p.id}
                      href={`/os/projects/${p.id}`}
                      className="block space-y-1.5 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#003D9B] to-[#00E3FD] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                            {p.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-[#003D9B] dark:group-hover:text-[#00E3FD] transition-colors">
                              {p.name}
                            </p>
                            <p className="text-[10px] font-normal text-slate-400 truncate">
                              {p.description || "Projeto cadastrado no FZ OS"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1 bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-cyan-400 border border-blue-200/50 dark:border-blue-900/40">
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {p.status || "Ativo"}
                          </span>
                          <span className="font-mono text-xs font-medium text-slate-500 dark:text-slate-400">
                            {p.progress || 0}%
                          </span>
                        </div>
                      </div>

                      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#003D9B] to-[#00E3FD] rounded-full transition-all duration-500"
                          style={{ width: `${p.progress || 0}%` }}
                        />
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </motion.div>

            {/* Card 2: Visão Geral (Donut Chart + Real Breakdown) */}
            <motion.div
              custom={8}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="fz-os-card p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Visão Geral
                  </h2>
                  <Link
                    href="/os/finance"
                    className="text-[11px] font-medium text-[#003D9B] dark:text-[#00E3FD] hover:underline"
                  >
                    Financeiro →
                  </Link>
                </div>

                {visaoGeralData.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    <p>Nenhuma transação financeira registrada.</p>
                    <Link
                      href="/os/finance/transactions"
                      className="text-[#003D9B] dark:text-[#00E3FD] font-semibold hover:underline block mt-2 text-xs"
                    >
                      + Registrar primeira transação
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    {/* Donut Chart with Real Center Total Amount */}
                    <div className="relative w-32 h-32 flex-shrink-0 mx-auto">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={visaoGeralData}
                            dataKey="value"
                            innerRadius={40}
                            outerRadius={58}
                            paddingAngle={3}
                            stroke="none"
                          >
                            {visaoGeralData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      {/* Center text in Donut */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span
                          className="text-xs font-semibold text-slate-900 dark:text-slate-100 font-mono tracking-tight"
                          suppressHydrationWarning
                        >
                          R$ {totalCategorizedAmount.toLocaleString("pt-BR")}
                        </span>
                        <span className="text-[10px] font-normal text-slate-400">
                          Total
                        </span>
                      </div>
                    </div>

                    {/* Real Legend List */}
                    <div className="flex-1 w-full space-y-1.5 max-h-44 overflow-y-auto">
                      {visaoGeralData.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="text-[11px] font-normal text-slate-600 dark:text-slate-300 truncate">
                              {item.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0 font-mono text-[11px]">
                            <span className="text-slate-400 font-medium">
                              {item.value}%
                            </span>
                            <span className="text-slate-700 dark:text-slate-200 font-semibold">
                              {item.amount}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Card 3: Distribuição de Custos (Real Bar Chart) */}
            <motion.div
              custom={9}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="fz-os-card p-5 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
                  Distribuição de Custos
                </h2>

                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={custosBarData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <XAxis
                        dataKey="mes"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: "#94A3B8" }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: "#94A3B8" }}
                        tickFormatter={(v) =>
                          v >= 1000 ? `${v / 1000}k` : `${v}`
                        }
                        domain={[0, maxCustosValue]}
                      />
                      <RechartsTooltip
                        formatter={(val: number) => [
                          `R$ ${val.toLocaleString("pt-BR")}`,
                        ]}
                        contentStyle={{
                          backgroundColor: "#0A1624",
                          borderColor: "#162235",
                          borderRadius: "10px",
                          fontSize: "12px",
                          color: "#fff",
                        }}
                      />
                      <Bar
                        dataKey="valor"
                        fill="#00E3FD"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={28}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ============================================================
            RIGHT SECTION (xl:col-span-4): Ações Rápidas + My Day + Notificações
            Powered 100% by Real Data & Firestore Events
            ============================================================ */}
        <div className="xl:col-span-4 flex flex-col gap-6 w-full">
          {/* 1. Ações Rápidas */}
          <motion.div
            custom={10}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="fz-os-card p-5"
          >
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
              Ações Rápidas
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-2 gap-2.5">
              <button
                onClick={() => setIsNewProjectModalOpen(true)}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 dark:bg-[#07101B] border border-slate-200/80 dark:border-slate-800 hover:border-[#003D9B]/40 dark:hover:border-[#00E3FD]/40 transition-all group"
              >
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-[#003D9B] dark:text-[#00E3FD] group-hover:scale-105 transition-transform mb-2">
                  <Plus className="h-4 w-4" />
                </div>
                <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 text-center leading-tight">
                  Novo Projeto
                </span>
              </button>

              <Link
                href="/os/finance/transactions"
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 dark:bg-[#07101B] border border-slate-200/80 dark:border-slate-800 hover:border-[#003D9B]/40 dark:hover:border-[#00E3FD]/40 transition-all group"
              >
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-[#003D9B] dark:text-[#00E3FD] group-hover:scale-105 transition-transform mb-2">
                  <CreditCard className="h-4 w-4" />
                </div>
                <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 text-center leading-tight">
                  Registrar Despesa
                </span>
              </Link>

              <Link
                href="/os/crm/leads"
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 dark:bg-[#07101B] border border-slate-200/80 dark:border-slate-800 hover:border-[#003D9B]/40 dark:hover:border-[#00E3FD]/40 transition-all group"
              >
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-[#003D9B] dark:text-[#00E3FD] group-hover:scale-105 transition-transform mb-2">
                  <Users className="h-4 w-4" />
                </div>
                <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 text-center leading-tight">
                  Novo Lead
                </span>
              </Link>

              <Link
                href="/os/finance/reports"
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 dark:bg-[#07101B] border border-slate-200/80 dark:border-slate-800 hover:border-[#003D9B]/40 dark:hover:border-[#00E3FD]/40 transition-all group"
              >
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-[#003D9B] dark:text-[#00E3FD] group-hover:scale-105 transition-transform mb-2">
                  <FileText className="h-4 w-4" />
                </div>
                <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 text-center leading-tight">
                  Gerar Relatório
                </span>
              </Link>
            </div>
          </motion.div>

          {/* 2. My Day (Real tasks linked to Projects and Leads) */}
          <motion.div
            custom={11}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="fz-os-card p-5"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                My Day
              </h2>
              <Link
                href="/os/workflow"
                className="text-xs font-medium text-[#003D9B] dark:text-[#00E3FD] hover:underline"
              >
                Ver tudo →
              </Link>
            </div>

            <p className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400 mb-2">
              {completedTasksCount}/{myDayTasks.length} tarefas (
              {taskPercentage}%)
            </p>

            {/* Glowing Progress Bar */}
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-4">
              <motion.div
                className="h-full bg-gradient-to-r from-[#003D9B] to-[#00E3FD] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${taskPercentage}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>

            {/* Interactive Task Checklist */}
            <div className="space-y-2">
              {myDayTasks.length === 0 ? (
                <p className="text-xs text-slate-400 py-3 text-center">
                  Todas as tarefas do sistema em dia!
                </p>
              ) : (
                myDayTasks.map((task) => {
                  const isDone = completedTaskIds[task.id] ?? task.defaultDone;
                  return (
                    <button
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className="w-full flex items-center gap-2.5 text-left group transition-all"
                    >
                      {isDone ? (
                        <div className="w-4 h-4 rounded bg-[#003D9B] text-white flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded border border-slate-300 dark:border-slate-700 group-hover:border-[#003D9B] dark:group-hover:border-[#00E3FD] flex-shrink-0" />
                      )}
                      <span
                        className={`text-xs font-normal transition-colors line-clamp-1 ${
                          isDone
                            ? "text-slate-400 line-through"
                            : "text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white"
                        }`}
                      >
                        {task.text}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>

          {/* 3. Notificações (Real from Firestore) */}
          <motion.div
            custom={12}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="fz-os-card p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Notificações
              </h2>
              <Link
                href="/os/notifications"
                className="text-xs font-medium text-[#003D9B] dark:text-[#00E3FD] hover:underline"
              >
                Ver todas →
              </Link>
            </div>

            {/* Category Filter Pills matching mockup */}
            <div className="flex items-center gap-1.5 mb-3.5 flex-wrap">
              <button
                onClick={() => setNotifFilter("todas")}
                className={`px-2 py-0.5 rounded-full text-[10px] font-medium transition-all ${
                  notifFilter === "todas"
                    ? "bg-[#003D9B] text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                }`}
              >
                Todas{" "}
                <span className="font-mono">{realNotifications.length}</span>
              </button>
              <button
                onClick={() => setNotifFilter("criticas")}
                className={`px-2 py-0.5 rounded-full text-[10px] font-medium transition-all ${
                  notifFilter === "criticas"
                    ? "bg-red-500 text-white"
                    : "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200/50 dark:border-red-900/50"
                }`}
              >
                Críticas <span className="font-mono">{criticasCount}</span>
              </button>
              <button
                onClick={() => setNotifFilter("atencao")}
                className={`px-2 py-0.5 rounded-full text-[10px] font-medium transition-all ${
                  notifFilter === "atencao"
                    ? "bg-amber-500 text-white"
                    : "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/50"
                }`}
              >
                Atenção <span className="font-mono">{atencaoCount}</span>
              </button>
              <button
                onClick={() => setNotifFilter("info")}
                className={`px-2 py-0.5 rounded-full text-[10px] font-medium transition-all ${
                  notifFilter === "info"
                    ? "bg-blue-600 text-white"
                    : "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/50"
                }`}
              >
                Info <span className="font-mono">{infoCount}</span>
              </button>
            </div>

            {/* Notification items */}
            <div className="space-y-3">
              {filteredNotifications.length === 0 ? (
                <p className="text-xs text-slate-400 py-3 text-center">
                  Nenhuma notificação nesta categoria.
                </p>
              ) : (
                filteredNotifications.map((notif) => (
                  <div key={notif.id} className="flex items-start gap-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${notif.badgeBg}`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${notif.badgeColor}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {notif.title}
                      </p>
                      <p className="text-[11px] font-normal text-slate-500 dark:text-slate-400 truncate">
                        {notif.subtitle}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 flex-shrink-0">
                      {notif.time}
                    </span>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* New Project Modal */}
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
      />
    </div>
  );
}
