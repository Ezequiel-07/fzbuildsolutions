"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Brain,
  Building2,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  Clock,
  Send,
  FileText,
  MessageSquare,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useLead, useUpdateLead } from "@/features/crm/api/use-leads";
import { useCreateProject } from "@/features/projects/api/use-projects";
import Link from "next/link";
import { toast } from "sonner";

const STAGES = [
  {
    id: "lead",
    label: "Lead Novo",
    color:
      "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  },
  {
    id: "contacted",
    label: "Qualificado",
    color:
      "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800",
  },
  {
    id: "meeting",
    label: "Reunião",
    color:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  },
  {
    id: "proposal",
    label: "Proposta",
    color:
      "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800",
  },
  {
    id: "negotiation",
    label: "Negociação",
    color:
      "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800",
  },
  {
    id: "won",
    label: "Ganho (Fechado)",
    color:
      "bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800",
  },
  {
    id: "lost",
    label: "Perdido",
    color:
      "bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.35, ease: [0.4, 0, 0.2, 1] },
  }),
};

interface ActivityLog {
  id: string;
  type: "note" | "meeting" | "proposal" | "stage";
  title: string;
  desc: string;
  time: string;
  user: string;
}

export default function LeadDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: lead, isLoading, error } = useLead(id);
  const updateLead = useUpdateLead();
  const createProject = useCreateProject();

  const [activeTab, setActiveTab] = useState<
    "overview" | "timeline" | "proposal"
  >("overview");
  const [newNote, setNewNote] = useState("");
  const [activities, setActivities] = useState<ActivityLog[]>([
    {
      id: "act-1",
      type: "proposal",
      title: "Proposta Comercial v1 enviada",
      desc: "Escopo técnico e cronograma de 12 semanas entregues para análise da diretoria.",
      time: "Hoje às 14:30",
      user: "Ezequiel",
    },
    {
      id: "act-2",
      type: "meeting",
      title: "Reunião de Alinhamento de Requisitos",
      desc: "Alinhadas expectativas sobre integração com ERP legado e SLAs em nuvem.",
      time: "Ontem às 10:00",
      user: "Ezequiel",
    },
    {
      id: "act-3",
      type: "stage",
      title: "Lead qualificado e registrado",
      desc: "Primeiro contato efetuado via indicação corporativa.",
      time: "2 dias atrás",
      user: "Sistema FZ",
    },
  ]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="h-8 w-8 text-[#003d9b] animate-spin" />
        <p className="text-sm text-slate-500 font-mono">
          Carregando perfil do cliente...
        </p>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="max-w-xl mx-auto text-center py-16">
        <Brain className="h-12 w-12 text-slate-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          Lead não encontrado
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          O lead solicitado pode ter sido excluído ou não existe.
        </p>
        <Link
          href="/os/crm/leads"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#003d9b] text-white text-sm font-semibold hover:bg-[#002d73] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Leads
        </Link>
      </div>
    );
  }

  const currentStageObj = STAGES.find((s) => s.id === lead.stage) || STAGES[0];

  const handleStageChange = async (newStage: string) => {
    try {
      await updateLead.mutateAsync({ id: lead.id, data: { stage: newStage } });
      const stageLabel =
        STAGES.find((s) => s.id === newStage)?.label || newStage;
      toast.success(`Fase alterada para "${stageLabel}"`);
      setActivities((prev) => [
        {
          id: `stage-${Date.now()}`,
          type: "stage",
          title: `Etapa alterada para ${stageLabel}`,
          desc: `Atualização de pipeline registrada no FZ OS.`,
          time: "Agora mesmo",
          user: "Você",
        },
        ...prev,
      ]);
    } catch {
      toast.error("Erro ao atualizar etapa do lead");
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setActivities((prev) => [
      {
        id: `note-${Date.now()}`,
        type: "note",
        title: "Nota de Negociação adicionada",
        desc: newNote.trim(),
        time: "Agora mesmo",
        user: "Você",
      },
      ...prev,
    ]);
    setNewNote("");
    toast.success("Nota adicionada ao histórico!");
  };

  const handleConvertToProject = async () => {
    try {
      await createProject.mutateAsync({
        name: lead.projectName || lead.clientName,
        clientId: lead.id,
        status: "planning",
        budget: lead.value || 0,
        progress: 0,
        startDate: new Date().toISOString().split("T")[0],
        description: `Projeto gerado a partir do lead comercial ${lead.clientName}.`,
      });
      await updateLead.mutateAsync({ id: lead.id, data: { stage: "won" } });
      toast.success("Lead convertido em projeto ativo com sucesso!");
      router.push("/os/projects");
    } catch {
      toast.error("Erro ao converter lead em projeto");
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto w-full space-y-6">
      {/* NAVIGATION / TOP BAR */}
      <motion.div
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <Link
          href="/os/crm/leads"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para CRM & Leads
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={handleConvertToProject}
            disabled={createProject.isPending}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#003d9b] to-[#006875] text-white text-xs font-semibold hover:shadow-lg hover:shadow-blue-900/20 transition-all disabled:opacity-50"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Converter em Projeto
          </button>
        </div>
      </motion.div>

      {/* HEADER CARD - CUSTOMER 360 */}
      <motion.div
        custom={1}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="bg-white dark:bg-[#0D1C2C] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 md:p-8"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#003d9b] to-[#00e3fd]/40 flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-md shadow-blue-900/20">
              {lead.clientName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  {lead.clientName}
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${currentStageObj.color}`}
                >
                  {currentStageObj.label}
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                <Building2 className="h-3.5 w-3.5" />
                {lead.projectName || "Projeto Comercial"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-4 md:pt-0 md:pl-6">
            <div>
              <p className="text-xs text-slate-400 font-medium">
                Valor Estimado
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                R$ {lead.value ? lead.value.toLocaleString("pt-BR") : "0"}
              </p>
            </div>
          </div>
        </div>

        {/* PIPELINE PROGRESSION STEPPER */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Fase do Funil de Vendas
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {STAGES.map((s) => {
              const isCurrent = lead.stage === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => handleStageChange(s.id)}
                  disabled={updateLead.isPending}
                  className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                    isCurrent
                      ? "border-[#003d9b] bg-[#003d9b]/10 dark:bg-[#003d9b]/20 text-[#003d9b] dark:text-[#00e3fd] ring-2 ring-[#003d9b]/20"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <p className="font-semibold truncate">{s.label}</p>
                  <span className="text-[10px] text-slate-400">
                    {isCurrent ? "Fase Atual" : "Mover"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* METRIC HIGHLIGHTS */}
      <motion.div
        custom={2}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {[
          {
            label: "Email de Contato",
            value: lead.contact?.email || "contato@cliente.com",
            icon: Mail,
            color: "text-blue-600",
            bg: "bg-blue-100 dark:bg-blue-900/30",
          },
          {
            label: "Telefone / WhatsApp",
            value: lead.contact?.phone || "(11) 98765-4321",
            icon: Phone,
            color: "text-green-600",
            bg: "bg-green-100 dark:bg-green-900/30",
          },
          {
            label: "Previsão de Fechamento",
            value: "Em até 15 dias",
            icon: Calendar,
            color: "text-purple-600",
            bg: "bg-purple-100 dark:bg-purple-900/30",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-white dark:bg-[#0D1C2C] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 flex items-center gap-3"
          >
            <div className={`p-2.5 rounded-xl ${item.bg} flex-shrink-0`}>
              <item.icon className={`h-4 w-4 ${item.color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400 font-medium">
                {item.label}
              </p>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* TABS SELECTOR */}
      <motion.div
        custom={3}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2"
      >
        {[
          { id: "overview", label: "Visão Geral 360", icon: Building2 },
          { id: "timeline", label: "Histórico & Atividades", icon: Clock },
          { id: "proposal", label: "Proposta Comercial", icon: FileText },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === tab.id
                ? "bg-[#003d9b] text-white shadow-md shadow-blue-900/20"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* TAB CONTENT */}
      {activeTab === "overview" && (
        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-[#0D1C2C] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Brain className="h-4 w-4 text-[#003d9b]" />
                Diagnóstico & Necessidades do Cliente
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Cliente busca migração de arquitetura monolítica para
                microsserviços em nuvem com alta disponibilidade, suporte a
                mensageria e interface operacional personalizada (SaaS).
                Estimativa de desenvolvimento de 3 meses com stack Next.js,
                Firebase e integrações com gateway de pagamentos.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <p className="text-xs text-slate-400 font-medium">
                    Origem do Lead
                  </p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Indicação de Parceiro
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">
                    Responsável Comercial
                  </p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Ezequiel (FZ Build)
                  </p>
                </div>
              </div>
            </div>

            {/* QUICK NOTE FORM */}
            <div className="bg-white dark:bg-[#0D1C2C] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6">
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-3">
                <MessageSquare className="h-4 w-4 text-[#003d9b]" />
                Registrar Nova Atividade / Nota de Reunião
              </h2>
              <form onSubmit={handleAddNote} className="space-y-3">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Escreva detalhes da ligação, alinhamento técnico ou pontos de negociação..."
                  className="w-full h-24 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#003d9b] resize-none"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#003d9b] text-white text-xs font-semibold hover:bg-[#002d73] transition-colors"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Salvar Nota
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* SIDEBAR ACTIONS & NEXT STEPS */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#0D1C2C] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Próximos Passos Comerciais
              </h3>
              <ul className="space-y-3">
                {[
                  { text: "Enviar minuta contratual", done: false },
                  { text: "Agendar call técnica de segurança", done: true },
                  {
                    text: "Validar SLA e volumetria de requisições",
                    done: false,
                  },
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs">
                    <input
                      type="checkbox"
                      defaultChecked={item.done}
                      className="mt-0.5 rounded border-slate-300 text-[#003d9b] focus:ring-[#003d9b]"
                    />
                    <span
                      className={
                        item.done
                          ? "line-through text-slate-400"
                          : "text-slate-700 dark:text-slate-300 font-medium"
                      }
                    >
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === "timeline" && (
        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="bg-white dark:bg-[#0D1C2C] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 md:p-8"
        >
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-6">
            <Clock className="h-4 w-4 text-[#003d9b]" />
            Linha do Tempo de Interações
          </h2>
          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
            {activities.map((act) => (
              <div key={act.id} className="relative">
                <div className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-[#003d9b] ring-4 ring-white dark:ring-[#0D1C2C]" />
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {act.title}
                  </p>
                  <span className="text-[11px] text-slate-400">{act.time}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {act.desc}
                </p>
                <span className="inline-block mt-2 text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                  Por {act.user}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {activeTab === "proposal" && (
        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="bg-white dark:bg-[#0D1C2C] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 md:p-8 space-y-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Proposta FZ-2026-PROP-08
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Versão 1.2 · Atualizada em 30 de Setembro de 2026
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 border border-amber-200 dark:border-amber-800">
              Em Análise pelo Cliente
            </span>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-slate-400 font-medium">
                Investimento Total
              </p>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                R$ {lead.value ? lead.value.toLocaleString("pt-BR") : "0"}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">
                Condição de Pagamento
              </p>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                30% Entrada + 3x Mensais
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">
                Prazo Estimado
              </p>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                90 dias úteis
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
