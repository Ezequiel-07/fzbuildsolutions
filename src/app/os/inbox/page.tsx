"use client";

import { useState, useEffect } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/os/page-header";
import { Button } from "@/components/os/button";
import { Panel } from "@/components/os/panel";
import { GmailConnectBanner } from "@/features/inbox/components/gmail-connect-banner";
import { EmailList } from "@/features/inbox/components/email-list";
import { EmailViewer } from "@/features/inbox/components/email-viewer";
import {
  ComposeEmailModal,
  type ComposeInitialData,
} from "@/features/inbox/components/compose-email-modal";
import {
  useGmailMessages,
  useGmailStatus,
} from "@/features/inbox/api/use-gmail";
import type { GmailMessageDetail } from "@/features/inbox/services/gmail-service";

export default function InboxPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeInitialData, setComposeInitialData] =
    useState<ComposeInitialData | null>(null);

  const { data: status, refetch: refetchStatus } = useGmailStatus();
  const isConnected = Boolean(status?.connected);

  const {
    data: messagesData,
    isLoading,
    refetch: refetchMessages,
  } = useGmailMessages(searchQuery);

  const refetch = () => {
    refetchStatus();
    refetchMessages();
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("connected") === "true") {
        toast.success("Conta Google Workspace conectada com sucesso!");
        refetchStatus();
        refetchMessages();
        window.history.replaceState({}, "", window.location.pathname);
      } else if (params.get("auth_error")) {
        const errType = params.get("auth_error");
        toast.error(
          `Falha ao autenticar com o Google (${errType}). Verifique as permissões.`,
        );
        window.history.replaceState({}, "", window.location.pathname);
      }
    }
  }, [refetchStatus, refetchMessages]);

  const messages = messagesData?.messages || [];

  const handleOpenNew = () => {
    setComposeInitialData(null);
    setIsComposeOpen(true);
  };

  const handleReply = (msg: GmailMessageDetail) => {
    setComposeInitialData({
      to: msg.fromEmail,
      subject: msg.subject.startsWith("Re:")
        ? msg.subject
        : `Re: ${msg.subject}`,
      inReplyTo: msg.id,
      bodyHtml: `<br/><br/><blockquote>Em ${msg.date}, ${msg.sender} escreveu:<br/>${msg.bodyHtml}</blockquote>`,
    });
    setIsComposeOpen(true);
  };

  const handleForward = (msg: GmailMessageDetail) => {
    setComposeInitialData({
      subject: msg.subject.startsWith("Enc:")
        ? msg.subject
        : `Enc: ${msg.subject}`,
      bodyHtml: `<br/><br/><blockquote>---------- Mensagem Encaminhada ----------<br/>De: ${msg.sender} &lt;${msg.fromEmail}&gt;<br/>Data: ${msg.date}<br/>Assunto: ${msg.subject}<br/>Para: ${msg.toEmail}<br/><br/>${msg.bodyHtml}</blockquote>`,
    });
    setIsComposeOpen(true);
  };

  const handleDeleted = () => {
    setSelectedId(null);
    refetch();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Comunicação & Gmail"
        description="Caixa de entrada integrada para recebimento, exclusão, respostas e propostas comerciais"
        breadcrumbs={[
          { label: "Comercial", href: "/os/crm" },
          { label: "Gmail & Comunicação" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => refetch()}
              leadingIcon={<RefreshCw className="h-4 w-4" />}
            >
              Atualizar
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenNew}
              leadingIcon={<Plus className="h-4 w-4" />}
            >
              Novo E-mail
            </Button>
          </div>
        }
      />

      {/* Gmail OAuth connection status banner */}
      <GmailConnectBanner />

      {/* Master-Detail Split Screen Container */}
      <Panel className="overflow-hidden border border-os-border rounded-2xl shadow-sm flex flex-col md:flex-row h-[720px]">
        {/* Left Master List */}
        <div className="w-full md:w-80 lg:w-96 shrink-0 h-full">
          <EmailList
            messages={messages}
            selectedId={selectedId}
            onSelect={setSelectedId}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filter={filter}
            onFilterChange={setFilter}
            isLoading={isLoading}
            isConnected={isConnected}
          />
        </div>

        {/* Right Detail Viewer */}
        <EmailViewer
          selectedId={selectedId}
          onReply={handleReply}
          onForward={handleForward}
          onDeleted={handleDeleted}
        />
      </Panel>

      {/* Compose & Edit Modal */}
      <ComposeEmailModal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        initialData={composeInitialData}
      />
    </div>
  );
}
