"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Brain,
  Building2,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  Clock,
  Send,
  FileText,
  MessageSquare,
  Loader2,
  Sparkles,
  DollarSign,
} from "lucide-react";
import { useLead, useUpdateLead } from "@/features/crm/api/use-leads";
import { useCreateProject } from "@/features/projects/api/use-projects";
import { useCreateClient } from "@/features/clients/api/use-clients";
import {
  LEAD_STAGES,
  LEAD_STAGE_META,
  normalizeLeadStage,
  toStoredLeadStage,
  type LeadStage,
} from "@/domain/lead";
import { PageHeader } from "@/components/os/page-header";
import { Button } from "@/components/os/button";
import { Panel, PanelHeader } from "@/components/os/panel";
import { StatusBadge } from "@/components/os/status-badge";
import { ConfirmDialog } from "@/components/os/confirm-dialog";
import {
  ComposeEmailModal,
  type ComposeInitialData,
} from "@/features/inbox/components/compose-email-modal";
import { useGenerateAiProposal } from "@/features/inbox/api/use-gmail";
import Link from "next/link";
import { toast } from "sonner";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  }),
};

interface ActivityLog {
  id: string;
  type: "note" | "meeting" | "proposal" | "stage";
  title: string;
  desc: string;
  time: string;
  user: string;
}

