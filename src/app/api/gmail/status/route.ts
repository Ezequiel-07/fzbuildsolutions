import { NextResponse } from "next/server";
import {
  getGmailStatus,
  disconnectGmail,
} from "@/features/inbox/services/gmail-service";

export async function GET() {
  try {
    const status = await getGmailStatus();
    return NextResponse.json(status);
  } catch (error) {
    console.error("[GMAIL_STATUS_ERROR]", error);
    return NextResponse.json(
      { connected: false, isDemoMode: false },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    if (body.action === "disconnect") {
      await disconnectGmail();
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
  } catch (error) {
    console.error("[GMAIL_DISCONNECT_ERROR]", error);
    return NextResponse.json(
      { error: "Falha ao desconectar" },
      { status: 500 },
    );
  }
}
