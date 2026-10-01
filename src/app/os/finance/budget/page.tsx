"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Target,
  Plus,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  FolderKanban,
  DollarSign,
  Edit3,
  Trash2,
} from "lucide-react";
import {
  useProjects,
  type Project,
} from "@/features/projects/api/use-projects";

type ProjectWithBudget = Project & {
  spent?: number;
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  }),
};

const DEFAULT_BUDGETS = [
  {
    id: "1",
    name: "Infraestrutura Cloud",
    budget: 5000,
    spent: 3200,
    category: "infra",
  },
  {
    id: "2",
    name: "Marketing & Vendas",
    budget: 3000,
    spent: 1800,
    category: "marketing",
  },
  {
    id: "3",
    name: "Software & Licenças",
    budget: 2000,
    spent: 2100,
    category: "software",
  },
  {
    id: "4",
    name: "Administrativo",
    budget: 1500,
    spent: 950,
    category: "admin",
  },
];

export default function BudgetPage() {
  const { data: projects = [] } = useProjects();
  const [budgets] = useState(DEFAULT_BUDGETS);

  const formatCurrencyFull = (v: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(v);

  const totalBudget = budgets.reduce((a, b) => a + b.budget, 0);
  const totalSpent = budgets.reduce((a, b) => a + b.spent, 0);
  const remaining = totalBudget - totalSpent;
  const overBudget = budgets.filter((b) => b.spent > b.budget).length;

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
            Orçamentos
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Controle de budget por categoria e projeto
          </p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#003d9b] hover:bg-[#003280] text-white text-sm font-semibold shadow-lg shadow-blue-900/20 hover:-translate-y-0.5 transition-all duration-200">
          <Plus className="h-4 w-4" />
          Novo Orçamento
        </button>
      </motion.div>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Budget Total",
            value: formatCurrencyFull(totalBudget),
            icon: Target,
            color: "text-[#003d9b]",
            bg: "bg-blue-100 dark:bg-blue-900/30",
          },
          {
            label: "Gasto Total",
            value: formatCurrencyFull(totalSpent),
            icon: TrendingUp,
            color: "text-amber-600",
            bg: "bg-amber-100 dark:bg-amber-900/30",
          },
          {
            label: "Saldo Restante",
            value: formatCurrencyFull(remaining),
            icon: DollarSign,
            color: remaining >= 0 ? "text-green-600" : "text-red-500",
            bg:
              remaining >= 0
                ? "bg-green-100 dark:bg-green-900/30"
                : "bg-red-100 dark:bg-red-900/30",
          },
          {
            label: "Acima do Budget",
            value: `${overBudget} categoria${overBudget !== 1 ? "s" : ""}`,
            icon: AlertTriangle,
            color: overBudget > 0 ? "text-red-500" : "text-green-600",
            bg:
              overBudget > 0
                ? "bg-red-100 dark:bg-red-900/30"
                : "bg-green-100 dark:bg-green-900/30",
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
            <div className={`p-2.5 rounded-xl ${kpi.bg} w-fit mb-3`}>
              <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
            </div>
            <p className="text-xs font-medium text-slate-500 mb-1">
              {kpi.label}
            </p>
            <p className={`text-2xl font-bold tracking-tight ${kpi.color}`}>
              {kpi.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* BUDGET LIST */}
      <motion.div
        custom={5}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="bg-white dark:bg-[#0D1C2C] rounded-2xl border border-slate-200/80 dark:border-slate-800"
      >
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
            Orçamentos por Categoria
          </h2>
        </div>
        <div className="p-6 space-y-5">
          {budgets.map((budget, i) => {
            const pct = Math.min((budget.spent / budget.budget) * 100, 100);
            const over = budget.spent > budget.budget;
            return (
              <motion.div
                key={budget.id}
                custom={i + 6}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition-colors group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {budget.name}
                      </h3>
                      {over ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full">
                          <AlertTriangle className="h-2.5 w-2.5" />
                          Acima do budget
                        </span>
                      ) : pct >= 80 ? (
                        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full">
                          Atenção
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="h-2.5 w-2.5" />
                          Ok
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {formatCurrencyFull(budget.spent)} gasto de{" "}
                      {formatCurrencyFull(budget.budget)} · Restam{" "}
                      {formatCurrencyFull(budget.budget - budget.spent)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 rounded-lg text-slate-400 hover:bg-blue-50 hover:text-[#003d9b] transition-colors">
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>{pct.toFixed(0)}% utilizado</span>
                    <span className={over ? "text-red-500 font-semibold" : ""}>
                      {formatCurrencyFull(budget.budget)}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{
                        duration: 0.8,
                        ease: "easeOut",
                        delay: i * 0.1,
                      }}
                      className={`h-full rounded-full ${over ? "bg-red-500" : pct >= 80 ? "bg-amber-500" : "bg-gradient-to-r from-[#003d9b] to-[#00e3fd]"}`}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Project budgets */}
      <motion.div
        custom={10}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="bg-white dark:bg-[#0D1C2C] rounded-2xl border border-slate-200/80 dark:border-slate-800"
      >
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <FolderKanban className="h-4 w-4 text-[#003d9b]" />
          <h2 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
            Budget por Projeto
          </h2>
        </div>
        <div className="p-6">
          {projects.length === 0 ? (
            <div className="text-center py-8">
              <FolderKanban className="h-8 w-8 text-slate-200 mx-auto mb-3" />
              <p className="text-sm text-slate-500">
                Nenhum projeto cadastrado.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {(projects as ProjectWithBudget[]).map((project) => {
                const budget = project.budget || 0;
                const spent = project.spent || 0;
                const pct =
                  budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
                return (
                  <div
                    key={project.id}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#003d9b] to-[#006875] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {project.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                        {project.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#003d9b] to-[#00e3fd] rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-400 font-mono flex-shrink-0">
                          {budget > 0 ? `${pct.toFixed(0)}%` : "Sem budget"}
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {budget > 0 && (
                        <>
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            {formatCurrencyFull(spent)}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            de {formatCurrencyFull(budget)}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
