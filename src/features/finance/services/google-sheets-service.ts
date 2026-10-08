import { google } from "googleapis";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  getOAuthClient,
  SETTINGS_DOC_ID,
} from "@/features/inbox/services/gmail-service";

export interface GoogleDriveFile {
  id: string;
  name: string;
  modifiedTime?: string;
  webViewLink?: string;
  iconLink?: string;
}

export interface SheetTabInfo {
  id?: number;
  title: string;
  rowCount?: number;
  columnCount?: number;
}

export interface ReadSpreadsheetResult {
  title: string;
  activeSheet: string;
  sheetTabs: SheetTabInfo[];
  rows: string[][];
  source: "google_api" | "public_export" | "csv_upload";
}

/**
 * Retorna o cliente OAuth autenticado a partir dos tokens salvos no Firestore
 */
export async function getAuthenticatedGoogleClient() {
  const oauth2Client = getOAuthClient();
  if (!oauth2Client) return null;

  try {
    const docRef = doc(db, "settings", SETTINGS_DOC_ID);
    const snap = await getDoc(docRef);

    if (
      !snap.exists() ||
      !snap.data().refreshToken ||
      snap.data().isActive === false
    ) {
      return null;
    }

    const data = snap.data();
    oauth2Client.setCredentials({
      refresh_token: data.refreshToken,
      access_token: data.accessToken,
    });

    return oauth2Client;
  } catch (err) {
    console.error(
      "[GoogleSheetsService] Falha ao recuperar credenciais Google:",
      err,
    );
    return null;
  }
}

/**
 * Consulta status da conexão Google (Drive/Sheets)
 */
export async function getGoogleIntegrationStatus(): Promise<{
  connected: boolean;
  email?: string;
}> {
  try {
    const docRef = doc(db, "settings", SETTINGS_DOC_ID);
    const snap = await getDoc(docRef);

    if (
      snap.exists() &&
      snap.data().refreshToken &&
      snap.data().isActive !== false
    ) {
      return {
        connected: true,
        email: snap.data().email,
      };
    }
  } catch (err) {
    console.warn("[GoogleSheetsService] Erro ao consultar Firestore:", err);
  }

  return { connected: false };
}

/**
 * Lista as planilhas do usuário no Google Drive
 */
export async function listDriveSpreadsheets(): Promise<GoogleDriveFile[]> {
  const auth = await getAuthenticatedGoogleClient();
  if (!auth) return [];

  try {
    const drive = google.drive({ version: "v3", auth });
    const res = await drive.files.list({
      q: "mimeType='application/vnd.google-apps.spreadsheet' and trashed=false",
      pageSize: 30,
      fields: "files(id, name, modifiedTime, webViewLink, iconLink)",
      orderBy: "modifiedTime desc",
    });

    return (res.data.files as GoogleDriveFile[]) || [];
  } catch (err) {
    console.error(
      "[GoogleSheetsService] Erro ao listar arquivos do Google Drive:",
      err,
    );
    return [];
  }
}

/**
 * Extrai o ID da planilha do Google a partir de uma URL completa ou string direta
 */
export function extractSpreadsheetId(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();

  // URL padrão: https://docs.google.com/spreadsheets/d/{ID}/edit...
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    return match[1];
  }

  // Se já for um ID direto (alfanumérico longo)
  if (/^[a-zA-Z0-9-_]{20,}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

/**
 * Lê o conteúdo da planilha via Google Sheets API oficial (autenticado)
 */
async function readViaGoogleApi(
  spreadsheetId: string,
  sheetName?: string,
): Promise<ReadSpreadsheetResult | null> {
  const auth = await getAuthenticatedGoogleClient();
  if (!auth) return null;

  try {
    const sheets = google.sheets({ version: "v4", auth });

    // 1. Obter metadados da planilha e abas disponíveis
    const meta = await sheets.spreadsheets.get({
      spreadsheetId,
      fields:
        "spreadsheetId,properties.title,sheets(properties(sheetId,title,index,gridProperties(rowCount,columnCount)))",
    });

    const title = meta.data.properties?.title || "Planilha Google";
    const sheetTabs: SheetTabInfo[] =
      meta.data.sheets?.map((s) => ({
        id: s.properties?.sheetId ?? undefined,
        title: s.properties?.title || "Página1",
        rowCount: s.properties?.gridProperties?.rowCount ?? undefined,
        columnCount: s.properties?.gridProperties?.columnCount ?? undefined,
      })) || [];

    const activeSheet = sheetName || sheetTabs[0]?.title || "Página1";

    // 2. Buscar valores da aba selecionada
    const valRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `'${activeSheet}'!A1:ZZ5000`,
      valueRenderOption: "FORMATTED_VALUE",
    });

    const rows = (valRes.data.values as string[][]) || [];

    return {
      title,
      activeSheet,
      sheetTabs,
      rows,
      source: "google_api",
    };
  } catch (err) {
    console.warn(
      "[GoogleSheetsService] Não foi possível ler via API autenticada:",
      err,
    );
    return null;
  }
}

