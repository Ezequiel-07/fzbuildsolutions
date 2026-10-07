import { GoogleGenAI } from "@google/genai";

export class AIService {
  // Centralized AI Layer connecting with Google Gemini API
  private static getClient() {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({ apiKey });
  }

  static async processWorkflowAction(actionId: string, promptText?: string) {
    const ai = this.getClient();
    if (!ai) {
      throw new Error("Chave GEMINI_API_KEY não configurada no servidor.");
    }
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: promptText || `Execute a ação do workflow: ${actionId}`,
    });
    return { status: "success", generatedText: response.text || "" };
  }

  static async generateInsights(contextData?: string) {
    const ai = this.getClient();
    if (!ai) {
      return { insights: [] };
    }
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Gere 3 insights operacionais concisos e objetivos para o sistema FZ Build com base nos dados reais a seguir: ${contextData || "Operações regulares em andamento."}`,
    });
    const text = response.text || "";
    const lines = text.split("\n").filter((l) => l.trim().length > 0);
    return { insights: lines.slice(0, 3) };
  }
}
