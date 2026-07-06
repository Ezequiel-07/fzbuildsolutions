import { InvoiceList } from "@/features/finance/components/invoice-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FinancePage() {
  return (
    <div className="flex-1 space-y-4 p-8 min-h-screen bg-transparent">
      <div className="glass-card bg-white/70 backdrop-blur-xl border border-white/40 p-8 rounded-3xl shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-heading text-2xl font-bold text-[#003d9b] tracking-tight">
            Financeiro
          </h2>
          <Button className="bg-[#003d9b] hover:bg-[#003280] text-white">
            <Plus className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-white/50 border-white/60">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Receivables
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">
                $10,500.00
              </div>
              <p className="text-xs text-muted-foreground">Pending & Overdue</p>
            </CardContent>
          </Card>
          <Card className="bg-white/50 border-white/60">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Paid (Month)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">$5,000.00</div>
              <p className="text-xs text-muted-foreground">
                +5% from last month
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white/50 border-white/60">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                $8,000.00
              </div>
              <p className="text-xs text-muted-foreground">Action required</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4 text-[#003d9b]">
            Recent Invoices
          </h3>
          <InvoiceList />
        </div>
      </div>
    </div>
  );
}
