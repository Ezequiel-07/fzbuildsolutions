"use client";

import { useMemo, useState } from "react";
import {
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  FolderKanban,
  DollarSign,
  FileSpreadsheet,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useProjects } from "@/features/projects/api/use-projects";
import { useTransactions } from "@/features/finance/api/use-transactions";
import { PageHeader } from "@/components/os/page-header";
import { Panel } from "@/components/os/panel";
import { Button } from "@/components/os/button";
import { StatusBadge } from "@/components/os/status-badge";
import { ProgressBar } from "@/components/os/panel";
import { EmptyState } from "@/components/os/empty-state";
import { Skeleton } from "@/components/os/skeleton";
import { EstimateList } from "@/features/estimates/components/estimate-list";
import { EstimateFormModal } from "@/features/estimates/components/estimate-form-modal";

export default function BudgetPage() {
  const [activeTab, setActiveTab] = useState<"estimates" | "execution">(
    "estimates",
  );
  const [isEstimateModalOpen, setIsEstimateModalOpen] = useState(false);

  const { data: projects = [], isLoading: isLoadingProjects } = useProjects();
  const { data: transactions = [], isLoading: isLoadingTransactions } =
    useTransactions();

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(v);

  // Compute real project budgets vs real expenses
  const projectBudgets = useMemo(() => {
    return projects.map((p) => {
      const budget = p.budget || 0;
      const spent = transactions
        .filter(
          (t) =>
            t.type === "out" &&
            (t.projectId === p.id ||
              (t.description &&
                p.name &&
                t.description.toLowerCase().includes(p.name.toLowerCase()))),
        )
        .reduce((acc, t) => acc + (t.amount || 0), 0);

      const percent = budget > 0 ? Math.round((spent / budget) * 100) : 0;
      const remaining = budget - spent;

      return {
        ...p,
        budget,
        spent,
        percent,
        remaining,
      };
    });
  }, [projects, transactions]);

  const totalAllocatedBudget = projectBudgets.reduce((a, b) => a + b.budget, 0);
  const totalSpent = projectBudgets.reduce((a, b) => a + b.spent, 0);
  const totalRemaining = totalAllocatedBudget - totalSpent;
  const overBudgetCount = projectBudgets.filter(
    (b) => b.spent > b.budget && b.budget > 0,
  ).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orçamentos & Propostas de Software"
        description="Gestão integrada de propostas comerciais de software, custos/prazos de fábrica e execução orçamentária"
        actions={
          <div className="flex items-center gap-2">
            {activeTab === "estimates" && (
              <Button
                variant="primary"
                onClick={() => setIsEstimateModalOpen(true)}
              >
                <Plus className="h-4 w-4" />
                <span>Novo Orçamento</span>
              </Button>
            )}
            <Link href="/os/projects">
              <Button variant="secondary">
                <FolderKanban className="h-4 w-4" />
                <span>Ver Portfólio</span>
              </Button>
            </Link>
          </div>
        }
      />

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-os-border pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("estimates")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === "estimates"
              ? "bg-os-primary text-white shadow-sm"
              : "text-os-muted hover:text-os-fg hover:bg-os-surface-2"
          }`}
        >
          <FileSpreadsheet className="h-4 w-4" />
          <span>Propostas Comerciais (Fábrica de Software)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("execution")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === "execution"
              ? "bg-os-primary text-white shadow-sm"
              : "text-os-muted hover:text-os-fg hover:bg-os-surface-2"
          }`}
        >
          <Target className="h-4 w-4" />
          <span>Execução & Teto de Gastos de Projetos</span>
        </button>
      </div>

      {/* Tab 1: Propostas Comerciais & Orçamentos */}
      {activeTab === "estimates" && (
        <div className="space-y-6">
          <EstimateList onNewEstimate={() => setIsEstimateModalOpen(true)} />
        </div>
      )}

      {/* Tab 2: Execução de Gastos & Teto por Projeto */}
      {activeTab === "execution" && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Panel className="p-4 flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-os-primary/10 text-os-primary">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-os-muted">Budget Alocado</p>
                <p className="text-xl font-bold text-os-fg">
                  {formatCurrency(totalAllocatedBudget)}
                </p>
              </div>
            </Panel>

            <Panel className="p-4 flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-os-danger/10 text-os-danger">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-os-muted">Gasto Executado</p>
                <p className="text-xl font-bold text-os-danger">
                  {formatCurrency(totalSpent)}
                </p>
              </div>
            </Panel>

            <Panel className="p-4 flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-os-success/10 text-os-success">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-os-muted">Saldo Global Restante</p>
                <p
                  className={`text-xl font-bold ${
                    totalRemaining < 0 ? "text-os-danger" : "text-os-success"
                  }`}
                >
                  {formatCurrency(totalRemaining)}
                </p>
              </div>
            </Panel>

            <Panel className="p-4 flex items-center gap-3.5">
              <div
                className={`p-2.5 rounded-xl ${
                  overBudgetCount > 0
                    ? "bg-os-danger/10 text-os-danger"
                    : "bg-os-success/10 text-os-success"
                }`}
              >
                {overBudgetCount > 0 ? (
                  <AlertTriangle className="h-5 w-5" />
                ) : (
                  <CheckCircle2 className="h-5 w-5" />
                )}
              </div>
              <div>
                <p className="text-xs text-os-muted">Alertas de Teto</p>
                <p className="text-xl font-bold text-os-fg">
                  {overBudgetCount === 0
                    ? "Conforme"
                    : `${overBudgetCount} estourado${overBudgetCount > 1 ? "s" : ""}`}
                </p>
              </div>
            </Panel>
          </div>

          {/* Projects Budget Table */}
          <Panel className="overflow-hidden">
            <div className="p-4 border-b border-os-border flex items-center justify-between">
              <h3 className="text-sm font-bold text-os-fg flex items-center gap-2">
                <FolderKanban className="h-4 w-4 text-os-primary" />
                <span>Detalhamento por Projeto</span>
              </h3>
              <span className="text-xs text-os-muted">
                Base consolidada via Firestore
              </span>
            </div>

            {isLoadingProjects || isLoadingTransactions ? (
              <div className="p-6 space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : projectBudgets.length === 0 ? (
              <div className="p-8">
                <EmptyState
                  icon={FolderKanban}
                  title="Nenhum projeto com orçamento registrado"
                  description="Defina orçamentos para os projetos na criação ou edição para acompanhar os limites de despesas."
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-os-border bg-os-surface-2/60 text-os-muted font-mono font-medium">
                      <th className="py-3 px-4">PROJETO</th>
                      <th className="py-3 px-4">BUDGET TOTAL</th>
                      <th className="py-3 px-4">GASTO ATUAL</th>
                      <th className="py-3 px-4">SALDO RESTANTE</th>
                      <th className="py-3 px-4 w-44">EXECUÇÃO</th>
                      <th className="py-3 px-4 text-right">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-os-border">
                    {projectBudgets.map((proj) => {
                      const isOver =
                        proj.spent > proj.budget && proj.budget > 0;
                      const isWarning = proj.percent >= 80 && !isOver;

                      return (
                        <tr
                          key={proj.id}
                          className="hover:bg-os-surface-2/40 transition-colors"
                        >
                          <td className="py-3 px-4">
                            <Link
                              href={`/os/projects/${proj.id}`}
                              className="font-semibold text-os-fg hover:text-os-primary transition-colors"
                            >
                              {proj.name}
                            </Link>
                            <p className="text-[11px] text-os-muted line-clamp-1">
                              {proj.description || "Sem descrição"}
                            </p>
                          </td>

                          <td className="py-3 px-4 font-mono font-semibold text-os-fg">
                            {formatCurrency(proj.budget)}
                          </td>

                          <td className="py-3 px-4 font-mono font-semibold text-os-danger">
                            {formatCurrency(proj.spent)}
                          </td>

                          <td
                            className={`py-3 px-4 font-mono font-bold ${
                              proj.remaining < 0
                                ? "text-os-danger"
                                : "text-os-success"
                            }`}
                          >
                            {formatCurrency(proj.remaining)}
                          </td>

                          <td className="py-3 px-4">
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-[11px] text-os-muted font-mono">
                                <span>{proj.percent}%</span>
                              </div>
                              <ProgressBar value={proj.percent} />
                            </div>
                          </td>

                          <td className="py-3 px-4 text-right">
                            <StatusBadge
                              tone={
                                isOver
                                  ? "danger"
                                  : isWarning
                                    ? "warning"
                                    : "success"
                              }
                            >
                              {isOver
                                ? "Estourado"
                                : isWarning
                                  ? "Atenção"
                                  : "Normal"}
                            </StatusBadge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>
        </div>
      )}

      {/* Create Modal */}
      <EstimateFormModal
        isOpen={isEstimateModalOpen}
        onClose={() => setIsEstimateModalOpen(false)}
      />
    </div>
  );
}
