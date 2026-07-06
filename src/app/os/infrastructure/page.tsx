import { Server } from "lucide-react";

export default function InfrastructurePage() {
  return (
    <div className="flex-1 space-y-4 p-8 min-h-screen bg-transparent">
      <div className="glass-card bg-white/70 backdrop-blur-xl border border-white/40 p-8 rounded-3xl shadow-2xl min-h-[600px] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-heading text-2xl font-bold text-[#003d9b] tracking-tight">
            Infrastructure Map
          </h2>
          <div className="bg-[#003d9b] text-white p-2 rounded-lg">
            <Server className="h-5 w-5" />
          </div>
        </div>

        <div className="flex-grow rounded-2xl bg-[#003d9b]/5 border border-[#003d9b]/10 flex items-center justify-center relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-overlay"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDs8dTuDWWZ_aBVawpCmlXCHIFfuxlJE3E15uQQaNiot1DvWAoDGqgcW6CQcP726pPF9T-n7dJNGXmE1TmHhTIOEKdEAmLXIxZeJoPy6lnQo2clWokl9ad5D_28rzeSr3InPJA2Ix0dw9F2tOOEwAplTQAv5Y4J-U0YeOM7K12sPTlx3WLZk7DXkpZRYOhqsgefdcUBXq4bWYu4Pq8teO04mzeSNTrXm1a5qyU0Tw-uHgwTByET-Jtr')",
            }}
          />

          {/* Placeholder Servers */}
          <div className="relative z-10 grid grid-cols-3 gap-8 p-12 w-full h-full">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-white flex flex-col items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer"
              >
                <Server className="h-8 w-8 text-[#003d9b] mb-4" />
                <span className="font-bold text-slate-800">Node-0{i}</span>
                <span className="text-xs text-green-500 font-bold mt-1">
                  Online
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
