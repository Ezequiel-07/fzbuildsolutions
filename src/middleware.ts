import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// A simple in-memory rate limiter cache for edge/node middleware environments
const rateLimitCache = new Map<string, { count: number; resetTime: number }>();

export default function middleware(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const url = req.nextUrl;
  const isAuthRoute = url.pathname.startsWith("/login");

  // Basic Rate Limiting
  if (isAuthRoute) {
    const limit = 60; // 60 requests per minute
    const windowMs = 60 * 1000;
    const now = Date.now();
    const clientKey = `${ip}:${url.pathname}`;
    const rateData = rateLimitCache.get(clientKey);

    if (!rateData || now > rateData.resetTime) {
      rateLimitCache.set(clientKey, { count: 1, resetTime: now + windowMs });
    } else {
      rateData.count++;
      if (rateData.count > limit) {
        return new NextResponse("Too many requests, please try again later.", {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((rateData.resetTime - now) / 1000)),
          },
        });
      }
    }
  }

  // NOTE: Firebase Auth is client-side primarily, or via session cookies.
  // Full protection will be implemented on the client or via server-side verification in a later step.

  // Security Headers
  const response = NextResponse.next();

  // CSP: Allow self, Google fonts, inline scripts for Framer Motion / next.js hydration, and images
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://apis.google.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' data: https://images.unsplash.com https://*.googleusercontent.com https://firebasestorage.googleapis.com https://*.firebasestorage.googleapis.com;
    media-src 'self';
    connect-src 'self' https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://*.googleapis.com wss://*.firebaseio.com https://*.firebaseio.com;
    frame-src 'self' https://www.google.com/recaptcha/ https://recaptcha.google.com/;
    frame-ancestors 'none';
    object-src 'none';
  `
    .replace(/\s{2,}/g, " ")
    .trim();

  response.headers.set("Content-Security-Policy", cspHeader);
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload",
  );

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|mp4)$).*)",
  ],
};
