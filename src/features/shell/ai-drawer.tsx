"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Loader2 } from "lucide-react";

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
      text: "Olá! Sou a FZ AI do seu sistema operacional. Posso analisar fluxo financeiro, projetos e leads comerciais com dados reais do sistema. Em que posso ajudar hoje?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (overrideText?: string) => {
    const query = (overrideText || input).trim();
    if (!query || isLoading) return;

    const userMsg = { role: "user" as const, text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/shell/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query }),
      });

      const data = await res.json().catch(() => ({}));
      const reply =
        data.text ||
        "Não foi possível obter resposta no momento. Verifique a configuração do servidor.";

      setMessages((prev) => [...prev, { role: "ai" as const, text: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai" as const,
          text: "Falha de conexão com a FZ AI. Verifique se o servidor está ativo.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
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

              {isLoading && (
                <div className="flex justify-start">
                  <div className="p-3 rounded-2xl bg-os-surface-2 text-os-fg rounded-bl-none border border-os-border flex items-center gap-2 text-xs">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-os-primary" />
                    <span className="text-os-muted">
                      Consultando dados reais do sistema...
                    </span>
                  </div>
                </div>
              )}

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
                      disabled={isLoading}
                      className="w-full text-left text-xs p-2.5 rounded-xl border border-os-border hover:border-os-accent/40 hover:bg-os-surface-2 text-os-muted hover:text-os-fg transition-all truncate disabled:opacity-50"
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
                  disabled={isLoading}
                  placeholder="Pergunte sobre projetos, financeiro, leads..."
                  className="flex-1 p-2.5 rounded-xl border border-os-border bg-os-surface text-xs text-os-fg focus:outline-none focus:ring-2 focus:ring-os-ring disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="p-2.5 rounded-xl bg-os-primary text-os-primary-fg hover:bg-os-primary-hover transition-colors flex-shrink-0 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Send className="h-3.5 w-3.5" />
                  )}
                </button>
              </form>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
