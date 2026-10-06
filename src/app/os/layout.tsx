"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/providers/auth-provider";
import { Sidebar } from "@/features/shell/sidebar";
import { Topbar } from "@/features/shell/topbar";
import { CommandPalette } from "@/features/shell/command-palette";
import { AiDrawer } from "@/features/shell/ai-drawer";
import { Loader2 } from "lucide-react";

export default function OSLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { loading } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-os-bg">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-7 w-7 animate-spin text-os-primary" />
          <span className="text-xs font-mono text-os-muted">
            Carregando FZ OS...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen bg-os-bg text-os-fg selection:bg-os-primary/20 selection:text-os-primary">
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Modular Sidebar */}
      <Sidebar
        pathname={pathname}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Layout Area */}
      <div
        className="relative z-10 flex-1 flex flex-col min-h-screen transition-all duration-200"
        style={{ marginLeft: collapsed ? 72 : 240 }}
      >
        {/* Modular Topbar */}
        <Topbar
          pathname={pathname}
          onOpenMobile={() => setMobileOpen(true)}
          onOpenCommand={() => setCommandOpen(true)}
          onOpenAi={() => setAiDrawerOpen(true)}
        />

        {/* Page Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Command Palette Modal (⌘K) */}
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />

      {/* FZ AI Assistant Drawer */}
      <AiDrawer open={aiDrawerOpen} onClose={() => setAiDrawerOpen(false)} />
    </div>
  );
}
