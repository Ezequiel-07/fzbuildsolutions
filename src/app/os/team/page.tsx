import { Users } from "lucide-react";

export default function TeamPage() {
  return (
    <div className="flex-1 space-y-4 p-8 min-h-screen bg-transparent">
      <div className="glass-card bg-white/70 backdrop-blur-xl border border-white/40 p-8 rounded-3xl shadow-2xl min-h-[600px]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-heading text-2xl font-bold text-[#003d9b] tracking-tight">
            Atividade da Equipe
          </h2>
          <div className="bg-[#003d9b] text-white p-2 rounded-lg">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Active Members */}
          <div className="bg-white/50 border border-white/60 p-6 rounded-2xl">
            <h3 className="font-bold text-slate-800 mb-4">Engenharia</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200" />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-800">
                    João Silva
                  </span>
                  <span className="text-xs text-green-600 font-bold">
                    Ativo
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200" />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-800">
                    Maria Oliveira
                  </span>
                  <span className="text-xs text-orange-500 font-bold">
                    Ocupado
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
