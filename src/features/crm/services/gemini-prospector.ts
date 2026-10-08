import { GoogleGenAI } from "@google/genai";

export interface ProspectParams {
  niche: string;
  location: string;
  trigger: string;
  count?: number;
}

export interface DiscoveredLead {
  id: string;
  companyName: string;
  tradeName?: string;
  segment: string;
  cityState: string;
  website?: string;
  contactPhone?: string;
  contactEmail?: string;
  estimatedBudget: number;
  projectOpportunity: string;
  detectedPain: string;
  recommendedPitch: string;
  fitScore: number; // 0 a 100
  triggers: string[];
  sourceUrl?: string;
}

export interface ProspectResult {
  leads: DiscoveredLead[];
  isLiveAi: boolean;
  provider: string;
  model: string;
  searchSummary: string;
}

export interface ProspectResult {
  leads: DiscoveredLead[];
  isLiveAi: boolean;
  provider: string;
  model: string;
  searchSummary: string;
  error?: string;
}

/**
 * Searches for corporate B2B leads using Google Gemini with Search Grounding
 */
export async function discoverLeadsWithGemini(
  params: ProspectParams,
): Promise<ProspectResult> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    return {
      leads: [],
      isLiveAi: false,
      provider: "Google Gemini AI",
      model: "N/A",
      searchSummary:
        "Varredura cancelada: Chave de API GEMINI_API_KEY ausente no servidor.",
      error:
        "Chave GEMINI_API_KEY não configurada no servidor. Configure a variável no ambiente (.env.local ou Firebase App Hosting) para habilitar o Radar de Leads com inteligência artificial em tempo real. Nenhum dado simulado ou fictício é retornado.",
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const modelName = "gemini-3.8-flash"; // Current balanced model for high speed and grounding

    const prompt = `
Você é o Agente Especialista Autônomo de Inteligência Comercial e Prospecção B2B da "FZ Build Solutions".
A FZ Build Solutions é uma Casa de Software (Software House) de alta performance, especializada em:
- Desenvolvimento sob medida de softwares em nuvem e plataformas SaaS corporativas
- Aplicativos mobile de alta performance (iOS e Android)
- Sistemas web empresariais, dashboards gerenciais e portais de clientes/parceiros em nuvem
- Websites institucionais e páginas modernas de alta conversão
- Automação de processos operacionais, integrações de APIs e soluções de inteligência artificial aplicada

SUA MISSÃO:
Pesquise e identifique de 4 a 6 oportunidades reais e quentes de empresas brasileiras com alta probabilidade de contratação de soluções de software e tecnologia no seguinte contexto:
- Nicho / Setor: ${params.niche || "Empresas com processos manuais, expansão operacional ou necessidade de novos softwares e apps"}
- Região / Cidade: ${params.location || "São Paulo e principais capitais e polos do Brasil"}
- Gatilho Comercial: ${params.trigger || "Empresas em expansão, digitalização de processos operacionais, lançamento de novos serviços ou necessidade de aplicativo mobile e sistema em nuvem"}

INSTRUÇÕES OBRIGATÓRIAS:
1. Identifique empresas corporativas reais (varejo, e-commerce, logística, saúde, franquias, distribuidores, imobiliárias, serviços B2B, indústrias, startups) com potencial demanda por tecnologia e desenvolvimento de software.
2. Formate sua resposta EXCLUSIVAMENTE em um bloco de código JSON contendo um array com objetos no formato exato especificado abaixo. Não inclua texto explicativo fora do array JSON.

Estrutura de cada objeto no array JSON:
{
  "id": "string único ou gerado",
  "companyName": "Razão Social ou Nome Corporativo da Empresa",
  "tradeName": "Nome Fantasia ou Marca",
  "segment": "Segmento de Atuação da Empresa",
  "cityState": "Cidade - UF (ex: São Paulo - SP)",
  "website": "URL do website institucional",
  "contactPhone": "Telefone provável de contato corporativo",
  "contactEmail": "E-mail corporativo ou de contato geral",
  "estimatedBudget": 60000, // número inteiro em BRL estimado para o projeto de software/app (ex: 25000 a 150000)
  "projectOpportunity": "Descrição concisa do software, aplicativo mobile ou sistema em nuvem demandado",
  "detectedPain": "Principal gargalo operacional, processo manual ou limitação digital que a FZ Build Solutions resolve com software",
  "recommendedPitch": "Argumento de vendas consultivo focado em eficiência, escala e retorno sobre investimento (ROI) com software sob medida da FZ Build Solutions",
  "fitScore": 92, // nota de 75 a 99
  "triggers": ["Gatilho 1", "Gatilho 2"],
  "sourceUrl": "URL de referência ou matéria pública da empresa"
}
`;

    // Try generating content with search grounding
    let responseText = "";
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });
      responseText = response.text || "";
    } catch (searchErr) {
      // If error is quota or billing related, don't retry, rethrow immediately
      const errMsg =
        searchErr instanceof Error ? searchErr.message : String(searchErr);
      if (
        errMsg.includes("402") ||
        errMsg.includes("RESOURCE_EXHAUSTED") ||
        errMsg.includes("prepayment")
      ) {
        throw searchErr;
      }

      // Fallback to call without search tool if search tool is not supported in the region or context
      const basicResponse = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
      });
      responseText = basicResponse.text || "";
    }

    // Extract JSON from response
    const jsonMatch =
      responseText.match(/```json\s*([\s\S]*?)\s*```/) ||
      responseText.match(/```\s*([\s\S]*?)\s*```/) ||
      responseText.match(/\[\s*\{[\s\S]*\}\s*\]/);

    const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : responseText;
    const parsed = JSON.parse(jsonString.trim());

    if (Array.isArray(parsed) && parsed.length > 0) {
      const leads: DiscoveredLead[] = parsed.map((item, index) => ({
        id: item.id || `gemini-lead-${Date.now()}-${index}`,
        companyName: item.companyName || "Empresa Descoberta",
        tradeName: item.tradeName || item.companyName || "Empresa",
        segment: item.segment || params.niche,
        cityState: item.cityState || params.location,
        website: item.website || "",
        contactPhone: item.contactPhone || "",
        contactEmail: item.contactEmail || "",
        estimatedBudget: Number(item.estimatedBudget) || 60000,
        projectOpportunity:
          item.projectOpportunity ||
          "Desenvolvimento de software sob medida em nuvem ou app mobile",
        detectedPain:
          item.detectedPain ||
          "Necessidade de modernização digital, sistema em nuvem ou aplicativo próprio",
        recommendedPitch:
          item.recommendedPitch ||
          "Apresentação consultiva de desenvolvimento de software sob medida FZ Build Solutions",
        fitScore: Number(item.fitScore) || 85,
        triggers: Array.isArray(item.triggers)
          ? item.triggers
          : ["Identificado pelo Radar IA"],
        sourceUrl: item.sourceUrl || "",
      }));

      return {
        leads,
        isLiveAi: true,
        provider: "Google Gemini 3.8 Flash (Grounding)",
        model: modelName,
        searchSummary: `Varredura concluída com sucesso via Gemini Live Grounding para "${params.niche}" em "${params.location}".`,
      };
    }

    return {
      leads: [],
      isLiveAi: true,
      provider: "Google Gemini 3.8 Flash",
      model: modelName,
      searchSummary: `Nenhuma oportunidade correspondente encontrada para os critérios especificados.`,
    };
  } catch (error) {
    const rawMsg =
      error instanceof Error
        ? error.message
        : "Erro desconhecido ao consultar a API do Gemini.";
    console.error("[GeminiProspector] Erro na chamada com o Gemini:", error);

    let friendlyError = rawMsg;
    if (
      rawMsg.includes("402") ||
      rawMsg.includes("prepayment") ||
      rawMsg.includes("RESOURCE_EXHAUSTED")
    ) {
      friendlyError =
        "Os créditos da API do Gemini estão esgotados no Google AI Studio (Erro 402 / Prepayment). Para habilitar a busca de leads reais em tempo real, gerencie os créditos em https://ai.studio/projects ou configure uma nova GEMINI_API_KEY no .env.local. Nenhum dado simulado ou fake é gerado.";
    } else if (rawMsg.includes("404") || rawMsg.includes("NOT_FOUND")) {
      friendlyError =
        "Modelo de IA não encontrado ou indisponível. O sistema foi atualizado para gemini-3.8-flash. Verifique sua chave de API.";
    }

    return {
      leads: [],
      isLiveAi: false,
      provider: "Google Gemini AI",
      model: "gemini-3.8-flash",
      searchSummary: `Varredura não retornou dados reais: ${friendlyError}`,
      error: friendlyError,
    };
  }
}
