"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { useCreateTeamMember } from "../api/use-team";

interface NewMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewMemberModal({ isOpen, onClose }: NewMemberModalProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("Ativo");
  const [skillsText, setSkillsText] = useState("");

  const createMember = useCreateTeamMember();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !role) return;

    const skillsArray = skillsText
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    // Some random default values for aesthetic purpose
    const colors = [
      "bg-blue-500",
      "bg-purple-500",
      "bg-green-500",
      "bg-orange-500",
      "bg-[#00e3fd]",
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const avatar = `https://i.pravatar.cc/150?u=${name.replace(/\s+/g, "")}`;

    await createMember.mutateAsync({
      name,
      role,
      status,
      skills: skillsArray,
      avatarUrl: avatar,
      color: randomColor,
      loggedHours: 0,
    });

    setName("");
    setRole("");
    setStatus("Ativo");
    setSkillsText("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 border border-slate-100"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-heading font-extrabold text-slate-800 mb-6">
              Adicionar Membro
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#003d9b] focus:border-transparent outline-none transition-all text-sm"
                  placeholder="Ex: Ana Costa"
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
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#003d9b] focus:border-transparent outline-none transition-all text-sm"
                  placeholder="Ex: UI/UX Designer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Skills (Separado por vírgula)
                </label>
                <input
                  type="text"
                  value={skillsText}
                  onChange={(e) => setSkillsText(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#003d9b] focus:border-transparent outline-none transition-all text-sm"
                  placeholder="Ex: Figma, Framer, React"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Status Atual
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#003d9b] focus:border-transparent outline-none transition-all text-sm"
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Foco">Foco (Não perturbe)</option>
                  <option value="Ausente">Ausente</option>
                  <option value="Offline">Offline</option>
                </select>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={createMember.isPending}
                  className="w-full bg-[#003d9b] text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  {createMember.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Cadastrar Membro"
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
