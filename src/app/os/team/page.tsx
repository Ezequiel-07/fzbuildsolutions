"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Calendar, Search, Users, Briefcase } from "lucide-react";
import { useTeam, type TeamMember } from "@/features/team/api/use-team";
import { NewMemberModal } from "@/features/team/components/new-member-modal";
import { EditMemberModal } from "@/features/team/components/edit-member-modal";
import { PageHeader } from "@/components/os/page-header";
import { Panel } from "@/components/os/panel";
import { Button } from "@/components/os/button";
import { StatusBadge } from "@/components/os/status-badge";
import { EmptyState } from "@/components/os/empty-state";
import { Skeleton } from "@/components/os/skeleton";
import Link from "next/link";

export default function TeamPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: teamMembers = [], isLoading } = useTeam();

  const filteredMembers = teamMembers.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Equipe & Talentos"
        description="Gestão de especialistas, habilidades técnicas e squads de engenharia"
        actions={
          <div className="flex items-center gap-2">
            <Link href="/os/team/schedule">
              <Button variant="secondary">
                <Calendar className="h-4 w-4" />
                <span>Matriz de Alocação</span>
              </Button>
            </Link>
            <Button variant="primary" onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4" />
              <span>Adicionar Membro</span>
            </Button>
          </div>
        }
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Panel className="p-4 flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-os-primary/10 text-os-primary">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-os-muted">Total de Membros</p>
            <p className="text-xl font-bold text-os-fg">{teamMembers.length}</p>
          </div>
        </Panel>

        <Panel className="p-4 flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-os-success/10 text-os-success">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-os-muted">Membros Alocados</p>
            <p className="text-xl font-bold text-os-fg">
              {
                teamMembers.filter(
                  (m) => m.allocations && m.allocations.length > 0,
                ).length
              }
            </p>
          </div>
        </Panel>

        <Panel className="p-4 flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-os-accent/10 text-os-accent">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-os-muted">Capacidade Semanal</p>
            <p className="text-xl font-bold text-os-fg">
              {teamMembers.length * 40}h
            </p>
          </div>
        </Panel>
      </div>

      {/* Search Input */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-os-muted" />
          <input
            type="text"
            placeholder="Buscar especialista por nome ou cargo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-os-border bg-os-surface text-xs text-os-fg focus:outline-none focus:ring-2 focus:ring-os-ring"
          />
        </div>
      </div>

      {/* Members Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-44 w-full" />
          <Skeleton className="h-44 w-full" />
          <Skeleton className="h-44 w-full" />
        </div>
      ) : filteredMembers.length === 0 ? (
        <Panel className="p-8">
          <EmptyState
            icon={Users}
            title="Nenhum membro encontrado"
            description="Cadastre especialistas na equipe para compor as squads de desenvolvimento."
            action={
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Adicionar Membro</span>
              </Button>
            }
          />
        </Panel>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              key={member.id}
              onClick={() => setSelectedMember(member)}
              className="bg-os-surface p-5 rounded-2xl border border-os-border shadow-sm hover:border-os-accent/40 cursor-pointer transition-all space-y-4 group"
            >
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  {member.avatarUrl ? (
                    <Image
                      src={member.avatarUrl}
                      alt={member.name}
                      width={44}
                      height={44}
                      className="w-11 h-11 rounded-full border border-os-border object-cover"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-os-primary/10 text-os-primary flex items-center justify-center font-bold text-sm">
                      {member.name.charAt(0)}
                    </div>
                  )}
                  <div
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-os-surface ${
                      member.color || "bg-os-success"
                    }`}
                  />
                </div>

                <div className="min-w-0">
                  <h4 className="font-bold text-xs text-os-fg group-hover:text-os-primary transition-colors truncate">
                    {member.name}
                  </h4>
                  <p className="text-[11px] text-os-muted truncate">
                    {member.role}
                  </p>
                </div>
              </div>

              {/* Skills */}
              {member.skills && member.skills.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[10px] font-mono font-bold text-os-muted uppercase tracking-wider">
                    Competências
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {member.skills.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-md bg-os-surface-2 text-os-fg text-[10px] border border-os-border"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Allocations summary */}
              <div className="pt-3 border-t border-os-border flex items-center justify-between text-xs text-os-muted">
                <div className="flex items-center gap-1.5 truncate">
                  <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">
                    {member.allocations && member.allocations.length > 0
                      ? member.allocations
                          .map((a) => `${a.projectName}`)
                          .join(", ")
                      : "Sem alocação ativa"}
                  </span>
                </div>
                <StatusBadge
                  tone={
                    member.allocations && member.allocations.length > 0
                      ? "info"
                      : "neutral"
                  }
                >
                  {member.allocations && member.allocations.length > 0
                    ? "Alocado"
                    : "Livre"}
                </StatusBadge>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modals */}
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
