"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Plus,
  LayoutGrid,
  List,
  Loader2,
  Trash2,
  Edit3,
  FolderKanban,
  ExternalLink,
  ChevronRight,
  FileSpreadsheet,
  Clock,
} from "lucide-react";
import {
  useProjects,
  useUpdateProject,
  useDeleteProject,
  type Project,
} from "@/features/projects/api/use-projects";
import {
  PROJECT_STATUSES,
  PROJECT_STATUS_META,
  normalizeProjectStatus,
  toStoredProjectStatus,
  type ProjectStatus,
} from "@/domain/project";
import { NewProjectModal } from "@/features/projects/components/new-project-modal";
import { EditProjectModal } from "@/features/projects/components/edit-project-modal";
import { EstimateFormModal } from "@/features/estimates/components/estimate-form-modal";
import { PageHeader } from "@/components/os/page-header";
import { Panel } from "@/components/os/panel";
import { Button } from "@/components/os/button";
import { StatusBadge } from "@/components/os/status-badge";
import { ProgressBar } from "@/components/os/panel";
import { EmptyState } from "@/components/os/empty-state";
import { ConfirmDialog } from "@/components/os/confirm-dialog";
import { toast } from "sonner";

export default function ProjectsPage() {
  const router = useRouter();
  const [view, setView] = useState<"kanban" | "list" | "timeline">("kanban");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEstimateModalOpen, setIsEstimateModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(
    null,
  );

  const { data: projects = [], isLoading } = useProjects();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const filteredProjects = projects.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.name?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.clientId?.toLowerCase().includes(q);

    const canonical = normalizeProjectStatus(p.status);
    const matchesStatus = statusFilter === "all" || canonical === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (
    projectId: string,
    currentCanonical: ProjectStatus,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    const currentIndex = PROJECT_STATUSES.indexOf(currentCanonical);
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

  const handleDelete = async () => {
    if (!deletingProjectId) return;
    try {
      await deleteProject.mutateAsync(deletingProjectId);
      toast.success("Projeto excluído com sucesso.");
      setDeletingProjectId(null);
    } catch {
      toast.error("Erro ao excluir projeto.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projetos & Sprints"
        description="Gerenciamento ágil da fábrica de software e entregas corporativas"
        actions={
          <div className="flex items-center gap-3">
            <div className="bg-os-surface-2 p-1 rounded-xl flex border border-os-border">
              <button
                onClick={() => setView("kanban")}
                className={`p-1.5 rounded-lg transition-all ${
                  view === "kanban"
                    ? "bg-os-surface shadow-sm text-os-primary"
                    : "text-os-muted hover:text-os-fg"
                }`}
                title="Visualização Kanban"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView("list")}
                className={`p-1.5 rounded-lg transition-all ${
                  view === "list"
                    ? "bg-os-surface shadow-sm text-os-primary"
                    : "text-os-muted hover:text-os-fg"
                }`}
                title="Visualização em Lista"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView("timeline")}
                className={`p-1.5 rounded-lg transition-all ${
                  view === "timeline"
                    ? "bg-os-surface shadow-sm text-os-primary"
                    : "text-os-muted hover:text-os-fg"
                }`}
                title="Visualização Timeline / Gantt"
              >
                <Clock className="w-4 h-4" />
              </button>
            </div>
            <Button
              variant="secondary"
              onClick={() => setIsEstimateModalOpen(true)}
            >
              <FileSpreadsheet className="h-4 w-4 text-os-primary" />
              <span>Novo Orçamento</span>
            </Button>
            <Button variant="primary" onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4" />
              <span>Novo Projeto</span>
            </Button>
          </div>
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-os-surface p-3.5 rounded-2xl border border-os-border shadow-sm">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nome do projeto, cliente ou descrição..."
            className="w-full pl-3.5 pr-3 py-1.5 text-xs rounded-xl bg-os-surface-2 border border-os-border text-os-fg placeholder:text-os-muted focus:outline-none focus:ring-1 focus:ring-os-primary"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 ${
              statusFilter === "all"
                ? "bg-os-primary/15 text-os-primary border border-os-primary/30"
                : "text-os-muted hover:bg-os-surface-2"
            }`}
          >
            Todos ({projects.length})
          </button>
          {PROJECT_STATUSES.map((st) => {
            const count = projects.filter(
              (p) => normalizeProjectStatus(p.status) === st,
            ).length;
            const meta = PROJECT_STATUS_META[st];
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                  statusFilter === st
                    ? "bg-os-primary/15 text-os-primary border border-os-primary/30"
                    : "text-os-muted hover:bg-os-surface-2"
                }`}
              >
                {meta.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Kanban Board View */}
      {view === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {isLoading ? (
            <div className="col-span-4 flex items-center justify-center min-h-[400px]">
              <Loader2 className="w-7 h-7 animate-spin text-os-primary" />
            </div>
          ) : (
            PROJECT_STATUSES.map((statusKey, idx) => {
              const meta = PROJECT_STATUS_META[statusKey];
              const colProjects = filteredProjects.filter(
                (p) => normalizeProjectStatus(p.status) === statusKey,
              );

              return (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={statusKey}
                  className="rounded-2xl bg-os-surface-2/50 border border-os-border p-4 min-h-[560px] flex flex-col"
                >
                  {/* Column Header */}
                  <div className="flex justify-between items-center mb-4 px-1">
                    <div className="flex items-center gap-2">
                      <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
                      <span className="text-xs font-mono font-semibold text-os-muted">
                        {colProjects.length}
                      </span>
                    </div>
                  </div>

                  {/* Column Cards */}
                  <div className="space-y-3 flex-1">
                    {colProjects.length === 0 ? (
                      <div className="text-center py-10 text-xs text-os-muted border border-dashed border-os-border rounded-xl">
                        Nenhum projeto
                      </div>
                    ) : (
                      colProjects.map((project) => {
                        const canonicalStatus = normalizeProjectStatus(
                          project.status,
                        );
                        const progress = project.progress ?? 0;

                        return (
                          <motion.div
                            key={project.id}
                            whileHover={{ y: -2 }}
                            onClick={() =>
                              router.push(`/os/projects/${project.id}`)
                            }
                            className="bg-os-surface p-4 rounded-xl border border-os-border shadow-sm hover:border-os-accent/40 cursor-pointer transition-all space-y-3 group"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-xs font-bold text-os-fg group-hover:text-os-primary transition-colors line-clamp-1">
                                {project.name}
                              </h4>
                              <ExternalLink className="w-3.5 h-3.5 text-os-muted opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                            </div>

                            <p className="text-xs text-os-muted line-clamp-2">
                              {project.description ||
                                "Sem descrição informada."}
                            </p>

                            <div className="space-y-1.5 pt-1">
                              <div className="flex items-center justify-between text-[11px] text-os-muted font-mono">
                                <span>Progresso</span>
                                <span>{progress}%</span>
                              </div>
                              <ProgressBar value={progress} />
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-os-border text-xs text-os-muted">
                              <button
                                onClick={(e) =>
                                  handleStatusChange(
                                    project.id,
                                    canonicalStatus,
                                    e,
                                  )
                                }
                                className="text-[11px] font-medium text-os-primary hover:underline flex items-center gap-1"
                                title="Avançar status"
                              >
                                <span>Avançar</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>

                              <div className="flex items-center gap-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedProject(project);
                                  }}
                                  className="p-1 hover:text-os-primary hover:bg-os-surface-2 rounded transition-colors"
                                  title="Editar Projeto"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeletingProjectId(project.id);
                                  }}
                                  className="p-1 hover:text-os-danger hover:bg-os-danger/10 rounded transition-colors"
                                  title="Excluir Projeto"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      )}

      {/* List View */}
      {view === "list" && (
        <Panel className="overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <Loader2 className="w-7 h-7 animate-spin text-os-primary" />
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={FolderKanban}
                title="Nenhum projeto encontrado"
                description="Tente ajustar sua busca ou status, ou crie um novo projeto."
                action={
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Criar Projeto</span>
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-os-border bg-os-surface-2/60 text-os-muted font-mono font-medium">
                    <th className="py-3 px-4">PROJETO</th>
                    <th className="py-3 px-4">STATUS</th>
                    <th className="py-3 px-4">PROGRESSO</th>
                    <th className="py-3 px-4 text-right">AÇÕES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-os-border">
                  {filteredProjects.map((project) => {
                    const canonical = normalizeProjectStatus(project.status);
                    const meta = PROJECT_STATUS_META[canonical];
                    const progress = project.progress ?? 0;

                    return (
                      <tr
                        key={project.id}
                        onClick={() =>
                          router.push(`/os/projects/${project.id}`)
                        }
                        className="hover:bg-os-surface-2/50 cursor-pointer transition-colors"
                      >
                        <td className="py-3 px-4">
                          <p className="font-semibold text-os-fg hover:text-os-primary transition-colors">
                            {project.name}
                          </p>
                          <p className="text-[11px] text-os-muted line-clamp-1">
                            {project.description || "Sem descrição."}
                          </p>
                        </td>

                        <td className="py-3 px-4">
                          <StatusBadge tone={meta.tone}>
                            {meta.label}
                          </StatusBadge>
                        </td>

                        <td className="py-3 px-4 w-48">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[11px] text-os-muted font-mono">
                              <span>{progress}%</span>
                            </div>
                            <ProgressBar value={progress} />
                          </div>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedProject(project);
                              }}
                              className="p-1.5 text-os-muted hover:text-os-primary hover:bg-os-surface-2 rounded-lg transition-colors"
                              title="Editar Projeto"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeletingProjectId(project.id);
                              }}
                              className="p-1.5 text-os-muted hover:text-os-danger hover:bg-os-danger/10 rounded-lg transition-colors"
                              title="Excluir Projeto"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      )}

      {/* Timeline / Gantt View */}
      {view === "timeline" && (
        <Panel className="p-6 space-y-6 overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-os-border">
            <div>
              <h3 className="text-sm font-bold text-os-fg">
                Cronograma Físico & Entregas
              </h3>
              <p className="text-xs text-os-muted">
                Acompanhamento temporal de sprints, medições e marcos da
                engenharia
              </p>
            </div>
            <span className="text-xs font-mono text-os-muted bg-os-surface-2 px-2.5 py-1 rounded-lg border border-os-border">
              {filteredProjects.length} Projetos Ativos
            </span>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="p-8 text-center text-xs text-os-muted">
              Nenhum projeto encontrado com os filtros selecionados.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredProjects.map((project) => {
                const canonical = normalizeProjectStatus(project.status);
                const meta = PROJECT_STATUS_META[canonical];
                const progress = project.progress ?? 0;

                return (
                  <div
                    key={`timeline-${project.id}`}
                    onClick={() => router.push(`/os/projects/${project.id}`)}
                    className="p-4 rounded-xl bg-os-surface-2/40 hover:bg-os-surface-2/80 border border-os-border cursor-pointer transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
                        <h4 className="text-xs font-bold text-os-fg">
                          {project.name}
                        </h4>
                        {project.clientId && (
                          <span className="text-[11px] text-os-muted">
                            · {project.clientId}
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-mono font-bold text-os-primary">
                        {progress}% Concluído
                      </span>
                    </div>

                    <div className="relative h-2.5 w-full bg-os-surface-2 rounded-full overflow-hidden border border-os-border/50">
                      <div
                        className="h-full bg-gradient-to-r from-os-primary to-cyan-400 transition-all duration-500 rounded-full"
                        style={{ width: `${Math.max(4, progress)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-os-muted font-mono">
                      <span>Início: Etapa Inicial</span>
                      <span>Sprints & Entregas Ativas</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Panel>
      )}

      {/* Modals */}
      <NewProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <EstimateFormModal
        isOpen={isEstimateModalOpen}
        onClose={() => setIsEstimateModalOpen(false)}
      />
      <EditProjectModal
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        project={selectedProject}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={!!deletingProjectId}
        onOpenChange={(open) => !open && setDeletingProjectId(null)}
        title="Excluir Projeto"
        description="Tem certeza que deseja excluir este projeto? Todos os dados vinculados serão desassociados."
        confirmLabel="Sim, excluir"
        cancelLabel="Cancelar"
        tone="danger"
        onConfirm={handleDelete}
      />
    </div>
  );
}
