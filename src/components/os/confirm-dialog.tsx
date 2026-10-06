"use client";

import * as React from "react";
import { AlertDialog } from "@base-ui/react/alert-dialog";
import { Loader2 } from "lucide-react";
import { buttonVariants } from "./button";
import { cn } from "@/lib/utils";

/**
 * Accessible confirmation dialog (focus trap, ESC, aria) — replaces
 * `window.confirm` across the OS.
 */
export function ConfirmDialog({
  open,
  isOpen,
  onOpenChange,
  onClose,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  tone = "danger",
  loading,
  isLoading,
  onConfirm,
}: {
  open?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "primary";
  loading?: boolean;
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
}) {
  const isCurrentlyOpen = open ?? isOpen ?? false;
  const isBusy = loading ?? isLoading ?? false;

  const handleOpenChange = (next: boolean) => {
    if (onOpenChange) onOpenChange(next);
    if (!next && onClose) onClose();
  };

  return (
    <AlertDialog.Root open={isCurrentlyOpen} onOpenChange={handleOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop className="fixed inset-0 z-[110] bg-black/50 backdrop-blur-[2px] transition-opacity duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <AlertDialog.Popup className="fixed left-1/2 top-1/2 z-[111] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-[14px] border border-os-border bg-os-surface p-5 shadow-2xl outline-none transition-all duration-150 data-[ending-style]:scale-95 data-[starting-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0">
          <AlertDialog.Title className="text-base font-semibold text-os-fg">
            {title}
          </AlertDialog.Title>
          {description && (
            <AlertDialog.Description className="mt-2 text-sm text-os-muted">
              {description}
            </AlertDialog.Description>
          )}
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <AlertDialog.Close
              className={buttonVariants({ variant: "secondary" })}
              disabled={isBusy}
              onClick={() => onClose?.()}
            >
              {cancelLabel}
            </AlertDialog.Close>
            <button
              type="button"
              disabled={isBusy}
              onClick={() => void onConfirm()}
              className={cn(
                buttonVariants({
                  variant: tone === "danger" ? "danger" : "primary",
                }),
              )}
            >
              {isBusy && <Loader2 className="animate-spin" aria-hidden />}
              {confirmLabel}
            </button>
          </div>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
