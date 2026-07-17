"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { useCreateTransaction } from "../api/use-transactions";

interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: "in" | "out";
}

export function NewTransactionModal({
  isOpen,
  onClose,
  defaultType = "out",
}: NewTransactionModalProps) {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Infraestrutura");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"in" | "out">(defaultType);

  const createTransaction = useCreateTransaction();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    await createTransaction.mutateAsync({
      description,
      category,
      amount: parseFloat(amount),
      type,
    });

    setDescription("");
    setCategory("Infraestrutura");
    setAmount("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 border border-slate-100"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-heading font-extrabold text-slate-800 mb-6">
              Nova Transação
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setType("in")}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${type === "in" ? "bg-white text-green-600 shadow-sm" : "text-slate-500"}`}
                >
                  Receita (Entrada)
                </button>
                <button
                  type="button"
                  onClick={() => setType("out")}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${type === "out" ? "bg-white text-red-600 shadow-sm" : "text-slate-500"}`}
                >
                  Despesa (Saída)
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-4">
                  Descrição
                </label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#003d9b] focus:border-transparent outline-none transition-all text-sm"
                  placeholder="Ex: Pagamento Fatura #1024"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Valor (R$)
                  </label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#003d9b] focus:border-transparent outline-none transition-all text-sm"
                    placeholder="1500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Categoria
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#003d9b] focus:border-transparent outline-none transition-all text-sm"
                  >
                    {type === "in" ? (
                      <>
                        <option value="Projeto Fixo">Projeto Fixo</option>
                        <option value="Receita SaaS">Receita SaaS</option>
                        <option value="Manutenção">Manutenção</option>
                      </>
                    ) : (
                      <>
                        <option value="Infraestrutura">Infraestrutura</option>
                        <option value="Folha de Pagto">Folha de Pagto</option>
                        <option value="Impostos">Impostos</option>
                        <option value="Softwares">Softwares</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={createTransaction.isPending}
                  className={`w-full text-white py-4 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${type === "in" ? "bg-green-600 hover:bg-green-700 shadow-green-900/20" : "bg-[#003d9b] hover:bg-[#003280] shadow-blue-900/20"}`}
                >
                  {createTransaction.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : type === "in" ? (
                    "Registrar Receita"
                  ) : (
                    "Registrar Despesa"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
