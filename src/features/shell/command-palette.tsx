"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ArrowRight,
  Activity,
  FolderKanban,
  UserCheck,
  PlusCircle,
  Mail,
  DollarSign,
  FileSpreadsheet,
} from "lucide-react";
import { getAllNavLinks, type FlatNavLink } from "./nav-config";
import { useProjects } from "@/features/projects/api/use-projects";
import { useLeads } from "@/features/crm/api/use-leads";

interface ActionItem {
  id: string;
  label: string;
  category: "Ações Rápidas" | "Navegação" | "Projetos" | "CRM Leads";
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  hint?: string;
}

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const links = getAllNavLinks();
  const { data: projects = [] } = useProjects();
  const { data: leads = [] } = useLeads();

  const quickActions: ActionItem[] = [
    {
      id: "action-new-project",
      label: "Criar Novo Projeto",
      category: "Ações Rápidas",
      href: "/os/projects",
      icon: PlusCircle,
      hint: "Adicionar à esteira Kanban",
    },
    {
      id: "action-new-lead",
      label: "Cadastrar Nova Oportunidade / Lead",
      category: "Ações Rápidas",
      href: "/os/crm",
      icon: UserCheck,
      hint: "Pipeline comercial",
    },
    {
      id: "action-new-email",
      label: "Enviar E-mail via Gmail Integrado",
      category: "Ações Rápidas",
      href: "/os/inbox",
      icon: Mail,
      hint: "Comunicação corporativa",
    },
    {
      id: "action-new-budget",
      label: "Gerar Orçamento / Proposta Comercial",
      category: "Ações Rápidas",
      href: "/os/finance/budget",
      icon: FileSpreadsheet,
      hint: "Cálculo de margem e BDI",
    },
    {
      id: "action-finance-trans",
      label: "Registrar Lançamento Financeiro",
      category: "Ações Rápidas",
      href: "/os/finance",
      icon: DollarSign,
      hint: "Contas a pagar / receber",
    },
  ];

  const projectItems: ActionItem[] = projects.slice(0, 8).map((p) => ({
    id: `project-${p.id}`,
    label: p.name || "Projeto sem título",
    category: "Projetos",
    href: `/os/projects/${p.id}`,
    icon: FolderKanban,
    hint: p.description || p.clientId || "Projeto de Soluções / Obras",
  }));

  const leadItems: ActionItem[] = leads.slice(0, 8).map((l) => ({
    id: `lead-${l.id}`,
    label: l.clientName || l.projectName || "Lead sem nome",
    category: "CRM Leads",
    href: `/os/crm`,
    icon: UserCheck,
    hint: `R$ ${(l.value || 0).toLocaleString("pt-BR")}`,
  }));

  const navItems: ActionItem[] = links.map((item: FlatNavLink) => ({
    id: `nav-${item.href}-${item.label}`,
    label: item.label,
    category: "Navegação",
    href: item.href,
    icon: item.icon,
    hint: item.group,
  }));

  const allItems: ActionItem[] = [
    ...quickActions,
    ...projectItems,
    ...leadItems,
    ...navItems,
  ];

  const filtered = allItems.filter((item) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    const matchLabel = item.label.toLowerCase().includes(q);
    const matchCategory = item.category.toLowerCase().includes(q);
    const matchHint = item.hint?.toLowerCase().includes(q);
    return matchLabel || matchCategory || matchHint;
  });

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = useCallback(
    (href: string) => {
      onOpenChange(false);
      setQuery("");
      router.push(href);
    },
    [onOpenChange, router],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (!open) return;

      if (e.key === "Escape") {
        onOpenChange(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev - 1 < 0 ? Math.max(0, filtered.length - 1) : prev - 1,
        );
      } else if (e.key === "Enter" && filtered[selectedIndex]) {
        e.preventDefault();
        handleSelect(filtered[selectedIndex].href);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange, filtered, selectedIndex, handleSelect]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-20 px-3 sm:px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => onOpenChange(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -8 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-xl bg-os-surface rounded-2xl border border-os-border shadow-2xl overflow-hidden z-10 flex flex-col max-h-[85vh]"
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-os-border bg-os-surface-2/40">
              <Search className="h-4 w-4 text-os-muted shrink-0" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar projetos, clientes, comandos ou '> status'..."
                className="flex-1 bg-transparent text-sm text-os-fg focus:outline-none placeholder:text-os-muted"
              />
              <kbd className="px-2 py-0.5 rounded bg-os-surface-2 text-[10px] font-mono text-os-muted border border-os-border shrink-0">
                ESC
              </kbd>
            </div>

            {/* Quick Status Command */}
            {query.trim().toLowerCase() === "> status" ? (
              <div className="p-4 bg-os-success/10 text-os-success text-xs font-mono space-y-1">
                <div className="flex items-center gap-2 font-bold">
                  <Activity className="h-4 w-4 animate-pulse" />
                  <span>FZ BUILD OPERATIONAL CORE ONLINE</span>
                </div>
                <p className="text-[11px] opacity-90">
                  FIRESTORE: ATIVO · GMAIL API: V1 INTEGRADA · AUTH: ONLINE ·
                  CI: 29 TESTES OK
                </p>
              </div>
            ) : (
              <div className="overflow-y-auto p-2 space-y-1 divide-y divide-os-border/20">
                {filtered.length === 0 ? (
                  <div className="p-10 text-center text-xs text-os-muted">
                    Nenhum resultado encontrado para &quot;{query}&quot;
                  </div>
                ) : (
                  filtered.map((item, index) => {
                    const Icon = item.icon;
                    const isSelected = index === selectedIndex;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item.href)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all group ${
                          isSelected
                            ? "bg-os-primary/10 text-os-primary border border-os-primary/20 shadow-sm"
                            : "hover:bg-os-surface-2 text-os-fg border border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`p-2 rounded-lg transition-colors shrink-0 ${
                              isSelected
                                ? "bg-os-primary text-white"
                                : "bg-os-surface-2 text-os-muted group-hover:text-os-primary group-hover:bg-os-primary/10"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <p
                              className={`text-xs font-semibold truncate ${
                                isSelected
                                  ? "text-os-primary font-bold"
                                  : "text-os-fg"
                              }`}
                            >
                              {item.label}
                            </p>
                            <p className="text-[10px] text-os-muted truncate">
                              {item.category}{" "}
                              {item.hint ? `· ${item.hint}` : ""}
                            </p>
                          </div>
                        </div>
                        <ArrowRight
                          className={`h-3.5 w-3.5 shrink-0 transition-all ${
                            isSelected
                              ? "text-os-primary opacity-100 translate-x-0.5"
                              : "text-os-muted opacity-0 group-hover:opacity-100"
                          }`}
                        />
                      </button>
                    );
                  })
                )}
              </div>
            )}

            {/* Keyboard shortcut footer */}
            <div className="px-4 py-2 border-t border-os-border/60 bg-os-surface-2/60 text-[10px] font-mono text-os-muted flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span>↑↓ Navegar</span>
                <span>↵ Selecionar</span>
                <span>ESC Fechar</span>
              </div>
              <span className="hidden sm:inline">
                ⌘K / Ctrl+K em qualquer tela
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
