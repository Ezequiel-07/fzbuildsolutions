"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  FolderKanban,
  Users,
  DollarSign,
  Brain,
  GitBranch,
  Server,
  Settings,
  Bell,
  LogOut,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  BookOpen,
  BarChart3,
  ListChecks,
  UserCog,
  ScrollText,
  Calendar,
  Menu,
  X,
  Search,
  Sparkles,
  Send,
  ArrowRight,
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  children?: { href: string; label: string; icon: React.ElementType }[];
};

const navItems: NavItem[] = [
  {
    href: "/os",
    label: "Overview",
    icon: LayoutGrid,
  },
  {
    href: "/os/projects",
    label: "Projetos",
    icon: FolderKanban,
    children: [
      { href: "/os/projects", label: "Todos os Projetos", icon: ListChecks },
    ],
  },
  {
    href: "/os/finance",
    label: "Financeiro",
    icon: DollarSign,
    children: [
      { href: "/os/finance", label: "Painel", icon: BarChart3 },
      {
        href: "/os/finance/transactions",
        label: "Transações",
        icon: BookOpen,
      },
      { href: "/os/finance/budget", label: "Orçamentos", icon: DollarSign },
      { href: "/os/finance/reports", label: "Relatórios", icon: ScrollText },
    ],
  },
  {
    href: "/os/crm",
    label: "CRM",
    icon: Brain,
    children: [
      { href: "/os/crm", label: "Pipeline", icon: Brain },
      { href: "/os/crm/leads", label: "Leads", icon: Users },
    ],
  },
  {
    href: "/os/team",
    label: "Equipe",
    icon: Users,
    children: [
      { href: "/os/team", label: "Membros", icon: Users },
      { href: "/os/team/schedule", label: "Agenda", icon: Calendar },
    ],
  },
  {
    href: "/os/workflow",
    label: "Workflow",
    icon: GitBranch,
  },
  {
    href: "/os/infrastructure",
    label: "Infraestrutura",
    icon: Server,
  },
  {
    href: "/os/notifications",
    label: "Notificações",
    icon: Bell,
    badge: "3",
  },
  {
    href: "/os/admin",
    label: "Admin",
    icon: Settings,
    children: [
      { href: "/os/admin/users", label: "Usuários", icon: UserCog },
      { href: "/os/admin/settings", label: "Configurações", icon: Settings },
      { href: "/os/admin/logs", label: "Logs de Auditoria", icon: ScrollText },
    ],
  },
];

