import { NextResponse } from "next/server";
import {
  extractSpreadsheetId,
  readSpreadsheet,
  parseCsv,
} from "@/features/finance/services/google-sheets-service";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { spreadsheetId, url, sheetName, csvText } = body;

    // Se foi fornecido texto CSV diretamente (upload de arquivo local)
    if (csvText && typeof csvText === "string") {
      const rows = parseCsv(csvText);
      if (rows.length === 0) {
        return NextResponse.json(
          { success: false, error: "O arquivo CSV está vazio ou ilegível." },
          { status: 400 },
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          title: "Arquivo CSV Local",
          activeSheet: "Dados",
          sheetTabs: [],
          rows,
          source: "csv_upload",
        },
      });
    }

    // Identificar o ID da planilha do Google
    const targetId = spreadsheetId || (url ? extractSpreadsheetId(url) : null);

    if (!targetId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "ID ou link do Google Sheets inválido. Cole a URL completa da planilha (ex: https://docs.google.com/spreadsheets/d/.../edit).",
        },
        { status: 400 },
      );
    }

    const data = await readSpreadsheet({
      spreadsheetId: targetId,
      sheetName,
    });

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: unknown) {
    console.error("[API_READ_SHEET_ERROR]", error);
    const message =
      error instanceof Error
        ? error.message
        : "Erro ao ler a planilha. Verifique a URL e as permissões de acesso.";
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 },
    );
  }
}
