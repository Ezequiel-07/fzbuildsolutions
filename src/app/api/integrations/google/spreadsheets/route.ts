import { NextResponse } from "next/server";
import {
  getGoogleIntegrationStatus,
  listDriveSpreadsheets,
} from "@/features/finance/services/google-sheets-service";

export async function GET() {
  try {
    const status = await getGoogleIntegrationStatus();

    if (!status.connected) {
      return NextResponse.json({
        connected: false,
        files: [],
      });
    }

    const files = await listDriveSpreadsheets();

    return NextResponse.json({
      connected: true,
      email: status.email,
      files,
    });
  } catch (error: unknown) {
    console.error("[API_GOOGLE_SPREADSHEETS_ERROR]", error);
    return NextResponse.json(
      {
        connected: false,
        files: [],
        error: "Erro ao consultar planilhas no Google Drive.",
      },
      { status: 500 },
    );
  }
}
