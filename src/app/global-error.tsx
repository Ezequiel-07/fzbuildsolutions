"use client";

import { logger } from "@/lib/logger";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  logger.error({ error, digest: error.digest }, "Global unhandled error");

  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <div className="flex h-screen w-full flex-col items-center justify-center space-y-4 bg-background text-foreground">
          <h2 className="text-4xl font-bold text-slate-800">
            Algo deu errado!
          </h2>
          <p className="text-slate-500">Ocorreu um erro inesperado.</p>
          <button
            onClick={() => reset()}
            className="mt-4 rounded-md bg-[#003d9b] px-4 py-2 text-white hover:bg-[#003280]"
          >
            Tentar novamente
          </button>
        </div>
      </body>
    </html>
  );
}