function NavItemComponent({
  item,
  pathname,
  collapsed,
  onNavigate,
}: {
  item: NavItem;
  pathname: string;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const isActive =
    pathname === item.href ||
    (item.href !== "/os" && pathname.startsWith(item.href));

  const hasChildren = item.children && item.children.length > 0;
  const [open, setOpen] = useState(isActive && hasChildren);
  const Icon = item.icon;

  if (hasChildren && !collapsed) {
    return (
      <div>
        <button
          onClick={() => setOpen((v) => !v)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
            isActive
              ? "fz-nav-active-light text-[#003d9b] dark:text-[#00e3fd]"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100"
          }`}
        >
          <Icon
            className={`h-4 w-4 flex-shrink-0 transition-colors ${
              isActive
                ? "text-[#003d9b] dark:text-[#00e3fd]"
                : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"
            }`}
          />
          <span className="flex-1 text-left truncate font-medium">
            {item.label}
          </span>
          <ChevronDown
            className={`h-3.5 w-3.5 flex-shrink-0 transition-transform duration-200 text-slate-400 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="mt-1 ml-3 pl-4 border-l border-slate-200 dark:border-slate-800 space-y-0.5 pb-1">
                {item.children!.map((child) => {
                  const ChildIcon = child.icon;
                  const childActive = pathname === child.href;
                  return (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={onNavigate}
                      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                        childActive
                          ? "bg-[#003d9b]/10 text-[#003d9b] dark:text-[#00e3fd] font-semibold"
                          : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200"
                      }`}
                    >
                      <ChildIcon className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="truncate">{child.label}</span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="relative group/tooltip">
      <Link
        href={item.href}
        onClick={onNavigate}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative ${
          collapsed ? "justify-center" : ""
        } ${
          isActive
            ? "fz-nav-active-light text-[#003d9b] dark:text-[#00e3fd]"
            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100"
        }`}
      >
        <Icon
          className={`h-4 w-4 flex-shrink-0 ${
            isActive
              ? "text-[#003d9b] dark:text-[#00e3fd]"
              : "text-slate-400 dark:text-slate-500"
          }`}
        />
        {!collapsed && (
          <span className="truncate font-medium">{item.label}</span>
        )}
        {!collapsed && item.badge && (
          <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[#003d9b] text-white">
            {item.badge}
          </span>
        )}
      </Link>
      {collapsed && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1 rounded-md bg-slate-900 text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 pointer-events-none z-50 shadow-lg">
          {item.label}
        </div>
      )}
    </div>
  );
}

const COMMAND_ITEMS = [
  {
    group: "Projetos",
    label: "Abrir Portfólio de Projetos",
    href: "/os/projects",
    icon: FolderKanban,
  },
  {
    group: "Projetos",
    label: "EZYX Logistics (SaaS)",
    href: "/os/projects",
    icon: FolderKanban,
  },
  {
    group: "Financeiro",
    label: "Planilha de Transações (Spreadsheet)",
    href: "/os/finance/transactions",
    icon: BookOpen,
  },
  {
    group: "Financeiro",
    label: "Painel & Visão Geral",
    href: "/os/finance",
    icon: BarChart3,
  },
  {
    group: "Financeiro",
    label: "Orçamentos por Projeto",
    href: "/os/finance/budget",
    icon: DollarSign,
  },
  {
    group: "Financeiro",
    label: "Relatórios & DRE",
    href: "/os/finance/reports",
    icon: ScrollText,
  },
  { group: "CRM", label: "Pipeline Comercial", href: "/os/crm", icon: Brain },
  {
    group: "CRM",
    label: "Tabela de Leads (Spreadsheet)",
    href: "/os/crm/leads",
    icon: Users,
  },
  {
    group: "Equipe",
    label: "Membros da Equipe",
    href: "/os/team",
    icon: Users,
  },
  {
    group: "Equipe",
    label: "Agenda & Alocação Semanal",
    href: "/os/team/schedule",
    icon: Calendar,
  },
  {
    group: "Automação",
    label: "Editor de Workflows (React Flow)",
    href: "/os/workflow",
    icon: GitBranch,
  },
  {
    group: "Infraestrutura",
    label: "Status dos Servidores & Cloud",
    href: "/os/infrastructure",
    icon: Server,
  },
  {
    group: "Sistema",
    label: "Configurações Gerais & MFA",
    href: "/os/admin/settings",
    icon: Settings,
  },
  {
    group: "Sistema",
    label: "Logs de Auditoria",
    href: "/os/admin/logs",
    icon: ScrollText,
  },
  {
    group: "Sistema",
    label: "Central de Notificações",
    href: "/os/notifications",
    icon: Bell,
  },
];

export default function OSLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Command Palette & FZ AI State
  const [commandOpen, setCommandOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState("");
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState<
    Array<{ role: "ai" | "user"; text: string }>
  >([
    {
      role: "ai",
      text: "Olá, Ezequiel! Sou a FZ AI do seu sistema operacional. Identifiquei 3 pontos que requerem sua atenção: proposta comercial Bioma em análise, 1 despesa com vencimento próximo e o milestone do EZYX em 82%. Como posso ajudar hoje?",
    },
  ]);
  const [aiInput, setAiInput] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen((p) => !p);
      }
      if (e.key === "Escape") {
        setCommandOpen(false);
        setAiDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleCommandSelect = (href: string) => {
    setCommandOpen(false);
    setCommandQuery("");
    router.push(href);
  };

  const handleSendAi = (overrideText?: string) => {
    const query = overrideText || aiInput;
    if (!query.trim()) return;

    const userMsg = { role: "user" as const, text: query };
    let aiResponse = "Analisando dados do sistema operacional FZ Build...";

    const q = query.toLowerCase();
    if (q.includes("ezyx") || q.includes("gastamos") || q.includes("gasto")) {
      aiResponse =
        "O projeto EZYX Logistics consumiu R$ 14.820 em setembro (+8,2% vs agosto). Principais centros de custo: Infraestrutura Cloud (R$ 3.420), Desenvolvimento (R$ 8.900) e Serviços (R$ 2.500). Saldo do budget: R$ 37.700 restantes.";
    } else if (
      q.includes("fluxo") ||
      q.includes("caixa") ||
      q.includes("saldo")
    ) {
      aiResponse =
        "O saldo consolidado da FZ Build é de R$ 38.420,00. Contas a receber previstas no mês: R$ 21.300. Contas a pagar: R$ 8.420. Fluxo líquido projetado: +R$ 51.200.";
    } else if (
      q.includes("infra") ||
      q.includes("servidor") ||
      q.includes("uptime")
    ) {
      aiResponse =
        "Todos os 6 clusters em nuvem da FZ Build estão operando com 99.98% de uptime. Região primária: us-central1 (Latência: 24ms). Sem incidentes ativos.";
    } else if (q.includes("bioma") || q.includes("proposta")) {
      aiResponse =
        "A proposta comercial da Bioma (R$ 50.000) foi enviada e está sob análise pelo cliente. Próximo passo sugerido: follow-up com o diretor de TI amanhã às 14h.";
    } else {
      aiResponse = `Recebi sua solicitação: "${query}". Contexto operacional atualizado. Deseja registrar isso como uma tarefa no 'Meu Dia' ou criar uma notificação para o time?`;
    }

    setAiMessages((prev) => [
      ...prev,
      userMsg,
      { role: "ai" as const, text: aiResponse },
    ]);
    setAiInput("");
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (err) {
      console.error("Logout Error:", err);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="relative flex min-h-screen bg-[#F6F8FB] dark:bg-[#06111F]">
      {/* Static background — NO VIDEO */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#003d9b]/3 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#00e3fd]/3 rounded-full blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #003d9b 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className={`fixed left-0 top-0 h-full z-50 flex flex-col bg-white dark:bg-[#0A1624] border-r border-[#E2E8F0] dark:border-[#162235] shadow-sm overflow-hidden
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          transition-transform lg:transition-none
        `}
        style={{ minWidth: collapsed ? 72 : 240 }}
      >
        {/* Sidebar Header */}
        <div
          className={`flex items-center h-16 border-b border-[#E2E8F0] dark:border-[#162235] flex-shrink-0 ${collapsed ? "justify-center px-3" : "px-4 gap-3"}`}
        >
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <Image
              src="/fzbuildsemfundo.png"
              alt="FZ Build Solutions"
              width={34}
              height={34}
              className="h-8 w-auto flex-shrink-0"
              style={{ width: "auto", height: "auto" }}
            />
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15 }}
                  className="flex flex-col min-w-0"
                >
                  <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-slate-100 uppercase leading-none">
                    FZ BUILD
                  </span>
                  <span className="font-bold text-[8.5px] tracking-widest text-[#003D9B] dark:text-[#00E3FD] uppercase mt-0.5 leading-none">
                    SOLUTIONS
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 transition-colors flex-shrink-0"
              aria-label="Colapsar sidebar"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Expand button when collapsed */}
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="mx-auto mt-2 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 transition-colors"
            aria-label="Expandir sidebar"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
          {navItems.map((item) => (
            <NavItemComponent
              key={item.href}
              item={item}
              pathname={pathname}
              collapsed={collapsed}
              onNavigate={() => setMobileOpen(false)}
            />
          ))}
        </nav>

        {/* Sidebar Footer with User Card */}
        <div className="border-t border-[#E2E8F0] dark:border-[#162235] p-3 flex-shrink-0 space-y-2 bg-slate-50/50 dark:bg-[#07101B]/50">
          {/* User Profile Card matching Design System */}
          <Link
            href="/os/admin/settings"
            className={`flex items-center gap-3 p-2 rounded-xl bg-white dark:bg-[#0D1C2C] border border-slate-200/80 dark:border-slate-800 hover:border-[#003D9B]/30 dark:hover:border-[#00E3FD]/30 transition-all group ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-[#003D9B] to-[#00E3FD] p-[1.5px]">
              <div className="w-full h-full rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                EA
              </div>
            </div>
            {!collapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                    Ezequiel Antunes
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    Administrador
                  </p>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#003D9B] dark:group-hover:text-[#00E3FD] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </>
            )}
          </Link>

          {/* Quick theme & logout row */}
          <div
            className={`flex items-center ${collapsed ? "flex-col" : "justify-between"} gap-1 pt-1`}
          >
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              title="Alternar tema"
              aria-label="Alternar tema"
            >
              <div className="relative h-4 w-4">
                <Sun className="h-4 w-4 absolute rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
                <Moon className="h-4 w-4 absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-cyan-400" />
              </div>
            </button>

            {!collapsed && (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>ONLINE</span>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 transition-colors"
              title="Sair do sistema"
              aria-label="Sair do sistema"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.aside>

      {/* MAIN CONTENT */}
      <div
        className="relative z-10 flex-1 flex flex-col min-h-screen transition-all duration-300"
        style={{ marginLeft: collapsed ? 72 : 240 }}
      >
        {/* Top Institutional Header Bar matching Design System */}
        <div className="hidden lg:flex items-center justify-between px-6 py-2.5 bg-white/70 dark:bg-[#06111F]/70 backdrop-blur-md border-b border-[#E2E8F0] dark:border-[#162235] text-xs">
          <div className="flex items-center gap-6">
            <span className="font-extrabold text-xs text-slate-900 dark:text-slate-100 tracking-wider">
              FZ BUILD SOLUTIONS
            </span>
            <div className="h-3 w-px bg-slate-200 dark:bg-slate-800" />
            <div className="flex items-center gap-3 text-[11px] font-medium tracking-widest text-slate-500 dark:text-slate-400 uppercase">
              <span>TECNOLOGIA</span>
              <span>·</span>
              <span>PROCESSOS</span>
              <span>·</span>
              <span>RESULTADOS</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                FZ OS
              </span>
              <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                v1.0.0
              </span>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Sistema Interno | FZ Build Solutions
              </span>
            </div>
            <div className="h-3 w-px bg-slate-200 dark:bg-slate-800" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                Sistema Online
              </span>
              <span className="text-[11px] text-slate-400 italic hidden xl:inline">
                — Grandes projetos constroem grandes resultados.
              </span>
            </div>
          </div>
        </div>

        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-30 flex items-center h-16 px-4 md:px-6 bg-white/80 dark:bg-[#0A1624]/85 backdrop-blur-xl border-b border-[#E2E8F0] dark:border-[#162235] gap-4">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Breadcrumb / Page title */}
          <div className="flex-1 flex items-center gap-2 min-w-0">
            <span className="font-mono text-xs text-slate-400 hidden md:block">
              FZ OS /
            </span>
            <span className="font-medium text-sm text-slate-700 dark:text-slate-300 truncate">
              {pathname === "/os"
                ? "Dashboard"
                : pathname
                    .replace("/os/", "")
                    .replace("/", " › ")
                    .split(" ")
                    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                    .join(" ")}
            </span>
          </div>

          {/* Command Bar Trigger Button */}
          <button
            onClick={() => setCommandOpen(true)}
            className="hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-400 text-xs transition-all w-60 md:w-72"
          >
            <Search className="h-3.5 w-3.5 text-slate-400" />
            <span className="flex-1 text-left truncate">
              Buscar projetos, ações...
            </span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800 text-[10px] font-mono text-slate-500 font-semibold">
              ⌘K
            </kbd>
          </button>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* AI Assistant Trigger */}
            <button
              onClick={() => setAiDrawerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#003d9b]/10 to-[#00e3fd]/15 dark:from-[#003d9b]/25 dark:to-[#00e3fd]/20 text-[#003d9b] dark:text-[#00e3fd] hover:from-[#003d9b]/20 hover:to-[#00e3fd]/30 border border-[#003d9b]/25 transition-all text-xs font-bold"
            >
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              <span>AI</span>
            </button>

            <Link
              href="/os/notifications"
              className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            >
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#003d9b] rounded-full" />
            </Link>
            <Link
              href="/os/admin/settings"
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            >
              <Settings className="h-4.5 w-4.5" />
            </Link>
            <div className="ml-1 h-8 w-8 rounded-full bg-gradient-to-br from-[#003d9b] to-[#006875] flex items-center justify-center text-white text-xs font-bold">
              FZ
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>

        {/* Footer */}
        <footer className="px-6 py-3 border-t border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-slate-400">
              FZ Build Solutions OS v2.0.0
            </span>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="font-mono text-[10px] text-slate-400">
                Sistemas Operacionais
              </span>
            </div>
          </div>
        </footer>
      </div>

      {/* COMMAND PALETTE MODAL (⌘K) */}
      <AnimatePresence>
        {commandOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setCommandOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              className="relative w-full max-w-xl bg-white dark:bg-[#0D1C2C] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-10"
            >
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  autoFocus
                  value={commandQuery}
                  onChange={(e) => setCommandQuery(e.target.value)}
                  placeholder="Buscar comando, tela ou digite '> status'..."
                  className="flex-1 bg-transparent text-sm text-slate-900 dark:text-slate-100 focus:outline-none placeholder:text-slate-400"
                />
                <kbd className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-slate-400">
                  ESC
                </kbd>
              </div>

              {commandQuery.trim().toLowerCase() === "> status" ? (
                <div className="p-4 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-mono space-y-1">
                  <p className="font-bold">FZ SYSTEM ONLINE ●</p>
                  <p>
                    CORE: OPERATIONAL · DB: FIRESTORE OK · AUTH: ACTIVE · AI:
                    READY
                  </p>
                </div>
              ) : (
                <div className="max-h-80 overflow-y-auto p-2 space-y-1">
                  {COMMAND_ITEMS.filter(
                    (item) =>
                      item.label
                        .toLowerCase()
                        .includes(commandQuery.toLowerCase()) ||
                      item.group
                        .toLowerCase()
                        .includes(commandQuery.toLowerCase()),
                  ).map((cmd) => (
                    <button
                      key={cmd.label}
                      onClick={() => handleCommandSelect(cmd.href)}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:text-[#003d9b] group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors">
                          <cmd.icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                            {cmd.label}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {cmd.group}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FZ AI CONTEXTUAL DRAWER */}
      <AnimatePresence>
        {aiDrawerOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setAiDrawerOpen(false)}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-white dark:bg-[#0D1C2C] border-l border-slate-200 dark:border-slate-800 h-full flex flex-col shadow-2xl z-10"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-[#003d9b] to-[#00e3fd] text-white">
                    <Sparkles className="h-4 w-4 animate-spin" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      FZ AI Assistant
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </h2>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Inteligência Operacional Ativa
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setAiDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {aiMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                        msg.role === "user"
                          ? "bg-[#003d9b] text-white rounded-br-none"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200/50 dark:border-slate-700/50"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {/* Quick Prompts */}
                <div className="pt-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Sugestões Rápidas:
                  </p>
                  <div className="space-y-1.5">
                    {[
                      "Quanto gastamos com o EZYX este mês?",
                      "Qual a previsão de fluxo de caixa?",
                      "Qual o status da infraestrutura em nuvem?",
                      "Como está a proposta da Bioma?",
                    ].map((q) => (
                      <button
                        key={q}
                        onClick={() => handleSendAi(q)}
                        className="w-full text-left text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 text-slate-600 dark:text-slate-400 transition-colors truncate"
                      >
                        💡 {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendAi();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    placeholder="Pergunte sobre projetos, financeiro, leads..."
                    className="flex-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#003d9b]"
                  />
                  <button
                    type="submit"
                    className="p-2.5 rounded-xl bg-[#003d9b] text-white hover:bg-[#002d73] transition-colors flex-shrink-0"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </form>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile close button */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed top-4 right-4 z-[60] lg:hidden p-2 bg-white rounded-xl shadow-lg text-slate-500"
          >
            <X className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
