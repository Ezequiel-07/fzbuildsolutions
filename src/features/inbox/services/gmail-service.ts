import { google } from "googleapis";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const GOOGLE_REDIRECT_URI =
  process.env.GOOGLE_REDIRECT_URI ||
  "http://localhost:3000/api/auth/google/callback";

const SCOPES = [
  "https://www.googleapis.com/auth/gmail.modify",
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/userinfo.email",
];

export interface GmailMessageSummary {
  id: string;
  threadId: string;
  snippet: string;
  sender: string;
  fromEmail: string;
  toEmail: string;
  subject: string;
  date: string;
  isUnread: boolean;
  labels: string[];
}

export interface GmailMessageDetail extends GmailMessageSummary {
  bodyHtml: string;
  bodyText: string;
}

export interface GmailStatusResult {
  connected: boolean;
  email?: string;
  connectedAt?: string;
  isDemoMode: boolean;
}

const SETTINGS_DOC_ID = "integrations_gmail";

// High-fidelity fallback inbox for demonstration / dev mode
const DEMO_INBOX_MESSAGES: GmailMessageDetail[] = [
  {
    id: "demo-msg-1",
    threadId: "demo-thread-1",
    sender: "Eduardo Fonseca · Diretor de Obras",
    fromEmail: "compras@multilog.com.br",
    toEmail: "comercial@fzbuild.com.br",
    subject:
      "Solicitação de Proposta: Retrofit de Galpão Logístico em Campinas (4.500m²)",
    snippet:
      "Olá equipe FZ Build, recebemos a apresentação de vocês e gostaríamos de agendar uma vistoria técnica no nosso centro de distribuição...",
    date: new Date(Date.now() - 1000 * 60 * 42).toISOString(), // 42 min ago
    isUnread: true,
    labels: ["INBOX", "UNREAD", "IMPORTANTE"],
    bodyHtml: `
      <div style="font-family: sans-serif; line-height: 1.6; color: #1e293b;">
        <p>Prezada equipe da <strong>FZ Build Solutions</strong>,</p>
        <p>Avaliamos o portfólio de vocês enviado sobre obras industriais e sistemas prediais. Temos uma demanda imediata para <strong>readequação e reforço de piso de alta capacidade</strong> no nosso centro de distribuição em Campinas (área aproximada de 4.500m²), além da modernização do sistema de combate a incêndio (AVCB).</p>
        <p>Gostaríamos de saber a disponibilidade para uma visita técnica nesta quinta ou sexta-feira para alinhamento dos projetos executivos.</p>
        <br/>
        <p>Atenciosamente,</p>
        <p><strong>Eduardo Fonseca</strong><br/>Diretor de Engenharia & Operações · MultiLog Brasil<br/>Tel: (19) 3998-1200</p>
      </div>
    `,
    bodyText:
      "Prezada equipe FZ Build, temos interesse em agendar vistoria para o galpão em Campinas...",
  },
  {
    id: "demo-msg-2",
    threadId: "demo-thread-2",
    sender: "Dra. Camila Vasconcelos",
    fromEmail: "infra@hospitalunivida.com.br",
    toEmail: "comercial@fzbuild.com.br",
    subject: "Reunião de Alinhamento: Adequação de Ala Cirúrgica (RDC 50)",
    snippet:
      "Boa tarde! Analisamos a prévia orçamentária para a climatização com pressão positiva da ala médica. Precisamos ajustar o cronograma...",
    date: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4h ago
    isUnread: false,
    labels: ["INBOX"],
    bodyHtml: `
      <div style="font-family: sans-serif; line-height: 1.6; color: #1e293b;">
        <p>Boa tarde, time FZ Build,</p>
        <p>A diretoria clínica do Hospital UniVida aprovou a proposta conceitual para as reformas das salas cirúrgicas com conformidade RDC 50 da Anvisa.</p>
        <p>Podem nos enviar o memorial descritivo atualizado com a especificação dos filtros HEPA e os prazos de liberação dos leitos?</p>
        <br/>
        <p>Cordialmente,</p>
        <p><strong>Camila Vasconcelos</strong><br/>Coordenação de Facilities Hospitalares<br/>Hospital UniVida</p>
      </div>
    `,
    bodyText:
      "Boa tarde, diretoria aprovou a proposta para reformas de salas cirúrgicas...",
  },
  {
    id: "demo-msg-3",
    threadId: "demo-thread-3",
    sender: "Rodrigo Almeida · Vértice Residencial",
    fromEmail: "suprimentos@verticeincorp.com.br",
    toEmail: "comercial@fzbuild.com.br",
    subject: "Abertura de Cotação: Empreitada de Acabamentos Torre Horizonte",
    snippet:
      "Segue em anexo o caderno de encargos da fase de alvenaria e acabamentos da Torre Horizonte para elaboração de proposta...",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    isUnread: false,
    labels: ["INBOX"],
    bodyHtml: `
      <div style="font-family: sans-serif; line-height: 1.6; color: #1e293b;">
        <p>Olá Ezequiel e equipe,</p>
        <p>Estamos abrindo o pacote de contratação para a fase de acabamentos finos da Torre Horizonte na zona sul de São Paulo.</p>
        <p>O prazo para envio da proposta comercial com a planilha BDI é até o próximo dia 15.</p>
        <br/>
        <p>Abraços,</p>
        <p><strong>Rodrigo Almeida</strong><br/>Gerente de Suprimentos · Vértice Incorporadora</p>
      </div>
    `,
    bodyText:
      "Estamos abrindo pacote de acabamentos finos para a Torre Horizonte...",
  },
];

