import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center space-y-4 bg-background text-foreground">
      <h2 className="text-4xl font-bold text-slate-800">
        404 - Página Não Encontrada
      </h2>
      <p className="text-slate-500">O recurso solicitado não foi encontrado.</p>
      <Link
        href="/os"
        className="mt-4 rounded-md bg-[#003d9b] px-4 py-2 text-white hover:bg-[#003280]"
      >
        Voltar ao Dashboard
      </Link>
    </div>
  );
}
