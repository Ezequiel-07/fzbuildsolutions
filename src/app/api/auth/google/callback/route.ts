import { NextResponse } from "next/server";
import { saveGoogleOAuthTokens } from "@/features/inbox/services/gmail-service";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  const state = url.searchParams.get("state") || "/os/inbox";

  // Build target URL safely based on state parameter
  const targetPath = state.startsWith("/") ? state : "/os/inbox";
  const targetUrl = new URL(targetPath, req.url);

  if (error || !code) {
    console.warn("[GOOGLE_CALLBACK_DENIED]", error);
    targetUrl.searchParams.set("auth_error", "denied");
    return NextResponse.redirect(targetUrl);
  }

  try {
    await saveGoogleOAuthTokens(code);
    targetUrl.searchParams.set("connected", "true");
    return NextResponse.redirect(targetUrl);
  } catch (err: unknown) {
    console.error("[GOOGLE_CALLBACK_ERROR]", err);
    targetUrl.searchParams.set("auth_error", "failed");
    return NextResponse.redirect(targetUrl);
  }
}
