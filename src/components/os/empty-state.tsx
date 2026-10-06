import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** Empty state with icon, message and an optional call to action. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  compact = false,
}: {
  icon?: LucideIcon;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed border-os-border text-center",
        compact ? "gap-1.5 px-4 py-6" : "gap-3 px-6 py-14",
        className,
      )}
    >
      {Icon && (
        <div
          className={cn(
            "flex items-center justify-center rounded-full bg-os-surface-2 text-os-subtle",
            compact ? "size-8" : "size-11",
          )}
        >
          <Icon className={compact ? "size-4" : "size-5"} aria-hidden />
        </div>
      )}
      <div className="space-y-1">
        <p
          className={cn(
            "font-medium text-os-fg",
            compact ? "text-xs" : "text-sm",
          )}
        >
          {title}
        </p>
        {description && (
          <p className="mx-auto max-w-sm text-xs text-os-muted">
            {description}
          </p>
        )}
      </div>
      {action && <div className="pt-1">{action}</div>}
    </div>
  );
}

/** Inline error state with retry. */
export function ErrorState({
  title = "Não foi possível carregar os dados",
  description,
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-2 rounded-lg border border-os-danger/30 bg-os-danger/5 px-6 py-10 text-center"
    >
      <p className="text-sm font-medium text-os-danger">{title}</p>
      {description && (
        <p className="max-w-md text-xs text-os-muted">{description}</p>
      )}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-1 text-xs font-medium text-os-fg underline underline-offset-4 hover:text-os-primary"
        >
          Tentar novamente
        </button>
      )}
    </div>
  );
}
