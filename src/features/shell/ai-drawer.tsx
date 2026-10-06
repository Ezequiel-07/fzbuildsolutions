"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send } from "lucide-react";

export function AiDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<
    Array<{ role: "ai" | "user"; text: string }>
  >([
    {
      role: "ai",
      text: "Olá! Sou a FZ AI do seu sistema operacional. Posso analisar fluxo financeiro, saúde dos projetos, leads comerciais e telemetria de infraestrutura. Em que posso ajudar hoje?",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = (overrideText?: string) => {
    const query = (overrideText || input).trim();
    if (!query) return;

    const userMsg = { role: "user" as const, text: query };
    let aiResponse = "Analisando contexto do sistema operacional FZ Build...";

    const q = query.toLowerCase();
    if (q.includes("ezyx") || q.includes("gasto") || q.includes("custo")) {
      aiResponse =
        "O projeto EZYX Logistics está com progresso estável. Principais custos associados: Infraestrutura Cloud e Desenvolvimento. Saldo de orçamento restante em conformidade com o cronograma.";
    } else if (
      q.includes("fluxo") ||
      q.includes("caixa") ||
      q.includes("saldo") ||
      q.includes("receita")
    ) {
      aiResponse =
        "O fluxo de caixa operacional demonstra saldo positivo com pagamentos recorrentes e novas entradas no pipeline comercial. Todas as transações estão sincronizadas com o Firestore.";
    } else if (
      q.includes("infra") ||
      q.includes("servidor") ||
      q.includes("uptime")
    ) {
      aiResponse =
        "Todos os clusters em nuvem da FZ Build estão saudáveis (Uptime consolidado de 99.98%). Latência com Firestore estabilizada em tempo real.";
    } else if (
      q.includes("lead") ||
      q.includes("proposta") ||
      q.includes("comercial")
    ) {
      aiResponse =
        "O pipeline comercial possui propostas em fase de qualificação e negociação. Recomendo follow-up ativo com leads qualificados para conversão em projeto.";
    } else {
      aiResponse = `Recebi sua solicitação: "${query}". Contexto operacional consultado com sucesso.`;
    }

    setMessages((prev) => [
      ...prev,
      userMsg,
      { role: "ai" as const, text: aiResponse },
    ]);
    setInput("");
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md bg-os-surface border-l border-os-border h-full flex flex-col shadow-2xl z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-os-border bg-os-surface-2/60">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-gradient-to-br from-[#003D9B] to-[#00E3FD] text-white">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-os-fg flex items-center gap-2">
                    FZ AI Assistant
                    <span className="w-1.5 h-1.5 rounded-full bg-os-success animate-pulse" />
                  </h2>
                  <p className="text-[11px] text-os-muted font-mono">
                    Inteligência Operacional Ativa
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-os-muted hover:bg-os-surface-2 hover:text-os-fg transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.role === "user"
                        ? "bg-os-primary text-os-primary-fg rounded-br-none"
                        : "bg-os-surface-2 text-os-fg rounded-bl-none border border-os-border"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Suggestions */}
              <div className="pt-2">
                <p className="text-[10px] font-bold text-os-muted uppercase tracking-wider mb-2">
                  Sugestões Rápidas:
                </p>
                <div className="space-y-1.5">
                  {[
                    "Qual a previsão de fluxo de caixa?",
                    "Como está o status dos projetos?",
                    "Qual o status da infraestrutura em nuvem?",
                    "Quais oportunidades requerem follow-up?",
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSend(q)}
                      className="w-full text-left text-xs p-2.5 rounded-xl border border-os-border hover:border-os-accent/40 hover:bg-os-surface-2 text-os-muted hover:text-os-fg transition-all truncate"
                    >
                      💡 {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Input */}
            <div className="p-4 border-t border-os-border bg-os-surface-2/60">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Pergunte sobre projetos, financeiro, leads..."
                  className="flex-1 p-2.5 rounded-xl border border-os-border bg-os-surface text-xs text-os-fg focus:outline-none focus:ring-2 focus:ring-os-ring"
                />
                <button
                  type="submit"
                  className="p-2.5 rounded-xl bg-os-primary text-os-primary-fg hover:bg-os-primary-hover transition-colors flex-shrink-0"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
