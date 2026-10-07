"use client";

import { Mail, ExternalLink, LogOut } from "lucide-react";
import { Button } from "@/components/os/button";
import { StatusBadge } from "@/components/os/status-badge";
import { useGmailStatus, useDisconnectGmail } from "../api/use-gmail";
import { toast } from "sonner";

export function GmailConnectBanner() {
  const { data: status, isLoading } = useGmailStatus();
  const disconnect = useDisconnectGmail();

  if (isLoading) return null;

  const isConnected = status?.connected;

  const handleDisconnect = async () => {
    try {
      await disconnect.mutateAsync();
      toast.success("Conta do Gmail desconectada com sucesso.");
    } catch {
      toast.error("Erro ao desconectar conta.");
    }
  };

  return (
    <div className="p-4 rounded-2xl bg-os-surface border border-os-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
      <div className="flex items-center gap-3.5">
        <div
          className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${
            isConnected
              ? "bg-os-success/10 text-os-success border border-os-success/20"
              : "bg-os-primary/10 text-os-primary border border-os-primary/20"
          }`}
        >
          <Mail className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-bold text-os-fg">
              {isConnected
                ? "Gmail Corporativo Conectado"
                : "Conexão com Gmail da Empresa"}
            </h3>
            <StatusBadge
              tone={isConnected ? "success" : "neutral"}
              dot
              size="sm"
            >
              {isConnected ? "Sincronizado" : "Desconectado"}
            </StatusBadge>
          </div>
          <p className="text-xs text-os-muted mt-0.5">
            {isConnected ? (
              <>
                Conta vinculada:{" "}
                <strong className="text-os-fg">{status.email}</strong>. E-mails
                e propostas são enviados por este endereço.
              </>
            ) : (
              "Conecte a conta oficial da FZ Build para ler respostas de clientes e disparar propostas comerciais reais."
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
        {isConnected ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDisconnect}
            disabled={disconnect.isPending}
            className="text-os-danger hover:bg-os-danger/10 hover:text-os-danger"
            leadingIcon={<LogOut className="h-4 w-4" />}
          >
            Desconectar
          </Button>
        ) : (
          <a href="/api/auth/google/connect">
            <Button
              variant="primary"
              size="sm"
              leadingIcon={<ExternalLink className="h-4 w-4" />}
            >
              Conectar Google Workspace
            </Button>
          </a>
        )}
      </div>
    </div>
  );
}
