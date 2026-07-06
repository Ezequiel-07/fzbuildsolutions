"use client";

export function usePermissions() {
  // TODO: Fetch user permissions from Firebase Auth claims or Firestore
  const permissions: string[] = [];
  const role = "USER";

  const hasPermission = (permission: string) => {
    return permissions.includes(permission);
  };

  const hasAnyPermission = (requiredPermissions: string[]) => {
    return requiredPermissions.some((p) => permissions.includes(p));
  };

  const hasAllPermissions = (requiredPermissions: string[]) => {
    return requiredPermissions.every((p) => permissions.includes(p));
  };

  return {
    permissions,
    role,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
}
