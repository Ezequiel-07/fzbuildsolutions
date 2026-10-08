"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/os/button";
import { useSendEmail, useGenerateAiProposal } from "../api/use-gmail";
import { toast } from "sonner";

export interface ComposeInitialData {
  to?: string;
  subject?: string;
  bodyHtml?: string;
  inReplyTo?: string;
  leadContext?: {
    companyName: string;
    tradeName?: string;
    contactEmail?: string;
    segment?: string;
    cityState?: string;
    detectedPain?: string;
    projectOpportunity?: string;
    estimatedBudget?: number;
    recommendedPitch?: string;
  };
}

interface ComposeEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ComposeInitialData | null;
}

export function ComposeEmailModal({
  isOpen,
  onClose,
  initialData,
}: ComposeEmailModalProps) {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [bodyHtml, setBodyHtml] = useState("");
  const [showAiAssistant, setShowAiAssistant] = useState(false);

  // AI mini-form parameters
  const [aiCompany, setAiCompany] = useState("");
  const [aiPain, setAiPain] = useState("");
  const [aiOpportunity, setAiOpportunity] = useState("");
  const [aiBudget, setAiBudget] = useState("");

  const sendEmail = useSendEmail();
  const generateProposal = useGenerateAiProposal();

  useEffect(() => {
    if (initialData) {
      setTo(initialData.to || initialData.leadContext?.contactEmail || "");
      setSubject(initialData.subject || "");
      setBodyHtml(initialData.bodyHtml || "");

      if (initialData.leadContext) {
        setAiCompany(
          initialData.leadContext.tradeName ||
            initialData.leadContext.companyName ||
            "",
        );
        setAiPain(initialData.leadContext.detectedPain || "");
        setAiOpportunity(initialData.leadContext.projectOpportunity || "");
        setAiBudget(
          initialData.leadContext.estimatedBudget
            ? String(initialData.leadContext.estimatedBudget)
            : "",
        );
      }
    } else {
      setTo("");
      setSubject("");
      setBodyHtml("");
      setAiCompany("");
      setAiPain("");
      setAiOpportunity("");
      setAiBudget("");
    }
  }, [initialData, isOpen]);

  const handleGenerateAi = async () => {
    if (!aiCompany.trim()) {
      toast.error("Informe o nome da empresa para a IA gerar a proposta.");
      return;
    }

    try {
      const res = await generateProposal.mutateAsync({
        companyName: aiCompany,
        contactEmail: to,
        detectedPain: aiPain,
        projectOpportunity: aiOpportunity,
        estimatedBudget: aiBudget ? parseFloat(aiBudget) : undefined,
      });

      setSubject(res.subject);
      setBodyHtml(res.bodyHtml);
      setShowAiAssistant(false);
      toast.success("Proposta comercial redigida com sucesso pela IA!");
    } catch {
      toast.error("Falha ao gerar proposta com a IA.");
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!to || !subject || !bodyHtml) {
      toast.error("Preencha destinatário, assunto e mensagem.");
      return;
    }

    const sanitizedHtml =
      bodyHtml.includes("<p>") ||
      bodyHtml.includes("<div>") ||
      bodyHtml.includes("<br")
        ? bodyHtml
        : bodyHtml
            .split("\n\n")
            .map((par) => `<p>${par.replace(/\n/g, "<br/>")}</p>`)
            .join("");

    try {
      await sendEmail.mutateAsync({
        to,
        subject,
        bodyHtml: sanitizedHtml,
        inReplyTo: initialData?.inReplyTo,
      });

      toast.success("E-mail enviado com sucesso via Gmail!");
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao enviar e-mail.";
      toast.error(msg);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          key="compose-email-modal-overlay"
          className="fixed inset-0 z-[220] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            key="compose-email-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            key="compose-email-container"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-2xl bg-os-surface rounded-2xl border border-os-border shadow-2xl flex flex-col max-h-[90vh] z-10 overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-os-border flex items-center justify-between bg-os-surface-2/40">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-os-primary/10 text-os-primary">
                  <Send className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-os-fg">
                    {initialData?.subject?.startsWith("Enc:")
                      ? "Encaminhar E-mail"
                      : initialData?.subject?.startsWith("Re:")
                        ? "Responder E-mail"
                        : "Novo E-mail Corporativo"}
                  </h3>
                  <p className="text-xs text-os-muted">
                    Envio através da conta conectada FZ Build Solutions
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowAiAssistant(!showAiAssistant)}
                  className="border-os-primary/30 text-os-primary hover:bg-os-primary/10"
                  leadingIcon={
                    <Sparkles className="h-3.5 w-3.5 text-os-primary" />
                  }
                >
                  Assistente IA
                </Button>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-os-muted hover:text-os-fg hover:bg-os-surface-2 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* AI Proposal Drawer Card inside Modal */}
            <AnimatePresence>
              {showAiAssistant && (
                <motion.div
                  key="compose-ai-proposal-drawer"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-os-surface-2/70 border-b border-os-border px-6 py-4 space-y-3 overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-os-primary uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" />
                      Redator de Propostas Comerciais com Gemini
                    </span>
                    <button
                      onClick={() => setShowAiAssistant(false)}
                      className="text-xs text-os-muted hover:text-os-fg"
                    >
                      Fechar
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-os-muted font-medium">
                        Nome da Empresa
                      </label>
                      <input
                        type="text"
                        value={aiCompany}
                        onChange={(e) => setAiCompany(e.target.value)}
                        placeholder="Ex: MultiLog Centros Logísticos"
                        className="w-full mt-1 px-3 py-1.5 rounded-lg bg-os-surface border border-os-border text-os-fg focus:outline-none focus:ring-1 focus:ring-os-primary"
                      />
                    </div>
                    <div>
                      <label className="text-os-muted font-medium">
                        Orçamento Estimado (R$)
                      </label>
                      <input
                        type="text"
                        value={aiBudget}
                        onChange={(e) => setAiBudget(e.target.value)}
                        placeholder="Ex: 350000"
                        className="w-full mt-1 px-3 py-1.5 rounded-lg bg-os-surface border border-os-border text-os-fg focus:outline-none focus:ring-1 focus:ring-os-primary"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-os-muted font-medium">
                        Dor ou Desafio do Cliente
                      </label>
                      <input
                        type="text"
                        value={aiPain}
                        onChange={(e) => setAiPain(e.target.value)}
                        placeholder="Ex: Reforço de piso de alta tonelagem com prazo de 30 dias"
                        className="w-full mt-1 px-3 py-1.5 rounded-lg bg-os-surface border border-os-border text-os-fg focus:outline-none focus:ring-1 focus:ring-os-primary"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleGenerateAi}
                      disabled={generateProposal.isPending}
                      leadingIcon={
                        generateProposal.isPending ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Sparkles className="h-3.5 w-3.5" />
                        )
                      }
                    >
                      {generateProposal.isPending
                        ? "Redigindo Proposta..."
                        : "Gerar Assunto & Corpo com IA"}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form Fields */}
            <form
              onSubmit={handleSend}
              className="p-6 space-y-4 overflow-y-auto flex-1"
            >
              <div>
                <label className="text-xs font-semibold text-os-fg">
                  Para (Destinatário)
                </label>
                <input
                  type="email"
                  required
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="exemplo@cliente.com.br"
                  className="w-full mt-1 px-3.5 py-2 text-xs rounded-xl bg-os-surface-2 border border-os-border text-os-fg focus:outline-none focus:ring-1 focus:ring-os-primary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-os-fg">
                  Assunto
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Assunto da mensagem ou proposta"
                  className="w-full mt-1 px-3.5 py-2 text-xs rounded-xl bg-os-surface-2 border border-os-border text-os-fg focus:outline-none focus:ring-1 focus:ring-os-primary"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-os-fg">
                    Mensagem
                  </label>
                  <span className="text-[11px] text-os-muted">
                    Suporta HTML e formatação rica
                  </span>
                </div>
                <textarea
                  required
                  rows={10}
                  value={bodyHtml}
                  onChange={(e) => setBodyHtml(e.target.value)}
                  placeholder="Escreva a mensagem ou utilize o Assistente IA acima para redigir uma proposta técnica sob medida..."
                  className="w-full p-3.5 text-xs font-sans rounded-xl bg-os-surface-2 border border-os-border text-os-fg focus:outline-none focus:ring-1 focus:ring-os-primary leading-relaxed"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-os-border flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={onClose}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  type="submit"
                  disabled={sendEmail.isPending}
                  leadingIcon={
                    sendEmail.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )
                  }
                >
                  {sendEmail.isPending
                    ? "Disparando via Gmail..."
                    : "Enviar E-mail"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
