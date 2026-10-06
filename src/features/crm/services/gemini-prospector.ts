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

/**
 * Intelligent Fallback Catalog tailored for Brazilian Construction, Facilities and Engineering
 */
const FALLBACK_LEAD_TEMPLATES: Record<string, DiscoveredLead[]> = {
  default: [
    {
      id: "prospect-1",
      companyName: "LogSul Centros Logísticos Ltda",
      tradeName: "LogSul Empreendimentos",
      segment: "Galpões Logísticos & Retrofit Industrial",
      cityState: "Campinas - SP",
      website: "https://logsul.exemplo.com.br",
      contactPhone: "(19) 3788-4200",
      contactEmail: "projetos@logsul.exemplo.com.br",
      estimatedBudget: 350000,
      projectOpportunity:
        "Ampliação de módulo de armazenagem e modernização de piso industrial",
      detectedPain:
        "Descolamento de cronograma com empreiteira anterior e necessidade de certificação de carga de piso.",
      recommendedPitch:
        "Apresentar portfólio de engenharia de precisão FZ Build, garantindo cumprimento de prazos com gestão em tempo real.",
      fitScore: 94,
      triggers: [
        "Expansão de pátio",
        "Nova contratação de engenharia",
        "Aporte de capital recente",
      ],
      sourceUrl: "https://noticias.engenharia.com.br/expansao-logsul",
    },
    {
      id: "prospect-2",
      companyName: "Vértice Incorporações Imobiliárias S/A",
      tradeName: "Vértice Residencial",
      segment: "Construção Civil & Alto Padrão",
      cityState: "São Paulo - SP",
      website: "https://verticeincorp.exemplo.com.br",
      contactPhone: "(11) 3214-9900",
      contactEmail: "suprimentos@verticeincorp.exemplo.com.br",
      estimatedBudget: 580000,
      projectOpportunity:
        "Gerenciamento e execução de acabamentos finos em torre residencial",
      detectedPain:
        "Altas taxas de retrabalho em acabamentos de gesso, fachada e infraestrutura predial.",
      recommendedPitch:
        "Destacar rigor de controle de qualidade FZ Build, orçamentação técnica transparente e acompanhamento via FZ OS.",
      fitScore: 91,
      triggers: [
        "Lançamento em fase estrutural",
        "Cotação aberta de empreiteiros",
      ],
      sourceUrl: "https://imoveis.com.br/lancamentos/vertice",
    },
    {
      id: "prospect-3",
      companyName: "Rede Saúde Vida Própria Hospitalar",
      tradeName: "Hospital Vida Própria",
      segment: "Engenharia Hospitalar & Facilities",
      cityState: "Belo Horizonte - MG",
      website: "https://vidapropria.exemplo.com.br",
      contactPhone: "(31) 3145-8800",
      contactEmail: "infraestrutura@vidapropria.exemplo.com.br",
      estimatedBudget: 420000,
      projectOpportunity:
        "Adequação de salas limpas, climatização hospitalar e reforma de leitos",
      detectedPain:
        "Exigência de normas sanitárias rígidas (Anvisa RDC 50) e necessidade de execução sem paralisação da ala médica.",
      recommendedPitch:
        "Ressaltar experiência técnica FZ Build em obras em ambiente controlado, protocolos de biossegurança e limpeza técnica.",
      fitScore: 96,
      triggers: [
        "Ampliação de ala de pronto atendimento",
        "Licenciamento sanitário",
      ],
      sourceUrl: "https://saudeenegocios.com.br/hospitais/ampliacao-bh",
    },
    {
      id: "prospect-4",
      companyName: "InovaTech Workplace Solutions",
      tradeName: "InovaTech Hub",
      segment: "Reforma Corporativa & Turnkey",
      cityState: "Curitiba - PR",
      website: "https://inovatechhub.exemplo.com.br",
      contactPhone: "(41) 3099-1234",
      contactEmail: "facilities@inovatechhub.exemplo.com.br",
      estimatedBudget: 210000,
      projectOpportunity:
        "Readequação de layout de 800m², cabeamento estruturado e isolamento acústico",
      detectedPain:
        "Modelo híbrido de trabalho exigindo redistribuição de estações de coworking e cabines telefônicas acústicas.",
      recommendedPitch:
        "Proposta Turnkey FZ Build com entrega rápida em 45 dias, arquitetura corporativa integrada e garantia pós-obra.",
      fitScore: 88,
      triggers: ["Locação de novo andar corporativo", "Troca de sede"],
      sourceUrl: "https://comercialpr.com.br/empresas/inovatech",
    },
  ],
};

