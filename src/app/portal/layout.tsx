"use client";

import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/40">
      <header className="sticky top-0 z-50 w-full border-b bg-background shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg tracking-tight">
              FZ Client Portal
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium hidden md:inline-block">
              Client
            </span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              Log out
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-8 px-4 md:px-6">{children}</main>
    </div>
  );
}
