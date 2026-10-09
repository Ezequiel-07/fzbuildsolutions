import { describe, it, expect } from "vitest";
import {
  normalizeProjectStatus,
  toStoredProjectStatus,
  isProjectActive,
  PROJECT_STATUSES,
  PROJECT_STATUS_META,
} from "./project";

describe("Domain: Project Status & Lifecycle", () => {
  it("normalizes legacy Portuguese and English status strings", () => {
    expect(normalizeProjectStatus("To Do")).toBe("todo");
    expect(normalizeProjectStatus("a fazer")).toBe("todo");
    expect(normalizeProjectStatus("planejamento")).toBe("todo");

    expect(normalizeProjectStatus("Doing")).toBe("in_progress");
    expect(normalizeProjectStatus("em andamento")).toBe("in_progress");
    expect(normalizeProjectStatus("active")).toBe("in_progress");

    expect(normalizeProjectStatus("In Review")).toBe("in_review");
    expect(normalizeProjectStatus("em revisão")).toBe("in_review");
    expect(normalizeProjectStatus("em revisao")).toBe("in_review");

    expect(normalizeProjectStatus("Done")).toBe("done");
    expect(normalizeProjectStatus("concluido")).toBe("done");
    expect(normalizeProjectStatus("concluído")).toBe("done");
    expect(normalizeProjectStatus("fechado")).toBe("done");
  });

  it("handles null, undefined, and unrecognized strings safely with fallback", () => {
    expect(normalizeProjectStatus(null)).toBe("todo");
    expect(normalizeProjectStatus(undefined)).toBe("todo");
    expect(normalizeProjectStatus("status_desconhecido")).toBe("todo");
  });

  it("converts canonical status to Firestore stored value", () => {
    expect(toStoredProjectStatus("todo")).toBe("To Do");
    expect(toStoredProjectStatus("in_progress")).toBe("Doing");
    expect(toStoredProjectStatus("in_review")).toBe("In Review");
    expect(toStoredProjectStatus("done")).toBe("Done");
  });

  it("identifies active vs completed projects correctly", () => {
    expect(isProjectActive("To Do")).toBe(true);
    expect(isProjectActive("Doing")).toBe(true);
    expect(isProjectActive("In Review")).toBe(true);
    expect(isProjectActive("Done")).toBe(false);
    expect(isProjectActive("concluído")).toBe(false);
  });

  it("defines complete metadata for all canonical statuses", () => {
    for (const status of PROJECT_STATUSES) {
      const meta = PROJECT_STATUS_META[status];
      expect(meta).toBeDefined();
      expect(meta.label).toBeTruthy();
      expect(["neutral", "info", "warning", "success"]).toContain(meta.tone);
    }
  });
});
