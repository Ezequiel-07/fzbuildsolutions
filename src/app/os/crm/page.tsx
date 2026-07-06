import { LeadsTable } from "@/features/crm/components/leads-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function CRMPage() {
  return (
    <div className="flex-1 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">CRM & Sales</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Lead
        </Button>
      </div>

      <div className="mt-4">
        <LeadsTable />
      </div>
    </div>
  );
}
