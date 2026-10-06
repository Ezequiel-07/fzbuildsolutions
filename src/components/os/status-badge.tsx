import * as React from "react";
import { cn } from "@/lib/utils";
import type { Tone } from "@/domain/tone";

const TONE_CLASSES: Record<Tone, { badge: string; dot: string }> = {
  neutral: {
    badge: "bg-os-surface-2 text-os-muted ring-os-border",
    dot: "bg-os-subtle",
  },
  info: {
    badge: "bg-os-info/10 text-os-info ring-os-info/20",
    dot: "bg-os-info",
  },
  success: {
    badge: "bg-os-success/10 text-os-success ring-os-success/20",
    dot: "bg-os-success",
  },
  warning: {
    badge: "bg-os-warning/10 text-os-warning ring-os-warning/25",
    dot: "bg-os-warning",
  },
  danger: {
    badge: "bg-os-danger/10 text-os-danger ring-os-danger/20",
    dot: "bg-os-danger",
  },
  accent: {
    badge: "bg-os-accent/10 text-os-accent ring-os-accent/25",
    dot: "bg-os-accent",
  },
};

export function StatusBadge({
  tone = "neutral",
  children,
  label,
  dot = true,
  dotOnly = false,
  size = "md",
  className,
}: {
  tone?: Tone;
  children?: React.ReactNode;
  label?: React.ReactNode;
  dot?: boolean;
  dotOnly?: boolean;
  size?: "sm" | "md";
  className?: string;
}) {
  const t = TONE_CLASSES[tone];
  const content = children ?? label;

  if (dotOnly) {
    return (
      <span
        aria-hidden
        className={cn(
          "inline-block rounded-full ring-2 ring-os-surface",
          size === "sm" ? "size-2" : "size-2.5",
          t.dot,
          className,
        )}
      />
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-md font-medium ring-1 ring-inset",
        size === "sm" ? "px-1.5 py-0.5 text-[11px]" : "px-2 py-0.5 text-xs",
        t.badge,
        className,
      )}
    >
      {dot && (
        <span aria-hidden className={cn("size-1.5 rounded-full", t.dot)} />
      )}
      {content}
    </span>
  );
}

export function StatusDot({
  tone = "neutral",
  className,
}: {
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block size-2 rounded-full",
        TONE_CLASSES[tone].dot,
        className,
      )}
    />
  );
}