let inMemoryDemoMessages = [...DEMO_INBOX_MESSAGES];

export function getOAuthClient() {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    return null;
  }
  return new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI,
  );
}

export function generateGoogleAuthUrl(): string {
  const oauth2Client = getOAuthClient();
  if (!oauth2Client) {
    throw new Error(
      "Credenciais GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET não configuradas no .env.local.",
    );
  }

  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
  });
}

export async function saveGoogleOAuthTokens(code: string): Promise<string> {
  const oauth2Client = getOAuthClient();
  if (!oauth2Client) {
    throw new Error("Cliente OAuth2 não configurado.");
  }

  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  // Retrieve user email
  const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
  const userInfo = await oauth2.userinfo.get();
  const email = userInfo.data.email || "gmail-conectado@fzbuild.com.br";

  const docRef = doc(db, "settings", SETTINGS_DOC_ID);
  await setDoc(
    docRef,
    {
      email,
      refreshToken: tokens.refresh_token,
      accessToken: tokens.access_token,
      expiryDate: tokens.expiry_date,
      scope: SCOPES,
      connectedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isActive: true,
    },
    { merge: true },
  );

  return email;
}

export async function getGmailStatus(): Promise<GmailStatusResult> {
  try {
    const docRef = doc(db, "settings", SETTINGS_DOC_ID);
    const snap = await getDoc(docRef);

    if (snap.exists() && snap.data().isActive && snap.data().refreshToken) {
      const data = snap.data();
      return {
        connected: true,
        email: data.email,
        connectedAt: data.connectedAt?.seconds
          ? new Date(data.connectedAt.seconds * 1000).toISOString()
          : undefined,
        isDemoMode: false,
      };
    }
  } catch (err) {
    console.warn("[GmailService] Erro ao consultar Firestore:", err);
  }

  return {
    connected: false,
    email: "modo.demonstracao@fzbuild.com.br",
    isDemoMode: true,
  };
}

async function getAuthenticatedGmailClient() {
  const oauth2Client = getOAuthClient();
  if (!oauth2Client) return null;

  try {
    const docRef = doc(db, "settings", SETTINGS_DOC_ID);
    const snap = await getDoc(docRef);

    if (!snap.exists() || !snap.data().refreshToken) {
      return null;
    }

    const data = snap.data();
    oauth2Client.setCredentials({
      refresh_token: data.refreshToken,
      access_token: data.accessToken,
    });

    return google.gmail({ version: "v1", auth: oauth2Client });
  } catch (err) {
    console.error("[GmailService] Falha ao autenticar cliente Gmail:", err);
    return null;
  }
}

