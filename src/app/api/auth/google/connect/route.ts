import { NextResponse } from "next/server";
import { generateGoogleAuthUrl } from "@/features/inbox/services/gmail-service";

export async function GET(req: Request) {
  try {
    const reqUrl = new URL(req.url);
    const returnUrl =
      reqUrl.searchParams.get("returnUrl") || "/os/finance/transactions";
    const url = generateGoogleAuthUrl(returnUrl);
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
