import { NextResponse } from "next/server";
import { saveGoogleOAuthTokens } from "@/features/inbox/services/gmail-service";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error || !code) {
    console.warn("[GOOGLE_CALLBACK_DENIED]", error);
    return NextResponse.redirect(
      new URL("/os/inbox?auth_error=denied", req.url),
    );
  }

  try {
    await saveGoogleOAuthTokens(code);
    return NextResponse.redirect(new URL("/os/inbox?connected=true", req.url));
  } catch (err: unknown) {
    console.error("[GOOGLE_CALLBACK_ERROR]", err);
    return NextResponse.redirect(
      new URL("/os/inbox?auth_error=failed", req.url),
    );
  }
}
