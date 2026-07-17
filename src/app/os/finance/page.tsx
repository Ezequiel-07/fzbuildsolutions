"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  Wallet,
  TrendingUp,
  Plus,
  Trash2,
  Edit3,
} from "lucide-react";
import {
  useTransactions,
  useDeleteTransaction,
  Transaction,
} from "@/features/finance/api/use-transactions";
import { NewTransactionModal } from "@/features/finance/components/new-transaction-modal";
import { EditTransactionModal } from "@/features/finance/components/edit-transaction-modal";

export default function FinancePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [transactionType, setTransactionType] = useState<"in" | "out">("in");
  const { data: transactions = [], isLoading } = useTransactions();
  const deleteTransaction = useDeleteTransaction();

  const handleOpenModal = (type: "in" | "out") => {
    setTransactionType(type);
    setIsModalOpen(true);
  };

  // Calculate KPIs
  const totalRevenue = transactions
    .filter((t) => t.type === "in")
    .reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.type === "out")
    .reduce((acc, curr) => acc + curr.amount, 0);
  const netProfit = totalRevenue - totalExpenses;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (timestamp: { seconds: number }) => {
    if (!timestamp) return "Recente";
    return new Date(timestamp.seconds * 1000).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 min-h-screen bg-transparent select-none">
      <div className="max-w-[1440px] mx-auto w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 glass-card bg-white/70 backdrop-blur-xl border border-white/40 p-6 rounded-2xl shadow-xl shadow-blue-900/5">
          <div>
            <h1 className="font-heading text-2xl font-extrabold tracking-tight text-slate-800 uppercase">
              Financeiro
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Gestão de Receitas, Custos e MRR
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleOpenModal("in")}
              className="bg-white border border-slate-200 text-green-600 px-6 py-2.5 rounded-full font-bold shadow-sm flex items-center gap-2 hover:bg-slate-50 active:scale-95 transition-all text-sm font-sans"
            >
              <span>+ Nova Receita</span>
            </button>
            <button
              onClick={() => handleOpenModal("out")}
              className="bg-[#003d9b] text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-blue-900/20 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all text-sm font-sans"
            >
              <Plus className="h-4 w-4" />
              <span>Nova Despesa</span>
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="glass-card bg-white/70 backdrop-blur-xl border border-white/40 p-6 rounded-3xl shadow-xl shadow-blue-900/5"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="bg-green-100 text-green-600 p-3 rounded-2xl">
                <Wallet className="w-6 h-6" />
              </div>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Receita Total
            </p>
            <h3 className="font-heading text-4xl font-extrabold text-slate-800">
              {formatCurrency(totalRevenue)}
            </h3>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card bg-white/70 backdrop-blur-xl border border-white/40 p-6 rounded-3xl shadow-xl shadow-blue-900/5"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="bg-red-100 text-red-600 p-3 rounded-2xl">
                <CreditCard className="w-6 h-6" />
              </div>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Custos Totais
            </p>
            <h3 className="font-heading text-4xl font-extrabold text-slate-800">
              {formatCurrency(totalExpenses)}
            </h3>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`glass-card bg-gradient-to-br ${netProfit >= 0 ? "from-[#003d9b] to-[#006875] border-blue-400/30" : "from-red-600 to-red-800 border-red-400/30"} border p-6 rounded-3xl shadow-xl shadow-blue-900/20 text-white`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="bg-white/20 text-white p-3 rounded-2xl backdrop-blur-md">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
            <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest mb-1">
              Lucro Líquido
            </p>
            <h3 className="font-heading text-4xl font-extrabold text-white">
              {formatCurrency(netProfit)}
            </h3>
          </motion.div>
        </div>

        {/* Transactions Table */}
        <div className="glass-card bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl shadow-blue-900/5 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-mono text-xs font-bold tracking-widest text-[#003d9b] uppercase">
              Últimas Transações
            </h3>
          </div>
          <div className="overflow-x-auto min-h-[300px]">
            {isLoading ? (
              <div className="p-8 text-center text-sm text-slate-500">
                Carregando transações do Firestore...
              </div>
            ) : transactions.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500">
                Nenhuma transação encontrada. Clique em &quot;+ Nova
                Receita&quot; ou &quot;Nova Despesa&quot;.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Descrição
                    </th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                      Valor
                    </th>
                    <th className="p-4 w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="p-4 text-sm font-bold text-slate-800">
                        {row.description}
                      </td>
                      <td className="p-4 text-sm text-slate-500">
                        {formatDate(row.createdAt as { seconds: number })}
                      </td>
                      <td className="p-4 text-sm text-slate-500">
                        <span className="bg-slate-100 px-2 py-1 rounded-md text-xs font-bold">
                          {row.category}
                        </span>
                      </td>
                      <td
                        className={`p-4 text-sm font-bold text-right ${row.type === "in" ? "text-green-600" : "text-red-600"}`}
                      >
                        {row.type === "in" ? "+ " : "- "}
                        {formatCurrency(row.amount)}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedTransaction(row)}
                            className="p-2 text-slate-400 hover:text-[#003d9b] hover:bg-[#003d9b]/10 rounded-lg transition-colors"
                            title="Editar Transação"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (
                                window.confirm("Deseja excluir esta transação?")
                              )
                                deleteTransaction.mutate(row.id);
                            }}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Excluir Transação"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <NewTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultType={transactionType}
      />
      <EditTransactionModal
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        transaction={selectedTransaction}
      />
    </div>
  );
}
