"use client";

import {
  FileText,
  CheckCircle2,
  MessageSquare,
  Camera,
  ShieldCheck,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PortalPage() {
  const milestones = [
    {
      title: "Briefing & Planejamento Técnico",
      date: "15 Jan 2026",
      status: "concluido",
    },
    {
      title: "Fundações & Infraestrutura Base",
      date: "02 Fev 2026",
      status: "concluido",
    },
    {
      title: "Superestrutura & Instalações Elétricas/Hidráulicas",
      date: "Em andamento",
      status: "atual",
    },
    {
      title: "Acabamentos & Revestimentos de Alto Padrão",
      date: "Previsto: 25 Abr",
      status: "futuro",
    },
    {
      title: "Comissionamento & Entrega Turnkey",
      date: "Previsto: 15 Mai",
      status: "futuro",
    },
  ];

  const recentPhotos = [
    {
      id: "ph-1",
      title: "Conferência Estrutural - Laje Superior",
      date: "Hoje às 14:30",
      engineer: "Eng. Carlos Zomer (CREA-SC)",
      imgUrl:
        "https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "ph-2",
      title: "Instalação de Eletrocalhas e Tubulações",
      date: "Ontem às 16:15",
      engineer: "Equipe de Instalações FZ",
      imgUrl:
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
    },
  ];

  const invoices = [
    {
      id: "MED-001",
      description: "Medição #1 - Mobilização e Fundações",
      value: 45000,
      status: "pago",
      date: "05/02/2026",
    },
    {
      id: "MED-002",
      description: "Medição #2 - Estrutura e Alvenaria",
      value: 68000,
      status: "pago",
      date: "05/03/2026",
    },
    {
      id: "MED-003",
      description: "Medição #3 - Instalações e Cobertura",
      value: 52000,
      status: "aberto",
      date: "15/04/2026",
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#002255] via-[#003D9B] to-[#0066CC] p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-cyan-200">
            <ShieldCheck className="h-3.5 w-3.5" />
            Portal Executivo de Transparência · FZ Build Solutions
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Acompanhamento do seu Empreendimento
          </h1>
          <p className="text-sm text-cyan-100 max-w-2xl leading-relaxed">
            Bem-vindo à área exclusiva do cliente. Aqui você acompanha vistorias
            fotográficas com geolocalização, medições financeiras e a evolução
            do cronograma físico da sua obra em tempo real.
          </p>
        </div>
      </div>

      {/* Main Status & Progress Card */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 rounded-2xl border bg-card p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Status do Projeto
              </span>
              <h2 className="text-lg font-bold text-foreground">
                Complexo Corporativo & Logístico
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
              68% Concluído
            </span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono text-muted-foreground">
              <span>Etapa 3 de 5</span>
              <span>Previsão de Entrega: Maio / 2026</span>
            </div>
            <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full transition-all duration-700"
                style={{ width: "68%" }}
              />
            </div>
          </div>

          {/* Milestones Timeline */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Linha do Tempo das Fases
            </h3>
            <div className="space-y-2.5">
              {milestones.map((m, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border text-xs"
                >
                  <div className="flex items-center gap-3">
                    {m.status === "concluido" ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    ) : m.status === "atual" ? (
                      <div className="h-4 w-4 rounded-full border-2 border-primary flex items-center justify-center">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
                      </div>
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/40" />
                    )}
                    <span
                      className={
                        m.status === "concluido"
                          ? "font-medium text-foreground"
                          : m.status === "atual"
                            ? "font-bold text-primary"
                            : "text-muted-foreground"
                      }
                    >
                      {m.title}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-muted-foreground shrink-0">
                    {m.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions & Contact Sidebar */}
        <div className="space-y-6">
          <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-foreground">
              Engenheiro Responsável
            </h3>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border">
              <div className="h-10 w-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                CZ
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">
                  Eng. Carlos Zomer
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Coordenação de Obras
                </p>
              </div>
            </div>
            <a
              href="https://wa.me/5548991873177?text=Ol%C3%A1%2C%20gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20o%20andamento%20do%20meu%20projeto."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Falar no WhatsApp</span>
            </a>
          </div>

          <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-foreground">
              Documentação Técnica
            </h3>
            <p className="text-xs text-muted-foreground">
              Acesse contratos, ARTs e plantas aprovadas a qualquer momento.
            </p>
            <Button variant="outline" className="w-full text-xs" size="sm">
              <FileText className="h-3.5 w-3.5 mr-2" />
              Visualizar Contrato & ART
            </Button>
          </div>
        </div>
      </div>

      {/* Photo Checkpoints Section */}
      <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-bold text-foreground">
              Últimos Checkpoints & Registros Fotográficos
            </h2>
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            Atualizado diariamente em canteiro
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {recentPhotos.map((photo) => (
            <div
              key={photo.id}
              className="group relative rounded-xl border overflow-hidden bg-muted/20"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.imgUrl}
                alt={photo.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-3 bg-card border-t space-y-1">
                <p className="text-xs font-bold text-foreground">
                  {photo.title}
                </p>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                  <span>{photo.engineer}</span>
                  <span>{photo.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Financial Measurements Table */}
      <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-bold text-foreground">
              Medições & Faturamento Contratual
            </h2>
          </div>
          <span className="text-xs text-muted-foreground">
            Extrato financeiro do contrato
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b bg-muted/30 text-muted-foreground font-mono font-medium">
                <th className="py-2.5 px-3">CÓDIGO</th>
                <th className="py-2.5 px-3">DISCRIMINAÇÃO</th>
                <th className="py-2.5 px-3">VALOR</th>
                <th className="py-2.5 px-3">DATA / VENCIMENTO</th>
                <th className="py-2.5 px-3">SITUAÇÃO</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {invoices.map((inv) => (
                <tr
                  key={inv.id}
                  className="hover:bg-muted/20 transition-colors"
                >
                  <td className="py-2.5 px-3 font-mono font-semibold">
                    {inv.id}
                  </td>
                  <td className="py-2.5 px-3 font-medium">{inv.description}</td>
                  <td className="py-2.5 px-3 font-mono">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(inv.value)}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-muted-foreground">
                    {inv.date}
                  </td>
                  <td className="py-2.5 px-3">
                    {inv.status === "pago" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        ✓ Quitado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        ⏳ Medição em Aberto
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
