"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Target,
  BarChart3,
} from "lucide-react";
import { useTransactions } from "@/features/finance/api/use-transactions";
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
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  }),
};

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

export default function FinancePage() {
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

  const formatCurrency = (v: number) => {
    if (!v || v === 0) return "R$ 0";
    if (Math.abs(v) >= 1000) {
      const k = v / 1000;
      return `R$ ${k.toFixed(1).replace(".", ",")}k`;
    }
    return `R$ ${Math.round(v)}`;
  };

  const formatCurrencyFull = (v: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(v);

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
            Financeiro
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Gestão de receitas, custos e análise de resultados
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/os/finance/transactions"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors"
          >
            <BarChart3 className="h-4 w-4" />
            Planilha
          </Link>
          <Link
            href="/os/finance/reports"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#003d9b] hover:bg-[#003280] text-white text-sm font-semibold shadow-lg shadow-blue-900/20 hover:-translate-y-0.5 transition-all duration-200"
          >
            Ver Relatórios
          </Link>
        </div>
      </motion.div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Receita Total",
            value: formatCurrencyFull(totalRevenue),
            icon: TrendingUp,
            color: "text-green-600",
            bg: "bg-green-100 dark:bg-green-900/30",
            sub: "Todas as entradas",
          },
          {
            label: "Custos Totais",
            value: formatCurrencyFull(totalExpenses),
            icon: TrendingDown,
            color: "text-red-500",
            bg: "bg-red-100 dark:bg-red-900/30",
            sub: "Todas as saídas",
          },
          {
            label: "Lucro Líquido",
            value: formatCurrencyFull(netProfit),
            icon: DollarSign,
            color: netProfit >= 0 ? "text-[#003d9b]" : "text-red-500",
            bg: "bg-blue-100 dark:bg-blue-900/30",
            sub: "Receita - Custos",
          },
          {
            label: "Margem",
            value: `${margin}%`,
            icon: Target,
            color: "text-purple-600",
            bg: "bg-purple-100 dark:bg-purple-900/30",
            sub: "Margem de lucro",
          },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            custom={i + 1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="bg-white dark:bg-[#0D1C2C] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2.5 rounded-xl ${kpi.bg}`}>
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              </div>
            </div>
            <p className="text-xs font-medium text-slate-500 mb-1">
              {kpi.label}
            </p>
            <p className={`text-2xl font-bold tracking-tight ${kpi.color}`}>
              {kpi.value}
            </p>
            <p className="text-xs text-slate-400 mt-1">{kpi.sub}</p>
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
          className="lg:col-span-2 bg-white dark:bg-[#0D1C2C] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
              Receita vs Despesa (6 meses)
            </h2>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#003d9b]" />
                Receita
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                Despesa
              </span>
            </div>
          </div>
          {isLoading ? (
            <div className="h-48 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyData} barSize={20} barGap={4}>
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
                <Bar dataKey="receita" fill="#003d9b" radius={[6, 6, 0, 0]} />
                <Bar dataKey="despesa" fill="#fca5a5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Expense breakdown pie */}
        <motion.div
          custom={6}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="bg-white dark:bg-[#0D1C2C] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6"
        >
          <h2 className="font-semibold text-sm text-slate-900 dark:text-slate-100 mb-6">
            Distribuição de Custos
          </h2>
          {expenseByCategory.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-slate-400">
              <DollarSign className="h-8 w-8 mb-2 text-slate-200" />
              <p className="text-xs">Sem despesas registradas</p>
            </div>
          ) : (
            <>
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
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: number) => formatCurrencyFull(v)}
                    contentStyle={{
                      background: "white",
                      border: "1px solid #e2e8f0",
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
                    <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400 truncate">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: COLORS[i % COLORS.length] }}
                      />
                      {item.name}
                    </span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 ml-2 flex-shrink-0">
                      {formatCurrency(item.value)}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* RECENT TRANSACTIONS */}
      <motion.div
        custom={7}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="bg-white dark:bg-[#0D1C2C] rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
            Últimas Transações
          </h2>
          <Link
            href="/os/finance/transactions"
            className="text-xs font-medium text-[#003d9b] hover:underline underline-offset-4"
          >
            Ver planilha completa →
          </Link>
        </div>
        <div className="divide-y divide-slate-50 dark:divide-slate-800">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-6 py-4">
                <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
              </div>
            ))
          ) : transactions.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-slate-500">
                Nenhuma transação.{" "}
                <Link
                  href="/os/finance/transactions"
                  className="text-[#003d9b] font-semibold hover:underline"
                >
                  Adicionar primeira
                </Link>
              </p>
            </div>
          ) : (
            transactions.slice(0, 6).map((t) => (
              <div
                key={t.id}
                className="px-6 py-3.5 flex items-center gap-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${t.type === "in" ? "bg-green-100" : "bg-red-100"}`}
                >
                  {t.type === "in" ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                    {t.description}
                  </p>
                  <p className="text-xs text-slate-400">{t.category}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p
                    className={`text-sm font-bold font-mono ${t.type === "in" ? "text-green-600" : "text-red-500"}`}
                  >
                    {t.type === "in" ? "+" : "-"}
                    {formatCurrencyFull(t.amount)}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {t.createdAt
                      ? new Date(t.createdAt.seconds * 1000).toLocaleDateString(
                          "pt-BR",
                        )
                      : "—"}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
