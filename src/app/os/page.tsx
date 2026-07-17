"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Settings, Send, Plus, Activity } from "lucide-react";
import { NewProjectModal } from "@/features/projects/components/new-project-modal";
import { useProjects } from "@/features/projects/api/use-projects";
import { useTeam } from "@/features/team/api/use-team";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { ReactFlow, Background } from "@xyflow/react";
import { UserNav } from "@/features/layout/components/user-nav";
import { ProfileModal } from "@/features/layout/components/profile-modal";
import "@xyflow/react/dist/style.css";

const mockInfraData = [
  { name: "00:00", uv: 4000, pv: 2400 },
  { name: "04:00", uv: 3000, pv: 1398 },
  { name: "08:00", uv: 2000, pv: 9800 },
  { name: "12:00", uv: 2780, pv: 3908 },
  { name: "16:00", uv: 1890, pv: 4800 },
  { name: "20:00", uv: 2390, pv: 3800 },
  { name: "24:00", uv: 3490, pv: 4300 },
];

const miniFlowNodes = [
  {
    id: "1",
    position: { x: 10, y: 30 },
    data: { label: "API" },
    style: {
      width: 40,
      height: 20,
      fontSize: 8,
      padding: 2,
      background: "#00e3fd",
      color: "#003d9b",
      border: "none",
      borderRadius: 4,
    },
  },
  {
    id: "2",
    position: { x: 70, y: 10 },
    data: { label: "DB" },
    style: {
      width: 40,
      height: 20,
      fontSize: 8,
      padding: 2,
      background: "#f97316",
      color: "white",
      border: "none",
      borderRadius: 4,
    },
  },
  {
    id: "3",
    position: { x: 70, y: 60 },
    data: { label: "Auth" },
    style: {
      width: 40,
      height: 20,
      fontSize: 8,
      padding: 2,
      background: "#003d9b",
      color: "white",
      border: "none",
      borderRadius: 4,
    },
  },
];
const miniFlowEdges = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    animated: true,
    style: { stroke: "#003d9b" },
  },
  {
    id: "e1-3",
    source: "1",
    target: "3",
    animated: true,
    style: { stroke: "#003d9b" },
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { data: projects = [], isLoading: isLoadingProjects } = useProjects();
  const { data: teamMembers = [], isLoading: isLoadingTeam } = useTeam();

  const handleCardClick = (path: string) => {
    setSelectedCard(path);
    setTimeout(() => {
      router.push(path);
    }, 500); // Wait for animation to finish
  };

  // Parallax / Hover tilt effect for individual cards
  useEffect(() => {
    const cards = document.querySelectorAll(".glass-card");

    const handleMouseMove = (e: MouseEvent) => {
      const card = e.currentTarget as HTMLElement;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;
      card.style.transition = "transform 0.1s ease-out";
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    };

    const handleMouseLeave = (e: MouseEvent) => {
      const card = e.currentTarget as HTMLElement;
      card.style.transition = "transform 0.5s ease-out";
      card.style.transform =
        "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    };

    cards.forEach((card) => {
      card.addEventListener("mousemove", handleMouseMove as EventListener);
      card.addEventListener("mouseleave", handleMouseLeave as EventListener);
    });

    return () => {
      cards.forEach((card) => {
        card.removeEventListener("mousemove", handleMouseMove as EventListener);
        card.removeEventListener(
          "mouseleave",
          handleMouseLeave as EventListener,
        );
      });
    };
  }, []);

  const handleSendPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    alert(`Enviando prompt ao FZ AI Engine: "${prompt}"`);
    setPrompt("");
  };

  return (
    <div className="relative min-h-screen font-sans bg-transparent text-[#191c1e] select-none overflow-x-hidden">
      {/* Top Navigation Anchor */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-center px-4 md:px-[80px] h-20">
        <div className="bg-[#f8f9fb]/80 backdrop-blur-xl border border-slate-200/50 rounded-full px-6 md:px-8 py-2.5 flex items-center shadow-sm gap-2 max-w-full overflow-x-auto">
          <img
            src="/fzbuildsemfundo.png"
            alt="FZ Console"
            className="h-8 w-auto mr-2 md:mr-6 shrink-0"
          />
          <nav className="hidden md:flex gap-6 items-center">
            <Link
              className="font-mono text-xs font-semibold uppercase tracking-wider text-[#003d9b] border-b-2 border-[#003d9b] py-1 transition-colors"
              href="/os"
            >
              Dashboard
            </Link>
            <Link
              className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-[#003d9b] py-1 transition-colors"
              href="/os/projects"
            >
              Projetos
            </Link>
            <Link
              className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-[#003d9b] py-1 transition-colors"
              href="/os/crm"
            >
              CRM
            </Link>
            <Link
              className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-[#003d9b] py-1 transition-colors"
              href="/os/team"
            >
              Equipe
            </Link>
            <Link
              className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-[#003d9b] py-1 transition-colors"
              href="/os/finance"
            >
              Financeiro
            </Link>
          </nav>
          <div className="ml-2 md:ml-8 flex items-center gap-3 md:gap-4 text-[#003d9b] shrink-0">
            <Bell className="h-5 w-5 cursor-pointer hover:scale-110 duration-150 transition-transform" />
            <button
              onClick={() => setIsProfileModalOpen(true)}
              aria-label="Settings"
              className="hover:scale-110 duration-150 transition-transform focus:outline-none flex items-center justify-center"
            >
              <Settings className="h-5 w-5" />
            </button>
            <UserNav />
          </div>
        </div>
      </header>

      {/* Main Spatial Canvas */}
      <main className="relative min-h-screen pt-32 pb-28 px-8 flex items-center justify-center overflow-hidden">
        {/* Atmospheric Background Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#003d9b]/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#006875]/5 rounded-full blur-[150px]" />
        </div>

        <div className="relative z-10 w-full max-w-[1440px] grid grid-cols-12 gap-8 items-center">
          {/* LEFT COLUMN */}
          <div className="col-span-12 lg:col-span-3 space-y-8 flex flex-col justify-center">
            {/* Projects Panel */}
            <motion.div
              layoutId="/os/projects"
              onClick={() => handleCardClick("/os/projects")}
              className="glass-card bg-white/80 backdrop-blur-xl border border-white/40 p-6 rounded-2xl shadow-xl shadow-blue-900/5 transition-transform duration-500 transform -rotate-1 hover:rotate-0 cursor-pointer hover:shadow-2xl hover:scale-[1.02]"
              style={{
                transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)",
              }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-mono text-xs font-bold tracking-widest text-[#003d9b]">
                  PROJETOS
                </h3>
                <div className="w-2 h-2 rounded-full bg-[#006875] animate-pulse" />
              </div>
              <div className="space-y-4">
                {isLoadingProjects ? (
                  <div className="text-xs text-slate-400">
                    Carregando projetos...
                  </div>
                ) : projects.length === 0 ? (
                  <div className="text-xs text-slate-400">
                    Nenhum projeto encontrado.
                  </div>
                ) : (
                  projects.slice(0, 3).map((project) => (
                    <div key={project.id} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold mb-1 text-slate-700">
                        <span>{project.name}</span>
                        <span className="text-slate-400">
                          Status: {project.status}
                        </span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${project.status === "completed" ? "bg-green-500" : "bg-[#003d9b]"}`}
                          style={{ width: `${project.progress || 0}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>

            {/* Team Activity */}
            <motion.div
              layoutId="/os/team"
              onClick={() => handleCardClick("/os/team")}
              className="glass-card bg-white/80 backdrop-blur-xl border border-white/40 p-6 rounded-2xl shadow-xl shadow-blue-900/5 transition-transform duration-500 transform rotate-1 hover:rotate-0 cursor-pointer hover:shadow-2xl hover:scale-[1.02]"
              style={{
                transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)",
              }}
            >
              <h3 className="font-mono text-xs font-bold tracking-widest text-[#003d9b] mb-6">
                ATIVIDADE DA EQUIPE
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {isLoadingTeam ? (
                  <div className="col-span-2 text-xs text-slate-400">
                    Carregando membros...
                  </div>
                ) : teamMembers.length === 0 ? (
                  <div className="col-span-2 text-xs text-slate-400">
                    Nenhum membro cadastrado.
                  </div>
                ) : (
                  teamMembers.slice(0, 4).map((member) => (
                    <div key={member.id} className="flex items-center gap-3">
                      <img
                        src={member.avatarUrl}
                        alt={member.name}
                        className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                      />
                      <div className="flex flex-col">
                        <span
                          className="text-xs font-bold text-slate-800 line-clamp-1"
                          title={member.name}
                        >
                          {member.name.split(" ")[0]}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${member.color}`}
                          />
                          {member.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>

          {/* CENTRAL HUB */}
          <div className="col-span-12 lg:col-span-6 flex flex-col items-center justify-center relative w-full px-4">
            <div className="absolute w-[320px] h-[320px] md:w-[600px] md:h-[600px] rounded-full border border-blue-900/10 flex items-center justify-center pointer-events-none hidden sm:flex">
              <div className="w-[280px] h-[280px] md:w-[500px] md:h-[500px] rounded-full border border-cyan-500/20 animate-[spin_60s_linear_infinite] relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#003d9b] rounded-full blur-sm" />
              </div>
            </div>

            <div
              className="w-full max-w-[520px] aspect-square rounded-full bg-white/70 backdrop-blur-lg glass-card border border-white/45 flex flex-col items-center justify-center p-6 sm:p-12 text-center relative z-20 shadow-2xl shadow-blue-900/15"
              style={{
                transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)",
              }}
            >
              <div className="mb-4 sm:mb-6 flex flex-col items-center select-none">
                <div className="mb-2 sm:mb-4">
                  <img
                    src="/fzbuildsemfundo.png"
                    alt="FZ Logo"
                    className="h-16 sm:h-28 w-auto drop-shadow-md"
                  />
                </div>
                <h2 className="font-heading text-lg sm:text-[28px] font-extrabold tracking-tight leading-tight text-slate-800 uppercase">
                  CENTRAL DE COMANDO IA
                </h2>
              </div>

              <form onSubmit={handleSendPrompt} className="w-full mb-4 sm:mb-8">
                <div className="relative group">
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Descreva o fluxo do projeto para implantação..."
                    className="w-full bg-[#f3f4f6]/80 border border-slate-200 px-4 sm:px-6 py-3 sm:py-4 rounded-full text-xs sm:text-sm font-sans focus:ring-2 focus:ring-[#00e3fd]/50 focus:border-[#00e3fd] outline-none transition-all pr-12 shadow-inner text-slate-800 placeholder-slate-400"
                  />
                  <button
                    type="submit"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#003d9b] hover:scale-110 transition-transform duration-200"
                  >
                    <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>
              </form>

              <div className="grid grid-cols-2 gap-4 sm:gap-8 w-full select-none">
                <div className="flex flex-col items-center">
                  <div className="w-full h-16 sm:h-24 mb-1 sm:mb-2 bg-[#f8f9fb] rounded-xl border border-slate-100 flex items-center justify-center text-[#003d9b] font-mono text-xs">
                    <Activity className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
                  </div>
                  <span className="font-mono text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    INSIGHTS DE IA
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-full h-16 sm:h-24 mb-1 sm:mb-2 bg-[#f8f9fb] rounded-xl border border-slate-100 flex items-center justify-center text-slate-300 font-mono text-xs overflow-hidden px-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={mockInfraData}>
                        <Area
                          type="monotone"
                          dataKey="uv"
                          stroke="#003d9b"
                          fill="#003d9b"
                          fillOpacity={0.1}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <span className="font-mono text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    PREVISÕES
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="col-span-12 lg:col-span-3 space-y-8 flex flex-col justify-center">
            {/* Workflow Nodes Preview */}
            <motion.div
              layoutId="/os/workflow"
              onClick={() => handleCardClick("/os/workflow")}
              className="glass-card bg-white/80 backdrop-blur-xl border border-white/40 p-6 rounded-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500 h-64 overflow-hidden relative shadow-xl shadow-blue-900/5 cursor-pointer hover:shadow-2xl hover:scale-[1.02] flex flex-col"
              style={{
                transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)",
              }}
            >
              <h3 className="font-mono text-xs font-bold tracking-widest text-[#003d9b] mb-4">
                VISUALIZAÇÃO DE FLUXOS
              </h3>
              <div className="w-full h-full flex-grow relative bg-slate-50/50 rounded-xl border border-slate-100 overflow-hidden pointer-events-none">
                <ReactFlow
                  nodes={miniFlowNodes}
                  edges={miniFlowEdges}
                  panOnDrag={false}
                  zoomOnScroll={false}
                  nodesDraggable={false}
                  fitView
                >
                  <Background color="#cbd5e1" gap={12} size={1} />
                </ReactFlow>
              </div>
            </motion.div>

            {/* Infrastructure Map */}
            <motion.div
              layoutId="/os/infrastructure"
              onClick={() => handleCardClick("/os/finance")}
              className="glass-card bg-white/80 backdrop-blur-xl border border-white/40 p-6 rounded-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-500 h-72 shadow-xl shadow-blue-900/5 cursor-pointer hover:shadow-2xl hover:scale-[1.02] flex flex-col"
              style={{
                transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)",
              }}
            >
              <h3 className="font-mono text-xs font-bold tracking-widest text-[#003d9b] mb-4">
                MAPA DE INFRAESTRUTURA
              </h3>
              <div className="w-full flex-grow relative select-none">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockInfraData}>
                    <defs>
                      <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#00e3fd"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#00e3fd"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="pv"
                      stroke="#00e3fd"
                      fillOpacity={1}
                      fill="url(#colorPv)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Bottom Action Anchor (FAB) */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex gap-4">
        <button
          onClick={() => setIsNewProjectModalOpen(true)}
          className="bg-[#003d9b] hover:bg-[#003280] text-white px-8 py-4 rounded-full font-bold shadow-xl shadow-blue-900/25 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all text-sm font-sans"
        >
          <Plus className="h-5 w-5" />
          <span>Novo Projeto</span>
        </button>
      </div>

      <AnimatePresence>
        {selectedCard && (
          <motion.div
            layoutId={
              selectedCard === "/os/workflow" && selectedCard
                ? "/os/workflow"
                : selectedCard
            }
            className="fixed inset-0 z-[100] bg-white"
            initial={{ borderRadius: 24, opacity: 0.8 }}
            animate={{ borderRadius: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.5 }}
          />
        )}
      </AnimatePresence>
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
      />
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
}