export async function listInboxMessages(params: {
  maxResults?: number;
  query?: string;
  pageToken?: string;
}): Promise<{ messages: GmailMessageSummary[]; isDemoMode: boolean }> {
  const gmail = await getAuthenticatedGmailClient();

  if (!gmail) {
    // Return filtered demo messages
    let list = inMemoryDemoMessages;
    if (params.query) {
      const q = params.query.toLowerCase();
      list = list.filter(
        (m) =>
          m.subject.toLowerCase().includes(q) ||
          m.sender.toLowerCase().includes(q) ||
          m.snippet.toLowerCase().includes(q),
      );
    }
    return { messages: list, isDemoMode: true };
  }

  try {
    const res = await gmail.users.messages.list({
      userId: "me",
      maxResults: params.maxResults || 20,
      q: params.query || "label:INBOX",
      pageToken: params.pageToken,
    });

    const msgList = res.data.messages || [];
    const detailedMessages: GmailMessageSummary[] = [];

    for (const m of msgList.slice(0, params.maxResults || 15)) {
      if (!m.id) continue;
      const detail = await gmail.users.messages.get({
        userId: "me",
        id: m.id,
        format: "metadata",
        metadataHeaders: ["From", "To", "Subject", "Date"],
      });

      const headers = detail.data.payload?.headers || [];
      const getHeader = (name: string) =>
        headers.find((h) => h.name?.toLowerCase() === name.toLowerCase())
          ?.value || "";

      detailedMessages.push({
        id: m.id,
        threadId: m.threadId || m.id,
        snippet: detail.data.snippet || "",
        sender: getHeader("From"),
        fromEmail: extractEmail(getHeader("From")),
        toEmail: getHeader("To"),
        subject: getHeader("Subject") || "(Sem Assunto)",
        date: getHeader("Date") || new Date().toISOString(),
        isUnread: detail.data.labelIds?.includes("UNREAD") ?? false,
        labels: detail.data.labelIds || [],
      });
    }

    return { messages: detailedMessages, isDemoMode: false };
  } catch (error) {
    console.error("[GmailService] Erro ao listar mensagens:", error);
    return { messages: inMemoryDemoMessages, isDemoMode: true };
  }
}

export async function getMessageDetail(
  id: string,
): Promise<GmailMessageDetail | null> {
  const gmail = await getAuthenticatedGmailClient();

  if (!gmail) {
    const demo = inMemoryDemoMessages.find((m) => m.id === id);
    return demo || inMemoryDemoMessages[0] || null;
  }

  try {
    const detail = await gmail.users.messages.get({
      userId: "me",
      id,
      format: "full",
    });

    const headers = detail.data.payload?.headers || [];
    const getHeader = (name: string) =>
      headers.find((h) => h.name?.toLowerCase() === name.toLowerCase())
        ?.value || "";

    const { bodyHtml, bodyText } = extractMessageBodies(detail.data.payload);

    return {
      id,
      threadId: detail.data.threadId || id,
      snippet: detail.data.snippet || "",
      sender: getHeader("From"),
      fromEmail: extractEmail(getHeader("From")),
      toEmail: getHeader("To"),
      subject: getHeader("Subject") || "(Sem Assunto)",
      date: getHeader("Date") || new Date().toISOString(),
      isUnread: detail.data.labelIds?.includes("UNREAD") ?? false,
      labels: detail.data.labelIds || [],
      bodyHtml: bodyHtml || `<p>${bodyText}</p>`,
      bodyText,
    };
  } catch (error) {
    console.error(
      "[GmailService] Erro ao carregar detalhe da mensagem:",
      error,
    );
    const fallback = inMemoryDemoMessages.find((m) => m.id === id);
    return fallback || null;
  }
}

