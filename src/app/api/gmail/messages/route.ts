import { NextResponse } from "next/server";
import {
  listInboxMessages,
  sendGmailMessage,
} from "@/features/inbox/services/gmail-service";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || undefined;
    const maxResults = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!, 10)
      : 15;
    const pageToken = searchParams.get("pageToken") || undefined;

    const result = await listInboxMessages({ query, maxResults, pageToken });
    return NextResponse.json(result);
  } catch (error) {
    console.error("[GMAIL_LIST_ERROR]", error);
    return NextResponse.json(
      { error: "Erro ao listar mensagens do Gmail." },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { to, subject, bodyHtml, inReplyTo } = body;

    if (!to || !subject || !bodyHtml) {
      return NextResponse.json(
        { error: "Destinatário, assunto e corpo são obrigatórios." },
        { status: 400 },
      );
    }

    const result = await sendGmailMessage({ to, subject, bodyHtml, inReplyTo });
    return NextResponse.json(result);
  } catch (error) {
    console.error("[GMAIL_SEND_ERROR]", error);
    return NextResponse.json(
      { error: "Falha ao enviar e-mail via Gmail." },
      { status: 500 },
    );
  }
}
