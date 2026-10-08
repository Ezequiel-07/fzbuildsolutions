import { NextResponse } from "next/server";
import {
  generateGoogleAuthUrl,
  getPublicBaseOrigin,
} from "@/features/inbox/services/gmail-service";

export async function GET(req: Request) {
  const baseOrigin = getPublicBaseOrigin(req);

  try {
    const reqUrl = new URL(req.url);
    const returnUrl =
      reqUrl.searchParams.get("returnUrl") ||
      (reqUrl.searchParams.has("inbox")
        ? "/os/inbox"
        : "/os/finance/transactions");

    // Dynamic redirect URI using public base origin (never container 0.0.0.0)
    const dynamicRedirectUri = `${baseOrigin}/api/auth/google/callback`;

    const url = generateGoogleAuthUrl(returnUrl, dynamicRedirectUri);
    return NextResponse.redirect(url);
  } catch (error: unknown) {
    console.error("[GOOGLE_CONNECT_ERROR]", error);
    // If credentials are not configured, redirect back with notice using public base origin
    const reqUrl = new URL(req.url);
    const returnUrl = reqUrl.searchParams.get("returnUrl") || "/os/inbox";
    const fallbackUrl = new URL(returnUrl, baseOrigin);
    fallbackUrl.searchParams.set("auth_error", "credentials_missing");
    return NextResponse.redirect(fallbackUrl);
  }
}
