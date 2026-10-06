"use client";

import { Search, Mail, Clock } from "lucide-react";
import type { GmailMessageSummary } from "../services/gmail-service";
import { Skeleton } from "@/components/os/skeleton";

interface EmailListProps {
  messages: GmailMessageSummary[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  filter: "all" | "unread";
  onFilterChange: (f: "all" | "unread") => void;
  isLoading: boolean;
}

export function EmailList({
  messages,
  selectedId,
  onSelect,
  searchQuery,
  onSearchChange,
  filter,
  onFilterChange,
  isLoading,
}: EmailListProps) {
  const filteredMessages = messages.filter((msg) => {
    if (filter === "unread" && !msg.isUnread) return false;
    return true;
  });

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

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={() => onFilterChange("all")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              filter === "all"
                ? "bg-os-primary/15 text-os-primary border border-os-primary/30"
                : "text-os-muted hover:bg-os-surface-2"
            }`}
          >
            Todas ({messages.length})
          </button>
          <button
            onClick={() => onFilterChange("unread")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              filter === "unread"
                ? "bg-os-primary/15 text-os-primary border border-os-primary/30"
                : "text-os-muted hover:bg-os-surface-2"
            }`}
          >
            Não Lidas ({messages.filter((m) => m.isUnread).length})
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
        ) : filteredMessages.length === 0 ? (
          <div className="p-8 text-center text-xs text-os-muted space-y-2">
            <Mail className="h-8 w-8 mx-auto text-os-muted opacity-40" />
            <p>Nenhum e-mail encontrado para o filtro atual.</p>
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
                {/* Unread indicator */}
                <div className="pt-1">
                  {msg.isUnread ? (
                    <span className="block h-2 w-2 rounded-full bg-os-primary ring-2 ring-os-primary/20" />
                  ) : (
                    <span className="block h-2 w-2 rounded-full bg-transparent" />
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  {/* Sender & Date */}
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`text-xs truncate ${
                        msg.isUnread
                          ? "font-bold text-os-fg"
                          : "font-medium text-os-muted"
                      }`}
                    >
                      {msg.sender.split("<")[0].replace(/"/g, "")}
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
