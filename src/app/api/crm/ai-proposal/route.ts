import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      companyName,
      contactEmail,
      tradeName,
      segment,
      cityState,
      detectedPain,
      projectOpportunity,
      estimatedBudget,
      recommendedPitch,
    } = body;

    const company = tradeName || companyName || "sua empresa";
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Chave GEMINI_API_KEY não configurada no servidor. É necessário configurar a chave no ambiente (.env.local ou Firebase App Hosting) para redigir propostas dinâmicas em tempo real com IA.",
        },
        { status: 400 },
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
Você é o Diretor Comercial e Especialista em Redação de E-mails B2B da "FZ Build Solutions", Casa de Software (Software House) de ponta especializada no desenvolvimento sob medida de softwares em nuvem, aplicativos mobile (iOS e Android), sistemas web corporativos, sites modernos e automações inteligentes no Brasil.

Gere uma proposta de abordagem comercial por e-mail altamente profissional, consultiva e elegante para:
- Empresa: ${company} (Razão Social: ${companyName})
- E-mail do Contato: ${contactEmail || "decisor"}
- Segmento: ${segment || "Tecnologia / Operações"}
- Localidade: ${cityState || "Brasil"}
- Dor Identificada: ${detectedPain || "Processos manuais ou necessidade de sistema/app sob medida"}
- Oportunidade Mapeada: ${projectOpportunity || "Desenvolvimento de software sob medida em nuvem ou aplicativo mobile"}
- Orçamento Estimado: R$ ${estimatedBudget || "Sob consulta"}
- Pitch de Vendas Recomendado: ${recommendedPitch || "Apresentação consultiva de desenvolvimento de software FZ Build Solutions"}

REQUISITOS:
1. Retorne EXCLUSIVAMENTE um objeto JSON no seguinte formato:
{
  "subject": "Assunto magnético, profissional e direto",
  "bodyHtml": "Corpo do e-mail em HTML limpo, usando <p>, <ul>, <li>, <strong>, elegante e pronto para envio destacando a FZ Build como casa de software",
  "bodyText": "Versão em texto puro"
}
2. Assinatura formal da FZ Build Solutions com "Ezequiel Ferreira · FZ Build Solutions (Casa de Software)".
3. Tom consultivo, objetivo e persuasivo (sem parecer spam genérico). Enfatize retorno sobre investimento, modernização de processos e escala através de tecnologia sob medida.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
    });

    const text = response.text || "";
    const jsonMatch =
      text.match(/```json\s*([\s\S]*?)\s*```/) ||
      text.match(/```\s*([\s\S]*?)\s*```/) ||
      text.match(/\{[\s\S]*\}/);

    const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : text;
    const parsed = JSON.parse(jsonStr.trim());

    return NextResponse.json({
      subject:
        parsed.subject || `Parceria em Soluções de Software & Apps: ${company}`,
      bodyHtml: parsed.bodyHtml || "",
      bodyText: parsed.bodyText || "",
      isAiLive: true,
    });
  } catch (error) {
    const rawMsg = error instanceof Error ? error.message : "Erro desconhecido";
    console.error("[CRM_AI_PROPOSAL_ERROR]", error);

    let friendlyError = "Falha ao gerar proposta comercial com IA.";
    if (
      rawMsg.includes("402") ||
      rawMsg.includes("prepayment") ||
      rawMsg.includes("RESOURCE_EXHAUSTED")
    ) {
      friendlyError =
        "Créditos do Gemini esgotados no Google AI Studio (Erro 402). Verifique faturamento em https://ai.studio/projects.";
    }

    return NextResponse.json(
      { error: friendlyError, rawError: rawMsg },
      { status: 500 },
    );
  }
}
