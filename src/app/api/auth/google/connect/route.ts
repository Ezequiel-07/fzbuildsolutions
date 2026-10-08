import { NextResponse } from "next/server";
import { generateGoogleAuthUrl } from "@/features/inbox/services/gmail-service";

export async function GET(req: Request) {
  try {
    const reqUrl = new URL(req.url);
    const returnUrl =
      reqUrl.searchParams.get("returnUrl") ||
      (reqUrl.searchParams.has("inbox")
        ? "/os/inbox"
        : "/os/finance/transactions");

    // Dynamic redirect URI:
    // If accessing on localhost or 127.0.0.1, use http
    // For all public production domains (e.g. fzbuild.solutions), MUST always use https
    const host = req.headers.get("x-forwarded-host") || reqUrl.host;
    const isLocal = host.includes("localhost") || host.includes("127.0.0.1");
    const proto = isLocal ? "http" : "https";

    let dynamicRedirectUri = `${proto}://${host}/api/auth/google/callback`;
    if (!isLocal && !dynamicRedirectUri.startsWith("https://")) {
      dynamicRedirectUri = `https://${host}/api/auth/google/callback`;
    }

    const url = generateGoogleAuthUrl(returnUrl, dynamicRedirectUri);
    return NextResponse.redirect(url);
  } catch (error: unknown) {
    console.error("[GOOGLE_CONNECT_ERROR]", error);
    // If credentials are not configured, redirect back with notice
    const reqUrl = new URL(req.url);
    const returnUrl = reqUrl.searchParams.get("returnUrl") || "/os/inbox";
    const fallbackUrl = new URL(returnUrl, req.url);
    fallbackUrl.searchParams.set("auth_error", "credentials_missing");
    return NextResponse.redirect(fallbackUrl);
  }
}
