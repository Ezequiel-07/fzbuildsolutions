"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Trash2, Calendar, Upload } from "lucide-react";
import {
  useUpdateTeamMember,
  useDeleteTeamMember,
  TeamMember,
} from "../api/use-team";
import { useProjects } from "@/features/projects/api/use-projects";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface EditMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: TeamMember | null;
}

export function EditMemberModal({
  isOpen,
  onClose,
  member,
}: EditMemberModalProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("Ativo");
  const [skillsText, setSkillsText] = useState("");
  const [allocations, setAllocations] = useState<
    { projectId: string; projectName: string; percentage: number }[]
  >([]);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");

  const updateMember = useUpdateTeamMember();
  const deleteMember = useDeleteTeamMember();
  const { data: projects = [] } = useProjects();
  const activeProjects = projects.filter(
    (p) => p.status !== "Fechado" && p.status !== "Done",
  );

  useEffect(() => {
    if (member) {
      setName(member.name);
      setRole(member.role);
      setStatus(member.status);
      setSkillsText(member.skills?.join(", ") || "");
      setAllocations(member.allocations || []);
      setAvatarUrl(member.avatarUrl || "");
    }
  }, [member]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !role || !member) return;

    const skillsArray = skillsText
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    await updateMember.mutateAsync({
      id: member.id,
      data: {
        name,
        role,
        status,
        skills: skillsArray,
        allocations,
        avatarUrl,
      },
    });

    onClose();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !member) return;

    setIsUploading(true);
    try {
      const storageRef = ref(storage, `avatars/${member.id}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      setAvatarUrl(url);
    } catch (error) {
      console.error("Erro no upload da foto:", error);
      alert("Erro ao enviar a imagem. Tente novamente.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (
      member &&
      window.confirm("Deseja excluir este membro da equipe permanentemente?")
    ) {
      await deleteMember.mutateAsync(member.id);
      onClose();
    }
  };

  const addAllocation = (projectId: string) => {
    const project = activeProjects.find((p) => p.id === projectId);
    if (!project) return;
    if (allocations.find((a) => a.projectId === projectId)) return;
    setAllocations([
      ...allocations,
      { projectId, projectName: project.name, percentage: 50 },
    ]);
  };

  const removeAllocation = (projectId: string) => {
    setAllocations(allocations.filter((a) => a.projectId !== projectId));
  };

  const updateAllocation = (projectId: string, percentage: number) => {
    setAllocations(
      allocations.map((a) =>
        a.projectId === projectId ? { ...a, percentage } : a,
      ),
    );
  };

  return (
    <AnimatePresence>
      {isOpen && member && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 border border-slate-100 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <Image
                    src={avatarUrl || member.avatarUrl}
                    alt={name || "Avatar do membro"}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full border border-slate-200 object-cover"
                  />
                  <label className="absolute inset-0 bg-black/50 text-white rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                    {isUploading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Upload className="w-5 h-5" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                      disabled={isUploading}
                    />
                  </label>
                </div>
                <div>
                  <h2 className="text-2xl font-heading font-extrabold text-slate-800">
                    Editar Perfil
                  </h2>
                  <p className="text-sm text-slate-500">
                    Gestão do membro e alocação
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-full transition-colors"
                  title="Excluir Membro"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#003d9b] outline-none transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Cargo / Especialidade
                  </label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#003d9b] outline-none transition-all text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Skills (Vírgula)
                  </label>
                  <input
                    type="text"
                    value={skillsText}
                    onChange={(e) => setSkillsText(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#003d9b] outline-none transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Status Atual
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#003d9b] outline-none transition-all text-sm"
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Foco">Foco (Não perturbe)</option>
                    <option value="Ausente">Ausente</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>
              </div>

              {/* Allocation Section */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Alocação em Projetos (Agenda)
                  </label>
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        addAllocation(e.target.value);
                        e.target.value = "";
                      }
                    }}
                    className="text-xs font-bold bg-[#003d9b]/10 text-[#003d9b] py-1.5 px-3 rounded-lg outline-none cursor-pointer"
                    value=""
                  >
                    <option value="" disabled>
                      + Alocar em Projeto
                    </option>
                    {activeProjects
                      .filter(
                        (p) => !allocations.find((a) => a.projectId === p.id),
                      )
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                  </select>
                </div>

                {allocations.length === 0 ? (
                  <div className="text-center py-4 bg-slate-50 rounded-xl border border-slate-100 border-dashed text-sm text-slate-400">
                    Nenhum projeto alocado.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {allocations.map((alloc) => (
                      <div
                        key={alloc.projectId}
                        className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100"
                      >
                        <Calendar className="w-4 h-4 text-[#003d9b]" />
                        <span className="flex-1 text-sm font-bold text-slate-700">
                          {alloc.projectName}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500 font-bold">
                            Dedicação:
                          </span>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={alloc.percentage}
                            onChange={(e) =>
                              updateAllocation(
                                alloc.projectId,
                                parseInt(e.target.value) || 0,
                              )
                            }
                            className="w-16 px-2 py-1 text-sm font-bold border border-slate-200 rounded outline-none text-center focus:ring-2 focus:ring-[#003d9b]"
                          />
                          <span className="text-xs font-bold text-slate-400">
                            %
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAllocation(alloc.projectId)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                          title="Remover alocação"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={updateMember.isPending}
                  className="w-full bg-[#003d9b] text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  {updateMember.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Salvar Alterações"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
