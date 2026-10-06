"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  FolderKanban,
  ListChecks,
  DollarSign,
  Users,
  Plus,
  CheckCircle2,
  Circle,
  Loader2,
  Trash2,
  Receipt,
} from "lucide-react";
import Link from "next/link";
import {
  useProject,
  useUpdateProject,
} from "@/features/projects/api/use-projects";
import {
  useProjectTasks,
  useCreateTask,
  useToggleTask,
  useDeleteTask,
} from "@/features/projects/api/use-project-tasks";
import { useTransactions } from "@/features/finance/api/use-transactions";
import { useTeam } from "@/features/team/api/use-team";
import {
  normalizeProjectStatus,
  PROJECT_STATUS_META,
  toStoredProjectStatus,
  PROJECT_STATUSES,
} from "@/domain/project";
import { PageHeader } from "@/components/os/page-header";
import { Panel } from "@/components/os/panel";
import { Button } from "@/components/os/button";
import { StatusBadge } from "@/components/os/status-badge";
import { ProgressBar } from "@/components/os/panel";
import { EmptyState } from "@/components/os/empty-state";
import { toast } from "sonner";

const TABS = ["Visão Geral", "Tarefas", "Financeiro", "Equipe"] as const;
type TabType = (typeof TABS)[number];

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [activeTab, setActiveTab] = useState<TabType>("Visão Geral");
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<
    "high" | "medium" | "low"
  >("medium");
  const [isAddingTask, setIsAddingTask] = useState(false);

  // Real Queries
  const { data: project, isLoading: isLoadingProject } = useProject(projectId);
  const { data: tasks = [], isLoading: isLoadingTasks } =
    useProjectTasks(projectId);
  const { data: transactions = [] } = useTransactions();
  const { data: teamMembers = [] } = useTeam();

  const updateProject = useUpdateProject();
  const createTask = useCreateTask();
  const toggleTask = useToggleTask();
  const deleteTask = useDeleteTask();

  if (isLoadingProject) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-7 w-7 text-os-primary animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-[700px] mx-auto text-center py-20 space-y-4">
        <FolderKanban className="h-12 w-12 text-os-muted mx-auto" />
        <h2 className="text-xl font-bold text-os-fg">Projeto não encontrado</h2>
        <p className="text-xs text-os-muted">
          O projeto com o identificador &quot;{projectId}&quot; não existe ou
          foi removido.
        </p>
        <Button
          variant="primary"
          size="sm"
          onClick={() => router.push("/os/projects")}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar aos Projetos</span>
        </Button>
      </div>
    );
  }

  const canonicalStatus = normalizeProjectStatus(project.status);
  const statusMeta = PROJECT_STATUS_META[canonicalStatus];

  // Real Task Calculations
  const completedTasksCount = tasks.filter((t) => t.done).length;
  const calculatedProgress =
    tasks.length > 0
      ? Math.round((completedTasksCount / tasks.length) * 100)
      : (project.progress ?? 0);

  // Real Financial Calculations for this project
  const projectTransactions = transactions.filter(
    (t) =>
      t.projectId === projectId ||
      (t.description &&
        project.name &&
        t.description.toLowerCase().includes(project.name.toLowerCase())),
  );
  const projectExpenses = projectTransactions
    .filter((t) => t.type === "out")
    .reduce((acc, t) => acc + (t.amount || 0), 0);
  const projectInvoiced = projectTransactions
    .filter((t) => t.type === "in")
    .reduce((acc, t) => acc + (t.amount || 0), 0);
  const projectBudget = project.budget || 0;
  const remainingBudget = projectBudget - projectExpenses;

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(v);

  const handleToggle = async (taskId: string, currentDone: boolean) => {
    try {
      await toggleTask.mutateAsync({
        id: taskId,
        projectId,
        done: !currentDone,
      });

      // Recalculate and update project progress in Firestore
      const nextDoneCount = !currentDone
        ? completedTasksCount + 1
        : Math.max(0, completedTasksCount - 1);
      const nextProgress =
        tasks.length > 0 ? Math.round((nextDoneCount / tasks.length) * 100) : 0;
      await updateProject.mutateAsync({
        id: projectId,
        data: { progress: nextProgress },
      });
    } catch {
      toast.error("Erro ao alterar tarefa");
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    try {
      await createTask.mutateAsync({
        projectId,
        text: newTaskText.trim(),
        done: false,
        priority: newTaskPriority,
      });
      setNewTaskText("");
      setIsAddingTask(false);
      toast.success("Tarefa adicionada com sucesso!");
    } catch {
      toast.error("Erro ao adicionar tarefa");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask.mutateAsync({ id: taskId, projectId });
      toast.success("Tarefa removida.");
    } catch {
      toast.error("Erro ao remover tarefa");
    }
  };

  const cycleStatus = async () => {
    const currentIndex = PROJECT_STATUSES.indexOf(canonicalStatus);
    const nextStatus =
      PROJECT_STATUSES[(currentIndex + 1) % PROJECT_STATUSES.length];
    await updateProject.mutateAsync({
      id: projectId,
      data: { status: toStoredProjectStatus(nextStatus) },
    });
    toast.success(
      `Status alterado para "${PROJECT_STATUS_META[nextStatus].label}"`,
    );
  };

  return (
    <div className="space-y-6">
      {/* Top back button */}
      <Link
        href="/os/projects"
        className="inline-flex items-center gap-2 text-xs font-medium text-os-muted hover:text-os-fg transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Voltar para Projetos</span>
      </Link>

      {/* Header */}
      <PageHeader
        title={project.name}
        description={
          project.description || "Projeto em execução pela software house"
        }
        meta={
          <button onClick={cycleStatus} title="Clique para alterar status">
            <StatusBadge tone={statusMeta.tone}>{statusMeta.label}</StatusBadge>
          </button>
        }
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={cycleStatus}>
              Avançar Fase
            </Button>
          </div>
        }
      />

      {/* Overall Progress Bar */}
      <Panel className="p-4 space-y-2">
        <div className="flex items-center justify-between text-xs text-os-muted font-mono">
          <span>Progresso das Entregas</span>
          <span className="font-bold text-os-fg">{calculatedProgress}%</span>
        </div>
        <ProgressBar value={calculatedProgress} />
      </Panel>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 border-b border-os-border">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-xs font-semibold transition-all border-b-2 -mb-px ${
              activeTab === tab
                ? "border-os-primary text-os-primary dark:text-os-accent"
                : "border-transparent text-os-muted hover:text-os-fg"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* VISÃO GERAL TAB */}
      {activeTab === "Visão Geral" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Panel className="p-4 space-y-1">
            <div className="flex items-center justify-between text-os-muted">
              <span className="text-xs">Fase Atual</span>
              <FolderKanban className="h-4 w-4" />
            </div>
            <p className="text-lg font-bold text-os-fg">{statusMeta.label}</p>
          </Panel>

          <Panel className="p-4 space-y-1">
            <div className="flex items-center justify-between text-os-muted">
              <span className="text-xs">Tarefas Concluídas</span>
              <ListChecks className="h-4 w-4" />
            </div>
            <p className="text-lg font-bold text-os-fg">
              {completedTasksCount} / {tasks.length}
            </p>
          </Panel>

          <Panel className="p-4 space-y-1">
            <div className="flex items-center justify-between text-os-muted">
              <span className="text-xs">Orçamento Total</span>
              <DollarSign className="h-4 w-4" />
            </div>
            <p className="text-lg font-bold text-os-fg">
              {formatCurrency(projectBudget)}
            </p>
          </Panel>

          <Panel className="p-4 space-y-1">
            <div className="flex items-center justify-between text-os-muted">
              <span className="text-xs">Saldo Restante</span>
              <Receipt className="h-4 w-4" />
            </div>
            <p
              className={`text-lg font-bold ${
                remainingBudget < 0 ? "text-os-danger" : "text-os-success"
              }`}
            >
              {formatCurrency(remainingBudget)}
            </p>
          </Panel>
        </div>
      )}

      {/* TAREFAS TAB (REAL FIRESTORE TASKS) */}
      {activeTab === "Tarefas" && (
        <Panel className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-os-fg flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-os-primary" />
              <span>
                Backlog de Tarefas ({completedTasksCount}/{tasks.length})
              </span>
            </h3>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsAddingTask(!isAddingTask)}
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{isAddingTask ? "Cancelar" : "Nova Tarefa"}</span>
            </Button>
          </div>

          {/* New Task Inline Form */}
          {isAddingTask && (
            <form
              onSubmit={handleCreateTask}
              className="p-3 rounded-xl border border-os-border bg-os-surface-2/60 flex flex-col sm:flex-row items-center gap-2"
            >
              <input
                type="text"
                autoFocus
                required
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="Descreva a tarefa ou entrega..."
                className="flex-1 p-2 rounded-lg border border-os-border bg-os-surface text-xs text-os-fg focus:outline-none focus:ring-2 focus:ring-os-ring"
              />
              <select
                value={newTaskPriority}
                onChange={(e) =>
                  setNewTaskPriority(
                    e.target.value as "high" | "medium" | "low",
                  )
                }
                className="p-2 rounded-lg border border-os-border bg-os-surface text-xs text-os-fg focus:outline-none"
              >
                <option value="high">Prioridade Alta</option>
                <option value="medium">Prioridade Média</option>
                <option value="low">Prioridade Baixa</option>
              </select>
              <Button variant="primary" size="sm" type="submit">
                Adicionar
              </Button>
            </form>
          )}

          {/* Task list */}
          {isLoadingTasks ? (
            <div className="py-8 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-os-primary" />
            </div>
          ) : tasks.length === 0 ? (
            <EmptyState
              icon={ListChecks}
              title="Nenhuma tarefa cadastrada"
              description="Adicione tarefas a este projeto para calcular automaticamente o percentual de entrega da sprint."
            />
          ) : (
            <div className="space-y-1.5">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-os-surface-2/60 border border-os-border/60 transition-colors group"
                >
                  <button
                    onClick={() => handleToggle(task.id, task.done)}
                    className="flex items-center gap-3 text-left flex-1 min-w-0"
                  >
                    {task.done ? (
                      <CheckCircle2 className="h-4.5 w-4.5 text-os-success flex-shrink-0" />
                    ) : (
                      <Circle className="h-4.5 w-4.5 text-os-muted flex-shrink-0 group-hover:text-os-fg" />
                    )}
                    <span
                      className={`text-xs truncate ${
                        task.done
                          ? "line-through text-os-muted"
                          : "font-medium text-os-fg"
                      }`}
                    >
                      {task.text}
                    </span>
                  </button>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        task.priority === "high"
                          ? "bg-os-danger/10 text-os-danger"
                          : task.priority === "medium"
                            ? "bg-os-warning/10 text-os-warning"
                            : "bg-os-surface-2 text-os-muted"
                      }`}
                    >
                      {task.priority === "high"
                        ? "Alta"
                        : task.priority === "medium"
                          ? "Média"
                          : "Baixa"}
                    </span>

                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-1 rounded text-os-muted hover:text-os-danger hover:bg-os-danger/10 opacity-0 group-hover:opacity-100 transition-all"
                      title="Excluir tarefa"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>
      )}

      {/* FINANCEIRO TAB */}
      {activeTab === "Financeiro" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Panel className="p-4 space-y-1">
              <span className="text-xs text-os-muted">Orçamento Alocado</span>
              <p className="text-xl font-bold text-os-fg">
                {formatCurrency(projectBudget)}
              </p>
            </Panel>
            <Panel className="p-4 space-y-1">
              <span className="text-xs text-os-muted">Despesas Lançadas</span>
              <p className="text-xl font-bold text-os-danger">
                {formatCurrency(projectExpenses)}
              </p>
            </Panel>
            <Panel className="p-4 space-y-1">
              <span className="text-xs text-os-muted">Receita Faturada</span>
              <p className="text-xl font-bold text-os-success">
                {formatCurrency(projectInvoiced)}
              </p>
            </Panel>
          </div>

          <Panel className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-os-fg">
                Lançamentos Financeiros Vinculados
              </h3>
              <Link
                href="/os/finance/transactions"
                className="text-xs text-os-primary hover:underline font-medium"
              >
                Ver todas na Planilha →
              </Link>
            </div>

            {projectTransactions.length === 0 ? (
              <EmptyState
                icon={Receipt}
                title="Nenhuma transação vinculada a este projeto"
                description="Lançamentos categorizados com este projeto no módulo financeiro aparecem consolidados aqui."
              />
            ) : (
              <div className="divide-y divide-os-border">
                {projectTransactions.map((t) => (
                  <div
                    key={t.id}
                    className="py-2.5 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-semibold text-os-fg">
                        {t.description}
                      </p>
                      <p className="text-[11px] text-os-muted">
                        {t.category || "Geral"}
                      </p>
                    </div>
                    <span
                      className={`font-mono font-bold ${
                        t.type === "in" ? "text-os-success" : "text-os-danger"
                      }`}
                    >
                      {t.type === "in" ? "+" : "-"}{" "}
                      {formatCurrency(t.amount || 0)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>
      )}

      {/* EQUIPE TAB (REAL TEAM MEMBERS) */}
      {activeTab === "Equipe" && (
        <Panel className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-os-fg flex items-center gap-2">
              <Users className="h-4 w-4 text-os-primary" />
              <span>Membros e Squads Disponíveis</span>
            </h3>
            <Link
              href="/os/team/schedule"
              className="text-xs text-os-primary hover:underline font-medium"
            >
              Ver Matriz de Alocação Semanal →
            </Link>
          </div>

          {teamMembers.length === 0 ? (
            <EmptyState
              icon={Users}
              title="Nenhum membro cadastrado"
              description="Cadastre membros na área de Pessoas para atribuir tarefas e alocações."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="p-3.5 rounded-xl border border-os-border bg-os-surface-2/40 flex items-center gap-3"
                >
                  <div className="w-9 h-9 rounded-full bg-os-primary/10 text-os-primary flex items-center justify-center font-bold text-xs flex-shrink-0">
                    {member.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-os-fg truncate">
                      {member.name}
                    </p>
                    <p className="text-[11px] text-os-muted truncate">
                      {member.role || "Especialista"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>
      )}
    </div>
  );
}
