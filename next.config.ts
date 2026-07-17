import type { NextConfig } from "next";

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
  // Desabilitar timeout de geração estática de páginas
  staticPageGenerationTimeout: 0,
  // Configurações experimentais para melhor compatibilidade
  experimental: {
    esmExternals: false,
  },
};

export default nextConfig;
