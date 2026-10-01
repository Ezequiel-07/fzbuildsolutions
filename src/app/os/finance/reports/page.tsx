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
} from "lucide-react";
import { useTransactions } from "@/features/finance/api/use-transactions";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#003d9b",
  "#00e3fd",
  "#006875",
  "#f97316",
  "#8b5cf6",
  "#ec4899",
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
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: [0.4, 0, 0.2, 1] },
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
      {/* HEADER */}
      <motion.div
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Relatórios Financeiros
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            DRE simplificado, fluxo de caixa e análise por categoria
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

      {/* DRE SIMPLIFICADO */}
      <motion.div
        custom={1}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="bg-white dark:bg-[#0D1C2C] rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <FileText className="h-4 w-4 text-[#003d9b]" />
          <h2 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
            DRE Simplificado
          </h2>
        </div>
        <div className="divide-y divide-slate-50 dark:divide-slate-800">
          {[
            {
              label: "Receita Bruta",
              value: totalRevenue,
              color: "text-green-600",
              icon: TrendingUp,
              bg: "bg-green-50",
            },
            {
              label: "(-) Custos e Despesas",
              value: -totalExpenses,
              color: "text-red-500",
              icon: TrendingDown,
              bg: "bg-red-50",
            },
            {
              label: "Lucro Líquido",
              value: netProfit,
              color: netProfit >= 0 ? "text-[#003d9b]" : "text-red-500",
              icon: DollarSign,
              bg: "bg-blue-50",
              bold: true,
            },
          ].map((row) => (
            <div
              key={row.label}
              className={`px-6 py-4 flex items-center justify-between ${row.bold ? "bg-slate-50/80 dark:bg-slate-800/30" : ""}`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${row.bg} dark:bg-opacity-20`}>
                  <row.icon className={`h-4 w-4 ${row.color}`} />
                </div>
                <span
                  className={`text-sm ${row.bold ? "font-bold text-slate-900 dark:text-slate-100" : "font-medium text-slate-700 dark:text-slate-300"}`}
                >
                  {row.label}
                </span>
              </div>
              <span className={`font-mono font-bold text-base ${row.color}`}>
                {formatCurrencyFull(Math.abs(row.value))}
              </span>
            </div>
          ))}
          <div className="px-6 py-3 bg-slate-50/50 dark:bg-slate-800/20 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              Margem de Lucro
            </span>
            <span
              className={`font-mono font-bold text-sm ${Number(margin) >= 0 ? "text-green-600" : "text-red-500"}`}
            >
              {margin}%
            </span>
          </div>
        </div>
      </motion.div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Area chart - cash flow */}
        <motion.div
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="bg-white dark:bg-[#0D1C2C] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6"
        >
          <h2 className="font-semibold text-sm text-slate-900 dark:text-slate-100 mb-6">
            Fluxo de Caixa (6 meses)
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorLucro" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#003d9b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#003d9b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(v: number) => formatCurrencyFull(v)}
                contentStyle={{
                  background: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="lucro"
                stroke="#003d9b"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorLucro)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Expense breakdown */}
        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="bg-white dark:bg-[#0D1C2C] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6"
        >
          <h2 className="font-semibold text-sm text-slate-900 dark:text-slate-100 mb-6">
            Breakdown de Custos por Categoria
          </h2>
          {expenseByCategory.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-slate-400">
              <PieChartIcon className="h-8 w-8 mb-2 text-slate-200" />
              <p className="text-xs">Sem despesas para exibir</p>
            </div>
          ) : (
            <div className="space-y-3">
              {expenseByCategory.map((item, i) => {
                const pct =
                  totalExpenses > 0 ? (item.value / totalExpenses) * 100 : 0;
                return (
                  <div key={item.name}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ background: COLORS[i % COLORS.length] }}
                        />
                        {item.name}
                      </span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {formatCurrencyFull(item.value)}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${pct}%`,
                          background: COLORS[i % COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* Monthly summary table */}
      <motion.div
        custom={4}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="bg-white dark:bg-[#0D1C2C] rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-[#003d9b]" />
          <h2 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
            Resumo Mensal
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/50">
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Mês
                </th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                  Receita
                </th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                  Despesa
                </th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                  Lucro
                </th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
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
                    className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-6 py-3.5 font-medium text-sm text-slate-800 dark:text-slate-200">
                      {row.name}
                    </td>
                    <td className="px-6 py-3.5 text-right font-mono text-sm text-green-600 font-semibold">
                      {formatCurrencyFull(row.receita)}
                    </td>
                    <td className="px-6 py-3.5 text-right font-mono text-sm text-red-500 font-semibold">
                      {formatCurrencyFull(row.despesa)}
                    </td>
                    <td
                      className={`px-6 py-3.5 text-right font-mono text-sm font-bold ${row.lucro >= 0 ? "text-[#003d9b]" : "text-red-500"}`}
                    >
                      {formatCurrencyFull(row.lucro)}
                    </td>
                    <td
                      className={`px-6 py-3.5 text-right text-sm font-semibold ${Number(m) >= 0 ? "text-slate-600" : "text-red-500"}`}
                    >
                      {m}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
