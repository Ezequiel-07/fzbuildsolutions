"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/features/layout/components/header";
import Link from "next/link";

export default function OSLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMainDashboard = pathname === "/os";

  return (
    <div className="relative flex min-h-screen flex-col">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover z-[-1] pointer-events-none"
      >
        <source src="/videodashboardfundo.mp4" type="video/mp4" />
      </video>

      {isMainDashboard ? (
        <div className="flex-1">{children}</div>
      ) : (
        <>
          <Header />
          <div className="flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1fr)]">
            <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block border-r bg-background/40 backdrop-blur-md">
              <div className="py-6 px-4">
                <div className="mb-4 px-4">
                  <img
                    src="/fzbuildsemfundo.png"
                    alt="FZ OS"
                    className="h-8 w-auto"
                  />
                </div>
                <div className="space-y-1">
                  <nav className="flex flex-col gap-1 px-2">
                    <Link
                      className="group flex w-full items-center rounded-md border border-transparent px-2 py-1 text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                      href="/os"
                    >
                      Dashboard
                    </Link>
                    <Link
                      className="group flex w-full items-center rounded-md border border-transparent px-2 py-1 text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                      href="/os/projects"
                    >
                      Projetos
                    </Link>
                    <Link
                      className="group flex w-full items-center rounded-md border border-transparent px-2 py-1 text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                      href="/os/crm"
                    >
                      CRM
                    </Link>
                    <Link
                      className="group flex w-full items-center rounded-md border border-transparent px-2 py-1 text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                      href="/os/finance"
                    >
                      Financeiro
                    </Link>
                    <Link
                      className="group flex w-full items-center rounded-md border border-transparent px-2 py-1 text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                      href="/os/admin"
                    >
                      Configurações
                    </Link>
                  </nav>
                </div>
              </div>
            </aside>
            <main className="flex w-full flex-col overflow-hidden p-4 md:p-8">
              {children}
            </main>
          </div>
        </>
      )}
    </div>
  );
}
