"use client";

import { useState, useMemo, useEffect } from "react";
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
  FileSpreadsheet,
} from "lucide-react";
import {
  useTransactions,
  useDeleteTransaction,
  Transaction,
} from "@/features/finance/api/use-transactions";
import { NewTransactionModal } from "@/features/finance/components/new-transaction-modal";
import { EditTransactionModal } from "@/features/finance/components/edit-transaction-modal";
import { ImportSpreadsheetModal } from "@/features/finance/components/import-spreadsheet-modal";
import { PageHeader } from "@/components/os/page-header";
import { Button } from "@/components/os/button";
import { Panel } from "@/components/os/panel";
import { StatusBadge } from "@/components/os/status-badge";
import { ConfirmDialog } from "@/components/os/confirm-dialog";
import { toast } from "sonner";

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

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.03, duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  }),
};

export default function TransactionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [txToDelete, setTxToDelete] = useState<Transaction | null>(null);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false);

  const [transactionType, setTransactionType] = useState<"in" | "out">("in");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "in" | "out">("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const { data: transactions = [], isLoading } = useTransactions();
  const deleteTransaction = useDeleteTransaction();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("connected") === "true") {
        toast.success("Conta do Google conectada com sucesso!");
        setIsImportModalOpen(true);
        window.history.replaceState({}, "", window.location.pathname);
      } else if (params.get("auth_error")) {
        toast.error("Erro na autenticação com o Google. Tente novamente.");
        window.history.replaceState({}, "", window.location.pathname);
      }
    }
  }, []);

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

  const handleDeleteBulkConfirm = async () => {
    setIsBulkDeleting(true);
    try {
      for (const id of selected) {
        await deleteTransaction.mutateAsync(id);
      }
      setSelected(new Set());
      setBulkConfirmOpen(false);
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const handleDeleteSingleConfirm = async () => {
    if (!txToDelete) return;
    await deleteTransaction.mutateAsync(txToDelete.id);
    setTxToDelete(null);
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
      return <ChevronsUpDown className="h-3.5 w-3.5 text-os-muted" />;
    return sortDir === "asc" ? (
      <ChevronUp className="h-3.5 w-3.5 text-os-primary" />
    ) : (
      <ChevronDown className="h-3.5 w-3.5 text-os-primary" />
    );
  };

  return (
    <div className="max-w-[1400px] mx-auto w-full space-y-6">
      <PageHeader
        title="Transações Financeiras"
        description={`${filtered.length} registro${filtered.length !== 1 ? "s" : ""} · Planilha financeira interativa e controle de lançamentos`}
        breadcrumbs={[
          { label: "Financeiro", href: "/os/finance" },
          { label: "Transações" },
        ]}
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="secondary"
              size="sm"
              leadingIcon={
                <FileSpreadsheet className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              }
              onClick={() => setIsImportModalOpen(true)}
            >
              Importar Planilha
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leadingIcon={<Download className="h-4 w-4" />}
              onClick={handleExportCSV}
            >
              Exportar CSV
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leadingIcon={
                <ArrowUpRight className="h-4 w-4 text-emerald-600" />
              }
              onClick={() => {
                setTransactionType("in");
                setIsModalOpen(true);
              }}
            >
              + Entrada
            </Button>
            <Button
              variant="primary"
              size="sm"
              leadingIcon={<ArrowDownRight className="h-4 w-4" />}
              onClick={() => {
                setTransactionType("out");
                setIsModalOpen(true);
              }}
            >
              - Saída
            </Button>
          </div>
        }
      />

      {/* KPI SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Entradas Consolidadas",
            value: formatCurrency(totalIn),
            icon: TrendingUp,
            color: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-500/10",
          },
          {
            label: "Saídas & Custos",
            value: formatCurrency(totalOut),
            icon: TrendingDown,
            color: "text-red-500",
            bg: "bg-red-500/10",
          },
          {
            label: "Saldo Operacional",
            value: formatCurrency(balance),
            icon: DollarSign,
            color: balance >= 0 ? "text-os-primary" : "text-red-500",
            bg: balance >= 0 ? "bg-os-primary/10" : "bg-red-500/10",
          },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            custom={i + 1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <Panel className="p-5 flex items-center gap-4">
              <div className={`p-3 rounded-xl ${kpi.bg}`}>
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              </div>
              <div>
                <p className="text-xs text-os-muted font-medium">{kpi.label}</p>
                <p
                  className={`text-xl font-bold font-mono ${kpi.color} mt-0.5`}
                >
                  {kpi.value}
                </p>
              </div>
            </Panel>
          </motion.div>
        ))}
      </div>

      {/* SPREADSHEET PANEL */}
      <motion.div
        custom={4}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <Panel className="overflow-hidden">
          {/* Toolbar */}
          <div className="px-5 py-3.5 border-b border-os-border flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-os-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por descrição ou categoria..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-os-border bg-os-bg text-sm text-os-text outline-none focus:ring-2 focus:ring-os-primary/30 transition-all placeholder:text-os-muted"
              />
            </div>

            {/* Type filter chips */}
            <div className="flex items-center gap-1.5 border border-os-border rounded-xl p-1 bg-os-bg">
              {(["all", "in", "out"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    filterType === t
                      ? "bg-os-primary text-white shadow-sm"
                      : "text-os-muted hover:text-os-text"
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
              className="px-3 py-2 rounded-xl border border-os-border bg-os-bg text-sm text-os-text outline-none focus:ring-2 focus:ring-os-primary/30 transition-all"
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
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20">
                <span className="text-xs font-semibold text-red-600 dark:text-red-400">
                  {selected.size} selecionada{selected.size > 1 ? "s" : ""}
                </span>
                <button
                  onClick={() => setBulkConfirmOpen(true)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                  title="Excluir selecionadas"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setSelected(new Set())}
                  className="text-red-400 hover:text-red-600 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-os-bg border-b border-os-border">
                  <th className="pl-5 py-3 w-10">
                    <button onClick={toggleSelectAll}>
                      {selected.size === filtered.length &&
                      filtered.length > 0 ? (
                        <CheckSquare className="h-4 w-4 text-os-primary" />
                      ) : (
                        <Square className="h-4 w-4 text-os-muted" />
                      )}
                    </button>
                  </th>
                  <th
                    className="px-4 py-3 text-xs font-bold text-os-muted uppercase tracking-wider cursor-pointer select-none"
                    onClick={() => handleSort("createdAt")}
                  >
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      Data
                      <SortIcon col="createdAt" />
                    </span>
                  </th>
                  <th
                    className="px-4 py-3 text-xs font-bold text-os-muted uppercase tracking-wider cursor-pointer select-none"
                    onClick={() => handleSort("type")}
                  >
                    <span className="flex items-center gap-1.5">
                      Tipo
                      <SortIcon col="type" />
                    </span>
                  </th>
                  <th
                    className="px-4 py-3 text-xs font-bold text-os-muted uppercase tracking-wider cursor-pointer select-none"
                    onClick={() => handleSort("description")}
                  >
                    <span className="flex items-center gap-1.5">
                      Descrição
                      <SortIcon col="description" />
                    </span>
                  </th>
                  <th
                    className="px-4 py-3 text-xs font-bold text-os-muted uppercase tracking-wider cursor-pointer select-none"
                    onClick={() => handleSort("category")}
                  >
                    <span className="flex items-center gap-1.5">
                      <Tag className="h-3.5 w-3.5" />
                      Categoria
                      <SortIcon col="category" />
                    </span>
                  </th>
                  <th
                    className="px-4 py-3 text-xs font-bold text-os-muted uppercase tracking-wider cursor-pointer select-none text-right"
                    onClick={() => handleSort("amount")}
                  >
                    <span className="flex items-center gap-1.5 justify-end">
                      Valor
                      <SortIcon col="amount" />
                    </span>
                  </th>
                  <th className="px-4 py-3 text-xs font-bold text-os-muted uppercase tracking-wider text-right pr-5">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="border-b border-os-border">
                      <td className="pl-5 py-4" colSpan={7}>
                        <div className="h-5 bg-os-bg rounded-lg animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-20 text-center">
                      <DollarSign className="h-10 w-10 text-os-muted mx-auto mb-3 opacity-40" />
                      <p className="text-sm font-medium text-os-text">
                        Nenhuma transação encontrada.
                      </p>
                      <p className="text-xs text-os-muted mt-1">
                        Ajuste os filtros ou crie um novo lançamento.
                      </p>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setTransactionType("in");
                          setIsModalOpen(true);
                        }}
                        className="mt-4"
                      >
                        + Nova Transação
                      </Button>
                    </td>
                  </tr>
                ) : (
                  filtered.map((row, i) => (
                    <motion.tr
                      key={row.id}
                      custom={i}
                      variants={fadeUp}
                      initial="hidden"
                      animate="visible"
                      className={`border-b border-os-border/60 hover:bg-os-bg/50 transition-colors group ${
                        selected.has(row.id) ? "bg-os-primary/5" : ""
                      }`}
                    >
                      <td className="pl-5 py-3.5">
                        <button onClick={() => toggleSelect(row.id)}>
                          {selected.has(row.id) ? (
                            <CheckSquare className="h-4 w-4 text-os-primary" />
                          ) : (
                            <Square className="h-4 w-4 text-os-muted group-hover:text-os-text" />
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-xs text-os-muted">
                          {formatDate(row.createdAt as { seconds: number })}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge
                          label={row.type === "in" ? "Entrada" : "Saída"}
                          tone={row.type === "in" ? "success" : "danger"}
                        />
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-sm font-medium text-os-text">
                          {row.description}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-block bg-os-bg text-os-muted text-xs font-medium px-2.5 py-1 rounded-lg border border-os-border">
                          {row.category}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <span
                          className={`font-mono text-sm font-bold ${
                            row.type === "in"
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-red-500"
                          }`}
                        >
                          {row.type === "in" ? "+" : "-"}
                          {formatCurrency(row.amount)}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right pr-5">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setSelectedTransaction(row)}
                            className="p-1.5 rounded-lg text-os-muted hover:bg-os-bg hover:text-os-primary transition-colors"
                            title="Editar"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setTxToDelete(row)}
                            className="p-1.5 rounded-lg text-os-muted hover:bg-red-500/10 hover:text-red-500 transition-colors"
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
            <div className="px-5 py-3 border-t border-os-border flex items-center justify-between text-xs text-os-muted font-mono">
              <span>
                {filtered.length} registro{filtered.length !== 1 ? "s" : ""}{" "}
                {selected.size > 0 &&
                  `· ${selected.size} selecionado${selected.size > 1 ? "s" : ""}`}
              </span>
              <div className="flex items-center gap-6">
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  ↑ {formatCurrency(totalIn)}
                </span>
                <span className="text-red-500 font-semibold">
                  ↓ {formatCurrency(totalOut)}
                </span>
                <span
                  className={`font-bold ${
                    balance >= 0 ? "text-os-primary" : "text-red-500"
                  }`}
                >
                  = {formatCurrency(balance)}
                </span>
              </div>
            </div>
          )}
        </Panel>
      </motion.div>

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
      <ImportSpreadsheetModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />

      {/* CONFIRM DIALOG FOR SINGLE DELETE */}
      <ConfirmDialog
        isOpen={!!txToDelete}
        onClose={() => setTxToDelete(null)}
        onConfirm={handleDeleteSingleConfirm}
        title="Excluir Transação?"
        description={`Confirma a exclusão do lançamento "${txToDelete?.description}" no valor de ${
          txToDelete ? formatCurrency(txToDelete.amount) : ""
        }?`}
        confirmLabel="Excluir Lançamento"
        tone="danger"
        isLoading={deleteTransaction.isPending}
      />

      {/* CONFIRM DIALOG FOR BULK DELETE */}
      <ConfirmDialog
        isOpen={bulkConfirmOpen}
        onClose={() => setBulkConfirmOpen(false)}
        onConfirm={handleDeleteBulkConfirm}
        title="Excluir Transações Selecionadas?"
        description={`Tem certeza que deseja excluir ${selected.size} transaç${selected.size > 1 ? "ões" : "ão"} permanentemente?`}
        confirmLabel="Excluir Selecionadas"
        tone="danger"
        isLoading={isBulkDeleting}
      />
    </div>
  );
}
