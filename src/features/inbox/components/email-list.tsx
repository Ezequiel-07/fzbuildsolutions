"use client";

import { Search, Mail, Clock, Send, Inbox } from "lucide-react";
import type { GmailMessageSummary } from "../services/gmail-service";
import { Skeleton } from "@/components/os/skeleton";

export type InboxFolder = "inbox" | "sent";
export type InboxFilter = "all" | "unread";

interface EmailListProps {
  messages: GmailMessageSummary[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  folder: InboxFolder;
  onFolderChange: (f: InboxFolder) => void;
  filter: InboxFilter;
  onFilterChange: (f: InboxFilter) => void;
  isLoading: boolean;
  isConnected?: boolean;
}

export function EmailList({
  messages,
  selectedId,
  onSelect,
  searchQuery,
  onSearchChange,
  folder,
  onFolderChange,
  filter,
  onFilterChange,
  isLoading,
  isConnected = false,
}: EmailListProps) {
  const filteredMessages = messages.filter((msg) => {
    if (filter === "unread" && !msg.isUnread) return false;
    return true;
  });

  const unreadCount = messages.filter((m) => m.isUnread).length;

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const now = new Date();
      const isToday = d.toDateString() === now.toDateString();
      if (isToday) {
        return d.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        });
      }
      return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="flex flex-col h-full border-r border-os-border bg-os-surface">
      {/* Search & Filter Bar */}
      <div className="p-3.5 border-b border-os-border space-y-2.5">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-os-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por remetente, assunto ou texto..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-os-surface-2 border border-os-border text-os-fg placeholder:text-os-muted focus:outline-none focus:ring-1 focus:ring-os-primary"
          />
        </div>

        {/* Folder & Filter Navigation Pills */}
        <div className="flex items-center gap-1.5 text-xs overflow-x-auto pb-0.5">
          {/* Caixa de Entrada (Todas) */}
          <button
            type="button"
            onClick={() => {
              onFolderChange("inbox");
              onFilterChange("all");
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              folder === "inbox" && filter === "all"
                ? "bg-os-primary/15 text-os-primary border border-os-primary/30"
                : "text-os-muted hover:bg-os-surface-2 border border-transparent"
            }`}
          >
            <Inbox className="h-3.5 w-3.5" />
            <span>
              Entrada {folder === "inbox" ? `(${messages.length})` : ""}
            </span>
          </button>

          {/* Não Lidas */}
          <button
            type="button"
            onClick={() => {
              onFolderChange("inbox");
              onFilterChange("unread");
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              folder === "inbox" && filter === "unread"
                ? "bg-os-primary/15 text-os-primary border border-os-primary/30"
                : "text-os-muted hover:bg-os-surface-2 border border-transparent"
            }`}
          >
            <Mail className="h-3.5 w-3.5" />
            <span>
              Não Lidas{" "}
              {folder === "inbox" && unreadCount > 0 ? `(${unreadCount})` : ""}
            </span>
          </button>

          {/* Enviados */}
          <button
            type="button"
            onClick={() => {
              onFolderChange("sent");
              onFilterChange("all");
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              folder === "sent"
                ? "bg-os-primary/15 text-os-primary border border-os-primary/30"
                : "text-os-muted hover:bg-os-surface-2 border border-transparent"
            }`}
          >
            <Send className="h-3.5 w-3.5" />
            <span>
              Enviados {folder === "sent" ? `(${messages.length})` : ""}
            </span>
          </button>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto divide-y divide-os-border/50">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-1.5">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        ) : !isConnected ? (
          <div className="p-8 text-center text-xs text-os-muted space-y-2.5">
            <div className="h-10 w-10 mx-auto rounded-xl bg-os-surface-2 flex items-center justify-center text-os-muted border border-os-border">
              <Mail className="h-5 w-5 opacity-50" />
            </div>
            <p className="font-semibold text-os-fg">Gmail Não Conectado</p>
            <p className="text-[11px] leading-relaxed max-w-[240px] mx-auto">
              Nenhuma conta do Google Workspace conectada. Vincule sua conta
              corporativa no botão acima para carregar e gerenciar e-mails
              reais.
            </p>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="p-8 text-center text-xs text-os-muted space-y-2">
            {folder === "sent" ? (
              <>
                <Send className="h-8 w-8 mx-auto text-os-muted opacity-40" />
                <p className="font-semibold text-os-fg">
                  Nenhum E-mail Enviado
                </p>
                <p>Nenhuma mensagem enviada encontrada nesta conta.</p>
              </>
            ) : (
              <>
                <Mail className="h-8 w-8 mx-auto text-os-muted opacity-40" />
                <p className="font-semibold text-os-fg">
                  Caixa de Entrada Vazia
                </p>
                <p>Nenhum e-mail encontrado para o filtro atual.</p>
              </>
            )}
          </div>
        ) : (
          filteredMessages.map((msg) => {
            const isSelected = selectedId === msg.id;

            return (
              <div
                key={msg.id}
                onClick={() => onSelect(msg.id)}
                className={`p-3.5 cursor-pointer transition-colors relative flex items-start gap-2.5 ${
                  isSelected
                    ? "bg-os-primary/10 border-l-4 border-os-primary"
                    : "hover:bg-os-surface-2/60"
                }`}
              >
                {/* Unread or Sent indicator */}
                <div className="pt-1">
                  {folder === "sent" ? (
                    <Send className="h-3 w-3 text-os-primary/80" />
                  ) : msg.isUnread ? (
                    <span className="block h-2 w-2 rounded-full bg-os-primary ring-2 ring-os-primary/20" />
                  ) : (
                    <span className="block h-2 w-2 rounded-full bg-transparent" />
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  {/* Sender/Recipient & Date */}
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`text-xs truncate ${
                        msg.isUnread
                          ? "font-bold text-os-fg"
                          : "font-medium text-os-muted"
                      }`}
                    >
                      {folder === "sent"
                        ? `Para: ${msg.toEmail || "Destinatário"}`
                        : (msg.sender || "Remetente")
                            .split("<")[0]
                            .replace(/"/g, "")
                            .trim() ||
                          msg.fromEmail ||
                          "Remetente"}
                    </span>
                    <span className="text-[10px] text-os-muted shrink-0 flex items-center gap-0.5">
                      <Clock className="h-3 w-3" />
                      {formatDate(msg.date)}
                    </span>
                  </div>

                  {/* Subject */}
                  <div
                    className={`text-xs truncate ${
                      msg.isUnread ? "font-bold text-os-fg" : "text-os-fg/90"
                    }`}
                  >
                    {msg.subject}
                  </div>

                  {/* Snippet */}
                  <p className="text-[11px] text-os-muted line-clamp-2 leading-relaxed">
                    {msg.snippet}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
