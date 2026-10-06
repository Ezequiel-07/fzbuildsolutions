"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Plus,
  Search,
  Mail,
  Phone,
  Edit3,
  Trash2,
  CheckCircle2,
  Briefcase,
} from "lucide-react";
import {
  useClients,
  useCreateClient,
  useUpdateClient,
  useDeleteClient,
  type Client,
} from "@/features/clients/api/use-clients";
import { PageHeader } from "@/components/os/page-header";
import { Panel } from "@/components/os/panel";
import { Button } from "@/components/os/button";
import { StatusBadge } from "@/components/os/status-badge";
import { EmptyState } from "@/components/os/empty-state";
import { Skeleton } from "@/components/os/skeleton";
import { ConfirmDialog } from "@/components/os/confirm-dialog";
import { toast } from "sonner";

export default function ClientsPage() {
  const { data: clients = [], isLoading } = useClients();
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deletingClientId, setDeletingClientId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [corporateName, setCorporateName] = useState("");
  const [document, setDocument] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [segment, setSegment] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [notes, setNotes] = useState("");

  const openNewModal = () => {
    setEditingClient(null);
    setName("");
    setCorporateName("");
    setDocument("");
    setEmail("");
    setPhone("");
    setSegment("");
    setStatus("active");
    setNotes("");
    setIsModalOpen(true);
  };

  const openEditModal = (client: Client) => {
    setEditingClient(client);
    setName(client.name || "");
    setCorporateName(client.corporateName || "");
    setDocument(client.document || "");
    setEmail(client.email || "");
    setPhone(client.phone || "");
    setSegment(client.segment || "");
    setStatus(client.status || "active");
    setNotes(client.notes || "");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Informe o nome do cliente");
      return;
    }

    try {
      if (editingClient) {
        await updateClient.mutateAsync({
          id: editingClient.id,
          data: {
            name,
            corporateName,
            document,
            email,
            phone,
            segment,
            status,
            notes,
          },
        });
        toast.success("Cliente atualizado com sucesso!");
      } else {
        await createClient.mutateAsync({
          name,
          corporateName,
          document,
          email,
          phone,
          segment,
          status,
          notes,
        });
        toast.success("Cliente cadastrado com sucesso!");
      }
      setIsModalOpen(false);
    } catch {
      toast.error("Erro ao salvar cliente. Tente novamente.");
    }
  };

  const handleDelete = async () => {
    if (!deletingClientId) return;
    try {
      await deleteClient.mutateAsync(deletingClientId);
      toast.success("Cliente removido com sucesso.");
      setDeletingClientId(null);
    } catch {
      toast.error("Erro ao remover cliente.");
    }
  };

  const filteredClients = clients.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.corporateName?.toLowerCase().includes(q) ||
      c.document?.toLowerCase().includes(q) ||
      c.segment?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q)
    );
  });

  const activeClientsCount = clients.filter(
    (c) => c.status === "active",
  ).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clientes"
        description="Gestão de contas corporativas, contratos e dados cadastrais"
        actions={
          <Button variant="primary" onClick={openNewModal}>
            <Plus className="h-4 w-4" />
            <span>Novo Cliente</span>
          </Button>
        }
      />

      {/* Quick KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Panel className="p-4 flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-os-primary/10 text-os-primary">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-os-muted">Total de Clientes</p>
            <p className="text-xl font-bold text-os-fg">{clients.length}</p>
          </div>
        </Panel>

        <Panel className="p-4 flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-os-success/10 text-os-success">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-os-muted">Contratos Ativos</p>
            <p className="text-xl font-bold text-os-fg">{activeClientsCount}</p>
          </div>
        </Panel>

        <Panel className="p-4 flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-os-accent/10 text-os-accent">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-os-muted">Segmentos Distintos</p>
            <p className="text-xl font-bold text-os-fg">
              {new Set(clients.map((c) => c.segment).filter(Boolean)).size}
            </p>
          </div>
        </Panel>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-os-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, razão social, CNPJ ou segmento..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-os-border bg-os-surface text-xs text-os-fg focus:outline-none focus:ring-2 focus:ring-os-ring"
          />
        </div>
      </div>

      {/* Clients Table / List */}
      <Panel className="overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={Building2}
              title="Nenhum cliente encontrado"
              description={
                search
                  ? "Tente refinar sua pesquisa por nome ou CNPJ."
                  : "Cadastre seu primeiro cliente para vincular a projetos e propostas comerciais."
              }
              action={
                !search && (
                  <Button variant="primary" size="sm" onClick={openNewModal}>
                    <Plus className="h-3.5 w-3.5" />
                    <span>Cadastrar Cliente</span>
                  </Button>
                )
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-os-border bg-os-surface-2/60 text-os-muted font-mono font-medium">
                  <th className="py-3 px-4">CLIENTE / RAZÃO SOCIAL</th>
                  <th className="py-3 px-4">SEGMENTO</th>
                  <th className="py-3 px-4">CONTATOS</th>
                  <th className="py-3 px-4">DOCUMENTO</th>
                  <th className="py-3 px-4">STATUS</th>
                  <th className="py-3 px-4 text-right">AÇÕES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-os-border">
                {filteredClients.map((client) => (
                  <motion.tr
                    key={client.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-os-surface-2/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <p className="font-semibold text-os-fg">{client.name}</p>
                      {client.corporateName && (
                        <p className="text-[11px] text-os-muted">
                          {client.corporateName}
                        </p>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      {client.segment ? (
                        <span className="px-2 py-0.5 rounded-md bg-os-surface-2 text-os-fg text-[11px] border border-os-border">
                          {client.segment}
                        </span>
                      ) : (
                        <span className="text-os-muted italic">-</span>
                      )}
                    </td>

                    <td className="py-3 px-4 space-y-0.5">
                      {client.email && (
                        <div className="flex items-center gap-1.5 text-os-muted">
                          <Mail className="h-3 w-3" />
                          <span>{client.email}</span>
                        </div>
                      )}
                      {client.phone && (
                        <div className="flex items-center gap-1.5 text-os-muted">
                          <Phone className="h-3 w-3" />
                          <span>{client.phone}</span>
                        </div>
                      )}
                      {!client.email && !client.phone && (
                        <span className="text-os-muted italic">-</span>
                      )}
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-os-muted">
                      {client.document || "-"}
                    </td>

                    <td className="py-3 px-4">
                      <StatusBadge
                        tone={
                          client.status === "active" ? "success" : "neutral"
                        }
                      >
                        {client.status === "active" ? "Ativo" : "Inativo"}
                      </StatusBadge>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(client)}
                          className="p-1.5 rounded-lg text-os-muted hover:text-os-primary hover:bg-os-surface-2 transition-colors"
                          title="Editar Cliente"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingClientId(client.id)}
                          className="p-1.5 rounded-lg text-os-muted hover:text-os-danger hover:bg-os-danger/10 transition-colors"
                          title="Excluir Cliente"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {/* Modal Criar / Editar Cliente */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-os-surface rounded-2xl border border-os-border shadow-2xl p-6 space-y-4"
          >
            <h2 className="text-base font-bold text-os-fg">
              {editingClient ? "Editar Cliente" : "Novo Cliente"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-os-fg">
                    Nome Fantasia *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: EZYX Logistics"
                    className="w-full p-2 rounded-xl border border-os-border bg-os-surface text-xs text-os-fg focus:outline-none focus:ring-2 focus:ring-os-ring"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-os-fg">
                    Razão Social
                  </label>
                  <input
                    type="text"
                    value={corporateName}
                    onChange={(e) => setCorporateName(e.target.value)}
                    placeholder="Ex: EZYX Soluções Logísticas LTDA"
                    className="w-full p-2 rounded-xl border border-os-border bg-os-surface text-xs text-os-fg focus:outline-none focus:ring-2 focus:ring-os-ring"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-os-fg">
                    CNPJ / Documento
                  </label>
                  <input
                    type="text"
                    value={document}
                    onChange={(e) => setDocument(e.target.value)}
                    placeholder="00.000.000/0001-00"
                    className="w-full p-2 rounded-xl border border-os-border bg-os-surface text-xs text-os-fg focus:outline-none focus:ring-2 focus:ring-os-ring"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-os-fg">
                    Segmento
                  </label>
                  <input
                    type="text"
                    value={segment}
                    onChange={(e) => setSegment(e.target.value)}
                    placeholder="Ex: Logística, Finanças, Saúde"
                    className="w-full p-2 rounded-xl border border-os-border bg-os-surface text-xs text-os-fg focus:outline-none focus:ring-2 focus:ring-os-ring"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-os-fg">
                    E-mail de Contato
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contato@cliente.com"
                    className="w-full p-2 rounded-xl border border-os-border bg-os-surface text-xs text-os-fg focus:outline-none focus:ring-2 focus:ring-os-ring"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-os-fg">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full p-2 rounded-xl border border-os-border bg-os-surface text-xs text-os-fg focus:outline-none focus:ring-2 focus:ring-os-ring"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-os-fg">Status</label>
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as "active" | "inactive")
                  }
                  className="w-full p-2 rounded-xl border border-os-border bg-os-surface text-xs text-os-fg focus:outline-none focus:ring-2 focus:ring-os-ring"
                >
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-os-fg">
                  Observações
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Informações adicionais sobre o cliente..."
                  className="w-full p-2 rounded-xl border border-os-border bg-os-surface text-xs text-os-fg focus:outline-none focus:ring-2 focus:ring-os-ring resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-os-border">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  {editingClient ? "Salvar Alterações" : "Cadastrar Cliente"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Confirmation Dialog to delete client */}
      <ConfirmDialog
        open={!!deletingClientId}
        onOpenChange={(open) => !open && setDeletingClientId(null)}
        title="Excluir Cliente"
        description="Tem certeza que deseja excluir este cliente? Esta ação não poderá ser desfeita."
        confirmLabel="Sim, excluir"
        cancelLabel="Cancelar"
        tone="danger"
        onConfirm={handleDelete}
      />
    </div>
  );
}
