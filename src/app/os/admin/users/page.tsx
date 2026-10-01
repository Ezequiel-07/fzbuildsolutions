"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserCog,
  Shield,
  Plus,
  Search,
  Edit3,
  Trash2,
  Crown,
  Eye,
} from "lucide-react";

type UserRole = "SUPER_ADMIN" | "ADMIN" | "MANAGER" | "MEMBER" | "VIEWER";

interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "active" | "inactive" | "pending";
  lastLogin: string;
  avatar: string;
}

const MOCK_USERS: SystemUser[] = [
  {
    id: "1",
    name: "Ezequiel Admin",
    email: "ezequiel@fzbuild.com",
    role: "SUPER_ADMIN",
    status: "active",
    lastLogin: "agora",
    avatar: "EA",
  },
  {
    id: "2",
    name: "Felipe Costa",
    email: "felipe@fzbuild.com",
    role: "MANAGER",
    status: "active",
    lastLogin: "1h atrás",
    avatar: "FC",
  },
  {
    id: "3",
    name: "Matheus Silva",
    email: "matheus@fzbuild.com",
    role: "MEMBER",
    status: "active",
    lastLogin: "2h atrás",
    avatar: "MS",
  },
  {
    id: "4",
    name: "Beatriz Santos",
    email: "beatriz@fzbuild.com",
    role: "MEMBER",
    status: "active",
    lastLogin: "3h atrás",
    avatar: "BS",
  },
  {
    id: "5",
    name: "Cliente Externo",
    email: "cliente@empresa.com",
    role: "VIEWER",
    status: "pending",
    lastLogin: "—",
    avatar: "CE",
  },
];

const ROLE_CONFIG: Record<
  UserRole,
  { label: string; color: string; bg: string; icon: React.ElementType }
> = {
  SUPER_ADMIN: {
    label: "Super Admin",
    color: "text-purple-700",
    bg: "bg-purple-100 dark:bg-purple-900/30",
    icon: Crown,
  },
  ADMIN: {
    label: "Admin",
    color: "text-red-600",
    bg: "bg-red-100 dark:bg-red-900/30",
    icon: Shield,
  },
  MANAGER: {
    label: "Manager",
    color: "text-blue-600",
    bg: "bg-blue-100 dark:bg-blue-900/30",
    icon: UserCog,
  },
  MEMBER: {
    label: "Member",
    color: "text-green-600",
    bg: "bg-green-100 dark:bg-green-900/30",
    icon: Users,
  },
  VIEWER: {
    label: "Viewer",
    color: "text-slate-600",
    bg: "bg-slate-100 dark:bg-slate-700/50",
    icon: Eye,
  },
};

