"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Endereço de e-mail inválido"),
  password: z.string().min(1, "A senha é obrigatória"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
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

  return (
    <main className="min-h-screen w-full flex items-center justify-center relative p-4 md:p-8 font-sans bg-[#f8f9fb] overflow-hidden select-none">
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[60%] rounded-full bg-cyan-200/20 blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[50%] h-[70%] rounded-full bg-blue-200/30 blur-[140px]" />
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
          {/* Brand Header */}
          <div className="flex items-center gap-3">
            <Image
              src="/fzbuildsemfundo.png"
              alt="FZ Build Solutions"
              width={48}
              height={48}
              className="h-12 w-auto"
            />
          </div>

          <div className="flex-grow flex flex-col justify-center my-8 md:my-0">
            <div className="mb-8">
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
                disabled={isSubmitting}
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
