"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

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

  // Auto-seed a developer account in Firebase Auth
  useEffect(() => {
    const seedDevAccount = async () => {
      try {
        const { createUserWithEmailAndPassword } =
          await import("firebase/auth");
        await createUserWithEmailAndPassword(
          auth,
          "admin@fzbuild.solutions",
          "admin123",
        );
        console.log("Registered test account successfully");
      } catch (err) {
        // Ignored if already registered
        console.log("Test account setup:", err);
      }
    };
    seedDevAccount();
  }, []);

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      router.push("/os");
      router.refresh();
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
        <div className="hidden md:flex md:col-span-6 bg-[#003d9b] overflow-hidden relative items-center justify-center p-8 select-none">
          <div className="absolute inset-0 z-0">
            <div
              className="w-full h-full opacity-60 mix-blend-overlay bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA7eegFNod2V8g77GzbOzWZurAFYk8ScEkAMn5b-u28OvASuK28RUR36cJxlGIlJeGGkrcAB0J4bHHcvz0xpEhWgEEpIIEHmRFEqOgA8VNyA3E6XTMz6Ypl6FMmYFCtdxoi_DkTA3PSllIdEpBFOpA6n2A0RONkabq9FBemnTvTNkaglNu1SYvnJzKhKQJIVezO1N0u9ByxmzWDjtZKDjqazTU2giR6v3SWMoF2H9SPnsGbRNwLBiIy')",
              }}
            />
          </div>

          <div
            className="relative z-10 text-white max-w-md"
            style={{ perspective: "1000px" }}
          >
            <div
              ref={tiltRef}
              className="transform-gpu"
              style={{
                transform: "rotateY(-5deg) rotateX(2deg)",
                transition: "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
              }}
            >
              <h2 className="font-heading text-[44px] font-extrabold tracking-tight leading-[1.1] mb-6">
                Construindo Ecossistemas do Futuro
              </h2>
              <p className="text-lg text-white/80 font-normal leading-relaxed mb-8 font-sans">
                Acesse a plataforma de gestão mais avançada do mundo para
                empresas inovadoras.
              </p>

              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
                <div className="w-12 h-12 rounded-full bg-[#00e3fd]/20 flex items-center justify-center text-[#9cf0ff]">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-white/70">
                    Dados do Ecossistema ao Vivo
                  </p>
                  <p className="text-base font-bold font-sans">
                    2.4k Conexões Ativas
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Abstract Decorative Overlay */}
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#00e3fd]/10 blur-3xl rounded-full translate-x-1/2 translate-y-1/2" />
        </div>

        {/* Login Form Panel */}
        <div className="col-span-1 md:col-span-6 flex flex-col p-8 md:p-12 lg:p-16 bg-[#ffffff]/60 justify-between">
          {/* Brand Header */}
          <div className="flex items-center gap-3">
            <img
              src="/fzbuildsemfundo.png"
              alt="FZ Build Solutions"
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
                    href="#"
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

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200/60" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white/80 px-4 font-mono text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  OU CONTINUAR COM
                </span>
              </div>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="flex items-center justify-center gap-3 py-3 px-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all duration-200 font-sans text-sm font-semibold active:scale-[0.98] bg-white/80 text-slate-700"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-5.38z"
                    fill="#EA4335"
                  />
                </svg>
                <span>Google</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-3 py-3 px-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all duration-200 font-sans text-sm font-semibold active:scale-[0.98] bg-white/80 text-slate-700"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                <span>GitHub</span>
              </button>
            </div>
          </div>

          {/* Footer Text */}
          <div className="text-center mt-6">
            <p className="text-slate-400 text-xs font-sans mb-3">
              Modo de teste:{" "}
              <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 select-all font-semibold">
                admin@fzbuild.solutions
              </span>{" "}
              / senha:{" "}
              <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 select-all font-semibold">
                admin123
              </span>
            </p>
            <p className="text-slate-400 text-xs font-sans">
              Não tem uma conta?{" "}
              <Link
                href="#"
                className="text-[#003d9b] font-bold hover:underline underline-offset-4 decoration-2"
              >
                Cadastre-se grátis
              </Link>
            </p>
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
