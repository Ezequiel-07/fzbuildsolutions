"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Plus,
  Phone,
  Mail,
  Trash2,
  Edit3,
  DollarSign,
  Briefcase,
  Users,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import {
  useLeads,
  useDeleteLead,
  type Lead,
} from "@/features/crm/api/use-leads";
import {
  LEAD_STAGES,
  LEAD_STAGE_META,
  normalizeLeadStage,
} from "@/domain/lead";
import { NewLeadModal } from "@/features/crm/components/new-lead-modal";
import { EditLeadModal } from "@/features/crm/components/edit-lead-modal";
import { AIProspectorDrawer } from "@/features/crm/components/ai-prospector-drawer";
import { PageHeader } from "@/components/os/page-header";
import { Panel } from "@/components/os/panel";
import { Button } from "@/components/os/button";
import { StatusBadge } from "@/components/os/status-badge";
import { EmptyState } from "@/components/os/empty-state";
import { Skeleton } from "@/components/os/skeleton";
import { ConfirmDialog } from "@/components/os/confirm-dialog";
import { toast } from "sonner";

export default function CRMPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRadarOpen, setIsRadarOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [filterStage, setFilterStage] = useState<string>("Todos");
  const [deletingLeadId, setDeletingLeadId] = useState<string | null>(null);

  const { data: leads = [], isLoading } = useLeads();
  const deleteLead = useDeleteLead();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handleDelete = async () => {
    if (!deletingLeadId) return;
    try {
      await deleteLead.mutateAsync(deletingLeadId);
      toast.success("Lead removido com sucesso.");
      setDeletingLeadId(null);
    } catch {
      toast.error("Erro ao remover lead.");
    }
  };

  const filteredLeads =
    filterStage === "Todos"
      ? leads
      : leads.filter((l) => normalizeLeadStage(l.stage) === filterStage);

  const totalPipelineValue = leads
    .filter((l) => {
      const s = normalizeLeadStage(l.stage);
      return s !== "won" && s !== "lost";
    })
    .reduce((acc, l) => acc + (l.value || 0), 0);

  const wonPipelineValue = leads
    .filter((l) => normalizeLeadStage(l.stage) === "won")
    .reduce((acc, l) => acc + (l.value || 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="CRM & Pipeline Comercial"
        description="Gestão de oportunidades comerciais, qualificação de leads e propostas"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={() => setIsRadarOpen(true)}
              className="border-os-primary/30 text-os-primary hover:bg-os-primary/10 shadow-sm"
            >
              <Sparkles className="h-4 w-4 text-os-primary" />
              <span>Radar IA</span>
            </Button>
            <Button
              variant="secondary"
              onClick={() => router.push("/os/crm/leads")}
            >
              <Users className="h-4 w-4" />
              <span>Ver Tabela de Leads</span>
            </Button>
            <Button variant="primary" onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4" />
              <span>Novo Lead</span>
            </Button>
          </div>
        }
      />

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Panel className="p-4 flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-os-primary/10 text-os-primary">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-os-muted">Pipeline Aberto</p>
            <p className="text-xl font-bold text-os-fg">
              {formatCurrency(totalPipelineValue)}
            </p>
          </div>
        </Panel>

        <Panel className="p-4 flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-os-success/10 text-os-success">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-os-muted">Negócios Fechados</p>
            <p className="text-xl font-bold text-os-fg">
              {formatCurrency(wonPipelineValue)}
            </p>
          </div>
        </Panel>

        <Panel className="p-4 flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-os-accent/10 text-os-accent">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-os-muted">Total de Oportunidades</p>
            <p className="text-xl font-bold text-os-fg">{leads.length}</p>
          </div>
        </Panel>
      </div>

      {/* Stage KPI Pills (clickable filters) */}
      <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setFilterStage("Todos")}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
            filterStage === "Todos"
              ? "bg-os-primary text-os-primary-fg border-os-primary shadow-sm"
              : "bg-os-surface text-os-muted border-os-border hover:bg-os-surface-2"
          }`}
        >
          Todos ({leads.length})
        </button>

        {LEAD_STAGES.map((stageKey) => {
          const meta = LEAD_STAGE_META[stageKey];
          const count = leads.filter(
            (l) => normalizeLeadStage(l.stage) === stageKey,
          ).length;
          const isSelected = filterStage === stageKey;

          return (
            <button
              key={stageKey}
              onClick={() => setFilterStage(stageKey)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border flex items-center gap-2 ${
                isSelected
                  ? "bg-os-primary text-os-primary-fg border-os-primary shadow-sm"
                  : "bg-os-surface text-os-muted border-os-border hover:bg-os-surface-2"
              }`}
            >
              <span>{meta.label}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isSelected
                    ? "bg-white/20 text-white"
                    : "bg-os-surface-2 text-os-muted"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Pipeline Cards Grid */}
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : filteredLeads.length === 0 ? (
        <Panel className="p-8">
          <EmptyState
            icon={Briefcase}
            title="Nenhum lead encontrado neste filtro"
            description="Cadastre novas oportunidades comerciais para acompanhar o funil de vendas da software house."
            action={
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Novo Lead</span>
              </Button>
            }
          />
        </Panel>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLeads.map((deal) => {
            const canonical = normalizeLeadStage(deal.stage);
            const meta = LEAD_STAGE_META[canonical];

            return (
              <motion.div
                key={deal.id}
                whileHover={{ y: -2 }}
                onClick={() => router.push(`/os/crm/${deal.id}`)}
                className="bg-os-surface p-5 rounded-2xl border border-os-border shadow-sm hover:border-os-accent/40 cursor-pointer transition-all space-y-4 group flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-os-primary/10 text-os-primary flex items-center justify-center font-bold text-sm uppercase flex-shrink-0">
                        {deal.clientName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs text-os-fg group-hover:text-os-primary transition-colors truncate">
                          {deal.clientName}
                        </h4>
                        <p className="text-[11px] text-os-muted truncate">
                          {deal.projectName || "Proposta Técnica"}
                        </p>
                      </div>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 text-os-muted opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
                    <p className="text-xs font-mono font-bold text-os-fg">
                      {formatCurrency(deal.value || 0)}
                    </p>
                  </div>
                </div>

                {/* Card Footer: Contatos & Ações */}
                <div className="pt-3 border-t border-os-border flex items-center justify-between text-xs text-os-muted">
                  <div className="flex items-center gap-3">
                    {deal.contact?.email && (
                      <span
                        className="flex items-center gap-1"
                        title={deal.contact.email}
                      >
                        <Mail className="h-3 w-3" />
                      </span>
                    )}
                    {deal.contact?.phone && (
                      <span
                        className="flex items-center gap-1"
                        title={deal.contact.phone}
                      >
                        <Phone className="h-3 w-3" />
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLead(deal);
                      }}
                      className="p-1 hover:text-os-primary hover:bg-os-surface-2 rounded transition-colors"
                      title="Editar Lead"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingLeadId(deal.id);
                      }}
                      className="p-1 hover:text-os-danger hover:bg-os-danger/10 rounded transition-colors"
                      title="Excluir Lead"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modals & Drawers */}
      <AIProspectorDrawer
        isOpen={isRadarOpen}
        onClose={() => setIsRadarOpen(false)}
      />
      <NewLeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <EditLeadModal
        isOpen={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        lead={selectedLead}
      />

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={!!deletingLeadId}
        onOpenChange={(open) => !open && setDeletingLeadId(null)}
        title="Excluir Oportunidade"
        description="Tem certeza que deseja excluir este lead? As notas e histórico serão perdidos."
        confirmLabel="Sim, excluir"
        cancelLabel="Cancelar"
        tone="danger"
        onConfirm={handleDelete}
      />
    </div>
  );
}
