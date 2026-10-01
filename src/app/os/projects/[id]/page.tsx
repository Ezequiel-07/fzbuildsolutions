"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  FolderKanban,
  ListChecks,
  DollarSign,
  Users,
  Activity,
  Plus,
  Edit3,
  TrendingUp,
  CheckCircle2,
  Circle,
  Loader2,
} from "lucide-react";
import { useProjects } from "@/features/projects/api/use-projects";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  }),
};

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; dot: string }
> = {
  "To Do": {
    label: "Para Fazer",
    color: "text-slate-600",
    bg: "bg-slate-100 dark:bg-slate-700/50",
    dot: "bg-slate-400",
  },
  Doing: {
    label: "Em Andamento",
    color: "text-blue-600",
    bg: "bg-blue-100 dark:bg-blue-900/30",
    dot: "bg-blue-500",
  },
  "In Review": {
    label: "Em Revisão",
    color: "text-amber-600",
    bg: "bg-amber-100 dark:bg-amber-900/30",
    dot: "bg-amber-500",
  },
  Done: {
    label: "Concluído",
    color: "text-green-600",
    bg: "bg-green-100 dark:bg-green-900/30",
    dot: "bg-green-500",
  },
  completed: {
    label: "Concluído",
    color: "text-green-600",
    bg: "bg-green-100 dark:bg-green-900/30",
    dot: "bg-green-500",
  },
};

const TABS = ["Visão Geral", "Tarefas", "Financeiro", "Equipe"];

const MOCK_TASKS = [
  { id: "t1", text: "Definir escopo do projeto", done: true, priority: "high" },
  {
    id: "t2",
    text: "Configurar repositório Git",
    done: true,
    priority: "medium",
  },
  { id: "t3", text: "Criar protótipo inicial", done: false, priority: "high" },
  { id: "t4", text: "Desenvolver autenticação", done: false, priority: "high" },
  { id: "t5", text: "Integrar Firebase", done: false, priority: "medium" },
  { id: "t6", text: "Testes de aceitação", done: false, priority: "low" },
];

const MOCK_ACTIVITY = [
  { text: "Projeto criado", time: "há 5 dias", color: "bg-blue-500" },
  { text: "Escopo definido", time: "há 4 dias", color: "bg-green-500" },
  { text: "Repositório configurado", time: "há 3 dias", color: "bg-green-500" },
  { text: "Sprint 1 iniciada", time: "há 2 dias", color: "bg-blue-500" },
  { text: "Protótipo em andamento", time: "ontem", color: "bg-amber-500" },
];

