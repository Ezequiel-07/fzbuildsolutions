import {
  Shield,
  ScrollText,
  Bell,
  ChevronRight,
  Activity,
  Lock,
  UserCog,
} from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/os/page-header";
import { Panel } from "@/components/os/panel";
import { StatusBadge } from "@/components/os/status-badge";

const adminSections = [
  {
    title: "Usuários & Acesso",
    items: [
      {
        href: "/os/admin/users",
        label: "Gestão de Usuários",
        desc: "Cadastro de colaboradores, controle de status e perfis",
        icon: UserCog,
      },
      {
        href: "/os/admin/users",
        label: "Controle de Acesso (RBAC)",
        desc: "Super Admin, Admin, Manager, Member e Viewer",
        icon: Shield,
      },
    ],
  },
  {
    title: "Governança & Rastreabilidade",
    items: [
      {
        href: "/os/admin/logs",
        label: "Logs de Auditoria",
        desc: "Trilha de eventos, rastreabilidade de ações e atores",
        icon: ScrollText,
      },
      {
        href: "/os/notifications",
        label: "Central de Notificações",
        desc: "Monitoramento de alertas do sistema e projetos",
        icon: Bell,
      },
    ],
  },
  {
    title: "Segurança & Parâmetros Globais",
    items: [
      {
        href: "/os/admin/settings",
        label: "Configurações Gerais & MFA",
        desc: "Empresa, tema corporativo, backups e autenticação multifator",
        icon: Lock,
      },
      {
        href: "/os/infrastructure",
        label: "Mapa de Infraestrutura",
        desc: "Servidores em nuvem, latência e telemetria",
        icon: Activity,
      },
    ],
  },
];

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Administração & Governança"
        description="Painel central de controle de acessos, segurança, conformidade e logs"
      />

      {/* Quick Status Bar */}
      <Panel className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-os-success/10 text-os-success">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-os-fg">
              Ambiente Corporativo Seguro
            </p>
            <p className="text-[11px] text-os-muted">
              Sessão autenticada via Firebase Auth com políticas ativas
            </p>
          </div>
        </div>
        <StatusBadge tone="success">ONLINE</StatusBadge>
      </Panel>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {adminSections.map((sec) => (
          <div key={sec.title} className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-os-muted uppercase tracking-wider px-1">
              {sec.title}
            </h3>

            <div className="space-y-2">
              {sec.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="block group"
                  >
                    <Panel className="p-4 hover:border-os-accent/40 transition-all flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-os-surface-2 text-os-muted group-hover:text-os-primary group-hover:bg-os-primary/10 transition-colors flex-shrink-0">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-os-fg group-hover:text-os-primary transition-colors">
                          {item.label}
                        </p>
                        <p className="text-[11px] text-os-muted mt-0.5 line-clamp-2">
                          {item.desc}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-os-muted group-hover:text-os-primary group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1" />
                    </Panel>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
