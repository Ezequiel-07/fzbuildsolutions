"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import type {
  GoogleDriveFile,
  ReadSpreadsheetResult,
} from "../services/google-sheets-service";

export interface GoogleSpreadsheetsStatus {
  connected: boolean;
  email?: string;
  files: GoogleDriveFile[];
  error?: string;
}

export function useGoogleSpreadsheets() {
  return useQuery<GoogleSpreadsheetsStatus>({
    queryKey: ["integrations", "google", "spreadsheets"],
    queryFn: async () => {
      const res = await fetch("/api/integrations/google/spreadsheets");
      if (!res.ok) {
        throw new Error("Erro ao consultar planilhas do Google Drive");
      }
      return res.json();
    },
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
}

export interface ReadSheetParams {
  spreadsheetId?: string;
  url?: string;
  sheetName?: string;
  csvText?: string;
}

export function useReadSheetMutation() {
  return useMutation<
    { success: boolean; data: ReadSpreadsheetResult },
    Error,
    ReadSheetParams
  >({
    mutationFn: async (params: ReadSheetParams) => {
      const res = await fetch("/api/integrations/google/sheets/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Falha ao carregar dados da planilha.");
      }

      return json;
    },
  });
}