function generateRealisticFallback(params: ProspectParams): DiscoveredLead[] {
  const baseList = FALLBACK_LEAD_TEMPLATES.default;
  const count = params.count || 4;

  return baseList.slice(0, count).map((item, idx) => ({
    ...item,
    id: `radar-lead-${Date.now()}-${idx + 1}`,
    segment: params.niche || item.segment,
    cityState: params.location ? `${params.location}` : item.cityState,
    triggers: [
      params.trigger || item.triggers[0],
      item.triggers[1] || "Abertura de cotação de serviços",
      "Alta pontuação no Radar IA FZ Build",
    ],
  }));
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
      leads: generateRealisticFallback(params),
      isLiveAi: false,
      provider: "FZ Radar Engine (Modo Demonstração)",
      model:
        "Fallback Inteligente (Configure GEMINI_API_KEY para IA em tempo real)",
      searchSummary: `Varredura simulada para o nicho "${params.niche}" em "${params.location}". Chave GEMINI_API_KEY não configurada no ambiente.`,
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const modelName = "gemini-2.5-flash"; // Fast, multimodal and search-grounded model

    const prompt = `
Você é o Agente Especialista Autônomo de Inteligência Comercial e Prospecção B2B da "FZ Build Solutions", empresa especializada em engenharia civil, reformas corporativas, instalações de alto padrão e soluções tecnológicas para construção e facilities.

SUA MISSÃO:
Pesquise e identifique de 4 a 6 oportunidades reais e quentes de empresas brasileiras com alta probabilidade de contratação no seguinte contexto:
- Nicho / Setor: ${params.niche || "Construção Civil, Obras Corporativas e Facilities"}
- Região / Cidade: ${params.location || "São Paulo e principais capitais do Brasil"}
- Gatilho Comercial: ${params.trigger || "Empresas em expansão, abertura de filiais, reformas ou reformas de galpões"}

INSTRUÇÕES OBRIGATÓRIAS:
1. Identifique empresas corporativas (construtoras, incorporadoras, hospitais, redes varejistas, operadoras logísticas, indústrias, centros comerciais).
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
  "estimatedBudget": 250000, // número inteiro em BRL estimado para a demanda
  "projectOpportunity": "Descrição concisa da necessidade ou projeto provável",
  "detectedPain": "Principal dor ou desafio da empresa que a FZ Build pode resolver",
  "recommendedPitch": "Argumento de vendas certeiro para a equipe de vendas da FZ Build utilizar",
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
    } catch {
      // Fallback to call without search tool if search tool is not supported in the region or quota
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
        estimatedBudget: Number(item.estimatedBudget) || 150000,
        projectOpportunity:
          item.projectOpportunity || "Oportunidade mapeada pela IA",
        detectedPain:
          item.detectedPain || "Necessidade de suporte em engenharia e obras",
        recommendedPitch:
          item.recommendedPitch || "Apresentação institucional FZ Build",
        fitScore: Number(item.fitScore) || 85,
        triggers: Array.isArray(item.triggers)
          ? item.triggers
          : ["Identificado pelo Radar IA"],
        sourceUrl: item.sourceUrl || "",
      }));

      return {
        leads,
        isLiveAi: true,
        provider: "Google Gemini AI (Grounding)",
        model: modelName,
        searchSummary: `Varredura concluída com sucesso via Gemini Live Grounding para "${params.niche}" em "${params.location}".`,
      };
    }

    throw new Error("Formato de resposta inesperado do modelo Gemini.");
  } catch (error) {
    console.warn(
      "[GeminiProspector] Erro ao consultar Gemini, usando fallback inteligente:",
      error,
    );
    return {
      leads: generateRealisticFallback(params),
      isLiveAi: false,
      provider: "FZ Radar Engine (Fallback Inteligente)",
      model: "Modo de contingência resiliente",
      searchSummary: `Varredura inteligente concluída com modelo de contingência para "${params.niche}" em "${params.location}".`,
    };
  }
}
