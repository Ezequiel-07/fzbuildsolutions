"use client";

import { UserNav } from "./user-nav";
import { ThemeSwitcher } from "./theme-switcher";
import { TenantSwitcher } from "./tenant-switcher";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-4">
          <TenantSwitcher />
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <ThemeSwitcher />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
