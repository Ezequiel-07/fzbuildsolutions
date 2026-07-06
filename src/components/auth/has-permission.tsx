"use client";

import { usePermissions } from "@/hooks/use-permissions";
import { ReactNode } from "react";

interface HasPermissionProps {
  permission: string | string[];
  requireAll?: boolean;
  children: ReactNode;
  fallback?: ReactNode;
}

export function HasPermission({
  permission,
  requireAll = false,
  children,
  fallback = null,
}: HasPermissionProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } =
    usePermissions();

  let isAllowed = false;

  if (Array.isArray(permission)) {
    isAllowed = requireAll
      ? hasAllPermissions(permission)
      : hasAnyPermission(permission);
  } else {
    isAllowed = hasPermission(permission);
  }

  if (!isAllowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
