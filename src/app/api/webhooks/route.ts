import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Generic webhook receiver for external events (e.g. Stripe, Github, etc.)
  try {
    const payload = await req.json();
    const signature = req.headers.get("x-signature");

    if (!signature) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Process webhook...
    console.log("[WEBHOOK_RECEIVED]", payload);

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("[WEBHOOK_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