const STATUS_CONFIG = {
  active: { label: "Ativo", color: "text-green-600", dot: "bg-green-500" },
  inactive: { label: "Inativo", color: "text-slate-400", dot: "bg-slate-300" },
  pending: { label: "Pendente", color: "text-amber-600", dot: "bg-amber-400" },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.35, ease: [0.4, 0, 0.2, 1] },
  }),
};

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [users] = useState(MOCK_USERS);

  const filtered = useMemo(
    () =>
      users.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase()) ||
          u.role.toLowerCase().includes(search.toLowerCase()),
      ),
    [users, search],
  );

  const roleCount = Object.keys(ROLE_CONFIG).reduce(
    (acc, role) => ({
      ...acc,
      [role]: users.filter((u) => u.role === role).length,
    }),
    {} as Record<UserRole, number>,
  );

  return (
    <div className="max-w-[1200px] mx-auto w-full space-y-6">
      <motion.div
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Gestão de Usuários
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {users.length} usuário{users.length !== 1 ? "s" : ""} · Controle de
            roles e permissões
          </p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#003d9b] hover:bg-[#003280] text-white text-sm font-semibold shadow-lg shadow-blue-900/20 hover:-translate-y-0.5 transition-all duration-200">
          <Plus className="h-4 w-4" />
          Convidar Usuário
        </button>
      </motion.div>

      {/* Role summary */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {(
          Object.entries(ROLE_CONFIG) as [
            UserRole,
            (typeof ROLE_CONFIG)[UserRole],
          ][]
        ).map(([role, cfg], i) => (
          <motion.div
            key={role}
            custom={i + 1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="bg-white dark:bg-[#0D1C2C] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 text-center"
          >
            <div
              className={`w-8 h-8 rounded-xl ${cfg.bg} flex items-center justify-center mx-auto mb-2`}
            >
              <cfg.icon className={`h-4 w-4 ${cfg.color}`} />
            </div>
            <p className={`text-xs font-bold ${cfg.color} mb-0.5`}>
              {cfg.label}
            </p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {roleCount[role] || 0}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Users table */}
      <motion.div
        custom={6}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="bg-white dark:bg-[#0D1C2C] rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden"
      >
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar usuários..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-[#003d9b]/20 focus:border-[#003d9b] transition-all"
            />
          </div>
        </div>
        <div className="divide-y divide-slate-50 dark:divide-slate-800">
          {filtered.map((user, i) => {
            const roleCfg = ROLE_CONFIG[user.role];
            const statusCfg = STATUS_CONFIG[user.status];
            const RoleIcon = roleCfg.icon;
            return (
              <motion.div
                key={user.id}
                custom={i + 7}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#003d9b] to-[#006875] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {user.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {user.name}
                    </p>
                    <div
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${roleCfg.bg} ${roleCfg.color}`}
                    >
                      <RoleIcon className="h-2.5 w-2.5" />
                      {roleCfg.label}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 truncate">
                    {user.email}
                  </p>
                </div>
                <div className="hidden md:flex items-center gap-2 flex-shrink-0">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`}
                  />
                  <span className={`text-xs font-medium ${statusCfg.color}`}>
                    {statusCfg.label}
                  </span>
                </div>
                <div className="hidden lg:block text-xs text-slate-400 flex-shrink-0 w-24 text-right">
                  {user.lastLogin}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button className="p-1.5 rounded-lg text-slate-400 hover:bg-blue-50 hover:text-[#003d9b] transition-colors">
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                  <button className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* RBAC info */}
      <motion.div
        custom={12}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="bg-white dark:bg-[#0D1C2C] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6"
      >
        <h2 className="font-semibold text-sm text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Shield className="h-4 w-4 text-[#003d9b]" />
          Permissões por Role (RBAC)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <th className="py-2 text-left text-slate-500 font-bold uppercase tracking-wider">
                  Permissão
                </th>
                {(
                  [
                    "SUPER_ADMIN",
                    "ADMIN",
                    "MANAGER",
                    "MEMBER",
                    "VIEWER",
                  ] as UserRole[]
                ).map((r) => (
                  <th
                    key={r}
                    className={`py-2 px-3 text-center font-bold ${ROLE_CONFIG[r].color}`}
                  >
                    {ROLE_CONFIG[r].label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {[
                {
                  perm: "Projetos — Ler",
                  vals: [true, true, true, true, true],
                },
                {
                  perm: "Projetos — Criar/Editar",
                  vals: [true, true, true, true, false],
                },
                {
                  perm: "Projetos — Excluir",
                  vals: [true, true, true, false, false],
                },
                {
                  perm: "Financeiro — Ver",
                  vals: [true, true, true, false, false],
                },
                {
                  perm: "Financeiro — Criar transações",
                  vals: [true, true, true, false, false],
                },
                {
                  perm: "CRM — Acesso completo",
                  vals: [true, true, true, true, false],
                },
                {
                  perm: "Admin — Usuários",
                  vals: [true, true, false, false, false],
                },
                {
                  perm: "Admin — Configurações",
                  vals: [true, true, false, false, false],
                },
                {
                  perm: "Admin — Logs",
                  vals: [true, true, false, false, false],
                },
              ].map((row) => (
                <tr
                  key={row.perm}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30"
                >
                  <td className="py-2.5 text-slate-600 dark:text-slate-400">
                    {row.perm}
                  </td>
                  {row.vals.map((v, i) => (
                    <td key={i} className="py-2.5 px-3 text-center">
                      {v ? (
                        <span className="text-green-500 font-bold">✓</span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
