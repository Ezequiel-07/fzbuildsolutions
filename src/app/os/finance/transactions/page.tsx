"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Download,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Trash2,
  Edit3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Tag,
  ArrowUpRight,
  ArrowDownRight,
  CheckSquare,
  Square,
  X,
} from "lucide-react";
import {
  useTransactions,
  useDeleteTransaction,
  Transaction,
} from "@/features/finance/api/use-transactions";
import { NewTransactionModal } from "@/features/finance/components/new-transaction-modal";
import { EditTransactionModal } from "@/features/finance/components/edit-transaction-modal";

type SortKey = "createdAt" | "description" | "category" | "amount" | "type";
type SortDir = "asc" | "desc";

const CATEGORIES_IN = [
  "MRR / Mensalidade",
  "Pagamento de Projeto",
  "Consultoria",
  "Outros Recebimentos",
];
const CATEGORIES_OUT = [
  "Salários & Freelancers",
  "Infraestrutura Cloud",
  "Marketing & Vendas",
  "Software & Licenças",
  "Impostos & Taxas",
  "Administrativo",
  "Outros Gastos",
];

export default function TransactionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [transactionType, setTransactionType] = useState<"in" | "out">("in");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "in" | "out">("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const { data: transactions = [], isLoading } = useTransactions();
  const deleteTransaction = useDeleteTransaction();

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const filtered = useMemo(() => {
    let data = [...transactions];
    if (filterType !== "all") data = data.filter((t) => t.type === filterType);
    if (filterCategory !== "all")
      data = data.filter((t) => t.category === filterCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q),
      );
    }
    data.sort((a, b) => {
      let av: string | number = 0;
      let bv: string | number = 0;
      if (sortKey === "amount") {
        av = a.amount;
        bv = b.amount;
      } else if (sortKey === "createdAt") {
        av = a.createdAt?.seconds || 0;
        bv = b.createdAt?.seconds || 0;
      } else {
        av = (a[sortKey] as string) || "";
        bv = (b[sortKey] as string) || "";
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return data;
  }, [transactions, filterType, filterCategory, search, sortKey, sortDir]);

  const totalIn = filtered
    .filter((t) => t.type === "in")
    .reduce((a, c) => a + c.amount, 0);
  const totalOut = filtered
    .filter((t) => t.type === "out")
    .reduce((a, c) => a + c.amount, 0);
  const balance = totalIn - totalOut;

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(v);

  const formatDate = (ts?: { seconds: number }) => {
    if (!ts) return "—";
    return new Date(ts.seconds * 1000).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    });
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((t) => t.id)));
    }
  };

  const deleteSelected = async () => {
    if (
      !window.confirm(
        `Excluir ${selected.size} transaç${selected.size > 1 ? "ões" : "ão"}?`,
      )
    )
      return;
    for (const id of selected) {
      await deleteTransaction.mutateAsync(id);
    }
    setSelected(new Set());
  };

  const handleExportCSV = () => {
    const rows = [
      ["Data", "Tipo", "Descrição", "Categoria", "Valor"],
      ...filtered.map((t) => [
        formatDate(t.createdAt as { seconds: number }),
        t.type === "in" ? "Entrada" : "Saída",
        t.description,
        t.category,
        t.amount.toString(),
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fz-transacoes-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col)
      return <ChevronsUpDown className="h-3.5 w-3.5 text-slate-300" />;
    return sortDir === "asc" ? (
      <ChevronUp className="h-3.5 w-3.5 text-[#003d9b]" />
    ) : (
      <ChevronDown className="h-3.5 w-3.5 text-[#003d9b]" />
    );
  };

  return (
    <div className="max-w-[1400px] mx-auto w-full space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Transações
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {filtered.length} registro{filtered.length !== 1 ? "s" : ""} ·
            Planilha financeira interativa
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors"
          >
            <Download className="h-4 w-4" />
            CSV
          </button>
          <button
            onClick={() => {
              setTransactionType("in");
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 text-sm font-semibold transition-colors"
          >
            <ArrowUpRight className="h-4 w-4" />
            Entrada
          </button>
          <button
            onClick={() => {
              setTransactionType("out");
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#003d9b] hover:bg-[#003280] text-white text-sm font-semibold shadow-lg shadow-blue-900/20 hover:-translate-y-0.5 transition-all duration-200"
          >
            <ArrowDownRight className="h-4 w-4" />
            Saída
          </button>
        </div>
      </div>

      {/* KPI SUMMARY */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Entradas",
            value: formatCurrency(totalIn),
            icon: TrendingUp,
            color: "text-green-600",
            bg: "bg-green-50 dark:bg-green-900/20",
          },
          {
            label: "Saídas",
            value: formatCurrency(totalOut),
            icon: TrendingDown,
            color: "text-red-500",
            bg: "bg-red-50 dark:bg-red-900/20",
          },
          {
            label: "Saldo",
            value: formatCurrency(balance),
            icon: DollarSign,
            color: balance >= 0 ? "text-[#003d9b]" : "text-red-500",
            bg:
              balance >= 0
                ? "bg-blue-50 dark:bg-blue-900/20"
                : "bg-red-50 dark:bg-red-900/20",
          },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white dark:bg-[#0D1C2C] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 flex items-center gap-4"
          >
            <div className={`p-3 rounded-xl ${kpi.bg}`}>
              <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">{kpi.label}</p>
              <p className={`text-xl font-bold ${kpi.color} mt-0.5`}>
                {kpi.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* SPREADSHEET */}
      <div className="bg-white dark:bg-[#0D1C2C] rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar transações..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-[#003d9b]/20 focus:border-[#003d9b] transition-all"
            />
          </div>

          {/* Type filter chips */}
          <div className="flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 rounded-xl p-1">
            {(["all", "in", "out"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  filterType === t
                    ? "bg-[#003d9b] text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                {t === "all" ? "Todas" : t === "in" ? "Entradas" : "Saídas"}
              </button>
            ))}
          </div>

          {/* Category filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-600 dark:text-slate-300 outline-none focus:ring-2 focus:ring-[#003d9b]/20 transition-all"
          >
            <option value="all">Todas categorias</option>
            <optgroup label="Entradas">
              {CATEGORIES_IN.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </optgroup>
            <optgroup label="Saídas">
              {CATEGORIES_OUT.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </optgroup>
          </select>

          {/* Selected actions */}
          {selected.size > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 border border-red-100"
            >
              <span className="text-xs font-semibold text-red-600">
                {selected.size} selecionada{selected.size > 1 ? "s" : ""}
              </span>
              <button
                onClick={deleteSelected}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setSelected(new Set())}
                className="text-red-400 hover:text-red-600 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <th className="pl-5 py-3 w-10">
                  <button onClick={toggleSelectAll}>
                    {selected.size === filtered.length &&
                    filtered.length > 0 ? (
                      <CheckSquare className="h-4 w-4 text-[#003d9b]" />
                    ) : (
                      <Square className="h-4 w-4 text-slate-300" />
                    )}
                  </button>
                </th>
                <th
                  className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer select-none group"
                  onClick={() => handleSort("createdAt")}
                >
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    Data
                    <SortIcon col="createdAt" />
                  </span>
                </th>
                <th
                  className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer select-none"
                  onClick={() => handleSort("type")}
                >
                  <span className="flex items-center gap-1.5">
                    Tipo
                    <SortIcon col="type" />
                  </span>
                </th>
                <th
                  className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer select-none"
                  onClick={() => handleSort("description")}
                >
                  <span className="flex items-center gap-1.5">
                    Descrição
                    <SortIcon col="description" />
                  </span>
                </th>
                <th
                  className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer select-none"
                  onClick={() => handleSort("category")}
                >
                  <span className="flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5" />
                    Categoria
                    <SortIcon col="category" />
                  </span>
                </th>
                <th
                  className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer select-none text-right"
                  onClick={() => handleSort("amount")}
                >
                  <span className="flex items-center gap-1.5 justify-end">
                    Valor
                    <SortIcon col="amount" />
                  </span>
                </th>
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr
                    key={i}
                    className="border-b border-slate-50 dark:border-slate-800"
                  >
                    <td className="pl-5 py-4" colSpan={7}>
                      <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center">
                    <DollarSign className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                    <p className="text-sm font-medium text-slate-500">
                      Nenhuma transação encontrada.
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Tente ajustar os filtros ou adicione uma nova transação.
                    </p>
                    <button
                      onClick={() => {
                        setTransactionType("in");
                        setIsModalOpen(true);
                      }}
                      className="mt-4 px-4 py-2 bg-[#003d9b] text-white text-xs font-semibold rounded-xl hover:bg-[#003280] transition-colors"
                    >
                      + Nova Transação
                    </button>
                  </td>
                </tr>
              ) : (
                filtered.map((row, i) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className={`border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors group ${
                      selected.has(row.id)
                        ? "bg-blue-50/50 dark:bg-blue-900/10"
                        : ""
                    }`}
                  >
                    <td className="pl-5 py-3.5">
                      <button onClick={() => toggleSelect(row.id)}>
                        {selected.has(row.id) ? (
                          <CheckSquare className="h-4 w-4 text-[#003d9b]" />
                        ) : (
                          <Square className="h-4 w-4 text-slate-300 group-hover:text-slate-400" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-xs text-slate-500">
                        {formatDate(row.createdAt as { seconds: number })}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                          row.type === "in"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {row.type === "in" ? (
                          <ArrowUpRight className="h-3 w-3" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3" />
                        )}
                        {row.type === "in" ? "Entrada" : "Saída"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {row.description}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-block bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs font-medium px-2.5 py-1 rounded-lg">
                        {row.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span
                        className={`font-mono text-sm font-bold ${
                          row.type === "in" ? "text-green-600" : "text-red-500"
                        }`}
                      >
                        {row.type === "in" ? "+" : "-"}
                        {formatCurrency(row.amount)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setSelectedTransaction(row)}
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-blue-50 hover:text-[#003d9b] transition-colors"
                          title="Editar"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm("Excluir esta transação?"))
                              deleteTransaction.mutate(row.id);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {filtered.length} registro{filtered.length !== 1 ? "s" : ""}{" "}
              {selected.size > 0 &&
                `· ${selected.size} selecionado${selected.size > 1 ? "s" : ""}`}
            </span>
            <div className="flex items-center gap-6 text-xs">
              <span className="text-green-600 font-semibold">
                ↑ {formatCurrency(totalIn)}
              </span>
              <span className="text-red-500 font-semibold">
                ↓ {formatCurrency(totalOut)}
              </span>
              <span
                className={`font-bold ${balance >= 0 ? "text-[#003d9b]" : "text-red-500"}`}
              >
                = {formatCurrency(balance)}
              </span>
            </div>
          </div>
        )}
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
