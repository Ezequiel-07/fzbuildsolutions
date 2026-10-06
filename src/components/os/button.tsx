import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * FZ OS Button — Tailwind v3 compatible, driven by `os-*` tokens.
 * Supports children, leadingIcon, and trailingIcon.
 */
export const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-[13px] font-medium transition-colors duration-150 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-os-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-os-bg disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-os-primary text-os-primary-fg shadow-sm hover:bg-os-primary-hover",
        secondary:
          "border border-os-border bg-os-surface text-os-fg shadow-sm hover:bg-os-surface-2 hover:border-os-border-strong",
        ghost: "text-os-muted hover:bg-os-surface-2 hover:text-os-fg",
        danger: "bg-os-danger text-white shadow-sm hover:bg-os-danger/90",
        "danger-ghost":
          "text-os-muted hover:bg-os-danger/10 hover:text-os-danger",
      },
      size: {
        sm: "h-7 px-2.5 text-xs [&_svg]:size-3.5",
        md: "h-8 px-3",
        lg: "h-9 px-4 text-sm",
        icon: "size-8",
        "icon-sm": "size-7 [&_svg]:size-3.5",
      },
    },
    defaultVariants: { variant: "secondary", size: "md" },
  },
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    leadingIcon?: React.ReactNode;
    trailingIcon?: React.ReactNode;
  };

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      type = "button",
      leadingIcon,
      trailingIcon,
      children,
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {leadingIcon}
      {children}
      {trailingIcon}
    </button>
  ),
);
Button.displayName = "Button";

export function buttonClasses(
  opts: VariantProps<typeof buttonVariants> & { className?: string } = {},
) {
  return cn(
    buttonVariants({ variant: opts.variant, size: opts.size }),
    opts.className,
  );
}
