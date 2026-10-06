/**
 * Domain: Project status
 *
 * Single source of truth for project lifecycle states across the FZ OS.
 *
 * Firestore currently stores heterogeneous legacy values ("To Do", "Doing",
 * "In Review", "Done", "Fechado", "completed", ...). Reads are normalized to a
 * canonical key; writes go through `toStoredProjectStatus` so existing pages
 * that still compare raw strings keep working. When the data migration is
 * approved, only `STORED_VALUE` needs to change.
 */

import type { Tone } from "./tone";

export const PROJECT_STATUSES = [
  "todo",
  "in_progress",
  "in_review",
  "done",
] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const PROJECT_STATUS_META: Record<
  ProjectStatus,
  { label: string; tone: Tone }
> = {
  todo: { label: "A fazer", tone: "neutral" },
  in_progress: { label: "Em andamento", tone: "info" },
  in_review: { label: "Em revisão", tone: "warning" },
  done: { label: "Concluído", tone: "success" },
};

/** Value persisted in Firestore today (legacy-compatible). */
const STORED_VALUE: Record<ProjectStatus, string> = {
  todo: "To Do",
  in_progress: "Doing",
  in_review: "In Review",
  done: "Done",
};

const LEGACY_MAP: Record<string, ProjectStatus> = {
  "to do": "todo",
  todo: "todo",
  "a fazer": "todo",
  planejamento: "todo",
  backlog: "todo",
  doing: "in_progress",
  in_progress: "in_progress",
  "em andamento": "in_progress",
  active: "in_progress",
  ativo: "in_progress",
  "in review": "in_review",
  in_review: "in_review",
  review: "in_review",
  "em revisão": "in_review",
  "em revisao": "in_review",
  done: "done",
  completed: "done",
  concluido: "done",
  concluído: "done",
  fechado: "done",
};

export function normalizeProjectStatus(raw?: string | null): ProjectStatus {
  if (!raw) return "todo";
  return LEGACY_MAP[raw.trim().toLowerCase()] ?? "todo";
}

export function toStoredProjectStatus(status: ProjectStatus): string {
  return STORED_VALUE[status];
}

export function isProjectActive(raw?: string | null): boolean {
  return normalizeProjectStatus(raw) !== "done";
}
