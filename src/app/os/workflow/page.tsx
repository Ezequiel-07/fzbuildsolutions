"use client";

import { Save, Download } from "lucide-react";
import { WorkflowEditor } from "@/features/workflows/components/workflow-editor";
import { PageHeader } from "@/components/os/page-header";
import { Button } from "@/components/os/button";
import { toast } from "sonner";

export default function WorkflowPage() {
  const handleSave = () => {
    toast.success("Diagrama de automação salvo com sucesso!");
  };

  const handleExport = () => {
    toast.info("Exportando diagrama de processos em formato JSON...");
  };

  return (
    <div className="space-y-4 flex flex-col h-[calc(100vh-100px)]">
      <PageHeader
        title="Automações & Workflows Visuais"
        description="Mapeamento de arquitetura de software, pipelines de dados e fluxos operacionais"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={handleExport}>
              <Download className="w-4 h-4" />
              <span>Exportar</span>
            </Button>
            <Button variant="primary" onClick={handleSave}>
              <Save className="w-4 h-4" />
              <span>Salvar Diagrama</span>
            </Button>
          </div>
        }
      />

      {/* Canvas */}
      <div className="flex-1 rounded-2xl border border-os-border overflow-hidden bg-os-surface shadow-sm">
        <WorkflowEditor />
      </div>
    </div>
  );
}