export default function ProjectDetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState("Visão Geral");
  const [tasks, setTasks] = useState(MOCK_TASKS);

  const { data: projects = [], isLoading } = useProjects();
  const project = projects.find((p) => p.id === params.id);

  const toggleTask = (id: string) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  const doneCount = tasks.filter((t) => t.done).length;

  const statusCfg =
    STATUS_CONFIG[project?.status || "To Do"] || STATUS_CONFIG["To Do"];

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(v);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 text-[#003d9b] animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-[900px] mx-auto text-center py-20">
        <FolderKanban className="h-12 w-12 text-slate-200 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
          Projeto não encontrado
        </h2>
        <p className="text-sm text-slate-500 mt-2">
          O projeto com o ID &quot;{params.id}&quot; não existe ou foi removido.
        </p>
        <Link
          href="/os/projects"
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#003d9b] text-white text-sm font-semibold hover:bg-[#003280] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar aos Projetos
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto w-full space-y-6">
      {/* BREADCRUMB + HEADER */}
      <motion.div
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <Link
          href="/os/projects"
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-[#003d9b] transition-colors w-fit mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Projetos
        </Link>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#003d9b] to-[#006875] flex items-center justify-center text-white text-xl font-bold flex-shrink-0 shadow-lg shadow-blue-900/20">
              {project.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                {project.name}
              </h1>
              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${statusCfg.bg} ${statusCfg.color}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`}
                  />
                  {statusCfg.label}
                </span>
                <span className="text-xs text-slate-400">
                  {project.progress || 0}% concluído
                </span>
              </div>
            </div>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors self-start">
            <Edit3 className="h-4 w-4" />
            Editar
          </button>
        </div>

        {/* Progress */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Progresso geral</span>
            <span className="font-bold text-[#003d9b]">
              {project.progress || 0}%
            </span>
          </div>
          <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${project.progress || 0}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-[#003d9b] to-[#00e3fd] rounded-full"
            />
          </div>
        </div>
      </motion.div>

      {/* TABS */}
      <motion.div
        custom={1}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800"
      >
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px ${
              activeTab === tab
                ? "border-[#003d9b] text-[#003d9b]"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </motion.div>

      {/* OVERVIEW TAB */}
      {activeTab === "Visão Geral" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            {[
              {
                label: "Status",
                value: statusCfg.label,
                icon: FolderKanban,
                color: "text-blue-600",
                bg: "bg-blue-100 dark:bg-blue-900/30",
              },
              {
                label: "Progresso",
                value: `${project.progress || 0}%`,
                icon: TrendingUp,
                color: "text-green-600",
                bg: "bg-green-100 dark:bg-green-900/30",
              },
              {
                label: "Tarefas",
                value: `${doneCount}/${tasks.length}`,
                icon: ListChecks,
                color: "text-purple-600",
                bg: "bg-purple-100 dark:bg-purple-900/30",
              },
              {
                label: "Budget",
                value: project.budget ? formatCurrency(project.budget) : "—",
                icon: DollarSign,
                color: "text-amber-600",
                bg: "bg-amber-100 dark:bg-amber-900/30",
              },
            ].map((card, i) => (
              <motion.div
                key={card.label}
                custom={i + 2}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="bg-white dark:bg-[#0D1C2C] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5"
              >
                <div className={`p-2.5 rounded-xl ${card.bg} w-fit mb-3`}>
                  <card.icon className={`h-4 w-4 ${card.color}`} />
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {card.label}
                </p>
                <p className={`text-xl font-bold mt-0.5 ${card.color}`}>
                  {card.value}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            custom={6}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="bg-white dark:bg-[#0D1C2C] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5"
          >
            <h2 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4">
              <Activity className="h-4 w-4 text-[#003d9b]" />
              Atividade Recente
            </h2>
            <div className="relative pl-4 space-y-4">
              <div className="absolute left-1.5 top-2 bottom-0 w-px bg-slate-100 dark:bg-slate-700" />
              {MOCK_ACTIVITY.map((event, i) => (
                <div key={i} className="relative flex items-start gap-3">
                  <div
                    className={`absolute -left-3 top-1 w-2 h-2 rounded-full ${event.color} ring-2 ring-white dark:ring-[#0D1C2C]`}
                  />
                  <div>
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      {event.text}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {event.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* TASKS TAB */}
      {activeTab === "Tarefas" && (
        <motion.div
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="bg-white dark:bg-[#0D1C2C] rounded-2xl border border-slate-200/80 dark:border-slate-800"
        >
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-[#003d9b]" />
              Tarefas ({doneCount}/{tasks.length})
            </h2>
            <button className="flex items-center gap-1.5 text-xs font-semibold text-[#003d9b] hover:underline">
              <Plus className="h-3.5 w-3.5" />
              Adicionar
            </button>
          </div>
          <div className="p-4 space-y-2">
            {tasks.map((task, i) => (
              <motion.button
                key={task.id}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                onClick={() => toggleTask(task.id)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left group"
              >
                {task.done ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 text-slate-300 group-hover:text-slate-400 flex-shrink-0" />
                )}
                <span
                  className={`text-sm flex-1 ${task.done ? "line-through text-slate-400" : "text-slate-700 dark:text-slate-300"}`}
                >
                  {task.text}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                    task.priority === "high"
                      ? "bg-red-100 text-red-600"
                      : task.priority === "medium"
                        ? "bg-amber-100 text-amber-600"
                        : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {task.priority === "high"
                    ? "Alta"
                    : task.priority === "medium"
                      ? "Média"
                      : "Baixa"}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* FINANCEIRO TAB */}
      {activeTab === "Financeiro" && (
        <motion.div
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="bg-white dark:bg-[#0D1C2C] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6"
        >
          <h2 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4">
            <DollarSign className="h-4 w-4 text-[#003d9b]" />
            Financeiro do Projeto
          </h2>
          <div className="grid grid-cols-3 gap-4 mb-5">
            {[
              {
                label: "Budget Total",
                value: project.budget
                  ? formatCurrency(project.budget)
                  : "R$ 0,00",
                color: "text-slate-900 dark:text-slate-100",
              },
              {
                label: "Gasto até agora",
                value: "R$ 0,00",
                color: "text-amber-600",
              },
              {
                label: "Saldo Restante",
                value: "R$ 0,00",
                color: "text-green-600",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700"
              >
                <p className="text-xs text-slate-500 font-medium mb-1">
                  {item.label}
                </p>
                <p className={`text-xl font-bold ${item.color}`}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
            <p className="text-xs text-[#003d9b] dark:text-[#00e3fd] font-medium">
              💡 Gerencie as transações deste projeto no{" "}
              <Link
                href="/os/finance/transactions"
                className="underline font-bold"
              >
                módulo financeiro
              </Link>
              .
            </p>
          </div>
        </motion.div>
      )}

      {/* EQUIPE TAB */}
      {activeTab === "Equipe" && (
        <motion.div
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="bg-white dark:bg-[#0D1C2C] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-12 text-center"
        >
          <Users className="h-10 w-10 text-slate-200 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-500">
            Em desenvolvimento
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Esta seção será implementada na próxima fase.
          </p>
        </motion.div>
      )}
    </div>
  );
}
