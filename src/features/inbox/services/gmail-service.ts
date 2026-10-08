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

export const SCOPES = [
  "https://www.googleapis.com/auth/gmail.modify",
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/spreadsheets.readonly",
  "https://www.googleapis.com/auth/drive.readonly",
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

export const SETTINGS_DOC_ID = "integrations_gmail";

export function getOAuthClient(customRedirectUri?: string) {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    return null;
  }
  const redirectUri = customRedirectUri || GOOGLE_REDIRECT_URI;

  return new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    redirectUri,
  );
}

export function generateGoogleAuthUrl(
  returnUrl?: string,
  customRedirectUri?: string,
): string {
  const oauth2Client = getOAuthClient(customRedirectUri);
  if (!oauth2Client) {
    throw new Error(
      "Credenciais GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET não configuradas no .env.local.",
    );
  }

  // Preserve both the return destination and the exact callback URI in state
  const statePayload = JSON.stringify({
    returnUrl: returnUrl || "/os/inbox",
    redirectUri: customRedirectUri,
  });
  const encodedState = Buffer.from(statePayload, "utf-8").toString("base64url");

  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
    state: encodedState,
  });
}

export async function saveGoogleOAuthTokens(
  code: string,
  customRedirectUri?: string,
): Promise<string> {
  const oauth2Client = getOAuthClient(customRedirectUri);
  if (!oauth2Client) {
    throw new Error("Cliente OAuth2 não configurado.");
  }

  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  // Retrieve user email
  const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
  const userInfo = await oauth2.userinfo.get();
  const email = userInfo.data.email || "fzbuild.solutions@gmail.com";

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
    email: undefined,
    isDemoMode: false,
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
    return { messages: [], isDemoMode: false };
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
    return { messages: [], isDemoMode: false };
  }
}

export async function getMessageDetail(
  id: string,
): Promise<GmailMessageDetail | null> {
  const gmail = await getAuthenticatedGmailClient();

  if (!gmail) {
    return null;
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
    return null;
  }
}

export async function trashMessage(id: string): Promise<{ success: boolean }> {
  const gmail = await getAuthenticatedGmailClient();

  if (!gmail) {
    throw new Error("Gmail não está conectado.");
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
    throw new Error(
      "Gmail não está conectado. Conecte sua conta do Google Workspace para disparar e-mails reais.",
    );
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
