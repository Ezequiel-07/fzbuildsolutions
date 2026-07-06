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
import { Download } from "lucide-react";

const MOCK_INVOICES = [
  {
    id: "INV-001",
    client: "Acme Corp",
    amount: 5000,
    status: "PAID",
    date: "2026-06-15",
  },
  {
    id: "INV-002",
    client: "Globex",
    amount: 2500,
    status: "PENDING",
    date: "2026-07-01",
  },
  {
    id: "INV-003",
    client: "Soylent",
    amount: 8000,
    status: "OVERDUE",
    date: "2026-05-20",
  },
];

export function InvoiceList() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice ID</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {MOCK_INVOICES.map((inv) => (
            <TableRow key={inv.id}>
              <TableCell className="font-medium">{inv.id}</TableCell>
              <TableCell>{inv.client}</TableCell>
              <TableCell>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(inv.amount)}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    inv.status === "PAID"
                      ? "default"
                      : inv.status === "PENDING"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {inv.status}
                </Badge>
              </TableCell>
              <TableCell>{inv.date}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
