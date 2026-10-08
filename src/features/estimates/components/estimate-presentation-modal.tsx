"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Printer,
  Copy,
  Check,
  FolderKanban,
  Eye,
  EyeOff,
  Clock,
  CheckCircle2,
  Shield,
  Layers,
  Phone,
  Mail,
  Building,
} from "lucide-react";
import {
  type SoftwareEstimate,
  PLATFORM_LABELS,
  COMPLEXITY_LABELS,
  ESTIMATE_STATUS_META,
} from "../types";
import { useConvertEstimateToProject } from "../api/use-estimates";
import { Button } from "@/components/os/button";
import { StatusBadge } from "@/components/os/status-badge";
import { toast } from "sonner";

interface EstimatePresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  estimate: SoftwareEstimate | null;
  onEdit?: () => void;
}

export function EstimatePresentationModal({
  isOpen,
  onClose,
  estimate,
  onEdit,
}: EstimatePresentationModalProps) {
  const [isInternalView, setIsInternalView] = useState(false);
  const [copied, setCopied] = useState(false);
  const convertToProject = useConvertEstimateToProject();

  if (!estimate) return null;

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    try {
      const parts = dateStr.split("-");
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      return new Date(dateStr).toLocaleDateString("pt-BR");
    } catch {
      return dateStr;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const text = `*PROPOSTA COMERCIAL — FZ BUILD SOLUTIONS*
📋 *Projeto:* ${estimate.title}
📄 *Código:* ${estimate.proposalNumber}
👤 *Cliente:* ${estimate.clientName}${estimate.clientCompany ? ` (${estimate.clientCompany})` : ""}
⏱️ *Prazo Estimado:* ${estimate.deliveryWeeks} semanas (${estimate.sprintsCount} sprints quinzenais)
🖥️ *Escopo:* ${estimate.modules.length} módulos e ${estimate.modules.reduce((a, b) => a + (Number(b.screensCount) || 0), 0)} telas abrangidas
💰 *Investimento Total:* ${formatCurrency(estimate.totalPrice)}
💳 *Condições de Pagamento:* ${estimate.paymentTerms}
🛡️ *Garantia:* ${estimate.warrantyDays} dias pós-entrega contra bugs
📅 *Validade da Proposta:* ${formatDate(estimate.validUntil)}

Mais detalhes ou formalização:
contato@fzbuild.solutions | https://fzbuild.solutions`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Resumo comercial copiado para a área de transferência!");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleConvertToProject = async () => {
    try {
      await convertToProject.mutateAsync(estimate);
      toast.success(
        `Projeto "${estimate.title}" criado com sucesso no Kanban com budget de ${formatCurrency(estimate.totalPrice)}!`,
      );
      onClose();
    } catch (err) {
      console.error("[ConvertToProject Error]:", err);
      toast.error("Erro ao converter em projeto.");
    }
  };

  const totalScreens = estimate.modules.reduce(
    (acc, m) => acc + (Number(m.screensCount) || 0),
    0,
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-2 sm:p-6 overflow-y-auto print:p-0 print:m-0 print:static">
          {/* Backdrop (hidden in print) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-md print:hidden"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 15 }}
            className="relative w-full max-w-4xl bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] z-10 print:max-h-none print:shadow-none print:rounded-none print:w-full print:max-w-none print:static border border-slate-200 print:border-none"
          >
            {/* Action Bar (Top Controls - Hidden in print) */}
            <div className="p-4 sm:px-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-3 print:hidden">
              <div className="flex items-center gap-2">
                <StatusBadge tone={ESTIMATE_STATUS_META[estimate.status].tone}>
                  {ESTIMATE_STATUS_META[estimate.status].label}
                </StatusBadge>
                <span className="font-mono text-xs font-bold text-slate-500">
                  {estimate.proposalNumber}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Toggle Internal / Client View */}
                <button
                  type="button"
                  onClick={() => setIsInternalView(!isInternalView)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                    isInternalView
                      ? "bg-amber-100 text-amber-900 border-amber-300"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                  title="Alternar entre visualização com margens de lucro internas ou apresentação limpa para o cliente"
                >
                  {isInternalView ? (
                    <>
                      <Eye className="h-3.5 w-3.5 text-amber-700" />
                      <span>Visão Interna Ativa (Com Custos)</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-3.5 w-3.5 text-slate-400" />
                      <span>Visão Cliente (Oficial)</span>
                    </>
                  )}
                </button>

                {/* Copy summary for WhatsApp */}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCopySummary}
                  leadingIcon={
                    copied ? (
                      <Check className="h-3.5 w-3.5 text-green-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )
                  }
                >
                  {copied ? "Copiado!" : "Copiar Resumo"}
                </Button>

                {/* Print / Export to PDF */}
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handlePrint}
                  leadingIcon={<Printer className="h-3.5 w-3.5" />}
                >
                  Imprimir / Salvar PDF
                </Button>

                {/* Close */}
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors ml-1"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Printable Document Area */}
            <div
              id="printable-proposal-document"
              className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8 print:p-8 print:overflow-visible print:space-y-6 font-sans text-slate-800"
            >
              {/* DOCUMENT HEADER */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b-2 border-slate-900">
                <div className="flex items-center gap-4">
                  <Image
                    src="/fzbuildsemfundo.png"
                    alt="FZ Build Solutions"
                    width={70}
                    height={70}
                    className="h-16 w-auto object-contain"
                  />
                  <div>
                    <h1 className="text-xl font-bold font-heading text-slate-950 tracking-tight">
                      FZ BUILD SOLUTIONS
                    </h1>
                    <p className="text-xs font-semibold text-[#003d9b] uppercase tracking-wider">
                      Fábrica de Software & Soluções Digitais sob Medida
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      fzbuild.solutions@gmail.com • https://fzbuild.solutions
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right space-y-1">
                  <div className="inline-block bg-slate-100 px-3 py-1 rounded-lg text-xs font-mono font-bold text-slate-800 border border-slate-200">
                    {estimate.proposalNumber}
                  </div>
                  <p className="text-xs text-slate-500">
                    Emissão:{" "}
                    <strong className="text-slate-800">
                      {new Date().toLocaleDateString("pt-BR")}
                    </strong>
                  </p>
                  <p className="text-xs text-slate-500">
                    Validade da Proposta:{" "}
                    <strong className="text-slate-800">
                      {formatDate(estimate.validUntil)}
                    </strong>
                  </p>
                </div>
              </div>

              {/* CLIENT & PROJECT IDENTITY CARD */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider">
                    DESTINATÁRIO / CLIENTE
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    {estimate.clientName}
                  </h3>
                  {estimate.clientCompany && (
                    <p className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                      <Building className="h-3.5 w-3.5 text-slate-400" />
                      {estimate.clientCompany}
                    </p>
                  )}
                  {estimate.clientEmail && (
                    <p className="text-xs text-slate-600 flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-slate-400" />
                      {estimate.clientEmail}
                    </p>
                  )}
                  {estimate.clientPhone && (
                    <p className="text-xs text-slate-600 flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      {estimate.clientPhone}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5 border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-4">
                  <span className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider">
                    PROJETO CONTRATADO
                  </span>
                  <h3 className="text-base font-bold text-[#003d9b]">
                    {estimate.title}
                  </h3>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {estimate.platforms.map((p) => (
                      <span
                        key={p}
                        className="px-2 py-0.5 rounded-md bg-blue-50 text-[#003d9b] border border-blue-200 text-[10px] font-bold"
                      >
                        {PLATFORM_LABELS[p]}
                      </span>
                    ))}
                  </div>
                  {estimate.architectureSummary && (
                    <p className="text-[11px] text-slate-500 font-mono mt-1 line-clamp-2">
                      Stack: {estimate.architectureSummary}
                    </p>
                  )}
                </div>
              </div>

              {/* INTERNAL VIEW METRICS (ONLY IF IS_INTERNAL_VIEW IS ACTIVE) */}
              {isInternalView && (
                <div className="p-4 rounded-2xl bg-amber-50 border-2 border-dashed border-amber-300 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900 uppercase font-mono flex items-center gap-2">
                      <Shield className="h-4 w-4 text-amber-700" />
                      Painel Interno FZ Build (Confidencial — Não sai no PDF do
                      cliente)
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-mono">
                      Margem Líquida: {estimate.projectedMarginPercent}%
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                    <div className="bg-white p-2.5 rounded-xl border border-amber-200">
                      <span className="text-slate-400 text-[10px] block">
                        Custo Equipe/Hora:
                      </span>
                      <strong className="text-slate-800 text-sm">
                        {formatCurrency(estimate.internalHourlyCost)}/h
                      </strong>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-amber-200">
                      <span className="text-slate-400 text-[10px] block">
                        Custo Interno Total:
                      </span>
                      <strong className="text-red-600 text-sm">
                        {formatCurrency(estimate.totalInternalCost)}
                      </strong>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-amber-200">
                      <span className="text-slate-400 text-[10px] block">
                        Preço de Venda:
                      </span>
                      <strong className="text-[#003d9b] text-sm">
                        {formatCurrency(estimate.totalPrice)}
                      </strong>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-amber-200">
                      <span className="text-slate-400 text-[10px] block">
                        Lucro Projetado:
                      </span>
                      <strong className="text-green-600 text-sm">
                        {formatCurrency(estimate.projectedProfit)}
                      </strong>
                    </div>
                  </div>
                </div>
              )}

              {/* 1. ESCOPO FUNCIONAL & MÓDULOS */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#003d9b]" />
                    1. Escopo Funcional & Módulos do Sistema
                  </h3>
                  <span className="text-xs font-mono text-slate-500 font-semibold">
                    {estimate.modules.length} módulos • {totalScreens} telas
                  </span>
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100/90 text-slate-600 font-bold border-b border-slate-200">
                        <th className="py-2.5 px-4 w-12 text-center">#</th>
                        <th className="py-2.5 px-4">MÓDULO & ENTREGÁVEIS</th>
                        <th className="py-2.5 px-4 w-24 text-center">TELAS</th>
                        <th className="py-2.5 px-4 w-28 text-center">
                          COMPLEXIDADE
                        </th>
                        <th className="py-2.5 px-4 w-24 text-right">HORAS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {estimate.modules.map((m, idx) => (
                        <tr key={m.id} className="hover:bg-slate-50/60">
                          <td className="py-3 px-4 text-center font-mono text-slate-400 font-bold">
                            {idx + 1}
                          </td>
                          <td className="py-3 px-4">
                            <h4 className="font-bold text-slate-900 text-xs">
                              {m.name}
                            </h4>
                            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                              {m.description}
                            </p>
                          </td>
                          <td className="py-3 px-4 text-center font-mono font-semibold text-slate-700">
                            {m.screensCount}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                              {COMPLEXITY_LABELS[m.complexity]}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-slate-800">
                            {m.hoursEstimated}h
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 2. COMPOSIÇÃO DE ENGENHARIA DE SOFTWARE */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#003d9b]" />
                    2. Composição de Esforço Técnico Especializado
                  </h3>
                  <span className="text-xs font-mono text-slate-500 font-bold">
                    Total: {estimate.totalHours} Horas Faturáveis
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-center">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">
                      UI/UX Design
                    </span>
                    <strong className="text-base font-mono text-slate-900 block mt-0.5">
                      {estimate.hoursBreakdown.uiUxDesign}h
                    </strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">
                      Frontend Web/App
                    </span>
                    <strong className="text-base font-mono text-slate-900 block mt-0.5">
                      {estimate.hoursBreakdown.frontend}h
                    </strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">
                      Backend & APIs
                    </span>
                    <strong className="text-base font-mono text-slate-900 block mt-0.5">
                      {estimate.hoursBreakdown.backend}h
                    </strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">
                      Integrações
                    </span>
                    <strong className="text-base font-mono text-slate-900 block mt-0.5">
                      {estimate.hoursBreakdown.integrations}h
                    </strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">
                      QA & Homologação
                    </span>
                    <strong className="text-base font-mono text-slate-900 block mt-0.5">
                      {estimate.hoursBreakdown.qaTesting}h
                    </strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">
                      Deploy & Cloud
                    </span>
                    <strong className="text-base font-mono text-slate-900 block mt-0.5">
                      {estimate.hoursBreakdown.devopsDeploy}h
                    </strong>
                  </div>
                </div>
              </div>

              {/* 3. CRONOGRAMA & METODOLOGIA ÁGIL */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#003d9b]" />
                    3. Metodologia de Desenvolvimento & Prazo
                  </h3>
                  <span className="text-xs font-mono text-slate-500 font-bold">
                    {estimate.deliveryWeeks} semanas ({estimate.sprintsCount}{" "}
                    sprints)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <strong className="text-slate-900 font-bold flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-[#003d9b]" />
                      Fase 1: Descoberta & UI/UX
                    </strong>
                    <p className="text-slate-500 leading-relaxed text-[11px]">
                      Alinhamento arquitetural, definição do design system e
                      aprovação do protótipo navegável em alta fidelidade.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <strong className="text-slate-900 font-bold flex items-center gap-1.5">
                      <Layers className="h-4 w-4 text-[#003d9b]" />
                      Fase 2: Sprints de Construção
                    </strong>
                    <p className="text-slate-500 leading-relaxed text-[11px]">
                      Desenvolvimento iterativo frontend e backend com entregas
                      incrementais testáveis a cada 15 dias.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <strong className="text-slate-900 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Fase 3: Homologação & Go-Live
                    </strong>
                    <p className="text-slate-500 leading-relaxed text-[11px]">
                      Validação assistida com o cliente, testes de segurança,
                      deploy em nuvem e início da garantia técnica.
                    </p>
                  </div>
                </div>
              </div>

              {/* 4. INVESTIMENTO & CONDIÇÕES COMERCIAIS */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#003d9b]" />
                    4. Investimento Total & Condições de Pagamento
                  </h3>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0B1021] text-white shadow-lg space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <span className="text-xs uppercase font-mono tracking-widest text-slate-400">
                        Investimento Global Turnkey
                      </span>
                      <h2 className="text-3xl font-extrabold font-mono text-white mt-1">
                        {formatCurrency(estimate.totalPrice)}
                      </h2>
                      {estimate.discount > 0 && (
                        <p className="text-xs text-green-400 font-medium mt-0.5">
                          Desconto comercial de{" "}
                          {formatCurrency(estimate.discount)} já aplicado.
                        </p>
                      )}
                    </div>

                    <div className="bg-white/10 px-4 py-2.5 rounded-xl border border-white/15 text-xs text-right">
                      <span className="text-slate-300 block text-[11px]">
                        Garantia Técnica
                      </span>
                      <strong className="text-white text-sm">
                        {estimate.warrantyDays} Dias Inclusos
                      </strong>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 text-xs text-slate-300 space-y-1">
                    <span className="font-bold text-white uppercase text-[11px] block">
                      Forma de Pagamento Acordada:
                    </span>
                    <p className="leading-relaxed">{estimate.paymentTerms}</p>
                  </div>
                </div>
              </div>

              {/* 5. PREMISSAS, GARANTIA & OUT OF SCOPE */}
              <div className="space-y-3 pt-2 text-xs text-slate-600">
                <div className="border-b border-slate-200 pb-1 font-bold uppercase text-slate-900 text-xs">
                  5. Premissas, Direitos Autorais e Garantia
                </div>
                <div className="space-y-2 leading-relaxed text-[11px]">
                  <p>
                    • <strong>Propriedade Intelectual:</strong> Todo o
                    código-fonte, banco de dados e direitos autorais pertencem
                    integralmente ao cliente após quitação do projeto.
                  </p>
                  <p>
                    • <strong>Garantia de 90 Dias:</strong> Cobertura irrestrita
                    de correções de bugs funcionais sem nenhum custo adicional.
                  </p>
                  {estimate.outOfScope && (
                    <p>
                      • <strong>Limites de Escopo:</strong>{" "}
                      {estimate.outOfScope}
                    </p>
                  )}
                </div>
              </div>

              {/* SIGNATURES BLOCK */}
              <div className="pt-10 grid grid-cols-2 gap-8 text-center text-xs">
                <div className="space-y-2">
                  <div className="w-48 mx-auto border-b border-slate-400" />
                  <p className="font-bold text-slate-900">FZ Build Solutions</p>
                  <p className="text-[11px] text-slate-500">
                    Engenharia de Software
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="w-48 mx-auto border-b border-slate-400" />
                  <p className="font-bold text-slate-900">
                    {estimate.clientName}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {estimate.clientCompany || "Contratante"}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Modal Actions (Hidden in print) */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between print:hidden">
              <div className="flex items-center gap-2">
                {onEdit && (
                  <Button variant="ghost" size="sm" onClick={onEdit}>
                    Editar Orçamento
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {estimate.status !== "approved" && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleConvertToProject}
                    disabled={convertToProject.isPending}
                    leadingIcon={<FolderKanban className="h-4 w-4" />}
                  >
                    Aprovar & Converter em Projeto
                  </Button>
                )}
                <Button variant="secondary" size="sm" onClick={onClose}>
                  Fechar
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
