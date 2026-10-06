import { NextResponse } from "next/server";
import {
  getMessageDetail,
  trashMessage,
} from "@/features/inbox/services/gmail-service";

export async function GET(
  _req: Request,
  props: { params: Promise<{ id: string }> },
) {
  try {
    const params = await props.params;
    const message = await getMessageDetail(params.id);

    if (!message) {
      return NextResponse.json(
        { error: "Mensagem não encontrada." },
        { status: 404 },
      );
    }

    return NextResponse.json(message);
  } catch (error) {
    console.error("[GMAIL_DETAIL_ERROR]", error);
    return NextResponse.json(
      { error: "Falha ao carregar detalhe da mensagem." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: Request,
  props: { params: Promise<{ id: string }> },
) {
  try {
    const params = await props.params;
    await trashMessage(params.id);
    return NextResponse.json({ success: true, id: params.id });
  } catch (error) {
    console.error("[GMAIL_TRASH_ERROR]", error);
    return NextResponse.json(
      { error: "Falha ao mover mensagem para a lixeira." },
      { status: 500 },
    );
  }
}
