"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sparkles,
  Search,
  Radar,
  Building2,
  MapPin,
  Lightbulb,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Phone,
  Mail,
  Loader2,
  Flame,
  ArrowRight,
  Plus,
} from "lucide-react";
import { Button } from "@/components/os/button";
import { StatusBadge } from "@/components/os/status-badge";
import { useCreateLead } from "../api/use-leads";
import {
  type DiscoveredLead,
  type ProspectResult,
} from "../services/gemini-prospector";
import {
  ComposeEmailModal,
  type ComposeInitialData,
} from "@/features/inbox/components/compose-email-modal";
import { useGenerateAiProposal } from "@/features/inbox/api/use-gmail";
import { toast } from "sonner";

interface AIProspectorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUGGESTED_NICHES = [
  "Startups & Scale-ups em Crescimento",
  "Logística, Frotas & Transporte (Apps & Rastreamento)",
  "Varejo, E-commerce & Redes de Lojas (Apps & Portais)",
  "Saúde, Clínicas & Hospitais (Sistemas & Agendamentos)",
  "Serviços Financeiros & Fintechs (Plataformas Web)",
  "Distribuidoras & Atacado (Sistemas de Força de Vendas)",
  "Imobiliárias & Construtoras (Portais & CRMs)",
  "Indústrias & Manufatura (Automações & Dashboards)",
  "Franquias & Redes de Alimentação (Apps de Fidelidade)",
  "Educação & Cursos (Plataformas EAD / LMS)",
  "Empresas de Serviços B2B & Consultorias",
  "Empresas com Processos Manuais em Planilhas",
];

const SUGGESTED_LOCATIONS = [
  "São Paulo - SP",
  "Campinas & Região - SP",
  "Rio de Janeiro - RJ",
  "Belo Horizonte - MG",
  "Curitiba - PR",
  "Florianópolis - SC",
  "Porto Alegre - RS",
  "Goiânia - GO",
  "Brasília - DF",
  "Salvador - BA",
  "Recife - PE",
  "Fortaleza - CE",
];

const SUGGESTED_TRIGGERS = [
  "Processos manuais ou em planilhas demandando sistema em nuvem",
  "Necessidade de aplicativo mobile sob medida (iOS e Android)",
  "Criação de portal de clientes ou plataforma de atendimento",
  "Modernização de sistemas legados e migração para a nuvem",
  "Automação de fluxos operacionais e integrações de APIs",
  "Expansão acelerada demandando software e plataforma escalável",
];

