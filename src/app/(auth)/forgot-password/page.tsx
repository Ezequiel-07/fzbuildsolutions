"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { sendPasswordResetEmail } from "firebase/auth";
import { toast } from "sonner";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/lib/firebase";
import { GalaxyParticles } from "@/components/ui/galaxy-particles";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      toast.error("Por favor, insira seu e-mail.");
      return;
    }
    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success(
        "E-mail de redefinição de senha enviado! Verifique sua caixa de entrada.",
      );
      router.push("/login");
    } catch (error: unknown) {
      console.error("Password Reset Error:", error);
      let errorMessage = "Ocorreu um erro ao enviar o e-mail de redefinição.";
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code: string }).code === "auth/user-not-found"
      ) {
        errorMessage = "Nenhum usuário encontrado com este e-mail.";
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center relative p-4 md:p-8 font-sans bg-[#0B1021] overflow-hidden select-none">
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <GalaxyParticles />
        <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[60%] rounded-full bg-cyan-600/20 blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[50%] h-[70%] rounded-full bg-blue-700/20 blur-[140px]" />
      </div>

      {/* Forgot Password Card */}
      <div className="relative z-10 w-full max-w-md bg-white/70 backdrop-blur-2xl rounded-2xl shadow-2xl overflow-hidden p-8 md:p-12 border border-slate-200/50">
        <div className="flex flex-col justify-center">
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <Image
                src="/fzbuildsemfundo.png"
                alt="FZ Console"
                width={48}
                height={48}
                className="h-12 w-auto"
              />
            </div>
            <h3 className="font-heading text-[28px] font-bold text-slate-900 mb-2 leading-tight">
              Esqueceu sua senha?
            </h3>
            <p className="text-slate-500 text-sm font-sans">
              Sem problemas. Insira seu e-mail e enviaremos um link para você
              redefinir sua senha.
            </p>
          </div>

          <form onSubmit={handlePasswordReset} className="space-y-6">
            <div className="space-y-2">
              <Label
                className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider"
                htmlFor="email"
              >
                Endereço de E-mail
              </Label>
              <div className="relative group">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#003d9b] transition-colors">
                  <Mail className="h-5 w-5" />
                </span>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white/80 outline-none focus:border-[#003d9b] focus:ring-4 focus:ring-blue-900/5 transition-all text-sm font-sans placeholder-slate-400 text-slate-800"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#003d9b] hover:bg-[#003280] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-900/20 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 text-sm font-sans"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Enviar link de redefinição"
              )}
            </Button>
          </form>

          <div className="text-center mt-8">
            <Link
              href="/login"
              className="text-sm font-bold text-[#003d9b] hover:underline underline-offset-4 decoration-2 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para o login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
