import { describe, it, expect } from "vitest";
import {
  getPublicBaseOrigin,
  extractMessageBodies,
  decodeBase64Safe,
  extractEmail,
} from "./gmail-service";

describe("Gmail Service & OAuth URL Sanitation", () => {
  it("uses x-forwarded-host for public domains", () => {
    const req = new Request("http://0.0.0.0:8080/api/auth/google/callback", {
      headers: {
        "x-forwarded-host": "fzbuild.solutions",
      },
    });

    const origin = getPublicBaseOrigin(req);
    expect(origin).toBe("https://fzbuild.solutions");
  });

  it("discards internal container binding 0.0.0.0:8080 and falls back to production domain", () => {
    const req = new Request("http://0.0.0.0:8080/api/auth/google/callback", {
      headers: {
        host: "0.0.0.0:8080",
      },
    });

    const origin = getPublicBaseOrigin(req);
    expect(origin).toBe("https://fzbuild.solutions");
    expect(origin).not.toContain("0.0.0.0");
    expect(origin).not.toContain("8080");
  });

  it("preserves localhost during local development", () => {
    const req = new Request("http://localhost:3000/api/auth/google/callback", {
      headers: {
        host: "localhost:3000",
      },
    });

    const origin = getPublicBaseOrigin(req);
    expect(origin).toBe("http://localhost:3000");
  });

  it("handles 127.0.0.1 with correct protocol", () => {
    const req = new Request("http://127.0.0.1:3000/api/auth/google/callback", {
      headers: {
        host: "127.0.0.1:3000",
        "x-forwarded-proto": "http",
      },
    });

    const origin = getPublicBaseOrigin(req);
    expect(origin).toBe("http://127.0.0.1:3000");
  });
});

describe("Gmail Message Body Extraction & Sent Emails Decoding", () => {
  it("decodes URL-safe base64 containing dashes and underscores", () => {
    // String with URL-safe base64: "Hello? World!" -> in base64: SGVsbG8/IFdvcmxkIQ== -> base64url: SGVsbG8_IFdvcmxkIQ
    const sampleText = "Hello? World!";
    const base64url = Buffer.from(sampleText).toString("base64url");
    const decoded = decodeBase64Safe(base64url);
    expect(decoded).toBe(sampleText);
  });

  it("extracts HTML body when MIME type includes charset (text/html; charset=UTF-8)", () => {
    const htmlContent =
      "<h2>Proposta Comercial FZ Build</h2><p>Prezados, segue anexo.</p>";
    const encoded = Buffer.from(htmlContent).toString("base64url");

    const payload = {
      mimeType: "text/html; charset=UTF-8",
      body: {
        data: encoded,
      },
    };

    const result = extractMessageBodies(payload);
    expect(result.bodyHtml).toBe(htmlContent);
  });

  it("extracts and formats plain text message when sent without HTML", () => {
    const plainText =
      "Olá cliente,\n\nSegue a confirmação do orçamento.\nAtenciosamente,\nEquipe FZ";
    const encoded = Buffer.from(plainText).toString("base64url");

    const payload = {
      mimeType: "text/plain; charset=utf-8",
      body: {
        data: encoded,
      },
    };

    const result = extractMessageBodies(payload);
    expect(result.bodyText).toBe(plainText);
    expect(result.bodyHtml).toContain("Olá cliente,");
    expect(result.bodyHtml).toContain("white-space: pre-wrap");
  });

  it("recursively traverses multipart/alternative sent message parts", () => {
    const plainText = "Versão texto puro";
    const htmlText = "<div><p>Versão HTML rica</p></div>";

    const payload = {
      mimeType: "multipart/alternative",
      parts: [
        {
          mimeType: "text/plain; charset=UTF-8",
          body: {
            data: Buffer.from(plainText).toString("base64url"),
          },
        },
        {
          mimeType: "text/html; charset=UTF-8",
          body: {
            data: Buffer.from(htmlText).toString("base64url"),
          },
        },
      ],
    };

    const result = extractMessageBodies(payload);
    expect(result.bodyHtml).toBe(htmlText);
    expect(result.bodyText).toBe(plainText);
  });

  it("safely extracts email from various From/To header formats", () => {
    expect(extractEmail("FZ Build Solutions <contato@fzbuild.solutions>")).toBe(
      "contato@fzbuild.solutions",
    );
    expect(extractEmail("diretoria@cliente.com.br")).toBe(
      "diretoria@cliente.com.br",
    );
    expect(extractEmail("")).toBe("");
    expect(extractEmail(null)).toBe("");
    expect(extractEmail(undefined)).toBe("");
  });
});
