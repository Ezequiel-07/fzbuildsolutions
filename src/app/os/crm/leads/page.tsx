"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Phone,
  Mail,
  Edit3,
  Trash2,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  CheckSquare,
  Square,
  X,
} from "lucide-react";
import { useLeads, useDeleteLead, Lead } from "@/features/crm/api/use-leads";
import { NewLeadModal } from "@/features/crm/components/new-lead-modal";
import { EditLeadModal } from "@/features/crm/components/edit-lead-modal";

type SortKey = "clientName" | "projectName" | "stage" | "value" | "createdAt";
type SortDir = "asc" | "desc";

const STAGE_COLORS: Record<string, string> = {
  "Leads Novos":
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Qualificação:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  "Proposta Enviada":
    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  Negociação:
    "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  Fechado:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

const STAGES = [
  "Leads Novos",
  "Qualificação",
  "Proposta Enviada",
  "Negociação",
  "Fechado",
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.35, ease: [0.4, 0, 0.2, 1] },
  }),
};

export default function LeadsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [search, setSearch] = useState("");
  const [filterStage, setFilterStage] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const { data: leads = [], isLoading } = useLeads();
  const deleteLead = useDeleteLead();

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const filtered = useMemo(() => {
    let data = [...leads];
    if (filterStage !== "all")
      data = data.filter((l) => l.stage === filterStage);
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (l) =>
          l.clientName.toLowerCase().includes(q) ||
          l.projectName.toLowerCase().includes(q) ||
          l.stage.toLowerCase().includes(q),
      );
    }
    data.sort((a, b) => {
      let av: string | number = 0,
        bv: string | number = 0;
      if (sortKey === "value") {
        av = a.value || 0;
        bv = b.value || 0;
      } else if (sortKey === "createdAt") {
        const aTs = a.createdAt as { seconds: number } | null | undefined;
        const bTs = b.createdAt as { seconds: number } | null | undefined;
        av = aTs?.seconds || 0;
        bv = bTs?.seconds || 0;
      } else {
        av = (a[sortKey] as string) || "";
        bv = (b[sortKey] as string) || "";
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return data;
  }, [leads, filterStage, search, sortKey, sortDir]);

  const totalValue = filtered.reduce((a, c) => a + (c.value || 0), 0);
  const closedValue = filtered
    .filter((l) => l.stage === "Fechado")
    .reduce((a, c) => a + (c.value || 0), 0);

  const toggleSelect = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const toggleSelectAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((l) => l.id)));
  };

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(v);
  const formatDate = (ts?: { seconds: number }) =>
    ts ? new Date(ts.seconds * 1000).toLocaleDateString("pt-BR") : "—";

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey !== col ? (
      <ChevronsUpDown className="h-3.5 w-3.5 text-slate-300" />
    ) : sortDir === "asc" ? (
      <ChevronUp className="h-3.5 w-3.5 text-[#003d9b]" />
    ) : (
      <ChevronDown className="h-3.5 w-3.5 text-[#003d9b]" />
    );

  return (
    <div className="max-w-[1400px] mx-auto w-full space-y-6">
      {/* HEADER */}
      <motion.div
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Leads
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {filtered.length} lead{filtered.length !== 1 ? "s" : ""} · Pipeline
            commercial
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#003d9b] hover:bg-[#003280] text-white text-sm font-semibold shadow-lg shadow-blue-900/20 hover:-translate-y-0.5 transition-all duration-200"
        >
          <Plus className="h-4 w-4" />
          Novo Lead
        </button>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAGES.map((stage, i) => {
          const count = leads.filter((l) => l.stage === stage).length;
          const val = leads
            .filter((l) => l.stage === stage)
            .reduce((a, c) => a + (c.value || 0), 0);
          return (
            <motion.button
              key={stage}
              custom={i + 1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              onClick={() =>
                setFilterStage(filterStage === stage ? "all" : stage)
              }
              className={`p-4 rounded-2xl border text-left transition-all duration-200 hover:-translate-y-0.5 ${filterStage === stage ? "border-[#003d9b]/40 bg-[#003d9b]/5 shadow-md shadow-blue-900/10" : "bg-white dark:bg-[#0D1C2C] border-slate-200/80 dark:border-slate-800 hover:border-slate-300 hover:shadow-sm"}`}
            >
              <p className="text-xs font-semibold text-slate-500 mb-2">
                {stage}
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {count}
              </p>
              {val > 0 && (
                <p className="text-xs text-green-600 font-medium mt-0.5">
                  {formatCurrency(val)}
                </p>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* TABLE */}
      <motion.div
        custom={6}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="bg-white dark:bg-[#0D1C2C] rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden"
      >
        {/* Toolbar */}
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar leads..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-[#003d9b]/20 focus:border-[#003d9b] transition-all"
            />
          </div>
          {filterStage !== "all" && (
            <button
              onClick={() => setFilterStage("all")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#003d9b]/10 text-[#003d9b] text-xs font-semibold"
            >
              {filterStage} <X className="h-3 w-3" />
            </button>
          )}
          {selected.size > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 border border-red-100">
              <span className="text-xs font-semibold text-red-600">
                {selected.size} selecionado{selected.size > 1 ? "s" : ""}
              </span>
              <button
                onClick={() => setSelected(new Set())}
                className="text-red-400 hover:text-red-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
          <div className="ml-auto flex items-center gap-3 text-xs text-slate-500">
            <span>
              Pipeline:{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {formatCurrency(totalValue)}
              </span>
            </span>
            <span>
              Fechado:{" "}
              <span className="font-semibold text-green-600">
                {formatCurrency(closedValue)}
              </span>
            </span>
          </div>
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
                {[
                  { key: "clientName" as SortKey, label: "Cliente" },
                  { key: "projectName" as SortKey, label: "Projeto" },
                  { key: "stage" as SortKey, label: "Fase" },
                  { key: "value" as SortKey, label: "Valor Previsto" },
                  { key: "createdAt" as SortKey, label: "Data" },
                ].map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer select-none"
                    onClick={() => handleSort(col.key)}
                  >
                    <span className="flex items-center gap-1.5">
                      {col.label}
                      <SortIcon col={col.key} />
                    </span>
                  </th>
                ))}
                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Contato
                </th>
                <th className="px-4 py-3 w-20" />
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={8} className="px-5 py-4">
                      <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-20 text-center">
                    <p className="text-sm text-slate-500">
                      Nenhum lead encontrado.
                    </p>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="mt-3 px-4 py-2 bg-[#003d9b] text-white text-xs font-semibold rounded-xl hover:bg-[#003280] transition-colors"
                    >
                      + Novo Lead
                    </button>
                  </td>
                </tr>
              ) : (
                filtered.map((lead, i) => (
                  <motion.tr
                    key={lead.id}
                    custom={i}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    className={`border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors group ${selected.has(lead.id) ? "bg-blue-50/50 dark:bg-blue-900/10" : ""}`}
                  >
                    <td className="pl-5 py-3.5">
                      <button onClick={() => toggleSelect(lead.id)}>
                        {selected.has(lead.id) ? (
                          <CheckSquare className="h-4 w-4 text-[#003d9b]" />
                        ) : (
                          <Square className="h-4 w-4 text-slate-300 group-hover:text-slate-400" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#003d9b] to-[#006875] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {lead.clientName.charAt(0)}
                        </div>
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                          {lead.clientName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-slate-600 dark:text-slate-400">
                      {lead.projectName}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${STAGE_COLORS[lead.stage] || "bg-slate-100 text-slate-700"}`}
                      >
                        {lead.stage}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-sm font-semibold text-green-600">
                        {lead.value ? formatCurrency(lead.value) : "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-xs text-slate-500">
                      {formatDate(
                        lead.createdAt as { seconds: number } | undefined,
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        {lead.contact?.phone && (
                          <a
                            href={`https://wa.me/${lead.contact.phone.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg text-slate-400 hover:bg-green-50 hover:text-green-600 transition-colors"
                            title={lead.contact.phone}
                          >
                            <Phone className="h-3.5 w-3.5" />
                          </a>
                        )}
                        {lead.contact?.email && (
                          <a
                            href={`mailto:${lead.contact.email}`}
                            className="p-1.5 rounded-lg text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            title={lead.contact.email}
                          >
                            <Mail className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-blue-50 hover:text-[#003d9b] transition-colors"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm("Excluir este lead?"))
                              deleteLead.mutate(lead.id);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
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

        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>
              {filtered.length} lead{filtered.length !== 1 ? "s" : ""}
            </span>
            <span>
              Pipeline total:{" "}
              <span className="font-bold text-slate-700 dark:text-slate-300">
                {formatCurrency(totalValue)}
              </span>
            </span>
          </div>
        )}
      </motion.div>

      <NewLeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <EditLeadModal
        isOpen={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        lead={selectedLead}
      />
    </div>
  );
}
