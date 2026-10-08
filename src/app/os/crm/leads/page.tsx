"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Phone,
  Mail,
  Edit3,
  Trash2,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  CheckSquare,
  Square,
  X,
  ExternalLink,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useLeads, useDeleteLead, Lead } from "@/features/crm/api/use-leads";
import { NewLeadModal } from "@/features/crm/components/new-lead-modal";
import { EditLeadModal } from "@/features/crm/components/edit-lead-modal";
import { AIProspectorDrawer } from "@/features/crm/components/ai-prospector-drawer";
import {
  ComposeEmailModal,
  type ComposeInitialData,
} from "@/features/inbox/components/compose-email-modal";
import { useGenerateAiProposal } from "@/features/inbox/api/use-gmail";
import { PageHeader } from "@/components/os/page-header";
import { Button } from "@/components/os/button";
import { Panel } from "@/components/os/panel";
import { StatusBadge } from "@/components/os/status-badge";
import { ConfirmDialog } from "@/components/os/confirm-dialog";
import {
  LEAD_STAGES,
  LEAD_STAGE_META,
  normalizeLeadStage,
  type LeadStage,
} from "@/domain/lead";
import Link from "next/link";
import { toast } from "sonner";

type SortKey = "clientName" | "projectName" | "stage" | "value" | "createdAt";
type SortDir = "asc" | "desc";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.03, duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  }),
};

