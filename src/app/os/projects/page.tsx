import { ProjectList } from "@/features/projects/components/project-list";

export default function ProjectsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 min-h-screen bg-transparent">
      <div className="glass-card bg-white/70 backdrop-blur-xl border border-white/40 p-8 rounded-3xl shadow-2xl">
        <h2 className="font-heading text-2xl font-bold text-[#003d9b] mb-6 tracking-tight">
          Projetos
        </h2>
        <ProjectList />
      </div>
    </div>
  );
}
