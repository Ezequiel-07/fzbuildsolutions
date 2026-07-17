"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Header } from "@/features/layout/components/header";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  LayoutGrid,
  Users,
  Brain,
  Building2,
  HelpCircle,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";

export default function OSLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isMainDashboard = pathname === "/os";
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (err) {
      console.error("Logout Error:", err);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

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

      {/* Floating Left Sidebar for all internal pages */}
      <aside className="fixed left-0 top-1/2 -translate-y-1/2 flex flex-col items-center py-8 gap-8 z-40 bg-[#f3f4f6]/80 backdrop-blur-2xl w-20 rounded-r-2xl shadow-2xl border border-white/20 perspective-1000 -translate-x-[80%] opacity-20 hover:translate-x-0 hover:opacity-100 transition-all duration-500 justify-center">
        <div className="flex flex-col items-center gap-6 w-full px-2 justify-center">
          <Link
            href="/os"
            className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 shadow-sm border ${
              pathname === "/os"
                ? "bg-[#00e3fd]/20 text-[#00616d] border-[#00e3fd]/40 scale-110"
                : "text-slate-400 hover:scale-110 hover:text-[#003d9b] border-transparent"
            }`}
          >
            <LayoutGrid className="h-5 w-5" />
          </Link>

          <Link
            href="/os/projects"
            className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 shadow-sm border ${
              pathname.includes("/os/projects")
                ? "bg-[#00e3fd]/20 text-[#00616d] border-[#00e3fd]/40 scale-110"
                : "text-slate-400 hover:scale-110 hover:text-[#003d9b] border-transparent"
            }`}
          >
            <Users className="h-5 w-5" />
          </Link>

          <Link
            href="/os/crm"
            className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 shadow-sm border ${
              pathname.includes("/os/crm")
                ? "bg-[#00e3fd]/20 text-[#00616d] border-[#00e3fd]/40 scale-110"
                : "text-slate-400 hover:scale-110 hover:text-[#003d9b] border-transparent"
            }`}
          >
            <Brain className="h-5 w-5" />
          </Link>

          <Link
            href="/os/finance"
            className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 shadow-sm border ${
              pathname.includes("/os/finance")
                ? "bg-[#00e3fd]/20 text-[#00616d] border-[#00e3fd]/40 scale-110"
                : "text-slate-400 hover:scale-110 hover:text-[#003d9b] border-transparent"
            }`}
          >
            <Building2 className="h-5 w-5" />
          </Link>

          <div className="h-px w-8 bg-slate-300/40 my-2" />

          <Link
            href="/os/admin"
            className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 shadow-sm border ${
              pathname.includes("/os/admin")
                ? "bg-[#00e3fd]/20 text-[#00616d] border-[#00e3fd]/40 scale-110"
                : "text-slate-400 hover:scale-110 hover:text-[#003d9b] border-transparent"
            }`}
          >
            <HelpCircle className="h-5 w-5" />
          </Link>

          <button
            onClick={toggleTheme}
            className="w-12 h-12 flex items-center justify-center text-slate-400 transition-all duration-300 hover:scale-110 hover:text-amber-500 rounded-xl border border-transparent"
            aria-label="Alternar tema"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Alternar tema</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-12 h-12 flex items-center justify-center text-slate-400 transition-all duration-300 hover:scale-110 hover:text-red-600 rounded-xl border border-transparent"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </aside>

      {isMainDashboard ? (
        <div className="flex-1">{children}</div>
      ) : (
        <>
          <Header />
          <div className="flex-1 items-start flex">
            <main className="flex w-full flex-col overflow-hidden p-4 md:p-8">
              {children}
            </main>
          </div>
        </>
      )}
    </div>
  );
}
