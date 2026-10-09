import { describe, it, expect } from "vitest";
import { loginSchema } from "./components/login-form";

function mapFirebaseAuthError(errorCode: string): string {
  switch (errorCode) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Credenciais inválidas ou usuário não cadastrado.";
    case "auth/user-disabled":
      return "Esta conta de usuário foi desativada pelo administrador.";
    case "auth/too-many-requests":
      return "Muitas tentativas sem sucesso. Aguarde alguns instantes antes de tentar novamente.";
    case "auth/network-request-failed":
      return "Falha de rede. Verifique sua conexão com a internet.";
    default:
      return "Ocorreu um erro ao realizar login. Tente novamente mais tarde.";
  }
}

describe("Login Flow & Authentication Validation", () => {
  it("validates correct email and non-empty password", () => {
    const validData = {
      email: "diretoria@fzbuild.solutions",
      password: "MinhaSenhaForte2026!",
    };

    const parsed = loginSchema.safeParse(validData);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.email).toBe(validData.email);
    }
  });

  it("rejects invalid email formats", () => {
    const invalidEmails = [
      "notanemail",
      "user@",
      "@domain.com",
      "user@domain",
      "",
    ];

    for (const email of invalidEmails) {
      const parsed = loginSchema.safeParse({
        email,
        password: "ValidPassword123",
      });
      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        expect(parsed.error.errors[0].path).toContain("email");
      }
    }
  });

  it("rejects empty password", () => {
    const parsed = loginSchema.safeParse({
      email: "admin@fzbuild.solutions",
      password: "",
    });

    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.errors[0].path).toContain("password");
      expect(parsed.error.errors[0].message).toBe("A senha é obrigatória");
    }
  });

  it("maps Firebase Auth errors to user-friendly Portuguese messages", () => {
    expect(mapFirebaseAuthError("auth/invalid-credential")).toBe(
      "Credenciais inválidas ou usuário não cadastrado.",
    );
    expect(mapFirebaseAuthError("auth/user-disabled")).toBe(
      "Esta conta de usuário foi desativada pelo administrador.",
    );
    expect(mapFirebaseAuthError("auth/too-many-requests")).toBe(
      "Muitas tentativas sem sucesso. Aguarde alguns instantes antes de tentar novamente.",
    );
    expect(mapFirebaseAuthError("auth/network-request-failed")).toBe(
      "Falha de rede. Verifique sua conexão com a internet.",
    );
    expect(mapFirebaseAuthError("unknown/error")).toBe(
      "Ocorreu um erro ao realizar login. Tente novamente mais tarde.",
    );
  });
});
