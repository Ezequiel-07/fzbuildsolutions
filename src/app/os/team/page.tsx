"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Star, Calendar, Search } from "lucide-react";
import { useTeam, TeamMember } from "@/features/team/api/use-team";
import { useProjects } from "@/features/projects/api/use-projects";
import { NewMemberModal } from "@/features/team/components/new-member-modal";
import { EditMemberModal } from "@/features/team/components/edit-member-modal";

export default function TeamPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: teamMembers = [], isLoading } = useTeam();
  const { data: projects = [] } = useProjects();

  const filteredMembers = teamMembers.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const topProjects = projects
    .filter((p) => p.status !== "Fechado" && p.status !== "Done")
    .slice(0, 2);
  const highlightMember = teamMembers.length > 0 ? teamMembers[0] : null;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 min-h-screen bg-transparent select-none">
      <div className="max-w-[1440px] mx-auto w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 glass-card bg-white/70 backdrop-blur-xl border border-white/40 p-6 rounded-2xl shadow-xl shadow-blue-900/5">
          <div>
            <h1 className="font-heading text-2xl font-extrabold tracking-tight text-slate-800 uppercase">
              Equipe & Alocação
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Gestão de pessoas, skills e produtividade
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar membro..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-full border border-slate-200 text-sm focus:ring-2 focus:ring-[#003d9b] outline-none"
              />
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#003d9b] text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-blue-900/20 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all text-sm font-sans"
            >
              <Plus className="h-4 w-4" />
              <span>Adicionar Membro</span>
            </button>
          </div>
        </div>

        {/* Dashboard Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Members Grid */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="text-sm text-slate-500 text-center py-8">
                Carregando equipe do Firestore...
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="text-sm text-slate-500 text-center py-8 glass-card bg-white/50 border border-white/40 rounded-3xl">
                Nenhum membro encontrado. Cadastre um novo!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredMembers.map((member, idx) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={member.id}
                    className="glass-card bg-white/80 backdrop-blur-md border border-white/40 p-5 rounded-2xl shadow-lg shadow-blue-900/5 hover:scale-[1.02] transition-transform"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img
                            src={member.avatarUrl}
                            alt={member.name}
                            className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                          />
                          <div
                            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${member.color}`}
                            title={member.status}
                          />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800">
                            {member.name}
                          </h4>
                          <p className="text-xs text-slate-500">
                            {member.role}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                        Top Skills
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {member.skills?.map((skill) => (
                          <span
                            key={skill}
                            className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-[10px] font-bold border border-slate-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2 text-slate-500 text-xs">
                        <Calendar className="w-3.5 h-3.5" />
                        {member.allocations && member.allocations.length > 0 ? (
                          <span className="font-bold text-slate-600 line-clamp-1">
                            {member.allocations
                              .map((a) => `${a.projectName} (${a.percentage}%)`)
                              .join(", ")}
                          </span>
                        ) : (
                          <span>Sem alocação</span>
                        )}
                      </div>
                      <button
                        onClick={() => setSelectedMember(member)}
                        className="text-[#003d9b] text-xs font-bold hover:underline flex-shrink-0 ml-2"
                      >
                        Ver Perfil
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Productivity & Allocation */}
          <div className="space-y-6">
            <div className="glass-card bg-[#f8f9fb]/80 backdrop-blur-xl border border-white/40 p-6 rounded-3xl shadow-xl shadow-blue-900/5">
              <h3 className="font-mono text-xs font-bold tracking-widest text-[#003d9b] uppercase mb-4">
                Alocação Atual
              </h3>
              <div className="space-y-4">
                {topProjects.length === 0 ? (
                  <div className="text-xs text-slate-500">
                    Nenhum projeto ativo no momento.
                  </div>
                ) : (
                  topProjects.map((project, i) => (
                    <div key={project.id}>
                      <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                        <span>{project.name}</span>
                        <span>{project.progress || 0}%</span>
                      </div>
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${i === 0 ? "bg-[#003d9b]" : "bg-[#00e3fd]"}`}
                          style={{ width: `${project.progress || 0}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="glass-card bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-6 rounded-3xl shadow-xl text-white">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm">
                  <Star className="w-5 h-5 text-yellow-400" />
                </div>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Destaque da Sprint
              </p>
              {highlightMember ? (
                <>
                  <h3 className="font-bold text-lg text-white mb-1">
                    {highlightMember.name}
                  </h3>
                  <p className="text-xs text-slate-300">
                    Maior engajamento da equipe com{" "}
                    {highlightMember.loggedHours || 0} horas registradas.
                  </p>
                </>
              ) : (
                <p className="text-xs text-slate-300">Nenhum membro ativo.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <NewMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <EditMemberModal
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
        member={selectedMember}
      />
    </div>
  );
}
