"use client";

import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/providers/auth-provider";
import { Moon, Sun, LogOut } from "lucide-react";
import Link from "next/link";

export function UserProfileMenu({ collapsed }: { collapsed: boolean }) {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (err) {
      console.error("Logout Error:", err);
    }
  };

  const displayName =
    user?.displayName || user?.email?.split("@")[0] || "Ezequiel Antunes";
  const userInitials =
    displayName
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "EA";

  return (
    <div className="border-t border-os-border p-3 flex-shrink-0 space-y-2 bg-os-surface-2/40">
      {/* Profile Card */}
      <Link
        href="/os/admin/settings"
        className={`flex items-center gap-3 p-2 rounded-xl bg-os-surface border border-os-border hover:border-os-accent/40 transition-all group ${
          collapsed ? "justify-center" : ""
        }`}
      >
        <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-[#003D9B] to-[#00E3FD] p-[1.5px]">
          <div className="w-full h-full rounded-full bg-os-surface text-os-fg flex items-center justify-center font-bold text-xs">
            {userInitials}
          </div>
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-os-fg truncate">
              {displayName}
            </p>
            <p className="text-[10px] text-os-muted truncate">
              {user?.email || "Administrador"}
            </p>
          </div>
        )}
      </Link>

      {/* Quick Actions (Theme & Logout) */}
      <div
        className={`flex items-center ${collapsed ? "flex-col" : "justify-between"} gap-1 pt-1`}
      >
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="p-2 rounded-xl text-os-muted hover:bg-os-surface-2 hover:text-os-fg transition-colors"
          title="Alternar tema"
          aria-label="Alternar tema"
        >
          <div className="relative h-4 w-4">
            <Sun className="h-4 w-4 absolute rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
            <Moon className="h-4 w-4 absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-cyan-400" />
          </div>
        </button>

        {!collapsed && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-os-success/10 text-os-success border border-os-success/20 text-[10px] font-mono font-medium">
            <div className="w-1.5 h-1.5 rounded-full bg-os-success animate-pulse" />
            <span>ONLINE</span>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="p-2 rounded-xl text-os-muted hover:bg-os-danger/10 hover:text-os-danger transition-colors"
          title="Sair do sistema"
          aria-label="Sair do sistema"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
