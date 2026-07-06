"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Building } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
const tenants = [
  {
    label: "FZ Build Solutions",
    value: "fz-build-solutions",
  },
  {
    label: "Acme Corp",
    value: "acme-corp",
  },
];

export function TenantSwitcher({
  className,
}: React.HTMLAttributes<HTMLElement>) {
  const [open, setOpen] = React.useState(false);
  const [selectedTenant, setSelectedTenant] = React.useState<
    (typeof tenants)[0]
  >(tenants[0]);
  // In a real scenario, fetch tenants associated with session user

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a tenant"
            className={cn("w-[200px] justify-between", className)}
          />
        }
      >
        <Building className="mr-2 h-4 w-4" />
        {selectedTenant.label}
        <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]">
        {tenants.map((tenant) => (
          <DropdownMenuItem
            key={tenant.value}
            onSelect={() => {
              setSelectedTenant(tenant);
              setOpen(false);
            }}
            className="text-sm"
          >
            {tenant.label}
            <Check
              className={cn(
                "ml-auto h-4 w-4",
                selectedTenant.value === tenant.value
                  ? "opacity-100"
                  : "opacity-0",
              )}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
