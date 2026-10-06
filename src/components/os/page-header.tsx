import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

/** Standard page header: title, optional description/meta/breadcrumbs and actions. */
export function PageHeader({
  title,
  description,
  meta,
  badge,
  breadcrumbs,
  actions,
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  badge?: React.ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  actions?: React.ReactNode;
  className?: string;
}) {
  const displayMeta = meta ?? badge;

  return (
    <header
      className={cn(
        "flex flex-col gap-4 pb-6 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0 space-y-1">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-os-muted mb-1"
          >
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && (
                  <ChevronRight className="size-3 shrink-0 opacity-50" />
                )}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="hover:text-os-fg transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-os-fg font-medium truncate">
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="truncate text-xl font-semibold tracking-tight text-os-fg md:text-2xl">
            {title}
          </h1>
          {displayMeta}
        </div>
        {description && <p className="text-sm text-os-muted">{description}</p>}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      )}
    </header>
  );
}
