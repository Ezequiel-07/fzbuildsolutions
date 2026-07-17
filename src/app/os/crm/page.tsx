"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Filter, Phone, Mail, Trash2, Edit3 } from "lucide-react";
import { useLeads, useDeleteLead, Lead } from "@/features/crm/api/use-leads";
import { NewLeadModal } from "@/features/crm/components/new-lead-modal";
import { EditLeadModal } from "@/features/crm/components/edit-lead-modal";

export default function CRMPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [filterStage, setFilterStage] = useState<string>("Todos");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data: leads = [], isLoading } = useLeads();
  const deleteLead = useDeleteLead();

  // Aggregate pipeline counts
  const pipelineCounts = {
    "Leads Novos": leads.filter((l) => l.stage === "Leads Novos").length,
    Qualificação: leads.filter((l) => l.stage === "Qualificação").length,
    "Proposta Enviada": leads.filter((l) => l.stage === "Proposta Enviada")
      .length,
    Negociação: leads.filter((l) => l.stage === "Negociação").length,
    Fechado: leads.filter((l) => l.stage === "Fechado").length,
  };

  const pipelineStages = [
    {
      name: "Leads Novos",
      count: pipelineCounts["Leads Novos"],
      color: "border-blue-300",
    },
    {
      name: "Qualificação",
      count: pipelineCounts["Qualificação"],
      color: "border-purple-300",
    },
    {
      name: "Proposta Enviada",
      count: pipelineCounts["Proposta Enviada"],
      color: "border-orange-300",
    },
    {
      name: "Negociação",
      count: pipelineCounts["Negociação"],
      color: "border-[#00e3fd]",
    },
    {
      name: "Fechado",
      count: pipelineCounts["Fechado"],
      color: "border-green-400",
    },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const filteredLeads =
    filterStage === "Todos"
      ? leads
      : leads.filter((l) => l.stage === filterStage);

  const formatDate = (timestamp?: { seconds: number }) => {
    if (!timestamp) return "Agora";
    return new Date(timestamp.seconds * 1000).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 min-h-screen bg-transparent select-none">
      <div className="max-w-[1600px] mx-auto w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 glass-card bg-white/70 backdrop-blur-xl border border-white/40 p-6 rounded-2xl shadow-xl shadow-blue-900/5 relative z-[60]">
          <div>
            <h1 className="font-heading text-2xl font-extrabold tracking-tight text-slate-800 uppercase">
              CRM & Vendas
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Gestão de leads, propostas e pipeline comercial
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`bg-white border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl font-bold shadow-sm flex items-center gap-2 hover:bg-slate-50 active:scale-95 transition-all text-xs font-sans ${filterStage !== "Todos" ? "ring-2 ring-[#003d9b]/50 border-[#003d9b]" : ""}`}
              >
                <Filter className="h-4 w-4" />
                <span>{filterStage === "Todos" ? "Filtros" : filterStage}</span>
              </button>

              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl z-50 p-2 flex flex-col gap-1"
                  >
                    <button
                      onClick={() => {
                        setFilterStage("Todos");
                        setIsFilterOpen(false);
                      }}
                      className={`text-left px-3 py-2 rounded-lg text-sm font-bold ${filterStage === "Todos" ? "bg-slate-100 text-[#003d9b]" : "text-slate-600 hover:bg-slate-50"}`}
                    >
                      Todos os Leads
                    </button>
                    {pipelineStages.map((s) => (
                      <button
                        key={s.name}
                        onClick={() => {
                          setFilterStage(s.name);
                          setIsFilterOpen(false);
                        }}
                        className={`text-left px-3 py-2 rounded-lg text-sm font-bold ${filterStage === s.name ? "bg-slate-100 text-[#003d9b]" : "text-slate-600 hover:bg-slate-50"}`}
                      >
                        {s.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#003d9b] text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-blue-900/20 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all text-sm font-sans"
            >
              <Plus className="h-4 w-4" />
              <span>Novo Lead</span>
            </button>
          </div>
        </div>

        {/* Pipeline Overview KPI */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-4">
          {pipelineStages.map((stage, i) => (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              key={stage.name}
              onClick={() => setFilterStage(stage.name)}
              className={`min-w-[200px] flex-1 glass-card bg-white/60 backdrop-blur-md border-t-4 border-x border-b border-slate-200/50 ${stage.color} p-4 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-all ${filterStage === stage.name ? "ring-2 ring-blue-400 border-transparent" : ""}`}
            >
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                {stage.name}
              </h4>
              <p className="font-heading text-2xl font-extrabold text-slate-800">
                {stage.count}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Board */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Active Deals column */}
          <div className="md:col-span-3 glass-card bg-[#f8f9fb]/60 backdrop-blur-md border border-white/40 p-6 rounded-3xl min-h-[500px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-mono text-xs font-bold tracking-widest text-[#003d9b] uppercase">
                Oportunidades em Andamento{" "}
                {filterStage !== "Todos" && `- ${filterStage}`}
              </h3>
            </div>

            <div className="space-y-4">
              {isLoading ? (
                <div className="text-sm text-slate-500 text-center py-8">
                  Carregando leads do Firestore...
                </div>
              ) : filteredLeads.length === 0 ? (
                <div className="text-sm text-slate-500 text-center py-8">
                  Nenhum lead encontrado para este filtro.
                </div>
              ) : (
                filteredLeads.map((deal) => (
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    key={deal.id}
                    className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#003d9b] to-[#006875] text-white flex items-center justify-center font-bold text-lg uppercase shadow-sm">
                        {deal.clientName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-800">
                          {deal.clientName}
                        </h4>
                        <p className="text-xs text-slate-500">
                          {deal.projectName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-8 md:ml-auto">
                      <div className="hidden md:block">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                          Fase
                        </span>
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded-md ${
                            deal.stage === "Fechado"
                              ? "bg-green-100 text-green-700"
                              : deal.stage === "Negociação"
                                ? "bg-blue-100 text-[#003d9b]"
                                : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {deal.stage}
                        </span>
                      </div>
                      <div className="hidden md:block text-right">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                          Valor Previsto
                        </span>
                        <span className="text-sm font-bold text-green-600">
                          {formatCurrency(deal.value)}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedLead(deal);
                            }}
                            className="p-2 text-slate-400 bg-slate-50 hover:bg-[#003d9b]/10 hover:text-[#003d9b] rounded-lg transition-colors"
                            title="Editar Lead"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          {deal.contact?.phone ? (
                            <a
                              href={`https://wa.me/${deal.contact.phone.replace(/\D/g, "")}`}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="p-2 bg-slate-50 text-slate-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                              title={`WhatsApp: ${deal.contact.phone}`}
                            >
                              <Phone className="w-4 h-4" />
                            </a>
                          ) : (
                            <div
                              className="p-2 bg-slate-50 text-slate-200 rounded-lg cursor-not-allowed"
                              title="Nenhum número cadastrado"
                            >
                              <Phone className="w-4 h-4" />
                            </div>
                          )}

                          {deal.contact?.email ? (
                            <a
                              href={`mailto:${deal.contact.email}`}
                              onClick={(e) => e.stopPropagation()}
                              className="p-2 bg-slate-50 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                              title={`E-mail: ${deal.contact.email}`}
                            >
                              <Mail className="w-4 h-4" />
                            </a>
                          ) : (
                            <div
                              className="p-2 bg-slate-50 text-slate-200 rounded-lg cursor-not-allowed"
                              title="Nenhum e-mail cadastrado"
                            >
                              <Mail className="w-4 h-4" />
                            </div>
                          )}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (
                                window.confirm(
                                  "Tem certeza que deseja excluir este Lead?",
                                )
                              ) {
                                deleteLead.mutate(deal.id);
                              }
                            }}
                            className="p-2 text-slate-400 bg-slate-50 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"
                            title="Excluir Lead"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions / Activity */}
          <div className="space-y-6">
            <div className="glass-card bg-white/80 backdrop-blur-xl border border-white/40 p-6 rounded-3xl shadow-xl shadow-blue-900/5">
              <h3 className="font-mono text-xs font-bold tracking-widest text-[#003d9b] uppercase mb-4">
                Atividade Recente
              </h3>
              <div className="space-y-4">
                {isLoading ? (
                  <p className="text-xs text-slate-400 text-center py-4">
                    Carregando...
                  </p>
                ) : leads.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">
                    Nenhuma atividade registrada.
                  </p>
                ) : (
                  leads.slice(0, 4).map((lead) => (
                    <div key={lead.id} className="flex gap-3">
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 ${
                          lead.stage === "Fechado"
                            ? "bg-green-500"
                            : lead.stage === "Negociação"
                              ? "bg-blue-500"
                              : "bg-orange-400"
                        }`}
                      />
                      <div>
                        <p className="text-xs text-slate-700 font-bold">
                          {lead.stage === "Fechado"
                            ? "Negócio Fechado!"
                            : "Lead Adicionado"}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {lead.clientName} -{" "}
                          {formatDate(lead.createdAt as { seconds: number })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <button className="w-full mt-6 py-2 bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
                Ver Histórico
              </button>
            </div>
          </div>
        </div>
      </div>

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
