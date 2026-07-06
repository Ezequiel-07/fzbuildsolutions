"use client";

import { useState } from "react";
import {
  useProjects,
  useDeleteProject,
} from "@/features/projects/api/use-projects";
import { NewProjectModal } from "./new-project-modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Trash2, Edit } from "lucide-react";
import { format } from "date-fns";

export function ProjectList() {
  const { data: projects, isLoading, error } = useProjects();
  const deleteProject = useDeleteProject();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-destructive">Failed to load projects.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Projetos</h2>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Projeto
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progresso</TableHead>
              <TableHead>Data de Criação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Nenhum projeto encontrado.
                </TableCell>
              </TableRow>
            ) : (
              projects?.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        project.status === "completed" ? "default" : "secondary"
                      }
                    >
                      {project.status === "completed"
                        ? "Concluído"
                        : project.status === "idle"
                          ? "Ausente"
                          : "Ativo"}
                    </Badge>
                  </TableCell>
                  <TableCell>{project.progress || 0}%</TableCell>
                  <TableCell>
                    {project.createdAt?.seconds
                      ? format(
                          new Date(project.createdAt.seconds * 1000),
                          "MMM d, yyyy",
                        )
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => deleteProject.mutate(project.id)}
                      disabled={deleteProject.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <NewProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
