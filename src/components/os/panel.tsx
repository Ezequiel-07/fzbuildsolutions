import * as React from "react";
import { cn } from "@/lib/utils";

/** Solid surface card (80% rule: solid surface + 1px border). */
export function Panel({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[10px] border border-os-border bg-os-surface shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

export function PanelHeader({
  title,
  description,
  actions,
  icon,
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 border-b border-os-border px-4 py-3",
        className,
      )}
    >
      <div className="min-w-0">
        <h2 className="flex items-center gap-2 truncate text-sm font-semibold text-os-fg">
          {icon}
          <span>{title}</span>
        </h2>
        {description && (
          <p className="truncate text-xs text-os-muted">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-1.5">{actions}</div>}
    </div>
  );
}

export function ProgressBar({
  value,
  className,
  label,
}: {
  value: number;
  className?: string;
  label?: string;
}) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div
      role="progressbar"
      aria-valuenow={v}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn(
        "h-1.5 w-full overflow-hidden rounded-full bg-os-surface-2",
        className,
      )}
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-300",
          v >= 100 ? "bg-os-success" : "bg-os-primary",
        )}
        style={{ width: `${v}%` }}
      />
    </div>
  );
}
