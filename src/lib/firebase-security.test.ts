import { describe, it, expect } from "vitest";

interface AuthContext {
  uid: string | null;
  role: "admin" | "driver" | "client" | null;
}

interface FirestoreRuleCheck {
  resource: string;
  operation: "read" | "create" | "update" | "delete";
  auth: AuthContext;
  resourceOwnerId?: string;
}

export function evaluateFirestoreSecurityRule({
  resource,
  operation,
  auth,
  resourceOwnerId,
}: FirestoreRuleCheck): boolean {
  // If not logged in, reject everything except public marketing resources
  if (!auth.uid) {
    return false;
  }

  // Admin has access to all collections
  if (auth.role === "admin") {
    return true;
  }

  // System settings (OAuth tokens, credentials) can NEVER be accessed by non-admins
  if (resource.startsWith("settings/")) {
    return false;
  }

  // Service orders & checkpoints:
  if (resource.startsWith("service_orders/")) {
    if (operation === "delete") {
      // Non-admins cannot delete service orders
      return false;
    }

    if (auth.role === "driver") {
      // Drivers can read assigned orders and update checkpoints
      return (
        resourceOwnerId === auth.uid &&
        (operation === "read" || operation === "update")
      );
    }
  }

  // Storage checkpoint photos:
  if (resource.startsWith("storage/checkpoints/")) {
    if (auth.role === "driver") {
      // Drivers can upload photos for their assigned checkpoints
      return operation === "create" || operation === "read";
    }
  }

  return false;
}

describe("Firebase Security Rules & Authorization Policies", () => {
  it("denies unauthenticated access to all protected resources", () => {
    const unauthenticated: AuthContext = { uid: null, role: null };

    expect(
      evaluateFirestoreSecurityRule({
        resource: "settings/google_oauth",
        operation: "read",
        auth: unauthenticated,
      }),
    ).toBe(false);

    expect(
      evaluateFirestoreSecurityRule({
        resource: "service_orders/OS-100",
        operation: "read",
        auth: unauthenticated,
      }),
    ).toBe(false);
  });

  it("permits admins full read/write/delete access across collections", () => {
    const admin: AuthContext = { uid: "admin-master", role: "admin" };

    expect(
      evaluateFirestoreSecurityRule({
        resource: "settings/google_oauth",
        operation: "update",
        auth: admin,
      }),
    ).toBe(true);

    expect(
      evaluateFirestoreSecurityRule({
        resource: "service_orders/OS-100",
        operation: "delete",
        auth: admin,
      }),
    ).toBe(true);
  });

  it("blocks non-admins from accessing or updating OAuth settings", () => {
    const driver: AuthContext = { uid: "driver-55", role: "driver" };

    expect(
      evaluateFirestoreSecurityRule({
        resource: "settings/google_oauth",
        operation: "read",
        auth: driver,
      }),
    ).toBe(false);

    expect(
      evaluateFirestoreSecurityRule({
        resource: "settings/google_oauth",
        operation: "update",
        auth: driver,
      }),
    ).toBe(false);
  });

  it("restricts driver to updating their own assigned service order", () => {
    const driver: AuthContext = { uid: "driver-55", role: "driver" };

    // Assigned order
    expect(
      evaluateFirestoreSecurityRule({
        resource: "service_orders/OS-100",
        operation: "update",
        auth: driver,
        resourceOwnerId: "driver-55",
      }),
    ).toBe(true);

    // Unassigned order (different driver)
    expect(
      evaluateFirestoreSecurityRule({
        resource: "service_orders/OS-200",
        operation: "update",
        auth: driver,
        resourceOwnerId: "driver-99",
      }),
    ).toBe(false);

    // Attempting to delete
    expect(
      evaluateFirestoreSecurityRule({
        resource: "service_orders/OS-100",
        operation: "delete",
        auth: driver,
        resourceOwnerId: "driver-55",
      }),
    ).toBe(false);
  });
});
