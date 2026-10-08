import { NextResponse } from "next/server";
import {
  discoverLeadsWithGemini,
  type ProspectParams,
} from "@/features/crm/services/gemini-prospector";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const params: ProspectParams = {
      niche: body.niche || "Startups & Empresas em Expansão Digital",
      location: body.location || "São Paulo - SP",
      trigger:
        body.trigger ||
        "Demanda por software sob medida em nuvem, aplicativo mobile ou portal digital",
      count: Number(body.count) || 5,
    };

    const result = await discoverLeadsWithGemini(params);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[CRM_PROSPECT_ERROR]", error);
    return NextResponse.json(
      { error: "Falha ao processar varredura de prospecção com IA." },
      { status: 500 },
    );
  }
}
