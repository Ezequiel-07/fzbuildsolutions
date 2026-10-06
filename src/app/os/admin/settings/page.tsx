"use client";

import { useState } from "react";
import { Building2, Bell, Lock, Globe, Save, Shield } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { PageHeader } from "@/components/os/page-header";
import { Panel } from "@/components/os/panel";
import { Button } from "@/components/os/button";

const tabs = [
  { id: "company", label: "Empresa", icon: Building2 },
  { id: "security", label: "Segurança & MFA", icon: Lock },
  { id: "notifications", label: "Notificações", icon: Bell },
  { id: "integrations", label: "Integrações", icon: Globe },
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("company");
  const [companyName, setCompanyName] = useState("FZ Build Solutions");
  const [companyEmail, setCompanyEmail] = useState("contato@fzbuild.com");
  const [companyPhone, setCompanyPhone] = useState("+55 11 99999-9999");
  const [city, setCity] = useState("São Paulo, SP");

  const handleSave = () => {
    toast.success("Configurações do sistema salvas com sucesso!");
  };

  return (
    <div className="max-w-[900px] mx-auto w-full space-y-6">
      <PageHeader
        title="Configurações Globais"
        description="Parâmetros da organização, segurança multifator e integrações corporativas"
        actions={
          <Button variant="primary" onClick={handleSave}>
            <Save className="h-4 w-4" />
            <span>Salvar Alterações</span>
          </Button>
        }
      />

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-os-surface-2 p-1 rounded-2xl w-fit border border-os-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === tab.id
                ? "bg-os-surface text-os-primary dark:text-os-accent shadow-sm"
                : "text-os-muted hover:text-os-fg"
            }`}
          >
            <tab.icon className="h-3.5 w-3.5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Company Tab */}
      {activeTab === "company" && (
        <Panel className="p-6 space-y-5">
          <h2 className="font-semibold text-sm text-os-fg flex items-center gap-2">
            <Building2 className="h-4 w-4 text-os-primary" />
            <span>Informações da Organização</span>
          </h2>

          <div className="flex items-center gap-4">
            <Image
              src="/fzbuildsemfundo.png"
              alt="Logo"
              width={52}
              height={52}
              className="w-12 h-12 rounded-2xl border border-os-border object-contain p-1 bg-os-surface-2"
            />
            <div>
              <p className="text-xs font-bold text-os-fg">FZ Build Solutions</p>
              <p className="text-[11px] text-os-muted">
                Software House · São Paulo, Brasil
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-os-fg">
                Nome da Empresa
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-os-border bg-os-surface text-xs text-os-fg focus:outline-none focus:ring-2 focus:ring-os-ring"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-os-fg">
                E-mail Corporativo
              </label>
              <input
                type="email"
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-os-border bg-os-surface text-xs text-os-fg focus:outline-none focus:ring-2 focus:ring-os-ring"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-os-fg">
                Telefone de Contato
              </label>
              <input
                type="tel"
                value={companyPhone}
                onChange={(e) => setCompanyPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-os-border bg-os-surface text-xs text-os-fg focus:outline-none focus:ring-2 focus:ring-os-ring"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-os-fg">
                Sede / Localização
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-os-border bg-os-surface text-xs text-os-fg focus:outline-none focus:ring-2 focus:ring-os-ring"
              />
            </div>
          </div>
        </Panel>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <Panel className="p-6 space-y-4">
          <h2 className="font-semibold text-sm text-os-fg flex items-center gap-2">
            <Shield className="h-4 w-4 text-os-primary" />
            <span>Segurança de Acesso & MFA</span>
          </h2>

          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-os-border bg-os-surface-2/40 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-os-fg">
                  Autenticação Multifator (MFA)
                </p>
                <p className="text-[11px] text-os-muted">
                  Exigir código OTP para administradores em novo login
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-os-success/10 text-os-success text-xs font-bold font-mono">
                HABILITADO
              </span>
            </div>

            <div className="p-4 rounded-xl border border-os-border bg-os-surface-2/40 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-os-fg">
                  Duração da Sessão
                </p>
                <p className="text-[11px] text-os-muted">
                  Expiração automática de tokens JWT inativos
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-os-fg">
                24 horas
              </span>
            </div>
          </div>
        </Panel>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <Panel className="p-6 space-y-4">
          <h2 className="font-semibold text-sm text-os-fg flex items-center gap-2">
            <Bell className="h-4 w-4 text-os-primary" />
            <span>Preferências de Notificações</span>
          </h2>
          <div className="space-y-2 text-xs text-os-fg">
            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-os-border cursor-pointer hover:bg-os-surface-2/50">
              <input
                type="checkbox"
                defaultChecked
                className="rounded text-os-primary"
              />
              <span>Notificar sobre novas propostas ganhas no CRM</span>
            </label>
            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-os-border cursor-pointer hover:bg-os-surface-2/50">
              <input
                type="checkbox"
                defaultChecked
                className="rounded text-os-primary"
              />
              <span>Alertas de estouro de orçamento (&gt;80%) em projetos</span>
            </label>
            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-os-border cursor-pointer hover:bg-os-surface-2/50">
              <input
                type="checkbox"
                defaultChecked
                className="rounded text-os-primary"
              />
              <span>
                Relatório executivo consolidado por e-mail semanalmente
              </span>
            </label>
          </div>
        </Panel>
      )}

      {/* Integrations Tab */}
      {activeTab === "integrations" && (
        <Panel className="p-6 space-y-4">
          <h2 className="font-semibold text-sm text-os-fg flex items-center gap-2">
            <Globe className="h-4 w-4 text-os-primary" />
            <span>Integrações em Nuvem</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border border-os-border bg-os-surface-2/40 flex items-center justify-between">
              <div>
                <p className="font-bold text-os-fg">Firebase App Hosting</p>
                <p className="text-[11px] text-os-muted">
                  Banco NoSQL & Storage
                </p>
              </div>
              <span className="text-os-success font-bold font-mono">
                CONECTADO
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-os-border bg-os-surface-2/40 flex items-center justify-between">
              <div>
                <p className="font-bold text-os-fg">FZ AI Gateway</p>
                <p className="text-[11px] text-os-muted">
                  Modelos LLM Contextuais
                </p>
              </div>
              <span className="text-os-success font-bold font-mono">ATIVO</span>
            </div>
          </div>
        </Panel>
      )}
    </div>
  );
}