export default function LeadsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRadarOpen, setIsRadarOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);
  const [emailModalData, setEmailModalData] =
    useState<ComposeInitialData | null>(null);
  const [generatingLeadId, setGeneratingLeadId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterStage, setFilterStage] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const { data: leads = [], isLoading } = useLeads();
  const deleteLead = useDeleteLead();
  const generateProposal = useGenerateAiProposal();

  const handleDraftProposalForLead = async (lead: Lead) => {
    setGeneratingLeadId(lead.id);
    const toastId = toast.loading(
      `Redigindo proposta comercial com Gemini 3.8 Flash para ${lead.clientName}...`,
    );
    try {
      const res = await generateProposal.mutateAsync({
        companyName: lead.clientName,
        contactEmail: lead.contact?.email,
        projectOpportunity: lead.projectName,
        estimatedBudget: lead.value,
        detectedPain: lead.detectedPain,
        recommendedPitch: lead.aiPitch,
        segment: lead.segment,
        cityState: lead.cityState,
      });
      toast.dismiss(toastId);
      toast.success("Proposta personalizada gerada com sucesso pela IA!");
      setEmailModalData({
        to: lead.contact?.email || "",
        subject: res.subject,
        bodyHtml: res.bodyHtml || res.bodyText,
        leadContext: {
          companyName: lead.clientName,
          contactEmail: lead.contact?.email,
          projectOpportunity: lead.projectName,
          estimatedBudget: lead.value,
          detectedPain: lead.detectedPain,
          recommendedPitch: lead.aiPitch,
          segment: lead.segment,
          cityState: lead.cityState,
        },
      });
    } catch {
      toast.dismiss(toastId);
      toast.info("Abrindo editor de proposta para envio direto.");
      setEmailModalData({
        to: lead.contact?.email || "",
        subject: `Parceria em Soluções de Software & Apps: ${lead.clientName}`,
        bodyHtml: `<p>Olá equipe da <strong>${lead.clientName}</strong>,</p><p>Gostaríamos de apresentar nossa proposta para o desenvolvimento da solução em software <em>${lead.projectName}</em>.</p><p>A FZ Build Solutions é uma casa de software especializada no desenvolvimento sob medida de sistemas em nuvem, aplicativos mobile e plataformas corporativas.</p><p>Atenciosamente,<br/><strong>Ezequiel Ferreira</strong><br/>FZ Build Solutions · Casa de Software</p>`,
        leadContext: {
          companyName: lead.clientName,
          contactEmail: lead.contact?.email,
          projectOpportunity: lead.projectName,
          estimatedBudget: lead.value,
        },
      });
    } finally {
      setGeneratingLeadId(null);
    }
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const filtered = useMemo(() => {
    let data = [...leads];
    if (filterStage !== "all") {
      data = data.filter((l) => normalizeLeadStage(l.stage) === filterStage);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (l) =>
          l.clientName.toLowerCase().includes(q) ||
          l.projectName.toLowerCase().includes(q) ||
          l.stage.toLowerCase().includes(q),
      );
    }
    data.sort((a, b) => {
      let av: string | number = 0,
        bv: string | number = 0;
      if (sortKey === "value") {
        av = a.value || 0;
        bv = b.value || 0;
      } else if (sortKey === "createdAt") {
        const aTs = a.createdAt as { seconds: number } | null | undefined;
        const bTs = b.createdAt as { seconds: number } | null | undefined;
        av = aTs?.seconds || 0;
        bv = bTs?.seconds || 0;
      } else {
        av = (a[sortKey] as string) || "";
        bv = (b[sortKey] as string) || "";
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return data;
  }, [leads, filterStage, search, sortKey, sortDir]);

  const totalValue = filtered.reduce((a, c) => a + (c.value || 0), 0);
  const closedValue = filtered
    .filter((l) => normalizeLeadStage(l.stage) === "won")
    .reduce((a, c) => a + (c.value || 0), 0);

  const toggleSelect = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((l) => l.id)));
  };

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(v);

  const formatDate = (ts?: { seconds: number }) =>
    ts ? new Date(ts.seconds * 1000).toLocaleDateString("pt-BR") : "—";

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey !== col ? (
      <ChevronsUpDown className="h-3.5 w-3.5 text-os-muted" />
    ) : sortDir === "asc" ? (
      <ChevronUp className="h-3.5 w-3.5 text-os-primary" />
    ) : (
      <ChevronDown className="h-3.5 w-3.5 text-os-primary" />
    );

  const handleDeleteConfirm = async () => {
    if (!leadToDelete) return;
    await deleteLead.mutateAsync(leadToDelete.id);
    setLeadToDelete(null);
  };

  return (
    <div className="max-w-[1400px] mx-auto w-full space-y-6">
      <PageHeader
        title="Oportunidades & Leads"
        description={`${filtered.length} lead${filtered.length !== 1 ? "s" : ""} · Tabela analítica e gestão de pipeline`}
        breadcrumbs={[
          { label: "CRM", href: "/os/crm" },
          { label: "Oportunidades" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsRadarOpen(true)}
              className="border-os-primary/30 text-os-primary hover:bg-os-primary/10 shadow-sm"
              leadingIcon={<Sparkles className="h-4 w-4 text-os-primary" />}
            >
              Radar IA
            </Button>
            <Button
              variant="primary"
              size="sm"
              leadingIcon={<Plus className="h-4 w-4" />}
              onClick={() => setIsModalOpen(true)}
            >
              Novo Lead
            </Button>
          </div>
        }
      />

      {/* KPI FILTER CHIPS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {LEAD_STAGES.map((stageKey, i) => {
          const meta = LEAD_STAGE_META[stageKey];
          const count = leads.filter(
            (l) => normalizeLeadStage(l.stage) === stageKey,
          ).length;
          const val = leads
            .filter((l) => normalizeLeadStage(l.stage) === stageKey)
            .reduce((a, c) => a + (c.value || 0), 0);
          const isSelected = filterStage === stageKey;

          return (
            <motion.button
              key={stageKey}
              custom={i + 1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              onClick={() => setFilterStage(isSelected ? "all" : stageKey)}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                isSelected
                  ? "border-os-primary bg-os-primary/10 ring-1 ring-os-primary"
                  : "bg-os-surface border-os-border hover:border-os-border-strong hover:bg-os-bg"
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <p className="text-xs font-semibold text-os-muted truncate">
                  {meta.label}
                </p>
                <StatusBadge tone={meta.tone} size="sm" dotOnly />
              </div>
              <p className="text-2xl font-bold text-os-text">{count}</p>
              {val > 0 && (
                <p className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-medium mt-0.5 truncate">
                  {formatCurrency(val)}
                </p>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* TABLE PANEL */}
      <motion.div
        custom={7}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <Panel className="overflow-hidden">
          {/* Toolbar */}
          <div className="px-5 py-3.5 border-b border-os-border flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-os-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar leads por cliente ou projeto..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-os-border bg-os-bg text-sm text-os-text outline-none focus:ring-2 focus:ring-os-primary/30 transition-all placeholder:text-os-muted"
              />
            </div>
            {filterStage !== "all" && (
              <button
                onClick={() => setFilterStage("all")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-os-primary/10 text-os-primary text-xs font-semibold"
              >
                {LEAD_STAGE_META[filterStage as LeadStage]?.label ||
                  filterStage}{" "}
                <X className="h-3 w-3" />
              </button>
            )}
            {selected.size > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20">
                <span className="text-xs font-semibold text-red-600 dark:text-red-400">
                  {selected.size} selecionado{selected.size > 1 ? "s" : ""}
                </span>
                <button
                  onClick={() => setSelected(new Set())}
                  className="text-red-400 hover:text-red-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
            <div className="ml-auto flex items-center gap-4 text-xs text-os-muted font-mono">
              <span>
                Pipeline:{" "}
                <span className="font-semibold text-os-text">
                  {formatCurrency(totalValue)}
                </span>
              </span>
              <span>
                Ganho:{" "}
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(closedValue)}
                </span>
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-os-bg border-b border-os-border">
                  <th className="pl-5 py-3 w-10">
                    <button onClick={toggleSelectAll}>
                      {selected.size === filtered.length &&
                      filtered.length > 0 ? (
                        <CheckSquare className="h-4 w-4 text-os-primary" />
                      ) : (
                        <Square className="h-4 w-4 text-os-muted" />
                      )}
                    </button>
                  </th>
                  {[
                    { key: "clientName" as SortKey, label: "Cliente" },
                    { key: "projectName" as SortKey, label: "Projeto" },
                    { key: "stage" as SortKey, label: "Fase" },
                    { key: "value" as SortKey, label: "Valor Previsto" },
                    { key: "createdAt" as SortKey, label: "Data" },
                  ].map((col) => (
                    <th
                      key={col.key}
                      className="px-4 py-3 text-xs font-bold text-os-muted uppercase tracking-wider cursor-pointer select-none"
                      onClick={() => handleSort(col.key)}
                    >
                      <span className="flex items-center gap-1.5">
                        {col.label}
                        <SortIcon col={col.key} />
                      </span>
                    </th>
                  ))}
                  <th className="px-4 py-3 text-xs font-bold text-os-muted uppercase tracking-wider">
                    Contato
                  </th>
                  <th className="px-4 py-3 w-28 text-right pr-5">Ações</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={8} className="px-5 py-4">
                        <div className="h-5 bg-os-bg rounded-lg animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-20 text-center">
                      <p className="text-sm text-os-muted">
                        Nenhum lead encontrado com os filtros atuais.
                      </p>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setIsModalOpen(true)}
                        className="mt-3"
                      >
                        + Novo Lead
                      </Button>
                    </td>
                  </tr>
                ) : (
                  filtered.map((lead, i) => {
                    const normStage = normalizeLeadStage(lead.stage);
                    const meta = LEAD_STAGE_META[normStage];

                    return (
                      <motion.tr
                        key={
                          lead.id ? `lead-row-${lead.id}` : `lead-row-idx-${i}`
                        }
                        custom={i}
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        className={`border-b border-os-border/60 hover:bg-os-bg/50 transition-colors group ${
                          selected.has(lead.id) ? "bg-os-primary/5" : ""
                        }`}
                      >
                        <td className="pl-5 py-3.5">
                          <button onClick={() => toggleSelect(lead.id)}>
                            {selected.has(lead.id) ? (
                              <CheckSquare className="h-4 w-4 text-os-primary" />
                            ) : (
                              <Square className="h-4 w-4 text-os-muted group-hover:text-os-text" />
                            )}
                          </button>
                        </td>
                        <td className="px-4 py-3.5">
                          <Link
                            href={`/os/crm/${lead.id}`}
                            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                          >
                            <div className="w-8 h-8 rounded-xl bg-os-primary text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                              {lead.clientName.charAt(0)}
                            </div>
                            <span className="text-sm font-semibold text-os-text group-hover:text-os-primary transition-colors">
                              {lead.clientName}
                            </span>
                          </Link>
                        </td>
                        <td className="px-4 py-3.5 text-sm text-os-muted">
                          {lead.projectName || "—"}
                        </td>
                        <td className="px-4 py-3.5">
                          <StatusBadge label={meta.label} tone={meta.tone} />
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="font-mono text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                            {lead.value ? formatCurrency(lead.value) : "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 font-mono text-xs text-os-muted">
                          {formatDate(
                            lead.createdAt as { seconds: number } | undefined,
                          )}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5">
                            {lead.contact?.phone && (
                              <a
                                href={`https://wa.me/${lead.contact.phone.replace(/\D/g, "")}`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-lg text-os-muted hover:bg-emerald-500/10 hover:text-emerald-600 transition-colors"
                                title={lead.contact.phone}
                              >
                                <Phone className="h-3.5 w-3.5" />
                              </a>
                            )}
                            {lead.contact?.email && (
                              <button
                                onClick={() => handleDraftProposalForLead(lead)}
                                disabled={generatingLeadId === lead.id}
                                className="p-1.5 rounded-lg text-os-muted hover:bg-blue-500/10 hover:text-blue-600 transition-colors"
                                title="Redigir Proposta IA e Enviar via Gmail"
                              >
                                {generatingLeadId === lead.id ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin text-os-primary" />
                                ) : (
                                  <Mail className="h-3.5 w-3.5" />
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-right pr-5">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleDraftProposalForLead(lead)}
                              disabled={generatingLeadId === lead.id}
                              className="p-1.5 rounded-lg text-os-muted hover:bg-os-primary/10 hover:text-os-primary transition-colors"
                              title="Gerar Proposta IA (Gemini 3.8 Flash)"
                            >
                              {generatingLeadId === lead.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin text-os-primary" />
                              ) : (
                                <Sparkles className="h-3.5 w-3.5 text-os-primary" />
                              )}
                            </button>
                            <Link
                              href={`/os/crm/${lead.id}`}
                              className="p-1.5 rounded-lg text-os-muted hover:bg-os-bg hover:text-os-primary transition-colors"
                              title="Ver Detalhes 360"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Link>
                            <button
                              onClick={() => setSelectedLead(lead)}
                              className="p-1.5 rounded-lg text-os-muted hover:bg-os-bg hover:text-os-primary transition-colors"
                              title="Editar"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => setLeadToDelete(lead)}
                              className="p-1.5 rounded-lg text-os-muted hover:bg-red-500/10 hover:text-red-500 transition-colors"
                              title="Excluir"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {filtered.length > 0 && (
            <div className="px-5 py-3 border-t border-os-border flex items-center justify-between text-xs text-os-muted font-mono">
              <span>
                {filtered.length} lead{filtered.length !== 1 ? "s" : ""} exibido
                {filtered.length !== 1 ? "s" : ""}
              </span>
              <span>
                Total selecionado:{" "}
                <span className="font-bold text-os-text">
                  {formatCurrency(totalValue)}
                </span>
              </span>
            </div>
          )}
        </Panel>
      </motion.div>

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

      <ConfirmDialog
        isOpen={!!leadToDelete}
        onClose={() => setLeadToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Excluir Lead?"
        description={`Tem certeza que deseja excluir o lead de "${leadToDelete?.clientName}"? Esta ação removerá a oportunidade do CRM.`}
        confirmLabel="Excluir Lead"
        tone="danger"
        isLoading={deleteLead.isPending}
      />

      <ComposeEmailModal
        isOpen={!!emailModalData}
        onClose={() => setEmailModalData(null)}
        initialData={emailModalData}
      />
    </div>
  );
}
