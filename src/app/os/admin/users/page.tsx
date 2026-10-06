"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Plus, Search, Edit3, Trash2 } from "lucide-react";
import {
  useSystemUsers,
  useCreateSystemUser,
  useUpdateSystemUser,
  useDeleteSystemUser,
  type SystemUser,
  type UserRole,
  type UserStatus,
} from "@/features/admin/api/use-system-users";
import { PageHeader } from "@/components/os/page-header";
import { Panel } from "@/components/os/panel";
import { Button } from "@/components/os/button";
import { StatusBadge } from "@/components/os/status-badge";
import { EmptyState } from "@/components/os/empty-state";
import { Skeleton } from "@/components/os/skeleton";
import { ConfirmDialog } from "@/components/os/confirm-dialog";
import { toast } from "sonner";

const ROLE_CONFIG: Record<
  UserRole,
  { label: string; tone: "accent" | "danger" | "info" | "success" | "neutral" }
> = {
  SUPER_ADMIN: { label: "Super Admin", tone: "accent" },
  ADMIN: { label: "Admin", tone: "danger" },
  MANAGER: { label: "Manager", tone: "info" },
  MEMBER: { label: "Member", tone: "success" },
  VIEWER: { label: "Viewer", tone: "neutral" },
};

export default function AdminUsersPage() {
  const { data: users = [], isLoading } = useSystemUsers();
  const createUser = useCreateSystemUser();
  const updateUser = useUpdateSystemUser();
  const deleteUser = useDeleteSystemUser();

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("MEMBER");
  const [status, setStatus] = useState<UserStatus>("ACTIVE");
  const [department, setDepartment] = useState("Engenharia");

  const openNewModal = () => {
    setEditingUser(null);
    setName("");
    setEmail("");
    setRole("MEMBER");
    setStatus("ACTIVE");
    setDepartment("Engenharia");
    setIsModalOpen(true);
  };

  const openEditModal = (u: SystemUser) => {
    setEditingUser(u);
    setName(u.name);
    setEmail(u.email);
    setRole(u.role);
    setStatus(u.status);
    setDepartment(u.department || "Geral");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Preencha nome e e-mail.");
      return;
    }

    try {
      if (editingUser) {
        await updateUser.mutateAsync({
          id: editingUser.id,
          data: { name, email, role, status, department },
        });
        toast.success("Usuário atualizado com sucesso!");
      } else {
        await createUser.mutateAsync({
          name,
          email,
          role,
          status,
          department,
          avatar: name
            .split(" ")
            .map((w) => w[0])
            .slice(0, 2)
            .join("")
            .toUpperCase(),
        });
        toast.success("Usuário cadastrado com sucesso!");
      }
      setIsModalOpen(false);
    } catch {
      toast.error("Erro ao salvar usuário.");
    }
  };

  const handleDelete = async () => {
    if (!deletingUserId) return;
    try {
      await deleteUser.mutateAsync(deletingUserId);
      toast.success("Usuário removido.");
      setDeletingUserId(null);
    } catch {
      toast.error("Erro ao remover usuário.");
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestão de Usuários & RBAC"
        description="Controle granular de contas de acesso, papéis e permissões do sistema operacional"
        actions={
          <Button variant="primary" onClick={openNewModal}>
            <Plus className="h-4 w-4" />
            <span>Convidar Usuário</span>
          </Button>
        }
      />

      {/* Role Counts */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {(Object.keys(ROLE_CONFIG) as UserRole[]).map((r) => {
          const cfg = ROLE_CONFIG[r];
          const count = users.filter((u) => u.role === r).length;

          return (
            <Panel key={r} className="p-3.5 text-center space-y-1">
              <StatusBadge tone={cfg.tone}>{cfg.label}</StatusBadge>
              <p className="text-xl font-bold text-os-fg">{count}</p>
            </Panel>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-os-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, e-mail ou perfil de acesso..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-os-border bg-os-surface text-xs text-os-fg focus:outline-none focus:ring-2 focus:ring-os-ring"
          />
        </div>
      </div>

      {/* Users Table */}
      <Panel className="overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={Users}
              title="Nenhum usuário encontrado"
              description="Cadastre colaboradores para atribuir papéis de governança na software house."
              action={
                <Button variant="primary" size="sm" onClick={openNewModal}>
                  <Plus className="h-3.5 w-3.5" />
                  <span>Cadastrar Usuário</span>
                </Button>
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-os-border bg-os-surface-2/60 text-os-muted font-mono font-medium">
                  <th className="py-3 px-4">USUÁRIO</th>
                  <th className="py-3 px-4">DEPARTAMENTO</th>
                  <th className="py-3 px-4">PAPEL (RBAC)</th>
                  <th className="py-3 px-4">STATUS</th>
                  <th className="py-3 px-4 text-right">AÇÕES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-os-border">
                {filteredUsers.map((user) => {
                  const roleCfg = ROLE_CONFIG[user.role] || ROLE_CONFIG.MEMBER;
                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-os-surface-2/40 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-os-primary/10 text-os-primary flex items-center justify-center font-bold text-xs flex-shrink-0">
                            {user.avatar || user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-os-fg">
                              {user.name}
                            </p>
                            <p className="text-[11px] text-os-muted">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-os-muted font-mono text-[11px]">
                        {user.department || "Engenharia"}
                      </td>

                      <td className="py-3 px-4">
                        <StatusBadge tone={roleCfg.tone}>
                          {roleCfg.label}
                        </StatusBadge>
                      </td>

                      <td className="py-3 px-4">
                        <StatusBadge
                          tone={
                            user.status === "ACTIVE"
                              ? "success"
                              : user.status === "PENDING"
                                ? "warning"
                                : "neutral"
                          }
                        >
                          {user.status === "ACTIVE"
                            ? "Ativo"
                            : user.status === "PENDING"
                              ? "Pendente"
                              : "Inativo"}
                        </StatusBadge>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(user)}
                            className="p-1.5 text-os-muted hover:text-os-primary hover:bg-os-surface-2 rounded-lg transition-colors"
                            title="Editar Usuário"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingUserId(user.id)}
                            className="p-1.5 text-os-muted hover:text-os-danger hover:bg-os-danger/10 rounded-lg transition-colors"
                            title="Remover Usuário"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {/* Modal Criar / Editar Usuário */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-os-surface rounded-2xl border border-os-border shadow-2xl p-6 space-y-4"
          >
            <h2 className="text-base font-bold text-os-fg">
              {editingUser ? "Editar Usuário" : "Convidar Usuário"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-medium text-os-fg">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Ezequiel Antunes"
                  className="w-full p-2 rounded-xl border border-os-border bg-os-surface text-xs text-os-fg focus:outline-none focus:ring-2 focus:ring-os-ring"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-os-fg">
                  E-mail Corporativo *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@fzbuild.com"
                  className="w-full p-2 rounded-xl border border-os-border bg-os-surface text-xs text-os-fg focus:outline-none focus:ring-2 focus:ring-os-ring"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-os-fg">
                    Papel (RBAC)
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full p-2 rounded-xl border border-os-border bg-os-surface text-xs text-os-fg focus:outline-none focus:ring-2 focus:ring-os-ring"
                  >
                    <option value="SUPER_ADMIN">Super Admin</option>
                    <option value="ADMIN">Admin</option>
                    <option value="MANAGER">Manager</option>
                    <option value="MEMBER">Member</option>
                    <option value="VIEWER">Viewer</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-os-fg">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as UserStatus)}
                    className="w-full p-2 rounded-xl border border-os-border bg-os-surface text-xs text-os-fg focus:outline-none focus:ring-2 focus:ring-os-ring"
                  >
                    <option value="ACTIVE">Ativo</option>
                    <option value="PENDING">Pendente</option>
                    <option value="INACTIVE">Inativo</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-os-fg">
                  Departamento / Squad
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Ex: Engenharia, Comercial, Operações"
                  className="w-full p-2 rounded-xl border border-os-border bg-os-surface text-xs text-os-fg focus:outline-none focus:ring-2 focus:ring-os-ring"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-os-border">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  {editingUser ? "Salvar Alterações" : "Convidar"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={!!deletingUserId}
        onOpenChange={(open) => !open && setDeletingUserId(null)}
        title="Remover Usuário"
        description="Tem certeza que deseja remover este usuário do sistema? O acesso será revogado imediatamente."
        confirmLabel="Sim, remover"
        cancelLabel="Cancelar"
        tone="danger"
        onConfirm={handleDelete}
      />
    </div>
  );
}
