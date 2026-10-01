"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
  Users,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const DAYS = [
  { key: "seg", label: "Segunda", date: "28 Set" },
  { key: "ter", label: "Terça", date: "29 Set" },
  { key: "qua", label: "Quarta", date: "30 Set" },
  { key: "qui", label: "Quinta", date: "01 Out" },
  { key: "sex", label: "Sexta", date: "02 Out" },
];

const INITIAL_SCHEDULE = [
  {
    member: "Ezequiel",
    role: "Fullstack / Tech Lead",
    avatar: "E",
    online: true,
    capacityHours: 40,
    allocations: {
      seg: {
        project: "EZYX Logistics",
        task: "API Gateway & Auth",
        hours: 8,
        color:
          "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800",
      },
      ter: {
        project: "EZYX Logistics",
        task: "Database Indexing",
        hours: 8,
        color:
          "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800",
      },
      qua: {
        project: "FZ OS Interno",
        task: "Módulo Financeiro & AI",
        hours: 8,
        color:
          "bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 border-cyan-300 dark:border-cyan-800",
      },
      qui: {
        project: "Bioma",
        task: "Code Review & PRs",
        hours: 6,
        color:
          "bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800",
      },
      sex: {
        project: "FZ OS Interno",
        task: "Deploy & Validação",
        hours: 8,
        color:
          "bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 border-cyan-300 dark:cyan-blue-800",
      },
    },
  },
  {
    member: "Felipe",
    role: "Growth & Marketing",
    avatar: "F",
    online: false,
    capacityHours: 40,
    allocations: {
      seg: null,
      ter: {
        project: "Bioma",
        task: "Alinhamento Comercial",
        hours: 4,
        color:
          "bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800",
      },
      qua: {
        project: "Lead Gen",
        task: "Campanhas B2B SaaS",
        hours: 6,
        color:
          "bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800",
      },
      qui: {
        project: "Lead Gen",
        task: "Follow-up Propostas",
        hours: 6,
        color:
          "bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800",
      },
      sex: null,
    },
  },
  {
    member: "Matheus",
    role: "Backend Engineer",
    avatar: "M",
    online: true,
    capacityHours: 40,
    allocations: {
      seg: {
        project: "EZYX Logistics",
        task: "Webhooks de Carga",
        hours: 8,
        color:
          "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800",
      },
      ter: null,
      qua: {
        project: "EZYX Logistics",
        task: "Kafka Consumer Setup",
        hours: 8,
        color:
          "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800",
      },
      qui: {
        project: "Infra & DevOps",
        task: "Backup Scheduler",
        hours: 6,
        color:
          "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800",
      },
      sex: {
        project: "EZYX Logistics",
        task: "Testes de Carga",
        hours: 8,
        color:
          "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800",
      },
    },
  },
  {
    member: "Beatriz",
    role: "Project Manager",
    avatar: "B",
    online: true,
    capacityHours: 40,
    allocations: {
      seg: {
        project: "Gestão FZ",
        task: "Sprint Planning",
        hours: 6,
        color:
          "bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800",
      },
      ter: {
        project: "EZYX Logistics",
        task: "Daily & Bloqueios",
        hours: 4,
        color:
          "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800",
      },
      qua: null,
      qui: {
        project: "Bioma",
        task: "Review com Stakeholders",
        hours: 5,
        color:
          "bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800",
      },
      sex: {
        project: "Gestão FZ",
        task: "Retrospectiva & Métricas",
        hours: 6,
        color:
          "bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800",
      },
    },
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.35, ease: [0.4, 0, 0.2, 1] },
  }),
};

