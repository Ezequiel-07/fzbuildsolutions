import { Network } from "lucide-react";

export default function WorkflowPage() {
  return (
    <div className="flex-1 space-y-4 p-8 min-h-screen bg-transparent">
      <div className="glass-card bg-white/70 backdrop-blur-xl border border-white/40 p-8 rounded-3xl shadow-2xl min-h-[600px] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-heading text-2xl font-bold text-[#003d9b] tracking-tight">
            Workflow Visualization
          </h2>
          <div className="bg-[#003d9b] text-white p-2 rounded-lg">
            <Network className="h-5 w-5" />
          </div>
        </div>

        <div className="flex-grow rounded-2xl bg-white/30 border border-white/50 flex items-center justify-center relative overflow-hidden">
          <div
            className="absolute inset-0 bg-contain bg-center bg-no-repeat opacity-80"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA3x5MISy9r_yq-GzGvmKV0gRUUThH0TGhvnF7T4uxXsUPdAaidgQD2PNWxI2vvogXSmxqWD6yFwV_72ljVWbzAEW3cDowBK_I9PAyFy9buovTZkFu5olHU8lzMAZoHtYpjLFgjJKQMD-e2edaI1dR163NhSgdAgxbVf3zed1_lGnpa1C7R858GJz6OltHvltxVRHT_xBFuxjko-zA4__kR4rFczy9TU1GyULUhGQ9oIc49jYbDgGQE')",
            }}
          />
        </div>
      </div>
    </div>
  );
}
