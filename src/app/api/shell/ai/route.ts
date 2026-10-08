import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { db } from "@/lib/firebase";
import { collection, getDocs, limit, query, orderBy } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const message = body.message;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Mensagem obrigatória" },
        { status: 400 },
      );
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        text: "Chave de inteligência artificial (GEMINI_API_KEY) não configurada no servidor (.env.local ou Firebase App Hosting). Para conversar com a IA em tempo real e consultar métricas dinâmicas, configure a chave de API nas variáveis de ambiente.",
        isLive: false,
      });
    }

    // Fetch real metrics from Firestore
    let projectsSummary = "Nenhum projeto registrado no momento.";
    let leadsSummary = "Nenhum lead registrado no funil comercial no momento.";
    let financeSummary = "Sem movimentações financeiras recentes registradas.";

    try {
      // Projects
      const projectsSnap = await getDocs(
        query(collection(db, "projects"), limit(10)),
      );
      if (!projectsSnap.empty) {
        const pList = projectsSnap.docs.map((d) => {
          const data = d.data();
          return `${data.name || "Sem nome"} (Status: ${data.status || "Ativo"}, Progresso: ${data.progress || 0}%)`;
        });
        projectsSummary = `${projectsSnap.size} projetos: ${pList.join("; ")}`;
      }

      // Leads
      const leadsSnap = await getDocs(
        query(collection(db, "leads"), limit(10)),
      );
      if (!leadsSnap.empty) {
        const lList = leadsSnap.docs.map((d) => {
          const data = d.data();
          return `${data.clientName || data.name || "Empresa"} (Etapa: ${data.stage || "Novo"}, Valor: R$ ${data.value || 0})`;
        });
        leadsSummary = `${leadsSnap.size} leads: ${lList.join("; ")}`;
      }

      // Transactions
      const transSnap = await getDocs(
        query(
          collection(db, "transactions"),
          orderBy("createdAt", "desc"),
          limit(15),
        ),
      );
      if (!transSnap.empty) {
        let totalIn = 0;
        let totalOut = 0;
        transSnap.docs.forEach((d) => {
          const data = d.data();
          const amt = Number(data.amount) || 0;
          if (data.type === "in") totalIn += amt;
          else totalOut += amt;
        });
        financeSummary = `Últimas ${transSnap.size} transações: Entradas R$ ${totalIn.toFixed(2)}, Saídas R$ ${totalOut.toFixed(2)}, Saldo das transações R$ ${(totalIn - totalOut).toFixed(2)}.`;
      }
    } catch (dbErr) {
      console.warn("[ShellAI] Aviso ao consultar métricas do banco:", dbErr);
    }

    const ai = new GoogleGenAI({ apiKey });
    const systemInstruction = `
Você é a FZ AI, assistente operacional oficial do sistema operacional FZ Build (FZ OS).
A FZ Build Solutions é uma casa de software (software house) especializada em desenvolvimento sob medida de softwares em nuvem, aplicativos mobile (iOS e Android), sistemas web corporativos, sites modernos e automações inteligentes.

DADOS REAIS E ATUAIS CONSULTADOS NO BANCO DO SISTEMA:
- Projetos: ${projectsSummary}
- CRM & Leads: ${leadsSummary}
- Financeiro Operacional: ${financeSummary}

DIRETRIZES FUNDAMENTAIS:
1. NUNCA utilize dados fictícios ou simulações. Responda exclusivamente com base no contexto real do FZ Build apresentado acima.
2. Se o usuário perguntar sobre itens não cadastrados ou inexistentes, informe com honestidade e transparência que o banco não possui registros para essa consulta.
3. Seja concisa, executiva, técnica e educada. Idioma: Português do Brasil.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: message,
      config: {
        systemInstruction,
      },
    });

    const replyText =
      response.text || "Não foi possível gerar uma resposta no momento.";

    return NextResponse.json({
      text: replyText,
      isLive: true,
    });
  } catch (error) {
    console.error("[ShellAI_Error]", error);
    const rawMsg = error instanceof Error ? error.message : "Erro desconhecido";
    let friendly = `Não foi possível processar a resposta no momento (${rawMsg}).`;
    if (
      rawMsg.includes("402") ||
      rawMsg.includes("prepayment") ||
      rawMsg.includes("RESOURCE_EXHAUSTED")
    ) {
      friendly =
        "Os créditos da API do Gemini estão esgotados no Google AI Studio (Erro 402). Verifique seu faturamento em https://ai.studio/projects ou configure uma nova GEMINI_API_KEY no .env.local.";
    }
    return NextResponse.json(
      {
        text: friendly,
        isLive: false,
      },
      { status: 500 },
    );
  }
}
