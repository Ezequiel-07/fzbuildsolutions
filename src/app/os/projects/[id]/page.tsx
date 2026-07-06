import { KanbanBoard } from "@/features/projects/components/kanban-board";

export default function ProjectTasksPage() {
  // In a real scenario, fetch project info to show the title
  return (
    <div className="flex-1 flex flex-col space-y-4 h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Project Tasks</h2>
      </div>
      <div className="flex-1 overflow-hidden">
        <KanbanBoard />
      </div>
    </div>
  );
}
