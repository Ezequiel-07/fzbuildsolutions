import { LeadsTable } from "@/features/crm/components/leads-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function CRMPage() {
  return (
    <div className="flex-1 space-y-4 p-8 min-h-screen bg-transparent">
      <div className="glass-card bg-white/70 backdrop-blur-xl border border-white/40 p-8 rounded-3xl shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-heading text-2xl font-bold text-[#003d9b] tracking-tight">
            CRM & Sales
          </h2>
          <Button className="bg-[#003d9b] hover:bg-[#003280] text-white">
            <Plus className="mr-2 h-4 w-4" />
            Add Lead
          </Button>
        </div>

        <div className="mt-4">
          <LeadsTable />
        </div>
      </div>
    </div>
  );
}
