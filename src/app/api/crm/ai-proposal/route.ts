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
Você é o Diretor Comercial e Especialista em Redação de E-mails B2B da "FZ Build Solutions", empresa de referência em engenharia civil, reformas corporativas, facilities e obras de alta precisão no Brasil.

Gere uma proposta de abordagem comercial por e-mail altamente profissional, consultiva e elegante para:
- Empresa: ${company} (Razão Social: ${companyName})
- E-mail do Contato: ${contactEmail || "decisor"}
- Segmento: ${segment || "Construção / Facilities"}
- Localidade: ${cityState || "Brasil"}
- Dor Identificada: ${detectedPain || "Garantia de cronograma e qualidade técnica"}
- Oportunidade Mapeada: ${projectOpportunity || "Reforma e modernização predial"}
- Orçamento Estimado: R$ ${estimatedBudget || "Sob consulta"}
- Pitch de Vendas Recomendado: ${recommendedPitch || "Apresentação institucional"}

REQUISITOS:
1. Retorne EXCLUSIVAMENTE um objeto JSON no seguinte formato:
{
  "subject": "Assunto magnético, profissional e direto",
  "bodyHtml": "Corpo do e-mail em HTML limpo, usando <p>, <ul>, <li>, <strong>, elegante e pronto para envio",
  "bodyText": "Versão em texto puro"
}
2. Assinatura formal da FZ Build Solutions com "Ezequiel Ferreira · FZ Build Solutions".
3. Tom consultivo, objetivo e persuasivo (sem parecer spam genérico).
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
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
      subject: parsed.subject,
      bodyHtml: parsed.bodyHtml,
      bodyText: parsed.bodyText,
      isAiLive: true,
    });
  } catch (error) {
    console.error("[CRM_AI_PROPOSAL_ERROR]", error);
    return NextResponse.json(
      { error: "Erro ao gerar proposta com IA." },
      { status: 500 },
    );
  }
}
