"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  PieChart as PieChartIcon,
  ArrowLeft,
} from "lucide-react";
import { useTransactions } from "@/features/finance/api/use-transactions";
import { PageHeader } from "@/components/os/page-header";
import { Button } from "@/components/os/button";
import { Panel, PanelHeader } from "@/components/os/panel";
import { StatusBadge } from "@/components/os/status-badge";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.35, ease: [0.4, 0, 0.2, 1] },
  }),
};

export default function ReportsPage() {
  const { data: transactions = [] } = useTransactions();

  const totalRevenue = transactions
    .filter((t) => t.type === "in")
    .reduce((a, c) => a + c.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.type === "out")
    .reduce((a, c) => a + c.amount, 0);
  const netProfit = totalRevenue - totalExpenses;
  const margin =
    totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : "0";

  const monthlyData = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
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
  }, [transactions]);

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

  const formatCurrencyFull = (v: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(v);

  const handleExportCSV = () => {
    const rows = [
      ["Data", "Tipo", "Descrição", "Categoria", "Valor"],
      ...transactions.map((t) => [
        t.createdAt
          ? new Date(t.createdAt.seconds * 1000).toLocaleDateString("pt-BR")
          : "—",
        t.type === "in" ? "Entrada" : "Saída",
        t.description,
        t.category,
        t.amount.toString(),
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fz-relatorio-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-[1400px] mx-auto w-full space-y-6">
      <PageHeader
        title="Relatórios & DRE"
        description="Demonstrativo de Resultado do Exercício simplificado, fluxo de caixa e análise analítica de custos"
        breadcrumbs={[
          { label: "Financeiro", href: "/os/finance" },
          { label: "Relatórios DRE" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/os/finance">
              <Button
                variant="secondary"
                size="sm"
                leadingIcon={<ArrowLeft className="h-4 w-4" />}
              >
                Painel Geral
              </Button>
            </Link>
            <Button
              variant="primary"
              size="sm"
              leadingIcon={<Download className="h-4 w-4" />}
              onClick={handleExportCSV}
            >
              Exportar CSV
            </Button>
          </div>
        }
      />

      {/* DRE SIMPLIFICADO */}
      <motion.div
        custom={1}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <Panel className="overflow-hidden">
          <div className="px-6 py-4 border-b border-os-border flex items-center justify-between">
            <PanelHeader
              title="DRE Simplificado (Consolidado)"
              description="Demonstração contábil operacional da FZ Build"
              icon={<FileText className="h-4 w-4 text-os-primary" />}
            />
            <StatusBadge
              label={netProfit >= 0 ? "Superávit" : "Déficit"}
              tone={netProfit >= 0 ? "success" : "danger"}
            />
          </div>
          <div className="divide-y divide-os-border">
            {[
              {
                label: "Receita Operacional Bruta",
                value: totalRevenue,
                color: "text-emerald-600 dark:text-emerald-400",
                icon: TrendingUp,
                bg: "bg-emerald-500/10",
              },
              {
                label: "(-) Custos e Despesas Operacionais",
                value: -totalExpenses,
                color: "text-red-500",
                icon: TrendingDown,
                bg: "bg-red-500/10",
              },
              {
                label: "Resultado Líquido do Exercício",
                value: netProfit,
                color: netProfit >= 0 ? "text-os-primary" : "text-red-500",
                icon: DollarSign,
                bg: "bg-os-primary/10",
                bold: true,
              },
            ].map((row) => (
              <div
                key={row.label}
                className={`px-6 py-4 flex items-center justify-between ${
                  row.bold ? "bg-os-bg/50" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${row.bg}`}>
                    <row.icon className={`h-4 w-4 ${row.color}`} />
                  </div>
                  <span
                    className={`text-sm ${
                      row.bold
                        ? "font-bold text-os-text"
                        : "font-medium text-os-muted"
                    }`}
                  >
                    {row.label}
                  </span>
                </div>
                <span className={`font-mono font-bold text-base ${row.color}`}>
                  {formatCurrencyFull(Math.abs(row.value))}
                </span>
              </div>
            ))}
            <div className="px-6 py-3 bg-os-bg/30 flex items-center justify-between text-xs">
              <span className="text-os-muted font-medium">
                Margem Líquida Operacional
              </span>
              <span
                className={`font-mono font-bold text-sm ${
                  Number(margin) >= 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-500"
                }`}
              >
                {margin}%
              </span>
            </div>
          </div>
        </Panel>
      </motion.div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Area chart - cash flow */}
        <motion.div
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <Panel className="p-6">
            <PanelHeader
              title="Fluxo de Lucro Líquido (6 meses)"
              description="Evolução temporal do resultado mensal"
              icon={<TrendingUp className="h-4 w-4 text-os-primary" />}
            />
            <div className="mt-4">
              <ResponsiveContainer width="100%" height={210}>
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorLucro" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--os-primary, #003d9b)"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--os-primary, #003d9b)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
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
                  <Area
                    type="monotone"
                    dataKey="lucro"
                    stroke="var(--os-primary, #003d9b)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorLucro)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </motion.div>

        {/* Expense breakdown */}
        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <Panel className="p-6">
            <PanelHeader
              title="Breakdown de Custos por Categoria"
              description="Participação percentual sobre as despesas totais"
              icon={<PieChartIcon className="h-4 w-4 text-os-primary" />}
            />
            {expenseByCategory.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-os-muted mt-4">
                <PieChartIcon className="h-8 w-8 mb-2 opacity-40" />
                <p className="text-xs">Sem despesas para exibir</p>
              </div>
            ) : (
              <div className="space-y-3 mt-4">
                {expenseByCategory.map((item, i) => {
                  const pct =
                    totalExpenses > 0 ? (item.value / totalExpenses) * 100 : 0;
                  return (
                    <div key={item.name}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-os-muted flex items-center gap-1.5 truncate">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{
                              background: CHART_COLORS[i % CHART_COLORS.length],
                            }}
                          />
                          {item.name}
                        </span>
                        <span className="font-semibold text-os-text font-mono">
                          {formatCurrencyFull(item.value)}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-os-bg rounded-full overflow-hidden border border-os-border/50">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${pct}%`,
                            background: CHART_COLORS[i % CHART_COLORS.length],
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Panel>
        </motion.div>
      </div>

      {/* Monthly summary table */}
      <motion.div
        custom={4}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <Panel className="overflow-hidden">
          <div className="px-6 py-4 border-b border-os-border flex items-center gap-2">
            <PanelHeader
              title="Resumo Mensal Consolidado"
              description="Acompanhamento analítico mês a mês"
              icon={<BarChart3 className="h-4 w-4 text-os-primary" />}
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-os-bg border-b border-os-border">
                  <th className="px-6 py-3 text-xs font-bold text-os-muted uppercase tracking-wider">
                    Mês
                  </th>
                  <th className="px-6 py-3 text-xs font-bold text-os-muted uppercase tracking-wider text-right">
                    Receita
                  </th>
                  <th className="px-6 py-3 text-xs font-bold text-os-muted uppercase tracking-wider text-right">
                    Despesa
                  </th>
                  <th className="px-6 py-3 text-xs font-bold text-os-muted uppercase tracking-wider text-right">
                    Lucro
                  </th>
                  <th className="px-6 py-3 text-xs font-bold text-os-muted uppercase tracking-wider text-right">
                    Margem
                  </th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((row) => {
                  const m =
                    row.receita > 0
                      ? ((row.lucro / row.receita) * 100).toFixed(1)
                      : "0";
                  return (
                    <tr
                      key={row.name}
                      className="border-b border-os-border/60 hover:bg-os-bg/50 transition-colors"
                    >
                      <td className="px-6 py-3.5 font-medium text-sm text-os-text">
                        {row.name}
                      </td>
                      <td className="px-6 py-3.5 text-right font-mono text-sm text-emerald-600 dark:text-emerald-400 font-semibold">
                        {formatCurrencyFull(row.receita)}
                      </td>
                      <td className="px-6 py-3.5 text-right font-mono text-sm text-red-500 font-semibold">
                        {formatCurrencyFull(row.despesa)}
                      </td>
                      <td
                        className={`px-6 py-3.5 text-right font-mono text-sm font-bold ${
                          row.lucro >= 0 ? "text-os-primary" : "text-red-500"
                        }`}
                      >
                        {formatCurrencyFull(row.lucro)}
                      </td>
                      <td
                        className={`px-6 py-3.5 text-right text-sm font-semibold font-mono ${
                          Number(m) >= 0
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-red-500"
                        }`}
                      >
                        {m}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>
      </motion.div>
    </div>
  );
}
