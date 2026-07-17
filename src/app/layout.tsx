import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Hanken_Grotesk } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FZ Build Solutions — Intelligent Software Ecosystems",
  description:
    "A FZ Build Solutions desenvolve plataformas SaaS, IA, automação e soluções sob medida para empresas que precisam eliminar retrabalho e tomar decisões com dados confiáveis.",
  keywords: [
    "software",
    "SaaS",
    "inteligência artificial",
    "automação",
    "DP Core",
    "FZ Build",
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "FZ Build Solutions",
    description: "Transformamos processos complexos em software inteligente.",
    siteName: "FZ Build Solutions",
    locale: "pt_BR",
    type: "website",
  },
};

import { AppProviders } from "@/providers";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head></head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${hankenGrotesk.variable} antialiased`}
      >
        <AppProviders>
          {children}
          <Toaster />
        </AppProviders>
      </body>
    </html>
  );
}
