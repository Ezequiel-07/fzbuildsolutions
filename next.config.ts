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

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/v0/b/fz-build-solutions.firebasestorage.app/o/**",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
    ],
  },

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
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.googleapis.com https://*.firebaseapp.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://firebasestorage.googleapis.com https://i.pravatar.cc; connect-src 'self' https://*.googleapis.com wss://*.firebaseio.com https://*.firebaseio.com https://fonts.gstatic.com;",
          },
        ],
      },
    ];
  },
  // Prevent Firebase App Hosting from activating Pages Router
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,
};

export default withSerwist(nextConfig);
