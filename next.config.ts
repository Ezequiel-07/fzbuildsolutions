import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  // Recommended output for Firebase App Hosting
  output: "standalone",

  // Custom headers for Content Security Policy to allow Firebase Auth requests
  async headers() {
    return [
      {
        // Apply to all routes
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' https://*.googleapis.com https://*.firebaseapp.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;",
          },
        ],
      },
    ];
  },
  // Prevent Firebase App Hosting from activating Pages Router
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,
  // Désabilitar geração estática de páginas dinâmicas client-side
  dynamicIO: true,
};

export default withSerwist(nextConfig);
