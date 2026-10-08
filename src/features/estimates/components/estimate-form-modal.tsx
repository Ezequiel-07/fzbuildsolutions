"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Loader2,
  Sparkles,
  Plus,
  Trash2,
  Layers,
  Clock,
  DollarSign,
  Calendar,
  User,
  Monitor,
} from "lucide-react";
import { useClients } from "@/features/clients/api/use-clients";
import { useCreateEstimate, useUpdateEstimate } from "../api/use-estimates";
import { ESTIMATE_PRESETS } from "../constants/presets";
import {
  type SoftwareEstimate,
  type SoftwarePlatform,
  type SoftwareModule,
  type HourBreakdown,
  type ComplexityLevel,
  PLATFORM_LABELS,
} from "../types";
import { Button } from "@/components/os/button";
import { toast } from "sonner";

interface EstimateFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  estimateToEdit?: SoftwareEstimate | null;
  defaultClientId?: string;
}

type TabKey = "client" | "scope" | "hours_cost" | "terms";

export function EstimateFormModal({
  isOpen,
  onClose,
  estimateToEdit,
  defaultClientId,
}: EstimateFormModalProps) {
  const { data: clients = [] } = useClients();
  const createEstimate = useCreateEstimate();
  const updateEstimate = useUpdateEstimate();

  const [activeTab, setActiveTab] = useState<TabKey>("client");

  // Form states
  const [proposalNumber, setProposalNumber] = useState("");
  const [title, setTitle] = useState("");
  const [clientId, setClientId] = useState(defaultClientId || "");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientCompany, setClientCompany] = useState("");
  const [platforms, setPlatforms] = useState<SoftwarePlatform[]>([
    "web_saas",
    "backend_api",
  ]);
  const [architectureSummary, setArchitectureSummary] = useState(
    "Next.js 15, React 19, TypeScript, Tailwind CSS, Firebase / PostgreSQL, Cloud Architecture",
  );

  // Modules & scope
  const [modules, setModules] = useState<SoftwareModule[]>([
    {
      id: "mod-1",
      name: "Autenticação & Controle de Acesso",
      description: "Login seguro, recuperação de senha e perfis de permissão.",
      screensCount: 3,
      complexity: "medium",
      hoursEstimated: 24,
    },
    {
      id: "mod-2",
      name: "Painel Principal & Dashboard Operacional",
      description:
        "Visualização de métricas, cards informativos e ações rápidas.",
      screensCount: 2,
      complexity: "medium",
      hoursEstimated: 28,
    },
    {
      id: "mod-3",
      name: "Módulo de Gestão & Cadastros (CRUD)",
      description:
        "Listagem com filtros avançados, formulários de criação e edição.",
      screensCount: 4,
      complexity: "high",
      hoursEstimated: 40,
    },
  ]);

  // Hours breakdown
  const [hoursBreakdown, setHoursBreakdown] = useState<HourBreakdown>({
    uiUxDesign: 20,
    frontend: 40,
    backend: 32,
    integrations: 12,
    qaTesting: 16,
    devopsDeploy: 12,
  });

  // Financial rates & costs
  const [hourlyRate, setHourlyRate] = useState<number>(120);
  const [internalHourlyCost, setInternalHourlyCost] = useState<number>(55);
  const [contingencyPercent, setContingencyPercent] = useState<number>(15);
  const [cloudInfrastructureMonthly, setCloudInfrastructureMonthly] =
    useState<number>(150);
  const [discount, setDiscount] = useState<number>(0);

  // Terms & Delivery
  const [deliveryWeeks, setDeliveryWeeks] = useState<number>(6);
  const [sprintsCount, setSprintsCount] = useState<number>(3);
  const [methodology, setMethodology] = useState<
    "scrum_agile" | "kanban_continuous" | "turnkey_milestones"
  >("scrum_agile");
  const [paymentTerms, setPaymentTerms] = useState(
    "40% de Entrada na Assinatura + 30% na Homologação do MVP + 30% na Entrega Final e Go-Live",
  );
  const [warrantyDays, setWarrantyDays] = useState<number>(90);
  const [outOfScope, setOutOfScope] = useState(
    "Custos diretos de infraestrutura de nuvem contratados pelo cliente (GCP/AWS), taxas de publicação em lojas de aplicativos e campanhas de marketing.",
  );
  const [notes, setNotes] = useState(
    "Proposta elaborada com metodologia de desenvolvimento ágil FZ Build Solutions.",
  );
  const [validUntil, setValidUntil] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 20);
    return d.toISOString().split("T")[0];
  });
  const [status, setStatus] = useState<SoftwareEstimate["status"]>("draft");

  // Sync with selected existing client
  useEffect(() => {
    if (clientId) {
      const found = clients.find((c) => c.id === clientId);
      if (found) {
        setClientName(found.name);
        setClientEmail(found.email || "");
        setClientPhone(found.phone || "");
        setClientCompany(found.corporateName || found.name);
      }
    }
  }, [clientId, clients]);

  // Populate if editing
  useEffect(() => {
    if (estimateToEdit) {
      setProposalNumber(estimateToEdit.proposalNumber);
      setTitle(estimateToEdit.title);
      setClientId(estimateToEdit.clientId || "");
      setClientName(estimateToEdit.clientName);
      setClientEmail(estimateToEdit.clientEmail || "");
      setClientPhone(estimateToEdit.clientPhone || "");
      setClientCompany(estimateToEdit.clientCompany || "");
      setPlatforms(estimateToEdit.platforms);
      setArchitectureSummary(estimateToEdit.architectureSummary || "");
      setModules(estimateToEdit.modules || []);
      setHoursBreakdown(estimateToEdit.hoursBreakdown);
      setHourlyRate(estimateToEdit.hourlyRate);
      setInternalHourlyCost(estimateToEdit.internalHourlyCost);
      setContingencyPercent(estimateToEdit.contingencyPercent);
      setCloudInfrastructureMonthly(
        estimateToEdit.cloudInfrastructureMonthly || 0,
      );
      setDiscount(estimateToEdit.discount || 0);
      setDeliveryWeeks(estimateToEdit.deliveryWeeks);
      setSprintsCount(estimateToEdit.sprintsCount);
      setMethodology(estimateToEdit.methodology);
      setPaymentTerms(estimateToEdit.paymentTerms);
      setWarrantyDays(estimateToEdit.warrantyDays);
      setOutOfScope(estimateToEdit.outOfScope || "");
      setNotes(estimateToEdit.notes || "");
      setValidUntil(estimateToEdit.validUntil);
      setStatus(estimateToEdit.status);
    } else {
      // Generate clean new proposal number
      const randomSeq = Math.floor(100 + Math.random() * 900);
      const year = new Date().getFullYear();
      setProposalNumber(`FZ-PROP-${year}-${randomSeq}`);
    }
  }, [estimateToEdit]);

  // Computed totals
  const totalScreens = useMemo(() => {
    return modules.reduce((acc, m) => acc + (Number(m.screensCount) || 0), 0);
  }, [modules]);

  const totalModuleHours = useMemo(() => {
    return modules.reduce((acc, m) => acc + (Number(m.hoursEstimated) || 0), 0);
  }, [modules]);

  const totalDisciplinesHours = useMemo(() => {
    return Object.values(hoursBreakdown).reduce(
      (acc, h) => acc + (Number(h) || 0),
      0,
    );
  }, [hoursBreakdown]);

  // Total Hours with contingency
  const totalHours = totalDisciplinesHours;
  const contingencyHours = Math.round(totalHours * (contingencyPercent / 100));
  const effectiveBillableHours = totalHours + contingencyHours;

  // Financial calculations
  const rawDevelopmentPrice = effectiveBillableHours * hourlyRate;
  const totalPrice = Math.max(0, rawDevelopmentPrice - discount);

  const totalInternalCost =
    effectiveBillableHours * internalHourlyCost +
    cloudInfrastructureMonthly * (deliveryWeeks / 4);

  const projectedProfit = totalPrice - totalInternalCost;
  const projectedMarginPercent =
    totalPrice > 0 ? Math.round((projectedProfit / totalPrice) * 100) : 0;

  const handleApplyPreset = (presetId: string) => {
    const preset = ESTIMATE_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    setTitle(preset.name);
    setPlatforms(preset.platforms);
    setArchitectureSummary(preset.architectureSummary);
    setModules(
      preset.modules.map((m, idx) => ({
        ...m,
        id: `mod-${Date.now()}-${idx}`,
      })),
    );
    setHoursBreakdown(preset.hoursBreakdown);
    setDeliveryWeeks(preset.deliveryWeeks);
    setSprintsCount(preset.sprintsCount);
    setPaymentTerms(preset.paymentTerms);
    setWarrantyDays(preset.warrantyDays);
    setOutOfScope(preset.outOfScope);
    toast.success(`Preset "${preset.name}" aplicado com sucesso!`);
  };

  const handleAddModule = () => {
    const newId = `mod-${Date.now()}`;
    setModules((prev) => [
      ...prev,
      {
        id: newId,
        name: "Novo Módulo Funcional",
        description: "Descrição detalhada dos fluxos e comportamentos.",
        screensCount: 1,
        complexity: "medium",
        hoursEstimated: 16,
      },
    ]);
  };

  const handleRemoveModule = (id: string) => {
    if (modules.length <= 1) {
      toast.error("O orçamento precisa de pelo menos 1 módulo.");
      return;
    }
    setModules((prev) => prev.filter((m) => m.id !== id));
  };

  const handleUpdateModule = (
    id: string,
    field: keyof SoftwareModule,
    val: string | number,
  ) => {
    setModules((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: val } : m)),
    );
  };

  const togglePlatform = (p: SoftwarePlatform) => {
    setPlatforms((prev) =>
      prev.includes(p) ? prev.filter((item) => item !== p) : [...prev, p],
    );
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Informe o título do projeto.");
      setActiveTab("client");
      return;
    }
    if (!clientName.trim()) {
      toast.error("Informe o nome do cliente.");
      setActiveTab("client");
      return;
    }

    try {
      const payload = {
        proposalNumber,
        title,
        clientName,
        clientEmail,
        clientPhone,
        clientCompany,
        clientId,
        status,
        platforms,
        architectureSummary,
        modules,
        hoursBreakdown,
        totalHours: effectiveBillableHours,
        hourlyRate,
        internalHourlyCost,
        contingencyPercent,
        cloudInfrastructureMonthly,
        discount,
        totalPrice,
        totalInternalCost,
        projectedProfit,
        projectedMarginPercent,
        deliveryWeeks,
        sprintsCount,
        methodology,
        paymentTerms,
        warrantyDays,
        outOfScope,
        notes,
        validUntil,
      };

      if (estimateToEdit?.id) {
        await updateEstimate.mutateAsync({
          id: estimateToEdit.id,
          data: payload,
        });
        toast.success("Orçamento atualizado com sucesso!");
      } else {
        await createEstimate.mutateAsync(payload);
        toast.success("Orçamento de software criado com sucesso!");
      }
      onClose();
    } catch (err) {
      console.error("[EstimateFormModal Error]:", err);
      toast.error("Erro ao salvar orçamento. Tente novamente.");
    }
  };

  const isSubmitting = createEstimate.isPending || updateEstimate.isPending;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            className="relative w-full max-w-5xl bg-os-surface border border-os-border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] z-10"
          >
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-os-border flex items-center justify-between bg-os-surface-2/40">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-os-primary/10 text-os-primary flex items-center justify-center border border-os-primary/20 shadow-sm">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-os-fg">
                      {estimateToEdit
                        ? "Editar Orçamento"
                        : "Novo Orçamento de Software"}
                    </h2>
                    <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-os-surface-2 text-os-muted font-bold border border-os-border">
                      {proposalNumber}
                    </span>
                  </div>
                  <p className="text-xs text-os-muted">
                    Engenharia de software, composição de horas, escopo e
                    proposta executiva
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-os-muted hover:text-os-fg hover:bg-os-surface transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Presets Quick Selector */}
            <div className="px-6 py-2.5 bg-os-surface-2/80 border-b border-os-border flex items-center justify-between gap-4 overflow-x-auto text-xs">
              <span className="text-os-muted font-bold shrink-0 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-os-primary" />
                Templates Rápidos:
              </span>
              <div className="flex items-center gap-2">
                {ESTIMATE_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleApplyPreset(preset.id)}
                    className="px-3 py-1 rounded-lg bg-os-surface border border-os-border hover:border-os-primary/50 text-os-fg hover:text-os-primary transition-all text-xs font-medium whitespace-nowrap shadow-sm hover:shadow active:scale-95"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex border-b border-os-border px-6 bg-os-surface text-xs font-semibold overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab("client")}
                className={`py-3.5 px-4 border-b-2 font-medium flex items-center gap-2 transition-colors whitespace-nowrap ${
                  activeTab === "client"
                    ? "border-os-primary text-os-primary font-bold"
                    : "border-transparent text-os-muted hover:text-os-fg"
                }`}
              >
                <User className="h-4 w-4" />
                <span>1. Cliente & Plataformas</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("scope")}
                className={`py-3.5 px-4 border-b-2 font-medium flex items-center gap-2 transition-colors whitespace-nowrap ${
                  activeTab === "scope"
                    ? "border-os-primary text-os-primary font-bold"
                    : "border-transparent text-os-muted hover:text-os-fg"
                }`}
              >
                <Monitor className="h-4 w-4" />
                <span>2. Escopo & Módulos ({modules.length})</span>
                <span className="px-1.5 py-0.2 rounded-full bg-os-primary/10 text-os-primary text-[10px]">
                  {totalScreens} telas
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("hours_cost")}
                className={`py-3.5 px-4 border-b-2 font-medium flex items-center gap-2 transition-colors whitespace-nowrap ${
                  activeTab === "hours_cost"
                    ? "border-os-primary text-os-primary font-bold"
                    : "border-transparent text-os-muted hover:text-os-fg"
                }`}
              >
                <Clock className="h-4 w-4" />
                <span>3. Horas & Custos Internos</span>
                <span className="px-1.5 py-0.2 rounded-full bg-os-success/10 text-os-success text-[10px]">
                  {projectedMarginPercent}% margem
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("terms")}
                className={`py-3.5 px-4 border-b-2 font-medium flex items-center gap-2 transition-colors whitespace-nowrap ${
                  activeTab === "terms"
                    ? "border-os-primary text-os-primary font-bold"
                    : "border-transparent text-os-muted hover:text-os-fg"
                }`}
              >
                <Calendar className="h-4 w-4" />
                <span>4. Prazos & Condições</span>
              </button>
            </div>

            {/* Form Content */}
            <form
              onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto p-6 space-y-6"
            >
              {/* TAB 1: CLIENT & PLATFORMS */}
              {activeTab === "client" && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-os-fg">
                        Título do Projeto / Sistema *
                      </label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ex: Plataforma Web SaaS e App Mobile EZYX"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-os-border bg-os-surface-2 text-os-fg text-sm outline-none focus:border-os-primary focus:ring-2 focus:ring-os-primary/10 transition-all font-medium"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-os-fg">
                        Vincular a Cliente Existente (Opcional)
                      </label>
                      <select
                        value={clientId}
                        onChange={(e) => setClientId(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-os-border bg-os-surface-2 text-os-fg text-sm outline-none focus:border-os-primary transition-all font-medium"
                      >
                        <option value="">
                          Novo Cliente / Preencher Manualmente
                        </option>
                        {clients.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}{" "}
                            {c.corporateName ? `(${c.corporateName})` : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-os-fg">
                        Nome do Contato / Cliente *
                      </label>
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Ex: Carlos Oliveira"
                        className="w-full px-3 py-2 rounded-xl border border-os-border bg-os-surface-2 text-os-fg text-sm outline-none focus:border-os-primary"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-os-fg">
                        Razão Social / Empresa
                      </label>
                      <input
                        type="text"
                        value={clientCompany}
                        onChange={(e) => setClientCompany(e.target.value)}
                        placeholder="Ex: Adium Farma / Altrea Tech"
                        className="w-full px-3 py-2 rounded-xl border border-os-border bg-os-surface-2 text-os-fg text-sm outline-none focus:border-os-primary"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-os-fg">
                        E-mail de Contato
                      </label>
                      <input
                        type="email"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        placeholder="carlos@empresa.com.br"
                        className="w-full px-3 py-2 rounded-xl border border-os-border bg-os-surface-2 text-os-fg text-sm outline-none focus:border-os-primary"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-os-fg">
                        Telefone / WhatsApp
                      </label>
                      <input
                        type="text"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        placeholder="(11) 99999-9999"
                        className="w-full px-3 py-2 rounded-xl border border-os-border bg-os-surface-2 text-os-fg text-sm outline-none focus:border-os-primary"
                      />
                    </div>
                  </div>

                  {/* Platforms selection */}
                  <div className="space-y-2.5">
                    <label className="text-xs font-bold text-os-fg flex items-center justify-between">
                      <span>Plataformas & Entregáveis Tecnológicos</span>
                      <span className="text-[11px] text-os-muted font-normal">
                        Selecione todas as frentes abrangidas na proposta
                      </span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                      {(Object.keys(PLATFORM_LABELS) as SoftwarePlatform[]).map(
                        (p) => {
                          const isSelected = platforms.includes(p);
                          return (
                            <button
                              key={p}
                              type="button"
                              onClick={() => togglePlatform(p)}
                              className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                                isSelected
                                  ? "bg-os-primary/10 border-os-primary text-os-primary font-bold shadow-sm"
                                  : "bg-os-surface-2/40 border-os-border text-os-muted hover:border-os-primary/40 hover:text-os-fg"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => {}}
                                className="mt-0.5 rounded text-os-primary focus:ring-0"
                              />
                              <span className="text-xs leading-snug">
                                {PLATFORM_LABELS[p]}
                              </span>
                            </button>
                          );
                        },
                      )}
                    </div>
                  </div>

                  {/* Architecture & Tech Stack Summary */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-os-fg">
                      Arquitetura & Stack Recomendada
                    </label>
                    <textarea
                      rows={2}
                      value={architectureSummary}
                      onChange={(e) => setArchitectureSummary(e.target.value)}
                      placeholder="Ex: Next.js 15, React 19, Node.js, PostgreSQL, Google Cloud Run, Tailwind CSS..."
                      className="w-full p-3 rounded-xl border border-os-border bg-os-surface-2 text-os-fg text-xs outline-none focus:border-os-primary font-mono leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: SCOPE & MODULES */}
              {activeTab === "scope" && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-os-fg">
                        Módulos do Sistema & Contagem de Telas
                      </h3>
                      <p className="text-xs text-os-muted">
                        Discrimine cada funcionalidade, quantidade de telas e
                        nível de complexidade
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={handleAddModule}
                      leadingIcon={<Plus className="h-3.5 w-3.5" />}
                    >
                      Adicionar Módulo
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {modules.map((m, idx) => (
                      <div
                        key={m.id}
                        className="p-4 rounded-2xl bg-os-surface-2/40 border border-os-border hover:border-os-primary/30 transition-all space-y-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-xs font-bold font-mono text-os-muted w-6">
                              #{idx + 1}
                            </span>
                            <input
                              type="text"
                              value={m.name}
                              onChange={(e) =>
                                handleUpdateModule(m.id, "name", e.target.value)
                              }
                              placeholder="Nome do Módulo"
                              className="flex-1 px-3 py-1.5 rounded-lg border border-os-border bg-os-surface text-os-fg text-xs font-bold outline-none focus:border-os-primary"
                            />
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5 bg-os-surface px-2.5 py-1 rounded-lg border border-os-border">
                              <span className="text-[11px] text-os-muted font-medium">
                                Telas:
                              </span>
                              <input
                                type="number"
                                min={0}
                                value={m.screensCount}
                                onChange={(e) =>
                                  handleUpdateModule(
                                    m.id,
                                    "screensCount",
                                    Number(e.target.value),
                                  )
                                }
                                className="w-12 text-center text-xs font-bold bg-transparent outline-none text-os-fg"
                              />
                            </div>

                            <div className="flex items-center gap-1.5 bg-os-surface px-2.5 py-1 rounded-lg border border-os-border">
                              <span className="text-[11px] text-os-muted font-medium">
                                Horas:
                              </span>
                              <input
                                type="number"
                                min={1}
                                value={m.hoursEstimated}
                                onChange={(e) =>
                                  handleUpdateModule(
                                    m.id,
                                    "hoursEstimated",
                                    Number(e.target.value),
                                  )
                                }
                                className="w-14 text-center text-xs font-bold bg-transparent outline-none text-os-primary font-mono"
                              />
                            </div>

                            <select
                              value={m.complexity}
                              onChange={(e) =>
                                handleUpdateModule(
                                  m.id,
                                  "complexity",
                                  e.target.value as ComplexityLevel,
                                )
                              }
                              className="text-xs font-bold px-2 py-1.5 rounded-lg border border-os-border bg-os-surface text-os-fg outline-none"
                            >
                              <option value="low">Baixa</option>
                              <option value="medium">Média</option>
                              <option value="high">Alta</option>
                              <option value="critical">Crítica</option>
                            </select>

                            <button
                              type="button"
                              onClick={() => handleRemoveModule(m.id)}
                              className="p-1.5 text-os-muted hover:text-os-danger hover:bg-os-danger/10 rounded-lg transition-colors"
                              title="Remover módulo"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <input
                          type="text"
                          value={m.description}
                          onChange={(e) =>
                            handleUpdateModule(
                              m.id,
                              "description",
                              e.target.value,
                            )
                          }
                          placeholder="Descrição dos requisitos, regras de negócio e integrações desse módulo..."
                          className="w-full px-3 py-1.5 rounded-lg border border-os-border bg-os-surface text-os-fg text-xs outline-none focus:border-os-primary"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl bg-os-surface-2 border border-os-border flex items-center justify-between text-xs font-mono font-semibold">
                    <span className="text-os-muted uppercase">
                      Totalizador do Escopo Técnico:
                    </span>
                    <div className="flex items-center gap-6">
                      <span>
                        Módulos:{" "}
                        <strong className="text-os-fg">{modules.length}</strong>
                      </span>
                      <span>
                        Telas Totais:{" "}
                        <strong className="text-os-fg">{totalScreens}</strong>
                      </span>
                      <span>
                        Horas de Escopo:{" "}
                        <strong className="text-os-primary">
                          {totalModuleHours}h
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: HOURS BREAKDOWN & INTERNAL COSTS */}
              {activeTab === "hours_cost" && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Discipline hours breakdown */}
                  <div>
                    <h3 className="text-sm font-bold text-os-fg mb-1">
                      Composição de Horas por Disciplina (WBS)
                    </h3>
                    <p className="text-xs text-os-muted mb-4">
                      Distribua o esforço da equipe por especialidade técnica
                      para cálculo de prazo e custo
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                      <div className="p-3 rounded-xl bg-os-surface-2 border border-os-border space-y-1">
                        <label className="text-[11px] font-bold text-os-muted block truncate">
                          🎨 UI/UX Design
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={hoursBreakdown.uiUxDesign}
                          onChange={(e) =>
                            setHoursBreakdown((prev) => ({
                              ...prev,
                              uiUxDesign: Number(e.target.value),
                            }))
                          }
                          className="w-full text-center font-mono font-bold text-base bg-os-surface rounded-lg py-1 border border-os-border text-os-fg outline-none focus:border-os-primary"
                        />
                        <span className="text-[10px] text-os-muted block text-center">
                          horas
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-os-surface-2 border border-os-border space-y-1">
                        <label className="text-[11px] font-bold text-os-muted block truncate">
                          💻 Frontend Web/App
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={hoursBreakdown.frontend}
                          onChange={(e) =>
                            setHoursBreakdown((prev) => ({
                              ...prev,
                              frontend: Number(e.target.value),
                            }))
                          }
                          className="w-full text-center font-mono font-bold text-base bg-os-surface rounded-lg py-1 border border-os-border text-os-fg outline-none focus:border-os-primary"
                        />
                        <span className="text-[10px] text-os-muted block text-center">
                          horas
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-os-surface-2 border border-os-border space-y-1">
                        <label className="text-[11px] font-bold text-os-muted block truncate">
                          ⚙️ Backend & DB
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={hoursBreakdown.backend}
                          onChange={(e) =>
                            setHoursBreakdown((prev) => ({
                              ...prev,
                              backend: Number(e.target.value),
                            }))
                          }
                          className="w-full text-center font-mono font-bold text-base bg-os-surface rounded-lg py-1 border border-os-border text-os-fg outline-none focus:border-os-primary"
                        />
                        <span className="text-[10px] text-os-muted block text-center">
                          horas
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-os-surface-2 border border-os-border space-y-1">
                        <label className="text-[11px] font-bold text-os-muted block truncate">
                          🔌 Integrações/APIs
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={hoursBreakdown.integrations}
                          onChange={(e) =>
                            setHoursBreakdown((prev) => ({
                              ...prev,
                              integrations: Number(e.target.value),
                            }))
                          }
                          className="w-full text-center font-mono font-bold text-base bg-os-surface rounded-lg py-1 border border-os-border text-os-fg outline-none focus:border-os-primary"
                        />
                        <span className="text-[10px] text-os-muted block text-center">
                          horas
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-os-surface-2 border border-os-border space-y-1">
                        <label className="text-[11px] font-bold text-os-muted block truncate">
                          🧪 QA & Testes
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={hoursBreakdown.qaTesting}
                          onChange={(e) =>
                            setHoursBreakdown((prev) => ({
                              ...prev,
                              qaTesting: Number(e.target.value),
                            }))
                          }
                          className="w-full text-center font-mono font-bold text-base bg-os-surface rounded-lg py-1 border border-os-border text-os-fg outline-none focus:border-os-primary"
                        />
                        <span className="text-[10px] text-os-muted block text-center">
                          horas
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-os-surface-2 border border-os-border space-y-1">
                        <label className="text-[11px] font-bold text-os-muted block truncate">
                          🚀 DevOps & Deploy
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={hoursBreakdown.devopsDeploy}
                          onChange={(e) =>
                            setHoursBreakdown((prev) => ({
                              ...prev,
                              devopsDeploy: Number(e.target.value),
                            }))
                          }
                          className="w-full text-center font-mono font-bold text-base bg-os-surface rounded-lg py-1 border border-os-border text-os-fg outline-none focus:border-os-primary"
                        />
                        <span className="text-[10px] text-os-muted block text-center">
                          horas
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Financial Configuration */}
                  <div className="p-5 rounded-2xl bg-os-surface border border-os-border shadow-sm space-y-4">
                    <h4 className="text-xs font-bold text-os-fg uppercase tracking-wider flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-os-primary" />
                      Precificação Comercial & Custo de Equipe FZ Build
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-os-fg">
                          Valor/Hora Cobrado (R$)
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={hourlyRate}
                          onChange={(e) =>
                            setHourlyRate(Number(e.target.value))
                          }
                          className="w-full px-3 py-2 rounded-xl border border-os-border bg-os-surface-2 text-os-fg font-mono font-bold text-sm outline-none focus:border-os-primary"
                        />
                        <span className="text-[10px] text-os-muted">
                          Taxa de venda ao cliente
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-os-fg">
                          Custo Interno/Hora (R$)
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={internalHourlyCost}
                          onChange={(e) =>
                            setInternalHourlyCost(Number(e.target.value))
                          }
                          className="w-full px-3 py-2 rounded-xl border border-os-border bg-os-surface-2 text-os-fg font-mono font-bold text-sm outline-none focus:border-os-primary"
                        />
                        <span className="text-[10px] text-os-muted">
                          Custo hora time dev/design
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-os-fg">
                          Margem de Risco / Contingência (%)
                        </label>
                        <input
                          type="number"
                          min={0}
                          max={50}
                          value={contingencyPercent}
                          onChange={(e) =>
                            setContingencyPercent(Number(e.target.value))
                          }
                          className="w-full px-3 py-2 rounded-xl border border-os-border bg-os-surface-2 text-os-fg font-mono font-bold text-sm outline-none focus:border-os-primary"
                        />
                        <span className="text-[10px] text-os-muted">
                          +{contingencyHours}h de buffer técnico
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-os-fg">
                          Desconto Comercial (R$)
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={discount}
                          onChange={(e) => setDiscount(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-os-border bg-os-surface-2 text-os-fg font-mono font-bold text-sm outline-none focus:border-os-primary"
                        />
                        <span className="text-[10px] text-os-muted">
                          Desconto concedido
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Financial KPI Summary Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-4 rounded-2xl bg-os-surface-2 border border-os-border">
                      <span className="text-[10px] uppercase font-mono font-bold text-os-muted">
                        Horas Totais Faturáveis
                      </span>
                      <p className="text-xl font-bold font-mono text-os-fg mt-1">
                        {effectiveBillableHours}h
                      </p>
                      <span className="text-[10px] text-os-muted">
                        {totalHours}h base + {contingencyHours}h contingência
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-os-surface-2 border border-os-border">
                      <span className="text-[10px] uppercase font-mono font-bold text-os-muted">
                        Custo Interno Total
                      </span>
                      <p className="text-xl font-bold font-mono text-os-danger mt-1">
                        {formatCurrency(totalInternalCost)}
                      </p>
                      <span className="text-[10px] text-os-muted">
                        Custo de equipe & cloud
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-os-surface-2 border border-os-border">
                      <span className="text-[10px] uppercase font-mono font-bold text-os-muted">
                        Preço Final Proposta
                      </span>
                      <p className="text-xl font-bold font-mono text-os-primary mt-1">
                        {formatCurrency(totalPrice)}
                      </p>
                      <span className="text-[10px] text-os-muted">
                        Investimento do cliente
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-os-success/10 border border-os-success/20">
                      <span className="text-[10px] uppercase font-mono font-bold text-os-success">
                        Lucro Líquido Projetado
                      </span>
                      <p className="text-xl font-bold font-mono text-os-success mt-1">
                        {formatCurrency(projectedProfit)}
                      </p>
                      <span className="text-[10px] font-bold text-os-success">
                        Margem: {projectedMarginPercent}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: TERMS & TIMELINE */}
              {activeTab === "terms" && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-os-fg">
                        Prazo Total de Entrega (Semanas)
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={deliveryWeeks}
                        onChange={(e) =>
                          setDeliveryWeeks(Number(e.target.value))
                        }
                        className="w-full px-3 py-2 rounded-xl border border-os-border bg-os-surface-2 text-os-fg text-sm font-mono font-bold outline-none focus:border-os-primary"
                      />
                      <span className="text-[10px] text-os-muted">
                        Aproximadamente {deliveryWeeks * 5} dias úteis
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-os-fg">
                        Quantidade de Sprints Quinzenais
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={sprintsCount}
                        onChange={(e) =>
                          setSprintsCount(Number(e.target.value))
                        }
                        className="w-full px-3 py-2 rounded-xl border border-os-border bg-os-surface-2 text-os-fg text-sm font-mono font-bold outline-none focus:border-os-primary"
                      />
                      <span className="text-[10px] text-os-muted">
                        Ciclos de entrega de software
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-os-fg">
                        Garantia Pós-Go Live (Dias)
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={warrantyDays}
                        onChange={(e) =>
                          setWarrantyDays(Number(e.target.value))
                        }
                        className="w-full px-3 py-2 rounded-xl border border-os-border bg-os-surface-2 text-os-fg text-sm font-mono font-bold outline-none focus:border-os-primary"
                      />
                      <span className="text-[10px] text-os-muted">
                        Garantia contra bugs inclusa
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-os-fg">
                      Condições Comerciais & Forma de Pagamento
                    </label>
                    <textarea
                      rows={2}
                      value={paymentTerms}
                      onChange={(e) => setPaymentTerms(e.target.value)}
                      placeholder="Ex: 40% de Entrada + 30% na Sprint 2 + 30% na Entrega Final..."
                      className="w-full p-3 rounded-xl border border-os-border bg-os-surface-2 text-os-fg text-xs outline-none focus:border-os-primary leading-relaxed"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-os-fg">
                      O Que NÃO Está Incluso (Out of Scope)
                    </label>
                    <textarea
                      rows={2}
                      value={outOfScope}
                      onChange={(e) => setOutOfScope(e.target.value)}
                      placeholder="Ex: Servidores diretos, taxas de desenvolvedor Apple, campanhas de tráfego..."
                      className="w-full p-3 rounded-xl border border-os-border bg-os-surface-2 text-os-fg text-xs outline-none focus:border-os-primary leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-os-fg">
                        Validade da Proposta Comercial
                      </label>
                      <input
                        type="date"
                        value={validUntil}
                        onChange={(e) => setValidUntil(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-os-border bg-os-surface-2 text-os-fg text-sm outline-none focus:border-os-primary"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-os-fg">
                        Status do Orçamento
                      </label>
                      <select
                        value={status}
                        onChange={(e) =>
                          setStatus(
                            e.target.value as SoftwareEstimate["status"],
                          )
                        }
                        className="w-full px-3 py-2 rounded-xl border border-os-border bg-os-surface-2 text-os-fg text-sm font-bold outline-none"
                      >
                        <option value="draft">Rascunho (Interno)</option>
                        <option value="in_review">Em Revisão Técnica</option>
                        <option value="sent">Enviado ao Cliente</option>
                        <option value="approved">
                          Aprovado (Pronto para Iniciar)
                        </option>
                        <option value="rejected">Recusado</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer Actions */}
              <div className="pt-4 border-t border-os-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-os-muted">
                    Total:{" "}
                    <strong className="text-os-fg text-sm">
                      {formatCurrency(totalPrice)}
                    </strong>{" "}
                    ({effectiveBillableHours}h)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={onClose}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                    leadingIcon={
                      isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : undefined
                    }
                  >
                    {estimateToEdit ? "Salvar Alterações" : "Salvar Orçamento"}
                  </Button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
