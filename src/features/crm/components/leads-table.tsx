"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useLeads } from "../api/use-leads";
import Link from "next/link";

export function LeadsTable() {
  const { data: leads = [], isLoading } = useLeads();

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Empresa</TableHead>
            <TableHead>Projeto / Oportunidade</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Valor Est.</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-6 text-muted-foreground text-xs"
              >
                Carregando leads reais...
              </TableCell>
            </TableRow>
          ) : leads.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-6 text-muted-foreground text-xs"
              >
                Nenhum lead cadastrado no funil comercial.
              </TableCell>
            </TableRow>
          ) : (
            leads.map((lead, idx) => (
              <TableRow
                key={lead.id ? `tbl-lead-${lead.id}` : `tbl-lead-idx-${idx}`}
              >
                <TableCell className="font-medium">{lead.clientName}</TableCell>
                <TableCell>{lead.projectName}</TableCell>
                <TableCell>
                  {lead.contact?.email || lead.contact?.phone || "-"}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{lead.stage}</Badge>
                </TableCell>
                <TableCell>
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(lead.value || 0)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button variant="ghost" className="h-8 w-8 p-0" />
                      }
                    >
                      <span className="sr-only">Ações</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <Link href={`/os/crm/${lead.id}`}>
                        <DropdownMenuItem className="cursor-pointer">
                          Ver detalhes 360
                        </DropdownMenuItem>
                      </Link>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
