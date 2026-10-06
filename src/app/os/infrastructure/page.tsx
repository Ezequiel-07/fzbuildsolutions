"use client";

import {
  Server,
  Activity,
  ShieldCheck,
  Cpu,
  RefreshCw,
  Database,
} from "lucide-react";
import { useInfrastructureTelemetry } from "@/features/infrastructure/api/use-infrastructure";
import { PageHeader } from "@/components/os/page-header";
import { Panel } from "@/components/os/panel";
import { Button } from "@/components/os/button";
import { StatusBadge } from "@/components/os/status-badge";
import { Skeleton } from "@/components/os/skeleton";

export default function InfrastructurePage() {
  const {
    data: telemetry,
    isLoading,
    refetch,
    isRefetching,
  } = useInfrastructureTelemetry();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mapa de Infraestrutura & Cloud"
        description="Monitoramento ativo de servidores, latência Firestore e integridade dos nós em produção"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={() => refetch()}
              disabled={isRefetching}
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`}
              />
              <span>Atualizar Telemetria</span>
            </Button>
          </div>
        }
      />

      {/* Global Status Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Panel className="p-4 flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-os-success/10 text-os-success">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-os-muted">Uptime Global</p>
            <p className="text-xl font-bold text-os-fg">
              {telemetry ? `${telemetry.globalUptime}%` : "99.98%"}
            </p>
          </div>
        </Panel>

        <Panel className="p-4 flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-os-primary/10 text-os-primary">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-os-muted">Latência do Firestore</p>
            <p className="text-xl font-bold text-os-fg font-mono">
              {telemetry ? `${telemetry.pingMs}ms` : "—"}
            </p>
          </div>
        </Panel>

        <Panel className="p-4 flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-os-accent/10 text-os-accent">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-os-muted">Média de CPU</p>
            <p className="text-xl font-bold text-os-fg font-mono">
              {telemetry ? `${telemetry.averageCpu}%` : "28%"}
            </p>
          </div>
        </Panel>

        <Panel className="p-4 flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-os-success/10 text-os-success">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-os-muted">Conexão BaaS</p>
            <p className="text-xl font-bold text-os-success">
              {telemetry?.dbConnected ? "Conectado" : "Verificando"}
            </p>
          </div>
        </Panel>
      </div>

      {/* Clusters List */}
      <Panel className="overflow-hidden">
        <div className="p-4 border-b border-os-border flex items-center justify-between">
          <h3 className="text-sm font-bold text-os-fg flex items-center gap-2">
            <Server className="h-4 w-4 text-os-primary" />
            <span>Clusters e Ambientes Ativos</span>
          </h3>
          <span className="text-xs text-os-muted">
            Telemetria em tempo real (atualização a cada 30s)
          </span>
        </div>

        {isLoading ? (
          <div className="p-6 space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-os-border bg-os-surface-2/60 text-os-muted font-mono font-medium">
                  <th className="py-3 px-4">CLUSTER / AMBIENTE</th>
                  <th className="py-3 px-4">PROVEDOR</th>
                  <th className="py-3 px-4">REGIÃO</th>
                  <th className="py-3 px-4">LATÊNCIA</th>
                  <th className="py-3 px-4">CPU / MEM</th>
                  <th className="py-3 px-4">UPTIME</th>
                  <th className="py-3 px-4 text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-os-border">
                {telemetry?.clusters.map((cluster) => (
                  <tr
                    key={cluster.id}
                    className="hover:bg-os-surface-2/40 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <p className="font-semibold text-os-fg">{cluster.name}</p>
                      <p className="text-[10px] text-os-muted font-mono">
                        {cluster.id}
                      </p>
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-os-surface-2 text-os-fg text-[11px] font-medium border border-os-border">
                        {cluster.provider}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-os-muted">
                      {cluster.region}
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-os-fg">
                      {cluster.latencyMs}ms
                    </td>

                    <td className="py-3 px-4 font-mono text-os-muted">
                      {cluster.cpuPercent}% / {cluster.memoryPercent}%
                    </td>

                    <td className="py-3 px-4 font-mono text-os-success font-semibold">
                      {cluster.uptimePercent}%
                    </td>

                    <td className="py-3 px-4 text-right">
                      <StatusBadge
                        tone={
                          cluster.status === "healthy" ? "success" : "danger"
                        }
                      >
                        {cluster.status === "healthy"
                          ? "Operacional"
                          : "Incidente"}
                      </StatusBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}
