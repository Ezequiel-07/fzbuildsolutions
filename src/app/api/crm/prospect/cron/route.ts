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
      niche:
        "Empresas em Crescimento com Demanda de Software em Nuvem e Apps Mobile",
      location: "Principais capitais do Brasil (SP, RJ, MG, PR, SC, RS)",
      trigger:
        "Digitalização de operações, demanda por sistemas web em nuvem, aplicativos mobile e automações",
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