export default function LeadDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: lead, isLoading, error } = useLead(id);
  const updateLead = useUpdateLead();
  const createProject = useCreateProject();
  const createClient = useCreateClient();
  const generateProposal = useGenerateAiProposal();

  const [activeTab, setActiveTab] = useState<
    "overview" | "timeline" | "proposal"
  >("overview");
  const [newNote, setNewNote] = useState("");
  const [convertModalOpen, setConvertModalOpen] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [proposalModalData, setProposalModalData] =
    useState<ComposeInitialData | null>(null);
  const [isDraftingProposal, setIsDraftingProposal] = useState(false);

  const [activities, setActivities] = useState<ActivityLog[]>([
    {
      id: "act-1",
      type: "proposal",
      title: "Proposta Comercial enviada",
      desc: "Escopo técnico e cronograma de 12 semanas entregues para análise da diretoria.",
      time: "Hoje às 14:30",
      user: "Ezequiel",
    },
    {
      id: "act-2",
      type: "meeting",
      title: "Reunião de Alinhamento de Requisitos",
      desc: "Alinhadas expectativas sobre integração com ERP legado e SLAs em nuvem.",
      time: "Ontem às 10:00",
      user: "Ezequiel",
    },
    {
      id: "act-3",
      type: "stage",
      title: "Lead qualificado e registrado",
      desc: "Primeiro contato efetuado via indicação corporativa.",
      time: "2 dias atrás",
      user: "Sistema FZ",
    },
  ]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="h-8 w-8 text-os-primary animate-spin" />
        <p className="text-sm text-os-muted font-mono">
          Carregando perfil do cliente...
        </p>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="max-w-xl mx-auto text-center py-16">
        <Brain className="h-12 w-12 text-os-muted mx-auto mb-4" />
        <h2 className="text-xl font-bold text-os-text mb-2">
          Lead não encontrado
        </h2>
        <p className="text-sm text-os-muted mb-6">
          O lead solicitado pode ter sido excluído ou não existe.
        </p>
        <Link href="/os/crm/leads">
          <Button
            variant="secondary"
            leadingIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Voltar para Leads
          </Button>
        </Link>
      </div>
    );
  }

  const currentStage = normalizeLeadStage(lead.stage);
  const currentStageMeta = LEAD_STAGE_META[currentStage];

  const handleStageChange = async (newStage: LeadStage) => {
    try {
      const storedVal = toStoredLeadStage(newStage);
      await updateLead.mutateAsync({ id: lead.id, data: { stage: storedVal } });
      const stageLabel = LEAD_STAGE_META[newStage].label;
      toast.success(`Fase alterada para "${stageLabel}"`);
      setActivities((prev) => [
        {
          id: `stage-${Date.now()}`,
          type: "stage",
          title: `Etapa alterada para ${stageLabel}`,
          desc: `Atualização de pipeline registrada no FZ OS.`,
          time: "Agora mesmo",
          user: "Você",
        },
        ...prev,
      ]);
    } catch {
      toast.error("Erro ao atualizar etapa do lead");
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setActivities((prev) => [
      {
        id: `note-${Date.now()}`,
        type: "note",
        title: "Nota de Negociação adicionada",
        desc: newNote.trim(),
        time: "Agora mesmo",
        user: "Você",
      },
      ...prev,
    ]);
    setNewNote("");
    toast.success("Nota adicionada ao histórico!");
  };

  const handleConvertToProject = async () => {
    setIsConverting(true);
    try {
      // 1. Automatic Client record creation/linking
      let linkedClientId = lead.id;
      try {
        const clientResult = await createClient.mutateAsync({
          name: lead.clientName,
          email: lead.contact?.email,
          phone: lead.contact?.phone,
          segment: "Comercial / CRM",
          notes: `Cadastrado automaticamente a partir do lead "${lead.clientName}" (${lead.projectName || "Sem projeto"}).`,
          leadId: lead.id,
          status: "active",
        });
        if (clientResult?.id) {
          linkedClientId = clientResult.id;
        }
      } catch (clientErr) {
        console.warn("Cliente já existente ou falha na criação:", clientErr);
      }

      // 2. Project creation with valid clientId
      await createProject.mutateAsync({
        name: lead.projectName || lead.clientName,
        clientId: linkedClientId,
        status: "planning",
        budget: lead.value || 0,
        progress: 0,
        startDate: new Date().toISOString().split("T")[0],
        description: `Projeto gerado a partir do lead comercial ${lead.clientName}.`,
      });

      // 3. Mark lead as won
      await updateLead.mutateAsync({
        id: lead.id,
        data: { stage: toStoredLeadStage("won") },
      });

      toast.success("Lead convertido em Cliente e Projeto ativo com sucesso!");
      setConvertModalOpen(false);
      router.push("/os/projects");
    } catch {
      toast.error("Erro ao converter lead em projeto");
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto w-full space-y-6">
      <PageHeader
        title={lead.clientName}
        description={lead.projectName || "Oportunidade Comercial"}
        breadcrumbs={[
          { label: "CRM", href: "/os/crm" },
          { label: "Oportunidades", href: "/os/crm/leads" },
          { label: lead.clientName },
        ]}
        badge={
          <StatusBadge
            label={currentStageMeta.label}
            tone={currentStageMeta.tone}
          />
        }
        actions={
          <div className="flex items-center gap-2">
            <Link href="/os/crm/leads">
              <Button
                variant="secondary"
                size="sm"
                leadingIcon={<ArrowLeft className="h-4 w-4" />}
              >
                Voltar
              </Button>
            </Link>
            <Button
              variant="primary"
              size="sm"
              leadingIcon={<Sparkles className="h-4 w-4" />}
              onClick={() => setConvertModalOpen(true)}
            >
              Converter em Projeto
            </Button>
          </div>
        }
      />

      {/* HEADER CARD - CUSTOMER 360 */}
      <motion.div
        custom={1}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <Panel className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-os-primary text-white flex items-center justify-center font-bold text-xl flex-shrink-0 shadow-md">
                {lead.clientName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-xl font-bold text-os-text tracking-tight">
                    {lead.clientName}
                  </h2>
                  <StatusBadge
                    label={currentStageMeta.label}
                    tone={currentStageMeta.tone}
                  />
                </div>
                <p className="text-sm text-os-muted mt-1 flex items-center gap-2">
                  <Building2 className="h-3.5 w-3.5" />
                  {lead.projectName || "Projeto Comercial"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-os-border pt-4 md:pt-0 md:pl-6">
              <div>
                <p className="text-xs text-os-muted font-medium flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5" /> Valor Estimado
                </p>
                <p className="text-2xl font-bold text-os-text tracking-tight mt-0.5">
                  R$ {lead.value ? lead.value.toLocaleString("pt-BR") : "0"}
                </p>
              </div>
            </div>
          </div>

          {/* PIPELINE PROGRESSION STEPPER */}
          <div className="mt-8 pt-6 border-t border-os-border">
            <p className="text-xs font-semibold text-os-muted uppercase tracking-wider mb-3">
              Fase do Funil de Vendas (Clique para atualizar)
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {LEAD_STAGES.map((s) => {
                const isCurrent = currentStage === s;
                const meta = LEAD_STAGE_META[s];
                return (
                  <button
                    key={s}
                    onClick={() => handleStageChange(s)}
                    disabled={updateLead.isPending}
                    className={`p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                      isCurrent
                        ? "border-os-primary bg-os-primary/10 text-os-primary shadow-sm font-semibold ring-1 ring-os-primary"
                        : "border-os-border hover:border-os-border-strong hover:bg-os-bg text-os-muted"
                    }`}
                  >
                    <p className="truncate font-semibold">{meta.label}</p>
                    <span className="text-[10px] opacity-75">
                      {isCurrent ? "Fase Atual" : "Mover"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </Panel>
      </motion.div>

      {/* METRIC HIGHLIGHTS */}
      <motion.div
        custom={2}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {[
          {
            label: "Email de Contato",
            value: lead.contact?.email || "contato@cliente.com",
            icon: Mail,
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-500/10",
          },
          {
            label: "Telefone / WhatsApp",
            value: lead.contact?.phone || "(11) 98765-4321",
            icon: Phone,
            color: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-500/10",
          },
          {
            label: "Previsão de Fechamento",
            value: "Em até 15 dias",
            icon: Calendar,
            color: "text-violet-600 dark:text-violet-400",
            bg: "bg-violet-500/10",
          },
        ].map((item) => (
          <Panel key={item.label} className="p-4 flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${item.bg} flex-shrink-0`}>
              <item.icon className={`h-4 w-4 ${item.color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-os-muted font-medium">
                {item.label}
              </p>
              <p className="text-sm font-semibold text-os-text truncate">
                {item.value}
              </p>
            </div>
          </Panel>
        ))}
      </motion.div>

      {/* TABS SELECTOR */}
      <motion.div
        custom={3}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex items-center gap-2 border-b border-os-border pb-2"
      >
        {[
          { id: "overview", label: "Visão Geral 360", icon: Building2 },
          { id: "timeline", label: "Histórico & Atividades", icon: Clock },
          { id: "proposal", label: "Proposta Comercial", icon: FileText },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === tab.id
                ? "bg-os-primary text-white shadow-sm"
                : "text-os-muted hover:text-os-text hover:bg-os-bg"
            }`}
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* TAB CONTENT */}
      {activeTab === "overview" && (
        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <div className="lg:col-span-2 space-y-6">
            <Panel className="p-6 space-y-4">
              <PanelHeader
                title="Diagnóstico & Necessidades do Cliente"
                description="Resumo do escopo operacional do projeto"
                icon={<Brain className="h-4 w-4 text-os-primary" />}
              />
              <p className="text-sm text-os-text leading-relaxed">
                Cliente busca evolução de plataforma corporativa e arquitetura
                de alto desempenho em nuvem com alta disponibilidade, suporte a
                mensageria e interface operacional personalizada (SaaS).
                Estimativa de desenvolvimento de 3 meses com stack Next.js,
                Firebase e integrações robustas.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-os-border">
                <div>
                  <p className="text-xs text-os-muted font-medium">
                    Origem do Lead
                  </p>
                  <p className="text-sm font-semibold text-os-text">
                    Indicação Corporativa
                  </p>
                </div>
                <div>
                  <p className="text-xs text-os-muted font-medium">
                    Responsável Comercial
                  </p>
                  <p className="text-sm font-semibold text-os-text">
                    Ezequiel (FZ Build)
                  </p>
                </div>
              </div>
            </Panel>

            {/* QUICK NOTE FORM */}
            <Panel className="p-6">
              <PanelHeader
                title="Registrar Nova Atividade / Nota de Reunião"
                description="Salva nota interna no histórico do cliente"
                icon={<MessageSquare className="h-4 w-4 text-os-primary" />}
              />
              <form onSubmit={handleAddNote} className="space-y-3 mt-4">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Escreva detalhes da ligação, alinhamento técnico ou pontos de negociação..."
                  className="w-full h-24 p-3 rounded-xl border border-os-border bg-os-bg text-sm text-os-text focus:outline-none focus:ring-2 focus:ring-os-primary/30 resize-none"
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    leadingIcon={<Send className="h-3.5 w-3.5" />}
                  >
                    Salvar Nota
                  </Button>
                </div>
              </form>
            </Panel>
          </div>

          {/* SIDEBAR ACTIONS & NEXT STEPS */}
          <div className="space-y-6">
            <Panel className="p-6 space-y-4">
              <PanelHeader
                title="Próximos Passos Comerciais"
                description="Checklist do fechamento"
                icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />}
              />
              <ul className="space-y-3 mt-2">
                {[
                  { text: "Enviar minuta contratual", done: false },
                  { text: "Agendar call técnica de segurança", done: true },
                  {
                    text: "Validar SLA e volumetria de requisições",
                    done: false,
                  },
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs">
                    <input
                      type="checkbox"
                      defaultChecked={item.done}
                      className="mt-0.5 rounded border-os-border text-os-primary focus:ring-os-primary"
                    />
                    <span
                      className={
                        item.done
                          ? "line-through text-os-muted"
                          : "text-os-text font-medium"
                      }
                    >
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        </motion.div>
      )}

      {activeTab === "timeline" && (
        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <Panel className="p-6 md:p-8">
            <PanelHeader
              title="Linha do Tempo de Interações"
              description="Histórico de evolução e registros de contato"
              icon={<Clock className="h-4 w-4 text-os-primary" />}
            />
            <div className="relative pl-6 space-y-6 mt-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-os-border">
              {activities.map((act) => (
                <div key={act.id} className="relative">
                  <div className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-os-primary ring-4 ring-os-surface" />
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-os-text">
                      {act.title}
                    </p>
                    <span className="text-[11px] text-os-muted">
                      {act.time}
                    </span>
                  </div>
                  <p className="text-xs text-os-muted mt-1 leading-relaxed">
                    {act.desc}
                  </p>
                  <span className="inline-block mt-2 text-[10px] font-mono text-os-muted bg-os-bg px-2 py-0.5 rounded border border-os-border">
                    Por {act.user}
                  </span>
                </div>
              ))}
            </div>
          </Panel>
        </motion.div>
      )}

      {activeTab === "proposal" && (
        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <Panel className="p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-base font-bold text-os-text">
                  Proposta Comercial FZ-{new Date().getFullYear()}-01
                </h3>
                <p className="text-xs text-os-muted mt-0.5">
                  Proposta personalizada com inteligência artificial Gemini 3.8
                  Flash
                </p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge label="Pronta para Envio" tone="success" />
                <Button
                  variant="primary"
                  size="sm"
                  onClick={async () => {
                    if (!lead) return;
                    setIsDraftingProposal(true);
                    const toastId = toast.loading(
                      "Redigindo proposta comercial personalizada com Gemini 3.8 Flash...",
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
                      toast.success("Proposta comercial pronta para envio!");
                      setProposalModalData({
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
                    } catch (err) {
                      console.warn(err);
                      toast.dismiss(toastId);
                      toast.info(
                        "Abrindo proposta para edição manual e envio.",
                      );
                      setProposalModalData({
                        to: lead.contact?.email || "",
                        subject: `Parceria em Engenharia & Obras: ${lead.clientName}`,
                        bodyHtml: `<p>Olá equipe da <strong>${lead.clientName}</strong>,</p><p>Gostaríamos de apresentar nossa proposta para o projeto <em>${lead.projectName}</em>.</p><p>Atenciosamente,<br/><strong>Ezequiel Ferreira</strong><br/>FZ Build Solutions</p>`,
                        leadContext: {
                          companyName: lead.clientName,
                          contactEmail: lead.contact?.email,
                          projectOpportunity: lead.projectName,
                          estimatedBudget: lead.value,
                        },
                      });
                    } finally {
                      setIsDraftingProposal(false);
                    }
                  }}
                  disabled={isDraftingProposal}
                  leadingIcon={
                    isDraftingProposal ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )
                  }
                >
                  {isDraftingProposal
                    ? "Redigindo..."
                    : "Redigir Proposta IA & Enviar via Gmail"}
                </Button>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-os-bg border border-os-border grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-os-muted font-medium">
                  Investimento Total
                </p>
                <p className="text-xl font-bold text-os-text mt-0.5">
                  R$ {lead.value ? lead.value.toLocaleString("pt-BR") : "0"}
                </p>
              </div>
              <div>
                <p className="text-xs text-os-muted font-medium">
                  Destinatário Comercial
                </p>
                <p className="text-sm font-semibold text-os-text mt-0.5 truncate">
                  {lead.contact?.email || "Sem e-mail cadastrado"}
                </p>
              </div>
              <div>
                <p className="text-xs text-os-muted font-medium">
                  Escopo Previsto
                </p>
                <p className="text-sm font-semibold text-os-text mt-0.5 truncate">
                  {lead.projectName || "Desenvolvimento e Engenharia"}
                </p>
              </div>
            </div>
          </Panel>
        </motion.div>
      )}

      {/* CONFIRM CONVERT DIALOG */}
      <ConfirmDialog
        isOpen={convertModalOpen}
        onClose={() => setConvertModalOpen(false)}
        onConfirm={handleConvertToProject}
        title="Converter Oportunidade em Projeto?"
        description={`Isso criará uma nova entidade "Cliente" no módulo de Clientes, iniciará um "Projeto Ativo" vinculado e marcará esta oportunidade comercial como "Ganho (Fechado)".`}
        confirmLabel="Confirmar e Iniciar Projeto"
        cancelLabel="Cancelar"
        isLoading={isConverting}
      />

      {/* COMPOSE & PROPOSAL MODAL */}
      <ComposeEmailModal
        isOpen={!!proposalModalData}
        onClose={() => setProposalModalData(null)}
        initialData={proposalModalData}
      />
    </div>
  );
}
