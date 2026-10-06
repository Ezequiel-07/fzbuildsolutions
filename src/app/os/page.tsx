"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  FolderKanban,
  Users,
  DollarSign,
  ListChecks,
  Plus,
  TrendingUp,
  CheckCircle2,
  Circle,
  Briefcase,
  Activity,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
} from "recharts";
import { NewProjectModal } from "@/features/projects/components/new-project-modal";
import { useProjects } from "@/features/projects/api/use-projects";
import { useLeads } from "@/features/crm/api/use-leads";
import { useTransactions } from "@/features/finance/api/use-transactions";
import { useTeam } from "@/features/team/api/use-team";
import { normalizeProjectStatus, PROJECT_STATUS_META } from "@/domain/project";
import { normalizeLeadStage } from "@/domain/lead";
import { PageHeader } from "@/components/os/page-header";
import { Panel } from "@/components/os/panel";
import { Button } from "@/components/os/button";
import { StatusBadge } from "@/components/os/status-badge";
import { ProgressBar } from "@/components/os/panel";
import { EmptyState } from "@/components/os/empty-state";

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

export default function DashboardOverviewPage() {
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [completedTaskIds, setCompletedTaskIds] = useState<
    Record<string, boolean>
  >({});

  // Real Queries from Firestore
  const { data: projects = [] } = useProjects();
  const { data: leads = [] } = useLeads();
  const { data: transactions = [] } = useTransactions();
  const { data: teamMembers = [] } = useTeam();

  // Metrics
  const activeProjects = useMemo(() => {
    return projects.filter((p) => normalizeProjectStatus(p.status) !== "done");
  }, [projects]);

  const openLeads = useMemo(() => {
    return leads.filter((l) => {
      const s = normalizeLeadStage(l.stage);
      return s !== "won" && s !== "lost";
    });
  }, [leads]);

  const openPipelineValue = useMemo(() => {
    return openLeads.reduce((acc, l) => acc + (l.value || 0), 0);
  }, [openLeads]);

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

    const totalIn = transactions
      .filter((t) => t.type === "in")
      .reduce((acc, t) => acc + (t.amount || 0), 0);

    return sum > 0 ? sum : totalIn;
  }, [transactions]);

  // Financial Chart (Receita vs Despesa last 6 months)
  const fluxoFinanceiroData = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const monthIdx = d.getMonth();
      const year = d.getFullYear();

      const receita = transactions
        .filter((t) => {
          if (t.type !== "in" || !t.createdAt) return false;
          const td = new Date(t.createdAt.seconds * 1000);
          return td.getMonth() === monthIdx && td.getFullYear() === year;
        })
        .reduce((acc, t) => acc + (t.amount || 0), 0);

      const despesa = transactions
        .filter((t) => {
          if (t.type !== "out" || !t.createdAt) return false;
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

  // Operational checklist ("Meu Dia")
  const checklistItems = useMemo(() => {
    const items = [
      {
        id: "chk-1",
        text: "Alinhar prioridades das squads",
        defaultDone: true,
      },
      {
        id: "chk-2",
        text: "Revisar entregas da sprint EZYX",
        defaultDone: false,
      },
      {
        id: "chk-3",
        text: "Validar conciliação bancária do mês",
        defaultDone: false,
      },
      {
        id: "chk-4",
        text: "Follow-up de propostas comerciais em análise",
        defaultDone: false,
      },
    ];
    return items;
  }, []);

  const completedChecklistCount =
    Object.values(completedTaskIds).filter(Boolean).length;

  const toggleChecklist = (id: string) => {
    setCompletedTaskIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Recent merged activities feed
  const recentActivities = useMemo(() => {
    const list: Array<{
      id: string;
      title: string;
      subtitle: string;
      time: string;
      type: "project" | "finance" | "lead";
      timestamp: number;
    }> = [];

    projects.slice(0, 3).forEach((p) => {
      list.push({
        id: `p-${p.id}`,
        title: `Projeto: ${p.name}`,
        subtitle: `Progresso: ${p.progress || 0}%`,
        time: formatTimestamp(p.createdAt),
        type: "project",
        timestamp: p.createdAt?.seconds || 0,
      });
    });

    transactions.slice(0, 3).forEach((t) => {
      list.push({
        id: `t-${t.id}`,
        title: `${t.type === "in" ? "Receita" : "Despesa"}: ${t.description}`,
        subtitle: `R$ ${(t.amount || 0).toLocaleString("pt-BR")}`,
        time: formatTimestamp(t.createdAt),
        type: "finance",
        timestamp: t.createdAt?.seconds || 0,
      });
    });

    leads.slice(0, 3).forEach((l) => {
      list.push({
        id: `l-${l.id}`,
        title: `Lead: ${l.clientName}`,
        subtitle: `R$ ${(l.value || 0).toLocaleString("pt-BR")}`,
        time: formatTimestamp(l.createdAt),
        type: "lead",
        timestamp: l.createdAt?.seconds || 0,
      });
    });

    return list.sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);
  }, [projects, transactions, leads]);

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(v);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cockpit Operacional"
        description="Visão unificada de faturamento, projetos, pipeline e squads da software house"
        actions={
          <Button
            variant="primary"
            onClick={() => setIsNewProjectModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            <span>Novo Projeto</span>
          </Button>
        }
      />

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Panel className="p-4 space-y-2">
          <div className="flex items-center justify-between text-os-muted">
            <span className="text-xs font-medium">Receita no Mês</span>
            <DollarSign className="h-4 w-4 text-os-primary" />
          </div>
          <p className="text-2xl font-bold text-os-fg">
            {formatCurrency(currentMonthRevenue)}
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-os-success font-medium">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Fluxo sincronizado com Firestore</span>
          </div>
        </Panel>

        <Panel className="p-4 space-y-2">
          <div className="flex items-center justify-between text-os-muted">
            <span className="text-xs font-medium">Projetos Ativos</span>
            <FolderKanban className="h-4 w-4 text-os-accent" />
          </div>
          <p className="text-2xl font-bold text-os-fg">
            {activeProjects.length}
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-os-muted font-mono">
            <span>{projects.length} no portfólio geral</span>
          </div>
        </Panel>

        <Panel className="p-4 space-y-2">
          <div className="flex items-center justify-between text-os-muted">
            <span className="text-xs font-medium">Pipeline Comercial</span>
            <Briefcase className="h-4 w-4 text-os-primary" />
          </div>
          <p className="text-2xl font-bold text-os-fg">
            {formatCurrency(openPipelineValue)}
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-os-muted font-mono">
            <span>{openLeads.length} oportunidades abertas</span>
          </div>
        </Panel>

        <Panel className="p-4 space-y-2">
          <div className="flex items-center justify-between text-os-muted">
            <span className="text-xs font-medium">Especialistas na Squad</span>
            <Users className="h-4 w-4 text-os-success" />
          </div>
          <p className="text-2xl font-bold text-os-fg">{teamMembers.length}</p>
          <div className="flex items-center gap-1.5 text-[11px] text-os-success font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Capacidade ativa: {teamMembers.length * 40}h/sem</span>
          </div>
        </Panel>
      </div>

      {/* Grid: 2/3 Financial Chart + 1/3 "Meu Dia" */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cashflow Spline AreaChart */}
        <Panel className="lg:col-span-2 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-os-fg">
                Fluxo de Caixa Operacional
              </h3>
              <p className="text-xs text-os-muted">
                Histórico semestral de receitas e despesas
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-os-primary font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#003D9B]" />
                Receita
              </span>
              <span className="flex items-center gap-1.5 text-os-accent font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00E3FD]" />
                Despesa
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={fluxoFinanceiroData}>
                <defs>
                  <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#003D9B" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#003D9B" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorDespesa" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E3FD" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00E3FD" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="mes"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) =>
                    `R$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`
                  }
                />
                <RechartsTooltip
                  formatter={(val: number) => formatCurrency(val)}
                  contentStyle={{
                    backgroundColor: "rgb(var(--os-surface))",
                    borderColor: "rgb(var(--os-border))",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="receita"
                  stroke="#003D9B"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorReceita)"
                />
                <Area
                  type="monotone"
                  dataKey="despesa"
                  stroke="#00E3FD"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorDespesa)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        {/* Meu Dia Checklist */}
        <Panel className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-os-fg flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-os-primary" />
              <span>Meu Dia Operacional</span>
            </h3>
            <span className="text-xs font-mono font-bold text-os-muted">
              {completedChecklistCount}/{checklistItems.length}
            </span>
          </div>

          <p className="text-xs text-os-muted">
            Tarefas operacionais e acompanhamento do dia
          </p>

          <div className="space-y-2">
            {checklistItems.map((item) => {
              const isDone = !!completedTaskIds[item.id] || item.defaultDone;
              return (
                <button
                  key={item.id}
                  onClick={() => toggleChecklist(item.id)}
                  className="w-full flex items-center gap-2.5 p-2.5 rounded-xl border border-os-border hover:bg-os-surface-2 transition-colors text-left group"
                >
                  {isDone ? (
                    <CheckCircle2 className="h-4 w-4 text-os-success flex-shrink-0" />
                  ) : (
                    <Circle className="h-4 w-4 text-os-muted group-hover:text-os-fg flex-shrink-0" />
                  )}
                  <span
                    className={`text-xs truncate ${
                      isDone
                        ? "line-through text-os-muted"
                        : "text-os-fg font-medium"
                    }`}
                  >
                    {item.text}
                  </span>
                </button>
              );
            })}
          </div>
        </Panel>
      </div>

      {/* Bottom Grid: Active Projects + Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projects in Delivery */}
        <Panel className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-os-fg flex items-center gap-2">
              <FolderKanban className="h-4 w-4 text-os-primary" />
              <span>Projetos em Execução</span>
            </h3>
            <Link
              href="/os/projects"
              className="text-xs text-os-primary hover:underline font-medium"
            >
              Ver todos →
            </Link>
          </div>

          {activeProjects.length === 0 ? (
            <EmptyState
              icon={FolderKanban}
              title="Nenhum projeto ativo no momento"
              description="Cadastre novos projetos corporativos para acompanhar os marcos de entrega."
            />
          ) : (
            <div className="divide-y divide-os-border">
              {activeProjects.slice(0, 4).map((p) => {
                const canonical = normalizeProjectStatus(p.status);
                const meta = PROJECT_STATUS_META[canonical];
                const progress = p.progress || 0;

                return (
                  <Link
                    key={p.id}
                    href={`/os/projects/${p.id}`}
                    className="py-3 flex items-center justify-between hover:bg-os-surface-2/40 px-1 rounded-lg transition-colors group"
                  >
                    <div className="min-w-0 pr-3">
                      <p className="text-xs font-semibold text-os-fg group-hover:text-os-primary transition-colors truncate">
                        {p.name}
                      </p>
                      <p className="text-[11px] text-os-muted truncate">
                        {p.description || "Projeto em andamento"}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="w-24 space-y-1">
                        <div className="flex justify-between text-[10px] font-mono text-os-muted">
                          <span>{progress}%</span>
                        </div>
                        <ProgressBar value={progress} />
                      </div>
                      <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </Panel>

        {/* Live Activity Feed */}
        <Panel className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-os-fg flex items-center gap-2">
              <Activity className="h-4 w-4 text-os-primary" />
              <span>Atividade Operacional Recente</span>
            </h3>
            <Link
              href="/os/admin/logs"
              className="text-xs text-os-primary hover:underline font-medium"
            >
              Auditoria →
            </Link>
          </div>

          {recentActivities.length === 0 ? (
            <EmptyState
              icon={Activity}
              title="Sem atividades recentes"
              description="Transações, novos leads e projetos aparecem neste feed."
            />
          ) : (
            <div className="space-y-3">
              {recentActivities.map((act) => (
                <div
                  key={act.id}
                  className="p-3 rounded-xl border border-os-border bg-os-surface-2/40 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-os-fg truncate">
                      {act.title}
                    </p>
                    <p className="text-[11px] text-os-muted truncate">
                      {act.subtitle}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-os-muted flex-shrink-0">
                    {act.time}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>

      {/* New Project Modal */}
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
      />
    </div>
  );
}
