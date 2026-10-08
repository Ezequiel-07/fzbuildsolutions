"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Target,
  BarChart3,
  FileText,
  Calendar,
  Landmark,
} from "lucide-react";
import { useTransactions } from "@/features/finance/api/use-transactions";
import { ImportSpreadsheetModal } from "@/features/finance/components/import-spreadsheet-modal";
import { PageHeader } from "@/components/os/page-header";
import { Button } from "@/components/os/button";
import { Panel, PanelHeader } from "@/components/os/panel";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.35, ease: [0.4, 0, 0.2, 1] },
  }),
};

const CHART_COLORS = [
  "#003d9b",
  "#006875",
  "#0284c7",
  "#d97706",
  "#7c3aed",
  "#db2777",
];

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

export default function FinancePage() {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const { data: transactions = [], isLoading } = useTransactions();

  const totalRevenue = transactions
    .filter((t) => t.type === "in")
    .reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.type === "out")
    .reduce((acc, curr) => acc + curr.amount, 0);
  const netProfit = totalRevenue - totalExpenses;
  const margin =
    totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : "0";

  // Group expenses by category
  const expenseByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    transactions
      .filter((t) => t.type === "out")
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  // Monthly data (from transactions)
  const monthlyData = useMemo(() => {
    const now = new Date();
    const data = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const monthKey = d.getMonth();
      const year = d.getFullYear();
      const ins = transactions
        .filter((t) => {
          if (!t.createdAt) return false;
          const td = new Date(t.createdAt.seconds * 1000);
          return (
            td.getMonth() === monthKey &&
            td.getFullYear() === year &&
            t.type === "in"
          );
        })
        .reduce((a, c) => a + c.amount, 0);
      const outs = transactions
        .filter((t) => {
          if (!t.createdAt) return false;
          const td = new Date(t.createdAt.seconds * 1000);
          return (
            td.getMonth() === monthKey &&
            td.getFullYear() === year &&
            t.type === "out"
          );
        })
        .reduce((a, c) => a + c.amount, 0);
      return {
        name: MONTHS[monthKey],
        receita: ins,
        despesa: outs,
        lucro: ins - outs,
      };
    });
    return data;
  }, [transactions]);

  const formatCurrencyFull = (v: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(v);

  return (
    <div className="max-w-[1400px] mx-auto w-full space-y-6">
      <PageHeader
        title="Painel Financeiro"
        description="Gestão de receitas, custos e análise executiva de resultados operacionais"
        breadcrumbs={[
          { label: "Operação", href: "/os" },
          { label: "Financeiro" },
        ]}
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="secondary"
              size="sm"
              leadingIcon={<Landmark className="h-4 w-4 text-[#0066ff]" />}
              onClick={() => setIsImportModalOpen(true)}
            >
              Conciliar Extrato / Planilha
            </Button>
            <Link href="/os/finance/transactions">
              <Button
                variant="secondary"
                size="sm"
                leadingIcon={<BarChart3 className="h-4 w-4" />}
              >
                Planilha de Transações
              </Button>
            </Link>
            <Link href="/os/finance/reports">
              <Button
                variant="primary"
                size="sm"
                leadingIcon={<FileText className="h-4 w-4" />}
              >
                Relatórios DRE
              </Button>
            </Link>
          </div>
        }
      />

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Receita Total",
            value: formatCurrencyFull(totalRevenue),
            icon: TrendingUp,
            color: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-500/10",
            sub: "Todas as entradas",
          },
          {
            label: "Custos Totais",
            value: formatCurrencyFull(totalExpenses),
            icon: TrendingDown,
            color: "text-red-500",
            bg: "bg-red-500/10",
            sub: "Todas as saídas",
          },
          {
            label: "Lucro Líquido",
            value: formatCurrencyFull(netProfit),
            icon: DollarSign,
            color: netProfit >= 0 ? "text-os-primary" : "text-red-500",
            bg: "bg-os-primary/10",
            sub: "Receita - Custos",
          },
          {
            label: "Margem Operacional",
            value: `${margin}%`,
            icon: Target,
            color: "text-violet-600 dark:text-violet-400",
            bg: "bg-violet-500/10",
            sub: "Margem de lucratividade",
          },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            custom={i + 1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <Panel className="p-5 hover:border-os-border-strong transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${kpi.bg}`}>
                  <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                </div>
              </div>
              <p className="text-xs font-medium text-os-muted mb-1">
                {kpi.label}
              </p>
              <p className={`text-2xl font-bold tracking-tight ${kpi.color}`}>
                {kpi.value}
              </p>
              <p className="text-[11px] text-os-muted mt-1">{kpi.sub}</p>
            </Panel>
          </motion.div>
        ))}
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly bar chart */}
        <motion.div
          custom={5}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2"
        >
          <Panel className="p-6">
            <div className="flex items-center justify-between mb-6">
              <PanelHeader
                title="Receita vs Despesa (Últimos 6 meses)"
                description="Comparativo de entradas e saídas consolidadas"
                icon={<BarChart3 className="h-4 w-4 text-os-primary" />}
              />
              <div className="flex items-center gap-4 text-xs text-os-muted font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-os-primary" />
                  Receita
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  Despesa
                </span>
              </div>
            </div>
            {isLoading ? (
              <div className="h-48 bg-os-bg rounded-xl animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyData} barSize={20} barGap={4}>
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 11,
                      fill: "var(--os-text-muted, #94a3b8)",
                    }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 11,
                      fill: "var(--os-text-muted, #94a3b8)",
                    }}
                    tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(v: number) => formatCurrencyFull(v)}
                    contentStyle={{
                      background: "var(--os-surface, #ffffff)",
                      border: "1px solid var(--os-border, #e2e8f0)",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar
                    dataKey="receita"
                    fill="var(--os-primary, #003d9b)"
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar dataKey="despesa" fill="#f87171" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Panel>
        </motion.div>

        {/* Expense breakdown pie */}
        <motion.div
          custom={6}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <Panel className="p-6">
            <PanelHeader
              title="Distribuição de Custos"
              description="Despesas por categoria operacional"
              icon={<DollarSign className="h-4 w-4 text-os-primary" />}
            />
            {expenseByCategory.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-os-muted mt-4">
                <DollarSign className="h-8 w-8 mb-2 opacity-40" />
                <p className="text-xs">Sem despesas registradas</p>
              </div>
            ) : (
              <div className="mt-4">
                <ResponsiveContainer width="100%" height={150}>
                  <PieChart>
                    <Pie
                      data={expenseByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={65}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {expenseByCategory.map((_, i) => (
                        <Cell
                          key={i}
                          fill={CHART_COLORS[i % CHART_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v: number) => formatCurrencyFull(v)}
                      contentStyle={{
                        background: "var(--os-surface, #ffffff)",
                        border: "1px solid var(--os-border, #e2e8f0)",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-3 space-y-1.5">
                  {expenseByCategory.slice(0, 4).map((item, i) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="flex items-center gap-2 text-os-muted truncate">
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{
                            background: CHART_COLORS[i % CHART_COLORS.length],
                          }}
                        />
                        {item.name}
                      </span>
                      <span className="font-semibold text-os-text ml-2 flex-shrink-0 font-mono">
                        {formatCurrencyFull(item.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Panel>
        </motion.div>
      </div>

      {/* RECENT TRANSACTIONS */}
      <motion.div
        custom={7}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <Panel className="overflow-hidden">
          <div className="px-6 py-4 border-b border-os-border flex items-center justify-between">
            <h2 className="font-semibold text-sm text-os-text">
              Últimas Transações
            </h2>
            <Link
              href="/os/finance/transactions"
              className="text-xs font-semibold text-os-primary hover:underline underline-offset-4"
            >
              Ver planilha completa →
            </Link>
          </div>
          <div className="divide-y divide-os-border">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="px-6 py-4">
                  <div className="h-5 bg-os-bg rounded-lg animate-pulse" />
                </div>
              ))
            ) : transactions.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm text-os-muted">
                  Nenhuma transação cadastrada.{" "}
                  <Link
                    href="/os/finance/transactions"
                    className="text-os-primary font-semibold hover:underline"
                  >
                    Adicionar primeira
                  </Link>
                </p>
              </div>
            ) : (
              transactions.slice(0, 6).map((t) => (
                <div
                  key={t.id}
                  className="px-6 py-3.5 flex items-center gap-4 hover:bg-os-bg/50 transition-colors"
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      t.type === "in"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-red-500/10 text-red-500"
                    }`}
                  >
                    {t.type === "in" ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-os-text truncate">
                      {t.description}
                    </p>
                    <p className="text-xs text-os-muted">{t.category}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p
                      className={`text-sm font-bold font-mono ${
                        t.type === "in"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-red-500"
                      }`}
                    >
                      {t.type === "in" ? "+" : "-"}
                      {formatCurrencyFull(t.amount)}
                    </p>
                    <p className="text-[10px] text-os-muted font-mono flex items-center justify-end gap-1">
                      <Calendar className="h-2.5 w-2.5" />
                      {t.createdAt
                        ? new Date(
                            t.createdAt.seconds * 1000,
                          ).toLocaleDateString("pt-BR")
                        : "—"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Panel>
      </motion.div>

      <ImportSpreadsheetModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />
    </div>
  );
}
