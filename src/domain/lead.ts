/**
 * Domain: CRM lead stage
 *
 * The CRM currently uses two different vocabularies ("Leads Novos /
 * Qualificação / Proposta Enviada / Negociação / Fechado" on the pipeline and
 * "Qualificado / Reunião / Proposta / Perdido" on the detail page). This module
 * normalizes both into one canonical set. Writes stay legacy-compatible until
 * a data migration is explicitly approved.
 */

import type { Tone } from "./tone";

export const LEAD_STAGES = [
  "new",
  "qualification",
  "proposal",
  "negotiation",
  "won",
  "lost",
] as const;

export type LeadStage = (typeof LEAD_STAGES)[number];

export const LEAD_STAGE_META: Record<LeadStage, { label: string; tone: Tone }> =
  {
    new: { label: "Novo", tone: "info" },
    qualification: { label: "Qualificação", tone: "accent" },
    proposal: { label: "Proposta enviada", tone: "warning" },
    negotiation: { label: "Negociação", tone: "warning" },
    won: { label: "Ganho", tone: "success" },
    lost: { label: "Perdido", tone: "danger" },
  };

/** Value persisted in Firestore today (legacy-compatible). */
const STORED_VALUE: Record<LeadStage, string> = {
  new: "Leads Novos",
  qualification: "Qualificação",
  proposal: "Proposta Enviada",
  negotiation: "Negociação",
  won: "Fechado",
  lost: "Perdido",
};

const LEGACY_MAP: Record<string, LeadStage> = {
  "leads novos": "new",
  novo: "new",
  lead: "new",
  new: "new",
  qualificação: "qualification",
  qualificacao: "qualification",
  qualificado: "qualification",
  reunião: "qualification",
  reuniao: "qualification",
  qualification: "qualification",
  "proposta enviada": "proposal",
  proposta: "proposal",
  proposal: "proposal",
  negociação: "negotiation",
  negociacao: "negotiation",
  negotiation: "negotiation",
  fechado: "won",
  ganho: "won",
  won: "won",
  perdido: "lost",
  lost: "lost",
};

export function normalizeLeadStage(raw?: string | null): LeadStage {
  if (!raw) return "new";
  return LEGACY_MAP[raw.trim().toLowerCase()] ?? "new";
}

export function toStoredLeadStage(stage: LeadStage): string {
  return STORED_VALUE[stage];
}

export function isLeadOpen(raw?: string | null): boolean {
  const s = normalizeLeadStage(raw);
  return s !== "won" && s !== "lost";
}