/**
 * Lê uma planilha pública ou compartilhada via exportação CSV do Google
 */
async function readViaPublicExport(
  spreadsheetId: string,
  sheetName?: string,
): Promise<ReadSpreadsheetResult> {
  const exportUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv${
    sheetName ? `&sheet=${encodeURIComponent(sheetName)}` : ""
  }`;

  const res = await fetch(exportUrl, {
    headers: {
      "User-Agent": "FZ-Build-Solutions/1.0",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(
      "Não foi possível acessar a planilha. Verifique se o link está correto e se o compartilhamento está ativado para 'Qualquer pessoa com o link'.",
    );
  }

  const csvText = await res.text();
  const rows = parseCsv(csvText);

  if (rows.length === 0) {
    throw new Error("A planilha retornou vazia ou sem dados legíveis.");
  }

  return {
    title: "Planilha Importada",
    activeSheet: sheetName || "Página Principal",
    sheetTabs: [],
    rows,
    source: "public_export",
  };
}

/**
 * Lê a planilha utilizando a melhor estratégia disponível (API autenticada ou fallback público)
 */
export async function readSpreadsheet(params: {
  spreadsheetId: string;
  sheetName?: string;
}): Promise<ReadSpreadsheetResult> {
  const { spreadsheetId, sheetName } = params;

  // Tenta primeiro via API oficial autenticada
  const apiResult = await readViaGoogleApi(spreadsheetId, sheetName);
  if (apiResult && apiResult.rows.length > 0) {
    return apiResult;
  }

  // Fallback para visualização pública
  return await readViaPublicExport(spreadsheetId, sheetName);
}

/**
 * Parser de CSV nativo e resiliente para formatos brasileiros e internacionais.
 * Suporta separadores vírgula (,), ponto e vírgula (;), tabulações (\t) e aspas duplas.
 */
export function parseCsv(text: string): string[][] {
  if (!text || !text.trim()) return [];

  // Remove caracteres de controle estranhos no início (BOM UTF-8)
  const clean = text.replace(/^\uFEFF/, "").trim();

  // Auto-detectar delimitador analisando a primeira linha
  const firstLine = clean.split(/\r\n|\n|\r/)[0] || "";
  const commaCount = (firstLine.match(/,/g) || []).length;
  const semicolonCount = (firstLine.match(/;/g) || []).length;
  const tabCount = (firstLine.match(/\t/g) || []).length;

  let delimiter = ",";
  if (semicolonCount > commaCount && semicolonCount >= tabCount) {
    delimiter = ";";
  } else if (tabCount > commaCount && tabCount > semicolonCount) {
    delimiter = "\t";
  }

  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = "";
  let inQuotes = false;

  for (let i = 0; i < clean.length; i++) {
    const char = clean[i];
    const nextChar = clean[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          // Escaped quote: "" -> "
          currentField += '"';
          i++;
        } else {
          // Fim do bloco de aspas
          inQuotes = false;
        }
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === delimiter) {
        currentRow.push(currentField.trim());
        currentField = "";
      } else if (char === "\r" || char === "\n") {
        if (char === "\r" && nextChar === "\n") {
          i++; // pular \n em sequências \r\n
        }
        currentRow.push(currentField.trim());
        if (currentRow.some((field) => field !== "")) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentField = "";
      } else {
        currentField += char;
      }
    }
  }

  // Campo e linha remanescentes no final do texto
  if (currentField !== "" || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some((field) => field !== "")) {
      rows.push(currentRow);
    }
  }

  return rows;
}