export default function SchedulePage() {
  const [schedule] = useState(INITIAL_SCHEDULE);
  const [weekOffset, setWeekOffset] = useState(0);

  const totalAllocatedHours = schedule.reduce((acc, member) => {
    const hours = Object.values(member.allocations).reduce(
      (hAcc, item) => hAcc + (item?.hours || 0),
      0,
    );
    return acc + hours;
  }, 0);

  const totalCapacity = schedule.length * 40;
  const occupancyRate = Math.round((totalAllocatedHours / totalCapacity) * 100);

  const handleQuickAssign = () => {
    toast.info(
      "Para alocar ou editar um bloco, clique diretamente no slot desejado.",
    );
  };

  return (
    <div className="max-w-[1400px] mx-auto w-full space-y-6">
      {/* HEADER */}
      <motion.div
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div>
          <div className="flex items-center gap-3">
            <Link
              href="/os/team"
              className="text-xs font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              Equipe
            </Link>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Agenda & Alocação
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Distribuição de capacidade semanal dos squads da FZ Build
          </p>
        </div>

        {/* CONTROLS */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white dark:bg-[#0D1C2C] border border-slate-200 dark:border-slate-800 rounded-xl p-1">
            <button
              onClick={() => setWeekOffset((p) => p - 1)}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
              {weekOffset === 0
                ? "Esta Semana"
                : weekOffset > 0
                  ? `+${weekOffset} Semanas`
                  : `${weekOffset} Semanas`}
            </span>
            <button
              onClick={() => setWeekOffset((p) => p + 1)}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={handleQuickAssign}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#003d9b] text-white text-xs font-semibold hover:bg-[#002d73] transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Nova Alocação
          </button>
        </div>
      </motion.div>

      {/* CAPACITY OVERVIEW */}
      <motion.div
        custom={1}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <div className="bg-white dark:bg-[#0D1C2C] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Horas Alocadas</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {totalAllocatedHours}h
            </p>
            <p className="text-[11px] text-slate-500">
              De {totalCapacity}h de capacidade total
            </p>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-[#003d9b] dark:text-[#00e3fd]">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#0D1C2C] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">
              Taxa de Ocupação
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {occupancyRate}%
            </p>
            <div className="w-28 h-2 rounded-full bg-slate-100 dark:bg-slate-800 mt-1 overflow-hidden">
              <div
                className={`h-full rounded-full ${occupancyRate > 85 ? "bg-amber-500" : "bg-green-500"}`}
                style={{ width: `${occupancyRate}%` }}
              />
            </div>
          </div>
          <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#0D1C2C] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Membros Ativos</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {schedule.length}
            </p>
            <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {schedule.filter((m) => m.online).length} online agora
            </p>
          </div>
          <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600">
            <Users className="h-5 w-5" />
          </div>
        </div>
      </motion.div>

      {/* SCHEDULE WEEKLY GRID */}
      <motion.div
        custom={2}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="bg-white dark:bg-[#0D1C2C] rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-900/50">
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider w-64">
                  Membro & Papel
                </th>
                {DAYS.map((d) => (
                  <th
                    key={d.key}
                    className="py-4 px-4 text-xs font-semibold text-slate-600 dark:text-slate-300 text-center"
                  >
                    <p>{d.label}</p>
                    <span className="text-[10px] font-mono text-slate-400 font-normal">
                      {d.date}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {schedule.map((member) => {
                const memberTotalHours = Object.values(
                  member.allocations,
                ).reduce((acc, i) => acc + (i?.hours || 0), 0);
                return (
                  <tr
                    key={member.member}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    {/* MEMBER INFO */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#003d9b] to-[#006875] flex items-center justify-center text-white font-bold text-sm">
                            {member.avatar}
                          </div>
                          <span
                            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-[#0D1C2C] ${
                              member.online
                                ? "bg-emerald-500"
                                : "bg-slate-300 dark:bg-slate-600"
                            }`}
                          />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {member.member}
                          </p>
                          <p className="text-xs text-slate-400">
                            {member.role}
                          </p>
                          <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                            {memberTotalHours}h / 40h alocadas
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* DAILY SLOTS */}
                    {DAYS.map((d) => {
                      const alloc =
                        member.allocations[
                          d.key as keyof typeof member.allocations
                        ];
                      return (
                        <td key={d.key} className="py-3 px-2 align-top">
                          {alloc ? (
                            <div
                              className={`p-2.5 rounded-xl border ${alloc.color} text-xs transition-transform hover:scale-[1.02] cursor-pointer`}
                            >
                              <p className="font-bold truncate">
                                {alloc.project}
                              </p>
                              <p className="text-[10px] opacity-90 truncate mt-0.5">
                                {alloc.task}
                              </p>
                              <div className="flex items-center justify-between mt-2 pt-1 border-t border-current/15 text-[9px] font-mono">
                                <span>{alloc.hours}h</span>
                                <span>100%</span>
                              </div>
                            </div>
                          ) : (
                            <div className="h-20 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center text-[11px] text-slate-300 dark:text-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
                              Livre
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
