import {
  BarChart3,
  Bell,
  BookOpen,
  Building2,
  Calendar,
  FolderKanban,
  GitBranch,
  KanbanSquare,
  LayoutGrid,
  PiggyBank,
  ScrollText,
  Server,
  Settings,
  ShieldCheck,
  UserCog,
  Users,
  UsersRound,
  Mail,
  type LucideIcon,
} from "lucide-react";

/**
 * FZ OS navigation — single source of truth for the sidebar, breadcrumbs and
 * the command palette. Only routes that exist are listed here.
 *
 * Active state: the link with the LONGEST href matching the current path wins,
 * so `/os/crm/abc` highlights "Pipeline" and `/os/crm/leads` "Oportunidades".
 */

export type NavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Extra search terms for the command palette. */
  keywords?: string[];
};

export type NavItem = NavLink & {
  children?: NavLink[];
};

export type NavGroup = {
  id: string;
  label: string;
  items: NavItem[];
};

export const NAV_GROUPS: NavGroup[] = [
  {
    id: "operacao",
    label: "Operação",
    items: [
      {
        href: "/os",
        label: "Início",
        icon: LayoutGrid,
        keywords: ["dashboard", "overview", "meu dia"],
      },
      {
        href: "/os/projects",
        label: "Projetos",
        icon: FolderKanban,
        keywords: ["kanban", "sprints", "portfólio"],
      },
    ],
  },
  {
    id: "comercial",
    label: "Comercial",
    items: [
      {
        href: "/os/crm",
        label: "Pipeline",
        icon: KanbanSquare,
        keywords: ["funil", "vendas", "crm", "radar", "ia", "prospecção"],
      },
      {
        href: "/os/crm/leads",
        label: "Oportunidades",
        icon: UsersRound,
        keywords: [
          "leads",
          "propostas",
          "planilha",
          "radar de leads",
          "gemini",
        ],
      },
      {
        href: "/os/inbox",
        label: "Comunicação",
        icon: Mail,
        keywords: [
          "gmail",
          "email",
          "mensagens",
          "inbox",
          "propostas",
          "caixa de entrada",
        ],
      },
      {
        href: "/os/clients",
        label: "Clientes",
        icon: Building2,
        keywords: ["empresas", "clientes", "contas"],
      },
    ],
  },
  {
    id: "financeiro",
    label: "Financeiro",
    items: [
      {
        href: "/os/finance",
        label: "Visão geral",
        icon: BarChart3,
        keywords: ["painel", "caixa", "saldo"],
      },
      {
        href: "/os/finance/transactions",
        label: "Lançamentos",
        icon: BookOpen,
        keywords: ["transações", "planilha", "receitas", "despesas"],
      },
      {
        href: "/os/finance/budget",
        label: "Orçamentos",
        icon: PiggyBank,
        keywords: ["budget", "teto"],
      },
      {
        href: "/os/finance/reports",
        label: "Relatórios",
        icon: ScrollText,
        keywords: ["dre", "margem", "exportar"],
      },
    ],
  },
  {
    id: "pessoas",
    label: "Pessoas",
    items: [
      {
        href: "/os/team",
        label: "Equipe",
        icon: Users,
        keywords: ["membros", "time", "squad"],
      },
      {
        href: "/os/team/schedule",
        label: "Alocação",
        icon: Calendar,
        keywords: ["agenda", "capacidade", "horas"],
      },
    ],
  },
  {
    id: "sistema",
    label: "Sistema",
    items: [
      {
        href: "/os/workflow",
        label: "Automações",
        icon: GitBranch,
        keywords: ["workflow", "react flow", "fluxos"],
      },
      {
        href: "/os/infrastructure",
        label: "Infraestrutura",
        icon: Server,
        keywords: ["servidores", "cloud", "uptime"],
      },
      {
        href: "/os/admin",
        label: "Administração",
        icon: ShieldCheck,
        children: [
          {
            href: "/os/admin",
            label: "Painel",
            icon: ShieldCheck,
            keywords: ["governança", "admin"],
          },
          {
            href: "/os/admin/users",
            label: "Usuários",
            icon: UserCog,
            keywords: ["rbac", "papéis", "permissões"],
          },
          {
            href: "/os/admin/settings",
            label: "Configurações",
            icon: Settings,
            keywords: ["mfa", "backup", "tema"],
          },
          {
            href: "/os/admin/logs",
            label: "Logs de auditoria",
            icon: ScrollText,
            keywords: ["auditoria", "eventos"],
          },
        ],
      },
    ],
  },
];

/** Routes reachable outside the sidebar (topbar icons, etc.). */
export const EXTRA_LINKS: (NavLink & { group: string })[] = [
  {
    href: "/os/notifications",
    label: "Notificações",
    icon: Bell,
    group: "Sistema",
    keywords: ["alertas", "avisos"],
  },
];

export type FlatNavLink = NavLink & { group: string };

/** Flat list of every navigable link (sidebar + extras). */
export function getAllNavLinks(): FlatNavLink[] {
  const links: FlatNavLink[] = [];
  for (const group of NAV_GROUPS) {
    for (const item of group.items) {
      if (item.children?.length) {
        for (const child of item.children) {
          links.push({ ...child, group: group.label });
        }
      } else {
        links.push({ ...item, group: group.label });
      }
    }
  }
  return [...links, ...EXTRA_LINKS];
}

function matches(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Returns the link that best represents the current path (longest match). */
export function getActiveLink(pathname: string): FlatNavLink | undefined {
  return getAllNavLinks()
    .filter((l) => matches(pathname, l.href))
    .sort((a, b) => b.href.length - a.href.length)[0];
}

export function isItemActive(activeHref: string | undefined, item: NavItem) {
  if (!activeHref) return false;
  if (item.children?.length) {
    return item.children.some((c) => c.href === activeHref);
  }
  return item.href === activeHref;
}

export type Crumb = { label: string; href?: string };

/** Builds breadcrumbs from the nav config; deeper segments become "Detalhe". */
export function getBreadcrumbs(pathname: string): Crumb[] {
  const match = getActiveLink(pathname);
  if (!match) return [{ label: "Início" }];

  const isDetail = pathname !== match.href;
  const crumbs: Crumb[] = [{ label: match.group }];
  crumbs.push({ label: match.label, href: isDetail ? match.href : undefined });
  if (isDetail) crumbs.push({ label: "Detalhe" });
  return crumbs;
}
