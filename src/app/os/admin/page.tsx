import { Settings, Shield, User } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="flex-1 space-y-4 p-8 min-h-screen bg-transparent">
      <div className="glass-card bg-white/70 backdrop-blur-xl border border-white/40 p-8 rounded-3xl shadow-2xl min-h-[600px]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-heading text-2xl font-bold text-[#003d9b] tracking-tight">
            Configurações
          </h2>
          <div className="bg-[#003d9b] text-white p-2 rounded-lg">
            <Settings className="h-5 w-5" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/50 border border-white/60 p-6 rounded-2xl flex items-start gap-4 hover:bg-white/70 cursor-pointer transition-colors">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Perfil</h3>
              <p className="text-sm text-slate-500">
                Gerencie suas informações pessoais e preferências.
              </p>
            </div>
          </div>

          <div className="bg-white/50 border border-white/60 p-6 rounded-2xl flex items-start gap-4 hover:bg-white/70 cursor-pointer transition-colors">
            <div className="p-3 bg-green-100 text-green-600 rounded-xl">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Segurança</h3>
              <p className="text-sm text-slate-500">
                Autenticação de dois fatores e controle de acessos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
