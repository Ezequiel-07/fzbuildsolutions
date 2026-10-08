import { NextResponse } from "next/server";
import { saveGoogleOAuthTokens } from "@/features/inbox/services/gmail-service";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  const rawState = url.searchParams.get("state") || "";

  // Parse state: handles base64url JSON payload or simple string paths
  let returnUrl = "/os/inbox";
  let stateRedirectUri: string | undefined = undefined;

  if (rawState) {
    try {
      if (rawState.startsWith("/")) {
        returnUrl = rawState;
      } else {
        const decoded = Buffer.from(rawState, "base64url").toString("utf-8");
        const parsed = JSON.parse(decoded);
        if (parsed.returnUrl && typeof parsed.returnUrl === "string") {
          returnUrl = parsed.returnUrl;
        }
        if (parsed.redirectUri && typeof parsed.redirectUri === "string") {
          stateRedirectUri = parsed.redirectUri;
        }
      }
    } catch {
      if (rawState.startsWith("/")) {
        returnUrl = rawState;
      }
    }
  }

  // Compute detected fallback redirect URI from current request
  const host = req.headers.get("x-forwarded-host") || url.host;
  const proto =
    req.headers.get("x-forwarded-proto") ||
    (host.includes("localhost") || host.includes("127.0.0.1")
      ? "http"
      : "https");
  const detectedRedirectUri = `${proto}://${host}/api/auth/google/callback`;

  const finalRedirectUri = stateRedirectUri || detectedRedirectUri;

  // Build target URL safely based on state parameter
  const targetPath = returnUrl.startsWith("/") ? returnUrl : "/os/inbox";
  const targetUrl = new URL(targetPath, req.url);

  if (error || !code) {
    console.warn("[GOOGLE_CALLBACK_DENIED]", { error, codeReceived: !!code });
    targetUrl.searchParams.set("auth_error", error || "denied");
    return NextResponse.redirect(targetUrl);
  }

  try {
    await saveGoogleOAuthTokens(code, finalRedirectUri);
    targetUrl.searchParams.set("connected", "true");
    return NextResponse.redirect(targetUrl);
  } catch (err: unknown) {
    console.error("[GOOGLE_CALLBACK_ERROR]", err);
    targetUrl.searchParams.set("auth_error", "failed");
    return NextResponse.redirect(targetUrl);
  }
}
