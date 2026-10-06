import { NextResponse } from "next/server";
import { discoverLeadsWithGemini } from "@/features/crm/services/gemini-prospector";

export async function GET(req: Request) {
  return handleCronExecution(req);
}

export async function POST(req: Request) {
  return handleCronExecution(req);
}

async function handleCronExecution(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    // If CRON_SECRET is configured, enforce bearer token verification
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await discoverLeadsWithGemini({
      niche: "Engenharia Civil, Instalações Prediais & Reformas Corporativas",
      location: "Principais capitais do Brasil (SP, RJ, MG, PR)",
      trigger:
        "Empresas com expansão recente, novas filiais ou necessidade de manutenção predial",
      count: 4,
    });

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      summary: result.searchSummary,
      provider: result.provider,
      leadsFound: result.leads.length,
      leads: result.leads,
    });
  } catch (error) {
    console.error("[CRM_CRON_ERROR]", error);
    return NextResponse.json(
      { error: "Erro na execução da rotina periódica de prospecção." },
      { status: 500 },
    );
  }
}
