"use client";

import { useState } from "react";
import {
  Reply,
  Forward,
  Trash2,
  Mail,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/os/button";
import { ConfirmDialog } from "@/components/os/confirm-dialog";
import { useGmailMessage, useTrashMessage } from "../api/use-gmail";
import { Skeleton } from "@/components/os/skeleton";
import { toast } from "sonner";
import { type GmailMessageDetail } from "../services/gmail-service";

interface EmailViewerProps {
  selectedId: string | null;
  onBack?: () => void;
  onReply: (msg: GmailMessageDetail) => void;
  onForward: (msg: GmailMessageDetail) => void;
  onDeleted: () => void;
}

export function EmailViewer({
  selectedId,
  onBack,
  onReply,
  onForward,
  onDeleted,
}: EmailViewerProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { data: message, isLoading } = useGmailMessage(selectedId || undefined);
  const trashMessage = useTrashMessage();

  if (!selectedId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-os-muted bg-os-surface/40">
        <div className="h-14 w-14 rounded-2xl bg-os-surface-2 flex items-center justify-center text-os-muted mb-4 border border-os-border">
          <Mail className="h-7 w-7 opacity-60" />
        </div>
        <h4 className="text-sm font-semibold text-os-fg">
          Nenhum e-mail selecionado
        </h4>
        <p className="text-xs text-os-muted max-w-xs mt-1">
          Selecione uma mensagem na lista ao lado para visualizar o conteúdo
          completo, responder ou encaminhar.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 p-8 space-y-4 bg-os-surface">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-10 w-full" />
        <div className="space-y-2 pt-6">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </div>
    );
  }

  if (!message) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-os-muted bg-os-surface/40">
        <div className="h-14 w-14 rounded-2xl bg-os-surface-2 flex items-center justify-center text-os-muted mb-4 border border-os-border">
          <Mail className="h-7 w-7 opacity-60" />
        </div>
        <h4 className="text-sm font-semibold text-os-fg">
          Mensagem não encontrada
        </h4>
        <p className="text-xs text-os-muted max-w-xs mt-1">
          A mensagem selecionada não pôde ser carregada ou já foi removida da
          caixa de entrada.
        </p>
      </div>
    );
  }

  const handleDeleteConfirm = async () => {
    try {
      await trashMessage.mutateAsync(message.id);
      toast.success("E-mail movido para a lixeira com sucesso.");
      setIsDeleting(false);
      onDeleted();
    } catch {
      toast.error("Erro ao mover e-mail para a lixeira.");
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleString("pt-BR", {
        dateStyle: "full",
        timeStyle: "short",
      });
    } catch {
      return dateStr;
    }
  };

  const senderName = message.sender || message.fromEmail || "Você";
  const avatarInitial = (senderName.trim().charAt(0) || "E").toUpperCase();

  return (
    <div className="flex-1 flex flex-col h-full bg-os-surface overflow-hidden">
      {/* Top Toolbar */}
      <div className="px-6 py-3.5 border-b border-os-border flex items-center justify-between bg-os-surface-2/30">
        <div className="flex items-center gap-2">
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="md:hidden text-os-muted hover:text-os-fg"
              leadingIcon={<ArrowLeft className="h-4 w-4" />}
            >
              Voltar
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onReply(message)}
            leadingIcon={<Reply className="h-3.5 w-3.5" />}
          >
            Responder
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onForward(message)}
            leadingIcon={<Forward className="h-3.5 w-3.5" />}
          >
            Encaminhar
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDeleting(true)}
            className="text-os-danger hover:bg-os-danger/10 hover:text-os-danger"
            leadingIcon={<Trash2 className="h-3.5 w-3.5" />}
          >
            Excluir
          </Button>
        </div>
      </div>

      {/* Message Header */}
      <div className="p-6 border-b border-os-border/70 space-y-4">
        <h2 className="text-base font-bold text-os-fg leading-snug">
          {message.subject}
        </h2>

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-os-primary/10 text-os-primary flex items-center justify-center font-bold text-sm shrink-0 border border-os-primary/20">
              {avatarInitial}
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-os-fg">
                  {message.sender || message.fromEmail || "Remetente"}
                </span>
                {message.fromEmail && (
                  <span className="text-[11px] text-os-muted">
                    &lt;{message.fromEmail}&gt;
                  </span>
                )}
              </div>
              <p className="text-[11px] text-os-muted">
                Para:{" "}
                <span className="text-os-fg font-medium">
                  {message.toEmail || "Destinatário"}
                </span>
              </p>
            </div>
          </div>

          <div className="text-right text-[11px] text-os-muted shrink-0">
            {formatDate(message.date)}
          </div>
        </div>

        {/* Smart Reply Suggestions */}
        <div className="flex items-center gap-2 pt-2 flex-wrap border-t border-os-border/40">
          <span className="text-[10px] uppercase font-bold text-os-muted flex items-center gap-1 shrink-0">
            <Sparkles className="h-3 w-3 text-os-primary" />
            Sugestões Rápidas:
          </span>
          <button
            type="button"
            onClick={() =>
              onReply({
                ...message,
                bodyHtml: `<p>Olá, confirmo o recebimento desta mensagem. Em breve retornaremos com o andamento.</p><br/>`,
              })
            }
            className="text-[11px] px-2.5 py-0.5 rounded-full bg-os-surface-2 hover:bg-os-primary/15 hover:text-os-primary border border-os-border transition-colors cursor-pointer"
          >
            ✓ Confirmar Recebimento
          </button>
          <button
            type="button"
            onClick={() =>
              onReply({
                ...message,
                bodyHtml: `<p>Olá, podemos agendar uma reunião de alinhamento técnico nesta semana?</p><br/>`,
              })
            }
            className="text-[11px] px-2.5 py-0.5 rounded-full bg-os-surface-2 hover:bg-os-primary/15 hover:text-os-primary border border-os-border transition-colors cursor-pointer"
          >
            📅 Agendar Reunião
          </button>
          <button
            type="button"
            onClick={() =>
              onReply({
                ...message,
                bodyHtml: `<p>Prezado, segue anexa a estimativa de custos e o cronograma para aprovação.</p><br/>`,
              })
            }
            className="text-[11px] px-2.5 py-0.5 rounded-full bg-os-surface-2 hover:bg-os-primary/15 hover:text-os-primary border border-os-border transition-colors cursor-pointer"
          >
            📄 Enviar Estimativa
          </button>
        </div>
      </div>

      {/* Message Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {message.bodyHtml && message.bodyHtml.trim() !== "<p></p>" ? (
          <div
            className="prose prose-sm max-w-none text-xs text-os-fg leading-relaxed bg-os-surface-2/20 p-5 rounded-2xl border border-os-border/50 break-words"
            dangerouslySetInnerHTML={{ __html: message.bodyHtml }}
          />
        ) : (
          <div className="text-xs text-os-fg leading-relaxed bg-os-surface-2/20 p-5 rounded-2xl border border-os-border/50">
            {message.snippet || "(Mensagem sem conteúdo para visualização)"}
          </div>
        )}
      </div>

      {/* Confirmation Dialog for Trash */}
      <ConfirmDialog
        open={isDeleting}
        onOpenChange={setIsDeleting}
        title="Mover e-mail para a lixeira?"
        description="Esta mensagem será movida para a Lixeira do Gmail. Você poderá recuperá-la na lixeira se necessário."
        confirmLabel="Sim, excluir"
        tone="danger"
        isLoading={trashMessage.isPending}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
