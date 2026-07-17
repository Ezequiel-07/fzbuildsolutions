"use client";

import { Share2, Save, Download } from "lucide-react";
import { WorkflowEditor } from "@/features/workflows/components/workflow-editor";

export default function WorkflowPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 min-h-screen bg-transparent select-none">
      <div className="max-w-[1600px] mx-auto w-full flex flex-col h-[calc(100vh-120px)]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 glass-card bg-white/70 backdrop-blur-xl border border-white/40 p-6 rounded-2xl shadow-xl shadow-blue-900/5 z-20 relative">
          <div>
            <h1 className="font-heading text-2xl font-extrabold tracking-tight text-slate-800 uppercase">
              Visualização de Fluxos
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Arquitetura de sistemas e mapeamento de processos
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2.5 text-slate-500 hover:text-[#003d9b] bg-white rounded-lg shadow-sm border border-slate-100 hover:scale-105 transition-all">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="p-2.5 text-slate-500 hover:text-[#003d9b] bg-white rounded-lg shadow-sm border border-slate-100 hover:scale-105 transition-all">
              <Download className="w-4 h-4" />
            </button>
            <button className="bg-[#003d9b] text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-blue-900/20 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all text-sm font-sans">
              <Save className="h-4 w-4" />
              <span>Salvar Diagrama</span>
            </button>
          </div>
        </div>

        {/* Workflow Editor Canvas */}
        <WorkflowEditor />
      </div>
    </div>
  );
}
