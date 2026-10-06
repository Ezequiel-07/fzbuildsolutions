import { NextResponse } from "next/server";
import { generateGoogleAuthUrl } from "@/features/inbox/services/gmail-service";

export async function GET(req: Request) {
  try {
    const url = generateGoogleAuthUrl();
    return NextResponse.redirect(url);
  } catch (error: unknown) {
    console.error("[GOOGLE_CONNECT_ERROR]", error);
    // If credentials are not configured, redirect back to inbox with notice
    return NextResponse.redirect(
      new URL("/os/inbox?auth_error=credentials_missing", req.url),
    );
  }
}