export function AIProspectorDrawer({
  isOpen,
  onClose,
}: AIProspectorDrawerProps) {
  const [niche, setNiche] = useState(SUGGESTED_NICHES[0]);
  const [location, setLocation] = useState(SUGGESTED_LOCATIONS[0]);
  const [trigger, setTrigger] = useState(SUGGESTED_TRIGGERS[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ProspectResult | null>(null);
  const [importedIds, setImportedIds] = useState<Set<string>>(new Set());
  const [isImportingAll, setIsImportingAll] = useState(false);
  const [generatingProposalLeadId, setGeneratingProposalLeadId] = useState<
    string | null
  >(null);
  const [proposalModalData, setProposalModalData] =
    useState<ComposeInitialData | null>(null);

  const createLead = useCreateLead();
  const generateProposal = useGenerateAiProposal();

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleScan = async () => {
    if (!niche.trim() || !location.trim()) {
      toast.error("Informe o segmento e a localidade para a varredura.");
      return;
    }

    setIsScanning(true);
    try {
      const res = await fetch("/api/crm/prospect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche, location, trigger, count: 5 }),
      });

      if (!res.ok) {
        throw new Error("Falha na comunicação com o serviço de IA.");
      }

      const data: ProspectResult = await res.json();
      setResult(data);

      if (data.error) {
        toast.error(data.error);
      } else if (data.leads.length > 0) {
        toast.success(
          `${data.leads.length} oportunidades reais mapeadas com Gemini!`,
        );
      } else {
        toast.info(
          "Nenhuma oportunidade encontrada para esses parâmetros específicos.",
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao executar varredura de prospecção com IA.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleImportLead = async (lead: DiscoveredLead) => {
    try {
      await createLead.mutateAsync({
        clientName: lead.tradeName || lead.companyName,
        projectName: lead.projectOpportunity,
        value: lead.estimatedBudget,
        stage: "Leads Novos",
        contact: {
          phone: lead.contactPhone || undefined,
          email: lead.contactEmail || undefined,
        },
        segment: lead.segment,
        cityState: lead.cityState,
        website: lead.website || undefined,
        aiScore: lead.fitScore,
        aiPitch: lead.recommendedPitch,
        detectedPain: lead.detectedPain,
        source: "Radar IA Gemini",
      });

      setImportedIds((prev) => new Set(prev).add(lead.id));
      toast.success(
        `"${lead.tradeName || lead.companyName}" importado para o Funil!`,
      );
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar lead no CRM.");
    }
  };

  const handleDraftProposal = async (lead: DiscoveredLead) => {
    setGeneratingProposalLeadId(lead.id);
    const toastId = toast.loading(
      `Gerando proposta personalizada com Gemini para ${lead.tradeName || lead.companyName}...`,
    );

    try {
      const proposal = await generateProposal.mutateAsync({
        companyName: lead.companyName,
        tradeName: lead.tradeName,
        contactEmail: lead.contactEmail,
        segment: lead.segment,
        cityState: lead.cityState,
        detectedPain: lead.detectedPain,
        projectOpportunity: lead.projectOpportunity,
        estimatedBudget: lead.estimatedBudget,
        recommendedPitch: lead.recommendedPitch,
      });

      toast.dismiss(toastId);
      toast.success("Proposta comercial pronta para envio!");

      setProposalModalData({
        to: lead.contactEmail || "",
        subject: proposal.subject,
        bodyHtml: proposal.bodyHtml || proposal.bodyText,
        leadContext: {
          companyName: lead.companyName,
          tradeName: lead.tradeName,
          contactEmail: lead.contactEmail,
          segment: lead.segment,
          cityState: lead.cityState,
          detectedPain: lead.detectedPain,
          projectOpportunity: lead.projectOpportunity,
          estimatedBudget: lead.estimatedBudget,
          recommendedPitch: lead.recommendedPitch,
        },
      });
    } catch (error) {
      console.warn("[AIProposal] Falha na geração automática via IA:", error);
      toast.dismiss(toastId);
      toast.info(
        "Não foi possível redigir automaticamente via IA (verifique créditos da API). Abrindo formulário para edição.",
      );

      // Open with clean personalized template if AI is temporarily unavailable
      const fallbackSubject = `Soluções em Software & Aplicativos sob Medida: ${lead.tradeName || lead.companyName}`;
      const fallbackHtml = `<p>Olá equipe da <strong>${lead.tradeName || lead.companyName}</strong>,</p>
<p>Mapeamos uma excelente oportunidade de desenvolvimento tecnológico para <em>${lead.projectOpportunity}</em> em ${lead.cityState}.</p>
<p>A FZ Build Solutions é uma casa de software especializada no desenvolvimento sob medida de <strong>sistemas em nuvem, aplicativos mobile (iOS e Android), websites de alta performance e automações</strong>.</p>
<p>Gostaríamos de apresentar como nossa engenharia de software pode acelerar a escala e eficiência da sua operação.</p>
<p>Atenciosamente,<br/><strong>Ezequiel Ferreira</strong><br/>FZ Build Solutions · Casa de Software</p>`;

      setProposalModalData({
        to: lead.contactEmail || "",
        subject: fallbackSubject,
        bodyHtml: fallbackHtml,
        leadContext: {
          companyName: lead.companyName,
          tradeName: lead.tradeName,
          contactEmail: lead.contactEmail,
          segment: lead.segment,
          cityState: lead.cityState,
          detectedPain: lead.detectedPain,
          projectOpportunity: lead.projectOpportunity,
          estimatedBudget: lead.estimatedBudget,
          recommendedPitch: lead.recommendedPitch,
        },
      });
    } finally {
      setGeneratingProposalLeadId(null);
    }
  };

  const handleImportAll = async () => {
    if (!result || result.leads.length === 0) return;
    setIsImportingAll(true);
    let count = 0;

    for (const lead of result.leads) {
      if (!importedIds.has(lead.id)) {
        try {
          await createLead.mutateAsync({
            clientName: lead.tradeName || lead.companyName,
            projectName: lead.projectOpportunity,
            value: lead.estimatedBudget,
            stage: "Leads Novos",
            contact: {
              phone: lead.contactPhone || undefined,
              email: lead.contactEmail || undefined,
            },
            segment: lead.segment,
            cityState: lead.cityState,
            website: lead.website || undefined,
            aiScore: lead.fitScore,
            aiPitch: lead.recommendedPitch,
            detectedPain: lead.detectedPain,
            source: "Radar IA Gemini",
          });
          setImportedIds((prev) => new Set(prev).add(lead.id));
          count++;
        } catch (e) {
          console.error("Erro ao importar lead:", e);
        }
      }
    }

    setIsImportingAll(false);
    if (count > 0) {
      toast.success(`${count} leads adicionados com sucesso ao seu Pipeline!`);
    } else {
      toast.info("Todos os leads desta varredura já estavam importados.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer Window */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 240 }}
            className="relative w-full max-w-2xl bg-os-surface border-l border-os-border shadow-2xl flex flex-col h-full z-10 overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-os-border flex items-start justify-between bg-os-surface-2/40">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-os-primary/10 border border-os-primary/20 flex items-center justify-center text-os-primary shadow-sm relative">
                  <Radar className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-os-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-os-primary"></span>
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-os-fg">
                      Radar de Leads IA
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-os-primary/15 text-os-primary uppercase tracking-wider">
                      Gemini Engine
                    </span>
                  </div>
                  <p className="text-xs text-os-muted">
                    Prospecção inteligente B2B com pesquisa de mercado e
                    argumentos de venda
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-lg text-os-muted hover:text-os-fg hover:bg-os-surface-2 transition-colors"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Parameters Card */}
              <div className="p-5 rounded-2xl bg-os-surface-2/60 border border-os-border space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-os-muted uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-os-primary" />
                    Parâmetros de Varredura
                  </h3>
                  {result && (
                    <StatusBadge
                      tone={
                        result.isLiveAi
                          ? "success"
                          : result.error
                            ? "danger"
                            : "neutral"
                      }
                      dot
                      size="sm"
                    >
                      {result.isLiveAi
                        ? "Gemini 3.8 Flash (Live Grounding)"
                        : result.error
                          ? "API Indisponível"
                          : "Consulta Concluída"}
                    </StatusBadge>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Custom Niche/Category Input */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-os-fg flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-os-primary" />
                        Segmento / Categoria de Prospecção
                      </label>
                      <span className="text-[10px] text-os-muted">
                        Digite livremente ou clique abaixo
                      </span>
                    </div>
                    <input
                      type="text"
                      value={niche}
                      onChange={(e) => setNiche(e.target.value)}
                      placeholder="Ex: Startups, Logística, Clínicas, Franquias, E-commerce..."
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-os-surface border border-os-border text-os-fg placeholder:text-os-muted/70 focus:outline-none focus:ring-1 focus:ring-os-primary transition-all"
                    />
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pt-1 pr-1">
                      {SUGGESTED_NICHES.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setNiche(item)}
                          className={`px-2 py-0.5 rounded-lg text-[10px] transition-all text-left ${
                            niche === item
                              ? "bg-os-primary text-white font-semibold shadow-xs"
                              : "bg-os-surface text-os-muted hover:text-os-fg hover:bg-os-surface-2 border border-os-border/70"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Location Input */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-os-fg flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-os-primary" />
                        Cidade / Estado / Região
                      </label>
                      <span className="text-[10px] text-os-muted">
                        Digite a região ou selecione
                      </span>
                    </div>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Ex: Joinville - SC, Interior de SP, Região Metropolitana..."
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-os-surface border border-os-border text-os-fg placeholder:text-os-muted/70 focus:outline-none focus:ring-1 focus:ring-os-primary transition-all"
                    />
                    <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto pt-1 pr-1">
                      {SUGGESTED_LOCATIONS.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setLocation(item)}
                          className={`px-2 py-0.5 rounded-lg text-[10px] transition-all text-left ${
                            location === item
                              ? "bg-os-primary text-white font-semibold shadow-xs"
                              : "bg-os-surface text-os-muted hover:text-os-fg hover:bg-os-surface-2 border border-os-border/70"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Commercial Trigger Input */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-os-fg flex items-center gap-1.5">
                        <Lightbulb className="h-3.5 w-3.5 text-os-primary" />
                        Gatilho Comercial
                      </label>
                      <span className="text-[10px] text-os-muted">
                        Contexto da abordagem
                      </span>
                    </div>
                    <input
                      type="text"
                      value={trigger}
                      onChange={(e) => setTrigger(e.target.value)}
                      placeholder="Ex: Desenvolvimento de aplicativo mobile, Sistema em nuvem, Automação de processos..."
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-os-surface border border-os-border text-os-fg placeholder:text-os-muted/70 focus:outline-none focus:ring-1 focus:ring-os-primary transition-all"
                    />
                    <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto pt-1 pr-1">
                      {SUGGESTED_TRIGGERS.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setTrigger(item)}
                          className={`px-2 py-0.5 rounded-lg text-[10px] transition-all text-left ${
                            trigger === item
                              ? "bg-os-primary text-white font-semibold shadow-xs"
                              : "bg-os-surface text-os-muted hover:text-os-fg hover:bg-os-surface-2 border border-os-border/70"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Scan Button */}
                <div className="pt-2 flex justify-end">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleScan}
                    disabled={isScanning}
                    leadingIcon={
                      isScanning ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )
                    }
                  >
                    {isScanning
                      ? "Varrendo Mercado com IA..."
                      : "Executar Radar IA"}
                  </Button>
                </div>
              </div>

              {/* Radar Pulse Animation during Scanning */}
              {isScanning && (
                <div className="p-8 rounded-2xl bg-os-surface-2/40 border border-os-primary/20 text-center space-y-4">
                  <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-os-primary/20 animate-ping" />
                    <div className="relative rounded-full h-12 w-12 bg-os-primary/10 border border-os-primary text-os-primary flex items-center justify-center">
                      <Radar className="h-6 w-6 animate-spin text-os-primary" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-os-fg">
                      Consultando Ecossistema Comercial...
                    </h4>
                    <p className="text-xs text-os-muted mt-1 max-w-sm mx-auto">
                      A IA está cruzando dados de registros, notícias e
                      expansões para o nicho de{" "}
                      <strong className="text-os-fg">{niche}</strong> em{" "}
                      <strong className="text-os-fg">{location}</strong>.
                    </p>
                  </div>
                </div>
              )}

              {/* Results Section */}
              {!isScanning && result && (
                <div className="space-y-4">
                  {result.error ? (
                    <div className="p-5 rounded-2xl bg-os-danger/10 border border-os-danger/30 space-y-2">
                      <div className="flex items-center gap-2 text-os-danger font-semibold text-sm">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <span>Radar de IA Indisponível</span>
                      </div>
                      <p className="text-xs text-os-fg/80 leading-relaxed">
                        {result.error}
                      </p>
                    </div>
                  ) : result.leads.length === 0 ? (
                    <div className="p-8 text-center text-xs text-os-muted space-y-2 rounded-2xl bg-os-surface-2/40 border border-os-border">
                      <AlertCircle className="h-8 w-8 mx-auto text-os-muted opacity-40" />
                      <p className="font-semibold text-os-fg">
                        Nenhuma oportunidade mapeada
                      </p>
                      <p>
                        Nenhuma empresa correspondente foi encontrada para os
                        filtros selecionados.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-os-fg flex items-center gap-2">
                            <span>Oportunidades Mapeadas</span>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-os-primary/15 text-os-primary font-semibold">
                              {result.leads.length}
                            </span>
                          </h3>
                          <p className="text-xs text-os-muted mt-0.5">
                            {result.searchSummary}
                          </p>
                        </div>

                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={handleImportAll}
                          disabled={isImportingAll}
                          leadingIcon={
                            isImportingAll ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <CheckCircle2 className="h-3.5 w-3.5 text-os-success" />
                            )
                          }
                        >
                          Importar Todos
                        </Button>
                      </div>

                      {/* Candidate Lead Cards */}
                      <div className="space-y-3.5">
                        {result.leads.map((lead, idx) => {
                          const isImported = importedIds.has(lead.id);

                          return (
                            <div
                              key={
                                lead.id ? `lead-${lead.id}` : `lead-idx-${idx}`
                              }
                              className="p-5 rounded-2xl bg-os-surface border border-os-border shadow-sm hover:border-os-primary/40 transition-all space-y-3.5"
                            >
                              {/* Card Top */}
                              <div className="flex items-start justify-between gap-3">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="text-sm font-bold text-os-fg">
                                      {lead.tradeName || lead.companyName}
                                    </h4>
                                    {lead.tradeName && (
                                      <span className="text-xs text-os-muted">
                                        ({lead.companyName})
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-3 text-xs text-os-muted flex-wrap">
                                    <span className="flex items-center gap-1">
                                      <Building2 className="h-3.5 w-3.5 text-os-primary" />
                                      {lead.segment}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <MapPin className="h-3.5 w-3.5 text-os-muted" />
                                      {lead.cityState}
                                    </span>
                                  </div>
                                </div>

                                {/* Fit Score Badge */}
                                <div className="flex flex-col items-end gap-1 shrink-0">
                                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-os-success/15 text-os-success flex items-center gap-1">
                                    <Flame className="h-3.5 w-3.5 fill-os-success text-os-success" />
                                    {lead.fitScore}% Match
                                  </span>
                                  <span className="text-[11px] font-bold text-os-fg">
                                    {formatCurrency(lead.estimatedBudget)}
                                  </span>
                                </div>
                              </div>

                              {/* Opportunity description */}
                              <div className="p-3 rounded-xl bg-os-surface-2/50 border border-os-border/60 text-xs text-os-fg space-y-1">
                                <div className="font-semibold text-os-primary flex items-center gap-1.5">
                                  <Lightbulb className="h-3.5 w-3.5" />
                                  Oportunidade Mapeada
                                </div>
                                <p>{lead.projectOpportunity}</p>
                              </div>

                              {/* Pain & Pitch */}
                              <div className="space-y-2 text-xs">
                                <div className="flex items-start gap-2 text-os-muted">
                                  <AlertCircle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                                  <div>
                                    <strong className="text-amber-500 font-medium">
                                      Dor identificada:
                                    </strong>{" "}
                                    <span className="text-os-fg/90">
                                      {lead.detectedPain}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-start gap-2 text-os-muted">
                                  <ArrowRight className="h-3.5 w-3.5 text-os-primary shrink-0 mt-0.5" />
                                  <div>
                                    <strong className="text-os-primary font-medium">
                                      Pitch de abordagem:
                                    </strong>{" "}
                                    <span className="text-os-fg/90">
                                      {lead.recommendedPitch}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Triggers Tags */}
                              {lead.triggers && lead.triggers.length > 0 && (
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  {lead.triggers.map((trig, i) => (
                                    <span
                                      key={`trig-${lead.id || "lead"}-${i}-${trig}`}
                                      className="px-2 py-0.5 rounded-md text-[10px] bg-os-surface-2 text-os-muted border border-os-border"
                                    >
                                      {trig}
                                    </span>
                                  ))}
                                </div>
                              )}

                              {/* Card Footer Actions */}
                              <div className="pt-2 border-t border-os-border/60 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3 text-xs text-os-muted">
                                  {lead.contactPhone && (
                                    <span className="flex items-center gap-1">
                                      <Phone className="h-3 w-3" />
                                      {lead.contactPhone}
                                    </span>
                                  )}
                                  {lead.contactEmail && (
                                    <span className="flex items-center gap-1">
                                      <Mail className="h-3 w-3" />
                                      {lead.contactEmail}
                                    </span>
                                  )}
                                  {lead.website && (
                                    <a
                                      href={lead.website}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-os-primary hover:underline flex items-center gap-0.5"
                                    >
                                      Web
                                      <ExternalLink className="h-3 w-3" />
                                    </a>
                                  )}
                                </div>

                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => handleDraftProposal(lead)}
                                    disabled={
                                      generatingProposalLeadId === lead.id
                                    }
                                    className="border-os-primary/30 text-os-primary hover:bg-os-primary/10 shadow-xs"
                                    leadingIcon={
                                      generatingProposalLeadId === lead.id ? (
                                        <Loader2 className="h-3.5 w-3.5 animate-spin text-os-primary" />
                                      ) : (
                                        <Sparkles className="h-3.5 w-3.5 text-os-primary" />
                                      )
                                    }
                                  >
                                    {generatingProposalLeadId === lead.id
                                      ? "Redigindo..."
                                      : "Proposta IA"}
                                  </Button>
                                  <Button
                                    variant={
                                      isImported ? "secondary" : "primary"
                                    }
                                    size="sm"
                                    onClick={() => handleImportLead(lead)}
                                    disabled={isImported}
                                    leadingIcon={
                                      isImported ? (
                                        <CheckCircle2 className="h-3.5 w-3.5 text-os-success" />
                                      ) : (
                                        <Plus className="h-3.5 w-3.5" />
                                      )
                                    }
                                  >
                                    {isImported ? "No Funil" : "Importar Lead"}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Initial Empty State before first scan */}
              {!isScanning && !result && (
                <div className="p-10 rounded-2xl bg-os-surface-2/30 border border-dashed border-os-border text-center space-y-3">
                  <div className="h-12 w-12 rounded-2xl bg-os-primary/10 text-os-primary mx-auto flex items-center justify-center">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h4 className="text-sm font-semibold text-os-fg">
                    Pronto para prospectar oportunidades
                  </h4>
                  <p className="text-xs text-os-muted max-w-sm mx-auto">
                    Selecione o nicho de mercado e a região desejada acima e
                    clique em <strong>&quot;Executar Radar IA&quot;</strong>{" "}
                    para varrer empresas com alto potencial de contratação.
                  </p>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-os-border bg-os-surface-2/30 flex items-center justify-between text-xs text-os-muted">
              <span>FZ Build Solutions · Agente Autônomo de Vendas</span>
              <Button variant="ghost" size="sm" onClick={onClose}>
                Fechar
              </Button>
            </div>
          </motion.div>
        </div>
      )}
      {/* Compose & Proposal Modal */}
      <ComposeEmailModal
        isOpen={!!proposalModalData}
        onClose={() => setProposalModalData(null)}
        initialData={proposalModalData}
      />
    </AnimatePresence>
  );
}
