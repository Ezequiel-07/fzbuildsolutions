"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  GmailMessageSummary,
  GmailMessageDetail,
  GmailStatusResult,
} from "../services/gmail-service";

export function useGmailStatus() {
  return useQuery<GmailStatusResult>({
    queryKey: ["gmail", "status"],
    queryFn: async () => {
      const res = await fetch("/api/gmail/status");
      if (!res.ok) throw new Error("Erro ao consultar status do Gmail");
      return res.json();
    },
  });
}

export function useDisconnectGmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/gmail/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "disconnect" }),
      });
      if (!res.ok) throw new Error("Erro ao desconectar Gmail");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gmail"] });
    },
  });
}

export function useGmailMessages(
  query?: string,
  folder: "inbox" | "sent" | "all" = "inbox",
) {
  return useQuery<{ messages: GmailMessageSummary[]; isDemoMode: boolean }>({
    queryKey: ["gmail", "messages", folder, query || ""],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (folder) params.set("folder", folder);

      const url = `/api/gmail/messages?${params.toString()}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Erro ao carregar e-mails");
      return res.json();
    },
  });
}

export function useGmailMessage(id?: string) {
  return useQuery<GmailMessageDetail>({
    queryKey: ["gmail", "message", id],
    queryFn: async () => {
      if (!id) throw new Error("ID obrigatório");
      const res = await fetch(`/api/gmail/messages/${id}`);
      if (!res.ok) throw new Error("Erro ao carregar detalhes da mensagem");
      return res.json();
    },
    enabled: !!id,
  });
}

export function useSendEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      to: string;
      subject: string;
      bodyHtml: string;
      inReplyTo?: string;
    }) => {
      const res = await fetch("/api/gmail/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Erro ao enviar e-mail");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gmail", "messages"] });
    },
  });
}

export function useTrashMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/gmail/messages/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erro ao mover e-mail para a lixeira");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gmail", "messages"] });
    },
  });
}

export function useGenerateAiProposal() {
  return useMutation({
    mutationFn: async (params: {
      companyName: string;
      contactEmail?: string;
      tradeName?: string;
      segment?: string;
      cityState?: string;
      detectedPain?: string;
      projectOpportunity?: string;
      estimatedBudget?: number;
      recommendedPitch?: string;
    }) => {
      const res = await fetch("/api/crm/ai-proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      if (!res.ok) {
        throw new Error("Erro ao gerar proposta com IA");
      }
      return res.json() as Promise<{
        subject: string;
        bodyHtml: string;
        bodyText: string;
        isAiLive: boolean;
      }>;
    },
  });
}
