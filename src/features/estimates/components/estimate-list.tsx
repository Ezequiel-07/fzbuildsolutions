"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  FileText,
  Printer,
  Edit3,
  Trash2,
  FolderKanban,
  CheckCircle2,
  Clock,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import {
  useEstimates,
  useUpdateEstimate,
  useDeleteEstimate,
  useConvertEstimateToProject,
} from "../api/use-estimates";
import {
  type SoftwareEstimate,
  type EstimateStatus,
  ESTIMATE_STATUS_META,
  PLATFORM_LABELS,
} from "../types";
import { EstimateFormModal } from "./estimate-form-modal";
import { EstimatePresentationModal } from "./estimate-presentation-modal";
import { Button } from "@/components/os/button";
import { Panel } from "@/components/os/panel";
import { EmptyState } from "@/components/os/empty-state";
import { ConfirmDialog } from "@/components/os/confirm-dialog";
import { Skeleton } from "@/components/os/skeleton";
import { toast } from "sonner";

interface EstimateListProps {
  onNewEstimate?: () => void;
}

export function EstimateList({ onNewEstimate }: EstimateListProps) {
  const { data: estimates = [], isLoading } = useEstimates();
  const updateEstimate = useUpdateEstimate();
  const deleteEstimate = useDeleteEstimate();
  const convertToProject = useConvertEstimateToProject();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);
  const [selectedEstimate, setSelectedEstimate] =
    useState<SoftwareEstimate | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);

  // Filtered estimates
  const filteredEstimates = useMemo(() => {
    return estimates.filter((e) => {
      const matchSearch =
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.clientName.toLowerCase().includes(search.toLowerCase()) ||
        e.proposalNumber.toLowerCase().includes(search.toLowerCase()) ||
        (e.clientCompany &&
          e.clientCompany.toLowerCase().includes(search.toLowerCase()));

      const matchStatus =
        statusFilter === "all" ? true : e.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [estimates, search, statusFilter]);

  // KPIs
  const totalVolume = estimates.reduce(
    (acc, e) => acc + (e.totalPrice || 0),
    0,
  );
  const approvedVolume = estimates
    .filter((e) => e.status === "approved")
    .reduce((acc, e) => acc + (e.totalPrice || 0), 0);
  const totalPipelineHours = estimates.reduce(
    (acc, e) => acc + (e.totalHours || 0),
    0,
  );
  const approvedCount = estimates.filter((e) => e.status === "approved").length;
  const conversionRate =
    estimates.length > 0
      ? Math.round((approvedCount / estimates.length) * 100)
      : 0;

  const handleOpenPresentation = (estimate: SoftwareEstimate) => {
    setSelectedEstimate(estimate);
    setIsPresentationOpen(true);
  };

  const handleOpenEdit = (estimate: SoftwareEstimate) => {
    setSelectedEstimate(estimate);
    setIsFormOpen(true);
  };

  const handleStatusChange = async (
    estimateId: string,
    newStatus: EstimateStatus,
  ) => {
    try {
      await updateEstimate.mutateAsync({
        id: estimateId,
        data: { status: newStatus },
      });
      toast.success(
        `Status do orçamento alterado para "${ESTIMATE_STATUS_META[newStatus].label}".`,
      );
    } catch {
      toast.error("Erro ao alterar status.");
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteEstimate.mutateAsync(deletingId);
      toast.success("Orçamento excluído com sucesso.");
      setDeletingId(null);
    } catch {
      toast.error("Erro ao excluir orçamento.");
    }
  };

  const handleQuickConvert = async (estimate: SoftwareEstimate) => {
    try {
      await convertToProject.mutateAsync(estimate);
      toast.success(
        `Projeto "${estimate.title}" criado e vinculado no Kanban!`,
      );
    } catch {
      toast.error("Erro ao converter em projeto.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Panel className="p-4 flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-os-primary/10 text-os-primary">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-os-muted">Volume Total Orçado</p>
            <p className="text-xl font-bold font-mono text-os-fg">
              {formatCurrency(totalVolume)}
            </p>
          </div>
        </Panel>

        <Panel className="p-4 flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-os-success/10 text-os-success">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-os-muted">Propostas Aprovadas</p>
            <p className="text-xl font-bold font-mono text-os-success">
              {formatCurrency(approvedVolume)}
            </p>
          </div>
        </Panel>

        <Panel className="p-4 flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-os-muted">Horas em Pipeline</p>
            <p className="text-xl font-bold font-mono text-os-fg">
              {totalPipelineHours}h
            </p>
          </div>
        </Panel>

        <Panel className="p-4 flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-os-muted">Taxa de Conversão</p>
            <p className="text-xl font-bold font-mono text-os-fg">
              {conversionRate}%{" "}
              <span className="text-xs text-os-muted font-normal">
                ({approvedCount}/{estimates.length})
              </span>
            </p>
          </div>
        </Panel>
      </div>

      {/* Filter and Action Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-os-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por proposta, cliente ou projeto..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-os-border bg-os-surface text-os-fg outline-none focus:border-os-primary shadow-sm"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-os-border bg-os-surface text-os-fg outline-none focus:border-os-primary shadow-sm"
          >
            <option value="all">Todos os Status</option>
            <option value="draft">Rascunhos</option>
            <option value="in_review">Em Revisão</option>
            <option value="sent">Enviados</option>
            <option value="approved">Aprovados</option>
            <option value="rejected">Recusados</option>
          </select>
        </div>

        <Button
          variant="primary"
          onClick={() => {
            setSelectedEstimate(null);
            setIsFormOpen(true);
            if (onNewEstimate) onNewEstimate();
          }}
          leadingIcon={<Plus className="h-4 w-4" />}
        >
          Novo Orçamento de Software
        </Button>
      </div>

      {/* Estimates Table / Cards */}
      <Panel className="overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : filteredEstimates.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={FileText}
              title={
                search || statusFilter !== "all"
                  ? "Nenhum orçamento encontrado com esses filtros"
                  : "Nenhum orçamento cadastrado ainda"
              }
              description="Crie orçamentos profissionais de fábrica de software com detalhamento de horas, contagem de telas, estimativa de custos e exportação em PDF."
              action={
                <Button
                  variant="primary"
                  onClick={() => {
                    setSelectedEstimate(null);
                    setIsFormOpen(true);
                  }}
                  leadingIcon={<Plus className="h-4 w-4" />}
                >
                  Criar Primeiro Orçamento
                </Button>
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-os-border bg-os-surface-2/60 text-os-muted font-mono font-medium">
                  <th className="py-3 px-4">PROPOSTA / PROJETO</th>
                  <th className="py-3 px-4">CLIENTE</th>
                  <th className="py-3 px-4">TELAS & HORAS</th>
                  <th className="py-3 px-4">VALOR TOTAL</th>
                  <th className="py-3 px-4">PRAZO</th>
                  <th className="py-3 px-4">STATUS</th>
                  <th className="py-3 px-4 text-right">AÇÕES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-os-border">
                {filteredEstimates.map((est) => {
                  const screens = est.modules.reduce(
                    (acc, m) => acc + (Number(m.screensCount) || 0),
                    0,
                  );

                  return (
                    <tr
                      key={est.id}
                      className="hover:bg-os-surface-2/40 transition-colors group cursor-pointer"
                      onClick={() => handleOpenPresentation(est)}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold text-os-muted px-1.5 py-0.5 rounded bg-os-surface-2 border border-os-border">
                            {est.proposalNumber}
                          </span>
                          <span className="font-bold text-os-fg group-hover:text-os-primary transition-colors">
                            {est.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          {est.platforms.map((p) => (
                            <span
                              key={p}
                              className="text-[10px] px-1.5 py-0.2 rounded bg-os-surface-2 text-os-muted font-mono"
                            >
                              {PLATFORM_LABELS[p]?.split(" ")[0]}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-semibold text-os-fg block">
                          {est.clientName}
                        </span>
                        {est.clientCompany && (
                          <span className="text-[11px] text-os-muted block">
                            {est.clientCompany}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 font-mono">
                        <span className="text-os-fg font-bold">
                          {screens} telas
                        </span>
                        <span className="text-os-muted text-[11px] block">
                          {est.totalHours} horas faturáveis
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono">
                        <span className="text-sm font-bold text-os-primary block">
                          {formatCurrency(est.totalPrice)}
                        </span>
                        <span className="text-[10px] text-os-success font-semibold">
                          Margem: {est.projectedMarginPercent}%
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono text-os-fg">
                        <span>{est.deliveryWeeks} semanas</span>
                        <span className="text-[10px] text-os-muted block">
                          {est.sprintsCount} sprints
                        </span>
                      </td>

                      <td
                        className="py-3 px-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <select
                          value={est.status}
                          onChange={(e) =>
                            handleStatusChange(
                              est.id,
                              e.target.value as EstimateStatus,
                            )
                          }
                          className="text-xs font-bold px-2 py-1 rounded-lg border border-os-border bg-os-surface text-os-fg outline-none cursor-pointer"
                        >
                          <option value="draft">Rascunho</option>
                          <option value="in_review">Em Revisão</option>
                          <option value="sent">Enviado</option>
                          <option value="approved">Aprovado</option>
                          <option value="rejected">Recusado</option>
                        </select>
                      </td>

                      <td
                        className="py-3 px-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenPresentation(est)}
                            className="p-1.5 rounded-lg text-os-muted hover:text-os-primary hover:bg-os-primary/10 transition-colors"
                            title="Apresentar Proposta & Exportar PDF"
                          >
                            <Printer className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenEdit(est)}
                            className="p-1.5 rounded-lg text-os-muted hover:text-os-fg hover:bg-os-surface-2 transition-colors"
                            title="Editar Orçamento"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>

                          {est.status === "approved" && !est.projectId && (
                            <button
                              type="button"
                              onClick={() => handleQuickConvert(est)}
                              className="p-1.5 rounded-lg text-os-success hover:bg-os-success/10 transition-colors"
                              title="Converter em Projeto no Kanban"
                            >
                              <FolderKanban className="h-4 w-4" />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => setDeletingId(est.id)}
                            className="p-1.5 rounded-lg text-os-muted hover:text-os-danger hover:bg-os-danger/10 transition-colors"
                            title="Excluir Orçamento"
                          >
                            <Trash2 className="h-4 w-4" />
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

      {/* Edit/Create Modal */}
      <EstimateFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedEstimate(null);
        }}
        estimateToEdit={selectedEstimate}
      />

      {/* Presentation & PDF View Modal */}
      <EstimatePresentationModal
        isOpen={isPresentationOpen}
        onClose={() => {
          setIsPresentationOpen(false);
          setSelectedEstimate(null);
        }}
        estimate={selectedEstimate}
        onEdit={() => {
          setIsPresentationOpen(false);
          setIsFormOpen(true);
        }}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(deletingId)}
        onOpenChange={(open) => !open && setDeletingId(null)}
        onConfirm={handleDelete}
        title="Excluir Orçamento"
        description="Tem certeza que deseja excluir esta proposta comercial? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        tone="danger"
      />
    </div>
  );
}
