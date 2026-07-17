"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  LayoutGrid,
  List,
  MoreVertical,
  MessageSquare,
  Loader2,
  Trash2,
  Edit3,
} from "lucide-react";
import {
  useProjects,
  useUpdateProject,
  useDeleteProject,
  Project,
} from "@/features/projects/api/use-projects";
import { NewProjectModal } from "@/features/projects/components/new-project-modal";
import { EditProjectModal } from "@/features/projects/components/edit-project-modal";

export default function ProjectsPage() {
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const { data: projects = [], isLoading } = useProjects();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const columns = [
    { name: "To Do", color: "bg-slate-300" },
    { name: "Doing", color: "bg-blue-400" },
    { name: "In Review", color: "bg-orange-400" },
    { name: "Done", color: "bg-green-400" },
  ];

  const handleStatusChange = async (
    projectId: string,
    currentStatus: string,
  ) => {
    // Simple cycle through statuses for demo purposes
    const statuses = ["To Do", "Doing", "In Review", "Done"];
    const currentIndex = statuses.indexOf(currentStatus);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];

    await updateProject.mutateAsync({
      id: projectId,
      data: { status: nextStatus },
    });
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 min-h-screen bg-transparent select-none">
      <div className="max-w-[1600px] mx-auto w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 glass-card bg-white/70 backdrop-blur-xl border border-white/40 p-6 rounded-2xl shadow-xl shadow-blue-900/5">
          <div>
            <h1 className="font-heading text-2xl font-extrabold tracking-tight text-slate-800 uppercase">
              Projetos & Sprints
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Gerenciamento ágil da fábrica de software
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-[#f3f4f6]/80 p-1 rounded-lg flex border border-slate-200">
              <button
                onClick={() => setView("kanban")}
                className={`p-2 rounded-md transition-all ${view === "kanban" ? "bg-white shadow-sm text-[#003d9b]" : "text-slate-400 hover:text-slate-600"}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView("list")}
                className={`p-2 rounded-md transition-all ${view === "list" ? "bg-white shadow-sm text-[#003d9b]" : "text-slate-400 hover:text-slate-600"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#003d9b] text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-blue-900/20 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all text-sm font-sans"
            >
              <Plus className="h-4 w-4" />
              <span>Novo Projeto</span>
            </button>
          </div>
        </div>

        {/* Board */}
        {view === "kanban" && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {isLoading ? (
              <div className="col-span-4 flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-[#003d9b]" />
              </div>
            ) : (
              columns.map((col, idx) => {
                const colProjects = projects.filter(
                  (p) => (p.status || "To Do") === col.name,
                );

                return (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={col.name}
                    className="glass-card bg-[#f8f9fb]/60 backdrop-blur-md border border-white/40 rounded-3xl p-5 min-h-[600px] shadow-lg shadow-slate-200/50"
                  >
                    <div className="flex justify-between items-center mb-6 px-1">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${col.color}`}
                        />
                        <h3 className="font-mono text-xs font-bold tracking-widest text-[#003d9b] uppercase">
                          {col.name}
                        </h3>
                        <span className="bg-slate-200 text-slate-500 text-[10px] px-2 py-0.5 rounded-full font-bold">
                          {colProjects.length}
                        </span>
                      </div>
                      <MoreVertical className="w-4 h-4 text-slate-400 cursor-pointer hover:text-[#003d9b]" />
                    </div>

                    <div className="space-y-4">
                      {colProjects.length === 0 ? (
                        <div className="text-center py-8 text-xs font-medium text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                          Vazio
                        </div>
                      ) : (
                        colProjects.map((project) => (
                          <motion.div
                            key={project.id}
                            whileHover={{ y: -4, scale: 1.01 }}
                            onClick={() =>
                              handleStatusChange(project.id, col.name)
                            }
                            className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm cursor-pointer group transition-all"
                            title="Clique para avançar o status"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <span className="text-[10px] font-bold text-[#00616d] bg-[#00e3fd]/20 px-2 py-1 rounded-md uppercase tracking-wider">
                                Projeto
                              </span>
                            </div>
                            <h4 className="text-sm font-bold text-slate-800 mb-2 leading-tight">
                              {project.name}
                            </h4>
                            <p className="text-xs text-slate-500 line-clamp-2 mb-4">
                              {project.description || "Sem descrição."}
                            </p>

                            <div className="flex items-center justify-between w-full">
                              <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className="bg-blue-500 h-full"
                                  style={{
                                    width: `${project.progress || Math.floor(Math.random() * 100)}%`,
                                  }}
                                />
                              </div>
                              <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                                <div className="flex items-center gap-1 hover:text-[#003d9b] transition-colors">
                                  <MessageSquare className="w-3.5 h-3.5" />{" "}
                                  {Math.floor(Math.random() * 5)}
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedProject(project);
                                  }}
                                  className="p-1 hover:bg-[#003d9b]/10 hover:text-[#003d9b] rounded transition-colors"
                                  title="Editar Projeto"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (
                                      window.confirm(
                                        "Deseja realmente excluir este projeto?",
                                      )
                                    ) {
                                      deleteProject.mutate(project.id);
                                    }
                                  }}
                                  className="p-1 hover:bg-red-50 hover:text-red-500 rounded transition-colors"
                                  title="Excluir Projeto"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        )}

        {/* List View */}
        {view === "list" && (
          <div className="glass-card bg-[#f8f9fb]/60 backdrop-blur-md border border-white/40 rounded-3xl p-6 shadow-lg shadow-slate-200/50">
            {isLoading ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-[#003d9b]" />
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-12 text-sm font-medium text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                Nenhum projeto encontrado.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200/50">
                      <th className="py-3 px-4 font-mono text-xs font-bold tracking-widest text-slate-400 uppercase">
                        Projeto
                      </th>
                      <th className="py-3 px-4 font-mono text-xs font-bold tracking-widest text-slate-400 uppercase">
                        Status
                      </th>
                      <th className="py-3 px-4 font-mono text-xs font-bold tracking-widest text-slate-400 uppercase">
                        Progresso
                      </th>
                      <th className="py-3 px-4 font-mono text-xs font-bold tracking-widest text-slate-400 uppercase text-right">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project, idx) => (
                      <motion.tr
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={project.id}
                        className="border-b border-slate-100 hover:bg-white/50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <h4 className="text-sm font-bold text-slate-800">
                            {project.name}
                          </h4>
                          <p className="text-xs text-slate-500 line-clamp-1">
                            {project.description || "Sem descrição."}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`text-xs font-bold px-3 py-1 rounded-full ${
                              project.status === "Done"
                                ? "bg-green-100 text-green-700"
                                : project.status === "Doing"
                                  ? "bg-blue-100 text-[#003d9b]"
                                  : project.status === "In Review"
                                    ? "bg-orange-100 text-orange-700"
                                    : "bg-slate-200 text-slate-600"
                            }`}
                          >
                            {project.status || "To Do"}
                          </span>
                        </td>
                        <td className="py-4 px-4 w-48">
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className="bg-blue-500 h-full"
                                style={{ width: `${project.progress || 0}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold text-slate-500">
                              {project.progress || 0}%
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedProject(project);
                              }}
                              className="p-2 text-slate-400 hover:text-[#003d9b] hover:bg-[#003d9b]/10 rounded-lg transition-colors"
                              title="Editar Projeto"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (
                                  window.confirm(
                                    "Deseja realmente excluir este projeto?",
                                  )
                                ) {
                                  deleteProject.mutate(project.id);
                                }
                              }}
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Excluir Projeto"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      <NewProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <EditProjectModal
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        project={selectedProject}
      />
    </div>
  );
}