export async function trashMessage(id: string): Promise<{ success: boolean }> {
  const gmail = await getAuthenticatedGmailClient();

  if (!gmail) {
    inMemoryDemoMessages = inMemoryDemoMessages.filter((m) => m.id !== id);
    return { success: true };
  }

  try {
    await gmail.users.messages.trash({
      userId: "me",
      id,
    });
    return { success: true };
  } catch (error) {
    console.error("[GmailService] Erro ao mover para a lixeira:", error);
    throw error;
  }
}

export async function sendGmailMessage(params: {
  to: string;
  subject: string;
  bodyHtml: string;
  inReplyTo?: string;
}): Promise<{ id: string; success: boolean; isDemo: boolean }> {
  const gmail = await getAuthenticatedGmailClient();

  if (!gmail) {
    // In demo mode, register into in-memory store so it feels completely alive
    const newDemoMsg: GmailMessageDetail = {
      id: `sent-${Date.now()}`,
      threadId: `thread-${Date.now()}`,
      sender: "Você (FZ Build Solutions)",
      fromEmail: "comercial@fzbuild.com.br",
      toEmail: params.to,
      subject: params.subject,
      snippet: params.bodyHtml.replace(/<[^>]*>?/gm, "").slice(0, 120),
      date: new Date().toISOString(),
      isUnread: false,
      labels: ["SENT"],
      bodyHtml: params.bodyHtml,
      bodyText: params.bodyHtml.replace(/<[^>]*>?/gm, ""),
    };
    inMemoryDemoMessages.unshift(newDemoMsg);

    return { id: newDemoMsg.id, success: true, isDemo: true };
  }

  try {
    const utf8Subject = `=?utf-8?B?${Buffer.from(params.subject).toString("base64")}?=`;
    const messageParts = [
      `To: ${params.to}`,
      "Content-Type: text/html; charset=utf-8",
      "MIME-Version: 1.0",
      `Subject: ${utf8Subject}`,
      "",
      params.bodyHtml,
    ];

    if (params.inReplyTo) {
      messageParts.splice(3, 0, `In-Reply-To: ${params.inReplyTo}`);
      messageParts.splice(4, 0, `References: ${params.inReplyTo}`);
    }

    const message = messageParts.join("\r\n");
    const encodedMessage = Buffer.from(message)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const res = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedMessage,
      },
    });

    return {
      id: res.data.id || `sent-${Date.now()}`,
      success: true,
      isDemo: false,
    };
  } catch (error) {
    console.error("[GmailService] Erro ao enviar mensagem:", error);
    throw error;
  }
}

export async function disconnectGmail(): Promise<void> {
  try {
    const docRef = doc(db, "settings", SETTINGS_DOC_ID);
    await deleteDoc(docRef);
  } catch (err) {
    console.error("[GmailService] Erro ao desconectar:", err);
  }
}

// Helpers
function extractEmail(headerVal: string): string {
  const match = headerVal.match(/<([^>]+)>/);
  return match ? match[1] : headerVal.trim();
}

interface MessagePartPayload {
  mimeType?: string | null;
  body?: { data?: string | null } | null;
  parts?: MessagePartPayload[] | null;
}

function extractMessageBodies(payload: unknown): {
  bodyHtml: string;
  bodyText: string;
} {
  let bodyHtml = "";
  let bodyText = "";

  const extractRecursive = (part: MessagePartPayload | undefined | null) => {
    if (!part) return;
    if (part.mimeType === "text/html" && part.body?.data) {
      bodyHtml = Buffer.from(part.body.data, "base64").toString("utf-8");
    } else if (part.mimeType === "text/plain" && part.body?.data) {
      bodyText = Buffer.from(part.body.data, "base64").toString("utf-8");
    }

    if (part.parts && Array.isArray(part.parts)) {
      for (const subPart of part.parts) {
        extractRecursive(subPart);
      }
    }
  };

  extractRecursive(payload as MessagePartPayload);
  return { bodyHtml, bodyText };
}
