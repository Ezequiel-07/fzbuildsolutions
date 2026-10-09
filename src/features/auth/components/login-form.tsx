"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { GalaxyParticles } from "@/components/ui/galaxy-particles";

export const loginSchema = z.object({
  email: z.string().email("Endereço de e-mail inválido"),
  password: z.string().min(1, "A senha é obrigatória"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const tiltRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Parallax effect for the visual side panel card
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!tiltRef.current) return;
      const moveX = (e.clientX - window.innerWidth / 2) * 0.015;
      const moveY = (e.clientY - window.innerHeight / 2) * 0.015;
      tiltRef.current.style.transform = `rotateY(${moveX}deg) rotateX(${-moveY}deg)`;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      router.push("/os");
    } catch (err) {
      console.error("Firebase Login Error:", err);
      setError("Credenciais inválidas ou usuário não cadastrado.");
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsGoogleSubmitting(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(auth, provider);
      router.push("/os");
    } catch (err: unknown) {
      console.error("Firebase Google Login Error:", err);
      const fbErr = err as { code?: string; message?: string };
      if (
        fbErr.code === "auth/popup-closed-by-user" ||
        fbErr.code === "auth/cancelled-popup-request"
      ) {
        return;
      }
      if (fbErr.code === "auth/operation-not-allowed") {
        setError(
          "Provedor Google ainda não ativado no Firebase Console (Authentication > Sign-in method > Google).",
        );
        return;
      }
      if (fbErr.code === "auth/unauthorized-domain") {
        setError(
          "Domínio não autorizado no Firebase Console (Authentication > Settings > Authorized domains).",
        );
        return;
      }
      setError("Erro ao autenticar com o Google. Tente novamente.");
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center relative p-4 md:p-8 font-sans bg-[#0B1021] overflow-hidden select-none">
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <GalaxyParticles />
        <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[60%] rounded-full bg-cyan-600/20 blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[50%] h-[70%] rounded-full bg-blue-700/20 blur-[140px]" />
        <div
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-repeat bg-center bg-cover pointer-events-none"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCrX-1zWUeGS8KyVA5wIWBliHRLL2e66VGj2BD61r_xlVhPvWjosnY0G5hARG65_BLCSI2Bwln-v8OxyfTsd5Hzy1PzhpsCaA9y15uGGiM6Jx3QykwH92h58LcIzt27SgKqI93XRf7iFBVfmIcmwA6SW6cLS6ugiXRPIMxEwuVwpoZnrH-q1zwSZyDv7qwJfaLwiOWZAfq5kku6aF8FCLrr4S3CSSx5_x5lc8cLOp7swrHKnqGXa7BP')",
          }}
        />
      </div>

      {/* Login Shell */}
      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 md:grid-cols-12 bg-white/70 backdrop-blur-2xl rounded-2xl shadow-2xl overflow-hidden min-h-[700px] border border-slate-200/50">
        {/* Visual Side Panel (Desktop only) */}
        <div className="hidden md:flex md:col-span-6 bg-white overflow-hidden relative items-center justify-center p-8 select-none border-r border-slate-200/70">
          <div
            className="relative z-10 flex flex-col items-center justify-center text-center max-w-md"
            style={{ perspective: "1000px" }}
          >
            <div
              ref={tiltRef}
              className="transform-gpu flex flex-col items-center"
              style={{
                transform: "rotateY(-5deg) rotateX(2deg)",
                transition: "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
              }}
            >
              <Image
                src="/fzbuild.png"
                alt="FZ Build Solutions"
                width={320}
                height={160}
                className="w-full max-w-[360px] h-auto"
              />
            </div>
          </div>
        </div>

        {/* Login Form Panel */}
        <div className="col-span-1 md:col-span-6 flex flex-col p-8 md:p-12 lg:p-16 bg-[#ffffff]/60 justify-between">
          <div className="flex-grow flex flex-col justify-center my-8 md:my-0">
            {/* Brand Header */}
            <div className="flex justify-center md:justify-start items-center mb-6">
              <Image
                src="/fzbuildsemfundo.png"
                alt="FZ Build Solutions"
                width={80}
                height={80}
                className="h-20 w-auto"
              />
            </div>

            <div className="mb-8 text-center md:text-left">
              <h3 className="font-heading text-[28px] font-bold text-slate-900 mb-2 leading-tight">
                Bem-vindo(a) de volta
              </h3>
              <p className="text-slate-500 text-sm font-sans">
                Insira suas credenciais para gerenciar seu ecossistema.
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl font-medium animate-shake">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label
                  className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider"
                  htmlFor="email"
                >
                  Endereço de E-mail
                </label>
                <div className="relative group">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#003d9b] transition-colors">
                    <Mail className="h-5 w-5" />
                  </span>
                  <input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white/80 outline-none focus:border-[#003d9b] focus:ring-4 focus:ring-blue-900/5 transition-all text-sm font-sans placeholder-slate-400 text-slate-800"
                    {...register("email")}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs font-semibold text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label
                    className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider"
                    htmlFor="password"
                  >
                    Senha
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-bold text-[#003d9b] hover:underline underline-offset-4 decoration-2"
                  >
                    Esqueceu a Senha?
                  </Link>
                </div>
                <div className="relative group">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#003d9b] transition-colors">
                    <Lock className="h-5 w-5" />
                  </span>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white/80 outline-none focus:border-[#003d9b] focus:ring-4 focus:ring-blue-900/5 transition-all text-sm font-sans placeholder-slate-400 text-slate-800"
                    {...register("password")}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.password && (
                  <p className="text-xs font-semibold text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-[#003d9b] hover:bg-[#003280] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-900/20 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 text-sm font-sans"
                disabled={isSubmitting || isGoogleSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Entrar
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divisor */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white/80 px-3 text-slate-400 font-mono text-[10px] tracking-wider font-semibold rounded-full">
                  ou continue com
                </span>
              </div>
            </div>

            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSubmitting || isGoogleSubmitting}
              className="w-full bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200/90 py-3 rounded-xl font-semibold shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center gap-3 text-sm font-sans active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isGoogleSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin text-[#003d9b]" />
              ) : (
                <>
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continuar com o Google</span>
                </>
              )}
            </button>
          </div>

          {/* Footer Text */}
          <div className="text-center mt-6">
            <Link
              href="/"
              className="text-slate-400 text-xs font-sans hover:text-[#003d9b] font-medium transition-colors"
            >
              ← Voltar para o site
            </Link>
          </div>
        </div>
      </div>

      {/* System Status Bar (Bottom) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-6 px-6 py-2 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/50 shadow-lg md:flex hidden">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#006875] animate-pulse" />
          <span className="font-mono text-[9px] font-bold text-slate-500 uppercase tracking-wider">
            Sistemas Principais Ativos
          </span>
        </div>
        <div className="w-px h-4 bg-slate-200" />
        <div className="flex items-center gap-2">
          <span className="font-mono text-[9px] font-bold text-slate-500 uppercase tracking-wider">
            Latência: 12ms
          </span>
        </div>
        <div className="w-px h-4 bg-slate-200" />
        <div className="flex items-center gap-2">
          <span className="font-mono text-[9px] font-bold text-slate-500 uppercase tracking-wider">
            Ecossistema v4.2.0
          </span>
        </div>
      </div>
    </main>
  );
}
